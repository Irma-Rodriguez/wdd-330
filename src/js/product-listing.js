import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");

const titleElement = document.querySelector("#product-title");

const categoryName = category
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");

titleElement.textContent = `Top Products: ${categoryName}`;

const dataSource = new ExternalServices();

const listElement = document.querySelector(".product-list");

const myList = new ProductList(category, dataSource, listElement);

myList.init();

const sortSelect = document.querySelector("#sort-select");

sortSelect.addEventListener("change", (event) => {
  myList.sortList(event.target.value);
});
