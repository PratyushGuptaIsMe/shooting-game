import { Player } from "./player.js";
import { YellowSkeleton, WhiteSkeleton } from "./enemies.js";
import { Background, LoadAudio } from "./aesthetics.js";

class GAME{
    constructor(width, height){
        this.ALLSEASONS = {
            MORNING: 1,
            NIGHT: 2,
            SUMMER: 3
        }

        this.gameOver = false;
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.fps = 20;
        this.keysArray = [];
        this.groundArea = 200;
        this.debugMode = false;

        this.audio = new LoadAudio();
        this.musicStarted = false;
        
        this.season = this.ALLSEASONS.SUMMER;
        this.backgrounds = new Background(this);

        this.maxAmmo = 10;
        this.Player = new Player(this);

        this.allCurrentEnemies = [];
        this.enemySpawning = true;  //enemy spawning switch
        this.enemyTimer = 0;
        this.enemyInterval = 2000;  //time which enemy spawns

        this.score = 0;
        
        this.gameoverTextSize = 25;
        this.maxGameoverTextSize = 120;
    }

    updateText(text){
        if(this.Player.health < 0){
            this.Player.health = 0;
        }
        text.health.textContent = "Health : " + this.Player.health;
        text.ammo.textContent = "Ammo : " + this.Player.ammunition;
        text.score.textContent = "Score : " + this.score;
        if(this.Player.ammunition < 1){
            text.ammo.style.color = 'red';
            if(this.keysArray.includes(" ")){
                text.ammo.classList.add("jiggle1");
            }else{
                text.ammo.classList.remove("jiggle1")
            }
        }else{
            text.ammo.style.color = 'black';
        }
    }

    #overlayGameOverText(ctx) {
        const gameoverText = "GAME OVER!";
        const scoreText = "Score: " + this.score;
        const gtx = 0;
        const gty = -this.canvasHeight * 0.08;
        const stx = 0;
        const sty = this.canvasHeight * 0.08;
        ctx.save();
        ctx.font = `bold ${this.gameoverTextSize}px "Jersey 15", sans-serif`;
        ctx.lineWidth = 2;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.strokeStyle = "rgb(255, 165, 0)";
        ctx.fillText(gameoverText, this.canvasWidth / 2 + gtx, this.canvasHeight / 2 + gty);
        ctx.strokeText(gameoverText, this.canvasWidth / 2 + gtx, this.canvasHeight / 2 + gty);
        ctx.fillStyle = "#ffd700";
        ctx.strokeStyle = "#ff8c00";
        ctx.fillText(scoreText, this.canvasWidth / 2 + stx, this.canvasHeight / 2 + sty);
        ctx.strokeText(scoreText, this.canvasWidth / 2 + stx, this.canvasHeight / 2 + sty);
        ctx.restore();
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
            if( enemy.hitbox.x - enemy.hitboxExpansion < this.Player.hitbox.x + this.Player.hitbox.w &&
                enemy.hitbox.x + enemy.hitbox.w + enemy.hitboxExpansion > this.Player.hitbox.x &&
                enemy.hitbox.y - enemy.hitboxExpansion < this.Player.hitbox.y + this.Player.hitbox.h &&
                enemy.hitbox.y + enemy.hitbox.h + enemy.hitboxExpansion > this.Player.hitbox.y
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
                this.Player.projectileX + 20 > enemy.hitbox.x &&
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
            this.Player.frameX = 0;
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

    playMainBackgroundMusic() {
        if(!this.musicStarted && !this.gameOver){
            if(window.gameAudioContext && window.gameAudioContext.state === 'suspended') {
                window.gameAudioContext.resume().then(() => {
                    this.playAudio(this.audio.miscellaneous.background_music);
                    this.musicStarted = true;
                });
            } else {
                this.playAudio(this.audio.miscellaneous.background_music);
                this.musicStarted = true;
            }
        }
    }


    update(dt){
        this.Player.update(dt);
        this.backgrounds.update();
        this.allCurrentEnemies.forEach((enemy) => {
            enemy.update(dt);
        });
        if(this.Player.dead === true &&
            this.gameOver === false
        ){
            this.gameOver = true;
            //stop background music
            this.audio.miscellaneous.background_music.a.pause();
            this.audio.miscellaneous.background_music.a.currentTime = 0;
            this.audio.miscellaneous.background_music.playing = false;
            this.musicStarted = false;
            //play pvz gameOver sound
            setTimeout(() => {
                this.playAudio(this.audio.miscellaneous.pvz_gameover_sound_effect);
            }, 200);
            return;
        }
        if(this.gameOver === true){
            this.debugMode = false;
            if(this.gameoverTextSize < this.maxGameoverTextSize){
                this.gameoverTextSize++;
            }
            return;
        }
        this.#enemyCollisionChecks();
        if(this.enemySpawning === true){
            this.#enemySpawnCheck(dt);
        }
        this.playMainBackgroundMusic();
    }
    draw(ctx){
        this.backgrounds.draw(ctx);
        this.Player.draw(ctx);
        this.allCurrentEnemies.forEach((enemy) => {
            enemy.draw(ctx);
        });
        if(this.gameOver === true){
            this.#overlayGameOverText(ctx);
        };
    }
}

const CANVAS = document.getElementById("mainCanvas");
const ctx = CANVAS.getContext("2d");
CANVAS.width = window.innerHeight;
CANVAS.height = window.innerHeight;
game = new GAME(CANVAS.width, CANVAS.height);
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