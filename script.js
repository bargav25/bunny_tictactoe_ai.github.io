var origBoard; 
const humanPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [  
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]; 

const cells = document.querySelectorAll('.cell');

var co=1;

startGame(); 


function startGame() {  
    co=1;
    
    document.querySelector(".endgame").style.display = "none"
    
 origBoard = [0,1,2,3,4,5,6,7,8]; 
 for (var i=0; i<cells.length; i++) {
  cells[i].innerText = '';     
  cells[i].style.removeProperty('background-color'); 
  cells[i].addEventListener('click', turnClick); 
    }
} 


function turnClick (square) {
    
    if (typeof origBoard[square.target.id] === 'number') { 
    
    if(document.getElementById('multi').checked) {
          
        co++;
        
       if(!checkTie()&&co%2==0) turn(square.target.id,humanPlayer);
       if (!checkWin(origBoard,humanPlayer)&&!checkTie()&&co%2!=0) 
        turn(square.target.id,aiPlayer);
        
    }
    else{
            
            turn(square.target.id, humanPlayer) 
            if (!checkWin(origBoard,humanPlayer)&&!checkTie()) turn(bestSpot(), aiPlayer); 
    
        }
    }
    
} 



function turn(squareId, player) {
  origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player; 
 let gameWon = checkWin(origBoard, player)
 if (gameWon) gameOver(gameWon) 
    
    
} 



function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => 
  (e === player) ? a.concat(i) : a, []); //finding every index that the player has played
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) { 
    if (win.every(elem => plays.indexOf(elem) > -1)) { //has the player played in every spot that counts as a win for that win
      gameWon = {index: index, player: player};  //which win combo the player won at & which player had won
      break;
    } 
} 
return gameWon;
} 


//defining gameOver function
function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) { //going through every index of the WinCombos
    document.getElementById(index).style.backgroundColor = 
    gameWon.player === humanPlayer ? "#4da6ff" : "#ff0000"; //if the human won-set background color to blue, if AI won-set background color to red
}
  for (var i= 0; i < cells.length; i++ ) { //making sure we cannot click on the cells anymore
    cells[i].removeEventListener('click', turnClick, false);
}
  if(!document.getElementById('multi').checked) declareWinner(gameWon.player === humanPlayer ? "You win!" : "You lose."); 
    
    else declareWinner(gameWon.player === humanPlayer ? "player 'O' win!" : "player 'X' win.");
    
    
} 


//defining declareWinner function
function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
    
    
}


function emptySquares() {
    return origBoard.filter(s => typeof s === 'number'); //filter every element in the origBoard to see if the type of element equals number. If yes, we are gonna return it (all the squares that are numbers are empty, the squares with X and O are not empty)
}


function bestSpot() {
    
    
   
	if(document.getElementById('hard').checked) return minimax(origBoard, aiPlayer).index;
    else if(document.getElementById('easy').checked) return emptySquares()[0];
    else {
        
        var available = emptySquares();
        
        for(var i=0;i<available.length;i++)
            {
                
                var temp=origBoard[available[i]];
                
                origBoard[available[i]]=aiPlayer;
                
                if(checkWin(origBoard, aiPlayer)) {
                    
                    origBoard[available[i]]=temp;
                    
                    return available[i];
                }
                
                origBoard[available[i]]=temp;
                
                
            }
        
        return available[1];
         }
    
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}
function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, humanPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}