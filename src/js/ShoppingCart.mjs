import { getLocalStorage, setLocalStorage, renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
    return `<li class="cart-card divider">
    <button class="remove-item" data-id="${item.Id}" type="button">X</button>
    <a href="#" class="cart-card__image">
      <img
        src="${item.Image}"
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

export default class ShoppingCart {
    constructor(listElement) {
        this.listElement = listElement;
        this.cartItems = [];
    }

    init() {
        this.cartItems = getLocalStorage("so-cart") || [];
        this.renderCart();
        this.listElement.addEventListener("click", this.removeFromCart.bind(this));
    }

    renderCart() {
        renderListWithTemplate(
            cartItemTemplate,
            this.listElement,
            this.cartItems,
            "afterbegin",
            true,
        );

        this.renderTotal();
    }

    renderTotal() {
        if (this.cartItems.length > 0) {
            const cartFooter = document.querySelector(".cart-footer");
            cartFooter.classList.remove("hide");

            const total = this.cartItems.reduce(
                (sum, item) => sum + Number(item.FinalPrice),
                0,
            );

            document.querySelector(".cart-total").innerHTML =
                `Total: $${total.toFixed(2)}`;
        }
    }

    removeFromCart(event) {
        if (!event.target.classList.contains("remove-item")) {
            return;
        }

        const productId = event.target.dataset.id;

        this.cartItems = this.cartItems.filter(
            (item) => item.Id !== productId,
        );

        setLocalStorage("so-cart", this.cartItems);

        this.renderCart();
    }
}