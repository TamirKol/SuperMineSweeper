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
    numOfHints: 3,
    isHintOn: false
}

//onInit() - inital game states
function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    document.querySelector('.newGame').innerHTML = '🙂'
    document.querySelector('.minesLeft')
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.numOfLives = 3
    gGame.numOfHints = 3
    renderLives()
    document.querySelector('.minesLeft').innerHTML = gLevel.MINES

    // var Emptyboard

}

//buildBoard() - Builds the board Set the mines ,Call setMinesNegsCount() Return the created board

function buildBoard() {
    var board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }

        }

    }

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
            var className = `cell`
            strHTML += `<td data="${i}+${j}" oncontextmenu="onCellMarked(event,this,${i},${j})" onclick="onCellClicked(this,${i},${j})" class="${className}">${(cell.isShown) ? cell.minesAroundCount : ''}</td>`
            // see cell content ${(cell.isMine) ? MINE : cell.minesAroundCount}
            // regular game option ${(cell.isShown)?cell.minesAroundCount:''}
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

//onCellClicked(elCell, i, j) Called when a cell is clicked
function onCellClicked(elCell, i, j) {
    //hints
    if (gGame.isHintOn) {
        revealNegs(i, j)
    }
    //check if cell have been shown yet
    if (!gBoard[i][j].isShown) {
        gGame.shownCount++
        gBoard[i][j].isShown = true
    }
    //check first cell & adding mines
    if (gGame.shownCount === 1) {
        addMines(gBoard, i, j)
        renderBoard(gBoard)
    }
    console.log('cell data: ', elCell.dataset)
    gBoard[i][j].isShown = true
    gBoard[i][j].shownCount ++
    if (!gBoard[i][j].isMine) {
        elCell.innerHTML = gBoard[i][j].minesAroundCount
        expandShown(gBoard,elCell,i,j)
        checkGameOver()
    }
    
    else {
        elCell.innerHTML = MINE
        gGame.numOfLives--
        gGame.shownCount--
        renderLives()
        checkGameOver()
    }

}

function onCellMarked(event, elCell, i, j) {
    event.preventDefault();
    console.log(event, elCell, i, j)
    if (gGame.shownCount < 1) {
        alert('first move is never a Mine ;)')
        return
    }

    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false
        elCell.innerHTML = ''
        gGame.markedCount--
        return
    } else {
        gBoard[i][j].isMarked = true
        elCell.innerHTML = MARK
        gGame.markedCount++
        if (gGame.markedCount == gLevel.MINES || gGame.markedCount > 0) checkGameOver()
    }

}

//checkGameOver() Game ends when all mines are marked, and all the other cells are shown
function checkGameOver() {
    var lvlSize= Math.pow(gLevel.SIZE,2)
    var lifeDiff=0
    console.log(('mark: '+gGame.markedCount))
    console.log('count:'+gGame.shownCount);
    console.log('in checkGame')
    if (gGame.numOfLives === 0) {
        alert('you loose!')
        gGame.isOn = false
        document.querySelector('.newGame').innerHTML = '🤯'
    }
    else {
        switch (gGame.numOfLives) {
            case 3:
                if ((lvlSize - gGame.shownCount - gGame.markedCount) === lifeDiff&& gGame.markedCount===(lvlSize-gGame.shownCount-lifeDiff)) {
                    victory()
                    break;
                }

            case 2:
                lifeDiff=1
                if ((Math.pow(gLevel.SIZE, 2) - gGame.shownCount - gGame.markedCount) === lifeDiff && gGame.markedCount===(lvlSize-gGame.shownCount-lifeDiff)) {
                    victory()
                    break;
                }
            case 1: lifeDiff=2
            if((Math.pow(gLevel.SIZE, 2) - gGame.shownCount - gGame.markedCount) === lifeDiff && (gGame.markedCount===lvlSize-gGame.shownCount-lifeDiff))
            victory()
            break;
        }
        // if((lvlSize-gGame.shownCount-gGame.markedCount)===lifeDiff) victory()
        // (gGame.shownCount === Math.pow(gLevel.SIZE, 2) - (gLevel.MINES) && (gGame.markedCount === gLevel.MINES) || (gGame.markedCount >= 1) && (gGame.markedCount <= gLevel.MINES)){

        
    }
}

//expandShown(board, elCell, i, j)  When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors.
//check note and bonus
function expandShown(board,elCell,i,j) {
    var expandCount=0
    for (var x = i - 1; x <= i + 1; x++) {
        if (x < 0 || x > board.length) continue
        for (var y = j - 1; y <= j + 1; y++) {
            if (y < 0 || y > board[0].length) continue
            if(x===i && y===j)continue
            var currCell = board[x][y]

            // if (currCell.isMine)continue
            if(currCell.isShown)continue
            if(currCell.minesAroundCount<1) {
                gGame.isShown=true
                elCell= document.querySelector('[data="'+x+'+'+y+'"]')
                elCell.innerHTML=currCell.minesAroundCount
                expandCount++
            }
            
        }
    }
    console.log('EXPAND:'+expandCount)
    // gGame.shownCount+=expandCount
    
}
//start new game from smiley button
function newGame() {
    gLevel.SIZE=checkBoardSizeMode()
    gLevel.MINES=checkMinesAmount(gLevel.SIZE)
    onInit()
}
//get the game mode the user have chosen
function checkBoardSizeMode() {
    var gameMod = document.getElementsByName('gameMode')
    var size=gLevel.SIZE
    for (var i = 0; i < gameMod.length; i++) {
        if (gameMod[i].checked) {
            console.log('mod: ' + gameMod[i].value)
            size = + gameMod[i].value
        }
        
    }
    return size

}
function checkMinesAmount(size) {
    if (size === 4) return 2
    else if (size === 8) return 14
    else if (size === 12) return 32
    renderBoard(gBoard)
}

function addMines(board, rowIdx, colIdx) {
    var counter = 0
    while (counter !== gLevel.MINES) {
        var idx1 = getRandomInt(0, board.length)
        var idx2 = getRandomInt(0, board.length)
        if (board[idx1][idx2].isMine === false && idx1 !== rowIdx && idx2 !== colIdx) {
            board[idx1][idx2].isMine = true
            counter++
        }
    }
}

function renderLives() {
    if (gGame.isOn) {
        var elLive = document.querySelector('.lives')
        var str = 'lives: '
        for (var i = 0; i < gGame.numOfLives; i++) {
            str += `<span>❤️</span>`
        }
        elLive.innerHTML = str
    }
    else return

}

function useHint() {
    gGame.isHintOn = true
}

function revealNegs(rowIdx, colIdx) {
    console.log('in revNegs')
    var negsBoard = []
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            var currCell = gBoard[i][j]
            currCell.isShown = true
            negsBoard.push(currCell)
        }
    }
    console.log(negsBoard);
    renderBoard(gBoard)
    gGame.isHintOn = false
    gIntervalHint = setTimeout(closeNegs, 1000)

}

function closeNegs(negsBoard, rowIdx, rowCol) {
    //close hint TO DO

}
function victory() {
    alert('Victory!')
    gGame.isOn = false
    document.querySelector('.newGame').innerHTML = '😎'
}