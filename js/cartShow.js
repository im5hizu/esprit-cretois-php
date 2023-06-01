export const cartShow = () => {
  const urlThis = window.location.origin;
  const cartJson = localStorage.getItem("cart");
  const cartText = JSON.parse(cartJson);
  const cart = new Map(cartText);
  const cartSpan = document.querySelector(".nbre-produits");
  const url = `${urlThis}/_thybault/espritCretois-php/json/products.json`;
  fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      let totalPrice = 0; // Initialiser la variable totalPrice à 0
      responseJson.products.forEach((product) => {
        cart.forEach(function (value, key) {
          if (key === product.id) {
            // Vérifier si l'ID du produit est présent dans le panier
            const total = product.price * value; // Calculer le prix total
            totalPrice += total; // Ajouter le prix total à la variable totalPrice
          }
        });
      });
      if (!cartJson) {
        cartSpan.innerText = `0 article(s) - 0.00€`
      } else {
        cartSpan.innerText = `${cart.size} article(s) - ${totalPrice.toFixed(2)}€`;
      } // Afficher le prix total de tous les produits
    })
    .catch((error) => console.error(error));
};

cartShow();

if(!window.screen.availWidth <= 625){
  console.log(false)
  const menuMobile = document.getElementById('bt-categories');
  menuMobile.style.display = "none"
}