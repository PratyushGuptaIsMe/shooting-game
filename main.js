import { Player } from "./player.js";
import { YellowSkeleton, WhiteSkeleton } from "./enemies.js";
import { Background, LoadAudio } from "./visuals.js";

class GAME{
    constructor(width, height){
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.fps = 20;
        this.keysArray = [];
        this.groundArea = 200;
        this.debugMode = false;
        this.season = "autumn";

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
        text.health.textContent = "Health : " + this.Player.health;
        text.ammo.textContent = "Ammo : " + this.Player.ammunition;
        text.score.textContent = "Score : " + this.score;
    }

    #spawnWhiteSkeleton(){
        let newSkelly = new WhiteSkeleton(this);
        if( newSkelly.hitbox.x < this.Player.hitbox.x + this.Player.hitbox.w &&
            newSkelly.hitbox.x + newSkelly.hitbox.w > this.Player.hitbox.x &&
            newSkelly.hitbox.y < this.Player.hitbox.y + this.Player.hitbox.h &&
            newSkelly.hitbox.y + newSkelly.hitbox.h > this.Player.hitbox.y
        ){
            newSkelly = "";
            this.#spawnWhiteSkeleton();
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
            newSkelly = "";
            this.#spawnYellowSkeleton();
        }else{
            this.allCurrentEnemies.push(newSkelly);
        }
    }
    spawnEnemy(){
        let rand = Math.random();
        if(rand <= 0.20){
            this.#spawnYellowSkeleton();
        }else if(rand > 0.20 && rand < 1){
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

            if( enemy.hitbox.x < this.Player.hitbox.x + this.Player.hitbox.w &&
                enemy.hitbox.x + enemy.hitbox.w > this.Player.hitbox.x &&
                enemy.hitbox.y < this.Player.hitbox.y + this.Player.hitbox.h &&
                enemy.hitbox.y + enemy.hitbox.h > this.Player.hitbox.y
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

    update(dt){
        if(this.Player.dead === true){
            console.log("dead");
            return;
        }
        this.backgrounds.update(dt);
        this.Player.update(dt);
        this.allCurrentEnemies.forEach((enemy) => {
            enemy.update(dt);
        });
        this.#enemyCollisionChecks();
        if(this.enemySpawning === true){
            this.#enemySpawnCheck(dt);
        }
        
        
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
