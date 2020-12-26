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
            // jQuery code

            //////////////////////// Prevent closing from click inside dropdown
            $(document).on('click', '.dropdown-menu', function (e) {
                e.stopPropagation();
            });

            // make it as accordion for smaller screens
            if ($(window).width() < 992) {
                $('.dropdown-menu a').click(function(e){
                    e.preventDefault();
                    if($(this).next('.submenu').length){
                        $(this).next('.submenu').toggle();
                    }
                    $('.dropdown').on('hide.bs.dropdown', function () {
                        $(this).find('.submenu').hide();
                    })
                });
            }
        })
    $(document).ready(function() {


    }); // jquery end
})

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

    let listItem = document.createElement("a")
    listItem.classList = "nav-link dropdown-toggle"
    listItem.setAttribute("data-toggle","dropdown")
    listItem.setAttribute("href","")
    listItem.textContent = "  Games  "
    dropdown.appendChild(listItem)

    let listItem2 = document.createElement("visit-counter")
    listItem2.classList = "nav "
    dropdown2.appendChild(listItem2)


    dropdown.appendChild(listAttr)

    list.appendChild(dropdown)
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
    secondA.textContent = game.autor + " \u00bb"
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
