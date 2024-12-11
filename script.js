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
    isStarted = false;
    gameCells.forEach((cell) => {
        cell.classList.remove('player-one-clicked');
        cell.classList.remove('player-two-clicked');
        cell.removeAttribute('data-status');
        cell.removeAttribute('data-player');
    })
    playerOne.classList.remove('grow-shrink');
    playerTwo.classList.remove('grow-shrink');
    endBtn.classList.add('disabled');
    startBtn.classList.remove('disabled');
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
        if (cellPlayer) {
            currentBoard.push(cellPlayer);
        } else {
            currentBoard.push('0');
        }
    });
    setTimeout(() => {
        const reslutDisplay = document.getElementById('js-result');
        const overlay = document.getElementById('js-overlay');
        wins.forEach((pattern) => {
            if (
                currentBoard[pattern[0]] === currentBoard[pattern[1]] &&
                currentBoard[pattern[1]] === currentBoard[pattern[2]] &&
                currentBoard[pattern[0]] !== '0'
            ) {
                reslutDisplay.classList.remove('hidden');
                switch (currentBoard[pattern[0]]) {
                    case '1':
                    reslutDisplay.textContent = 'Player 1 has won!!'
                    break;
                    case '2':
                    reslutDisplay.textContent = 'Player 2 has won!!'
                    break;
                }
                overlay.classList.remove('hidden');
                overlay.addEventListener('click', () => {
                    overlay.classList.add('hidden');
                    reslutDisplay.classList.add('hidden');
                })
            }
        });
    }, 250);
}
