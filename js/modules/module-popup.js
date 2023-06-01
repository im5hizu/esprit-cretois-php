/////////////////////////////
// open popup
////////////////////////////
export const bodyTag = document.querySelector('body');
export function openPopup( data, l, h) {
    bodyTag.insertAdjacentHTML('afterBegin', '<div id="popup"><p>' + data + '</p></div>');

    let popup = document.getElementById('popup');
    popup.style.background = "red";
    popup.style.color = "#fff";
    popup.style.width = l + 'px';
    popup.style.height = h + 'px';
    popup.style.textAlign = "center";
    popup.style.position = "absolute";
    popup.style.left = "50%";
    popup.style.top = "50%";
    popup.style.padding = "20px";
    popup.style.transform = "translate(-50%, -50%)"
    popup.style.boxShadow = "10px 10px 20px #aaa";
    popup.style.display = "flex";
    popup.style.flexFlow = "column";
    popup.style.justifyContent = "center";
    popup.style.zIndex = "1";
    // bouton close popup
    popup.insertAdjacentHTML('afterBegin', '<div id="close">X</div>');
    const btClose = document.getElementById('close');
    btClose.addEventListener('click', closePopup);
    btClose.style.cursor = "pointer";
    btClose.style.padding = "10px";
    btClose.style.fontWeight = "bold";
    btClose.style.display = "block";
    btClose.style.position ="absolute";
    btClose.style.top = "0";
    btClose.style.right = "10px"
}
export function closePopup() {
    bodyTag.removeChild(this.parentElement)
}
