import {ImportedValues,score,canvas,ctx,arrayBlocks,} from "./game.js";

let getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export let squaresColliding = (player, block) => {
    let s1 = Object.assign(Object.create(Object.getPrototypeOf(player)), player);
    let s2 = Object.assign(Object.create(Object.getPrototypeOf(block)), block);
    s2.size = s2.size - 10;
    s2.x = s2.x + 10;
    s2.y = s2.y + 10;
    return !(
        s1.x > s2.x + s2.size || s1.x + s1.size < s2.x || s1.y > s2.y + s2.size || s1.y + s1.size < s2.y
    )
};

export let isPastBlock = (player, block) => {
    return (
        player.x + (player.size / 2) > block.x + (block.size / 4) &&
        player.x + (player.size / 2) < block.x + (block.size / 4) * 3
    )
};

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

export let generateBlocks = () => {
    let timeDelay = randomInterval(ImportedValues.presetTime);
    arrayBlocks.push(new AvoidBlock(55, ImportedValues.enemySpeed));
    setTimeout(generateBlocks, timeDelay);
};

export let randomInterval = (timeInterval) => {
    let returnTime = timeInterval;
    if (Math.random() < 0.9) {
        returnTime += getRandomNumber(ImportedValues.presetTime / 3, ImportedValues.presetTime * 1.5);
    } else {
        returnTime -= getRandomNumber(ImportedValues.presetTime / 7.5, ImportedValues.presetTime / 3);
    }
    return returnTime;
};

 export let shouldIncreaseSpeed = () => {
    if (ImportedValues.scoreIncrement + 5 === score) {
        ImportedValues.scoreIncrement = score;
        ImportedValues.enemySpeed++;
        ImportedValues.presetTime >= 100 ? ImportedValues.presetTime -= 100 : ImportedValues.presetTime = ImportedValues.presetTime / 2;
        arrayBlocks.forEach(block => {
            block.slideSpeed = ImportedValues.enemySpeed;
        });
    }
};