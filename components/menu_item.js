
class MenuItem extends HTMLElement{

    constructor() {
        super();
    }

    connectedCallback(){
          this.innerHTML = ` <nav id="menu" class="navbar navbar-expand-lg navbar-dark bg-primary">
                            </nav>
                          `
    }


}

window.customElements.define('menu-item', MenuItem);