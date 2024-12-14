import {wins} from "./wins.js";


const playerOne = document.getElementsByClassName('js-player-1')[0];
const playerTwo = document.getElementsByClassName('js-player-2')[0];

const startBtn = document.getElementById('js-start-btn');
const endBtn = document.getElementById('js-end-btn');

const gameCells = document.querySelectorAll('.js-cell');

let playerTurn;
let isStarted = false;
startBtn.addEventListener('click', () => { 
    isStarted = true;
    playerTurn = chooseFirstPlayer();
    startBtn.classList.add('disabled');
    endBtn.classList.remove('disabled');
    
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
})

endBtn.addEventListener('click', () => {
    resetGame();
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
gameCells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (!isStarted) return;

        if (cell.getAttribute('data-status') === 'taken') return;

        switch (playerTurn) {
            case '1':
                cell.classList.add('player-one-clicked');
                playerOne.classList.remove('grow-shrink');
                playerTwo.classList.add('grow-shrink');
                playerTurn = '2';
                cell.setAttribute('data-player', '1');
                cell.setAttribute('data-status', 'taken');
                break;
            case '2':
                cell.classList.add('player-two-clicked');
                playerTwo.classList.remove('grow-shrink');
                playerOne.classList.add('grow-shrink');
                playerTurn = '1';
                cell.setAttribute('data-player', '2');
                cell.setAttribute('data-status', 'taken');
                break;
        }

        checkResult();
    });
});

function checkResult() {
    let currentBoard = [];

    gameCells.forEach((cell) => {
        const cellPlayer = cell.getAttribute('data-player');
        currentBoard.push(cellPlayer || '0');
    });

    setTimeout(() => {
        const resultDisplay = document.getElementById('js-result');
        const overlay = document.getElementById('js-overlay');
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

let gameMode = localStorage.getItem('current-mode') || 'menu';

function updateMode(mode) {
    if (mode === 'menu') {
        menuBox.classList.remove('hidden');
        twoplayerMode.classList.add('hidden');
    } else if (mode === 'two-players') {
        twoplayerMode.classList.remove('hidden');
        menuBox.classList.add('hidden');
    } else if (mode === 'vs-ai') {
        twoplayerMode.classList.remove('hidden');
        menuBox.classList.add('hidden');
        playerOne.textContent = 'You';
        playerTwo.textContent = 'Computer';
    }
    localStorage.setItem('current-mode', mode);
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
