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
                blank: new CreateAudio('audio/p-s/empty-gun-shot.mp3', false),
                shoot: {
                    id1: new CreateAudio('audio/p-s/gunshot-loud.wav', false),
                    id2: new CreateAudio('audio/p-s/gunshot1.mp3', false),
                    id3: new CreateAudio('audio/p-s/gunshot2.wav', false)
                }
            },
            reloading: {
                id1: new CreateAudio('audio/p-r/caulking-gun-back.mp3', false),
                id2: new CreateAudio('audio/p-r/fx-gun-reload.wav', false)
            }
        };
        this.enemies = {
            walking: {},
            dying: {},
            attacking: {}
        };
        this.miscellaneous = {
            background_music: new CreateAudio('', true)
        };
    }
}

class CreateAudio{
    constructor(path, loop){
        this.a =  new Audio(path);  //audio file
        this.l =  loop; //loop or not
        this.playing =  false;
        this.a.loop = this.l;
    }
}