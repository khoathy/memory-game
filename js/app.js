/* Variable declarations */

// Create a list that holds all of the cards 
let cardList = [
    'icofont-fish-5',
    'icofont-cherry',
    'icofont-birthday-cake',
    'icofont-umbrella',
    'icofont-leaf',
    'icofont-heart',
    'icofont-apple',
    'icofont-fire-truck',
    'icofont-fish-5',
    'icofont-cherry',
    'icofont-birthday-cake',
    'icofont-umbrella',
    'icofont-leaf',
    'icofont-heart',
    'icofont-apple',
    'icofont-fire-truck'
  ];

// Get DOM elements
let deck = document.querySelector('.deck');
const movesCount = document.querySelector('.moves');
const timer = document.querySelector('.timer');
let openCards = [];
let firstCard, secondCard;
let hasFlipped = false;
let lockDeck = false;
let moveStr = document.getElementById('move-number');
let moveWord = document.getElementById('move-word');
let restartBtn = document.getElementById('restart-btn');
let starList = document.getElementById('stars-list');
let star = document.querySelectorAll('.star');
let move = 0;
let grade = 'great';


  
/*
 * Display the cards on the page
 */

// Shuffle function given by Udacity (source: http://stackoverflow.com/a/2450976)
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Create and add each card's HTML to the page
function createCard(cardName){
    //create li.card 
    let liElm = document.createElement('li');
    liElm.classList.add('card');
    liElm.setAttribute('data-card',cardName)
    deck.appendChild(liElm);
    //create i.name
    let icon = document.createElement('i');
    icon.classList.add(cardName);
    liElm.appendChild(icon);
};

//Display random cards on the page
function displayCards(){
    shuffle(cardList);
    cardList.forEach(function(cardName){
        createCard(cardName);
    });
};


/*
 * Game logics
 */

 // Game init
    displayCards();
    

 // Flip and show the icon of the card
function flipCards(){
    if (lockDeck) return;
    if (this === firstCard) return;
    this.classList.add('open','show');
    openCards.push(this);
    if (!hasFlipped) {
        hasFlipped = true;
        firstCard = this;
    } else {
        hasFlipped = false;
        secondCard = this;  
        // lockDeck = true;
        checkMatch();
        updateMoves();
        updateGrade();
    }
}

function updateMoves(){
    move++;
    moveStr.innerText = move; 
    if(move == 1) {
        moveWord.innerText = " Move";
    } else {
        moveWord.innerText = " Moves";
    } 
}

function updateGrade(){
    if (move >= 2) {
        star[2].classList.add('star-removed');
        grade = "Average";  
    }
    if (move >= 3) {
        star[1].classList.add('star-removed')
        grade = "Poor";    
    }
      
    console.log(starList);
}


// 0-10 Moves = Great! 
// 13-18 Moves = Average 
// 26+ Moves = Poor...  



function unflipCards(){
    lockDeck = true;
    console.log(lockDeck + 'when unflip');
    setTimeout(() => {
        firstCard.classList.remove('open','show');    
        secondCard.classList.remove('open','show'); 
    //prevent clicking while cards are still open
        lockDeck = false;  
    }, 1000);   
}

// lock the cards matched in the open position
function lockCards(){
    firstCard.removeEventListener('click',flipCards);
    secondCard.removeEventListener('click',flipCards);
}

//check if cards match 
function checkMatch(){
    let match = firstCard.dataset.card === secondCard.dataset.card;
    console.log('match?' + match);
    match ?  lockCards() : unflipCards();
}

//reset first and second card 
// function resetFirstCard(){
//     firstCard = null;
//     secondCard = null;
//     hasFlipped = false;
//     lockDeck = false;
// }

// function restartGame(){
//     deck.innerHTML = "";
//     displayCards();
//     hasFlipped = false;
//     lockDeck = false;
//     console.log(hasFlipped,lockDeck,openCards);
// }

//set up the event listener for a card if a card is clicked:
let allCards = document.querySelectorAll('.card');
allCards.forEach(function(card){
    card.addEventListener('click', flipCards);
})
console.log('test' + openCards);

//set up the event listener for restart button 
// restartBtn.addEventListener('click', restartGame);


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

