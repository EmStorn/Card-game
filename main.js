import { createBoardElements } from './board_setup.js';
import { showInstructionsPopup, hideInstructionsPopup, winGamePopup } from './messages_handling.js';
import { distributeCards} from './game _logic.js';
import { createInitialDeck, createDeckElement } from './cards_elements_setup.js';

function restartGame() {
  //boardElements.resetBoardElements();
  const gameContainer = document.getElementById('game-container');
  gameContainer.innerHTML = '';

  // Call startGame() again to restart the game
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
    console.log('test1')
    const { deckElement, initialDeck } = createDeckElement(cardsElements, boardElements.cardsInPyramid, boardElements.selectedCards, boardElements.matchedCards);
    console.log('test2')
    distributeCards(initialDeck, boardElements.cardsInPyramid, boardElements.selectedCards, boardElements.matchedCards);
  
    // Code for setting up the game
    // ...
  
    // Rest of your code
    // ...

    
  }

// Event listener for cardsInPyramidEmptyEvent
document.addEventListener('matchedCardsEvent', function() {
  console.log('all cards matched');
  winGamePopup(restartGame); // Call the function to trigger the popup
});

// Event listener for cardsInPyramidEmptyEvent
document.addEventListener('noMatchesEvent', function() {
  console.log('noMatchesEvent occurred');
   // Call the function to trigger the popup
});

const startButton = document.getElementById('start-button');
startButton.addEventListener('click', startGame);

const instructionsButton = document.getElementById('instructions-button');
instructionsButton.addEventListener('click', showInstructionsPopup);

const closeButton = document.getElementById('close-popup');
closeButton.addEventListener('click', hideInstructionsPopup);

const restartButton = document.getElementById('restart-button');
restartButton.addEventListener('click', restartGame);



