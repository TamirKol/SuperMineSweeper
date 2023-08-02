'use strict'

const MINE = '💣'
const MARK = '🚩'
var gBoard

var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gIntervalHint
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    numOfLives: 3,
    numOfHints:3,
    isHintOn:false
}

//onInit() - inital game states
function onInit() {
    document.querySelector('.newGame').innerHTML='🙂'
    gLevel.SIZE = checkBoardSizeMode()
    gLevel.MINES = checkMinesAmount(gLevel.SIZE)
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.numOfLives = 3
    gGame.numOfHints = 3
    renderLives()
    gBoard = buildBoard()
    renderBoard(gBoard)
}

//buildBoard() - Builds the board Set the mines ,Call setMinesNegsCount() Return the created board

function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            //var mineIdx=getRandomInt(0)-to do random mineidx
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }

        }

    }
    //random mines locations
    // var counter=0 
    // while(counter!==gLevel.MINES){
    //     var idx1 = getRandomInt(0, board.length)
    //     var idx2 = getRandomInt(0, board.length)
    //     if(board[idx1][idx2].isMine === false){
    //         board[idx1][idx2].isMine=true
    //         counter++
    //     }
    // } 


    

    console.table(board)
    return board
}

//Count mines around each cell and set the cell's minesAroundCount
function setMinesNegsCount(board, rowIdx, colIdx) {
    //TO DO
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) {
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
            cell.minesAroundCount = setMinesNegsCount(board, i, j)
            const className = `cell cell-${i}-${j}`
            strHTML += `<td onclick="onCellClicked(this,${i},${j})" class="${className}">${(cell.isShown)?cell.minesAroundCount:''}</td>`
            // ${(cell.isMine) ? MINE : cell.minesAroundCount}
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

//onCellClicked(elCell, i, j) Called when a cell is clicked
function onCellClicked(elCell, i, j) {
    if(gGame.isHintOn){
        revealNegs(i,j)
    }
    if(!gBoard[i][j].isShown) {
        gGame.shownCount++
        gBoard[i][j].isShown=true
    }

    if(gGame.shownCount===1){
        addMines(gBoard,i,j)
        renderBoard(gBoard) 
    }
    console.log(elCell)
    gBoard[i][j].isShown = true
    console.log(gGame.shownCount)
    if (!gBoard[i][j].isMine) {
        elCell.innerHTML = gBoard[i][j].minesAroundCount
        checkGameOver()
        //if(gBoard[i][j].minesAroundCount===0)expandShown(gBoard,elCell,i,j)
    } else {
        elCell.innerHTML = MINE
        gGame.numOfLives--
        renderLives()
        checkGameOver()
    }

}

//onCellMarked(elCell) Called when a cell is right clicked See how you can hide the context
function onCellMarked(elCell) {

}

//checkGameOver() Game ends when all mines are marked, and all the other cells are shown
function checkGameOver() {
    console.log('in checkGame')
    if (gGame.numOfLives === 0) {
        alert('you loose!')
        gGame.isOn=false
        document.querySelector('.newGame').innerHTML='🤯'
    }
    else if (gGame.shownCount === Math.pow(gLevel.SIZE, 2) - (gLevel.MINES)) {
        alert('Victory!')
        gGame.isOn=false
        document.querySelector('.newGame').innerHTML='😎'
    }
}

//expandShown(board, elCell, i, j)  When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors.
//check note and bonus
function expandShown(board, elCell, i, j) {
    console.log(elCell)
    for (var x = i - 1; x <= i + 1; x++) {
        if (x < 0 || x > board.length) continue
        for (var y = j - 1; y <= j + 1; y++) {
            var currCell = board[x][y]
            console.log(currCell)
        }
    }

}
//start new game from smiley button
function newGame() {
    onInit()
}
//get the game mode the user have chosen
function checkBoardSizeMode() {
    var gameMod = document.getElementsByName('gameMode')
    var size
    for (var i = 0; i < gameMod.length; i++) {
        if (gameMod[i].checked) {
            console.log('mod: ' + gameMod[i].value)
            size =+ gameMod[i].value
        }
    }
    return size

}
function checkMinesAmount(size) {
    if (size === 4) return 2
    else if (size === 8) return 14
    else if (size === 12) return 32
}

function addMines(board,rowIdx,colIdx){
    var counter=0 
    while(counter!==gLevel.MINES){
        var idx1 = getRandomInt(0, board.length)
        var idx2 = getRandomInt(0, board.length)
        if(board[idx1][idx2].isMine === false && idx1!==rowIdx &&idx2!==colIdx){
            board[idx1][idx2].isMine=true
            counter++
        }
    } 
}

function renderLives(){
    if(gGame.isOn){
        var elLive= document.querySelector('.lives')
        var str='lives: '
        for(var i=0;i<gGame.numOfLives;i++){
            str+=`<span>❤️</span>`
        }
        elLive.innerHTML=str
    }
    else return

}

function useHint(){
gGame.isHintOn=true
}

function revealNegs(rowIdx,colIdx){
    console.log('in revNegs')
    var negsBoard=[]
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            var currCell = gBoard[i][j]
            currCell.isShown=true
            negsBoard.push(currCell)
        }
    }
    console.log(negsBoard);
     renderBoard(gBoard)
    gGame.isHintOn=false
    gIntervalHint= setTimeout(closeNegs,1000)

}

function closeNegs(negsBoard,rowIdx,rowCol){
   //close hint TO DO

}