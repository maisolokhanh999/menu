// Puzzle Game Logic
class PuzzleGame {
    constructor() {
        this.rows = 3;
        this.cols = 4; 
        this.tiles = [];
        this.emptyPos = { row: 0, col: 0 };
        this.moves = 0;
        this.seconds = 0;
        this.timerInterval = null;
        this.isGameActive = false;
        this.gameHistory = this.loadHistory();
        this.initializeElements();
        this.attachEventListeners();
        this.initializeGame();
        this.renderHistory();
    }

    initializeElements() {
        this.boardElement = document.getElementById('puzzleBoard');
        this.moveCountElement = document.getElementById('moveCount');
        this.timerElement = document.getElementById('timer');
        this.difficultySelect = document.getElementById('difficulty');
        this.difficultySelect.value=3;
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.winMessage = document.getElementById('winMessage');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.finalMovesElement = document.getElementById('finalMoves');
        this.finalTimeElement = document.getElementById('finalTime');
        this.historyTableBody = document.getElementById('historyTableBody');
    }

    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.toggleGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.playAgainBtn.addEventListener('click', () => this.playAgain());
        this.difficultySelect.addEventListener('change', (e) => {
            this.rows = parseInt(e.target.value);
            this.resetGame();
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    handleKeyPress(e) {
        if (!this.isGameActive) return;
        
        const key = e.key.toLowerCase();
        let targetRow = this.emptyPos.row;
        let targetCol = this.emptyPos.col;
        
        
        
        if (key === 'w' || key === 'arrowup') {
            targetRow = this.emptyPos.row - 1; 
        } else if (key === 's' || key === 'arrowdown') {
            targetRow = this.emptyPos.row + 1; 
        } else if (key === 'a' || key === 'arrowleft') {
            targetCol = this.emptyPos.col - 1; 
        } else if (key === 'd' || key === 'arrowright') {
            targetCol = this.emptyPos.col + 1; 
        } else {
            return; 
        }
        
   
        if (targetRow >= 0 && targetRow < this.rows && 
            targetCol >= 0 && targetCol < this.cols) {
            this.moveTile(targetRow, targetCol);
            e.preventDefault(); 
        }
    }

    initializeGame() {
        this.rows = parseInt(this.difficultySelect.value);
        this.createSolvedBoard();
        this.renderBoard();
        this.updateStats();
    }

    createSolvedBoard() {
        this.tiles = [];
        for (let i = 0; i < this.rows; i++) {
            this.tiles[i] = [];
            for (let j = 0; j < this.cols; j++) {
                const value = i * this.cols + j + 1;
                this.tiles[i][j] = value <= this.rows * this.cols - 1 ? value : 0;
            }
        }
        this.emptyPos = { row: this.rows - 1, col: this.cols - 1 };
    }

    renderBoard() {
        this.boardElement.innerHTML = '';
        this.boardElement.className = 'puzzle-board';
        this.boardElement.style.gridTemplateColumns = `repeat(${this.cols}, 100px)`;
        this.boardElement.style.gridTemplateRows = `repeat(${this.rows}, 100px)`;

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const tile = document.createElement('div');
                tile.className = 'puzzle-tile';

                if (this.tiles[i][j] === 0) {
                    tile.classList.add('empty');
                } else {
                    tile.textContent = this.tiles[i][j];
                    tile.dataset.row = i;
                    tile.dataset.col = j;

                    if (this.isMovable(i, j)) {
                        tile.classList.add('movable');
                    }

                    tile.addEventListener('click', () => this.moveTile(i, j));
                }

                this.boardElement.appendChild(tile);
            }
        }
    }

    isMovable(row, col) {
        const rowDiff = Math.abs(row - this.emptyPos.row);
        const colDiff = Math.abs(col - this.emptyPos.col);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    moveTile(row, col) {
        if (!this.isGameActive) return;
        
        if (this.isMovable(row, col)) {
            
            this.tiles[this.emptyPos.row][this.emptyPos.col] = this.tiles[row][col];
            this.tiles[row][col] = 0;
            this.emptyPos = { row, col };
            
            this.moves++;
            this.updateStats();
            this.renderBoard();
            
          
            if (this.isSolved()) {
                this.winGame();
            }
        }
    }

    toggleGame() {
        if (!this.isGameActive) {
            // Start game
            this.shuffleBoard();
            this.startBtn.querySelector('p').textContent = ' Kết thúc';
            this.startBtn.classList.add('active');
        } else {
            // End game
            this.stopTimer();
            this.isGameActive = false;
            this.startBtn.querySelector('p').textContent = ' Bắt đầu';
            this.startBtn.classList.remove('active');
        }
    }

    shuffleBoard() {
        this.stopTimer();
        this.moves = 0;
        this.seconds = 0;
        this.updateStats();
        const shuffleMoves = 100;
        
        for (let i = 0; i < shuffleMoves; i++) {
            const movableTiles = this.getMovableTiles();
            if (movableTiles.length > 0) {
                const randomTile = movableTiles[Math.floor(Math.random() * movableTiles.length)];
                this.tiles[this.emptyPos.row][this.emptyPos.col] = this.tiles[randomTile.row][randomTile.col];
                this.tiles[randomTile.row][randomTile.col] = 0;
                this.emptyPos = { row: randomTile.row, col: randomTile.col };
            }
        }
        
        
        if (this.isSolved()) {
            this.shuffleBoard();
            return;
        }
        
        this.renderBoard();
        this.isGameActive = true;
        this.startTimer();
    }

    getMovableTiles() {
        const movable = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.tiles[i][j] !== 0 && this.isMovable(i, j)) {
                    movable.push({ row: i, col: j });
                }
            }
        }
        return movable;
    }

    isSolved() {
        let expectedValue = 1;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (i === this.rows - 1 && j === this.cols - 1) {
                    return this.tiles[i][j] === 0;
                }
                if (this.tiles[i][j] !== expectedValue) {
                    return false;
                }
                expectedValue++;
            }
        }
        return true;
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.seconds++;
            this.updateTimer();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimer() {
        const minutes = Math.floor(this.seconds / 60);
        const secs = this.seconds % 60;
        this.timerElement.textContent = 
            `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    updateStats() {
        this.moveCountElement.textContent = this.moves;
        this.updateTimer();
    }

    winGame() {
        this.isGameActive = false;
        this.stopTimer();
        this.finalMovesElement.textContent = this.moves;
        this.finalTimeElement.textContent = this.timerElement.textContent;
        this.saveToHistory();
        this.startBtn.querySelector('p').textContent = ' Bắt đầu';
        this.startBtn.classList.remove('active');
        
        
        setTimeout(() => {
            this.winMessage.classList.remove('hidden');
        }, 300);
    }

    saveToHistory() {
        try {
            const historyEntry = {
                moves: this.moves,
                time: this.timerElement.textContent,
                timestamp: new Date().getTime()
            };

            console.log('Saving history entry:', historyEntry);

            this.gameHistory.unshift(historyEntry);

            // Keep only last 10 games
            if (this.gameHistory.length > 10) {
                this.gameHistory = this.gameHistory.slice(0, 10);
            }

            const historyJSON = JSON.stringify(this.gameHistory);
            localStorage.setItem('puzzleGameHistory', historyJSON);
            console.log('History saved to localStorage:', this.gameHistory.length, 'entries');
            this.renderHistory();
        } catch (error) {
            console.error('Error saving history:', error);
            alert('Không thể lưu lịch sử. Vui lòng kiểm tra cài đặt trình duyệt cho phép localStorage.');
        }
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('puzzleGameHistory');
            const history = saved ? JSON.parse(saved) : [];
            console.log('Loaded history from localStorage:', history.length, 'entries');
            return history;
        } catch (error) {
            console.error('Error loading history:', error);
            return [];
        }
    }

    renderHistory() {
        this.historyTableBody.innerHTML = '';
        if (this.gameHistory.length === 0) {
            const noHistoryRow = document.createElement('tr');
            noHistoryRow.className = 'no-history';
            noHistoryRow.innerHTML = '<td colspan="4">Chưa có lượt chơi nào</td>';
            this.historyTableBody.appendChild(noHistoryRow);
        } else {
            this.gameHistory.forEach((entry, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${entry.moves}</td>
                    <td>${entry.time}</td>
                `;
                this.historyTableBody.appendChild(row);
            });
        }
    }

    playAgain() {
        this.winMessage.classList.add('hidden');
        this.shuffleBoard();
    }

    resetGame() {
        this.stopTimer();
        this.moves = 0;
        this.seconds = 0;
        this.isGameActive = false;
        this.winMessage.classList.add('hidden');
        this.startBtn.querySelector('p').textContent = ' Bắt đầu';
        this.startBtn.classList.remove('active');
        this.createSolvedBoard();
        this.renderBoard();
        this.updateStats();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const game = new PuzzleGame();
});
