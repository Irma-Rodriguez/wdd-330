import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", ".products");

checkout.init();

const zipInput = document.querySelector("#zip");

zipInput.addEventListener("blur", () => {
  checkout.calculateOrderTotal();
});

const form = document.querySelector("#checkout-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  await checkout.checkout(form);
});
