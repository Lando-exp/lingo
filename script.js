var parole = [
    "maree", "isola", "piano", "verde", "gatto",
    "libro", "tavolo", "sedia", "porta", "finestra",
    "albero", "fiore", "cielo", "vento", "acqua",
    "fuoco", "terra", "notte", "giorno", "amico",
    "amore", "cuore", "mano", "donna", "uomo",
    "tempo", "sogno", "canto", "rumore", "odore"
];

var nTentativi = 0

function preparaGioco() {
    // stampare griglia
    stampaGriglia()


    // scegliere la parola
    scegliParola(parole)


    stampaLettereIndizio()


}

function stampaLettereIndizio() {
    let parola = localStorage.getItem("soluzione")
    console.log(parola)

    let letteraSuggerita1 = ""
    let letteraSuggerita2 = ""

    arrayParola = parola.split("")

    letteraSuggerita1 = arrayParola[nCasuale(arrayParola)]
    console.log("lettera suggerita 1:", letteraSuggerita1)

    do {
        letteraSuggerita2 = arrayParola[nCasuale(arrayParola)]

        console.log("lettera suggerita 2:", letteraSuggerita2)

    } while (letteraSuggerita1 == letteraSuggerita2)


    let parolaConIndizi = ["", "", "", "", ""]

    parolaConIndizi[trovaIndice(arrayParola, letteraSuggerita1)] = letteraSuggerita1
    parolaConIndizi[trovaIndice(arrayParola, letteraSuggerita2)] = letteraSuggerita2

    localStorage.setItem("parolaConIndizi", JSON.stringify(parolaConIndizi))
    parolaConIndizi = JSON.parse(localStorage.getItem("parolaConIndizi"))

    console.log("parolaConIndizi", parolaConIndizi)

    for (let r = 0; r < 6; r++) {

        for (let c = 0; c < 5; c++) {

            nCella = "#cella_" + r + "_" + c;

            document.querySelector(nCella).value = parolaConIndizi[c]
            
            /*
            document.querySelector(nCella).readOnly = true

             if (document.querySelector(nCella).value == "") {
                 document.querySelector(nCella).readOnly = false
             }
            */
        }
    }
}


function tentativi() {
    let tentativo = ""

    for (let r = 0; r <= nTentativi; r++) {


        for (let c = 0; c < 5; c++) {

            nCella = "#cella_" + nTentativi + "_" + c;

            if(document.querySelector(nCella) == "") {
                alert("errore: uno o più campi sono vuoti")
            } else {
                tentativo += document.querySelector(nCella).value
            }
        }
    }

    console.log("tentativoooo", tentativo)

    }


    function nCasuale(parola) {

        let nCasuale = Math.floor(Math.random() * parola.length)
        return nCasuale
    }

    function trovaIndice(array, elemento) {
        return array.indexOf(elemento);
    }


    function scegliParola(parole) {

        // memorizzare nel local storage
        let parolaScelta = parole[nCasuale(parole)]
        console.log(parolaScelta)

        localStorage.setItem("soluzione", parolaScelta)

    }

    function stampaGriglia() {
        let input = ""
        let nCella = ""

        for (let r = 0; r < 6; r++) {


            for (let c = 0; c < 5; c++) {
                nCella = "cella_" + r + "_" + c;
                input += `
                    <label>
                        <input id="${nCella}" type="text" maxlength="1" pattern="[A-Za-z]" style="text-transform: uppercase;">
                    </label>
                    `
            }
            input += "<br><br>"
        }
        document.querySelector("#input").innerHTML = input
        input += "<br>"
    }
