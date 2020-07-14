// ======================= //
// === Button elements === //
// ======================= //
const checkButton = document.querySelector(".content__check");
const restartButton = document.querySelector(".content__restart");
const hintBtn = document.querySelector(".content__hint");

const parentEl = document.querySelector(".content__form");

let movesStoryBlock;

// === Elements for adding into DOM ===
let currentNumber = 0;
let moves = 0;
let cows = 0;
let bulls = 0;
const warnings = [
	"Not 4-digit number!!!",
	"Repeated digits!!!",
	"Empty field!!!"
];
let isHintShown = false;
let incorrectNumbers = [];

let movesStory = [];

// ======================= //
// === basic functions === //
// ======================= //
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// === Working with game Data
const hasRepeatedDigits = (num) => (/([0-9]).*?\1/).test(num);

const getRandomChoice = arr => Math.floor(Math.random() * arr.length);

const showMoves = (n) => { document.querySelector(".content__moves").textContent = `Moves: ${n}`; }

// === Working with DOM
const addElement = (element, className = "", value) => {
	const el = document.createElement(element);
	el.className = className;
	el.innerHTML = value;
	return el;
}

const displayMessage = (async(child) => {
		parentEl.appendChild(child);
		await sleep(3000);
		parentEl.removeChild(child);
})

// ============================= //
// === Functions for buttons === //
// ============================= //
const restartGame = () => {
	cows = 0;
	bulls = 0;
	currentNumber = 0;
	moves = 0;
	incorrectNumbers = [];

	if (movesStoryBlock) deleteStory();

	document.querySelector(".content__moves").textContent = "Ready?";
	checkButton.style.display = 'block';

	main();
}
restartButton.addEventListener('click', restartGame);

checkButton.addEventListener('click', (async() => {
	const inputEl = document.querySelector(".content__input");

	let warningText = "";
	let guess = +inputEl.value;
	// === Clearing the input field ===
	inputEl.value = "";

	if (guess < 1000 || guess >= 10000) warningText += warnings[0];
	if (warningText) warningText += "<br>";
	if (hasRepeatedDigits(guess)) warningText += warnings[1];
	if (!guess) warningText = warnings[2];

	if (warningText) {
		const warningEl = addElement('div', 'alert alert-danger', warningText);
		displayMessage(warningEl);
	} 
	else {
		if (guess === currentNumber) {
			// === When win --- check button removes        ===
			// === And check button removes until next game ===
			const winEl = addElement('div','alert alert-success', "YOU WON!!!");
			displayMessage(winEl);
			checkButton.style.display = 'none';
			return;
		} 
		else {
			showMoves(++moves);

			const guessArr = Array.from(String(guess), Number);
			const currNumArr = Array.from(String(currentNumber), Number);

			for (let i = 0; i < 4; i++) {
				if (guessArr[i] === currNumArr[i]) bulls++;
				else if (currNumArr.includes(guessArr[i])) cows++;
			}

			const dataHTML = `<h5>&#128002: ${bulls}</h5> 
												<h5>&#128004: ${cows}</h5>`;

			const dataEl = addElement('div', 'alert alert-info', dataHTML);

			displayMessage(dataEl);

			// === Adding the hint button block === //
			if (moves >= 10 && !isHintShown) {
				isHintShown = true;
				const hintButton = addElement('button', 'btn btn-outline-primary content__hint', 'Hint');
				hintButton.addEventListener('click', showHint);
				parentEl.insertBefore(hintButton, parentEl.childNodes[2]);
			}
		}
		// === Adding the data to the story and displaying it === //
		const currentMoveData = {
			guess: guess,
			bulls: bulls,
			cows: cows
		};

		movesStory.unshift(currentMoveData);

		if (movesStory.length === 1) {
			movesStoryBlock = addElement('div', 'content__story', '');

			const movesStoryList = addElement('ul', 'list-group', "");
			const movesStoryHeader = addElement('h5', 'content__story-header', "Moves Story");

			movesStoryBlock.appendChild(movesStoryHeader);
			movesStoryBlock.appendChild(movesStoryList);
			document.getElementById("content").appendChild(movesStoryBlock);
		}
			
		addDataToStory(document.querySelector(".list-group"), movesStory[0]);
	}

	bulls = 0;
	cows = 0;
}));

const showHint = (async () => {
	const randIncorrectNumbers = [
		Math.floor(Math.random() * incorrectNumbers.length),
		Math.floor(Math.random() * incorrectNumbers.length)
	];
	const hintMsg = `Hint: digits are not in the number: ${randIncorrectNumbers[0]}, ${randIncorrectNumbers[1]}`;
	const hintText = addElement('p', 'alert alert-info', hintMsg);
	displayMessage(parentEl, hintText);
})

const addDataToStory = (parent, moveData) => {
	const moveElContent = `${moveData.guess} -> &#128004: ${moveData.cows}; &#128002: ${moveData.bulls}`;
	const moveEl = addElement('li', 'list-group-item', moveElContent);
	parent.insertBefore(moveEl, parent.childNodes[0]);
}

const deleteStory = () => {
	movesStory = [];
	document.getElementById("content").removeChild(movesStoryBlock);
}

// ====================================== //
// === Generates number 
// === and saves the incorrect numbers
// === for hints
// ====================================== //
const generateNumber = () => {
	let digits = Array.apply(null, {length: 10}).map(Number.call, Number);
	let number = "";

	for (let i = 0; i < 4; i++) {
		let index = getRandomChoice(digits);
		if (i === 0 && index === 0) {
			index = getRandomChoice(digits);
		}
		number += digits[index];
		digits.splice(index, 1);
	}
	incorrectNumbers = [...digits];
	currentNumber =  +number;
	console.log(currentNumber);
}

async function main() {
	generateNumber();
	await sleep(2000);
	showMoves(moves);
}

window.onload = main;