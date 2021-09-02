import Player from "./player.js"
import {Dog} from "./player.js";
import {shouldIncreaseSpeed, squaresColliding, isPastBlock} from "./entity.js";

export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext('2d');

let GOSound = new Audio("sounds/death.mp3");
export let jumpSound = new Audio("sounds/jump.mp3");
export let gameSound = new Audio("sounds/song.mp3");

const card = document.getElementById("card");
const cardScore = document.getElementById("card-score");
let btn = document.getElementById("btn")

export let player = null;
export let score = 0;
export let arrayBlocks = [];
export let ImportedValues = {
    scoreIncrement: 0,
    canScore: true,
    enemySpeed: 5,
    presetTime: 1000
};
let animationId = null;

export let soundPolicy = () => {
    alert("Привет! Из-за политики браузера автовопроизведение музыки невозможно. Нажми любую клавишу чтобы музыка заиграла. Спасибо!")
};

let drawScore = () => {
    let scoreString = score.toString();
    let sc = document.getElementById('scoreTable')
    sc.innerText = "Очки : " + scoreString;
};

export let startGame = () => {
    player = new Player(100, 440, 80,);
    arrayBlocks = [];
    score = 0;
    ImportedValues.scoreIncrement = 0;
    ImportedValues.enemySpeed = 7;
    ImportedValues.canScore = true;
    ImportedValues.presetTime = 1000;
};

export let animate = () => {
    gameSound.play()
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
            arrayBlock.splice(0,arrayBlock.length)
        }
        if (isPastBlock(player, arrayBlock) && ImportedValues.canScore) {
            ImportedValues.canScore = false;
            score++;
        }
        if ((arrayBlock.x + arrayBlock.size) <= 0) {
            setTimeout(() => {
                arrayBlocks.splice(index, 1);
            }, 0)
        }
    });
};

btn.onclick = function restart() {
    Dog.count = null;
    card.style.display = "none";
    canvas.style.background = null;
    startGame();
    requestAnimationFrame(animate);
};






