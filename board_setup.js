function createBoardElements() {
    const gameContainer = document.getElementById('game-container');
  
    let cardsInPyramid = [];
    let selectedCards = [];
    let matchedCards = [];
  
    for (let i = 1; i <= 7; i++) {
      const row = document.createElement('div');
      row.classList.add('row');
  
      for (let j = 1; j <= i; j++) {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');
  
        row.appendChild(cardContainer);
      }
  
      gameContainer.appendChild(row);
    }
  
    for (let i = 1; i <= 2; i++) {
      const lineBreak = document.createElement('br');
      const bottomRow = document.createElement('div');
      bottomRow.classList.add('bottom-row');
  
      for (let j = 1; j <= 6; j++) {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container-uncovered');
  
        bottomRow.appendChild(cardContainer);
      }
  
      gameContainer.appendChild(lineBreak);
      gameContainer.appendChild(bottomRow);
    }
  
    const deckRow = document.createElement('div');
    deckRow.classList.add('deck-row');
    gameContainer.appendChild(deckRow);
    const deckPlaceholder = document.createElement('div');
    deckPlaceholder.classList.add('deck-placeholder');
    deckRow.appendChild(deckPlaceholder);
    const discardedCardsPlaceholder = document.createElement('div');
    discardedCardsPlaceholder.classList.add('discarded-cards-placeholder');
    deckRow.appendChild(discardedCardsPlaceholder);

    function resetBoardElements() {
      cardsInPyramid.length = 0 
      selectedCards.length = 0 
      matchedCards.length = 0 
    }
  
    return { cardsInPyramid, selectedCards, matchedCards, resetBoardElements };
  }
  
  export { createBoardElements };

  