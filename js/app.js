'use strict';
//Define how many products to show at once.
const NUM_OF_PRODUCTS = 3;

// Define how many rounds there are and the current round to increment for every product click
const TOTAL_ROUNDS = 25;
let round = 0;

// Constructor function to create a const  = new product
function Product(name, src) {
  this.name = name;
  this.src = src;
  this.clicks = 0;
  this.views = 0;
}

// Create Products for all included images
const productsArray = [
  new Product('bag', '/img/bag.jpg'),
  new Product('banana', '/img/banana.jpg'),
  new Product('bathroom', '/img/bathroom.jpg'),
  new Product('boots', '/img/boots.jpg'),
  new Product('breakfast', '/img/breakfast.jpg'),
  new Product('bubblegum', '/img/bubblegum.jpg'),
  new Product('chair', '/img/chair.jpg'),
  new Product('cthulhu', '/img/cthulhu.jpg'),
  new Product('dog-duck', '/img/dog-duck.jpg'),
  new Product('dragon', '/img/dragon.jpg'),
  new Product('pen', '/img/pen.jpg'),
  new Product('pet-sweep', '/img/pet-sweep.jpg'),
  new Product('scissors', '/img/scissors.jpg'),
  new Product('shark', '/img/shark.jpg'),
  new Product('sweep', '/img/sweep.png'),
  new Product('tauntaun', '/img/tauntaun.jpg'),
  new Product('unicorn', '/img/unicorn.jpg'),
  new Product('water-can', '/img/water-can.jpg'),
  new Product('wine-glass', '/img/wine-glass.jpg')
];

const resultsButton = document.getElementById('resultsButton');

// Note: when a number of products on the page is greater or equal to half the total number of products, the requirement to have no repeats between clicks can't be met. This is handled by the boolean below
const REPEAT_TRACK = productsArray.length / 2 >= NUM_OF_PRODUCTS ? true : false;

// For incrementing clicks, define a global hash table that contains the indices for each product within the products array
const productArrayIndices = {};

// This function creates an index map of the products
function defineProductIndices() {
  for (let i = 0; i < productsArray.length; i++) {
    let productName = productsArray[i].name;
    productArrayIndices[productName] = i;
  }
}

// To ensure that there is no repeat products from the previous render, define a global hash table that is continuously updated as the renderProducts function is called
let currentProductArrayIndices = {};

// This function creates image elements to be populated with products
function createInitialProducts() {
  // Define container where images are rendered, as well as fragment to append.
  const container = document.getElementById('productDisplaySection');
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < NUM_OF_PRODUCTS; i++) {
    let imgElement = document.createElement('img');
    imgElement.className = 'productImage';
    fragment.appendChild(imgElement);
  }
  container.appendChild(fragment);
  renderProducts();
  // Add event listeners for each product image
  for (let img of document.getElementsByClassName('productImage')) {
    img.addEventListener('click', handleProductClick);
  }
}

// This function renders random images on the page
function renderProducts() {
  // Define empty hash map for ensuring images rendered are not duplicates
  let newProductArrayIndices = {};
  for (let img of document.getElementsByClassName('productImage')) {
    let index = getRandomIndex();

    // If the number of products to be displayed supports preventing repeats between clicks, check for repeats in the current render and in the new render
    if (REPEAT_TRACK) {
      while (currentProductArrayIndices[index] || newProductArrayIndices[index]) {
        index = getRandomIndex();
      }
    // If the number of products to be displayed doesn't support prevent repeats between clicks, only check for repeats within the new render
    } else {
      while (newProductArrayIndices[index]) {
        index = getRandomIndex();
      }
    }

    let newProduct = productsArray[index];
    updateImageElement(img, newProduct);
    // Increment views
    newProduct.views ++;
    // Add index to the indices dictionary
    newProductArrayIndices[index] = true;
  }
  currentProductArrayIndices = newProductArrayIndices;
}

// This function gets a random index from the products array
function getRandomIndex() {
  return Math.floor(Math.random() * productsArray.length);
}

// This function update an image element based off of a product object
function updateImageElement(imgElement, product) {
  imgElement.id = product.name;
  imgElement.src = product.src;
  imgElement.alt = product.name;
  imgElement.title = product.name;
}

// Event handler for clicking on an image
function handleProductClick(event) {
  round++;
  let targetIndex = productArrayIndices[event.target.id];
  productsArray[targetIndex].clicks++;

  if (round === TOTAL_ROUNDS) {
    for (let img of document.getElementsByClassName('productImage')) {
      img.removeEventListener('click', handleProductClick);
    }
    return;
  }

  renderProducts();
}

// Event handler for clicking the results button
function viewResults() {
  // The function will replace the current li elements with the set created in the fragment
  const ul = document.getElementById('resultsList');
  const fragment = document.createDocumentFragment();
  // make one li for each product
  for (let i = 0; i < productsArray.length; i++) {
    let li = document.createElement('li');
    let viewNumber = productsArray[i].views;
    let clickNumber = productsArray[i].clicks;
    // for grammar, track time/times based on views and clicks
    let viewTimes = viewNumber === 1 ? 'time' : 'times';
    let clickTimes = clickNumber === 1 ? 'time' : 'times';
    li.innerText = `${productsArray[i].name} was viewed ${viewNumber} ${viewTimes}, and was clicked ${clickNumber} ${clickTimes}.`;
    fragment.appendChild(li);
  }
  ul.replaceChildren(fragment);

  // Allow the user to view results after each click until total rounds have passed
  if (round === TOTAL_ROUNDS) {
    resultsButton.removeEventListener('click', viewResults);
  }
}

// On page load
defineProductIndices();
createInitialProducts();
resultsButton.addEventListener('click', viewResults);
