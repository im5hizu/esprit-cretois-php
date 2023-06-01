const btBackToTop = document.getElementById('back-to-top');
const mainMenu = document.getElementById('primary-nav');






// chargement du DOM
document.addEventListener("DOMContentLoaded", ready);
function ready() {
    // disparition du loader
    document.querySelector("#loader").classList.add("animLoader");
    ///////////////////////////////////////////////////////////////////////////////////////////
    // 1 et 2 CREATION D’UN BOUTON FIXED EN BAS A DROITE, RENDRE LE MENU PRINCIPAL FIXE EN HAUT
    //////////////////////////////////////////////////////////////////////////////////////////
    btBackToTop.style.opacity = '0';
    window.addEventListener('scroll', checkScroll);
    // effet smooth sur le scroll to top
    btBackToTop.addEventListener('click', () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });

    ///////////////////////////////////////
    // 3) FAIRE APPARAITRE UNE POPUP DE PUB
    ///////////////////////////////////////
    const delay = 3;
    // ES5
    //const dataPub = "Il faut que cette popup s'ouvre au bout de " + delay + "s<br>Et qu'elle ne s'ouvre qu'une seule fois pdt la navigation";
    // ES6
    const dataPub = `Il faut que cette popup s'ouvre au bout de ${delay}s, <br>
    et qu'elle ne s'ouvre qu'une seule fois pdt la navigation`;
    let openPub = setTimeout(function() {openPopup(dataPub, 700, 400);}, delay*1000);

    // Permet l'ouverture unique de la popup durant le temps de la session//////////////////
    checkSessionStorage(openPub);

    /////////////////////////////////////////
    // 4) MENU RESPONSIVE :
    /////////////////////////////////////////
    const primaryNav = document.getElementById('primary-nav');
    const btMobile = document.getElementById('mobile-nav');
    btMobile.addEventListener('click', openMobileMenu);

    ///////////////////////////////////////////
    // 5) IMAGE ALEATOIRE POUR LE HEADER
    ///////////////////////////////////////////
    const tabImgHeader = ["header-01.jpg", "header-02.jpg", "header-03.jpg"];
    // image de fond CSS
    let displayImgRandomHeader = 'url(';
    displayImgRandomHeader += imgRandomHeader(tabImgHeader, 'img/header/');
    displayImgRandomHeader += ")";
    if(document.getElementById('slider')) {
        const slider = document.getElementById('slider');
        slider.style.backgroundImage = displayImgRandomHeader;
    }
} // fin ready

//////////////////////////////////////////////////////
// Bt en bas à froite qui permet de remonter la page
/////////////////////////////////////////////////////
function checkScroll() {
    // HTML tag
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf("Edge") || ua.indexOf("MSEI");
    let documentTag;
    if (msie > 0) {
        documentTag = document.body;
    } else {
        documentTag = document.documentElement;
    }

    //Position du scroll
    let posVertScroll = documentTag.scrollTop;
    // Hauteur du header
    const header = document.querySelector('header');
    let hauteurHeader = header.clientHeight;
    //console.log(hauteurHeader)

    // menu fixé
    if(posVertScroll > hauteurHeader) {
        mainMenu.classList.add('fixed')
    } else {
        mainMenu.classList.remove('fixed')
    }
    // bt back to top
    if(posVertScroll > 100) {
        btBackToTop.classList.add('animfadeIn')
    } else {
        btBackToTop.classList.remove('animfadeIn')
    }
}


//////////////////////////////////////////////////////
// Fonctions utilisées dans les scripts de ce fichier
//////////////////////////////////////////////////////
// Ouverture de la popup au chargement: 1 fois pdt la session
function checkSessionStorage(openPub) {
    if(sessionStorage.getItem("openPub")) {
        clearTimeout(openPub);
    } else {
        sessionStorage.setItem("openPub", "on");
    }
}
// Bt menu mobile
function openMobileMenu() {
    mainMenu.classList.toggle('animfadeIn');
    mainMenu.classList.toggle('display');
}
// Img aléatoire header page home
function imgRandomHeader(tabImg, dir) {
    const tabLength = tabImg.length;
    let randomNumber = Math.floor(Math.random() * tabLength);
    //console.log(randomNumber)
    let imgRandom = tabImg[randomNumber];
    // repertoire de l'image
    const imgRandomUrl =  dir + imgRandom;
    return imgRandomUrl;
}

