const confirmOrder = () =>{
    const confirmDiv = document.getElementById('confirmation-commande')
    confirmDiv.insertAdjacentHTML('afterbegin', `<p>Votre commande n°${(Math.random() * 500).toFixed(0)} à bien été prise en compte!</div>`)
    const confirmDivP = confirmDiv.firstChild;
    confirmDiv.style.display = "flex"
    confirmDiv.style.width = "100%"
    confirmDiv.style.height = "30%"
    confirmDiv.style.background = 'red'
    confirmDiv.style.justifyContent = 'space-around'
    confirmDiv.style.alignItems = 'center'
    confirmDivP.style.fontSize = '25px'
    confirmDivP.style.color = 'white'
}
confirmOrder()