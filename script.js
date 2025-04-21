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
		livello: 1,
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
	document.querySelector("#livelloSuccessivoButton").disabled = true
	document.querySelector("#livelloSuccessivoButton").style.display = "none"

	// stampare
	conteggioLivello()

	stampaGriglia()

	paroles()

	salvaJson()

	stampaLettereIndizio()
}

function stampaLettereIndizio() {
	const partita = JSON.parse(localStorage.getItem("partita"))
	console.log(partita)

	if (!partita) {
		console.error("ERRORE: non è presente nessun salvataggio nel localStorage")
		alert("ERRORE: non è presente nessun salvataggio nel localStorage")
	} else {
		const livelloCorrente = partita.livello
		const keyNumLivello = "livello" + livelloCorrente
		const parola = partita[keyNumLivello].parola

		console.log("parola da indovinare del livello corrente:", parola)

		let arrayParola = parola.split("")
		let letteraSuggerita = arrayParola[0].toUpperCase()
		console.log("lettera suggerita:", letteraSuggerita)

		let parolaConIndizi = [letteraSuggerita, "", "", "", ""]

		for (let j = 0; j <= 4; j++) {
			let keyNumTentativi = "t" + j

			partita[keyNumLivello].tentativi[keyNumTentativi] = parolaConIndizi
		}

		for (let r = 0; r < 5; r++) {
			for (let c = 0; c < 5; c++) {
				let nCella = "#cella_" + r + "_" + c

				document.querySelector(nCella).value = parolaConIndizi[c]

				if (document.querySelector(nCella).value != "") {
					document.querySelector(nCella).readOnly = true
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

	const livelloCorrente = partita.livello
	const livello = "livello" + livelloCorrente

	const keyNumTentativi = "t" + nTentativi
	//
	let parola = partita[livello].parola

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

		// Blocca la riga attuale
		for (let c = 0; c < 5; c++) {
			let nCella = "#cella_" + nTentativi + "_" + c
			document.querySelector(nCella).readOnly = true
		}

		// Abilita la prossima riga solo se esiste
		if (nTentativi + 1 < 5) {
			for (let c = 0; c < 5; c++) {
				let nCella = "#cella_" + (nTentativi + 1) + "_" + c
				document.querySelector(nCella).disabled = false
			}
		}

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
			// Solo la riga 0 è abilitata all'inizio
			const disabled = r === 0 ? "" : "disabled"

			input += `
					<label>
						<input id="${nCella}" type="text" maxlength="1" pattern="[A-Za-z]" ${disabled} style="text-transform: uppercase;">
					</label>
				`
		}
		input += "<br><br>"
	}
	document.querySelector("#input").innerHTML = input
}

function recuperaParola() {
	var reader = new FileReader()
	reader.onload = function (event) {
		var testo = event.target.result
		document.querySelector("contenuto").innerHTML = testo
	}
	reader.readAsText(file)
}

function verificaTentativo(arrayParola, arrayParolaInserita) {
	let parolaIndovinata = true

	// Crea manualmente un nuovo array in maiuscolo senza usare .map()
	let arrayParolaMaiuscola = []
	for (let i = 0; i < arrayParola.length; i++) {
		arrayParolaMaiuscola.push(arrayParola[i].toUpperCase())
	}

	for (let i = 0; i < 5; i++) {
		let nCella = "#cella_" + nTentativi + "_" + i
		let letteraInserita = arrayParolaInserita[i]
		//lettera giusta in posizione giusta
		if (arrayParolaMaiuscola[i] === letteraInserita) {
			document.querySelector(nCella).style.backgroundColor = "lightgreen"
			//lettera giusta in posizione sbagliata
		} else if (arrayParolaMaiuscola.includes(letteraInserita)) {
			document.querySelector(nCella).style.backgroundColor = "yellow"
			parolaIndovinata = false
		} else {
			//lettera non presente
			document.querySelector(nCella).style.backgroundColor = "lightgray"
			parolaIndovinata = false
		}
	}

	if (parolaIndovinata) {
		document.querySelector("#ris").innerHTML = "Hai indovinato! ✅"
		document.querySelector("#livelloSuccessivoButton").disabled = false
		document.querySelector("#livelloSuccessivoButton").style.display = "inline-block"
	}
}

function conteggioLivello() {
	let partita = JSON.parse(localStorage.getItem("partita"))

	if (!partita) {
		console.error("ERRORE: Nessuna partita trovata nel localStorage.")
	} else {
		let conteggioLivello = partita.livello
		document.querySelector("#numeroLivello").innerHTML = "Livello: " + conteggioLivello
		console.log("livello:", conteggioLivello)

		if (partita.livello1.t4 != "") {
			document.querySelector("#ris").innerHTML = "Complimenti! Hai totalizzato n punti"
			document.querySelector("#livelloSuccessivoButton").disabled = true
			document.querySelector("#livelloSuccessivoButton").style.display = "none"
		}
	}
}

function livelloSucessivo() {
	let partita = JSON.parse(localStorage.getItem("partita"))

	if (partita.livello < 3) {
		partita.livello += 1
		localStorage.setItem("partita", JSON.stringify(partita))

		// Ricrea la griglia e ricarica gli indizi
		nTentativi = 0
		stampaGriglia()
		stampaLettereIndizio()
		conteggioLivello()

		// Nascondi nuovamente il pulsante
		document.querySelector("#livelloSuccessivoButton").disabled = true
		document.querySelector("#livelloSuccessivoButton").style.display = "none"

		document.querySelector("#ris").innerHTML = ""
	} else {
		document.querySelector("#ris").innerHTML = "Hai completato tutti i livelli! 🎉"
		document.querySelector("#livelloSuccessivoButton").disabled = true
		document.querySelector("#livelloSuccessivoButton").style.display = "none"
	}
}
