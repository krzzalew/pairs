# Pairs Game
This is a source code for an online game available [here.](https://krzzalew.github.io/pairs/)\
\
Pairs is a popular memory game. This version features single-player and two-players modes. At each turn a player flips two cards chosen from the board.
If it's a match the cards are removed and the player scores one point and continues. Otherwise the turn ends and cards are flipped back.
The game continues until all the pairs are matched. Player with the the higher score wins.\
\
This game enables players to choose from 4 board sizes and 4 different card themes. When starting a new game a random set of picture pairs is generated.
There is also an additional option to toggle guessed cards' visibility. The accuracy of each player is calculated based on the ratio of their correct moves number to the number of all moves (a move is considered correct if either a card is flipped for the first time or a pair is matched).\
\
The game was designed to adjust well to various screen sizes.
- --
## Technologies
This web application was created using:
* React
* HTML
* CSS
* JavaScript
* Bootstrap
- --
## Installation and Setup Instructions

Clone down this repository. You will need `node` and `npm` installed globally on your machine.  

To Run Test Suite:  

`npm test`  

To Start Server:

`npm start`  

To Visit App:

Go to `http://localhost:3000/` in your browser.