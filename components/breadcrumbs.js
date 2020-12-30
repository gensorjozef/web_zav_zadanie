/* Breadcrumbs
	webkomponent
		- <bread-crumbs></bread-crumbs>
		- <div id="breadcrumbs"> <a> <a> .. </div>

*/


function setBreadcrumbs(title, location){
	let data = updateBreadcrumbs(title, location);
	data = deleteBreadcrumb(data);
	saveBreadcrumbs(data);
	return createBreadcrumbs(data);
}

// Update
// nacita data zo sessionStoragu a prida aktualnu stranku
function updateBreadcrumbs(title, location){
	let data = JSON.parse(sessionStorage.getItem('data'));
	if(data === null){
		data = new Array(2);
	}

	if(!data[0]){
		data[0] = [title];
		data[1] = [location];
	}else{
		data[0][data[0].length] = title;
		data[1][data[1].length] = location;
	}

	return data;
}

// Delete
// vymaze posledne linky ak je v histori viac ako 5 stranok
function deleteBreadcrumb(data){
	if(data[0].length > 5){
		data[0].splice(0, data[0].length-5);
		data[1].splice(0, data[1].length-5);
	}

	return data;
}

// Save
// ukladanie do sessionStoragu
function saveBreadcrumbs(data){
	sessionStorage.setItem('data',JSON.stringify(data));
}

// Create
// Vytvorenie stringu, pouzivany pri vytvarani webkomponentu
function createBreadcrumbs(data){
	let string = "<style>#breadcrumbs { margin-top: 20px }</style><div id='breadcrumbs'>";

	for (let i = 0; i < data[0].length; i++) {
		string += "<a href='" + data[1][i] + "'>" + data[0][i] + " </a>"
		if (i < data[0].length - 1) {
			string += " > ";
		}
	}
	string += "</div>";

	return string;
}

// Webkomponent
class Breadcrumbs extends HTMLElement{

	constructor(){
		super();
		this.breadcrumbs = setBreadcrumbs(document.title, document.location.href);
	}

    connectedCallback(){
        this.innerHTML = this.breadcrumbs;
    };
}

customElements.define('bread-crumbs', Breadcrumbs);