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

export class LoadAudio{
    constructor(){
        this.player = {
            walking: {},
            dying: {},
            shooting: {
                blank: new CreateAudio('audio/empty-gun-shot.mp3', 1, false)
            },
            reloading: {
                id1: new CreateAudio('audio/caulking-gun-back.mp3', 1, false)
            }
        };
        this.enemies = {
            walking: {},
            dying: {},
            attacking: {}
        };
        this.miscellaneous = {

        };
    }
}

class CreateAudio{
    constructor(path, length, loop){
        this.a =  new Audio(path);  //audio file
        this.l =  loop; //loop or not
        this.lengthS = length;
        this.lengthMS = this.lengthS * 1000;
        this.playing =  false;
        this.a.loop = this.l;
    }
}