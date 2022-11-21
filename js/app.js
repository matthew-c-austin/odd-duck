'use strict';
//Define how many products to show at once
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
const bag = new Product('bag', '/img/bag.jpg');
const banana = new Product('banana', '/img/banana.jpg');
const bathroom = new Product('bathroom', '/img/bathroom.jpg');
const boots = new Product('boots', '/img/boots.jpg');
const breakfast = new Product('breakfast', '/img/breakfast.jpg');
const bubblegum = new Product('bubblegum', '/img/bubblegum.jpg');
const chair = new Product('chair', '/img/chair.jpg');
const cthulhu = new Product('cthulhu', '/img/cthulhu.jpg');
const dogDuck = new Product('dog-duck', '/img/dog-duck.jpg');
const dragon = new Product('dragon', '/img/dragon.jpg');
const pen = new Product('pen', '/img/pen.jpg');
const petSweep = new Product('pet-sweep', '/img/pet-sweep.jpg');
const scissors = new Product('scissors', '/img/scissors.jpg');
const shark = new Product('shark', '/img/shark.jpg');
const sweep = new Product('sweep', '/img/sweep.png');
const tauntaun = new Product('tauntaun', '/img/tauntaun.jpg');
const unicorn = new Product('unicorn', '/img/unicorn.jpg');
const waterCan = new Product('water-can', '/img/water-can.jpg');
const wineGlass = new Product('wine-glass', '/img/wine-glass.jpg');

const productsArray = [
  bag,
  banana,
  bathroom,
  boots,
  breakfast,
  bubblegum,
  chair,
  cthulhu,
  dogDuck,
  dragon,
  pen,
  petSweep,
  scissors,
  shark,
  sweep,
  tauntaun,
  unicorn,
  waterCan,
  wineGlass
];

const resultsButton = document.getElementById('resultsButton');

// For incrementing clicks, define a global dictionary that contains the indices for each product within the products array
const productArrayIndices = {};

// This function creates an index map of the products
function defineProductIndices() {
  for (let i = 0; i < productsArray.length; i++) {
    let productName = productsArray[i].name;
    productArrayIndices[productName] = i;
  }
}

// This function creates image elements to be populated with products
function createInitialProducts() {
  // Define container where images are rendered, as well as fragment to append.
  const container = document.getElementById('productDisplay');
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
  // Define empty dictionary for ensuring images rendered are not duplicates
  let productArrayIndicesUsed = {};
  for (let img of document.getElementsByClassName('productImage')) {
    let index = getRandomIndex();

    while (productArrayIndicesUsed[index]) {
      index = getRandomIndex();
    }

    let newProduct = productsArray[index];
    updateImageElement(img, newProduct);
    // Increment views
    newProduct.views ++;
    // Add index to the indices dictionary
    productArrayIndicesUsed[index] = true;
  }
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
  let ul = document.getElementById('resultsList');
  // make one li for each product
  for (let i = 0; i < productsArray.length; i++) {
    let li = document.createElement('li');
    let viewNumber = productsArray[i].views;
    let clickNumber = productsArray[i].clicks;
    // for grammar, track time/times based on views and clicks
    let viewTimes = viewNumber === 1 ? 'time' : 'times';
    let clickTimes = clickNumber === 1 ? 'time' : 'times';
    li.innerText = `${productsArray[i].name} was viewed ${viewNumber} ${viewTimes}, and was clicked ${clickNumber} ${clickTimes}.`;
    ul.appendChild(li);
  }

  // Allow the user to view results after each click until total rounds have passed
  if (round === TOTAL_ROUNDS) {
    resultsButton.removeEventListener('click', viewResults);
  }
}

// On page load
defineProductIndices();
createInitialProducts();
resultsButton.addEventListener('click', viewResults);
