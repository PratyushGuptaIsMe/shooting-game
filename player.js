export class Player{
    constructor(game){
        this.game = game;
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
        this.keysPressed = this.game.keysArray;
        this.groundMargin = this.game.groundArea;
        
        this.ammunition = 10;
        this.canShoot = true;
        this.canReload = true;
        this.shootingAnimationRunning = false;
        this.reloadAnimationRunning = false;
        this.howLongShouldShootingLast = 10; //ms how long is animation
        this.howLongShouldReloadingLast = 1000; //ms how long is animation
        this.shootInterval = 1000;  //shooting cooldown
        this.shootTimer = 0;
        this.reloadInterval = 1000;  //shooting cooldown
        this.reloadTimer = 0;
        this.replenishThisValueOfAmmo = 2;
        this.projectileX = 200;
        this.projectileSpeed = 8.2;
        this.bulletActive = false;
        this.howLongBulletActive = 2000;

        this.walkingSpeed = 3;
        
        this.gunHeight = this.y + 175 + this.groundMargin;

        this.flipImage = false;
        this.bulletFlipState = false;

        this.hitbox = {
            x: this.x + 100,
            y: this.y + this.groundMargin + 115,
            w: this.spriteWidth/2 - 18,
            h: this.spriteHeight + 14
        }
        this.health = 100;
        this.dead = false;
    }
    update(dt){
        this.gunHeight = this.y + 175 + this.groundMargin;
        this.hitbox = {
            x: this.x + 100,
            y: this.y + this.groundMargin + 115,
            w: this.spriteWidth/2 - 18,
            h: this.spriteHeight + 14
        }

        if(this.ammunition > 10){
            this.ammunition = 10;
        }
        
        if(this.keysPressed.includes("ArrowLeft") &&
         !this.reloadAnimationRunning &&
         !this.shootingAnimationRunning){
            this.x -= this.walkingSpeed;
            this.currentImage = document.getElementById("walking");
            this.flipImage = true;
            this.maxFrameX = 11;
        }
        if(this.keysPressed.includes("ArrowRight") &&
            !this.reloadAnimationRunning &&
            !this.shootingAnimationRunning){
            this.x += this.walkingSpeed;
            this.currentImage = document.getElementById("walking");
            this.flipImage = false;
            this.maxFrameX = 11;
        }
        if(this.keysPressed.includes("ArrowUp") &&
            !this.reloadAnimationRunning &&
            !this.shootingAnimationRunning){
            this.y -= this.walkingSpeed;
            this.currentImage = document.getElementById("walking");
            this.maxFrameX = 11;
        }
        if(this.keysPressed.includes("ArrowDown") &&
            !this.reloadAnimationRunning &&
            !this.shootingAnimationRunning){
            this.y += this.walkingSpeed;
            this.currentImage = document.getElementById("walking");
        }
        if(!this.keysPressed.includes("ArrowLeft") &&
           !this.keysPressed.includes("ArrowRight") &&
           !this.keysPressed.includes("ArrowUp") &&
           !this.keysPressed.includes("ArrowDown")){

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
                //decrease ammo
                this.canShoot = false;
                //reset canShoot
                this.shootingAnimationRunning = true;
                setTimeout(() => {this.shootingAnimationRunning = false}, this.howLongShouldShootingLast);
        }

        if(this.shootingAnimationRunning){
            this.currentImage = document.getElementById("aimedshotpng");
            this.canShoot = false;
            this.maxFrameX = 3;
            this.bulletActive = true;
            setTimeout(() => {this.bulletActive = false}, this.howLongBulletActive);

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
                this.reloadAnimationRunning = false;
                this.ammunition += this.replenishThisValueOfAmmo;
            }, this.howLongShouldReloadingLast);
        }
        if(this.reloadAnimationRunning === true){
            this.currentImage = document.getElementById("reloadingpng");
            this.maxFrameX = 11;
        }
        if(this.canReload === false &&
            !this.reloadAnimationRunning){
            if(this.reloadTimer >= this.reloadInterval){
                this.reloadTimer = 0;
                if(this.ammunition < 10){
                    this.canReload = true;
                }
            }else{
                this.reloadTimer += dt;
            }
        }


        if(this.frameTimer < this.frameInterval){
            this.frameTimer += dt;
        }else{
            
            this.frameX += 1;
            if(this.frameX > this.maxFrameX){
                this.frameX = 0;
            }
            this.frameTimer = 0;
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


        if(this.bulletActive === false){
            this.bulletFlipState = this.flipImage;
        }

        if(this.health <= 0){
            if(this.dead === false){
                this.dead = true;

                //here make 1 time use property changes if die
                document.getElementById("textCanvas").classList.add("displaynone");
                document.getElementById("textCanvas").classList.remove("displayblock");
            }
        }
    }
    draw(ctx){
        ctx.fillStyle = "yellow";

        if(this.flipImage === true){
            ctx.save();
            ctx.translate(this.game.canvasWidth, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(this.currentImage,
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
            ctx.drawImage(this.currentImage,
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

        if(this.game.debugMode === true){
            ctx.strokeRect(this.hitbox.x, this.hitbox.y, this.hitbox.w, this.hitbox.h);
            
            ctx.strokeRect(this.hitbox.x, this.gunHeight, 1000, 1); //line
            ctx.save();
            ctx.strokeStyle = "grey";
            ctx.strokeRect(this.hitbox.x, this.gunHeight, -1000, 1);
            ctx.restore();
        }

        if(this.bulletFlipState === true){
            if(this.bulletActive){
                ctx.fillRect(this.game.canvasWidth - this.x - this.projectileX, this.gunHeight, 25, 10);
                this.projectileX -= this.projectileSpeed;
            }else{
                this.projectileX = 200;
            }
        }else{
            if(this.bulletActive){
                ctx.fillRect(this.x + this.projectileX, this.gunHeight, 25, 10);
                this.projectileX += this.projectileSpeed;
            }else{
                this.projectileX = 200;
            }
        };
    }
}