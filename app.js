var difficulty = document.querySelectorAll('.diff-btn');
var minesLeft = document.querySelector('#mines-remaining')
var intro = document.querySelector('#intro');
var game = document.querySelector('#minesweeper');
var message = document.querySelector('#message');
var timeDisplay = document.querySelector('#timer');
var custom = document.querySelector('#custom');
var customFields = document.querySelector('#custom-properties');
var customH = customFields.querySelector('#custom-height');
var customW = customFields.querySelector('#custom-width');
var customM = customFields.querySelector('#custom-num-mines');

var mines;
var minesweepButtons;

var timer;
var secondsPassed = 0;
var minesRemaining = 0;

var height, width, numMines;
var mineCoords = [];
var allCoords = [];
var revealed = [];

custom.addEventListener ('click', function () {
    difficulty.forEach(btn => btn.classList.remove('selected')); 
    this.classList.add('selected');

    message.textContent = "";
    minesLeft.textContent = "0";
    timeDisplay.textContent = "00:00";
    clearInterval(timer);

    if (game.hasChildNodes)
        game.removeChild(game.firstChild);

    customFields.style.display = 'flex';
});

difficulty.forEach( function (btn) {
    btn.addEventListener('click', function () {
        diff = this.getAttribute('data-content');

        switch(diff) {
            case 'hard':
                height = 24;
                width = 30;
                numMines = 100;
                break;
            case 'medium':
                height = 16;
                width = 22;
                numMines = 48;
                break;
            case 'easy':
                height = 12;
                width = 18;
                numMines = 24;
                break;
            case 'custom':
                height = parseInt(customH.value);
                width = parseInt(customW.value);
                numMines = parseInt(customM.value);
                break;
        }

        difficulty.forEach(btn => btn.classList.remove('selected')); 
        custom.classList.remove('selected');

        if (diff === 'custom') {
            custom.classList.add('selected')

            if (numMines > height * width) {
                numMines = height * width;
                customM.value = numMines;
            }
        }
        else {
            this.classList.add('selected');
            customFields.style.display = 'none';
        }

        if (!isNaN(height) && !isNaN(width) && !isNaN(numMines))
            reset();
    });
});

function reset() {
    clearInterval(timer);

    revealed = [];

    secondsPassed = 0;
    timeDisplay.textContent = "00:00";
    timer = setInterval(function() {
        secondsPassed++;

        var minutes = parseInt(secondsPassed / 60);
        var seconds = secondsPassed - (minutes * 60);

        if (minutes >= 100) {
            message.textContent = "You still there? 😴"
            clearInterval(timer);
            return;
        }

        timeDisplay.textContent = ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
    }, 1000);

    minesRemaining = numMines;
    minesLeft.textContent = minesRemaining;
    generateNewBoard(width, height, numMines);
}

function generateNewBoard(width, height, numMines) {
    
    game.disabled = false;
    message.textContent = "";

    mineCoords = [];
    for (let i = 0; i < numMines; i++) {
        if (mineCoords.length <= width * height) {
            mineCoords.push(getNewRandomPoint(width, height));
        }
        else {
            break;
        }
    }

    allCoords = [];
    for (let y = 1; y <= height; y++) {
        allCoords.push([]);
        for (let x = 1; x <= width; x++) {
            if (mineCoords.indexOf('x' + x + 'y' + y) !== -1) {
                allCoords[y - 1].push("bomb");
            } else {
                let surroundingBombs = 0;

                if (mineCoords.indexOf('x' + (x+1) + 'y' + y) !== -1) surroundingBombs++;
                if (mineCoords.indexOf('x' + (x+1) + 'y' + (y+1)) !== -1) surroundingBombs++;
                if (mineCoords.indexOf('x' + (x+1) + 'y' + (y-1)) !== -1) surroundingBombs++;
                if (mineCoords.indexOf('x' + x + 'y' + (y+1)) !== -1) surroundingBombs++;
                if (mineCoords.indexOf('x' + x + 'y' + (y-1)) !== -1) surroundingBombs++;
                if (mineCoords.indexOf('x' + (x-1) + 'y' + y) !== -1) surroundingBombs++;
                if (mineCoords.indexOf('x' + (x-1) + 'y' + (y+1)) !== -1) surroundingBombs++;
                if (mineCoords.indexOf('x' + (x-1) + 'y' + (y-1)) !== -1) surroundingBombs++;

                allCoords[y - 1].push(surroundingBombs);
            }
        }
    }

    setTimeout(makeBoard("", 0, 0), 0);   
}

function makeBoard(board, y) {
    y = parseInt(y);

    if (y === 0) board += "<table>";

    board += "<tr>";
    for (var x = 0; x < width; x++) {
        if (allCoords[y][x] == "bomb") {
            board += "<td><button class=\"minesweep-btn bomb\" data-content=\"bomb\"></button></td>";
        } else {
            board += "<td><button id=\"x" + x + "y" + y + "\" data-x=\"" + x + "\" data-y=\"" + y + "\" class=\"minesweep-btn num" + 
                allCoords[y][x] + "\" data-content=\"" + allCoords[y][x] + "\"></button></td>";
        }
    }
    board += "<tr>";

    if (y >= height - 1) {
        game.innerHTML = board;
        clickHandlers();
    } else {
        setTimeout(makeBoard(board, ++y), 0);
    }
}

function getNewRandomPoint(width, height) {

    let x = Math.floor(Math.random() * width) + 1;
    let y = Math.floor(Math.random() * height) + 1;

    if (mineCoords.indexOf('x' + x + 'y' + y) === -1) {
        return ('x' + x + 'y' + y);
    } else {
        return getNewRandomPoint(width, height);
    }
}

function clickHandlers() {
    minesweepButtons = document.querySelectorAll(".minesweep-btn");
    mines = document.querySelectorAll(".bomb");

    minesweepButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            showButton(this);
        });

        btn.addEventListener('contextmenu', function(ev) {
            ev.preventDefault();
            var element = ev.srcElement;

            if (element.textContent === "") {
                element.textContent = "🏴"
                element.classList.add("disabled");
                minesRemaining--;
                minesLeft.textContent = minesRemaining;
            } else if (element.textContent === "🏴") {
                element.textContent = "";
                element.classList.remove("disabled");
                minesRemaining++;
                minesLeft.textContent = minesRemaining;
            }

            return false;
        }, false);
    })
}

function showButton(button) {
    if (button.classList.contains('disabled')) return

    var val = button.getAttribute('data-content');

    if (val === "bomb") {
        message.textContent = "YOU LOSE! 😞";
        mines.forEach(btn => {
            btn.textContent = "💣";
            btn.classList.add('clicked');   
            revealed.push(button.id);         
        });

        minesweepButtons.forEach(btn => btn.disabled = true);

        clearInterval(timer);
    } else {
        if (val === "0") {
            button.classList.add('clicked');
            revealed.push(button.id);

            //show the area
            var x = parseInt(button.getAttribute('data-x'));
            var y = parseInt(button.getAttribute('data-y'));
        
            //find the 8 surrounding buttons and show them
            var ids = [
                'x' + (x+1) + 'y' + (y+1),
                'x' + (x+1) + 'y' + y,
                'x' + (x+1) + 'y' + (y-1),
                'x' + x + 'y' + (y+1),
                'x' + x + 'y' + (y-1),
                'x' + (x-1) + 'y' + (y+1),
                'x' + (x-1) + 'y' + y,
                'x' + (x-1) + 'y' + (y-1)
            ]

            for (var i = 0; i <= ids.length; i++) {
                if (revealed.indexOf(ids[i]) === -1) {
                    var btn = document.getElementById(ids[i]);

                    if (btn != null && btn != undefined) {
                        setTimeout(showButton(btn), 1 * i);
                    }
                }
            }

        } else {
            button.classList.add('clicked');
            button.textContent = val;  
            revealed.push(button.id);
        }

        var win = (revealed.length + numMines) == (height * width)

        if (win) {
            message.textContent = "YOU WIN! 🤗";
            minesweepButtons.forEach(btn => btn.disabled = true);

            clearInterval(timer);
        }
    } 
}

function inArray(array, item) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][0] == item[0] && array[i][1] == item[1]) {
            return true;
        }
    }
    return false;
}