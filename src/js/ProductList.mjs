import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    return `<li class="product-card">
        <a href="/product_pages/?product=${product.Id}">
            <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}">
            <h2 class="card__brand">${product.Brand.Name}</h2>
            <h3 class="card__name">${product.NameWithoutBrand}</h3>
            <p class="product-card__price">$${product.FinalPrice}</p>
        </a>
    </li>`
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
        this.list = [];
    }

    async init() {
        this.list = await this.dataSource.getData(this.category);
        console.log(this.list);
        this.renderList(this.list);
    }

    renderList(list) {
        this.listElement.innerHTML = '';
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }


    sortList(sortType) {
        const sortedList = [...this.list];

        switch (sortType) {
            case 'name-asc':
                sortedList.sort((a, b) =>
                    a.Name.localeCompare(b.Name)
                );
                break;

            case 'name-desc':
                sortedList.sort((a, b) =>
                    b.Name.localeCompare(a.Name)
                );
                break;

            case 'price-asc':
                sortedList.sort((a, b) =>
                    a.FinalPrice - b.FinalPrice
                );
                break;

            case 'price-desc':
                sortedList.sort((a, b) =>
                    b.FinalPrice - a.FinalPrice
                );
                break;

            default:
                break;
        }

        this.renderList(sortedList);
    }
}