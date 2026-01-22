# Minesweeper

A classic browser-based **Minesweeper** game built with HTML, CSS, and JavaScript.

---

## Live Site

[Live link to deployed Minesweeper game](https://github.com/Saladin-B/minesweeper/deployments/github-pages) <!-- Replace with your actual deployed site URL if different -->

---

## Table of Contents

- [About](#about)
- [Game Purpose](#game-purpose)
- [Features](#features)
- [Gameplay](#gameplay)
- [Technologies](#technologies)
- [Usage](#usage)
- [Deployment](#deployment)
- [Bugs / Errors](#bugs--errors)
- [Attribution](#attribution)
- [AI Declaration](#ai-declaration)

---

## About

The **Minesweeper** project is a modern implementation of the classic logic puzzle game. The player must clear a grid of hidden tiles without detonating any mines, using numeric hints that show how many mines are adjacent to each revealed tile.

The game runs entirely in the browser and is designed to be responsive and intuitive for both desktop and mobile users.

---

## Game Purpose

The aim of the game is simple:

- Reveal all **non-mine** tiles on the board  
- Avoid clicking on any tiles that contain **mines**  
- Use the **numbers** on revealed tiles to deduce where the mines are located  
- Optionally **flag** tiles you suspect contain mines

This project demonstrates:

- DOM manipulation with JavaScript  
- Event handling for mouse clicks (and optionally touch events)  
- Basic game state management (win/lose conditions, timer, remaining mines, reset)

---

## Features

- ✅ Responsive layout for different screen sizes  
- ✅ Left-click to reveal tiles  
- ✅ Numeric hints showing the count of adjacent mines  
- ✅ Automatic reveal of empty (zero-adjacent-mine) regions  
- ✅ Game over state with all mines revealed  
- ✅ Win detection when all safe tiles are uncovered  
- ✅ Restart / reset button  
- ✅ Simple, clean UI with clear visual feedback  

*(Adjust this list to match your actual feature set.)*

---

## Gameplay

### Basic Rules

- The board is a grid of hidden tiles.
- Some tiles contain **mines**, others are **safe**.
- Clicking a safe tile reveals:
  - A **number** (1–8) indicating adjacent mines, or  
  - An **empty tile** if there are no adjacent mines (which may auto-reveal neighbors).
- Clicking a mine ends the game.
- Flag tiles you suspect have mines to avoid clicking them by mistake.

### Controls

- **Reveal tile**: Left-click on a tile  
- **Flag tile**: Right-click on a tile (or long-press, if implemented)  
- **Restart game**: Click the reset / new game button

*(Update controls based on your implementation.)*

---

## Technologies

This project is built using:

- **HTML5** – Structure of the game board and UI  
- **CSS3** – Layout, colours, and responsive styling  
- **JavaScript (ES6+)** – Game logic, board generation, interactions, and state handling

Language composition (approx.):

- JavaScript – **48.5%**  
- CSS – **40.8%**  
- HTML – **10.7%**

---

## Usage

1. **Open the game** in your browser via the live link or `index.html`.
2. **Start playing** by clicking any tile to reveal it.
3. **Mark suspected mines** with flags to keep track of danger spots.
4. **Clear the board** by revealing all safe tiles.
5. **Restart** as many times as you like using the reset button.

---

## Validation

![html validator](https://github.com/user-attachments/assets/ef13df5b-c8ee-4fae-82d6-38dcfe7f3dee)
![css validator](https://github.com/user-attachments/assets/c7b5b641-8852-4621-bf1a-87a9b5532e75)
![javascript validator](https://github.com/user-attachments/assets/aab16b40-bf4b-4a57-99e2-f3d67da9af49)


---

## Bugs / Errors

Known / example items (update to reflect your project):

- [ ] Edge cases with very small screens (some elements may overlap)  
- [ ] Long-press flagging on some mobile browsers can be inconsistent  
- [ ] Rapid clicking may occasionally cause visual glitches before re-render  

Please report any bugs via the **GitHub Issues** section in this repository.

---

## Attribution

- **Concept**: Classic Microsoft Minesweeper game  
- **Icons / Graphics**:
- custom SVGs:
  fonts.google.com/icons

- (Update this section with any assets, tutorials, or libraries you actually used.)*

---

## AI Declaration

This project may contain code and/or written content assisted by **GitHub Copilot** and other AI tools.

A few bugs and edge cases in this project were debugged with the help of AI tools (e.g., GitHub Copilot / ChatGPT). These tools assisted in:
- Inspecting and reasoning about game logic
- Suggesting fixes for edge cases
- Improving code readability in some functions
- when clicking on square it floods to neighbouring squares
---

**Owner:** [Saladin-B](https://github.com/Saladin-B)  
**Repository:** [minesweeper](https://github.com/Saladin-B/minesweeper)





