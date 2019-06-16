/* Variable declarations and get DOM elements */

// For Congrats modal
const restartBtn = document.getElementById('restart-btn');
const congratsModal = document.getElementById('congrats');
const closeModal = document.querySelector('.modal-close'); 
const replayBtn = document.querySelector('.modal-replayBtn');
const congratsTime = document.getElementById('congrats-time');
const congratsStars = document.getElementById('congrats-stars'); 
const congratsGrade = document.getElementById('congrats-grade');
  
// For Score panel
const deck = document.querySelector('.deck');
const clock = document.getElementById('clock');

const moveStr = document.getElementById('move-number');
const moveWord = document.getElementById('move-word');

const starList = document.getElementById('stars-list');
const stars = document.querySelectorAll('.star');

// List that holds all cards 
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

let firstCard, secondCard;
let hasFlipped = false;
let lockDeck = false;
let timerStart = false;
let interval = null;
let timer = 0; 
let matchedCounter = 0;
let move = 0;
let grade = 'Great';


/*
 * Initialize game
 */

function initGame() {
    deck.innerHTML = "";
    displayCards();
    activateCards();
    hasFlipped = false;
    lockDeck = false;
    matchedCounter = 0;
    timerStart = false;
    timer = 0; 
    interval = null;
    clock.innerHTML = secondsToHms(timer);
    moveStr.innerText = "0";
    matchedCounter = 0;
    move = 0;
    grade = 'Great';
    //set up event listener for buttons
    restartBtn.addEventListener('click', resetGame);
    closeModal.addEventListener('click',hideModal);
    replayBtn.addEventListener('click',replayGame);
}

  
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
    //create li element 
    let liElm = document.createElement('li');
    liElm.classList.add('card');
    liElm.setAttribute('data-card',cardName);
    deck.appendChild(liElm);

    //create i element 
    let icon = document.createElement('i');
    icon.classList.add(cardName);
    liElm.appendChild(icon);
}

// Display random cards on the page
function displayCards(){
    shuffle(cardList);
    cardList.forEach(function(cardName){
        createCard(cardName);
    });
}


/*
 * Add behavior to the cards
 */

// Set up event listener for a card if a card is clicked
function activateCards(){
    let allCards = document.querySelectorAll('.card');
    allCards.forEach(function(card){
        card.addEventListener('click', flipCards);
    })
}

// Flip and reveal the hidden icon of the card
function flipCards(){
    if (lockDeck) return;
    if (this === firstCard) return;
    startTimer();
    this.classList.add('open','show');
    if (!hasFlipped) {
        hasFlipped = true;
        firstCard = this;
    } else {
        hasFlipped = false;
        secondCard = this;  
        checkMatch();
        updateMoves();
        updateGrade();
    }
}

// Unflip cards that are not matched 
function unflipCards(){
    // Prevents clicking while cards are still open
    lockDeck = true;
    // Unflip the card and hide the card's symbol 
    setTimeout(() => {
        firstCard.classList.remove('open','show');    
        secondCard.classList.remove('open','show'); 
        resetFirstCard(); 
    }, 1200);   
}

// Check if cards are matched 
function checkMatch(){
    let match = firstCard.dataset.card === secondCard.dataset.card;
    if (match) {    
        firstCard.classList.add('match');
        secondCard.classList.add('match');  
        firstCard.classList.remove('show','open');    
        secondCard.classList.remove('show','open'); 
        lockCards();
        matchedCounter +=2;
        console.log(matchedCounter);
        if (matchedCounter == cardList.length) {
            gameOver();
        }
    } else {
        unflipCards();
    } 
}

// Lock the cards that are correctly matched in the open position
function lockCards(){
    firstCard.removeEventListener('click',flipCards);
    secondCard.removeEventListener('click',flipCards);
    resetFirstCard();
}

// Reset first and second card
function resetFirstCard(){
    firstCard = null;
    secondCard = null;
    hasFlipped = false;
    lockDeck = false;
}


/*
 * Move Counter
 */

function updateMoves(){
    move++;
    moveStr.innerText = move; 
    if (move == 1) {
        moveWord.innerText = " Move";
    } else {
        moveWord.innerText = " Moves";
    } 
}


/*
 * Star Rating
 */

function updateGrade(){
    if (move < 12) {
        grade = "Great";  
    }
    if (move >= 12) {
        stars[2].classList.add('star-removed');
        grade = "Average";  
    }
    if (move >= 24) {
        stars[1].classList.add('star-removed');
        grade = "Poor";    
    }
}

function resetStars(){
    stars.forEach(function(star){
        if (star.classList.contains('star-removed')) {
            star.classList.remove('star-removed');
        }
    })
}


/*
 * Timer
 */

// Convert seconds to hh:mm:ss
function secondsToHms(time) {
    time = Number(time);
    let h = Math.floor(time / 3600);
    let m = Math.floor((time % 3600) / 60);
    let s = Math.floor((time % 3600) % 60);
    return '' + getTwoDigits(h) + ':' + getTwoDigits(m) + ':' + getTwoDigits(s);
}

function getTwoDigits(s) {
    return (s < 10) ? '0' + s : '' + s;
}

// Display current timer on page
function myTimer() {
    clock.innerHTML = secondsToHms(timer);
    timer += 1;
}

// Start timer when game starts
function startTimer() {
    if (!timerStart) {
        timerStart = true;
        timer = 0; 
        interval = setInterval(myTimer,1000);
    }  
}

// Stop timer when game ends
function stopTimer() {
    if (interval != null) {
        clearInterval(interval);
    }
}


/*
 * Restart Button
 */

function resetGame() {
    stopTimer();
    initGame();
    resetStars();
}

/*
 * Congrats Sound and popup Modal when Game Over 
 */

function gameOver(){
    stopTimer();
    lockDeck = true;
    setTimeout(winningSound,500);
    setTimeout(showModal,1800);
}

// Winning sound when all cards are matched
function winningSound(){
    var audio = new Audio("sound/congrats.mp3");
    audio.play();
}

// Display, close the modal, replay btn
function showModal(){
    congratsModal.style.display = "flex";
    summary();
}

function hideModal() {
    congratsModal.style.display = "none";
    resetGame();
}

function replayGame() {
    hideModal();
    resetGame();
}

// Game summary
function summary(){
    congratsTime.innerHTML = clock.innerHTML;
    congratsStars.innerHTML = starList.innerHTML; 
    congratsGrade.textContent = grade;
}

/*
 * Calling functions
 */

initGame();

