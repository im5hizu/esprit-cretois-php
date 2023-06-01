import {openPopup, closePopup, bodyTag} from "./modules/module-popup.js";

export function checkForm() {
    const formExo = document.forms["form-formation"];
    if (formExo) {
        formExo.addEventListener('submit', function(e) {
            const thisForm = this;
            checkFormAvecBoucle(e, thisForm);
        });
    }
    //////////////////////////////////////////
    // controle du textarea pendant la frappe
    //////////////////////////////////////////
    let nbreCaractMax = 20;
    const textareaTag = document.getElementById('commentaires');
    // message texte restant
    const messageCaractTag = document.createElement('div');
    if (formExo) {       
        // on attache la div du message  à la fin du 2e fieldset
        const caractTag = formExo.querySelector('fieldset:last-of-type').appendChild(messageCaractTag);
        // message caract max
        const messageCaractMax = document.createElement('span');
        const caractMaxTag = textareaTag.nextElementSibling.appendChild(messageCaractMax);
        // affichage du nbre de caracteres max
        caractMaxTag.innerHTML = '(' + nbreCaractMax + " caractères max)";
        // evenement sur les touches frappées
        textareaTag.addEventListener('keyup', function (e) {
            const myThis = this;
            checkTextarea(nbreCaractMax, myThis, caractTag)
        })
    }
} //end checkForm

////////////////////////////////////////////////////////////////
function checkFormAvecBoucle(evt, thisForm) {
    // mode debug
    evt.preventDefault();

    // reset icon error
    const errorIconClass = document.getElementsByClassName('form-alert');
    for (let element of errorIconClass) {
        element.classList.remove('form-alert');
    }

    // Regex
    const telRegex = /^0\d(\s|-)?(\d{2}(\s|-)?){4}$/;
    const emailRegex = /^[^\W][a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*\@[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*\.[a-zA-Z]{2,4}$/;
    const dptRegex = /^((0[1-9])|([1-8][0-9])|(9[0-8])|(2A)|(2B))[0-9]{3}$/;

    // tableau qui va recupérer les noms des champs qui ne sont pas conformes
    let tabError = [];
    // tableau qui recupere les noms des groupes de bt radio qui ont été cochés
    let tabCheckedRadio = [];
    // Propriétés des elements
    let typeElementForm, valueElementForm, nameElementForm;

    for (let elementForm of thisForm) {
        //console.log(elementForm);
        typeElementForm = elementForm.type;
        //console.log(typeElementForm);
        nameElementForm = elementForm.name;
        //console.log(nameElementForm);
        valueElementForm = elementForm.value;
        //console.log(valueElementForm);

        let erreur;

        // on ne veux pas evaluer ces objets de formulaire
        if (typeElementForm == 'submit' || typeElementForm == 'fieldset' || nameElementForm == 'ip') {
            continue;
        }

        // on controle tous les champs qui renvoie une valeur: input, select, textarea
        if (valueElementForm == "") {
            // si un element input, textarea, select n'est pas rempli 
            // on recupere son nom et on l'injecte dans le tableau des errieurs
            tabError.push(nameElementForm + " à renseigner");
            // icon error sur le label
            elementForm.previousElementSibling.classList.add('form-alert');

        } else {
            // ici on controle les formats des champs en Regex
            if (nameElementForm == 'tel' && !telRegex.test(valueElementForm)) {
                erreur = "le numéro de téléphone n'est pas valide";
                tabError.push(erreur);
                elementForm.previousElementSibling.classList.add('form-alert');
            }

            if (nameElementForm == 'email' && !emailRegex.test(valueElementForm)) {
                erreur = "l'email n'est pas valide";
                tabError.push(erreur);
                elementForm.previousElementSibling.classList.add('form-alert');
            }

            if (nameElementForm == 'departement' && !dptRegex.test(valueElementForm)) {
                erreur = "Le département n'est pas valide";
                tabError.push(erreur);
                elementForm.previousElementSibling.classList.add('form-alert');
            }
        }


        ///////////////////////////////////////////////
        // ici on controle les groupes de bt radio
        // quand un bt radio est coché on recupere le nom du groupe
        if (typeElementForm == 'radio') {
            if (elementForm.checked == true) {
                tabCheckedRadio.push(nameElementForm);
            }
        }
        ///////////////////////////////////////////////
    } // end for

    ///////////////////////////////////////
    // controle des groupes de bt radio
    ///////////////////////////////////////
    // ici on recupère tous les noms des groupes de bt radio
    const btsRadio = document.querySelectorAll("[type=radio]");
    const tabGroupRadioName = [];
    for (let elementRadio of btsRadio) {
        let nameBtRadio = elementRadio.name;
        // si le tableau contient déjà le meme nom on l'evite
        // empeche de rentrer des doublons
        if (tabGroupRadioName.includes(nameBtRadio)) {
            continue;
        } else {
            tabGroupRadioName.push(nameBtRadio)
        }
    }

    // on compare les noms des groupes de bt radio avec ceux qui ont été coché
    for (let name of tabGroupRadioName) {
        // si un nom de groupe n'est pas dans le tableau tabGroupRadioName c'est que ce groupe n'a pas été coché
        if (!tabCheckedRadio.includes(name)) {
            tabError.push(name + " non renseigné");
            // pour affichage de l'icon erreur sur le label precedent l'input
            let attributeSelector = '[name=' + name + ']';
            let labelTag = document.querySelector(attributeSelector);
            labelTag.previousElementSibling.previousElementSibling.classList.add('form-alert');
        }
    }

    //////////////////////////////////////////////////////////
    // controle du groupe de bt checkbox // au moins 1 coché
    //////////////////////////////////////////////////////////
    const scientifique = document.getElementById('scientifique');
    const artistique = document.getElementById('artistique');
    if (!scientifique.checked && !artistique.checked) {
        tabError.push("Etes-vous plutôt scientifique ou artistique?");
        scientifique.previousElementSibling.previousElementSibling.classList.add('form-alert');
        // patch???
    } else {
        scientifique.previousElementSibling.previousElementSibling.classList.remove('form-alert');
    }


    ////////////////////////////////////////////////////
    // si le tableau des erreurs est vide donc pas d'erreur
    // on envoie le formulaire
    ////////////////////////////////////////////////////
    if (tabError.length === 0) {
        thisForm.submit();
    } else {
        // sinon on affiche les erreurs
        let afficheErreur = "Veuillez corriger les erreurs svp: <br>";
        afficheErreur += tabError.join('<br>');
        openPopup(afficheErreur, 700, 400);
        window.scrollTo({top: 0, behavior: 'smooth'});
        // et on bloque l'envoi du formulaire
        evt.preventDefault();
    }
} // end submit
////////////////////////////////////////////////////////////////



function checkTextarea(nbreCaractMax, myThis, caractTag) {
    let nbreCaract = myThis.value.length;
    let caractRestant = nbreCaractMax - nbreCaract;

    if (caractRestant <= 0) {
        caractRestant = 0;
        myThis.value = myThis.value.slice(0, nbreCaractMax);
    }
    let messageCaract = "Il vous reste " + caractRestant + ' catactère(s)';
    caractTag.innerHTML = messageCaract;
}


