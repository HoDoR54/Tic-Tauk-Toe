import {wins} from "./wins.js";

let gameMode = localStorage.getItem('current-mode') || 'menu';

const playerOne = document.getElementsByClassName('js-player-1')[0];
const playerTwo = document.getElementsByClassName('js-player-2')[0];

const startBtn = document.getElementById('js-start-btn');
const endBtn = document.getElementById('js-end-btn');

const gameCells = document.querySelectorAll('.js-cell');

let playerTurn;
let isStarted = false;
startBtn.addEventListener('click', () => { 
    isStarted = true;
    if (gameMode != 'vs-ai') {
        playerTurn = chooseFirstPlayer();
        
        switch (playerTurn) {
            case '1':
                playerOne.classList.add('grow-shrink');
                playerTwo.classList.remove('grow-shrink');
                break;
            case '2':
                playerTwo.classList.add('grow-shrink');
                playerOne.classList.remove('grow-shrink');
                break;
        }
    } else {
        playerTurn = '1';
        playerOne.classList.add('grow-shrink');
        playerTwo.classList.remove('grow-shrink');
    }
    startBtn.classList.add('disabled');
    endBtn.classList.remove('disabled');
})

endBtn.addEventListener('click', () => {
    resetGame(resultDisplay, overlay);
})

function chooseFirstPlayer () {
    const randomNum = Math.floor(Math.random() * 2)
    let firstPlayer;
    if (randomNum === 0) {
        firstPlayer = '1';
    } else {
        firstPlayer = '2';
        playerOne.classList.remove('grow-shrink');
        playerTwo.classList.add('grow-shrink');
    }
    return firstPlayer;
}
gameCells.forEach((cell) => {
    cell.addEventListener('click', () => {
        if (!isStarted) return;
        if (cell.getAttribute('data-status') === 'taken') return;

        if (gameMode === 'vs-ai') {
            if (playerTurn === '1') {
                cell.classList.add('player-one-clicked');
                cell.setAttribute('data-player', '1');
                cell.setAttribute('data-status', 'taken');
                playerOne.classList.remove('grow-shrink');
                playerTwo.classList.add('grow-shrink');
                checkResult();

                if (isStarted) {
                    // Delay AI's move for realism
                    setTimeout(() => {
                        vsAi(); // AI makes a move
                        playerTwo.classList.remove('grow-shrink');
                        playerOne.classList.add('grow-shrink'); // Switch highlight to Player 1
                        checkResult();
                    }, Math.random() * 3000);
                }
            }
        } else {
            // Two-players mode
            switch (playerTurn) {
                case '1':
                    cell.classList.add('player-one-clicked');
                    cell.setAttribute('data-player', '1');
                    cell.setAttribute('data-status', 'taken');
                    playerOne.classList.remove('grow-shrink');
                    playerTwo.classList.add('grow-shrink');
                    playerTurn = '2';
                    break;
                case '2':
                    cell.classList.add('player-two-clicked');
                    cell.setAttribute('data-player', '2');
                    cell.setAttribute('data-status', 'taken');
                    playerTwo.classList.remove('grow-shrink');
                    playerOne.classList.add('grow-shrink');
                    playerTurn = '1';
                    break;
            }
            checkResult();
        }
    });
});


const overlay = document.getElementById('js-overlay');
const resultDisplay = document.getElementById('js-result');

function checkResult() {
    let currentBoard = [];

    gameCells.forEach((cell) => {
        const cellPlayer = cell.getAttribute('data-player');
        currentBoard.push(cellPlayer || '0');
    });

    setTimeout(() => {
        let isWin = false;

        wins.forEach((pattern) => {
            if (
                currentBoard[pattern[0]] === currentBoard[pattern[1]] &&
                currentBoard[pattern[1]] === currentBoard[pattern[2]] &&
                currentBoard[pattern[0]] !== '0'
            ) {
                isWin = true;
                resultDisplay.classList.remove('hidden');
                switch (currentBoard[pattern[0]]) {
                    case '1':
                        resultDisplay.textContent = 'Player 1 has won!!';
                        break;
                    case '2':
                        resultDisplay.textContent = 'Player 2 has won!!';
                        break;
                }
                overlay.classList.remove('hidden');
                overlay.addEventListener('click', () => {
                    resetGame(resultDisplay, overlay);
                }, { once: true });
            }
        });

        if (!isWin && currentBoard.every(cell => cell !== '0')) {
            resultDisplay.textContent = 'It\'s a tie.';
            resultDisplay.classList.remove('hidden');
            overlay.classList.remove('hidden');
            overlay.addEventListener('click', () => {
                resetGame(resultDisplay, overlay);
            }, { once: true });
        }
    }, 250);
}

function resetGame(resultDisplay, overlay) {
    overlay.classList.add('hidden');
    resultDisplay.classList.add('hidden');
    playerOne.classList.remove('grow-shrink');
    playerTwo.classList.remove('grow-shrink');
    startBtn.classList.remove('disabled');
    endBtn.classList.add('disabled');
    gameCells.forEach((cell) => {
        cell.classList.remove('player-one-clicked', 'player-two-clicked');
        cell.removeAttribute('data-status');
        cell.removeAttribute('data-player');
    });
    isStarted = false;
}

const twoplayerModeBtn = document.getElementById('js-two-players-menu');
const twoplayerMode = document.getElementById('js-two-players');
const vsAiModeBtn = document.getElementById('js-vs-ai-menu');
const menuBox = document.getElementById('js-game-menu');
const backToMenu = document.getElementById('js-back-to-menu');
const modeDisplay = document.getElementById('js-mode-display');

function updateMode(mode) {
    if (mode === 'menu') {
        menuBox.classList.remove('hidden');
        twoplayerMode.classList.add('hidden');
    } else if (mode === 'two-players') {
        twoplayerMode.classList.remove('hidden');
        menuBox.classList.add('hidden');
        playerOne.textContent = 'Player 1';
        playerTwo.textContent = 'Player 2';
        modeDisplay.textContent = 'Two Players'
    } else if (mode === 'vs-ai') {
        twoplayerMode.classList.remove('hidden');
        menuBox.classList.add('hidden');
        playerOne.textContent = 'You';
        playerTwo.textContent = 'Computer';
        modeDisplay.textContent = 'Versus A.I.'
    }
    localStorage.setItem('current-mode', mode);
    console.log(localStorage.getItem('current-mode'));
    resetGame(resultDisplay, overlay);
}

updateMode(gameMode);

twoplayerModeBtn.addEventListener('click', () => {
    updateMode('two-players');
});

backToMenu.addEventListener('click', () => {
    updateMode('menu');
});

vsAiModeBtn.addEventListener('click', () => {
    updateMode('vs-ai');
});

function vsAi () {
    let playerMoves = [];
    let aiMoves = [];

    gameCells.forEach((cell, index) => {
        const cellPlayer = cell.getAttribute('data-player');
        if (cellPlayer === '1') {
            playerMoves.push(index);
            cell.setAttribute('data-status', 'taken');
        } else if (cellPlayer === '2') {
            aiMoves.push(index);
            cell.setAttribute('data-status', 'taken');
        } else {
            return;
        }
    })

    wins.forEach((pattern) => {
        pattern.forEach((move) => {

        })
    })
}


/* 
    computer အလှည့်ရောက်မရောက်စစ်မယ် (done)
    (+ a random delay) (done)
    board ပေါ်မှာရှိတဲ့ player 1 ရဲ့ move တွေကို ဖတ်မယ် (done)
    အဲဒီ move တွေကို wins.js ထဲက array တွေနဲ့ တိုက်စစ်မယ်
    တကယ်လို့ နိုင်ဖို့နီးစပ်နေရင် နိုင်မယ့်အကွက်ကို ပိတ်မယ်
    တကယ်လို့ နိုင်ဖို့မနီးစပ်ဘူးဆိုရင် ကိုယ်တိုင်နိုင်ဖို့လုပ်မယ်
    အလှည့်ပြန်ပြောင်းမယ်
*/