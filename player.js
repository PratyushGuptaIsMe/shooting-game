export class Player{
    constructor(game){
        this.abortPlayer = false;
        this.game = game;
        this.audio = this.game.audio.player;
        this.x = 0;
        this.y = 0;
        this.spriteWidth = 128;
        this.spriteHeight = 128;
        this.currentImage = document.getElementById("idle");
        this.maxFrameX = 3;
        this.frameX = 0;
        this.frameY = 0;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.game.fps;
        this.frameAccelerator = 1;
        this.keysPressed = this.game.keysArray;
        this.groundMargin = this.game.groundArea;
        
        this.ammunition = 10;
        this.canShoot = true;
        this.canReload = true;
        this.shootingAnimationRunning = false;
        this.reloadAnimationRunning = false;
        this.howLongShouldShootingLast = 300; //ms how long is animation
        this.howLongShouldReloadingLast = 650; //ms how long is animation
        this.shootInterval = 1000;  //shooting cooldown
        this.shootTimer = 0;
        this.reloadInterval = 1000;  //shooting cooldown
        this.reloadTimer = 0;
        this.replenishThisValueOfAmmo = 2;
        this.projectileX = 200;
        this.projectileSpeed = 9;
        this.bulletActive = false;
        this.maxAmmo = 10;
        this.gunHeight = this.y + 175 + this.groundMargin;

        this.walkingSpeed = 2.5;
        
        this.flipImage = false;
        this.bulletFlipState = false;

        this.hitbox = {
            x: this.x + 100,
            y: this.y + this.groundMargin + 115,
            w: this.spriteWidth/2 - 18,
            h: this.spriteHeight + 14
        }

        this.hurt = false;
        this.health = 100;
        this.invinsibilityFramesMS = 250;
        this.dead = false;
    }
    update(dt){
        this.hitbox = {
            x: this.x + 100,
            y: this.y + this.groundMargin + 115,
            w: this.spriteWidth/2 - 18,
            h: this.spriteHeight + 14
        }
        
        if(this.abortPlayer === true){
            this.frameX = this.maxFrameX - 1;
            return;
        }

        this.#increaseFrames(dt);

        if(this.health < 0){
            this.health = 0;
        }        
        if(this.ammunition > this.maxAmmo){
            this.ammunition = this.maxAmmo;
        }

        if(this.hitbox.x < 0){
            this.x = -100;
        }
        if(this.hitbox.y < 0){
            this.y = -this.groundMargin - 115;
        }
        if((this.hitbox.x) + (this.hitbox.w) > this.game.canvasWidth){
            this.x = this.game.canvasWidth - this.spriteWidth/2 - 100 + 18;
        }
        if(this.hitbox.y + this.hitbox.h > this.game.canvasHeight){
            this.y = this.game.canvasHeight - 115 - 14 - this.spriteHeight - this.groundMargin;
        }

        if(this.hurt === true){
            this.currentImage = document.getElementById("hurtpng");
            this.maxFrameX = 3;
            
            this.frameAccelerator = 1;
            return;
        }else{
            this.frameAccelerator = 1;
        }

        if(this.health <= 0){
            if(this.dead === false){
                //here make 1 time use property changes if died
                this.dead = true;
                this.currentImage = document.getElementById("deadpng");
                this.frameX = 0;
                this.maxFrameX = 5;
                this.frameAccelerator = 0.5;
            }
        }
        
        this.#runBulletOperations();

        if(this.dead){
            this.currentImage = document.getElementById("deadpng");
            if(this.frameX >= this.maxFrameX){
                this.abortPlayer = true;
            }
            return;
        }
        
        if((this.keysPressed.includes("ArrowLeft") ||
            this.keysPressed.includes("a") ||
            this.keysPressed.includes("A")) &&
            !this.reloadAnimationRunning &&
            !this.shootingAnimationRunning){
                this.x -= this.walkingSpeed;
                this.currentImage = document.getElementById("walking");
                this.flipImage = true;
                this.maxFrameX = 11;
                this.#playRandomAudio(this.audio.walking);
        }
        if((this.keysPressed.includes("ArrowRight") ||
            this.keysPressed.includes("d") ||
            this.keysPressed.includes("D")) &&
            !this.reloadAnimationRunning &&
            !this.shootingAnimationRunning){
                this.x += this.walkingSpeed;
                this.currentImage = document.getElementById("walking");
                this.flipImage = false;
                this.maxFrameX = 11;
                this.#playRandomAudio(this.audio.walking);
        }
        if((this.keysPressed.includes("ArrowUp") ||
            this.keysPressed.includes("w") ||
            this.keysPressed.includes("W")) &&
            !this.reloadAnimationRunning &&
            !this.shootingAnimationRunning){
                this.y -= this.walkingSpeed;
                this.currentImage = document.getElementById("walking");
                this.maxFrameX = 11;
                this.#playRandomAudio(this.audio.walking);
        }
        if((this.keysPressed.includes("ArrowDown") ||
            this.keysPressed.includes("s") ||
            this.keysPressed.includes("S")) &&
            !this.reloadAnimationRunning &&
            !this.shootingAnimationRunning){
                this.y += this.walkingSpeed;
                this.currentImage = document.getElementById("walking");
                this.maxFrameX = 11;
                this.#playRandomAudio(this.audio.walking);
        }
        if(!this.keysPressed.includes("ArrowLeft") &&
           !this.keysPressed.includes("ArrowRight") &&
           !this.keysPressed.includes("ArrowUp") &&
           !this.keysPressed.includes("ArrowDown") &&
           !this.keysPressed.includes("w") &&
           !this.keysPressed.includes("W") &&
           !this.keysPressed.includes("s") &&
           !this.keysPressed.includes("S") &&
           !this.keysPressed.includes("a") &&
           !this.keysPressed.includes("A") &&
           !this.keysPressed.includes("d") &&
           !this.keysPressed.includes("D")){
                this.currentImage = document.getElementById("idle");
                this.maxFrameX = 5;
        }
        if(this.keysPressed.includes(" ") && 
            this.canShoot === true &&
            !this.reloadAnimationRunning){
                this.frameX = 0;
                this.maxFrameX = 2;
                this.currentImage = document.getElementById("aimedshotpng");
                this.ammunition--;
                this.canShoot = false;
                this.shootingAnimationRunning = true;
                this.#playRandomAudio(this.audio.shooting.shoot)
                setTimeout(() => {
                    this.shootingAnimationRunning = false;
                    this.frameAccelerator = 1;
                }, this.howLongShouldShootingLast);
        }

        if(this.shootingAnimationRunning){
            this.currentImage = document.getElementById("aimedshotpng");
            this.canShoot = false;
            this.maxFrameX = 3;
            this.bulletActive = true;
            this.frameAccelerator = 0.75;
        }
        if(this.ammunition <= 0){
            this.canShoot = false;
        } 
        if(this.canShoot === false &&
        !this.shootingAnimationRunning){
            if(this.shootTimer >= this.shootInterval){
                this.shootTimer = 0;
                if(this.ammunition > 0){
                    this.canShoot = true;
                }
            }else{
                this.shootTimer += dt;
            }
        }
        if(this.keysPressed.includes("r") &&
            this.canReload === true &&
            !this.shootingAnimationRunning){
                this.reloadAnimationRunning = true;
                this.canReload = false;
                setTimeout(() => {
                    this.#playRandomAudio(this.audio.reloading);
                }, 30)
                setTimeout(() => {
                    this.reloadAnimationRunning = false;
                    this.ammunition += this.replenishThisValueOfAmmo;
                    this.frameAccelerator = 1;
                }, this.howLongShouldReloadingLast);
        }
        if(this.reloadAnimationRunning === true){
            this.currentImage = document.getElementById("reloadingpng");
            this.maxFrameX = 11;
            this.frameAccelerator = 0.8;
        }
        if(this.canReload === false &&
            !this.reloadAnimationRunning){
            if(this.reloadTimer >= this.reloadInterval){
                this.reloadTimer = 0;
                if(this.ammunition < this.maxAmmo){
                    this.canReload = true;
                }
            }else{
                this.reloadTimer += dt;
            }
        }

        if(this.canShoot === false &&
            this.ammunition <= 0 &&
            this.keysPressed.includes(" ")
        ){
            this.#playAudio(this.audio.shooting.blank);
        }
    }
    draw(ctx){
        ctx.fillStyle = "yellow";

        if(this.bulletActive &&
            this.abortPlayer === false
        ){
            if(this.bulletFlipState === true){
                ctx.drawImage(
                    document.getElementById("bulletL"),
                    0, 
                    0, 
                    977,
                    495,
                    this.projectileX,
                    this.gunHeight,
                    20,
                    10
                );
            }else if(this.bulletFlipState === false){
                ctx.drawImage(
                    document.getElementById("bulletR"),
                    0, 
                    0, 
                    977,
                    495,
                    this.projectileX,
                    this.gunHeight,
                    20,
                    10
                );
            }
        }

        if(this.flipImage === true){
            ctx.save();
            ctx.translate(this.game.canvasWidth, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(
                        this.currentImage,
                        this.frameX * this.spriteWidth,
                        this.frameY * this.spriteHeight, 
                        this.spriteWidth,
                        this.spriteHeight,
                        this.game.canvasWidth - this.x - this.spriteWidth*2,
                        this.y + this.groundMargin,
                        this.spriteWidth*2,
                        this.spriteHeight*2
            );
            ctx.restore();
        }else{
            ctx.drawImage(
                        this.currentImage,
                        this.frameX * this.spriteWidth,
                        this.frameY * this.spriteHeight, 
                        this.spriteWidth,
                        this.spriteHeight,
                        this.x, 
                        this.y + this.groundMargin,
                        this.spriteWidth*2,
                        this.spriteHeight*2
            );
        }

        if(this.abortPlayer === true){
            return;
        }

        if(this.game.debugMode === true){
            ctx.strokeRect(this.hitbox.x, this.hitbox.y, this.hitbox.w, this.hitbox.h);
            
            ctx.strokeRect(this.hitbox.x, this.gunHeight, 1000, 1); //line
            ctx.save();
            ctx.strokeStyle = "grey";
            ctx.strokeRect(this.hitbox.x, this.gunHeight, -1000, 1);
            ctx.restore();
        }
    }

    #increaseFrames(dt){
        if(this.frameTimer < this.frameInterval){
            this.frameTimer += (dt * this.frameAccelerator);
        }else{
            this.frameX += 1;
            if(this.frameX > this.maxFrameX){
                this.frameX = 0;
            }
            this.frameTimer = 0;
        }
    }
    #runBulletOperations(){
        if(this.bulletActive === false){
            this.bulletFlipState = this.flipImage;
            this.gunHeight = this.y + 175 + this.groundMargin;
        }else if(this.bulletActive === true){
            if( this.projectileX + 20 < 0 ||
                this.projectileX > this.game.canvasWidth){
                    this.bulletActive = false;
            }
        }
        if(this.bulletFlipState === true){
            if(this.bulletActive === true){
                this.projectileX -= this.projectileSpeed;
            }else{
                this.projectileX = this.hitbox.x + 20 + 20;
            }
        }else if(this.bulletFlipState === false){
            if(this.bulletActive === true){
                this.projectileX += this.projectileSpeed;
            }else{
                this.projectileX = this.hitbox.x + this.spriteWidth / 2 - 20 - 20;
            }
        }
    }
    #playAudio(audio){
        this.game.playAudio(audio);
    }
    #getRandomObjectValue(object){
        return this.game.getRandomObjectValue(object);
    }
    #playRandomAudio(audio){
        this.game.playRandomAudio(audio);
    }
    #playRandomSequence(audioObjs){
        this.game.playRandomSequence(audioObjs);
    }
}