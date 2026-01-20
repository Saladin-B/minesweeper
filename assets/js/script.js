document.addEventListener("DOMContentLoaded", () => {
    // Get reference to the grid container element
    const grid = document.querySelector(".grid");
    // Width of the board (10x10 grid)
    const width = 10;
    // Total number of bombs on the board
    let bombsAmount = 20;
    // Array to store all square elements
    let squares = [];
    // Flag to track if the game is over
    let isGameOver = false;
    // Number of flags currently placed
    let flags = 0;

    // Theme switch button (for dark/light mode)
    const themeSwitch = document.getElementById("theme-switch");
    // Reset button to restart the game
    const resetButton = document.getElementById("reset-button");
    // Timer display element
    const timerDisplay = document.getElementById("timer");
    // Mines count display element
    const minesCountDisplay = document.getElementById("mines-count");

    // Interval ID for the timer (used for clearInterval)
    let timerInterval = null;
    // Timestamp when the timer started
    let timerStart = null;
    // Boolean to indicate if the timer is running
    let timerRunning = false;

    // Update the remaining mines count shown to the user
    const updateMinesCount = () => {
        if (minesCountDisplay) {
            // Remaining mines = total bombs - flags placed
            minesCountDisplay.textContent = `Mines: ${bombsAmount - flags}`;
        }
    };

    // Reset the timer back to 0 and stop it
    const resetTimer = () => {
        clearInterval(timerInterval);  // Stop any running interval
        timerInterval = null;
        timerStart = null;
        timerRunning = false;
        // Reset the timer text display
        if (timerDisplay) timerDisplay.textContent = "Time: 0s";
    };

    // Called every second to update the timer display
    const updateTimer = () => {
        // If there's no display or start time, do nothing
        if (!timerDisplay || !timerStart) return;
        // Calculate elapsed seconds since timerStart
        const seconds = Math.floor((Date.now() - timerStart) / 1000);
        // Show elapsed time
        timerDisplay.textContent = `Time: ${seconds}s`;
    };

    // Start the timer if it's not already running
    const startTimer = () => {
        if (timerRunning) return; // Prevent multiple intervals
        timerStart = Date.now();  // Record start time
        timerRunning = true;
        // Update the timer every second
        timerInterval = setInterval(updateTimer, 1000);
    };

    // Stop the timer without resetting the display
    const stopTimer = () => {
        clearInterval(timerInterval);
        timerInterval = null;
        timerRunning = false;
    };

    // Get saved theme from localStorage (default to "light")
    const savedTheme = localStorage.getItem("theme") || "light";
    // Apply dark mode class if saved theme is dark
    if (savedTheme === "dark") document.body.classList.add("darkmode");

    // Toggle theme between light and dark when themeSwitch is clicked
    themeSwitch?.addEventListener("click", () => {
        // Toggle dark mode class on body
        document.body.classList.toggle("darkmode");
        // Save current theme to localStorage
        const currentTheme = document.body.classList.contains("darkmode") ? "dark" : "light";
        localStorage.setItem("theme", currentTheme);
    });

    // Create or recreate the game board
    function createBoard() {
        // Clear old board from the DOM
        grid.innerHTML = "";
        // Reset squares array
        squares = [];
        // Reset placed flags count
        flags = 0;
        // Reset game-over state
        isGameOver = false;
        // Reset and stop timer
        resetTimer();
        // Update mines count display
        updateMinesCount();

        // Create an array filled with "bomb" for the number of bombs
        const bombsArray = Array(bombsAmount).fill("bomb");
        // Array filled with "valid" for non-bomb squares
        const emptyArray = Array(width * width - bombsAmount).fill("valid");
        // Combine valid and bomb squares
        const gameArray = emptyArray.concat(bombsArray);
        // Shuffle the combined array randomly
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

        // Generate each square and add to the grid
        for (let i = 0; i < width * width; i++) {
            // Create a div for the square
            const square = document.createElement("div");
            // Assign ID equal to its index
            square.setAttribute("id", i);
            // Add class "valid" or "bomb" from shuffledArray
            square.classList.add(shuffledArray[i]);
            // Add the square to the grid container
            grid.appendChild(square);
            // Store the square in the squares array
            squares.push(square);

            // Add left-click event: reveal square
            square.addEventListener("click", () => click(square));
            // Add right-click event: place/remove flag
            square.addEventListener("contextmenu", (e) => {
                e.preventDefault();   // Prevent default context menu
                addFlag(square);      // Toggle flag
            });
        }

        // Add numbers indicating neighboring bombs for all valid squares
        for (let i = 0; i < squares.length; i++) {
            // Only add number for "valid" (non-bomb) squares
            if (!squares[i].classList.contains('valid')) continue;

            let total = 0; // Count of neighboring bombs
            const isLeftEdge = i % width === 0;           // True if at left edge
            const isRightEdge = i % width === width - 1;  // True if at right edge

            // Check each of the 8 neighboring positions (if in bounds),
            // and increment total if that neighbor is a bomb.
            if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) total++;                               // Left
            if (i >= width && !isRightEdge && squares[i + 1 - width].classList.contains("bomb")) total++;                 // Top-right
            if (i >= width && squares[i - width].classList.contains("bomb")) total++;                                     // Top
            if (i >= width && !isLeftEdge && squares[i - 1 - width].classList.contains("bomb")) total++;                  // Top-left
            if (i < width * width - 1 && !isRightEdge && squares[i + 1].classList.contains("bomb")) total++;              // Right
            if (i < width * (width - 1) && !isLeftEdge && squares[i - 1 + width].classList.contains("bomb")) total++;     // Bottom-left
            if (i < width * (width - 1) - 1 && !isRightEdge && squares[i + 1 + width].classList.contains("bomb")) total++;// Bottom-right
            if (i < width * (width - 1) && squares[i + width].classList.contains("bomb")) total++;                        // Bottom

            // Store the number of neighboring bombs as a data attribute
            squares[i].setAttribute("data", total);
        }
    }

    // Handle left-click on a square
    function click(square) {
        // If game is over, ignore clicks
        if (isGameOver) return;
        // If square is already checked or flagged, ignore
        if (square.classList.contains("checked") || square.classList.contains("flag")) return;

        // Start timer on the first valid click
        startTimer();

        // If the clicked square is a bomb, end the game
        if (square.classList.contains("bomb")) {
            gameOver();
            return;
        }

        // Get the number of surrounding bombs from data attribute
        const total = Number(square.getAttribute("data"));
        if (total !== 0) {
            // If there are neighboring bombs, show the number and mark as checked
            square.classList.add("checked");
            square.textContent = total;
            // After revealing, check if this causes a win
            checkForWin();
            return;
        }

        // If there are no neighboring bombs, check the square and reveal neighbors
        square.classList.add("checked");
        // Recursively open surrounding squares
        checkSquare(Number(square.getAttribute("id")));
        // Check if player has now won
        checkForWin();
    }

    // Reveal neighboring squares for an empty square (0 neighboring bombs)
    function checkSquare(currentId) {
        const isLeftEdge = currentId % width === 0;          // At left edge?
        const isRightEdge = currentId % width === width - 1; // At right edge?

        // Use a small timeout to avoid call stack overflow for large recursion
        setTimeout(() => {
            // Check each neighboring position and trigger a click on it if valid.
            if (currentId > 0 && !isLeftEdge) click(squares[currentId - 1]);                               // Left
            if (currentId > width - 1 && !isRightEdge) click(squares[currentId + 1 - width]);              // Top-right
            if (currentId >= width) click(squares[currentId - width]);                                     // Top
            if (currentId >= width && !isLeftEdge) click(squares[currentId - 1 - width]);                  // Top-left
            if (currentId < width * width - 1 && !isRightEdge) click(squares[currentId + 1]);              // Right
            if (currentId < width * (width - 1) && !isLeftEdge) click(squares[currentId - 1 + width]);     // Bottom-left
            if (currentId < width * (width - 1) - 1 && !isRightEdge) click(squares[currentId + 1 + width]);// Bottom-right
            if (current*

