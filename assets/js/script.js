document.addEventListener("DOMContentLoaded", () => {
    // Core game state and cached DOM nodes
    const grid = document.querySelector(".grid");
    const width = 10;
    let bombsAmount = 20;
    let squares = [];
    let isGameOver = false;
    let flags = 0;

    // UI controls and readouts: theme toggle, reset button, timer, and remaining mines display
    const themeSwitch = document.getElementById("theme-switch");
    const resetButton = document.getElementById("reset-button");
    const timerDisplay = document.getElementById("timer");
    const minesCountDisplay = document.getElementById("mines-count");

    // Timer bookkeeping: interval handle, start timestamp, and running flag
    let timerInterval = null;
    let timerStart = null;
    let timerRunning = false;

    // Reflect remaining mines in the UI
    const updateMinesCount = () => {
        if (minesCountDisplay) {
            minesCountDisplay.textContent = `Mines: ${bombsAmount - flags}`;
        }
    };

    const resetTimer = () => {
        clearInterval(timerInterval);
        timerInterval = null;
        timerStart = null;
        timerRunning = false;
        if (timerDisplay) timerDisplay.textContent = "Time: 0s";
    };

    const updateTimer = () => {
        if (!timerDisplay || !timerStart) return;
        const seconds = Math.floor((Date.now() - timerStart) / 1000);
        timerDisplay.textContent = `Time: ${seconds}s`;
    };

    const startTimer = () => {
        if (timerRunning) return;
        timerStart = Date.now();
        timerRunning = true;
        timerInterval = setInterval(updateTimer, 1000);
    };

    const stopTimer = () => {
        clearInterval(timerInterval);
        timerInterval = null;
        timerRunning = false;
    };

    // apply saved theme
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") document.body.classList.add("darkmode");

    // toggle theme
    themeSwitch?.addEventListener("click", () => {
        document.body.classList.toggle("darkmode");
        const currentTheme = document.body.classList.contains("darkmode") ? "dark" : "light";
        localStorage.setItem("theme", currentTheme);
    });

    // Build a fresh board with bombs, numbers, and handlers
    function createBoard() {
        // Clear any previous cells from the grid container
        grid.innerHTML = "";
        squares = [];
        flags = 0;
        isGameOver = false;
        resetTimer();
        updateMinesCount();

        // Prepare board contents: exact bomb count + remaining safe cells, then shuffle for randomness
        const bombsArray = Array(bombsAmount).fill("bomb");
        const emptyArray = Array(width * width - bombsAmount).fill("valid");
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

        // Create every cell DOM node, tag it with its id and bomb/valid class, append to the grid, and keep a reference
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.setAttribute("id", i);
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);

            // left click
            square.addEventListener("click", () => click(square));
            // right click
            square.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                addFlag(square);
            });
        }

        // add numbers
        // For every non-bomb square, count bombs in all 8 neighboring positions
        for (let i = 0; i < squares.length; i++) {
            if (!squares[i].classList.contains('valid')) continue;

            let total = 0;
            const isLeftEdge = i % width === 0;
            const isRightEdge = i % width === width - 1;

            // Check all eight neighbors (left, right, up, down, and diagonals)
            if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) total++;
            if (i >= width && !isRightEdge && squares[i + 1 - width].classList.contains("bomb")) total++;
            if (i >= width && squares[i - width].classList.contains("bomb")) total++;
            if (i >= width && !isLeftEdge && squares[i - 1 - width].classList.contains("bomb")) total++;
            if (i < width * width - 1 && !isRightEdge && squares[i + 1].classList.contains("bomb")) total++;
            if (i < width * (width - 1) && !isLeftEdge && squares[i - 1 + width].classList.contains("bomb")) total++;
            if (i < width * (width - 1) - 1 && !isRightEdge && squares[i + 1 + width].classList.contains("bomb")) total++;
            if (i < width * (width - 1) && squares[i + width].classList.contains("bomb")) total++;

            squares[i].setAttribute("data", total);
        }
    }

    // Left-click reveals squares; kicks off timer on first move
    function click(square) {
        if (isGameOver) return;
        if (square.classList.contains("checked") || square.classList.contains("flag")) return;

        // start timer on first valid click
        startTimer();

        // Bomb clicked: end game immediately
        if (square.classList.contains("bomb")) {
            gameOver();
            return;
        }

        // If this square borders bombs, show the count and stop expanding
        const total = Number(square.getAttribute("data"));
        if (total !== 0) {
            square.classList.add("checked");
            square.textContent = total;
            checkForWin();
            return;
        }

        // Empty square: mark as revealed, flood-reveal neighbors, then re-check win state
        square.classList.add("checked");
        checkSquare(Number(square.getAttribute("id")));
        checkForWin();
    }

    // Reveal neighboring squares recursively when zero adjacent bombs
    function checkSquare(currentId) {
        const isLeftEdge = currentId % width === 0;
        const isRightEdge = currentId % width === width - 1;

        // Slight delay to avoid deep call stacks; recursively reveal all neighbors with edge guards
        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) click(squares[currentId - 1]);
            if (currentId > width - 1 && !isRightEdge) click(squares[currentId + 1 - width]);
            if (currentId >= width) click(squares[currentId - width]);
            if (currentId >= width && !isLeftEdge) click(squares[currentId - 1 - width]);
            if (currentId < width * width - 1 && !isRightEdge) click(squares[currentId + 1]);
            if (currentId < width * (width - 1) && !isLeftEdge) click(squares[currentId - 1 + width]);
            if (currentId < width * (width - 1) - 1 && !isRightEdge) click(squares[currentId + 1 + width]);
            if (currentId < width * (width - 1)) click(squares[currentId + width]);
        }, 10);
    }

    // Expose all bombs after a loss
    function revealBombs() {
        squares.forEach((sq) => {
            if (sq.classList.contains("bomb")) {
                sq.classList.add("checked");
                sq.textContent = "💣";
            }
        });
    }

    // check for win
    function checkForWin() {
        if (isGameOver) return;

        // Count all valid (non-bomb) squares that are checked
        const totalValid = squares.filter(sq => sq.classList.contains("valid")).length;
        const checkedValid = squares.filter(sq => sq.classList.contains("valid") && sq.classList.contains("checked")).length;

        // Win if all non-bomb squares are revealed
        if (checkedValid === totalValid) {
            isGameOver = true;
            stopTimer();
            alert("Congratulations! You win!");
        }
    }

    // Handle loss: stop timer, notify, and reveal bombs
    function gameOver() {
        isGameOver = true;
        stopTimer();
        alert("Game Over! You hit a bomb.");
        revealBombs();
    }

    // add flag with right click
    function addFlag(square) {
        if (isGameOver) return;
        if (!square.classList.contains("checked") && flags < bombsAmount) {
            if (!square.classList.contains("flag")) {
                square.classList.add("flag");
                square.innerHTML = "🚩";
                flags++;
                updateMinesCount();
            } else {
                square.classList.remove("flag");
                square.innerHTML = "";
                flags--;
                updateMinesCount();
            }
        }
    }

    // Reset button starts a fresh game state
    function resetGame() {
        stopTimer();
        resetTimer();
        createBoard();
    }

    resetButton?.addEventListener("click", resetGame);

    createBoard();
});
