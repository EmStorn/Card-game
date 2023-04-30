const gameContainer = document.getElementById('game-container');

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
        cardContainer.classList.add('card-container');

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
deckRow.appendChild(deckPlaceholder)  

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

// create the initial deck, using the class Card
function createInitialDeck() {
    const initialDeck = [];
  
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
    class Card {
      constructor(suit, value, image) {
        this.suit = suit;
        this.value = value;
        this.image = image;
        this.isInPlay = true;
        this.isCovered = true;
        this.isInDeck = true;
        this.id = '${suit}_${value}';
      }
    }
  
    for (let suit of suits) {
      for (let value of values) {
        const imageName = `./Playing Cards/card-${suit}-${value}.png`;
        const card = new Card(suit, value, imageName);
        initialDeck.push(card);
      }
    }
    
    shuffle(initialDeck)
    return initialDeck;
  }
  
  // create the visual element of the deck
  function createDeckElement() {
    const deckElement = document.createElement('div');
    deckElement.classList.add('deck');
    deckPlaceholder.appendChild(deckElement);
  
    const deckImgElement = document.createElement('img');
    deckImgElement.classList.add('deck-img');
    deckImgElement.src = './Playing Cards/card-back1.png';
    deckElement.appendChild(deckImgElement);
  
    return deckElement;
  }
  
  const initialDeck = createInitialDeck();
  const deckElement = createDeckElement();

  let cardsInPyramid = []

// move the cards from the initialDeck to cardsInPyramid
function distributeCards() {
    const cardsToBeMoved = initialDeck.splice(0, 21);
    cardsInPyramid.push(...cardsToBeMoved);
    const cardContainers = document.querySelectorAll('.card-container');
  
    cardsInPyramid.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      cardContainers[index].appendChild(cardElement);
  
      const cardImgElement = document.createElement('img');
      cardImgElement.classList.add('card-img');
      cardImgElement.src = card.image;
      cardElement.appendChild(cardImgElement);
    });
  }



distributeCards()