
class ConversionDateName extends HTMLElement
{
    constructor()
    {
        super();

        this._matchRegex = 1;
        this._formCard = "";
        this._selectedLanguage = "SKd";
        this._inputName = "";
        this._inputDate = "";
        this._slovakNames = [];

        this.shadow = this.attachShadow({mode: "open"} );
        this.shadow.innerHTML = `
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">

            <style>
               .tooltip-text {
                visibility: hidden;
                width: 300px;
                height: 70px;
                background-color: #302e33;
                color: white;
                text-align: center;
                border-radius: 8px;
                border: thin solid black;
                padding: 10px 0;
                position: absolute;
                top: 13%;
                left: 42%;
                margin-left: 95px;
                z-index: 10;
            }
            .tooltip-text::after {
                content: " ";
                position: absolute;
                bottom: 40%;
                right: 100%;
                margin-left: -5px;
                border-width: 5px;
                border-style: solid;
                border-color: transparent black transparent transparent;
            }
            .card {
                width: 60rem;
                height: auto;
            }
            </style>
        `;
    }

    async connectedCallback()
    {
        await this.fetchJson()
        this._formCard = this.createCard(this._slovakNames);
        this.shadow.appendChild(this._formCard);
    }

    async fetchJson()
    {
        const response = await fetch("../json/names.json");

        this._slovakNames = await response.json();
        this._slovakNames = this._slovakNames["slovakNames"];
    }

    searchName(day, month)
    {
        let result = "";

        for (let name = 0; name < this._slovakNames.length; name++) {
             let parsedMonth = parseInt(this._slovakNames[name]["den"].slice(0, 2));
             let parsedDay = parseInt(this._slovakNames[name]["den"].slice(2, 4));

             if (parsedMonth === parseInt(month) && parsedDay === parseInt(day)) {
                 if (this._selectedLanguage === "SKd" && (this._slovakNames[name]["SKsviatky"] !== undefined)) {
                     result = this._slovakNames[name]["SKsviatky"];
                 }
                 if (this._selectedLanguage === "CZ" && (this._slovakNames[name]["CZsviatky"] !== undefined)) {
                     result = this._slovakNames[name]["CZsviatky"];
                 }
                 if (this._selectedLanguage === "SKd" && (this._slovakNames[name]["SKdni"] !== undefined)) {
                     result = this._slovakNames[name]["SKdni"];
                 }
                 if ((this._slovakNames[name][this._selectedLanguage] !== undefined)) {
                     result = `${this._slovakNames[name][this._selectedLanguage]} \n${result}`;
                 }
                 break;
             }
        }
        return result;
    }

    searchDate(name)
    {
        const normalizedName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        let result = "";
        let ret = ``;

        for (let record = 0; record < Object.keys(this._slovakNames).length; record++) {
            if (this._selectedLanguage === "SKd" && (this._slovakNames[record]["SKsviatky"] !== undefined)) {
                result = this.findNameInCurrentDayNames(normalizedName, "SKsviatky", record);
                if (result !== "Name not recognized in this calendar") {
                    ret = `${ret} \n${result}`;
                }
            }
            if (this._selectedLanguage === "CZ" && (this._slovakNames[record]["CZsviatky"] !== undefined)) {
                result = this.findNameInCurrentDayNames(normalizedName, "CZsviatky", record);
                if (result !== "Name not recognized in this calendar") {
                    ret = `${ret} \n${result}`;
                }
            }
            if (this._selectedLanguage === "SKd" && (this._slovakNames[record]["SKdni"] !== undefined)) {
                result = this.findNameInCurrentDayNames(normalizedName, "SKdni", record);
                if (result !== "Name not recognized in this calendar") {
                    ret = `${ret} \n${result}`;
                }
            }
            if (this._slovakNames[record][this._selectedLanguage] !== undefined) {
                result = this.findNameInCurrentDayNames(normalizedName, this._selectedLanguage, record)
                if (result !== "Name not recognized in this calendar") {
                    ret = `${ret} \n${result}`;
                }
            }
        }
        return ret;
    }

    findNameInCurrentDayNames(normalizedName, field, record)
    {
        let normalizedRecord = this._slovakNames[record][field].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        let currentDayNames = normalizedRecord.split(", ");

        if (currentDayNames.includes(normalizedName)) {
            console.log(currentDayNames)
            let parsedMonth = this._slovakNames[record]["den"].slice(0, 2);
            let parsedDay = this._slovakNames[record]["den"].slice(2, 4);
            console.log(parsedDay + " " + parsedMonth + " "  + field)

            return `${parsedDay}.${parsedMonth}.`;
        }
        return "Name not recognized in this calendar";
    }

    createCard()
    {
        const div = document.createElement("div");

        const card = document.createElement("div");
        card.setAttribute("class","card mb-5");

        const cardHeader = document.createElement("div");
        cardHeader.className = "card-header";

        const divHeaderContent = document.createElement("div");
        divHeaderContent.className = "row";

        const date = new Date();

        const headerContentDate = document.createElement("p");
        headerContentDate.className = "text-left col-md-6 font-weight-bold";
        headerContentDate.innerText = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

        const headerContentName = document.createElement("p");
        headerContentName.className = "text-right col-md-6 font-weight-bold";
        headerContentName.className = "text-right col-md-6 font-weight-bold";

        const todayName = this.searchName(date.getDate(), date.getMonth() + 1);
        if (todayName === "") {
            headerContentName.innerText = `No result in this calenader`;
        } else {
            headerContentName.innerText = `${todayName}`;
        }

        divHeaderContent.appendChild(headerContentDate);
        divHeaderContent.appendChild(headerContentName);

        cardHeader.appendChild(divHeaderContent);

        card.appendChild(cardHeader);

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";
        cardBody.id = "card";

        cardBody.appendChild(this.createForm());

        card.appendChild(cardBody);
        div.appendChild(card);

        return div;
    }

    createForm()
    {
        const form = document.createElement("form");
        form.id = "form";
        form.action = "";

        const conversionsDiv = document.createElement("div");
        conversionsDiv.className = "row";

        const dropdownLanguageDiv = document.createElement("div");

        const labelLanguage = document.createElement("label");
        labelLanguage.for = "language";

        const selectLanguage = document.createElement("select");
        selectLanguage.className = "form-control";
        selectLanguage.name = "language";

        const choose = document.createElement("option");
        choose.disabled = true;
        choose.innerText = "Choose calendar language";
        const sk = document.createElement("option");
        sk.innerText = "SKd";
        sk.selected = true;
        const hu = document.createElement("option");
        hu.innerText = "HU";
        const cz = document.createElement("option");
        cz.innerText = "CZ";
        const pl = document.createElement("option");
        pl.innerText = "PL";
        const at = document.createElement("option");
        at.innerText = "AT";

        selectLanguage.appendChild(choose);
        selectLanguage.appendChild(sk);
        selectLanguage.appendChild(cz);
        selectLanguage.appendChild(hu);
        selectLanguage.appendChild(pl);
        selectLanguage.appendChild(at);
        selectLanguage.onchange = () => {
            this._selectedLanguage = selectLanguage.value;
        };

        labelLanguage.appendChild(selectLanguage);

        dropdownLanguageDiv.appendChild(labelLanguage);

        const dateConversionDiv = document.createElement("div");
        dateConversionDiv.className = "list-group-item col mr-2 ml-2";

        const resultDateToName = document.createElement("textarea");
        resultDateToName.className = "form-control w-100 mt-3";
        resultDateToName.placeholder = "Here will appear result of conversion.";
        resultDateToName.rows = 2;
        resultDateToName.innerText = "";

        const inputDate = this.createFormGroup("Find name for a given date", "text", "date", "Enter date");

        const dateToNameBtn = document.createElement("button");
        dateToNameBtn.id = "convertButton";
        dateToNameBtn.setAttribute("class", "btn btn-secondary mt-3");
        dateToNameBtn.innerText = "Convert to name";
        dateToNameBtn.onclick = (event) => {
          event.preventDefault();

          if (this._matchRegex) {
              const parsedInputDate = this._inputDate.split(".");

              resultDateToName.innerHTML = `${this.searchName(parsedInputDate[0], parsedInputDate[1])}`;
          } else {
              resultDateToName.innerHTML = `Date is not valid, conversion can not be performed`;
          }
        };

        dateConversionDiv.appendChild(inputDate);
        dateConversionDiv.appendChild(resultDateToName);
        dateConversionDiv.appendChild(dateToNameBtn);

        const nameConversionDiv = document.createElement("div");
        nameConversionDiv.className = "list-group-item col mr-2 ml-2";


        const resultNameToDate = document.createElement("textarea");
        resultNameToDate.className = "form-control w-100 mt-3";
        resultNameToDate.rows = 2;
        resultNameToDate.placeholder = "Here will appear result of conversion.";
        resultNameToDate.innerText = "";

        const inputName = this.createFormGroup("Find date for a given name or holiday", "text", "name", "Enter name");

        const nameToDateBtn = document.createElement("button");
        nameToDateBtn.id = "convertButton";
        nameToDateBtn.setAttribute("class", "btn btn-secondary mt-3");
        nameToDateBtn.innerText = "Convert to date";
        nameToDateBtn.onclick = (event) => {
            event.preventDefault();

            const findDate = this.searchDate(this._inputName);

            if (findDate === "") {
                resultNameToDate.innerText = `Input not recognized in this calendar`;
            } else {
                resultNameToDate.innerText = `${findDate}`;
            }
        };

        nameConversionDiv.appendChild(inputName);
        nameConversionDiv.appendChild(resultNameToDate)
        nameConversionDiv.appendChild(nameToDateBtn);

        form.appendChild(dropdownLanguageDiv);
        conversionsDiv.appendChild(dateConversionDiv);
        conversionsDiv.appendChild(nameConversionDiv);
        form.appendChild(conversionsDiv);

        return form;
    }

    createTooltip()
    {
        const div = document.createElement("div");

        div.className = "tooltip-text";
        div.innerHTML = "Please fill this field in format <br> d/dd.m/mm.yy/yyyy";

        return div;
    }

    createFormGroup(labelText, inputType, inputId, placeholder)
    {
        const div = document.createElement("div");
        div.className = "form-group";

        const label = document.createElement("label");
        label.setAttribute("for", inputId);
        label.setAttribute("class", "control-label");
        label.innerText = labelText;

        const input = document.createElement("input");
        input.type = inputType;
        input.id = inputId;
        input.className = "form-control w-75 input font-weight-italic";
        input.placeholder = placeholder;

        const tooltip = this.createTooltip();

        div.appendChild(tooltip);
        div.appendChild(label);
        div.appendChild(input);

        if (inputId === "date") {
            input.oninput = (event) => {
                const dateRegex = "^((((0?[1-9]|[12]\\d|3[01])[\\.\\-\\/](0?[13578]|1[02])[\\.\\-\\/]((1[6-9]|[2-9]\\d)?\\d{2}))|((0?[1-9]|[12]\\d|30)[\\.\\-\\/](0?[13456789]|1[012])[\\.\\-\\/]((1[6-9]|[2-9]\\d)?\\d{2}))|((0?[1-9]|1\\d|2[0-8])[\\.\\-\\/]0?2[\\.\\-\\/]((1[6-9]|[2-9]\\d)?\\d{2}))|(29[\\.\\-\\/]0?2[\\.\\-\\/]((1[6-9]|[2-9]\\d)?(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)|00)))|(((0[1-9]|[12]\\d|3[01])(0[13578]|1[02])((1[6-9]|[2-9]\\d)?\\d{2}))|((0[1-9]|[12]\\d|30)(0[13456789]|1[012])((1[6-9]|[2-9]\\d)?\\d{2}))|((0[1-9]|1\\d|2[0-8])02((1[6-9]|[2-9]\\d)?\\d{2}))|(2902((1[6-9]|[2-9]\\d)?(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)|00))))$";

                if (!input.value.match(dateRegex)) {
                    tooltip.style.visibility = "visible";
                    this._matchRegex = 0;
                } else {
                    tooltip.style.visibility = "hidden";
                    this._inputDate = input.value;
                    this._matchRegex = 1;
                }
            }
        }

        if (inputId === "name") {
            input.oninput = () => {
                this._inputName = input.value;
            }
        }
        return div;
    }
}

customElements.define("conversion-date-name", ConversionDateName);
