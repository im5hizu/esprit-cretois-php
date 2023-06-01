const thisUrl = window.location.origin;
const urlJson = `${thisUrl}/_thybault/espritCretois-php/json/products.json`;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = Number(urlParams.get("id"));
const contentDiv = document.getElementById("produit-simple");
const cartStorage = localStorage.getItem("cart");

const loadProducts = async (urlJson) => {
  const response = await fetch(urlJson);
  const responseJson = await response.json();
  const products = responseJson.products;
  let product;
  for (let i = 0; i < products.length; i++) {
    if (products[i].id == productId) {
      product = products[i];
      break;
    }
  }
  singleProductLoader(product);
  return product;
};

const singleProductLoader = (product) => {
  const productPrice = product.price;
  const productPriceDigits = function financial(productPrice) {
    return Number.parseFloat(productPrice).toFixed(2);
  };
  contentDiv.innerHTML = `
    <article>
    <h3>${product.name}</h3>
    <div>
        <figure><img src="/_thybault/espritCretois-php/img/products/${product.category}/${product.subCategory}/${product.image}"></figure>
        <div>
            <p></p>
            ${product.description}
            <p></p>
            <footer>
                <form id="cart">
                  <input type="hidden" id="id" value="1">
                  <input type="number" min="1" step="1" value="1" id="price">
                  <span id="calcul-price">${productPriceDigits(productPrice)}€</span>
                  <button type="submit" class="bt-panier" id="bt-panier" href="cart.html?id=1">Ajouter au panier</button>
                </form>
            </footer>
        </div>
    </div>
  </article>`;

  // Fonction calcul quantité
  const quantiteInput = document.getElementById("price");
  let quantite = 1;
  const prixUnitaire = product.price; // Prix unitaire d'un article
  const prixTotalSpan = document.getElementById("calcul-price");

  quantiteInput.addEventListener("input", () => {
    quantite = parseInt(quantiteInput.value);
    const prixTotal = quantite * prixUnitaire;
    prixTotalSpan.innerText = prixTotal + "€";
  });

  // Fonction ajout au cart
  const btnAddToCart = document.getElementById("bt-panier");
  let cart;
  let cartText;

  const addToCart = (productId, quantite) => {
    const loadCart = localStorage.getItem("cart");
    if (!loadCart) {
      cart = new Map();
      cart.set(productId, quantite);
      cartText = JSON.stringify(Array.from(cart.entries()));
      localStorage.setItem("cart", cartText);
    } else {
      cartText = localStorage.getItem("cart");
      cart = new Map(JSON.parse(cartText));
      let itemPresent = false; // Initialiser le flag à false
      cart.forEach(function (value, key) {
        if (key === productId) {
          console.log("item déjà présent");
          cart.set(key, value + quantite);
          // Convertir la Map mise à jour en chaîne JSON et la stocker dans localStorage
          const cartText = JSON.stringify(Array.from(cart.entries()));
          localStorage.setItem("cart", cartText);
          itemPresent = true; // Mettre à jour le flag
          return; // Sortir de la boucle
        }
      });

      if (!itemPresent) {
        // Vérifier si l'élément a été trouvé
        console.log("item non présent");
        cart.set(productId, quantite);
        cartText = JSON.stringify(Array.from(cart.entries()));
        localStorage.setItem("cart", cartText);
      }
    }

    console.log(cart);
    window.location.reload()
  };

  btnAddToCart.addEventListener("click", (event) => {
    event.preventDefault();
    addToCart(productId, quantite);
  });
};

loadProducts(urlJson);
