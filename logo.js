const cardImages = [
    './Playing Cards/card-clubs-4.png',
    './Playing Cards/card-hearts-6.png',
    './Playing Cards/card-spades-10.png'
  ];
  
  const logoElement = document.getElementById('logo');
  
  cardImages.forEach((imagePath, index) => {
    const cardImgElement = document.createElement('img');
    cardImgElement.src = imagePath;
    cardImgElement.classList.add('card');
    logoElement.appendChild(cardImgElement);
  });
  
  