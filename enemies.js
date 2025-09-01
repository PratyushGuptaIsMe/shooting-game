class Enemies{
    constructor(game){
        this.game = game;
        this.markedForDeletion = false;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.game.fps * 2;
        this.frameX = 0;
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
    }
    update(dt){
        this.hitbox = {
            x: this.x + 70,
            y: this.y + 35,
            w: this.spriteWidth * 2 - 150,
            h: this.spriteHeight * 2 - 35
        }
    
        if(this.frameTimer < this.frameInterval){
            this.frameTimer += dt;
        }else{
            this.frameX += 1;
            this.movementRand = Math.random();

            if(this.frameX > this.maxFrameX){
                this.frameX = 0;
            }
            this.frameTimer = 0;
        }

        if(this.attackAnimationRunning === false){  
            if(this.movementRand <= 0.10){
                this.x-= this.walkLength;
            }else if(this.movementRand <= 0.20 &&
                this.movementRand > 0.10
            ){
                this.x+= this.walkLength;
            }else if(this.movementRand <= 0.30 &&
                        this.movementRand > 0.20
            ){
                this.y+= this.walkLength;
            }else if(this.movementRand <= 0.40 &&
                        this.movementRand > 0.30
            ){
                this.y-= this.walkLength;
            }else{
                this.x = this.x;
                this.y = this.y;
            }
        }

        if(this.attackAnimationRunning === true &&
            this.frameX === this.maxFrameX
        ){
            this.game.hurtPlayer(this.attackDmg);
        }

        //boundary checks. idk if it works though. Might be wrong.
        if(this.hitbox.x < 0){
            this.x = -70;
        }
        if(this.hitbox.y < 0){
            this.y = -35;
        }
        if((this.hitbox.x) + (this.hitbox.w) > this.game.canvasWidth){
            this.x = this.game.canvasWidth - (this.spriteWidth * 2 - 150) - 70;
        }
        if(this.hitbox.y + this.hitbox.h > this.game.canvasHeight){
            this.y = this.game.canvasHeight - (this.spriteHeight * 2 - 35) - 35;
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
}

export class YellowSkeleton extends Enemies{
    constructor(game){
        super(game);
        this.image = document.getElementById("YellowSkeletonIdle");
        this.spriteWidth = 96;
        this.spriteHeight = 64;
        this.maxFrameX = 7;
        this.attackDmg = 2;
        this.scoreValue = 20;
    }
    update(dt){
        super.update(dt);
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

export class WhiteSkeleton extends Enemies{
    constructor(game){
        super(game);
        this.image = document.getElementById("WhiteSkeletonIdle");
        this.spriteWidth = 96;
        this.spriteHeight = 64;
        this.maxFrameX = 7;
        this.attackDmg = 1;
        this.scoreValue = 10;
    }
    update(dt){
        super.update(dt);
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