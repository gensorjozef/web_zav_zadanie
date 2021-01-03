/// some script

// jquery ready start


document.addEventListener("DOMContentLoaded", () =>{
    var menu = document.getElementById("menu")
    var listAttr = document.createElement("ul");
    fetch("../json/games.json")
        .then(response => response.json())
        .then(json => {

            json.games.forEach((game, index) => {
                createGameAuthor(game, listAttr, index)

            });
            createMenu(menu , listAttr)
            jQuery(document).ready(function(){
                jQuery('.dropdown-menu > li > .dropdown-menu').parent().addClass('dropdown-submenu').find(' > .dropdown-item').attr('href', 'javascript:;').addClass('dropdown-toggle');
                jQuery('.dropdown-submenu > a').on("click", function(e) {
                    var dropdown = $(this).parent().find(' > .show');
                    jQuery('.dropdown-submenu .dropdown-menu').not(dropdown).removeClass('show');
                    jQuery(this).next('.dropdown-menu').toggleClass('show');
                    e.stopPropagation();
                });
                jQuery('.dropdown').on("hidden.bs.dropdown", function() {
                    jQuery('.dropdown-menu.show').removeClass('show');
                });
            });



        })

})


function addCalendar(container){

    // fetch("../json/slovak_names.json")
    //     .then(response => response.json())
    //     .then(json => {
    //         var slovakNames =  json
    //         console.log(slovakNames)
    //         const date = new Date();
    //
    //
    //         const headerContentDate = document.createElement("p");
    //         headerContentDate.className = "text-md-left col font-weight-bold";
    //         headerContentDate.innerText = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`+ " " +
    //             `${slovakNames[date.getMonth()][date.getDate()]}` ;
    //         // headerContentDate.innerText = `${slovakNames[date.getMonth()][date.getDate()]}`;
    //         container.appendChild(headerContentDate)
    //         // const headerContentName = document.createElement("p");
    //         // headerContentName.className = "text-md-right col font-weight-bold";
    //         //
    //         // container.appendChild(headerContentName)
    //         });
}


function createMenu(menu, listAttr){


    let home = document.createElement("a")
    home.classList = "navbar-brand"
    home.setAttribute("href","../web/index.html")
    home.textContent = "Home"
    menu.appendChild(home)
    let button = document.createElement("button")
    button.classList = "navbar-toggler"
    button.setAttribute("type", "button")
    button.setAttribute("data-toggle", "collapse")
    button.setAttribute("data-target", "#main_nav")
    let icon = document.createElement("span")
    icon.classList = "navbar-toggler-icon"
    button.appendChild(icon)
    menu.appendChild(button)

    let item = document.createElement("div")
    item.classList = "collapse navbar-collapse"
    item.id = "main_nav"

    let list = document.createElement("ul")
    list.classList = "navbar-nav"

    let list2 = document.createElement("ul")
    list2.classList = "navbar-nav ml-auto"

    let dropdown = document.createElement("li")
    dropdown.classList = "nav-item dropdown"

    let dropdown2 = document.createElement("li")
    dropdown.classList = "nav-item dropdown"

    let dropdown3 = document.createElement("li")
    dropdown.classList = "nav-item dropdown"

    let listItem = document.createElement("a")
    listItem.classList = "nav-link dropdown-toggle"
    listItem.setAttribute("data-toggle","dropdown")
    listItem.setAttribute("href","")
    listItem.textContent = "  Games  "
    dropdown.appendChild(listItem)

    let listItem2 = document.createElement("visit-counter")
    listItem2.style.color = "white";
    listItem2.classList = "nav "
    dropdown2.appendChild(listItem2)

    addCalendar(dropdown3)

    dropdown.appendChild(listAttr)

    list.appendChild(dropdown)
    list2.appendChild(dropdown3)
    list2.appendChild(dropdown2)

    item.appendChild(list)
    item.appendChild(list2)

    menu.appendChild(item)
}

function createGameAuthor(game, list, index){
    if (index === 0){
        list.classList = "dropdown-menu"
    }
    let second = document.createElement("li")
    let secondA = document.createElement("a")
    secondA.classList = "dropdown-item"
    secondA.setAttribute("href","")
    secondA.textContent = game.autor + " "
    second.appendChild(secondA)
    createGameName(game, second)
    list.appendChild(second)
}

function createGameName(game, list){
    let first = document.createElement("ul")
    first.classList = "submenu dropdown-menu"
    let second = document.createElement("li")
    let secondA = document.createElement("a")
    secondA.classList = "dropdown-item"
    secondA.setAttribute("href", game.src)
    secondA.textContent = game.nazov
    second.appendChild(secondA)
    first.appendChild(second)
    list.appendChild(first)
}
