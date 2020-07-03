'use strict';

const numInput = document.querySelector("input[type='number']");
const checkBtn = document.querySelector(".check");
const restartBtn = document.querySelector(".restart");
const resultOutput = document.querySelector(".result h5");
const movesOutput = document.querySelector("h6");
const warningsOutput = document.querySelector(".warnings");
const hintBtn = document.querySelector(".hint");

let moves = 0;
let cows = 0;
let bulls = 0;
let number = 0;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const incrementMove = () => reloadMoves(++moves);

const areRepeatedDigits = number => (/([0-9]).*?\1/).test(number);

const reloadMoves = moves => movesOutput.innerHTML = `Ходы: ${moves}`;

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
	document.querySelector(".hintText").innerHTML = "Подсказка: " + numArr[0] + "*" + numArr[1] + "*";
}

async function checkNumber() {
	let numArr = [];
	let rightNumberArr = [];
	let warningText = "";

	const value = parseInt(numInput.value);

	warningText += (value < 1000 || value >= 10000) ? "Число не 4-значное!!! <br>" : "";
	warningText += (areRepeatedDigits(value)) ? "Цифры повторяются!!!" : "";
	if (warningText !== "") {
		warningsOutput.innerHTML = warningText;
		await sleep(2000);
		warningsOutput.innerHTML = "";
	}

	if (value > 1000 && value < 10000 && !areRepeatedDigits(value)) {
		incrementMove();
		if (value === number) {
			resultOutput.innerHTML = "YOU WIN!!!";
			await sleep(2000);
			restartGame();
		} else {
			numArr = makeArray(value);
			rightNumberArr = makeArray(number);

			for (let i = 0; i < 4; i++) {
				if (numArr[i] === rightNumberArr[i]) bulls++;
				else if (rightNumberArr.includes(numArr[i], 0)) cows++;
			}
			resultOutput.innerHTML = `Коров: ${cows} <br>Быков: ${bulls}`;
			cows = 0;
			bulls = 0;
		}
	}

	if (moves >= 10) {
		hintBtn.classList.remove("disabled");
	}
}

async function displayInfo() {
	movesOutput.innerHTML = "Готовы отгадывать?";
	await sleep(2000);
	reloadMoves(0);
}

const generateNumber = () => {
	let numberArr = [];
	let digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	for (let i = 0; i < 4; i++) {
		let idx = Math.floor(Math.random() * digits.length);
		if (i === 0 && idx === 0) {
			idx = Math.floor(Math.random() * digits.length);
		}

		numberArr.push(digits[idx]);
		digits.splice(idx, 1);
	}

	number = parseInt(numberArr.join().replace(/,/g, ''));
}

const main = () => {
	generateNumber();
	displayInfo();
	displayInfo();
}

checkBtn.addEventListener('click', checkNumber);
restartBtn.addEventListener('click', restartGame);
hintBtn.addEventListener('click', showHint);

window.onload = () => {
	main();
}