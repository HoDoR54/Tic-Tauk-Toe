const playerOne = document.getElementsByClassName('js-player-1')[0];
const playerTwo = document.getElementsByClassName('js-player-2')[0];

const startBtn = document.getElementById('js-start-btn');
const endBtn = document.getElementById('js-end-btn');

const gameCell = document.querySelectorAll('.js-cell');

let playerTurn;
let isStarted = false;
startBtn.addEventListener('click', () => {
    isStarted = true;
    playerTurn = chooseFirstPlayer();
    startBtn.disabled = true;
    startBtn.classList.add('disabled');
    endBtn.classList.remove('disabled');
    switch (playerTurn) {
        case '1':
        playerTwo.classList.remove('grow-shrink');
        playerOne.classList.add('grow-shrink');
        break;
        case '2':
        playerOne.classList.remove('grow-shrink');
        playerTwo.classList.add('grow-shrink');
        break;
    }
})

endBtn.addEventListener('click', () => {
    isStarted = false;
    gameCell.forEach((cell) => {
        cell.classList.remove('player-one-clicked');
        cell.classList.remove('player-two-clicked');
    })
    playerOne.classList.remove('grow-shrink');
    playerTwo.classList.remove('grow-shrink');
    
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
gameCell.forEach((cell) => {
    cell.addEventListener('click', () => {
        if (!isStarted) return;

        const index = cell.dataset.index;
        const clickedCell = gameCell[index];
        switch (playerTurn) {
            case '1':
            clickedCell.classList.add('player-one-clicked');
            playerTurn = '2';
            playerTwo.classList.remove('grow-shrink');
            playerOne.classList.add('grow-shrink');
            break;
            case '2':
            clickedCell.classList.add('player-two-clicked');
            playerTurn = '1';
            playerOne.classList.remove('grow-shrink');
            playerTwo.classList.add('grow-shrink');
            break;
        }
    })
})
