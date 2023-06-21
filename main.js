import { createBoardElements } from './board_setup.js';
import { showInstructionsPopup, hideInstructionsPopup, winGamePopup, gameOverPopup } from './messages_handling.js';
import { distributeCards} from './game _logic.js';
import { createInitialDeck, createDeckElement } from './cards_elements_setup.js';

function restartGame() {
  const gameContainer = document.getElementById('game-container');
  gameContainer.innerHTML = '';

  startGame();
}

function startGame() {
    // hide the logo 
    const logoElement = document.getElementById('logo');
    logoElement.style.display = 'none';
    // hide start button
    const startButtonElement = document.getElementById('start-button');
    startButtonElement.style.display = 'none';
    // display start button
    const restartButtonElement = document.getElementById('restart-button');
    restartButtonElement.style.display = 'block';

    const boardElements = createBoardElements();
    const cardsElements = createInitialDeck();
    const { deckElement, initialDeck } = createDeckElement(cardsElements, boardElements.cardsInPyramid, boardElements.selectedCards, boardElements.matchedCards);
    distributeCards(initialDeck, boardElements.cardsInPyramid, boardElements.selectedCards, boardElements.matchedCards);
  }

// Event listener for cardsInPyramidEmptyEvent
document.addEventListener('matchedCardsEvent', function() {
  winGamePopup(restartGame); // Call the function to trigger the popup
});

// Event listener for cardsInPyramidEmptyEvent
document.addEventListener('noMatchesEvent', function() {
  gameOverPopup(restartGame);
});

const startButton = document.getElementById('start-button');
startButton.addEventListener('click', startGame);

const instructionsButton = document.getElementById('instructions-button');
instructionsButton.addEventListener('click', showInstructionsPopup);

const closeButton = document.getElementById('close-popup');
closeButton.addEventListener('click', hideInstructionsPopup);

const restartButton = document.getElementById('restart-button');
restartButton.addEventListener('click', restartGame);



