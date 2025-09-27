import { Player } from "./player.js";
import { YellowSkeleton, WhiteSkeleton } from "./enemies.js";
import { Background, LoadAudio, Particles } from "./aesthetics.js";

class GAME{
    constructor(width, height){
        this.ALLSEASONS = {
            AUTUMN: 1,
            WINTER: 2,
            SUMMER: 3
        }

        this.canvasWidth = width;
        this.canvasHeight = height;
        this.fps = 20;
        this.keysArray = [];
        this.groundArea = 200;
        this.debugMode = false;
        this.season = this.ALLSEASONS.AUTUMN;

        this.audio = new LoadAudio();

        this.allCurrentEnemies = [];
        this.backgrounds = new Background(this);
        this.Player = new Player(this);

        this.enemySpawning = true;  //enemy spawning switch
        this.enemyTimer = 0;
        this.enemyInterval = 1000;  //time which enemy spawns

        this.score = 0;
    }

    updateText(text){
        text.health.textContent = "health : " + this.Player.health;
        text.ammo.textContent = "ammo : " + this.Player.ammunition;
        text.score.textContent = "score : " + this.score;
    }

    #spawnWhiteSkeleton(){
        let newSkelly = new WhiteSkeleton(this);
        if( newSkelly.hitbox.x < this.Player.hitbox.x + this.Player.hitbox.w &&
            newSkelly.hitbox.x + newSkelly.hitbox.w > this.Player.hitbox.x &&
            newSkelly.hitbox.y < this.Player.hitbox.y + this.Player.hitbox.h &&
            newSkelly.hitbox.y + newSkelly.hitbox.h > this.Player.hitbox.y
        ){
            return;
        }else{
            this.allCurrentEnemies.push(newSkelly);
        }
    }
    #spawnYellowSkeleton(){
        let newSkelly = new YellowSkeleton(this);
        if( newSkelly.hitbox.x < this.Player.hitbox.x + this.Player.hitbox.w &&
            newSkelly.hitbox.x + newSkelly.hitbox.w > this.Player.hitbox.x &&
            newSkelly.hitbox.y < this.Player.hitbox.y + this.Player.hitbox.h &&
            newSkelly.hitbox.y + newSkelly.hitbox.h > this.Player.hitbox.y
        ){
            return;
        }else{
            this.allCurrentEnemies.push(newSkelly);
        }
    }
    spawnEnemy(){
        let rand = Math.random();
        if(rand <= 0.15){
            this.#spawnYellowSkeleton();
        }else if(rand > 0.15 && rand < 1){
            this.#spawnWhiteSkeleton();
        }
    }
    #enemySpawnCheck(dt){
        if(this.enemyTimer < this.enemyInterval){
            this.enemyTimer += dt;
        }else if(this.enemyTimer >= this.enemyInterval){
            this.spawnEnemy();
            this.enemyTimer = 0;
        }
    }

    #enemyCollisionChecks(){
        this.allCurrentEnemies.forEach((enemy) => {
            let expansion = 6;
            if( enemy.hitbox.x - expansion < this.Player.hitbox.x + this.Player.hitbox.w &&
                enemy.hitbox.x + enemy.hitbox.w + expansion > this.Player.hitbox.x &&
                enemy.hitbox.y - expansion < this.Player.hitbox.y + this.Player.hitbox.h &&
                enemy.hitbox.y + enemy.hitbox.h + expansion > this.Player.hitbox.y
            ){
                if(enemy.attackAnimationRunning === false){
                    enemy.attackAnimationRunning = true;
                    enemy.frameAccelerator = 1.2;
                    if(enemy.dead === false){
                        enemy.frameX = 0;
                    }
                }
            }else if(enemy.frameX === enemy.maxFrameX){
                enemy.attackAnimationRunning = false;
            }
            
            if( enemy.attackAnimationRunning === true &&
                enemy.frameX > (enemy.maxFrameX / 2 ) + 1 
            ){
                this.playRandomAudio(enemy.audio.attacking);
            }

            if( enemy.dead === false &&
                enemy.markedForDeletion === false &&
                this.Player.bulletActive === true &&
                this.Player.projectileX < enemy.hitbox.x + enemy.hitbox.w &&
                this.Player.projectileX + 25 > enemy.hitbox.x &&
                this.Player.gunHeight < enemy.hitbox.y + enemy.hitbox.h &&
                this.Player.gunHeight + 10 > enemy.hitbox.y
            ){
                enemy.dead = true;
                enemy.frameX = 0;
                enemy.frameAccelerator = 1.2;
                enemy.maxFrameX = 13;
                enemy.frameTimer = 0;
                if(Math.random() < 0.5){
                    this.playRandomSequence(enemy.audio.dying.id2);
                }else{
                    this.playAudio(enemy.audio.dying.id1);
                }
            }

        })

        this.allCurrentEnemies = this.allCurrentEnemies.filter((enemy) => {
            return enemy.markedForDeletion === false;
        })
    }

    hurtPlayer(dmg){
        if(this.Player.hurt === false){
            this.Player.hurt = true;
            setTimeout(() => {
                this.Player.hurt = false;
            }, this.Player.invinsibilityFramesMS)
            this.Player.health = this.Player.health - dmg;
        }else if(this.Player.hurt === true){
            return;
        }
    }
    healPlayer(health){
        this.Player.health = this.Player.health + health;
    }
    incrementScore(score){
        this.score = this.score + score;
    }

    // Pass a CreateAudio instance (has properties: a, l, playing, etc.)
    // This function will play the audio and handle the 'playing' flag for non-looping sounds
    playAudio(audio){
        try{
            if(audio.playing === true){
                return;
            }else{
                audio.a.play();
                if(audio.l === false){
                    audio.playing = true;
                    audio.a.onended = () => audio.playing = false;
                }
            }
        }catch(e){
            console.error(e);
        }
    }  
    // in x = {id1: "hello", id2: "bye", id3: "chao"}.  If we pass x it will give us "hello"/"bye"
    getRandomObjectValue(object){
        return object[Object.keys(object)[Math.floor(Math.random() * Object.keys(object).length)]];
    }
    playRandomAudio(audio){
        this.playAudio(this.getRandomObjectValue(audio));
    }
    playRandomSequence(audioObjects) {
        let audios = Object.values(audioObjects);
        let count = Math.floor(Math.random() * audios.length) + 1;
        let chosen = audios.sort(() => 0.5 - Math.random()).slice(0, count);
        let index = 0;
        const playNext = () => {
            if (index < chosen.length) {
                let current = chosen[index].a;
                index++;
                current.currentTime = 0;
                current.play();
                current.onended = playNext;
            }
        };
        playNext();
    }

    update(dt){
        if(this.Player.dead === true){
            return;
        }
        this.backgrounds.update();
        this.Player.update(dt);
        this.allCurrentEnemies.forEach((enemy) => {
            enemy.update(dt);
        });
        this.#enemyCollisionChecks();
        if(this.enemySpawning === true){
            this.#enemySpawnCheck(dt);
        }
        this.playAudio(this.audio.miscellaneous.background_music);
    }
    draw(ctx){
        if(this.Player.dead === true){
            //if dead
        }else if(this.Player.dead === false){
            this.backgrounds.draw(ctx);
            this.Player.draw(ctx);
            this.allCurrentEnemies.forEach((enemy) => {
                enemy.draw(ctx);
            });
        }
    }
}

const CANVAS = document.getElementById("mainCanvas");
const ctx = CANVAS.getContext("2d");
CANVAS.width = 500;
CANVAS.height = 500;
let game = new GAME(CANVAS.width, CANVAS.height);
let l = 0;
const text = {
    health: document.getElementById("healthDisplay"),
    ammo: document.getElementById("ammoDisplay"),
    score: document.getElementById("scoreDisplay")
};

const activateDebugPassKey = "p";   //////////////////////////////////////////////

animationLoop(l);
window.addEventListener("keydown", (event) => {
    if(!game.keysArray.includes(event.key)){
        game.keysArray.push(event.key);
    }
    if(event.key === activateDebugPassKey){
        game.debugMode = !game.debugMode;
    }
});
window.addEventListener("keyup", (event) => {
    if(game.keysArray.includes(event.key)){
        game.keysArray.splice(game.keysArray.indexOf(event.key), 1);
    }
});

function animationLoop(t){
    let deltaTime = t - l;
    l = t;
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
    game.update(deltaTime);
    game.draw(ctx);
    game.updateText(text);
    requestAnimationFrame(animationLoop);
}
