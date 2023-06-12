import { turnCard, cardSelection, matchingAvailability } from './game _logic.js';
import { winGamePopup } from './messages_handling.js';

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
      const structure = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 7 ,7, 7, 7, 7, 7, 7]
      const parent = initialDeck[i];
      const child1 = initialDeck[i + structure[i]];
      const child2 = initialDeck[i + structure[i] + 1];
      parent.setChildren(child1, child2);
    }

    return initialDeck
  }

  // add image of the card to the board
  function addCardImage(card, index, parentContainer, selectedCards, matchedCards, cardsInPyramid, initialDeck) {
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

      // Create the custom event to check if matches are available
      const noMatchesEvent = new CustomEvent('noMatchesEvent');
      
      // adds events listener to handle click on the element
      cardElement.addEventListener("click", function(event) {
        const childElement = event.target.querySelector(".card-id");
        cardSelection(card, cardImgElement, selectedCards, matchedCards, cardsInPyramid, initialDeck);
      });

      
  }

  // create the visual element of the deck
  function createDeckElement(initialDeck, cardsInPyramid, selectedCards, matchedCards) {
    const deckElement = document.createElement('div');
    const deckPlaceholder = document.querySelector('.deck-placeholder');
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
          addCardImage(firstCard, i, cardLocations, selectedCards, matchedCards, cardsInPyramid, initialDeck);
          turnCard(firstCard.id);
          firstCard.isCovered = false;
          cardsInPyramid.push(firstCard);
          break;
        }
      } 
    });
  
    return { deckElement, initialDeck };
  }  

export { createInitialDeck, createDeckElement };  