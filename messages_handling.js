// Function to show the instruction popup
function showInstructionsPopup() {
    const popup = document.getElementById('instructions-popup');
    popup.style.display = 'flex';
}
  
// Function to hide the instructions popup
function hideInstructionsPopup() {
  const popup = document.getElementById('instructions-popup');
  popup.style.display = 'none';
}

// Function to create a popup that handles the restart when game is complete
function winGamePopup(restartFunction) {
  const gameContainer = document.getElementById('game-container');

  const winGamePopup = document.createElement('div');
  winGamePopup.id = 'win-game-popup';
  winGamePopup.classList.add('popup-overlay');

  gameContainer.appendChild(winGamePopup);

  const popupContent = document.createElement('div');
  popupContent.classList.add('popup-content');

  const instructionsText = document.createElement('p');
  instructionsText.textContent = 'Congratulations ! You won, restart to play again.';

  const restartButton = document.createElement('button');
  restartButton.textContent = 'Restart';
  restartButton.id = 'restart-button';
  restartButton.style.display = 'block';
  restartButton.addEventListener('click', restartFunction);

  popupContent.appendChild(instructionsText);
  popupContent.appendChild(restartButton);

  winGamePopup.appendChild(popupContent);

  gameContainer.appendChild(winGamePopup);   
  }


// Function to create a popup that explain that no more possible moves are available
function gameOverPopup(restartFunction) {
  const gameContainer = document.getElementById('game-container');

  const gameOverPopup = document.createElement('div');
  gameOverPopup.id = 'game-over-popup';
  gameOverPopup.classList.add('popup-overlay');

  gameContainer.appendChild(gameOverPopup);

  const popupContent = document.createElement('div');
  popupContent.classList.add('popup-content');

  const instructionsText = document.createElement('p');
  instructionsText.textContent = 'There are no more possible matches, restart to try again.';

  const restartButton = document.createElement('button');
  restartButton.textContent = 'Restart';
  restartButton.id = 'restart-button';
  restartButton.style.display = 'block';
  restartButton.addEventListener('click', restartFunction);

  popupContent.appendChild(instructionsText);
  popupContent.appendChild(restartButton);

  gameOverPopup.appendChild(popupContent);

  gameContainer.appendChild(gameOverPopup);   
}


export { showInstructionsPopup, hideInstructionsPopup, winGamePopup, gameOverPopup };  