'use strict'

const MINE = '💣'

var gBoard 

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    numOfLives: 2
}

//onInit() - inital game states
function onInit() {
    gGame.isOn=true
    gGame.shownCount=0
    gGame.markedCount=0
    gGame.numOfLives=2
    
    gBoard = buildBoard()
    renderBoard(gBoard)
}

//buildBoard() - Builds the board Set the mines ,Call setMinesNegsCount() Return the created board

function buildBoard() {
    var board = []
    var mines = gLevel.MINES
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            //var mineIdx=getRandomInt(0)-to do random mineidx
            board[i][j] = {
                    minesAroundCount: 4,
                     isShown: false,
                     isMine: false,
                     isMarked: false
            }

        }

    }
    while(mines!==0){
        board[getRandomInt(0,board.length)][getRandomInt(0,board.length)].isMine=true
        mines--
    }
    console.table(board)
    return board
}

//Count mines around each cell and set the cell's minesAroundCount
function setMinesNegsCount(board,rowIdx,colIdx) {
    //TO DO
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine ) {
                count++
            }
        }
    }
    return count
}

//renderBoard(board) Render the board as a <table> to the page
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            var cell = board[i][j]
            cell.minesAroundCount=setMinesNegsCount(board,i,j)
            const className = `cell cell-${i}-${j}`
            strHTML += `<td onclick="onCellClicked(this,${i},${j})" class="${className}"></td>`
            // ${(cell.contet===MINE)?cell.contet:cell.minesNegs}
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

//onCellClicked(elCell, i, j) Called when a cell is clicked
function onCellClicked(elCell, i, j) {
console.log(elCell)
gBoard[i][j].isShown=true
gGame.shownCount++
console.log(gGame.shownCount)
if(!gBoard[i][j].isMine){
    elCell.innerHTML=gBoard[i][j].minesAroundCount
    checkGameOver()
   //if(gBoard[i][j].minesAroundCount===0)expandShown(gBoard,elCell,i,j)
}else{
    elCell.innerHTML=MINE
    gGame.numOfLives--
    checkGameOver()
}

}

//onCellMarked(elCell) Called when a cell is right clicked See how you can hide the context
function onCellMarked(elCell) {

}

//checkGameOver() Game ends when all mines are marked, and all the other cells are shown
function checkGameOver() {
    console.log('in checkGame')
if(gGame.numOfLives===0){
    alert('you loose!')
    onInit()
}
else if(gGame.shownCount===Math.pow(gLevel.SIZE,2)-(gLevel.MINES)){
    alert('Victory!')
}
}

//expandShown(board, elCell, i, j)  When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors.
//check note and bonus
function expandShown(board, elCell, i, j) {
    console.log(elCell)
    for(var x= i-1;x<=i+1;x++){
        if(x<0||x>board.length)continue
        for(var y=j-1;y<=j+1;y++){
            var currCell=board[x][y]
            console.log(currCell)
        }
    }
 
}
function newGame(){
    onInit()
}

