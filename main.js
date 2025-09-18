import { Player } from "./player.js";
import { YellowSkeleton, WhiteSkeleton } from "./enemies.js";
import { Grass } from "./backgrounds.js";

const CANVAS = document.getElementById("mainCanvas");
const ctx = CANVAS.getContext("2d");
const TCANVAS = document.getElementById("textCanvas");
const text = TCANVAS.getContext("2d");
CANVAS.width = 500;
CANVAS.height = 500;

class GAME{
    constructor(width, height){
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.fps = 20;
        this.keysArray = [];
        this.groundArea = 200;
        this.debugMode = false;
        this.season = "autumn";

        this.allCurrentEnemies = [];
        this.backgrounds = new Grass(this);
        this.Player = new Player(this);

        this.enemyTimer = 0;
        this.enemyInterval = 1000;  //time which enemy spawns

        this.score = 0;
    }

    updateText(text){
        text.font = "35px Arial";
        text.fillStyle = "black";
        text.fillText("Health : " + this.Player.health, 10, 40);
        text.fillText("Ammo : " + this.Player.ammunition, 10, 80);
        text.save();
        text.font = "700 35px Arial";
        text.fillText("Score : " + this.score, 10, 120);
        text.restore();
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
            this.enemyTimer = this.enemyTimer + dt;
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
                    enemy.frameX = 0;
                }
            }else{
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
                enemy.frameAccelerator = 1.4;
                enemy.maxFrameX = 13;
                enemy.frameTimer = 0;
            }

        })

        this.allCurrentEnemies = this.allCurrentEnemies.filter((enemy) => {
            return enemy.markedForDeletion === false;
        })
    }

    hurtPlayer(dmg){
        this.Player.health = this.Player.health - dmg;
    }
    healPlayer(health){
        this.Player.health = this.Player.health + health;
    }
    incrementScore(score){
        this.score = this.score + score;
    }

    update(dt){
        if(this.Player.dead === true){
            //if dead
            console.log("dead");
        }else if(this.Player.dead === false){
            this.backgrounds.update(dt);
            this.Player.update(dt);
            this.allCurrentEnemies.forEach((enemy) => {
                enemy.update(dt);
            });
            this.#enemyCollisionChecks();
            this.#enemySpawnCheck(dt);
        }
    }
    draw(ctx, text){
        if(this.Player.dead === true){
            //if dead
        }else if(this.Player.dead === false){
            this.backgrounds.draw(ctx);
            this.Player.draw(ctx);
            this.allCurrentEnemies.forEach((enemy) => {
                enemy.draw(ctx);
            });
            this.updateText(text);
        }
    }
}

window.addEventListener("load", () => {
    let game = new GAME(CANVAS.width, CANVAS.height);
    let l = 0;
    animationLoop(l);
    window.addEventListener("keydown", (event) => {
        if(!game.keysArray.includes(event.key)){
            game.keysArray.push(event.key);
        }
        if(event.key === "d"){
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
        text.clearRect(0, 0, CANVAS.width, CANVAS.height);
        game.update(deltaTime);
        game.draw(ctx, text);
        requestAnimationFrame(animationLoop);
    }
})