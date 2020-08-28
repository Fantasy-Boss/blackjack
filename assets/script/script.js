const hitSound = new Audio('assets/sounds/cardSwish.mp3')
const winSound = new Audio('assets/sounds/win.mp3')
const loseSound = new Audio('assets/sounds/lose.mp3')
const drawSound = new Audio('assets/sounds/draw.mp3')

var blackjackGame = {
     'you': {'scoreSpan' : '#you-score', 'div' : '#you-tab', 'score' : 0},
     'dealer': {'scoreSpan' : '#dealer-score', 'div' : '#dealer-tab', 'score' : 0},
     'cards' : ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
     'cardsScore' : {'2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '10':10, 'K':10, 'J':10, 'Q':10, 'A':[1,11]},
     'score' : {'win' : 0,'lose' : 0,'draw' : 0},
     'state' : {'isStand' : false,'isGameOver' : false,'trunsOver' : false},
     'credit' : {'bet' : 500, 'total' : 10000,}
};

window.addEventListener('load', function() {
     document.querySelector(".float").style.display = 'none'
     registerSW()
})

const you = blackjackGame['you']
const dealer = blackjackGame['dealer']
const score = blackjackGame['score']
const state = blackjackGame['state']
const credit = blackjackGame['credit']
var value = 0

const isStorage = (localStorage.getItem('bj-score') !== null)

document.querySelector("#hit").addEventListener("click", hit);
document.querySelector("#deal").addEventListener("click", deal);
document.querySelector("#stand").addEventListener("click", stand);


document.querySelector("#get").addEventListener("click", get);
document.querySelector("#help").addEventListener("click", 
function () {
     document.querySelector('.help-me').style.display = 'flex'
     noAds()
});

document.querySelector(".close").addEventListener("click", 
function () {
     document.querySelector('.help-me').style.display = 'none'
});

if (isStorage) {
     let bjScore = JSON.parse(localStorage.getItem('bj-score'))
     blackjackGame['score']['draw'] = bjScore['score']['draw']
     blackjackGame['score']['win'] = bjScore['score']['win']
     blackjackGame['score']['lose'] = bjScore['score']['lose']
     blackjackGame['credit']['total'] = bjScore['credit']
     document.querySelector('#total').textContent = credit['total']
     document.querySelector('#win').textContent = score['win']
     document.querySelector('#lose').textContent = score['lose']
     document.querySelector('#draw').textContent = score['draw']
     bet()
}

function hit() {
     if (state['isStand'] === false) {
          let total = document.querySelector('#total').textContent
          if (total >= 500) {
               let card = randomCard()
               showCard(card, you)
               updateScore(card, you)
               showScore(you)
               bust()
               document.querySelector('#bet').disabled = true
          }
          else {
               ads()
          }
          
     }
}

function randomCard() {
     let randomIndex = Math.floor(Math.random()*13)
     return blackjackGame['cards'][randomIndex]
}

function showCard(card, activePlayer) {
     if (activePlayer['score'] <=21) {
          let cardImage = document.createElement("img")
          cardImage.src = `assets/images/${card}.png`;
          document.querySelector(activePlayer['div']).appendChild(cardImage)
          hitSound.play()
     }
}

function deal() {
     if (state['trunsOver'] === true) {
          state['isStand'] = false

          clear()
          
     }
}

function clear() {
     const youImages = document.querySelector('#you-tab').querySelectorAll('img')
     for (let i=0; i < youImages.length; i++)
          youImages[i].remove()

     const dealerImages = document.querySelector('#dealer-tab').querySelectorAll('img')
     for (let i=0; i < dealerImages.length; i++)
          dealerImages[i].remove()

     you['score'] = 0
     dealer['score'] = 0
     
     document.querySelector('#you-score').textContent = 0
     document.querySelector('#dealer-score').textContent = 0

     document.querySelector('#you-score').style.color = 'white'
     document.querySelector('#dealer-score').style.color = 'white'

     document.querySelector('#status').textContent = 'Let\'s Play'
     document.querySelector('#status').style.color = 'white'

     document.querySelector('#bet').disabled = false

     state['trunsOver'] = false
     state['isGameOver'] = false
}

function updateScore(card, activePlayer) {
     if (card === 'A') {
          if ( activePlayer['score'] + blackjackGame['cardsScore'][card][1] <= 21){
               activePlayer['score'] += blackjackGame['cardsScore'][card][1]
          }
          else {
               activePlayer['score'] += blackjackGame['cardsScore'][card][0]
          }
     }
     else
          activePlayer['score'] += blackjackGame['cardsScore'][card]

}

function showScore(activePlayer) {
     if (activePlayer['score'] > 21) {
          document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!'
          document.querySelector(activePlayer['scoreSpan']).style.color = 'red'
     }
     else
          document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score']
}

function sleep(ms) {
     return new Promise(resolve => setTimeout(resolve, ms))
}

async function bust() {
     if (you['score'] > 21) {
          await sleep(1000)
          stand()
     }
}

async function stand() {
     if (you['score'] > 1) {
          if (state['isGameOver'] === false) {
               state['isStand'] = true  
               state['isGameOver'] = true
               while (dealer['score'] < 16 && state['isStand'] === true) {
                         
                    let card = randomCard()
                    showCard(card, dealer)
                    updateScore(card, dealer)
                    showScore(dealer)
                    await sleep(1200)
               }
               if (dealer['score'] > 15) {
                    state['trunsOver'] = true
                    status(getWinner())
               }
          } 
     }
}

function getWinner() {
     let winner = 0;
     value = parseInt(document.querySelector('#bet').value)
     credit['bet'] = value

     if (you['score'] <= 21) {
          if (you['score'] > dealer['score'] || dealer['score'] > 21) {
               winner = you
          }
          else if (you['score'] < dealer['score']) {
               winner = dealer
          }
          else if (you['score'] === dealer['score']) {
               winner 
          }
     }
     else if (you['score'] > 21 && dealer['score'] <= 21) {
          winner = dealer
     }
     else if (you['score'] > 21 && dealer['score'] > 21) {
          winner
     }

     return winner
}

function status(winner) {
     let message, color ;
     if ( state['trunsOver'] === true) {

          if (winner === you) {
               winSound.play()
               message = "You Won"
               color = 'rgb(32, 248, 3)'
               score['win']++
               credit['total'] += credit['bet']
          }
          else if (winner === dealer) {
               loseSound.play()
               message = "You lose"
               color = 'rgb(248, 3, 3)'
               score['lose']++
               if (value > credit['total'])
                    credit['total'] = 0
               else 
                    credit['total'] -= credit['bet']
          }
          else {
               drawSound.play()
               message = "It's A Draw"
               color = 'rgb(3, 211, 248)'
               score['draw']++
          }

          document.querySelector('#status').textContent = message
          document.querySelector('#status').style.color = color

          document.querySelector('#win').textContent = score['win']
          document.querySelector('#lose').textContent = score['lose']
          document.querySelector('#draw').textContent = score['draw']
     }  
     bet()   
     document.querySelector('#bet').disabled = false
     document.querySelector('#total').textContent = credit['total']
     if (value > credit['total']) { 
          document.querySelector('#bet').selectedIndex = 0 }

     save()
}

function bet() {
     let ten = (credit['total'] < 10000) ? true : false
     let five = (credit['total'] < 5000) ? true : false
     let two = (credit['total'] < 2000) ? true : false
     let one = (credit['total'] < 1000) ? true : false
     let half = (credit['total'] < 500) ? true : false

     document.querySelector('#half').disabled = half
     document.querySelector('#one').disabled = one
     document.querySelector('#two').disabled = two
     document.querySelector('#five').disabled = five
     document.querySelector('#ten').disabled = ten
}

function ads() {
     document.querySelector('.help-me-on ol').style.display = 'none'
     document.querySelector('.get').style.display = 'block'
     document.querySelector('#rule').textContent = 'Not Enough Points'
     document.querySelector('.help-me').style.display = 'flex'
}

function noAds() {
     document.querySelector('.help-me-on ol').style.display = 'block'
     document.querySelector('.get').style.display = 'none'
     document.querySelector('#rule').textContent = 'Blackjack Rules'
}

function get() {
     credit['total'] += 1000
     document.querySelector('#total').textContent = credit['total']
     clear()
     bet()
     document.querySelector('.help-me').style.display = 'none'
}

function save() {
     let bjScore = {
          'score': score,
          'credit': credit['total'],
     }
     bjScore = JSON.stringify(bjScore)
     localStorage.setItem('bj-score', bjScore)
}


async function registerSW() {
     if ('serviceWorker' in navigator) {
          try {
               await navigator.serviceWorker.register('sw.js');
          } catch (err) {
               console.log(`SW registration failed`, err);
          }
     }
}
