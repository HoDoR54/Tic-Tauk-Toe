import {wins} from "./wins.js";

let gameMode = localStorage.getItem('current-mode') || 'menu';


const playerOne = document.getElementsByClassName('js-player-1')[0];
const playerTwo = document.getElementsByClassName('js-player-2')[0];

const startBtn = document.getElementById('js-start-btn');
const endBtn = document.getElementById('js-end-btn');

const gameCells = document.querySelectorAll('.js-cell');

let playerTurn;
let isStarted = false;
let isDone = false;

startBtn.addEventListener('click', () => {
    isDone = false;
    
    isStarted = true;
    if (localStorage.getItem('current-mode') === 'vs-ai') {
        playerTurn = '1';
        playerOne.classList.add('grow-shrink');
        playerTwo.classList.remove('grow-shrink');
    } else if (localStorage.getItem('current-mode') === 'two-players') {
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
        playerOne.classList.add('grow-shrink');
        playerTwo.classList.remove('grow-shrink');
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

        if (localStorage.getItem('current-mode') === 'vs-ai') {
            cell.classList.add('player-one-clicked');
            cell.setAttribute('data-player', '1');
            cell.setAttribute('data-status', 'taken');
            playerOne.classList.remove('grow-shrink');
            playerTwo.classList.add('grow-shrink');
            checkResult();
            playerTurn = '2';

            if (playerTurn === '2') {
                setTimeout(() => {
                    if(isDone) return;
                    makeAiMove();
                    playerTwo.classList.remove('grow-shrink');
                    playerOne.classList.add('grow-shrink');
                    checkResult();
                    playerTurn = '1';
                }, Math.random() * 2000 + 500);
            }
        } else if (localStorage.getItem('current-mode') !== 'vs-ai') {
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
    const currentMode = localStorage.getItem('current-mode');
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
                isDone = true;
                isWin = true;
                resultDisplay.classList.remove('hidden');
                switch (currentBoard[pattern[0]]) {
                    case '1':
                        switch(currentMode) {
                            case 'two-players':
                                resultDisplay.textContent = 'Player 1 has won!!';
                            break;
                            case 'vs-ai':
                                resultDisplay.textContent = 'You have won!!';
                            break;
                        } 
                        break;
                    case '2':
                        switch(currentMode) {
                            case 'two-players':
                                resultDisplay.textContent = 'Player 2 has won!!';
                            break;
                            case 'vs-ai':
                                resultDisplay.textContent = 'Computer has won!!';
                            break;
                        }
                        
                        break;
                }
                overlay.classList.remove('hidden');
                overlay.addEventListener('click', () => {
                    resetGame(resultDisplay, overlay);
                });
            }
        });

        if (!isWin && currentBoard.every(cell => cell !== '0')) {
            isDone = true;
            
            resultDisplay.textContent = 'It\'s a tie.';
            resultDisplay.classList.remove('hidden');
            overlay.classList.remove('hidden');
            overlay.addEventListener('click', () => {
                resetGame(resultDisplay, overlay);
            });
        }
    }, 250);
}

function resetGame(resultDisplay, overlay) {
    isStarted = false;
    isDone = true;
    
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


function makeAiMove() {
    if (isDone) return;
    let bestScore = -Infinity;
    let bestMove;

    gameCells.forEach((cell, index) => {
        if (!cell.hasAttribute('data-status')) {
            cell.setAttribute('data-status', 'taken');
            cell.setAttribute('data-player', '2');

            let score = minimax(false);

            cell.removeAttribute('data-status');
            cell.removeAttribute('data-player');

            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }
        }
    });

    if (bestMove !== undefined) {
        const cell = gameCells[bestMove];
        cell.setAttribute('data-status', 'taken');
        cell.setAttribute('data-player', '2');
        cell.classList.add('player-two-clicked');
    }
}

function minimax(isMaximizing) {
    const winner = checkWinner();

    if (winner === '1') return -1;
    if (winner === '2') return 1;
    if (winner === null) return 0; 

    if (isMaximizing) {
        let bestScore = -Infinity;

        gameCells.forEach((cell) => {
            if (!cell.hasAttribute('data-status')) {
                cell.setAttribute('data-status', 'taken');
                cell.setAttribute('data-player', '2');

                let score = minimax(false);

                cell.removeAttribute('data-status');
                cell.removeAttribute('data-player');

                bestScore = Math.max(score, bestScore);
            }
        });

        return bestScore;
    } else {
        let bestScore = Infinity;

        gameCells.forEach((cell) => {
            if (!cell.hasAttribute('data-status')) {
                cell.setAttribute('data-status', 'taken');
                cell.setAttribute('data-player', '1');

                let score = minimax(true);

                cell.removeAttribute('data-status');
                cell.removeAttribute('data-player');

                bestScore = Math.min(score, bestScore);
            }
        });

        return bestScore;
    }
}

function checkWinner() {
    const currentBoard = Array.from(gameCells).map(cell => cell.getAttribute('data-player') || '0');

    for (let pattern of wins) {
        const [a, b, c] = pattern;
        if (currentBoard[a] === currentBoard[b] && currentBoard[b] === currentBoard[c] && currentBoard[a] !== '0') {
            return currentBoard[a];
        }
    }

    if (currentBoard.every(cell => cell !== '0')) {
        return null;
    }

    return undefined;
}
