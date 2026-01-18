document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const width = 10;
    let bombsAmount = 20;
    let squares = [];

    // Create Board
    function createBoard() {
        const bombsArray = Array(bombsAmount).fill('bomb');
        const emptyArray = Array(width * width - bombsAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(shuffledArray[i])
            grid.appendChild(square);
            squares.push(square);
        }
    }

    createBoard();
});