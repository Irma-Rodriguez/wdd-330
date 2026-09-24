import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter();

const checkout = new CheckoutProcess(
    'so-cart',
    '.products'
);

checkout.init();

const zipInput = document.querySelector('#zip');

zipInput.addEventListener('blur', () => {
    checkout.calculateOrderTotal();
});