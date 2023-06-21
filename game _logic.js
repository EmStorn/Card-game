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
  // Create the custom event for no possible matches
  const noMatchesEvent = new CustomEvent('noMatchesEvent');
  if (initialDeck.length === 0) {
    let uncoveredCards = cardsInPyramid.filter(card => !card.isCovered);
    let matchFound = false; //variable to track if a match is found

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
  
// modify the parent of the matched cards
function updateParent(selectedCards, cardsInPyramid) {
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

// checks if there are 2 elements in the selected cards array, and evaluate if the sum of
// values for both is 10, if yes process the match, if no just empty the array to allow new selection
function checkMatch(selectedCards, matchedCards, cardsInPyramid, initialDeck) {
    if (selectedCards.length === 2) {
      const sumOfValues = selectedCards[0].card_value + selectedCards[1].card_value;
      if (sumOfValues === 10) {
        for (let i = 0; i < 2; i++) {
          const selectedCard = selectedCards[i];
          moveVisualElement(selectedCard.card_id, '.discarded-cards-placeholder');
          matchedCards.push(selectedCard);
          for (let i = 0; i < cardsInPyramid.length; i++) {
            if (cardsInPyramid[i].id === selectedCard.card_id) {
              cardsInPyramid.splice(i, 1); // Remove the element at index i
              break;
            }
          }
          console.log(cardsInPyramid)  
        }
        updateParent(selectedCards, cardsInPyramid);
        selectedCards.length = 0;    
      } else {
        selectedCards.length = 0;
      }
      const selectedContainers = document.querySelectorAll('.card-container, .card-container-uncovered');
        selectedContainers.forEach(container => {
          container.classList.remove('selected');
        });

    } else if (selectedCards.length === 1) {
      const firstSelectedCard = selectedCards[0].card_value;
      if (firstSelectedCard === 10) {
        const selectedCard = selectedCards[0];
        moveVisualElement(selectedCard.card_id, '.discarded-cards-placeholder');
        matchedCards.push(selectedCard);  
        selectedCard.isInPlay = false;
        for (let i = 0; i < cardsInPyramid.length; i++) {
          if (cardsInPyramid[i].id === selectedCard.card_id) {
            cardsInPyramid.splice(i, 1);
            break;
          }
        }
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
  
  // function that handles the click on a card element and its selection
  function cardSelection(clickedCard, selectedCardImgElement, selectedCards, matchedCards, cardsInPyramid, initialDeck) {
    if (!clickedCard.isCovered){
      let cardIsSelected = isCardInList(clickedCard.id, selectedCards);
      if (cardIsSelected) {
          let updated_list = selectedCards.filter(obj => obj.card_id !== clickedCard.id);
          selectedCards = updated_list;
          removeColorSelectedCard(selectedCardImgElement);
      } else {
          let newSelectedCard = {card_id: clickedCard.id, card_value: clickedCard.value};
          selectedCards.push(newSelectedCard);
          colorSelectedCard(selectedCardImgElement);
      }
      checkMatch(selectedCards, matchedCards, cardsInPyramid, selectedCardImgElement, initialDeck);
      matchingAvailability(initialDeck, cardsInPyramid);
    }  
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

export { distributeCards, turnCard, cardSelection, matchingAvailability };  