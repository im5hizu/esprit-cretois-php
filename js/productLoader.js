const thisUrl = window.location.origin
const urlJson = `${thisUrl}/_thybault/espritCretois-php/json/products.json`;
const productSection = document.getElementById("produits");
const singleProductSection = document.getElementById("produit-simple");
const ulProduct = document.createElement("ul");
const btnDiv = document.getElementById('bt-display-products');
const btnList = btnDiv.firstElementChild;
const btnGrid = btnList.nextElementSibling;

if (productSection) {
  //const divClassList = document.createElement('div')
  productSection.appendChild(ulProduct);
  //productSection.appendChild(divClassList)
}

const loadProducts = async (urlJson) => {
  fetch(urlJson)
    .then((response) => response.json())
    .then((responseJson) => {
      responseJson.products.forEach((product) => {
        // Appel de la fonction pour afficher les produits.
        if (productSection) {
          createProducts(product);
        };
      });
    })
    .catch((error) => console.error(error));
};

loadProducts(urlJson);

const createProducts = (product) => {
  // Création des éléments HTML
  const liProduct = document.createElement("li");
  const hrefProduct = document.createElement("a");
  const productImg = document.createElement("img");
  const productH3 = document.createElement("h3");
  const productSpan = document.createElement("span");
  const hrefProduct2 = document.createElement("a");
  const productPrice = product.price;
  // Fonction double décimale
  const productPriceDigits = function financial(productPrice) {
    return Number.parseFloat(productPrice).toFixed(2);
  }
  
  // Organisation du DOM
  ulProduct.appendChild(liProduct);
  liProduct.appendChild(hrefProduct);
  liProduct.appendChild(hrefProduct2);
  hrefProduct.appendChild(productImg);
  hrefProduct2.appendChild(productH3);
  hrefProduct2.appendChild(productSpan);

  // Ajout des attributs
  productImg.src = `${thisUrl}/_thybault/espritCretois-php/img/products/${product.category}/${product.subCategory}/${product.image}`;
  hrefProduct.href = `${window.location.href}?id=${product.id}`;
  productH3.innerHTML = `${product.name}`;
  productSpan.innerHTML = `${productPriceDigits(productPrice)}€`;
  hrefProduct2.href = `${thisUrl}/_thybault/espritCretois-php/produit-simple.html?id=${product.id}`;
  hrefProduct2.id = "href"
};


const showProductsList = async () =>{
  let divClassList = document.querySelector('#produits article');
  const articleProductsList = document.createElement('article');
  const hrefProduct2 = document.getElementById("href");
  const liProduct = document.querySelector('main section ul li')
  console.log(liProduct, hrefProduct2)
  
  if(!articleProductsList){
    articleProductsList.appendChild(hrefProduct2);
    liProduct.appendChild(articleProductsList);
  }
  if(divClassList){
    productSection.appendChild(divClassList);
    divClassList.classList.add('display-products-list');
    divClassList.appendChild(ulProduct)
  }else{
    divClassList = document.createElement('div');
    productSection.appendChild(divClassList)
    divClassList.classList.add('display-products-list');
    divClassList.appendChild(ulProduct)
  }
  ulProduct.classList.add("display-products-list");
  
}
