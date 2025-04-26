function salvaJson() {
	partita = {
		numLivelloCorrente: 1,
		punteggio: 10,

		livello1: {
			soluzione: parola1,

			tentativi: {
				t0: [null, null, null, null, null],
				t1: [null, null, null, null, null],
				t2: [null, null, null, null, null],
				t3: [null, null, null, null, null],
				t4: [null, null, null, null, null],
			},
		},

		livello2: {
			soluzione: parola2,

			tentativi: {
				t0: [null, null, null, null, null],
				t1: [null, null, null, null, null],
				t2: [null, null, null, null, null],
				t3: [null, null, null, null, null],
				t4: [null, null, null, null, null],
			},
		},

		livello3: {
			soluzione: parola3,

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

let arrayParole = []
function recuperaParole() {
	return fetch("parole.txt")
		.then((response) => {
			if (!response.ok) {
				throw new Error("Errore nel caricamento del file")
			}
			return response.text()
		})
		.then((text) => {
			arrayParole = text.split("\r\n")
			//console.log("Contenuto del file:", arrayParole)
		})
		.catch((error) => {
			console.log("Errore:", error)
		})
}

function conteggioLivello() {
	let partita = JSON.parse(localStorage.getItem("partita"))

	if (!partita) {
		console.error("ERRORE: Nessuna partita trovata nel localStorage.")
	} else {
		let conteggioLivello = partita.numLivelloCorrente
		document.querySelector("#text_numeroLivello").innerHTML = "Livello: " + conteggioLivello
		console.log("Livello:", conteggioLivello)
	}
}

let parola1, parola2, parola3
function scegliParola() {
	let partita = JSON.parse(localStorage.getItem("partita"))

	parola1 = arrayParole[Math.floor(Math.random() * arrayParole.length)]

	do {
		parola2 = arrayParole[Math.floor(Math.random() * arrayParole.length)]
	} while (parola2 == parola1)

	do {
		parola3 = arrayParole[Math.floor(Math.random() * arrayParole.length)]
	} while (parola3 == parola1 && parola3 != parola2)

	partita.livello1.soluzione = parola1
	//console.log(partita.livello1.soluzione)
	partita.livello2.soluzione = parola2
	//console.log(partita.livello2.soluzione)
	partita.livello3.soluzione = parola3
	//console.log(partita.livello3.soluzione)

	localStorage.setItem("partita", JSON.stringify(partita)) // <-- salva di nuovo
	//console.log(partita)
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
						<input id="${nCella}" type="text" maxlength="1" pattern="[A-Za-z]" ${disabled} style="text-transform: uppercase">
					</label>
				`
		}
		input += "<br><br>"
	}
	document.querySelector("#input").innerHTML = input
}

function stampaLettereIndizio() {
	let partita = JSON.parse(localStorage.getItem("partita"))

	if (!partita) {
		console.error("ERRORE: non è presente nessun salvataggio nel localStorage")
		alert("ERRORE: non è presente nessun salvataggio nel localStorage")
	} else {
		const numLivelloCorrente = partita.numLivelloCorrente
		//console.log("Livello: ", numLivelloCorrente)

		const keyLivello = "livello" + numLivelloCorrente
		const soluzione = partita[keyLivello].soluzione

		console.log("parola da indovinare:", soluzione)

		let arrayParola = soluzione.split("")
		let letteraSuggerita = arrayParola[0].toUpperCase()
		console.log("lettera suggerita:", letteraSuggerita)

		let arrayParolaConIndizi = [letteraSuggerita, "", "", "", ""]
		//console.log("arrayParolaConIndizi: ", arrayParolaConIndizi)

		for (let j = 0; j <= 4; j++) {
			const keyNumTentativi = "t" + j

			partita[keyLivello].tentativi[keyNumTentativi] = [...arrayParolaConIndizi]
		}

		for (let r = 0; r < 5; r++) {
			for (let c = 0; c < 5; c++) {
				let nCella = "#cella_" + r + "_" + c

				document.querySelector(nCella).value = arrayParolaConIndizi[c]
				//console.log("arrayParolaConIndizi[c]", arrayParolaConIndizi)

				//se la cella non è vuota la imposta come non modificabile (imposta la cella iniziale in cui c'è la lettera suggerita come non modificabile)
				if (document.querySelector(nCella).value != "") {
					document.querySelector(nCella).readOnly = true
				}
			}
		}
	}

	localStorage.setItem("partita", JSON.stringify(partita))
	console.log(partita)
}

let nTentativi = 0
function tentativi() {
	let partita = JSON.parse(localStorage.getItem("partita"))

	let tentativoValido = true
	let arrayParolaInserita = []

	const livelloCorrente = partita.numLivelloCorrente
	//console.log(livelloCorrente)
	const keyLivello = "livello" + livelloCorrente

	const keyNumTentativi = "t" + nTentativi

	let soluzione = partita[keyLivello].soluzione
	let arraySoluzione = []
	for (let i = 0; i < soluzione.length; i++) {
		arraySoluzione.push(soluzione[i].toUpperCase())
	}
	//console.log("ArraySoluzioneMaiusc", arraySoluzione)

	for (let c = 0; c < 5; c++) {
		let nCella = "#cella_" + nTentativi + "_" + c
		let valore = document.querySelector(nCella).value.toUpperCase()

		if (valore == "") {
			alert("ERRORE: uno o più campi sono vuoti.")
			tentativoValido = false
			break
		}

		arrayParolaInserita.push(valore)
	}

	if (tentativoValido) {
		partita[keyLivello].tentativi[keyNumTentativi] = arrayParolaInserita

		localStorage.setItem("partita", JSON.stringify(partita))
		console.log(`Tentativo ${keyNumTentativi}:`, arrayParolaInserita)
		console.log(partita)

		verificaTentativo(arraySoluzione, arrayParolaInserita)
		gestionePunteggio()

		// blocca la riga del tentativo appena inserito
		for (let c = 0; c < 5; c++) {
			let nCella = "#cella_" + nTentativi + "_" + c
			document.querySelector(nCella).readOnly = true
		}

		// abilita la riga del prossimo tentativo se esiste
		if (nTentativi + 1 < 5) {
			for (let c = 0; c < 5; c++) {
				let nCella = "#cella_" + (nTentativi + 1) + "_" + c
				document.querySelector(nCella).disabled = false
			}
		}

		nTentativi++

		if (nTentativi >= 5) {
			document.querySelector("#button_enter").disabled = true
			document.querySelector("#button_enter").style.display = "none"

			document.querySelector("#text_risultato").innerHTML = "Hai perso<br> Hai totalizzato " + partita.punteggio + " punti!<br>"
		}
	}
}

function verificaTentativo(arraySoluzione, arrayParolaInserita) {
	let parolaIndovinata = true

	let lettereDisponibili = [...arraySoluzione]

	for (let i = 0; i < 5; i++) {
		let nCella = "#cella_" + nTentativi + "_" + i
		let letteraInserita = arrayParolaInserita[i]

		//lettera giusta in posizione giusta
		if (arraySoluzione[i] === letteraInserita) {
			document.querySelector(nCella).style.backgroundColor = "lightgreen"
			lettereDisponibili[i] = null // questa lettera non è più disponibile
		} else {
			parolaIndovinata = false
		}
	}

	for (let i = 0; i < 5; i++) {
		let nCella = "#cella_" + nTentativi + "_" + i
		let letteraInserita = arrayParolaInserita[i]

		// Se la lettera inserita NON è già corretta e in posizione giusta (non è "verde")
		if (arraySoluzione[i] !== letteraInserita) {
			// Cerchiamo se la lettera inserita è presente in "lettereDisponibili"
			let index = lettereDisponibili.indexOf(letteraInserita)

			// Se troviamo la lettera (letteraInserita) in "lettereDisponibili" (index diverso da -1)
			if (index !== -1) {
				// lettera esiste nella parola ma è in posizione sbagliata (colore giallo)
				document.querySelector(nCella).style.backgroundColor = "yellow"

				// Dopo aver usato quella lettera, la eliminiamo da "lettereDisponibili"
				// (così non verrà più considerata per altri controlli)
				lettereDisponibili[index] = null
			} else {
				// Se NON troviamo la lettera nella parola (colore grigio)
				document.querySelector(nCella).style.backgroundColor = "lightgray"
			}
		}
	}

	if (parolaIndovinata) {
		document.querySelector("#text_risultato").innerHTML = "Hai indovinato!<br><br>"
		document.querySelector("#button_avanti").disabled = false
		document.querySelector("#button_avanti").style.display = "inline-block"
		document.querySelector("#button_enter").disabled = true
		document.querySelector("#button_enter").style.display = "none"
	}
}

function gestionePunteggio() {
	const partita = JSON.parse(localStorage.getItem("partita"))

	const numLivelloCorrente = partita.numLivelloCorrente
	//console.log("numLivelloCorrente", numLivelloCorrente)
	const keyLivello = "livello" + numLivelloCorrente
	//console.log("keyLivello", keyLivello)

	const soluzione = partita[keyLivello].soluzione.toUpperCase()

	let punteggio = partita.punteggio
	//console.log("punteggio", punteggio)

	document.querySelector("#text_punti").innerHTML = "Punti: " + punteggio

	//[] in [keyLivello] per accedere a una chiave dinamica
	if (partita[keyLivello].tentativi.t0.join("") == soluzione) {
		punteggio *= 3
	} else if (partita[keyLivello].tentativi.t1.join("") == soluzione || partita[keyLivello].tentativi.t2.join("") == soluzione) {
		punteggio *= 2
	}

	partita.punteggio = punteggio
	document.querySelector("#text_punti").innerHTML = "Punti: " + punteggio.toString()
	//console.log("Punteggio aggiornato:", punteggio)

	localStorage.setItem("partita", JSON.stringify(partita))
}

function livelloSuccessivo() {
	console.log("\n")

	let partita = JSON.parse(localStorage.getItem("partita"))

	if (partita.numLivelloCorrente < 3) {
		partita.numLivelloCorrente++
		localStorage.setItem("partita", JSON.stringify(partita))

		// Ricrea la griglia e ricarica gli indizi
		document.querySelector("#button_enter").disabled = false
		document.querySelector("#button_enter").style.display = "inline-block"
		nTentativi = 0
		conteggioLivello()
		stampaGriglia()
		stampaLettereIndizio()

		// Nascondi nuovamente il pulsante
		document.querySelector("#button_avanti").disabled = true
		document.querySelector("#button_avanti").style.display = "none"

		document.querySelector("#text_risultato").innerHTML = ""
	} else {
		document.querySelector("#text_risultato").innerHTML =
			"Hai Vinto!<br> Hai completato tutti i livelli!<br>Complimenti! Hai totalizzato " + partita.punteggio + " punti!"
		document.querySelector("#button_avanti").disabled = true
		document.querySelector("#button_avanti").style.display = "none"
	}
}

function gioco() {
	document.querySelector("#button_avanti").disabled = true
	document.querySelector("#button_avanti").style.display = "none"

	salvaJson()

	recuperaParole().then(() => {
		conteggioLivello()
		scegliParola()
		stampaGriglia()
		stampaLettereIndizio()
	})
}
