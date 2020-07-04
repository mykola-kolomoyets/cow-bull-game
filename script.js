'use strict';
const LANG_DATA = {
	header: {
		headerText: "Cow-Bull Game",
		subheader: "Guess the 4-digit number with unrepeated digits"
	},
	input_placeholder_text: "Enter the number",
	hint: {
		btn_text: "Hint",
		text: "Hint (These numbers are not in the number)",
	},
	check: "Check the number",
	new_game: "New game",
	feedback: {
		title: "Ready?",
		moves: "Moves"
	},
	warning_not_number: "Non 4-digit number!!!",
	warning_repeat: "Digits repeat!!!",
	check_number_text: "Check the number",
	new_game_text: "New game",
	rules: {
		button_text: "Rules",
		header: "Cow-Bull game rules",
		body: `Hello!!
					<br>
					To win you have to guess the 4-digit number. Foe this you can write your hypothesizes inti the input field and check the number.
					<br>
					If you guesses the <b>digit</b> but the <b>position is incorrect</b>, it will be the cow. And if the digit is <b>correct</b> and the position is <b>correct</b> it will be the bull.
					<br>
					To win you have to guess all the 4 digits (have 4 bulls). 
					<hr>
					For example: <br>
					The number is 4682. If you write <b>4<i>8</i></b>91, you will have 1 cow and 1 bull, because 4 is correct, and 8 is correct, but incorrect position. And 9 with 1 are incorrect numbers.`,
		footer_text: "Close"
	},
	win: "YOU WIN!!!",
	cows: "Cows",
	bulls: "Bulls"
};

const numInput = document.querySelector("input[type='number']");
const checkBtn = document.querySelector(".check");
const restartBtn = document.querySelector(".restart");
const resultOutput = document.querySelector(".result h5");
const movesOutput = document.querySelector("h6");
const warningsOutput = document.querySelector(".warnings");
const hintBtn = document.querySelector(".hint");

// Setting the language
document.querySelector(".rules-btn").textContent = LANG_DATA.rules.button_text;
document.querySelector(".header h1").textContent = LANG_DATA.header.headerText;
document.querySelector(".header h3").textContent = LANG_DATA.header.subheader;
numInput.placeholder = LANG_DATA.check_number_text;
hintBtn.textContent = LANG_DATA.hint.btn_text;
checkBtn.textContent = LANG_DATA.check;
restartBtn.textContent = LANG_DATA.new_game;
document.querySelector(".modal-title").textContent = LANG_DATA.rules.header;
document.querySelector(".modal-body").innerHTML = LANG_DATA.rules.body;
document.querySelector(".modal-footer button").textContent = LANG_DATA.rules.footer_text;

let moves = 0;
let cows = 0;
let bulls = 0;
let number = 0;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const incrementMove = () => reloadMoves(++moves);

const areRepeatedDigits = number => (/([0-9]).*?\1/).test(number);

const reloadMoves = moves => movesOutput.textContent = `${LANG_DATA.feedback.moves}: ${moves}`;

const makeArray = number => number.toString().split("");

const restartGame = () => {
	bulls = 0;
	cows = 0;
	moves = 0;

	generateNumber();

	resultOutput.innerHTML = "";
	warningsOutput.innerHTML = "";
	numInput.value = "";
}

async function showHint() {
	const numArr = makeArray(number);
	const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
	const differentNumbers = digits.filter(item => !numArr.includes(item));
	const incorrectNumbers = [];
	for (let i = 0; i < 2; i++) {
		incorrectNumbers.push(Math.floor(Math.random() * differentNumbers.length));
	}

	document.querySelector(".hintText").textContent = `${LANG_DATA.hint.text}: ${incorrectNumbers.join(", ")}`;
}

async function checkNumber() {
	let numArr = [];
	let rightNumberArr = [];
	const value = parseInt(numInput.value);

	let warningText = (value < 1000 || value >= 10000) ? LANG_DATA.warning_not_number + "<br>" : "";
	warningText += (areRepeatedDigits(value)) ? LANG_DATA.warning_repeat : "";
	if (warningText !== "") {
		warningsOutput.innerHTML = warningText;
		await sleep(2000);
		warningsOutput.innerHTML = "";
	}

	if (value > 1000 && value < 10000 && !areRepeatedDigits(value)) {
		incrementMove();
		if (value === number) {
			resultOutput.innerHTML = LANG_DATA.win;
			await sleep(2000);
			restartGame();
		} else {
			numArr = makeArray(value);
			rightNumberArr = makeArray(number);

			for (let i = 0; i < 4; i++) {
				if (numArr[i] === rightNumberArr[i]) bulls++;
				else if (rightNumberArr.includes(numArr[i], 0)) cows++;
			}
			resultOutput.innerHTML = `${LANG_DATA.cows}: ${cows} <br>${LANG_DATA.bulls}: ${bulls}`;
			cows = 0;
			bulls = 0;
		}
	}

	if (moves >= 10) {
		hintBtn.classList.remove("disabled");
	}
}

async function displayInfo() {
	movesOutput.innerHTML = LANG_DATA.feedback.title;
	await sleep(2000);
	reloadMoves(0);
}

const generateNumber = () => {
	let numberArr = [];
	let digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

	for (let i = 0; i < 4; i++) {
		let idx = Math.floor(Math.random() * digits.length);
		if (i === 0 && idx === 0) {
			idx = Math.floor(Math.random() * digits.length);
		}

		numberArr.push(digits[idx]);
		digits.splice(idx, 1);
	}

	number = parseInt(numberArr.join().replace(/,/g, ''));
	console.log(number);

}

const main = () => {
	displayInfo();
	generateNumber();
}

checkBtn.addEventListener('click', checkNumber);
restartBtn.addEventListener('click', restartGame);
hintBtn.addEventListener('click', showHint);

window.onload = main;