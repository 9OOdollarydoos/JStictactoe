// Project instructions:
// https://www.theodinproject.com/paths/full-stack-ruby-on-rails/courses/javascript/lessons/tic-tac-toe-javascript

// todo:
// Clean up the interface to allow players to put in their names, include a button to start/restart the game 
// and add a display element that congratulates the winning player!

// player 1 shouldnt always go first

// Optional - If you’re feeling ambitious create an AI so that a player can play against the computer!
// Start by just getting the computer to make a random legal move.
// Once you’ve gotten that, work on making the computer smart. 
// It is possible to create an unbeatable AI using the minimax algorithm

const gameboard = (() => {
  //board represents the game board incl. its current state. It is a simple array with 3 elements that represent each row
  //those rows then have three squares each 
  const board = [["","",""],["","",""],["","",""]];
  const div = document.getElementById("gameboard");
  const render = () => {
    let html = "";
    const renderRow = (value, index) => {
      const renderSquare = (value, index) => { 
        html += `<div id="sq-${index}" class="square" onclick="displayController.currentGame.playRound(${currentRow},${index})">
          <span>${value}</span>
          </div>`
      };
      
      let currentRow = index; //make available to renderSquare function
      html += `<div id="row-${index}" class="row">`;
      value.forEach(renderSquare);
      html += `</div>`;
    }
    
    board.forEach(renderRow);
    div.innerHTML = html;
  }
  const markSquare = (row, col, marker) => {
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

  const checkDraw = () => {
    for (let i = 0; i < 3; i++) {
      for (let n = 0; n < 3; n++) {
        if (board[i][n] == "") {return false} //i.e. if any spaces left, not a draw
      }
    }
    return true;
  }

  return {board, render, markSquare, reset, emptySquare, checkVictory, checkDraw}

})();

const Game = (player1, player2) => {
  //const player1 = player1;
  //const player2 = player2;
  let currentPlayer = player1;
  let nextPlayer = player2;
  let gameOver = false;
  
  const reset = () => {
    gameOver = false;
    currentPlayer = player1;
    nextPlayer = player2;
  }

  const playRound = (row, col) => {
    if (gameOver) {
      displayController.message("game over already!")
    }
    else if (gameboard.emptySquare(row, col)) {
      let marker = (currentPlayer == player1 ? "X" : "O");
      gameboard.markSquare(row, col, marker);
      if (gameboard.checkVictory()) {
        endGame();
      }
      else if (gameboard.checkDraw()) {
        endGame(true);
      }
      else {
        //update play
        let tempCurrentPlayer = nextPlayer;
        nextPlayer = currentPlayer;
        currentPlayer = tempCurrentPlayer;
        displayController.message(`${currentPlayer.getName()}'s turn`)
      }

    }
    else {
      displayController.message(`illegal move! ${currentPlayer.getName()}'s turn`)
    }

  }
  const endGame = (draw = false) => {
    if (draw) {
      displayController.message(`Its a tie!`);
      gameOver = true;
      currentPlayer.played ++;
      nextPlayer.played ++;
    }
    else {
      displayController.message(`${currentPlayer.getName()} wins!`);
      gameOver = true;
      currentPlayer.wins ++;
      currentPlayer.played ++;
      nextPlayer.loses ++;
      nextPlayer.played ++;
    }
    displayController.updatePlayers();
  }

  return {playRound, reset}
}

const Player = (name) => {
  let wins = 0;
  let loses = 0;
  let played = 0;
  const getName = () => {return name}
  const updateName = (str) => {
    if(str != "") {name = str}
    displayController.updatePlayers();
  }
  
  return {getName, updateName, wins, loses, played}
}

const displayController = (() => {
  let p1 = Player("Player 1");
  let p2 = Player("Player 2");
  let currentGame = Game(p1, p2);
  let messageElement = document.querySelector("#messages");
  
  
  const setup = () => {
    let btn = document.getElementById("p1-name-btn");
    btn.addEventListener("click", function(){ p1.updateName(document.getElementById("p1-name-new").value) });
    btn = document.getElementById("p2-name-btn");
    btn.addEventListener("click", function(){ p2.updateName(document.getElementById("p2-name-new").value) });
    btn = document.getElementById("new-game-btn");
    btn.addEventListener("click", newGame);
    gameboard.render();
    updatePlayers();
  }

  const newGame = () => {
    //currentGame = Game(p1, p2); for some reason this doesnt work - made a reset game method instead.
    currentGame.reset();
    gameboard.reset();
    gameboard.render();
    updatePlayers();
    message(`${p1.getName()}'s turn`)
  }

  const message = (text) => {
    messageElement.innerHTML = text
  }

  const updatePlayers = () => {
    document.querySelector("#p1-name").innerHTML = p1.getName();
    document.querySelector("#p1-wins").innerHTML = `Wins: ${p1.wins}`;
    document.querySelector("#p1-loses").innerHTML = `Loses: ${p1.loses}`;
    document.querySelector("#p1-played").innerHTML = `Played: ${p1.played}`;
    document.querySelector("#p2-name").innerHTML = p2.getName();
    document.querySelector("#p2-wins").innerHTML = `Wins: ${p2.wins}`;
    document.querySelector("#p2-loses").innerHTML = `Loses: ${p2.loses}`;
    document.querySelector("#p2-played").innerHTML = `Played ${p2.played}`;  
  }

  setup();
  return {currentGame, newGame, message, updatePlayers}

})();
