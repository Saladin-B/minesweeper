document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const width = 10;
    let bombsAmount = 20;
    let squares = [];
    let isGameOver = false;

    const themeSwitch = document.getElementById('theme-switch');

    // apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') document.body.classList.add('darkmode');

    // toggle theme
    themeSwitch?.addEventListener('click', () => {
        document.body.classList.toggle('darkmode');
        const currentTheme = document.body.classList.contains('darkmode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });

    function createBoard() {
        const bombsArray = Array(bombsAmount).fill('bomb');
        const emptyArray = Array(width * width - bombsAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);

            square.addEventListener('click', () => click(square));
        }

        // add numbers
        for (let i = 0; i < squares.length; i++) {
            if (!squares[i].classList.contains('valid')) continue;

            let total = 0;
            const isLeftEdge = i % width === 0;
            const isRightEdge = i % width === width - 1;

            if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
            if (i >= width && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
            if (i >= width && squares[i - width].classList.contains('bomb')) total++;
            if (i >= width && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
            if (i < width * width - 1 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++;
            if (i < width * (width - 1) && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
            if (i < width * (width - 1) - 1 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
            if (i < width * (width - 1) && squares[i + width].classList.contains('bomb')) total++;

            squares[i].setAttribute('data', total);
        }
    }

    function click(square) {
        const currentId = Number(square.id);
        if (isGameOver) return;
        if (square.classList.contains('checked') || square.classList.contains('flag')) return;

        if (square.classList.contains('bomb')) {
            isGameOver = true;
            console.log('Game Over');
            revealBombs();
            return;
        }

        const total = Number(square.getAttribute('data'));
        if (total !== 0) {
            square.classList.add('checked');
            square.textContent = total;
            return;
        }

        square.classList.add('checked');
        checkSquare(currentId);
    }

    function checkSquare(currentId) {
        const isLeftEdge = currentId % width === 0;
        const isRightEdge = currentId % width === width - 1;

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

    function revealBombs() {
        squares.forEach(sq => {
            if (sq.classList.contains('bomb')) sq.classList.add('checked');
        });
    }

    createBoard();
});