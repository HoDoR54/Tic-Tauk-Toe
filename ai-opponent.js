const gameCells = document.querySelectorAll('.js-cell');
const wins = [
    [0,1,2],
    [3,4,5],
    [6,7,8],

    [0,3,6],
    [1,4,7],
    [2,5,8],

    [0,4,8],
    [6,4,2],
]

export function makeAiMove () {
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
    })

    console.log(bestMove)

    if (bestMove) {
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
    if (winner === undefined) return 0;

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
        })
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
        })

        return bestScore;
    }
}

function checkWinner () {
    let currentBoard = [];
    let winner;
    
        gameCells.forEach((cell) => {
            const cellPlayer = cell.getAttribute('data-player');
            currentBoard.push(cellPlayer || '0');
        });
    
        let isWin = false;

        wins.forEach((pattern) => {
            if (
                currentBoard[pattern[0]] === currentBoard[pattern[1]] &&
                currentBoard[pattern[1]] === currentBoard[pattern[2]] &&
                currentBoard[pattern[0]] !== '0'
            ) {
                isWin = true;
                winner = currentBoard[pattern[0]].getAttribute('data-player');
            }
        });

        if (!isWin && currentBoard.every(cell => cell !== '0')) {
            winner = undefined;
        }
        return winner;
}