export class Background{
    constructor(game){
        this.game = game;
        this.grassImg = document.getElementById("grass");
        this.numItemsX = 25;
        this.numItemsY = 14;
        this.spriteWidth = 400/this.numItemsX;
        this.spriteHeight = 224/this.numItemsY;
        //dont need frameX or frameY since it is a background. Not a animation/spritesheet
        this.season = this.game.season;
    }
    update(dt){
        this.season = this.game.season;
    }
    draw(ctx){
        
    }   
}