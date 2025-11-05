const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
let snake;
let direction;
let food;
let obstacles;
let score;
let game;
let speed = 150;

document.getElementById("speed").addEventListener("change", function() {
    speed = parseInt(this.value);
    restartGame();
});

document.getElementById("restartBtn").addEventListener("click", restartGame);

async function restartGame() {
    
    direction = null;
    score = 0;
    
    await createObstacles();
    let snakex;
    let snakey;
    while(true){
        snakex= Math.floor(Math.random()*canvas.width/box)*box
        snakey= Math.floor(Math.random()*canvas.width/box)*box
        let check1= obstacles.some((segment)=> segment.x===snakex &&segment.y===snakey) ;

        if(!check1)break;
    }
    snake=[{x:snakex,y:snakey}];
    await createFood();
    
    console.log(snake)
    document.getElementById("result").innerText = "";
    clearInterval(game);
    game = setInterval(draw, speed);
}

function createFood() {

    let xfood;
    let yfood;
    while(true){
        xfood= Math.floor(Math.random() * (canvas.width / box)) * box;
        yfood= Math.floor(Math.random() * (canvas.width / box)) * box;
        let check1= obstacles.some((segment)=> segment.x===xfood &&segment.y===yfood) ;
        let check2 =snake.some((segment)=>segment.x===xfood &&segment.y===yfood)
        if(!check1 && !check2 )break;
    }

    food = {
        x: xfood,
        y: yfood
    };
}

function createObstacles() {
    obstacles = [];
    let numObstacles =Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < numObstacles; i++) {
        let size = Math.floor(Math.random() * 3) + 3; // min size 3
        let horizontal = Math.random() > 0.5;
        let startX = Math.floor(Math.random() * (canvas.width / box - size)) * box;
        let startY = Math.floor(Math.random() * (canvas.height / box - size)) * box;
        //codition that  start of x do not touches boundry
        if(startX <0 || startX>canvas.width-box ||
         startY<0 || startY > canvas.height - box){i--;continue;}
        for (let j = 0; j < size; j++) {
           const newX = horizontal ? startX + j * box : startX;
            const newY = horizontal ? startY : startY + j * box;

            if (newX > 0 && newX < canvas.width - box &&
                newY > 0 && newY < canvas.height - box) {
                obstacles.push({ x: newX, y: newY });
            }

        }
    }
}

document.addEventListener("keydown", event => {
    if (event.keyCode === 37 && direction !== "RIGHT") direction = "LEFT";
    else if (event.keyCode === 38 && direction !== "DOWN") direction = "UP";
    else if (event.keyCode === 39 && direction !== "LEFT") direction = "RIGHT";
    else if (event.keyCode === 40 && direction !== "UP") direction = "DOWN";
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw obstacles
    ctx.fillStyle = "gray";
    obstacles.forEach(o => ctx.fillRect(o.x, o.y, box, box));

    // Draw snake
    
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "lime" : "green";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }


    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Old head position
    let headX = snake[0].x;
    let headY = snake[0].y;

    // Direction
    if (direction === "LEFT") headX -= box;
    if (direction === "UP") headY -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "DOWN") headY += box;

    // Collision with walls
    if (headX < 0 || headY < 0 || headX >= canvas.width || headY >= canvas.height || collisionWithObstacles(headX, headY) || collisionWithSelf(headX, headY)) {
        endGame();
        return;
    }

    // Food eaten
    if (headX === food.x && headY === food.y) {
        score++;
        document.getElementById("popSound").play();
        createFood();
    } else {
        snake.pop();
    }

    // New head
    snake.unshift({ x: headX, y: headY });

    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 10, 390);
}

function collisionWithObstacles(x, y) {
    return obstacles.some(o => o.x === x && o.y === y);
}

function collisionWithSelf(x, y) {
    return snake.some((segment, index) => index !== 0 && segment.x === x && segment.y === y);
}

function endGame() {
    clearInterval(game);
    document.getElementById("result").innerText = "Game Over! Final Score: " + score;
    let highScore = localStorage.getItem("snakeHighScore") || 0;
    if (score > highScore) {
        localStorage.setItem("snakeHighScore", score);
        highScore = score;
    }
    document.getElementById("highScore").innerText = highScore;
}

(function init() {
    let savedHigh = localStorage.getItem("snakeHighScore") || 0;
    document.getElementById("highScore").innerText = savedHigh;
    restartGame();
})();