import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};

    formData.forEach((value, key) => {
        convertedJSON[key] = value;
    });

    return convertedJSON;
}

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
        this.dataSource = new ExternalServices();
    }

    init() {
        this.list = getLocalStorage(this.key) || [];
        this.calculateItemSubTotal();
    }

    calculateItemSubTotal() {
        this.itemTotal = this.list.reduce(
            (sum, item) =>
                sum + Number(item.FinalPrice) * (item.quantity || 1),
            0
        );

        const subtotal = document.querySelector(
            `${this.outputSelector} #subtotal`
        );

        subtotal.innerText = `$${this.itemTotal.toFixed(2)}`;
    }

    calculateOrderTotal() {
        this.tax = this.itemTotal * 0.06;

        const itemCount = this.list.reduce(
            (sum, item) => sum + (item.quantity || 1),
            0
        );

        this.shipping =
            itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;

        this.orderTotal =
            this.itemTotal + this.tax + this.shipping;

        this.displayOrderTotals();
    }

    displayOrderTotals() {
        const tax = document.querySelector(
            `${this.outputSelector} #tax`
        );

        const shipping = document.querySelector(
            `${this.outputSelector} #shipping`
        );

        const orderTotal = document.querySelector(
            `${this.outputSelector} #order-total`
        );

        tax.innerText = `$${this.tax.toFixed(2)}`;
        shipping.innerText = `$${this.shipping.toFixed(2)}`;
        orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
    }

    packageItems(items) {
        return items.map((item) => ({
            id: item.Id,
            name: item.Name,
            price: Number(item.FinalPrice),
            quantity: item.quantity || 1,
        }));
    }

    async checkout(form) {
        const order = formDataToJSON(form);

        order.orderDate = new Date().toISOString();
        order.orderTotal = this.orderTotal.toFixed(2);
        order.tax = this.tax.toFixed(2);
        order.shipping = this.shipping;
        order.items = this.packageItems(this.list);

        return this.dataSource.checkout(order);
    }
}