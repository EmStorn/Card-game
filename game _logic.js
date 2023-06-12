//import { gameOverPopup } from './messages_handling';

// turn covered card, when become uncovered
function turnCard(cardId) {
    const element = document.getElementById(`${cardId}`);
    element.src = `./Playing Cards/card-${cardId}.png`;
    console.log(`${cardId} turned`)
  }

function isCardInList(cardId, list) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].card_id === cardId) {
      return true;
    }
  }
  return false;
  }

function matchingAvailability(initialDeck, cardsInPyramid) {
  if (initialDeck.length === 0) {
    let uncoveredCards = cardsInPyramid.filter(card => !card.isCovered);
    let matchFound = false; // Flag variable to track if a match is found
    console.table(uncoveredCards)
    console.log(`${uncoveredCards.length}`)
    console.table(cardsInPyramid)
    console.log(cardsInPyramid.length)
  
    for (let i = 0; i < uncoveredCards.length; i++) {
      for (let j = i + 1; j < uncoveredCards.length; j++) {
        if (uncoveredCards[i].value + uncoveredCards[j].value === 10) {
          console.log("still possible matches");
          console.log(`${uncoveredCards[i].value}+${uncoveredCards[j].value}`);
          matchFound = true;
          break; // Break out of the inner loop
        }
      }
  
      if (matchFound) {
        break; // Break out of the outer loop
      }
    }
  
    if (!matchFound) {
      document.dispatchEvent(noMatchesEvent); // Dispatch the event if no matches are available
    }
  }
}  
  
// modify the parent of the matched card
function updateParent(selectedCards, cardsInPyramid) {
    for (let i = 0; i < selectedCards.length; i++) {
      const idOfCardToBeRemoved = selectedCards[i].card_id;
      const cardsCoveredBy = cardsInPyramid.filter(card => card.coveredBy.includes(idOfCardToBeRemoved));
      cardsCoveredBy.forEach((card) => {
        // remove the cardIdToRemove from the coveredBy array of the parent card and chenge isCovered attribute
        card.coveredBy = card.coveredBy.filter(id => id !== idOfCardToBeRemoved);
        console.log(`Updating parent, removing covering card from ${card.id}, action executed ${card.coveredBy}`)
        if (card.coveredBy.length === 0) {
          card.isCovered = false;
          console.log(`inside of update Parent, calling turn card on ${card.id}`)
          turnCard(card.id);
          console.log('turncard called')
        }
      });
    }
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

  // change z-index of card container after match
  function containerToBackground(selectedCardImgElement) {
    const cardContainer = selectedCardImgElement.closest('.card-container, .card-container-uncovered');
    if (cardContainer) {
      cardContainer.style.zIndex = '-1';
    }
  }

// checks if there are 2 elements in the selected cards array, and evaluate if the sum of
// values for both is 10, if yes process the match, if no just empty the array to allow new selection
function checkMatch(selectedCards, matchedCards, cardsInPyramid, selectedCardImgElement, initialDeck) {
    if (selectedCards.length === 2) {
      console.log('2 cards selected');
      const sumOfValues = selectedCards[0].card_value + selectedCards[1].card_value;
      if (sumOfValues === 10) {
        console.log('we have a match');
        for (let i = 0; i < 2; i++) {
          const selectedCard = selectedCards[i];
          moveVisualElement(selectedCard.card_id, '.discarded-cards-placeholder');
          matchedCards.push(selectedCard);
          console.log(cardsInPyramid)
          cardsInPyramid = cardsInPyramid.filter(card => card.card_id !== selectedCard.card_id);
          console.log(cardsInPyramid)
        }
        updateParent(selectedCards, cardsInPyramid);
        selectedCards.length = 0;     

      } else {
        console.log('no match');
        selectedCards.length = 0;
      }
      const selectedContainers = document.querySelectorAll('.card-container, .card-container-uncovered');
        selectedContainers.forEach(container => {
          container.classList.remove('selected');
        });

    } else if (selectedCards.length === 1) {
      const firstSelectedCard = selectedCards[0].card_value;
      if (firstSelectedCard === 10) {
        console.log('10 selected - match');
        const selectedCard = selectedCards[0];
        moveVisualElement(selectedCard.card_id, '.discarded-cards-placeholder');
        matchedCards.push(selectedCard);  
        selectedCard.isInPlay = false;
        cardsInPyramid = cardsInPyramid.filter(card => card.card_id !== selectedCard.card_id);
        //containerToBackground(selectedCardImgElement);
        updateParent(selectedCards, cardsInPyramid);
        selectedCards.length = 0; 
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

    // Create the custom event
    const matchedCardsEvent = new CustomEvent('matchedCardsEvent');

    // Check if matchedCards === 40 and dispatch the event
    if (matchedCards.length === 40) {
      document.dispatchEvent(matchedCardsEvent);
    }

  };
  
  function cardSelection(clickedCard, selectedCardImgElement, selectedCards, matchedCards, cardsInPyramid, initialDeck) {
    let cardIsSelected = isCardInList(clickedCard.id, selectedCards);
    console.log(cardIsSelected);
    console.log(clickedCard.id)
    if (cardIsSelected) {
        let updated_list = selectedCards.filter(obj => obj.card_id !== clickedCard.id);
        selectedCards = updated_list;
        console.log(selectedCards);
        removeColorSelectedCard(selectedCardImgElement);
    } else {
        let newSelectedCard = {card_id: clickedCard.id, card_value: clickedCard.value};
        selectedCards.push(newSelectedCard);
        console.log(selectedCards);
        colorSelectedCard(selectedCardImgElement);
    }
    checkMatch(selectedCards, matchedCards, cardsInPyramid, selectedCardImgElement, initialDeck);
  }  

// move the cards from the initialDeck to cardsInPyramid and add visual elements
function distributeCards(initialDeck, cardsInPyramid, selectedCards, matchedCards) {
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
        cardSelection(card, cardImgElement, selectedCards, matchedCards, cardsInPyramid, initialDeck);
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

  // Function to create a popup that explain that no more possible moves are available
function gameOverPopup() {
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

  popupContent.appendChild(instructionsText);
  popupContent.appendChild(restartButton);

  gameOverPopup.appendChild(popupContent);

  gameContainer.appendChild(gameOverPopup);   
}


export { distributeCards, turnCard, cardSelection, matchingAvailability };  