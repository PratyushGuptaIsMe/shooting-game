class Enemies{
    constructor(game){
        this.game = game;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.game.fps * 2;
        this.frameX = 0;
        this.maxFrameX = 7;
        this.frameAccelerator = 1;  //  *
        this.x = Math.random() * this.game.canvasWidth + 1;
        this.y = Math.random() * this.game.canvasHeight + 1;
        this.movementRand = Math.random();
        this.walkLength = 3; //px
        
        this.hitbox = {
            x: this.x + 70,
            y: this.y + 35,
            w: this.spriteWidth * 2 - 150,
            h: this.spriteHeight * 2 - 35
        }

        this.attackAnimationRunning = false;

        this.markedForDeletion = false;
        this.dead = false;
        this.deathFrameOffset = 2;

        this.audio = this.game.audio.enemies;
        this.audioCooldown = 0;
        this.audioPause = 3000;
        this.currentEnemySounds = 0;
        this.maxEnemySounds = 5;
    }
    update(dt){
        this.hitbox = {
            x: this.x + 70,
            y: this.y + 35,
            w: this.spriteWidth * 2 - 150,
            h: this.spriteHeight * 2 - 35
        }
    
        if(this.frameTimer < this.frameInterval){
            this.frameTimer += dt * this.frameAccelerator;
        }else{
            this.frameX += 1;
            if(this.frameX > this.maxFrameX){
                if(this.dead === false){
                    this.frameX = 0;
                }
            }
            this.frameTimer = 0;
            if(this.dead === false){
                this.movementRand = Math.random();
            }else{
                this.movementRand = 1;
            }
        }

        if(this.dead === true){
            this.image = this.deathAnimationSprites;
        }

        if(this.attackAnimationRunning === false){  
            if(this.movementRand <= 0.10){
                this.x -= this.walkLength;
            }else if(this.movementRand <= 0.20 &&
                this.movementRand > 0.10
            ){
                this.x += this.walkLength;
            }else if(this.movementRand <= 0.30 &&
                        this.movementRand > 0.20
            ){
                this.y += this.walkLength;
            }else if(this.movementRand <= 0.40 &&
                        this.movementRand > 0.30
            ){
                this.y -= this.walkLength;
            }else{
                this.x = this.x;
                this.y = this.y;
            }
        }

        if(this.attackAnimationRunning === false){
            if(this.movementRand <= 0.40){
                if(this.movementRand > 0.20){
                    if(this.audioCooldown <= 0){
                        this.game.currentEnemySounds += 1;
                        this.#playAudio(this.audio.rattle.id1);
                        this.audioCooldown = this.audioPause;
                    }else{
                        this.audioCooldown = this.audioCooldown - dt;
                        setTimeout(() => {
                            this.game.currentEnemySounds -= 1;
                        }, 500);
                    }
                }else if(this.movementRand < 0.20){
                    if(this.audioCooldown <= 0){
                        this.game.currentEnemySounds += 1;
                        this.#playRandomSequence(this.audio.rattle.id2);
                        this.audioCooldown = this.audioPause + 1000;
                    }else{
                        this.audioCooldown = this.audioCooldown - dt;
                        setTimeout(() => {
                            this.game.currentEnemySounds -= 1;
                        }, 500);
                    }
                }
            }
        }

        if(this.attackAnimationRunning === true &&
            this.frameX === this.maxFrameX &&
            this.hitbox.x < this.game.Player.hitbox.x + this.game.Player.hitbox.w &&
            this.hitbox.x + this.hitbox.w > this.game.Player.hitbox.x &&
            this.hitbox.y < this.game.Player.hitbox.y + this.game.Player.hitbox.h &&
            this.hitbox.y + this.hitbox.h > this.game.Player.hitbox.y
        ){
            this.game.hurtPlayer(this.attackDmg);
            this.#playRandomAudio(this.audio.attacking);
        }

        if(this.hitbox.x < 0){
            this.x = -70;
        }
        if(this.hitbox.y < 0){
            this.y = -35;
        }
        if((this.hitbox.x) + (this.hitbox.w) > this.game.canvasWidth){
            this.x = this.game.canvasWidth - this.hitbox.w - 70;        }
        if(this.hitbox.y + this.hitbox.h > this.game.canvasHeight){
            this.y = this.game.canvasHeight - this.hitbox.h - 35;        
        }
    }
    updateDeadSkeleton(){
        if(this.frameX + this.deathFrameOffset > this.maxFrameX){
            this.game.incrementScore(this.scoreValue);
            this.markedForDeletion = true;
        }
    }
    draw(ctx){
        ctx.drawImage(this.image, 
                        this.frameX * this.spriteWidth,
                        0,
                        this.spriteWidth, 
                        this.spriteHeight, 
                        this.x, 
                        this.y, 
                        this.spriteWidth *2,
                        this.spriteHeight *2
                    )
        
        if(this.game.debugMode === true){
            ctx.strokeRect(this.hitbox.x, this.hitbox.y, this.hitbox.w, this.hitbox.h);
        }
    }
    #playAudio(audio){
        if(this.currentEnemySounds >= this.maxEnemySounds){
            return;
        }
        this.game.playAudio(audio);
    }
    #getRandomObjectValue(object){
        return this.game.getRandomObjectValue(object);
    }
    #playRandomAudio(audio){
        if(this.currentEnemySounds >= this.maxEnemySounds){
            return;
        }
        this.game.playRandomAudio(audio);
    }
    #playRandomSequence(audioObjs){
        if(this.currentEnemySounds >= this.maxEnemySounds){
            return;
        }
        this.game.playRandomSequence(audioObjs);
    }
}

export class WhiteSkeleton extends Enemies{
    constructor(game){
        super(game);
        this.image = document.getElementById("WhiteSkeletonIdle");
        this.spriteWidth = 96;
        this.spriteHeight = 64;
        this.attackDmg = 6;
        this.scoreValue = 10;
        
        this.deathAnimationSpriteID = "WhiteSkeletonDie";
        this.deathAnimationSprites = document.getElementById(this.deathAnimationSpriteID);
    }
    update(dt){
        super.update(dt);
        if(this.dead === false){
            this.updateSkeleton();
        }else{
            super.updateDeadSkeleton();
        }
    }
    updateSkeleton(){
        if(this.movementRand <= 0.50 &&
            !this.attackAnimationRunning
        ){
            this.image = document.getElementById("WhiteSkeletonWalk");
        }else if(this.movementRand > 0.50 &&
                !this.attackAnimationRunning
        ){
            this.image = document.getElementById("WhiteSkeletonIdle");
        }

        if(this.attackAnimationRunning === true){
            this.image = document.getElementById("WhiteSkeletonAttack");
        }
    }
    draw(ctx){
        super.draw(ctx);
    }
}

export class YellowSkeleton extends Enemies{
    constructor(game){
        super(game);
        this.image = document.getElementById("YellowSkeletonIdle");
        this.spriteWidth = 96;
        this.spriteHeight = 64;
        this.attackDmg = 10;
        this.scoreValue = 20;

        this.deathAnimationSpriteID = "YellowSkeletonDie";
        this.deathAnimationSprites = document.getElementById(this.deathAnimationSpriteID);
    }
    update(dt){
        super.update(dt);
        if(this.dead === false){
            this.updateSkeleton();
        }else{
            super.updateDeadSkeleton();
        }
    }
    updateSkeleton(){
        if(this.movementRand <= 0.50 && 
            !this.attackAnimationRunning
        ){
            this.image = document.getElementById("YellowSkeletonWalk");
        }else if(this.movementRand > 0.50 &&
            !this.attackAnimationRunning
        ){
            this.image = document.getElementById("YellowSkeletonIdle");
        }

        if(this.attackAnimationRunning === true){
            this.image = document.getElementById("YellowSkeletonAttack");
        }
    }
    draw(ctx){
        super.draw(ctx);
    }
}