const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');


let GOSound = new Audio("sounds/death.mp3");
let jumpSound = new Audio("sounds/jump.mp3");
let gameSound = new Audio("sounds/song.mp3");


const card = document.getElementById("card");
const cardScore = document.getElementById("card-score");


let player = null;
let score = 0;
let scoreIncrement = 0;
let arrayBlocks = [];
let enemySpeed = 5;
let canScore = true;
let presetTime = 1000;


Dog = {
    imgDog: new Image(),
    frameHeight: 0,
    frameIndex: 0,
    count: 0,
    frameCount:10,
    frameRate:20,
}

class Player {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.jumpHeight = 12;
        //These 3 are used for jump configuration
        this.shouldJump = false;
        this.jumpCounter = 0;
        this.jumpUp = true;

    }

    draw() {
        gameSound.play();
        this.jump();
        var currFrameX;
        if (Dog.frameIndex > 0 && Dog.frameIndex % 5 === 0) {
            Dog.frameIndex = 0;
            Dog.frameHeight += 61;
        }
        if (Dog.count === 9) {
            Dog.frameIndex = 0;
            Dog.frameHeight = 0;
            Dog.count = 0;
        }

        currFrameX = 82 * (Dog.frameIndex % Dog.frameCount);
        Dog.imgDog.src = 'pictures/dog.png';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(Dog.imgDog, currFrameX, Dog.frameHeight, 82, 61, this.x,this.y,this.size,this.size);

    }

    jump() {
        if (this.shouldJump) {
            this.jumpCounter++;
            if (this.jumpCounter < 15) {
                //Go up
                this.y -= this.jumpHeight;
            } else if (this.jumpCounter > 14 && this.jumpCounter < 19) {
                this.y += 0;
            } else if (this.jumpCounter < 33) {
                //Come back down
                this.y += this.jumpHeight;
            } if (this.jumpCounter >= 32) {
                this.shouldJump = false
            }
        }
    }
}

setInterval(function () {
    ++Dog.frameIndex;
    Dog.count++;
}, 1000 / Dog.frameRate);



function startGame() {
    player = new Player(100, 440, 80,);
    arrayBlocks = [];
    score = 0;
    scoreIncrement = 0;
    enemySpeed = 7;
    canScore = true;
    presetTime = 1000;
}


function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Returns true of colliding
function squaresColliding(player, block) {
    let s1 = Object.assign(Object.create(Object.getPrototypeOf(player)), player);
    let s2 = Object.assign(Object.create(Object.getPrototypeOf(block)), block);
    //Don't need pixel perfect collision detection
    s2.size = s2.size - 10;
    s2.x = s2.x + 10;
    s2.y = s2.y + 10;
    return !(
        s1.x > s2.x + s2.size || //R1 is to the right of R2
        s1.x + s1.size < s2.x || //R1 to the left of R2
        s1.y > s2.y + s2.size || //R1 is below R2
        s1.y + s1.size < s2.y //R1 is above R2
    )
}


function isPastBlock(player, block) {
    return (
        player.x + (player.size / 2) > block.x + (block.size / 4) &&
        player.x + (player.size / 2) < block.x + (block.size / 4) * 3
    )
}

class AvoidBlock {
    constructor(size, speed) {
        this.picture = new Image()
        this.picture.src = "pictures/rock.png"
        this.x = canvas.width + size;
        this.y = 520 - size;
        this.size = size;
        this.slideSpeed = speed;
    }

    draw() {
        ctx.drawImage(this.picture,this.x, this.y, this.size, this.size);
    }

    slide() {
        this.draw();
        this.x -= this.slideSpeed;
    }

}


function generateBlocks() {
    let timeDelay = randomInterval(presetTime);
    arrayBlocks.push(new AvoidBlock(55, enemySpeed));


    setTimeout(generateBlocks, timeDelay);
}

function randomInterval(timeInterval) {
    let returnTime = timeInterval;
    if (Math.random() < 0.9) {
        returnTime += getRandomNumber(presetTime / 3, presetTime * 1.5);
    } else {
        returnTime -= getRandomNumber(presetTime / 7.5, presetTime / 3);
    }
    return returnTime;
}


function drawScore() {
    let scoreString = score.toString();
    let sc = document.getElementById('scoreTable')
    sc.innerText = "Очки : " + scoreString;
}

function shouldIncreaseSpeed() {
    if (scoreIncrement + 10 === score) {
        scoreIncrement = score;
        enemySpeed++;
        presetTime >= 100 ? presetTime -= 100 : presetTime = presetTime / 2;
        arrayBlocks.forEach(block => {
            block.slideSpeed = enemySpeed;
        });
        console.log("Speed increased");
    }
}


let animationId = null;

function animate() {
    animationId = requestAnimationFrame(animate);
    drawScore();
    player.draw();

    shouldIncreaseSpeed();

    arrayBlocks.forEach((arrayBlock, index) => {
        arrayBlock.slide();
        if (squaresColliding(player, arrayBlock)) {
            canvas.style.background = "#3e5e3b"
            gameSound.pause()
            GOSound.play();
            cardScore.textContent = score;
            card.style.display = "block";
            cancelAnimationFrame(animationId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        if (isPastBlock(player, arrayBlock) && canScore) {
            canScore = false;
            score++;
        }
        if ((arrayBlock.x + arrayBlock.size) <= 0) {
            setTimeout(() => {
                arrayBlocks.splice(index, 1);
            }, 0)
        }
    });

}

addEventListener("keydown", e => {
    if (e.code === 'Space') {
        if (!player.shouldJump) {
            jumpSound.play();
            player.jumpCounter = 0;
            player.shouldJump = true;
            canScore = true;
        }
    }
});





startGame();
animate();
setTimeout(() => {
    generateBlocks();
}, randomInterval(presetTime))


function restartGame(button) {
    Dog.count = null;
    card.style.display = "none";
    button.blur();
    canvas.style.background = null;
    startGame();
    requestAnimationFrame(animate)
    gameSound.play();
}

