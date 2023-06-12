const gameContainer = document.getElementById('game-container');

let cardsInPyramid = []
let selectedCards = []
let matchedCards = []

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

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


// create the initial deck, using the class Card
function createInitialDeck() {
    let initialDeck = [];
  
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
        this.id = `${suit}-${value}`;
        this.coveredBy = [];
        this.parent = null;
      }

      setChildren(child1, child2) {
        this.coveredBy = [child1.id, child2.id];
        child1.parent = this.id;
        child2.parent = this.id;
      }

    }
  
    for (let suit of suits) {
      for (let value of values) {
        let imageName = './Playing Cards/card-back1.png';
        const card = new Card(suit, value, imageName);
        initialDeck.push(card);
      }
    }
    
    shuffle(initialDeck)

      // Assign children
    for (let i = 0; i < 21; i++) {
      structure = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 7 ,7, 7, 7, 7, 7, 7]
      const parent = initialDeck[i];
      const child1 = initialDeck[i + structure[i]];
      const child2 = initialDeck[i + structure[i] + 1];
      parent.setChildren(child1, child2);
    }

    return initialDeck;
  }

// change class of card container, to allow different color display when selected
function colorSelectedCard(selectedCardImgElement) {
  const cardContainer = selectedCardImgElement.closest('.card-container, .card-container-uncovered');
  if (cardContainer) {
    cardContainer.classList.add('selected');
  }
}

// change class of card container selected, to allow different color display when selected
function removeColorSelectedCard(selectedCardImgElement) {
  const cardContainer = selectedCardImgElement.closest('.card-container, .card-container-uncovered');
  if (cardContainer) {
    cardContainer.classList.remove('selected');
  }
}

// moves the visual element to a new container (takes elements ids as arguments)
function moveVisualElement(elementToBeMoved, targetContainer) {
  console.log(elementToBeMoved, targetContainer)
  const destination = document.querySelector(targetContainer);
  const elementToMove = document.querySelector(`#${elementToBeMoved}`);

  destination.appendChild(elementToMove);
}

// turn covered card, when become uncovered
function turnCard(cardId) {
  const element = document.getElementById(`${cardId}`);
  element.src = `./Playing Cards/card-${cardId}.png`;
}

// modify the parent of the matched card
function updateParent(selectedCards) {
  for (let i = 0; i < selectedCards.length; i++) {
    const idOfCardToBeRemoved = selectedCards[i].card_id;
    const cardsCoveredBy = cardsInPyramid.filter(card => card.coveredBy.includes(idOfCardToBeRemoved));
    cardsCoveredBy.forEach((card) => {
      // remove the cardIdToRemove from the coveredBy array of the parent card and chenge isCovered attribute
      card.coveredBy = card.coveredBy.filter(id => id !== idOfCardToBeRemoved);
      if (card.coveredBy.length === 0) {
        card.isCovered = false;
        turnCard(card.id);
      }
    });
  }
}




// checks if there are 2 elements in the selected cards array, and evaluate if the sum of
// values for both is 10, if yes process the match, if no just empty the array to allow new selection
function checkMatch() {
  if (selectedCards.length === 2) {
    console.log('2 cards selected');
    const sumOfValues = selectedCards[0].card_value + selectedCards[1].card_value;
    if (sumOfValues === 10) {
      console.log('we have a match');
      for (let i = 0; i < 2; i++) {
        moveVisualElement(selectedCards[i].card_id, '.discarded-cards-placeholder');
        matchedCards.push(selectedCards[i]);        
      }
      updateParent(selectedCards);
      selectedCards = [];
    } else {
      console.log('no match');
      selectedCards = [];
    }
    const selectedContainers = document.querySelectorAll('.card-container, .card-container-uncovered');
      selectedContainers.forEach(container => {
        container.classList.remove('selected');
      });
  } else if (selectedCards.length === 1) {
    const firstSelectedCard = selectedCards[0].card_value;
    if (firstSelectedCard === 10) {
      console.log('10 selected - match');
      moveVisualElement(selectedCards[0].card_id, '.discarded-cards-placeholder');
      matchedCards.push(selectedCards[0]);  
      updateParent(selectedCards);
      selectedCards = []; 
      const selectedContainers = document.querySelectorAll('.card-container, .card-container-uncovered');
      selectedContainers.forEach(container => {
        container.classList.remove('selected');
      });
    } else {
      console.log('select more cards');
    }
  } else {
    console.log('no cards selected');
  }
};

function cardSelection(clickedCard, selectedCardImgElement) {
  cardIsSelected = isCardInList(clickedCard.id, selectedCards);
  console.log(cardIsSelected);
  console.log(clickedCard.id)
  if (cardIsSelected) {
      updated_list = selectedCards.filter(obj => obj.card_id !== clickedCard.id);
      selectedCards = updated_list;
      console.log(selectedCards);
      removeColorSelectedCard(selectedCardImgElement);
  } else {
      newSelectedCard = {card_id: clickedCard.id, card_value: clickedCard.value};
      selectedCards.push(newSelectedCard);
      console.log(selectedCards);
      colorSelectedCard(selectedCardImgElement);
  }
  checkMatch();
}

  function addCardImage(card, index, parentContainer) {
    const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      parentContainer[index].appendChild(cardElement);
  
      const cardImgElement = document.createElement('img');
      cardImgElement.classList.add('card-img');
      cardImgElement.src = card.image;
      cardImgElement.setAttribute('id', `${card.id}`);
      cardElement.appendChild(cardImgElement);

      const textElement = document.createElement('h1');
      textElement.classList.add('card-id');
      textElement.textContent = card.id;
      cardImgElement.appendChild(textElement);
      
      // adds events listener to handle click on the element
      cardElement.addEventListener("click", function(event) {
        const childElement = event.target.querySelector(".card-id");
        cardSelection(card, cardImgElement);
      });
  }
  
  // create the visual element of the deck
  function createDeckElement(initialDeck) {
    const deckElement = document.createElement('div');
    deckElement.classList.add('deck');
    deckPlaceholder.appendChild(deckElement);
  
    const deckImgElement = document.createElement('img');
    deckImgElement.classList.add('deck-img');
    deckImgElement.src = './Playing Cards/card-back1.png';
    deckElement.appendChild(deckImgElement);
  
    deckImgElement.addEventListener('click', function() {
      console.log('deck pressed');
      const firstCard = initialDeck.shift();
      console.log(firstCard);
      const cardLocations = document.querySelectorAll('.card-container-uncovered');
  
      for (let i = 0; i < cardLocations.length; i++) {
        const cardLocation = cardLocations[i];
        if (!cardLocation.hasChildNodes()) {
          addCardImage(firstCard, i, cardLocations);
          turnCard(firstCard.id);
          cardsInPyramid.push(firstCard);
          console.log(initialDeck);
          console.log(cardsInPyramid);
          break;
        }
      }
    });
  
    return deckElement;
  }
  
  const initialDeck = createInitialDeck();
  let deckElement = createDeckElement(initialDeck);

function isCardInList(cardId, list) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].card_id === cardId) {
      return true;
    }
  }
  return false;
  }



// move the cards from the initialDeck to cardsInPyramid and add visual elements
function distributeCards() {
    const cardsToBeMoved = initialDeck.splice(0, 28);
    cardsInPyramid.push(...cardsToBeMoved);
    const cardContainers = document.querySelectorAll('.card-container');
  
    cardsInPyramid.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      cardContainers[index].appendChild(cardElement);
  
      const cardImgElement = document.createElement('img');
      cardImgElement.classList.add('card-img');
      cardImgElement.src = card.image;
      cardImgElement.setAttribute('id', `${card.id}`);
      cardElement.appendChild(cardImgElement);

      const textElement = document.createElement('h1');
      textElement.classList.add('card-id');
      textElement.textContent = card.id;
      cardImgElement.appendChild(textElement);
      
      // adds events listener to handle click on the element
      cardElement.addEventListener("click", function(event) {
        const childElement = event.target.querySelector(".card-id");
        cardSelection(card, cardImgElement);
      });
    });
    // turn the last row of cards
    const lastRowCards = cardsInPyramid.slice(-7);
    for (let i = 0; i < lastRowCards.length; i++) {
      const card = lastRowCards[i];
      const cardId = card.id;
      turnCard(cardId);
      card.isCovered = false;
    }  
  }

distributeCards()
