import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
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

  return newItem;
}

function removeFromCart(event) {
  if (!event.target.classList.contains("remove-item")) {
    return;
  }

  const productId = event.target.dataset.id;

  const cartItems = getLocalStorage("so-cart");

  const updatedCart = cartItems.filter((item) => item.Id !== productId);

  setLocalStorage("so-cart", updatedCart);

  renderCartContents();
}

document
  .querySelector(".product-list")
  .addEventListener("click", removeFromCart);

renderCartContents();
