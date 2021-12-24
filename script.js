// Project instructions:
// store the gameboard as an array inside of a Gameboard object
// Your players are also going to be stored in objects… and you’re probably going to want an object to control the flow of the game itself.
// Your main goal here is to have as little global code as possible. Try tucking everything away inside of a module or factory. 
// Rule of thumb: if you only ever need ONE of something (gameBoard, displayController), use a module. 
// If you need multiples of something (players!), create them with factories.

// Set up your HTML and write a JavaScript function that will render the contents of the gameboard array to the webpage 
// (for now you can just manually fill in the array with "X"s and "O"s)

// Build the functions that allow players to add marks to a specific spot on the board, 
// and then tie it to the DOM, letting players click on the gameboard to place their marker. 
// Don’t forget the logic that keeps players from playing in spots that are already taken!

// Think carefully about where each bit of logic should reside. 
// Each little piece of functionality should be able to fit in the game, player or gameboard objects.. 
// but take care to put them in “logical” places. Spending a little time brainstorming here can make your life much easier later!

// Build the logic that checks for when the game is over! Should check for 3-in-a-row and a tie.

// Clean up the interface to allow players to put in their names, include a button to start/restart the game 
// and add a display element that congratulates the winning player!

// Optional - If you’re feeling ambitious create an AI so that a player can play against the computer!
// Start by just getting the computer to make a random legal move.
// Once you’ve gotten that, work on making the computer smart. 
// It is possible to create an unbeatable AI using the minimax algorithm

const gameboard = (() => {
  //board represents the game board incl. its current state. It is a simple array with 3 elements that represent each row
  //those rows then have three squares each 
  const board = [["","X",""],["O","",""],["","","X"]];
  const div = document.getElementById("gameboard");
  const render = () => {
    let html = "";
    const renderRow = (value, index) => {
      html += `<div id="row-${index}" class="row">`;
      value.forEach(renderSquare);
      html += `</div>`;
    }
    const renderSquare = (value, index) => { 
      html += `<div id="sq-${index}" class="square">
        <span>${value}</span>
        </div>`
    };

    board.forEach(renderRow);
    div.innerHTML = html;
  }
  const markSquare = (row, col, marker) => {
    console.log(board[row][col])
    board[row][col] = marker;
    render();
  }
  const reset = () => {
    board.forEach((value, index, arr) => arr[index] = ["","",""])
    render();
  }
  const emptySquare = (row, col) => {
    if (board[row][col] == "") { return true }
    return false
  }
  //note decided to put this in gameboard rather than game since gameboard has better access to each square
  const checkVictory = () => {
    //check each row and col
    for (let i = 0; i < 3; i++) {
      if ( (board[i][0] != "" && board[i][1] == board[i][0] && board[i][2] == board[i][0])
        || (board[0][i] != "" && board[1][i] == board[0][i] && board[2][i] == board[0][i]) ) {
        //winner
        return true
      }
    }
    //check both diagonals
    if ( (board[0][0] != "" && board[1][1] == board[0][0] && board[2][2] == board[0][0])
      || (board[0][2] != "" && board[1][1] == board[0][2] && board[2][0] == board[0][2]) ) {
      //winner
        return true
    } 

    return false
  }

  return {board, render, markSquare, reset, emptySquare, checkVictory}

})();

const Game = (player1, player2) => {
  //const player1 = player1;
  //const player2 = player2;
  let currentPlayer = player1;
  
  const makeMove = (row, col) => {
    if (gameboard.emptySquare(row, col)) {
      let marker = (currentPlayer == player1 ? "X" : "O");
      gameboard.markSquare(row, col, marker);
      if (gameboard.checkVictory()) {
        console.log(`${currentPlayer.getName()} wins!`)
      }

    }
    else {
      console.log("illegal move")
    }

  }
  return {makeMove}
}

const Player = (name) => {
  let wins = 0;
  let loses = 0;
  let played = 0;
  const getName = (name) => {return name}
  
  return {getName}
}

let p1 = Player("p1");
let p2 = Player("p2");
let game = Game(p1, p2);
gameboard.render();