import { loadHeaderFooter } from './utils.mjs';
import ShoppingCart from './ShoppingCart.mjs';

loadHeaderFooter();

const cart = new ShoppingCart(document.querySelector('.cart-list'));

cart.init();
