const board = document.getElementById('board');
const message = document.getElementById('message');
const playerBtn = document.getElementById('playerBtn');
const aiBtn = document.getElementById('aiBtn');
const restartBtn = document.getElementById('restartBtn');
const cells = [];
const line = document.createElement('div');

let currentPlayer = 'X';
let gameActive = true;
let againstAI = false;
let firstMoveMade = false; // Variable to track if the first move is made

// Initialize the game board
function initializeBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
        cells.push(cell);
    }
}

// Handle cell click event
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (cells[clickedCellIndex].textContent || !gameActive) return;

    // Update cell content
    cells[clickedCellIndex].textContent = currentPlayer;
    firstMoveMade = true; // Set to true after the first move is made

    // Show restart button after the first move is made
    restartBtn.style.display = 'inline-block';

    // Check for winner
    if (checkForWinner()) {
        message.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        drawWinningLine();
        return;
    }

    // Check for tie
    if (checkForTie()) {
        message.textContent = "It's a tie!";
        gameActive = false;
        return;
    }

    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    message.textContent = `Player ${currentPlayer}'s turn`;

    // If playing against AI, let AI make a move
    if (againstAI && currentPlayer === 'O' && gameActive) {
        setTimeout(makeAIMove, 500);
    }
}

// Make AI move
function makeAIMove() {
    const availableCells = cells.filter(cell => !cell.textContent);
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const selectedCell = availableCells[randomIndex];
    const selectedCellIndex = parseInt(selectedCell.getAttribute('data-index'));

    cells[selectedCellIndex].textContent = currentPlayer;

    // Check for winner
    if (checkForWinner()) {
        message.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        drawWinningLine();
        return;
    }

    // Check for tie
    if (checkForTie()) {
        message.textContent = "It's a tie!";
        gameActive = false;
        return;
    }

    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    message.textContent = `Player ${currentPlayer}'s turn`;
}

// Check for winner
function checkForWinner() {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winningCombos.some(combo => {
        const [a, b, c] = combo;
        return (
            cells[a].textContent &&
            cells[a].textContent === cells[b].textContent &&
            cells[a].textContent === cells[c].textContent
        );
    });
}

// Check for tie
function checkForTie() {
    return [...cells].every(cell => cell.textContent);
}


// Restart game
function restartGame() {
    cells.forEach(cell => {
        cell.textContent = '';
    });
    currentPlayer = 'X';
    gameActive = true;
    message.textContent = `Player ${currentPlayer}'s turn`;
    if (againstAI && currentPlayer === 'O') {
        makeAIMove();
    } else if (againstAI && currentPlayer === 'X') {
        currentPlayer = 'X';
        message.textContent = `Player ${currentPlayer}'s turn`;
    }
    if (line.parentNode === board) {
        board.removeChild(line);
    }
    // Hide the restart button after restarting the game
    restartBtn.style.display = 'none';
}

// Initialize the game
initializeBoard();
message.textContent = `Player ${currentPlayer}'s turn`;

// Event listeners for new game buttons
playerBtn.addEventListener('click', () => {
    restartGame();
    againstAI = false;
});

aiBtn.addEventListener('click', () => {
    restartGame();
    againstAI = true;
    if (currentPlayer === 'O') {
        makeAIMove();
    }
});

// Event listener for restart button
restartBtn.addEventListener('click', restartGame);
