var difficulty = document.querySelectorAll('#buttons button');
var intro = document.querySelector('#intro');
var game = document.querySelector('#minesweeper');
var message = document.querySelector('#message');
var mines;
var minesweepButtons;

var height, width, numMines;
var mineCoords = [];
var allCoords = [];

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
        }

        generateNewBoard(width, height, numMines);
    });
});

function generateNewBoard(width, height, numMines) {
    game.disabled = false;
    message.textContent = "";

    mineCoords = [];
    for (let i = 0; i < numMines; i++) {
        mineCoords.push(getNewRandomPoint(width, height));
    }

    allCoords = [];
    for (let y = 1; y <= height; y++) {
        allCoords.push([]);
        for (let x = 1; x <= width; x++) {
            if (inArray(mineCoords, [x, y])) {
                allCoords[y - 1].push("bomb");
            }
            else {
                let surroundingBombs = 0;

                if (inArray(mineCoords, [x + 1, y])) surroundingBombs++;
                if (inArray(mineCoords, [x + 1, y + 1])) surroundingBombs++;
                if (inArray(mineCoords, [x + 1, y - 1])) surroundingBombs++;
                if (inArray(mineCoords, [x, y + 1])) surroundingBombs++;
                if (inArray(mineCoords, [x, y - 1])) surroundingBombs++;
                if (inArray(mineCoords, [x - 1, y])) surroundingBombs++;
                if (inArray(mineCoords, [x - 1, y + 1])) surroundingBombs++;
                if (inArray(mineCoords, [x - 1, y - 1])) surroundingBombs++;

                allCoords[y - 1].push(surroundingBombs);
            }
        }
    }

    var board = "<table>"

    for (let y = 0; y < height; y++) {
        board += "<tr>";

        for (let x = 0; x < width; x++) {
            if (allCoords[y][x] == "bomb") {
                board += "<td><button class=\"minesweep-btn bomb\" data-content=\"bomb\"></button></td>";
            }
            else {
                board += "<td><button id=\"" + x + "-" + y + "\"class=\"minesweep-btn num" + allCoords[y][x] + "\" data-content=\"" + allCoords[y][x] + "\"></button></td>";
            }
        }

        board += "</tr>";
    }


    game.innerHTML = board;
    clickHandlers();
}

function getNewRandomPoint(width, height) {

    let x = Math.floor(Math.random() * width) + 1;
    let y = Math.floor(Math.random() * height) + 1;

    if (!inArray(mineCoords, [x,y])) {
        return [x,y];
    }
    else {
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
            } else if (element.textContent === "🏴") {
                element.textContent = "";
                element.classList.remove("disabled");
            }

            return false;
        }, false);
    })
}

function showButton(button) {
    if (button.classList.contains('disabled')) return

    var val = button.getAttribute('data-content');

    if (val === "bomb") {
        message.textContent = "YOU LOSE!";
        mines.forEach(function(mine) {
            mine.textContent = "💣";
            mine.classList.add('clicked');
        });

        minesweepButtons.forEach(function(button) {
            button.disabled = true;
        })
    } else if (val === "0") {
        button.classList.add('clicked');
        setTimeout(
            showArea(button),
            200
        );       
    } else {
        button.classList.add('clicked');
        button.textContent = val;  
    }
}

function showArea(button) {
    var coord = button.id.split('-');
    var x = parseInt(coord[0]);
    var y = parseInt(coord[1]);

    for (let i = 0; i < minesweepButtons.length; i++) {
        var btn = minesweepButtons[i];

        if (btn.classList.contains('clicked')) continue;

        var idcoord = btn.id.split('-');
        var idx = parseInt(idcoord[0]);
        var idy = parseInt(idcoord[1]);

        if ((idx === x + 1 && idy === y + 1) ||
            (idx === x + 1 && idy === y) ||
            (idx === x + 1 && idy === y - 1) ||
            (idx === x && idy === y + 1) ||
            (idx === x && idy === y - 1) ||
            (idx === x - 1 && idy === y + 1) ||
            (idx === x - 1 && idy === y) ||
            (idx === x - 1 && idy === y - 1))
        {
            showButton(btn);
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