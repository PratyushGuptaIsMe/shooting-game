export class Background{
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
        
    }   
}