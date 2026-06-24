
let inputDir = { x: 1, y: 0 };
let snakeArr = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };

let score = 0;
let speed = 8;
let level = 1;

let started = false;
let pause = false;
let gameOver = false;
let lastTime = 0;


const board = document.getElementById("board");
const scoreBox = document.getElementById("scoreBox");
const hiscoreBox = document.getElementById("hiscoreBox");
const levelBox = document.getElementById("levelBox");
const startBtn = document.getElementById("startBtn");
const gameOverScreen = document.getElementById("gameOverScreen");

// sound
const eat = new Audio("./music/food.mp3");
const over = new Audio("./music/gameover.mp3");

// HIGH SCORE 
let hiscore = localStorage.getItem("hiscore") || 0;
hiscoreBox.innerText = "HiScore: " + hiscore;

// START GAME FUNCTION 
function startGame() {
    if (started) return;

    started = true;
    startBtn.style.display = "none";
    inputDir = { x: 1, y: 0 };
}

//  GAME LOOP
function main(time) {
    window.requestAnimationFrame(main);

    if (!started || pause || gameOver) return;

    if ((time - lastTime) / 1000 < 1 / speed) return;

    lastTime = time;
    gameEngine();
}

// COLLISION 
function isCollide(snake) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    if (
        snake[0].x < 1 || snake[0].x > 18 ||
        snake[0].y < 1 || snake[0].y > 18
    ) return true;

    return false;
}

// GAME ENGINE
function gameEngine() {

    // GAME OVER
    if (isCollide(snakeArr)) {
        over.play();
        gameOver = true;
        gameOverScreen.style.display = "flex";
        return;
    }

    // FOOD EAT
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {

        eat.play();
        score++;
        scoreBox.innerText = "Score: " + score;

        // HIGH SCORE
        if (score > hiscore) {
            hiscore = score;
            localStorage.setItem("hiscore", hiscore);
            hiscoreBox.innerText = "HiScore: " + hiscore;
        }

        // GROW SNAKE
        snakeArr.unshift({
            x: snakeArr[0].x + inputDir.x,
            y: snakeArr[0].y + inputDir.y
        });

        // NEW FOOD
        food = {
            x: Math.floor(1 + Math.random() * 17),
            y: Math.floor(1 + Math.random() * 17)
        };

        // LEVEL SYSTEM
        let newLevel = Math.floor(score / 5) + 1;

        if (newLevel !== level) {
            level = newLevel;
            speed = 8 + (level - 1) * 2;
            levelBox.innerText = "Level: " + level;
        }
    }

    // MOVE SNAKE
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // DRAW BOARD
    board.innerHTML = "";

    snakeArr.forEach((e, i) => {
        let div = document.createElement("div");
        div.style.gridRowStart = e.y;
        div.style.gridColumnStart = e.x;
        div.classList.add(i === 0 ? "head" : "snake");
        board.appendChild(div);
    });

    let foodEl = document.createElement("div");
    foodEl.style.gridRowStart = food.y;
    foodEl.style.gridColumnStart = food.x;
    foodEl.classList.add("food");
    board.appendChild(foodEl);
}

// TOUCH CONTROLS (SWIPE)

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchend", (e) => {
    let touchEndX = e.changedTouches[0].clientX;
    let touchEndY = e.changedTouches[0].clientY;

    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    // horizontal swipe
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30 && inputDir.x !== -1) {
            inputDir = { x: 1, y: 0 }; // right
        } else if (dx < -30 && inputDir.x !== 1) {
            inputDir = { x: -1, y: 0 }; // left
        }
    }
    // vertical swipe
    else {
        if (dy > 30 && inputDir.y !== -1) {
            inputDir = { x: 0, y: 1 }; // down
        } else if (dy < -30 && inputDir.y !== 1) {
            inputDir = { x: 0, y: -1 }; // up
        }
    }

    // first swipe starts game
    if (!started) startGame();
});

// CONTROLS 


window.addEventListener("keydown", (e) => {

    if (e.key === "Enter") startGame();

    if (!started) return;

    if (e.key === " ") pause = !pause;

    switch (e.key) {
        case "ArrowUp": inputDir = { x: 0, y: -1 }; break;
        case "ArrowDown": inputDir = { x: 0, y: 1 }; break;
        case "ArrowLeft": inputDir = { x: -1, y: 0 }; break;
        case "ArrowRight": inputDir = { x: 1, y: 0 }; break;
    }
});

// Button start FIX
startBtn.addEventListener("click", startGame);

// Restart
document.getElementById("restartBtn").onclick = () => {
    location.reload();
};

// START LOOP
window.requestAnimationFrame(main);