import { Player } from "./player.js";
import { YellowSkeleton, WhiteSkeleton } from "./enemies.js";
import { Grass } from "./backgrounds.js";

window.addEventListener("load", function(){
    const CANVAS = document.getElementById("mainCanvas");
    const ctx = CANVAS.getContext("2d");
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

            this.allCurrentEnemies = [new WhiteSkeleton(this)];
            this.backgrounds = new Grass(this);
            this.Player = new Player(this);

            this.enemyTimer = 0;
            this.enemyInterval = 1000;

            this.score = 0;
            this.health = 100;
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
                
            })
        }
        hurtPlayer(dmg){
            this.health = this.health - dmg;
        }

        update(dt){
            console.log(this.health);
            this.backgrounds.update(dt);
            this.Player.update(dt);
            this.allCurrentEnemies.forEach((enemy) => {
                enemy.update(dt);
            });
            this.#enemyCollisionChecks();

            if(this.enemyTimer < this.enemyInterval){
                this.enemyTimer = this.enemyTimer + dt;
            }else if(this.enemyTimer >= this.enemyInterval){
                this.spawnEnemy();
                this.enemyTimer = 0;
            }
        }
        draw(ctx){
            this.backgrounds.draw(ctx);
            this.Player.draw(ctx);
            this.allCurrentEnemies.forEach((enemy) => {
                enemy.draw(ctx);
            });
        }
    }

    let game = new GAME(CANVAS.width, CANVAS.height)
    window.game = game;

    let l = 0;

    function animationLoop(t){
        let deltaTime = t-l;
        l = t;

        ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animationLoop);
    }
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
});
