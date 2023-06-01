const thisUrl = window.location.origin;
const jsonUrl = `${thisUrl}/_thybault/espritCretois-php/json/products.json`;
const orderForm = document.forms["form-commande"];

const loadCart = () => {
  const cartJson = localStorage.getItem("cart");
  const cartText = JSON.parse(cartJson);
  const cart = new Map(cartText);

  if (!cartJson) {
    noCart();
  } else {
    showProducts(cart);

    orderForm.addEventListener("submit", (e) => {
      const formData = new FormData();

      // Ajouter les données du panier au formulaire
      cart.forEach((value, key) => {
        formData.append(`command[cart][${key}][id]`, key);
        formData.append(`command[cart][${key}][qt]`, value);
      });

      // Ajouter les données de livraison au formulaire
      const shipping = {
        Prenom: orderForm.elements["firstName"].value,
        nom: orderForm.elements["lastName"].value,
        adresse: orderForm.elements["adress"].value,
        ville: orderForm.elements["city"].value,
        telephone: orderForm.elements["tel"].value,
      };

      for (const key in shipping) {
        if (shipping.hasOwnProperty(key)) {
          const value = shipping[key];
          if (value !== undefined && value !== null && value !== "") {
            formData.append(`command[shipping][${key}]`, value);
          }
        }
      }

      // Envoyer le formulaire
      fetch(`${thisUrl}/json/commandes.json`, {
        method: "POST",
        body: formData,
      })
      .then(e.preventDefault())
      .then(localStorage.clear())
      .then(window.location.replace(`${thisUrl}/_thybault/espritCretois-php/confirmation-commande.html`))
    });
  }
};

const noCart = () => {
  const panierHtml = document.getElementById("panier");
  const commandeHtml = document.getElementById("commande");
  const main = panierHtml.parentElement;

  panierHtml.style.display = "none";
  commandeHtml.style.display = "none";
  main.innerHTML = "<div><p>Votre panier est vide!</p></div>";

  const mainDiv = main.firstChild;
  const mainDivP = mainDiv.firstChild;
  mainDiv.style.background = "red";
  mainDiv.style.display = "flex";
  mainDiv.style.justifyContent = "center";
  mainDivP.style.fontSize = "30px";
  mainDivP.style.color = "white";
};

const showProducts = (cart) => {
  fetch(jsonUrl)
    .then((response) => response.json())
    .then((responseJson) => {
      const formElement = document.getElementById("form-commande");
      const panierElement = document.getElementById("panier");
      formElement.style.display = "block";
      let totalPrice = 0;
      const btnRecalculElement = document.getElementById("recalcul-panier");
      

      responseJson.products.forEach((product) => {
        cart.forEach(function (value, key) {
          if (key === product.id) {
            const total = product.price * value; // Calculer le prix total
            totalPrice += total
            const tablePanier = panierElement.firstElementChild;
            const tBody = "<tbody><tr></tr></tbody>";
            const innerHTML = `
                    <td><img src="/_thybault/espritCretois-php/img/products/${product.category}/${product.subCategory}/${product.image}"alt="${product.name}"></td>
                    <td>${product.name}</td>
                    <td>${product.price.toFixed(2)}€</td>
                    <td><input type="number" id="${product.id}" min="1" max="50" value="${value}"></td>
                    <td>${(product.price * value).toFixed(2)}€</td>
                    <td><a href="1" >X</a></td>
          `;
            tablePanier.insertAdjacentHTML("beforeend", tBody);

            const trTable = document.querySelector('table tbody tr')
            trTable.insertAdjacentHTML('beforeend', innerHTML)
          }
        });
      })
      if (!btnRecalculElement) {
        const btnHtml = `<button id="recalcul-panier">Recalculer le panier</button><div id="totalPrice">Total: ${totalPrice.toFixed(2)}€</div>`;
        panierElement.insertAdjacentHTML("beforeend", btnHtml);
      };
    })
    .catch((error) => console.error(error));
};

loadCart();
