import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';

loadHeaderFooter();

const category = getParam('category');

const titleElement = document.querySelector('#product-title');

const categoryName = category
  .split('-')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');

titleElement.textContent = `Top Products: ${categoryName}`;

const dataSource = new ExternalServices();

const listElement = document.querySelector('.product-list');

const myList = new ProductList(category, dataSource, listElement);

myList.init();

const sortSelect = document.querySelector('#sort-select');

sortSelect.addEventListener('change', (event) => {
  myList.sortList(event.target.value);
});

listElement.addEventListener('click', async (event) => {
  const quickViewButton = event.target.closest('.quick-view-button');

  if (!quickViewButton) {
    return;
  }

  event.preventDefault();

  const productId = quickViewButton.dataset.productId;

  try {
    const product = await dataSource.findProductById(productId);

    showQuickView(product);
  } catch (error) {
    alert('Unable to load product details. Please try again.');
  }
});

function showQuickView(product) {
  const modal = document.createElement('div');

  modal.classList.add('quick-view-modal');

  modal.innerHTML = `
    <div class="quick-view-content">
      <button 
        type="button" 
        class="quick-view-close"
        aria-label="Close quick view">
        &times;
      </button>

      <img 
        src="${product.Images.PrimaryMedium}" 
        alt="Image of ${product.Name}"
        class="quick-view-image">

      <div class="quick-view-info">
        <p class="quick-view-brand">${product.Brand.Name}</p>

        <h2>${product.Name}</h2>

        <p class="quick-view-price">
          $${product.FinalPrice}
        </p>

        <p class="quick-view-description">
          ${product.DescriptionHtmlSimple || product.Description}
        </p>

        <a 
          href="/product_pages/?product=${product.Id}"
          class="quick-view-details">
          View Full Details
        </a>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeButton = modal.querySelector('.quick-view-close');

  closeButton.addEventListener('click', () => {
    modal.remove();
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });
}
