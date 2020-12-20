
class MenuItem extends HTMLElement{

    constructor() {
        super();
    }

    connectedCallback(){
          this.innerHTML = ` <div id="menu">
                            </div>
                          `
    }


}

window.customElements.define('menu-item', MenuItem);