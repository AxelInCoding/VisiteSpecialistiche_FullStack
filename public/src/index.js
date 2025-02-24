import { navBarComponent } from "./scripts/navbar.js";
import { createForm } from "./scripts/createForm.js";
import { createTable } from "./scripts/createTable.js";
import { generateFetchComponent } from "./scripts/fetchCache.js";
import moment from "/moment/dist/moment.js";

const forwardButton = document.getElementById("ahead");
const backButton = document.getElementById("back");
let offset = 0;


const fetchComp = generateFetchComponent();
const types = await fetchComp.getAllTypes();
const booking = await fetchComp.getAllBooks();

const table = createTable(document.getElementById("avabTable"));
table.buildTable(booking);


const navbar = navBarComponent(document.getElementById("navbar"));
const f = createForm(document.querySelector(".content"));


await navbar.callback(async (element) => {
    forwardButton.onclick = () => {
        offset++;
        table.render(element, offset);
    };

    backButton.onclick = () => {
        offset--;
        table.render(element, offset);
    };

    table.render(element, offset);
    f.setLabels(["Data", "Ora", "Nominativo"]);
    f.oncancel(() => { table.render(element, offset); });
    f.render();
    f.onsubmit(async (values) => {
        let validateInput;
        const date = moment(values[0], "YYYY/MM/DD");
        const closed = ["Saturday", "Sunday"];
            
        if (date.calendar("MM/DD/YYYY") < moment().calendar("MM/DD/YYYY") || closed.includes(date.format("dddd")) || isNaN(values[1])) validateInput = false;
        for (let i = 0; i < values.length; i++) {
            if (!values[i]) {
                validateInput = false;
                document.getElementById("result").innerHTML = validateInput === true ? "Ok" : "Ko";
                break;
            }
        
        }
        const res = await fetchComp.getAllBooks().catch(() => {
            console.log(res);
            validateInput = false;
            document.getElementById("result").innerHTML = validateInput === true ? "Ok" : "Ko";
            return false;
        });

        const prenotation = res.filter((e) => e.type.toLowerCase() === element.name.toLowerCase());
        for (let i = 0; i < prenotation.length; i++) {
            if (prenotation[i].date.split("T")[0] === date["_i"] && prenotation[i].hour == values[1]) {
                validateInput = false;
                document.getElementById("result").innerHTML = validateInput === true ? "Ok" : "Ko";
                break;
            }
        };

        if (validateInput === undefined) {
            const booking = {
                idType: element.name,
                date: date.format("YYYY-MM-DD"),
                hour: values[1],
                name: values[2]
            };

            await fetchComp.addBook(booking).catch((error) => {
                validateInput = false;
                document.getElementById("result").innerHTML = validateInput === true ? "Ok" : "Ko";
                return false;
            });

            const newData = await fetchComp.getAllBooks();
            table.buildTable(newData);
            table.render(element, offset);
            validateInput = true;
            document.getElementById("result").innerHTML = validateInput === true ? "Ok" : "Ko";
            return true;
        } else {
            validateInput = false;
            document.getElementById("result").innerHTML = validateInput === true ? "Ok" : "Ko";
            return false;
        }
    });
});


f.render();
setInterval(() => {
    table.render(element, offset);
}, 300000);

navbar.build(types);
navbar.render();