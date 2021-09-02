import {startGame, animate, ImportedValues} from "./modules/game.js";
import {generateBlocks, randomInterval} from "./modules/entity.js";
import {soundPolicy} from "./modules/game.js";


new Promise(function (resolve, reject) {
        resolve(soundPolicy(),
            startGame(),
            animate(),
            setTimeout(() => {
                generateBlocks();
            }, randomInterval(ImportedValues.presetTime)));
        reject(console.log("error"));
    }
);













