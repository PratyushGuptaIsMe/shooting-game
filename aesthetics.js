export class Background{
    constructor(game){
        this.ctx;
        this.game = game;
        this.grassImg = document.getElementById("grass");
        this.numItemsX = 25;
        this.numItemsY = 14;
        this.spriteWidth = 400/this.numItemsX;
        this.spriteHeight = 224/this.numItemsY;
        //dont need frameX or frameY since it is a background. Not a animation/spritesheet

        this.ZOOM = {
            grass: 2
        }
        this.GRASSBLOCKS = {
            id1: {
                indexX: 0,
                indexY: 0
            },
            id2: {
                indexX: 2,
                indexY: 6 
            },
            id3: {
                indexX: 2,
                indexY: 4 
            },
            id4: {
                indexX: 8,
                indexY: 2 
            }
        }

        this.ALLSEASONS = this.game.ALLSEASONS;
        this.season = this.game.season;
    }
    update(){

    }
    #drawGrassTile(x, y, blockId){
        this.ctx.drawImage(this.grassImg,
            blockId.indexX * this.spriteWidth,
            blockId.indexY * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            x,
            y, 
            this.spriteWidth * this.ZOOM.grass,
            this.spriteHeight * this.ZOOM.grass
        )
    }
    draw(ctx){
        this.ctx = ctx;
        this.#drawGrassTile(this.spriteWidth * this.ZOOM.grass, this.spriteHeight * this.ZOOM.grass, this.GRASSBLOCKS.id1);
        this.#drawGrassTile(this.spriteWidth * this.ZOOM.grass, this.spriteHeight * this.ZOOM.grass, this.GRASSBLOCKS.id4);

    }   
}

export class LoadAudio{
    constructor(){
        this.player = {
            walking: {
                Cid1: new CreateAudio('audio/p-w/step_cloth1.ogg', false),
                Cid2: new CreateAudio('audio/p-w/step_cloth2.ogg', false),
                Cid3: new CreateAudio('audio/p-w/step_cloth3.ogg', false),
                Cid4: new CreateAudio('audio/p-w/step_cloth4.ogg', false),
                Lthid1: new CreateAudio('audio/p-w/step_lth1.ogg', false),
                Lthid2: new CreateAudio('audio/p-w/step_lth2.ogg', false),
                Lthid3: new CreateAudio('audio/p-w/step_lth3.ogg', false),
                Lthid4: new CreateAudio('audio/p-w/step_lth4.ogg', false),
            },
            dying: {},
            shooting: {
                blank: new CreateAudio('audio/p-s/empty-gun-shot.mp3', false),
                shoot: {
                    id1: new CreateAudio('audio/p-s/gunshot-loud.mp3', false),
                    id2: new CreateAudio('audio/p-s/gunshot1.mp3', false),
                    id3: new CreateAudio('audio/p-s/gunshot2.mp3', false),
                    id4: new CreateAudio('audio/p-s/loud-gun.wav', false)
                }
            },
            reloading: {
                id1: new CreateAudio('audio/p-r/caulking-gun-back.mp3', false),
                id2: new CreateAudio('audio/p-r/fx-gun-reload.wav', false)
            }
        };
        this.enemies = {
            rattle: {
                id1: new CreateAudio('audio/s-r/skeleton_walk.mp3', false),
                id2: {
                    s0: new CreateAudio('audio/s-r/0.ogg', false),
                    s1: new CreateAudio('audio/s-r/1.ogg', false),
                    s2: new CreateAudio('audio/s-r/2.ogg', false),
                    s3: new CreateAudio('audio/s-r/3.ogg', false),
                    s4: new CreateAudio('audio/s-r/4.ogg', false),
                    s5: new CreateAudio('audio/s-r/5.ogg', false),
                    s6: new CreateAudio('audio/s-r/6.ogg', false),
                    s7: new CreateAudio('audio/s-r/7.ogg', false),
                    s8: new CreateAudio('audio/s-r/8.ogg', false),
                    s9: new CreateAudio('audio/s-r/9.ogg', false),
                }
            },
            dying: {
                //same as rattle rn
                id1: new CreateAudio('audio/s-r/skeleton_walk.mp3', false),
                id2: {
                    s0: new CreateAudio('audio/s-r/0.ogg', false),
                    s1: new CreateAudio('audio/s-r/1.ogg', false),
                    s2: new CreateAudio('audio/s-r/2.ogg', false),
                    s3: new CreateAudio('audio/s-r/3.ogg', false),
                    s4: new CreateAudio('audio/s-r/4.ogg', false),
                    s5: new CreateAudio('audio/s-r/5.ogg', false),
                    s6: new CreateAudio('audio/s-r/6.ogg', false),
                    s7: new CreateAudio('audio/s-r/7.ogg', false),
                    s8: new CreateAudio('audio/s-r/8.ogg', false),
                    s9: new CreateAudio('audio/s-r/9.ogg', false),
                }
            },
            attacking: {
                id1: new CreateAudio('audio/s-a/sword_clash.1.ogg', false),
                id2: new CreateAudio('audio/s-a/sword_clash.2.ogg', false),
                id3: new CreateAudio('audio/s-a/sword_clash.3.ogg', false),
                id4: new CreateAudio('audio/s-a/sword_clash.4.ogg', false),
                id5: new CreateAudio('audio/s-a/sword_clash.5.ogg', false),
                id6: new CreateAudio('audio/s-a/sword_clash.6.ogg', false),
                id7: new CreateAudio('audio/s-a/sword_clash.7.ogg', false),
                id8: new CreateAudio('audio/s-a/sword_clash.8.ogg', false),
                id9: new CreateAudio('audio/s-a/sword_clash.9.ogg', false),
                id10: new CreateAudio('audio/s-a/sword_clash.10.ogg', false),
                id11: new CreateAudio('audio/s-a/sword.1.ogg', false),
                id12: new CreateAudio('audio/s-a/sword.2.ogg', false),
                id13: new CreateAudio('audio/s-a/sword.3.ogg', false),
                id14: new CreateAudio('audio/s-a/sword.4.ogg', false),
                id15: new CreateAudio('audio/s-a/sword.5.ogg', false),
                id16: new CreateAudio('audio/s-a/sword.6.ogg', false),
                id17: new CreateAudio('audio/s-a/sword.7.ogg', false),
                id18: new CreateAudio('audio/s-a/sword.8.ogg', false),
                id19: new CreateAudio('audio/s-a/sword.9.ogg', false),
                id20: new CreateAudio('audio/s-a/sword.10.ogg', false),
            }
        };
        this.miscellaneous = {
            background_music: new CreateAudio('audio/music/Pirates-orchestra/Pirate-orchestra-(opengameart).mp3', true)
        };
        this.#setAudioPropertyValues();
    }
    #setAudioPropertyValues(){
        Object.keys(this.player.walking).forEach((key) => {
            this.player.walking[key].a.playbackRate = 0.45;
            this.player.walking[key].a.volume = 0.95;
        });
        Object.keys(this.player.reloading).forEach((key) => {
            this.player.reloading[key].a.volume = 0.5;
        })
        Object.keys(this.player.shooting.shoot).forEach((key) => {
            this.player.shooting.shoot[key].a.volume = 0.4;
        })
        Object.values(this.enemies.rattle.id2).forEach((audio) => {
            audio.a.volume = 0.2;
            audio.a.playbackRate = 0.55;
        })
        Object.values(this.enemies.attacking).forEach((audio) => {
            audio.a.volume = 0.5;
        })
        this.miscellaneous.background_music.a.volume = 0.2;
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

class Particles{
    constructor(){

    }
    draw(ctx){

    }
}