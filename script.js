var parole = [
	"sasso",
	"sedia",
	"gatto",
	"fiore",
	"penna",
	"radio",
	"piano",
	"banca",
	"ruota",
	"scudo",
	"vento",
	"acqua",
	"notte",
	"baffi",
	"marea",
	"isola",
	"libro",
	"palla",
	"porta",
	"cielo",
	"fuoco",
	"gioco",
	"tempo",
	"miele",
	"canto",
	"sogno",
	"birra",
	"amore",
	"corsa",
	"campo",
]

let parola1, parola2, parola3

function paroles() {
	//riga che crea una copia dell’array
	let paroleDisponibili = [...parole]
	parola1 = scegliParola(paroleDisponibili)
	parola2 = scegliParola(paroleDisponibili)
	parola3 = scegliParola(paroleDisponibili)
}

function salvaJson() {
	partita = {
		punteggio: 10,

		livello1: {
			parola: parola1,

			tentativi: {
				t0: [null, null, null, null, null],
				t1: [null, null, null, null, null],
				t2: [null, null, null, null, null],
				t3: [null, null, null, null, null],
				t4: [null, null, null, null, null],
			},
		},

		livello2: {
			parola: parola2,

			tentativi: {
				t0: [null, null, null, null, null],
				t1: [null, null, null, null, null],
				t2: [null, null, null, null, null],
				t3: [null, null, null, null, null],
				t4: [null, null, null, null, null],
			},
		},

		livello3: {
			parola: parola3,

			tentativi: {
				t0: [null, null, null, null, null],
				t1: [null, null, null, null, null],
				t2: [null, null, null, null, null],
				t3: [null, null, null, null, null],
				t4: [null, null, null, null, null],
			},
		},
	}

	localStorage.setItem("partita", JSON.stringify(partita))
}

function preparaGioco() {
	// stampare
	gestioneLivello()

	stampaGriglia()

	paroles()

	salvaJson()

	stampaLettereIndizio()

	console.log("drop", partita.livello1.tentativi.t1[0])
}

function stampaLettereIndizio() {
	const partita = JSON.parse(localStorage.getItem("partita"))
	console.log(partita)

	if (!partita) {
		console.error("ERRORE: non è presente nessun salvataggio nel localStorage")
		alert("ERRORE: non è presente nessun salvataggio nel localStorage")
	} else {
		for (let i = 1; i <= 3; i++) {
			let keyNumLivello = "livello" + i
			let keyNumTentativi = ""
			let parola = partita[keyNumLivello].parola
			console.log("\n\n", parola)

			let arrayParola = parola.split("")

			letteraSuggerita = arrayParola[0].toUpperCase()
			console.log("lettera suggerita:", letteraSuggerita)

			let parolaConIndizi = [letteraSuggerita, "", "", "", ""]

			for (let j = 0; j <= 4; j++) {
				keyNumTentativi = "t" + j

				partita[keyNumLivello].tentativi[keyNumTentativi] = parolaConIndizi
			}

			for (let r = 0; r < 5; r++) {
				for (let c = 0; c < 5; c++) {
					let nCella = "#cella_" + r + "_" + c

					document.querySelector(nCella).value = partita[keyNumLivello].tentativi[keyNumTentativi][c]
					if (document.querySelector(nCella).value != "") {
						document.querySelector(nCella).readOnly = true
					}
				}
			}
		}
	}

	localStorage.setItem("partita", JSON.stringify(partita))
}

let nTentativi = 0
function tentativi() {
	const partita = JSON.parse(localStorage.getItem("partita"))

	let tentativoValido = true
	let parolaInserita = []

	const livello = "livello1"
	const keyNumTentativi = "t" + nTentativi
	//
	let parola = partita[livello].parola
	console.log(parola)

	for (let c = 0; c < 5; c++) {
		let nCella = "#cella_" + nTentativi + "_" + c
		let valore = document.querySelector(nCella).value.toUpperCase()

		if (valore == "") {
			alert("ERRORE: uno o più campi sono vuoti.")
			tentativoValido = false
			break
		}

		parolaInserita.push(valore)
	}

	if (tentativoValido) {
		partita[livello].tentativi[keyNumTentativi] = parolaInserita

		localStorage.setItem("partita", JSON.stringify(partita))
		console.log(`Tentativo ${keyNumTentativi}:`, parolaInserita)

		verificaTentativo(parola, parolaInserita)

		nTentativi++

		if (nTentativi >= 5) {
			document.querySelector("#ris").innerHTML = "Hai perso"
		}
	}
}

function nCasuale(parola) {
	let nCasuale = Math.floor(Math.random() * parola.length)
	return nCasuale
}

function trovaIndice(array, elemento) {
	return array.indexOf(elemento)
}

function scegliParola(parole) {
	let indice = Math.floor(Math.random() * parole.length)
	let parola = parole[indice]
	//The splice() method of Array instances changes the contents of an array
	//by removing or replacing existing elements and/or adding new elements in place.
	parole.splice(indice, 1)
	return parola
}

function stampaGriglia() {
	let input = ""
	let nCella = ""

	for (let r = 0; r < 5; r++) {
		for (let c = 0; c < 5; c++) {
			nCella = "cella_" + r + "_" + c
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

function recuperaParola() {
	var reader = new FileReader()
	reader.onload = function (event) {
		var testo = event.target.result
		document.document.querySelector("contenuto").innerHTML = testo
	}
	reader.readAsText(file)
}

function verificaTentativo(arrayParola, arrayParolaInserita) {
	for (let i = 0; i < 5; i++) {
		let nCella = "cella_" + r + "_" + c

		if (arrayParola.indexOf[i] == parolaInserita.indexOf[i] && arrayParola[i] == parolaInserita[i]) {
			document.querySelector(nCella).readOnly
			document.querySelector(nCella).style.backgroundColor = "lightgreen"
		} else {
			if (arrayParola.indexOf[i] != parolaInserita.indexOf[i] && arrayParola.include(arrayParolaInserita(i))) {
				document.querySelector(nCella).style.backgroundColor = "yellow"
			}
		}
	}
}

let livello = 3
function gestioneLivello() {
	let nLivello = 1

	for (let i = 0; i <= livello; i++) {
		let numLivello = "<button> type=button onclick='gestioneLivello'> Livello:  " + nLivello
		document.querySelector("conteggioLivello").innerHTML = numLivello
	}
}
