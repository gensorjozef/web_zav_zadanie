// Pridanie do html - <visit-counter></visit-counter>
// Pocita pristup na kazdu podstranku kde je pocitadlo pridane (vsetko spolu)

// Ziskanie, zvysenie a ulozenie pocitadla

let name = "counter";
//reset(name);

let counter = parseInt(read(name));

if(counter){
    counter=counter+1;
} else {
    counter = 1;
}

write(name, counter);

// Metody pre webstorage

function reset(name){
    localStorage.removeItem(name);
}

function write(name, counter){
    localStorage.setItem(name, counter.toString());
}

function read(name){
    x = localStorage.getItem(name); 
    return x;
}

// Webkomponent, pocitadlo sa vypisuje do <p>

class VisitCounter extends HTMLElement{
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <style>
                #visit-counter {
                    color: white;
                };    
            </style>
            <p id="visit-counter" class="navbar-brand""></p>
        `;

        $("visit-counter").text("Počet návštev: " + counter);
    }
}


customElements.define('visit-counter', VisitCounter);
