import {gameSound,ctx,canvas,player,jumpSound,ImportedValues} from "./game.js";

export let Dog = {
    imgDog: new Image(),
    frameHeight: 0,
    frameIndex: 0,
    count: 0,
    frameCount:10,
    frameRate:20,
};

export default class Player {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.jumpHeight = 12;
        this.shouldJump = false;
        this.jumpCounter = 0;
        this.jumpUp = true;
    };

    draw() {
        this.jump();
        let currFrameX;
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
    };

    jump() {
        if (this.shouldJump) {
            this.jumpCounter++;
            if (this.jumpCounter < 15) {
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
    };
};

setInterval(function () {
    ++Dog.frameIndex;
    Dog.count++;
}, 1000 / Dog.frameRate);

 addEventListener("keydown", e => {
    if (e.code === 'Space') {
        if (!player.shouldJump) {
            jumpSound.play();
            player.jumpCounter = 0;
            player.shouldJump = true;
            ImportedValues.canScore = true;
        }
    }
});





