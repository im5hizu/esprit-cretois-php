//////////////////////////////////////////////////////
// Creation du menu slide present sur toutes les pages
//////////////////////////////////////////////////////
export function loadMenuSlide(category, products) {
    const divMenu = document.getElementById("menu-categories");
    createMenuCategories(category);
    const btOpenMenu = document.querySelector('#bt-categories');
    btOpenMenu.addEventListener('click', function(e) {
        const thisBtOpenMenu = this;
    });
    
}

