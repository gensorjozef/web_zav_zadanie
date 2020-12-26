
class ConversionDateName extends HTMLElement
{
    constructor() {
        super();

        this._matchRegex = 1;
        this._formCard = "";
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

    async connectedCallback() {
        await this.fetchJson()
        this._formCard = this.createCard(this._slovakNames);
        this.shadow.appendChild(this._formCard);
    }

    async fetchJson()
    {
        const response = await fetch("../json/slovak_names.json");

        this._slovakNames = await response.json()
    }

    createCard()
    {
        const div = document.createElement("div");

        const card = document.createElement("div");
        card.setAttribute("class","card mt-5 mb-5");
        card.style.width = "600px";
        card.style.height = "auto";

        const cardHeader = document.createElement("div");
        cardHeader.className = "card-header row";
        const date = new Date();


        const headerContentDate = document.createElement("p");
        headerContentDate.className = "text-md-left col font-weight-bold";
        headerContentDate.innerText = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

        const headerContentName = document.createElement("p");
        headerContentName.className = "text-md-right col font-weight-bold";
        headerContentName.innerText = `${this._slovakNames[date.getMonth()][date.getDate()]}`;

        cardHeader.appendChild(headerContentDate)
        cardHeader.appendChild(headerContentName)

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

        const dateConversionDiv = document.createElement("div");
        dateConversionDiv.className = "list-group-item";

        const resultDateToName = document.createElement("textarea");
        resultDateToName.className = "form-control mt-3";
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
              resultDateToName.innerHTML = `${this.searchName(this._inputDate)}`;
          } else {
              resultDateToName.innerHTML = `Date is not valid, conversion can not be performed`;
          }
        };

        dateConversionDiv.appendChild(inputDate);
        dateConversionDiv.appendChild(resultDateToName);
        dateConversionDiv.appendChild(dateToNameBtn);

        const nameConversionDiv = document.createElement("div");
        nameConversionDiv.className = "list-group-item";

        const resultNameToDate = document.createElement("textarea");
        resultNameToDate.className = "form-control mt-3";
        resultNameToDate.rows = 2;
        resultNameToDate.placeholder = "Here will appear result of conversion.";
        resultNameToDate.innerText = "";

        const inputName = this.createFormGroup("Find date for a given name", "text", "name", "Enter name");

        const nameToDateBtn = document.createElement("button");
        nameToDateBtn.id = "convertButton";
        nameToDateBtn.setAttribute("class", "btn btn-secondary mt-3");
        nameToDateBtn.innerText = "Convert to date";
        nameToDateBtn.onclick = (event) => {
            event.preventDefault();

            resultNameToDate.innerText = `${this.searchDate(this._inputName)}`;
        };

        nameConversionDiv.appendChild(inputName);
        nameConversionDiv.appendChild(resultNameToDate)
        nameConversionDiv.appendChild(nameToDateBtn);

        form.appendChild(dateConversionDiv);
        form.appendChild(nameConversionDiv);

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
        div.className = "form-group ";

        const label = document.createElement("label");
        label.setAttribute("for", inputId);
        label.innerText = labelText;

        const input = document.createElement("input");
        input.type = inputType;
        input.id = inputId;
        input.className = "form-control w-50 input font-weight-italic";
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

    searchName(date)
    {
        let splitDate = date.split(".");

        return this._slovakNames[splitDate[1] - 1][splitDate[0]];
    }

    searchDate(name)
    {
        const normalizedName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const date = new Date();
        let result = "Unknown name";

        for (let month = 0; month < Object.keys(this._slovakNames).length; month++) {
            for (let day = 1; day <= Object.keys(this._slovakNames[month]).length; day++) {
                const normalizedRecord = this._slovakNames[month][day].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                const currentDayNames = normalizedRecord.split(", ");

                if (currentDayNames.includes(normalizedName)) {
                    result = `${day}.${(month + 1)}.${date.getFullYear()}`;
                    break;
                }
            }
        }
        return result;
    }
}

customElements.define("conversion-date-name", ConversionDateName);
