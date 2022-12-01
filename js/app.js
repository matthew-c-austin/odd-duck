'use strict';
//Define how many products to show at once.
const NUM_OF_PRODUCTS = 3;

// Define how many rounds there are and the current round to increment for every product click
const TOTAL_ROUNDS = 25;
let round = 0;

// Constructor function to create a new product
function Product(name, src) {
  this.name = name;
  this.src = src;
  this.clicks = 0;
  this.views = 0;
}

// Create products array for all included images
let productsArray = [];

// Define keys for caching the products array, round value, and products to be displayed on refresh
const roundKey = 'current-round';
const productsArrayKey = 'products-array';
const currentProductArrayIndicesKey = 'current-product-indices';

const resultsButton = document.getElementById('resultsButton');
const resetButton = document.getElementById('resetButton');

// Note: when a number of products on the page is greater or equal to half the total number of products, the requirement to have no repeats between clicks can't be met. This is handled by the boolean below
const REPEAT_TRACK = productsArray.length / 2 >= NUM_OF_PRODUCTS ? true : false;

// For incrementing clicks, define a global hash table that contains the indices for each product within the products array
const productArrayIndices = {};

// To ensure that there is no repeat products from the previous render, define a global array that is continuously updated as the renderProducts function is called
let currentProductArrayIndices = [];

// This function handles setting the current state on page load.
function pageLoad() {
  // Get all locally stored variables or initialize them
  defineProducts();
  defineRound();
  defineCurrentProductArrayIndices();
  defineProductIndices();
  createInitialProducts();
  // If the round is less than the total number of rounds, add event listeners for clicking. Otherwise, style the results button
  if (round < TOTAL_ROUNDS) {
    for (let img of document.getElementsByClassName('productImage')) {
      img.addEventListener('click', handleProductClick);
    }
  } else {
    // When total rounds have passed, visually style the view results button to indicate a change of state
    document.getElementById('resultsButton').style.border = '0.25rem solid #c7a46e';
  }
  resultsButton.addEventListener('click', viewResults);
  resetButton.addEventListener('click', resetSurvey);
}

// This function checks if the products array exists in local storage, and sets it to an initial state if not
function defineProducts() {
  if (getLocalStorage(productsArrayKey)) {
    productsArray = getLocalStorage(productsArrayKey);
  } else {
    productsArray = [
      new Product('bag', './img/bag.jpg'),
      new Product('banana', './img/banana.jpg'),
      new Product('bathroom', './img/bathroom.jpg'),
      new Product('boots', './img/boots.jpg'),
      new Product('breakfast', './img/breakfast.jpg'),
      new Product('bubblegum', './img/bubblegum.jpg'),
      new Product('chair', './img/chair.jpg'),
      new Product('cthulhu', './img/cthulhu.jpg'),
      new Product('dog-duck', './img/dog-duck.jpg'),
      new Product('dragon', './img/dragon.jpg'),
      new Product('pen', './img/pen.jpg'),
      new Product('pet-sweep', './img/pet-sweep.jpg'),
      new Product('scissors', './img/scissors.jpg'),
      new Product('shark', './img/shark.jpg'),
      new Product('sweep', './img/sweep.png'),
      new Product('tauntaun', './img/tauntaun.jpg'),
      new Product('unicorn', './img/unicorn.jpg'),
      new Product('water-can', './img/water-can.jpg'),
      new Product('wine-glass', './img/wine-glass.jpg')
    ];
    setLocalStorage(productsArrayKey, productsArray);
  }
}

// Get local storage
function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// Set local storage
function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// This function checks if the round variable exists in local storage, and sets it to an initial state if not
function defineRound() {
  if (getLocalStorage(roundKey)) {
    round = getLocalStorage(roundKey);
  } else {
    round = 0;
    setLocalStorage(roundKey, round);
  }
}

// This function checks if the current product array indices variable exists in local storage, and sets it to an initial state if not
function defineCurrentProductArrayIndices() {
  if (getLocalStorage(currentProductArrayIndicesKey)) {
    currentProductArrayIndices = getLocalStorage(currentProductArrayIndicesKey);
  } else {
    currentProductArrayIndices = [];
    setLocalStorage(currentProductArrayIndicesKey, currentProductArrayIndices);
  }
}

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
  const container = document.getElementById('productDisplaySection');
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < NUM_OF_PRODUCTS; i++) {
    let imgElement = document.createElement('img');
    imgElement.className = 'productImage';
    fragment.appendChild(imgElement);
  }
  container.appendChild(fragment);
  // If there are no current products to be displayed from a previous load, i.e., the currentProductArrayIndices variable is empty, then create initial products to display, otherwise render the products from the previous page load.
  if (currentProductArrayIndices.length === 0) {
    renderProducts();
  } else {
    setCurrentProducts();
  }
}

// This function renders random images on the page
function renderProducts() {
  // Define empty array for ensuring images rendered are not duplicates
  let newProductArrayIndices = [];
  const imgArray = document.getElementsByClassName('productImage');
  for (let i = 0; i < NUM_OF_PRODUCTS; i++) {
    let randomIndex = getRandomIndex();
    // If the number of products to be displayed supports preventing repeats between clicks, check for repeats in the current render and in the new render
    if (REPEAT_TRACK) {
      while (currentProductArrayIndices.includes(randomIndex) || newProductArrayIndices.includes(randomIndex)) {
        randomIndex = getRandomIndex();
      }
    // If the number of products to be displayed doesn't support prevent repeats between clicks, only check for repeats within the new render
    } else {
      while (newProductArrayIndices.includes(randomIndex)) {
        randomIndex = getRandomIndex();
      }
    }

    let newProduct = productsArray[randomIndex];
    updateImageElement(imgArray[i], newProduct);
    // Increment views
    newProduct.views++;
    // Add index to the indices dictionary
    newProductArrayIndices[i] = randomIndex;
  }
  currentProductArrayIndices = newProductArrayIndices;
  // Keep track of the current products viewed in local storage
  setLocalStorage(currentProductArrayIndicesKey, currentProductArrayIndices);
}

// This function gets a random index from the products array
function getRandomIndex() {
  return Math.floor(Math.random() * productsArray.length);
}

// This function updates an image element based off of a product object
function updateImageElement(imgElement, product) {
  imgElement.id = product.name;
  imgElement.src = product.src;
  imgElement.alt = product.name;
  imgElement.title = product.name;
}

// This function renders images from a previous page load
function setCurrentProducts() {
  const imgArray = document.getElementsByClassName('productImage');
  for (let i = 0; i < NUM_OF_PRODUCTS; i++) {
    let productsIdx = currentProductArrayIndices[i];
    let newProduct = productsArray[productsIdx];
    updateImageElement(imgArray[i], newProduct);
    // Note that views are not incremented, as they were viewed already on previous page load
  }
}

// Event handler for clicking on an image
function handleProductClick(event) {
  round++;
  let targetIndex = productArrayIndices[event.target.id];
  productsArray[targetIndex].clicks++;

  // Update local storage of products array and round variables
  setLocalStorage(productsArrayKey, productsArray);
  setLocalStorage(roundKey, round);

  if (round === TOTAL_ROUNDS) {
    // When total rounds have passed, visually style the view results button to indicate a change of state
    document.getElementById('resultsButton').style.border = '0.25rem solid #c7a46e';
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
    // Only show the results chart after all rounds
    createResultsChart();
    resultsButton.removeEventListener('click', viewResults);
  }
}

// This function creates a chart for results viewing
function createResultsChart() {
  Chart.defaults.font.family = '"Georgia, serif"';
  Chart.defaults.font.size = '16';
  Chart.defaults.color = '#000';
  const ctx = document.getElementById('resultsChart');
  const resultsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: productsArray.map(row => row.name), // x-axis
      datasets: [{
        label: 'Number of Clicks', // title
        data: productsArray.map(row => row.clicks), // y-axis data
        backgroundColor: [
          'rgba(69,39,14)'
        ],
        borderColor: [
          'rgba(199,164,110)',
        ],
        borderWidth: 2
      },
      {
        label: 'Number of Views', // title
        data: productsArray.map(row => row.views), // y-axis data
        backgroundColor: [
          'rgba(102,139,97)'
        ],
        borderColor: [
          'rgba(199,164,110)',
        ],
        borderWidth: 2
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Event handler for resetting the survey process
function resetSurvey() {
  localStorage.clear();
  // Use canvas.js getChart method to see if the chart has been rendered in the resultsChart canvas and, if so, destroy it
  let chartStatus = Chart.getChart('resultsChart');
  if (chartStatus !== undefined) {
    chartStatus.destroy();
  }
  // Remove all list elements in the results if they have been displayed
  const resultsList = document.getElementById('resultsList');
  removeAllChildNodes(resultsList);
  // Remove all product images
  const productDisplaySection = document.getElementById('productDisplaySection');
  removeAllChildNodes(productDisplaySection);
  // Remove results button styling
  document.getElementById('resultsButton').style.border = '';
  // Remove reset survey event listener because it is added again within the pageLoad function
  resetButton.removeEventListener('click', resetSurvey);
  // Call the page load function again
  pageLoad();
}

// This function removes all child nodes from an element
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// Load page with saved settings
pageLoad();
