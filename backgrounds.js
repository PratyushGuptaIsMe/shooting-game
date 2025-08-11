export class Grass{
    constructor(game){
        this.game = game;
        this.grassImg = document.getElementById("grass");
        this.maxFrameX = 25;
        this.maxFrameY = 14;
        this.spriteWidth = 400/this.maxFrameX;
        this.spriteHeight = 224/this.maxFrameY;
        //dont need frameX or frameY since it is a background. Not a animation/spritesheet
        this.season = this.game.season;
    }
    update(dt){
        this.season = this.game.season;
    }
    draw(ctx){

        // AI ALERT

        /* if(this.season === "summer"){
            // Each tile is now 32x32 (scale 2)
            // Repeat the blob and mixed area pattern to fill the 500x500 canvas (16x16 grid)
            for(let row = 0; row < 16; row++){
                for(let col = 0; col < 16; col++){
                    let x = col * 32;
                    let y = row * 32;
                    // Blob pattern: alternate blobs every 4 tiles
                    if(row < 6 && col < 6){ // Top-left blob (light grass)
                        ctx.drawImage(this.grassImg, 3 * this.spriteWidth, 9 * this.spriteHeight, this.spriteWidth, this.spriteHeight, x, y, 32, 32);
                    } else if(row > 9 && col > 9){ // Bottom-right blob (yellowish grass)
                        ctx.drawImage(this.grassImg, 5 * this.spriteWidth, 12 * this.spriteHeight, this.spriteWidth, this.spriteHeight, x, y, 32, 32);
                    } else if(row > 4 && row < 11 && col > 4 && col < 11){ // Center blob (dark grass)
                        ctx.drawImage(this.grassImg, 7 * this.spriteWidth, 10 * this.spriteHeight, this.spriteWidth, this.spriteHeight, x, y, 32, 32);
                    } else if((row + col) % 3 === 0){ // Mixed area 1
                        ctx.drawImage(this.grassImg, 4 * this.spriteWidth, 10 * this.spriteHeight, this.spriteWidth, this.spriteHeight, x, y, 32, 32);
                    } else if((row + col) % 3 === 1){ // Mixed area 2
                        ctx.drawImage(this.grassImg, 6 * this.spriteWidth, 11 * this.spriteHeight, this.spriteWidth, this.spriteHeight, x, y, 32, 32);
                    } else { // Fallback to light grass
                        ctx.drawImage(this.grassImg, 4 * this.spriteWidth, 9 * this.spriteHeight, this.spriteWidth, this.spriteHeight, x, y, 32, 32);
                    }
                }
            }
        }else if(this.season === "autumn"){
            // Each tile is now 32x32 (scale 2)
            // Repeat the blob and mixed area pattern to fill the 500x500 canvas (16x16 grid)
            for(let row = 0; row < 16; row++){
                for(let col = 0; col < 16; col++){
                    let x = col * 32;
                    let y = row * 32;
                    // Blob pattern: alternate blobs every 4 tiles
                    if(row < 6 && col < 6){ // Top-left blob (orange grass)
                        ctx.drawImage(this.grassImg, 5 * this.spriteWidth, 8 * this.spriteHeight, this.spriteWidth, this.spriteHeight, x, y, 32, 32);
                    } else if(row > 9 && col > 9){ // Bottom-right blob (yellow grass)
                        ctx.drawImage(this.grassImg, 9 * this.spriteWidth, 6 * this.spriteHeight, this.spriteWidth, this.spriteHeight, x, y, 32, 32);
                    } else if(row > 4 && row < 11 && col > 4 && col < 11){ // Center blob (brown grass)
                        ctx.drawImage(this.grassImg, 7 * this.spriteWidth, 7 * this.spriteHeight, this.spriteWidth, this.spriteHeight, x, y, 32, 32);
                    } else if((row + col) % 3 === 0){ // Mixed area 1
                        ctx.drawImage(this.grassImg, 6 * this.spriteWidth, 7 * this.spriteHeight, this.spriteWidth, this.spriteHeight, x, y, 32, 32);
                    } else if((row + col) % 3 === 1){ // Mixed area 2
                        ctx.drawImage(this.grassImg, 8 * this.spriteWidth, 8 * this.spriteHeight, this.spriteWidth, this.spriteHeight, x, y, 32, 32);
                    } else { // Fallback to orange grass
                        ctx.drawImage(this.grassImg, 6 * this.spriteWidth, 8 * this.spriteHeight, this.spriteWidth, this.spriteHeight, x, y, 32, 32);
                    }
                }
            }
        } */


    }   
}