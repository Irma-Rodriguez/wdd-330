import { getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }
    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails();

        document.getElementById('addToCart')
            .addEventListener('click', this.addProductToCart.bind(this));
    }
    addProductToCart() {
      let cartItems = getLocalStorage("so-cart") || [];
      const existingItem = cartItems.find(
        (item) => String(item.Id) === String(this.product.Id)
      );

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        this.product.quantity = 1;
        cartItems.push(this.product);
      }

      setLocalStorage("so-cart", cartItems);

      const cartIcon = document.querySelector(".cart-icon");

      if (cartIcon) {
        cartIcon.classList.remove("cart-icon--animate");

        // Force the browser to restart the animation
        void cartIcon.offsetWidth;

        cartIcon.classList.add("cart-icon--animate");

        cartIcon.addEventListener(
          "animationend",
          () => {
            cartIcon.classList.remove("cart-icon--animate");
          },
          { once: true }
        );
      }

      alertMessage("Product added to your cart.", false);
    }


    renderProductDetails() {
        document.querySelector(".product-detail").innerHTML = `
      <h3>${this.product.Brand.Name}</h3>

      <h2 class="divider">${this.product.NameWithoutBrand}</h2>

      <img
        class="divider"
        src="${this.product.Images.PrimaryLarge}"
        alt="${this.product.Name}"
      />

      <p class="product-card__price">$${this.product.FinalPrice}</p>

      <p class="product__color">${this.product.Colors[0].ColorName}</p>

      <p class="product__description">
        ${this.product.DescriptionHtmlSimple}
      </p>

      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">
          Add to Cart
        </button>
      </div>
    `;
    }
}