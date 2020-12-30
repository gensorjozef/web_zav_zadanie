
class MenuItem extends HTMLElement{

    constructor() {
        super();
    }

    connectedCallback(){
        this.innerHTML = `
             <style>
             #menu {
                background-color: #274472;
             };
             </style>
             <nav id="menu" class="navbar navbar-expand-lg navbar-dark"></nav>
        `;
    }
}

window.customElements.define('menu-item', MenuItem);