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

        this.scaleFactor = 15;
        this.ZOOM = {
            grass: this.game.canvasWidth / 16 / this.scaleFactor
        }
        this.MORNINGGRASSBLOCKS = {
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
        this.NIGHTGRASSBLOCKS = {
            id1: {
                indexX: 0,
                indexY: 1
            },
            id2: {
                indexX: 2,
                indexY: 7
            },
            id3: {
                indexX: 2,
                indexY: 5 
            },
            id4: {
                indexX: 8,
                indexY: 3 
            }
        }
        this.SUMMERGRASSBLOCKS = {
            id1: {
                indexX: 1,
                indexY: 0
            },
            id2: {
                indexX: 3,
                indexY: 6 
            },
            id3: {
                indexX: 3,
                indexY: 4 
            },
            id4: {
                indexX: 9,
                indexY: 2 
            }
        }
        this.PLANTS = {
            blueFlower: {
                indexX: 0,
                indexY: 12
            },
            darkBlueFlower: {
                indexX: 1,
                indexY: 12
            },
            redFlower: {
                indexX: 2,
                indexY: 12
            },
            yellowFlower: {
                indexX: 3,
                indexY: 12
            },
            redMushrooms: {
                indexX: 12,
                indexY: 13
            },
            bush1: {
                indexX: 10,
                indexY: 11
            },
            bush2: {
                indexX: 12,
                indexY: 11
            },
            bush3: {
                indexX: 13,
                indexY: 11
            },
            fern: {
                indexX: 20,
                indexY: 11
            }
        }
        this.OBJECTS = {
            gravestone: {
                indexX: 10,
                indexY: 13
            },
            sign: {
                indexX: 24,
                indexY: 13
            }
        }

        this.ALLSEASONS = this.game.ALLSEASONS;
        this.season = this.game.season;
        this.currentBlockSet = this.MORNINGGRASSBLOCKS;
        this.indexX = 0;    //between 0-this.scaleFactor
        this.indexY = 0;    //between 0-this.scaleFactor
        this.tempX = this.spriteWidth * this.ZOOM.grass * this.indexX;
        this.tempY = this.spriteHeight * this.ZOOM.grass * this.indexY;
    }
    update(){
        this.season = this.game.season;
        switch(this.season){
            case this.ALLSEASONS.MORNING:
                this.currentBlockSet = this.MORNINGGRASSBLOCKS;
                break;
        
            case this.ALLSEASONS.NIGHT:
                this.currentBlockSet = this.NIGHTGRASSBLOCKS;
                break;

            case this.ALLSEASONS.SUMMER:
                this.currentBlockSet = this.SUMMERGRASSBLOCKS;
                break;

            default:
                throw new Error("Undefined season");
                
        }
    }
    #drawBlock(blockId){
        this.ctx.drawImage(this.grassImg,
            blockId.indexX * this.spriteWidth,
            blockId.indexY * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            this.tempX,
            this.tempY, 
            this.spriteWidth * this.ZOOM.grass,
            this.spriteHeight * this.ZOOM.grass
        )
    }
    #recalcIndex(incrementX, incrementY){
        this.indexX += incrementX;
        this.indexY += incrementY;
        if(this.indexX >= this.scaleFactor){
            this.indexX = this.scaleFactor - 1;
        }
        if(this.indexY >= this.scaleFactor){
            this.indexY = this.scaleFactor - 1;
        }
        this.tempX = this.spriteWidth * this.ZOOM.grass * this.indexX;
        this.tempY = this.spriteHeight * this.ZOOM.grass * this.indexY;
    }
    drawGrid(){
        this.ctx.save();
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 1;
        for (let x = 0; x <= this.scaleFactor; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.spriteWidth * this.ZOOM.grass, 0);
            this.ctx.lineTo(x * this.spriteWidth * this.ZOOM.grass, this.scaleFactor * this.spriteHeight * this.ZOOM.grass);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.scaleFactor; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.spriteHeight * this.ZOOM.grass);
            this.ctx.lineTo(this.scaleFactor * this.spriteWidth * this.ZOOM.grass, y * this.spriteHeight * this.ZOOM.grass);
            this.ctx.stroke();
        }
        this.ctx.restore();
    }
    #drawGridBased(){
        if(this.game.debugMode === true){
            this.drawGrid();
        }
    }
    #drawBackground(blockPalette) {
        let a = blockPalette.id1;
        let b = blockPalette.id2;
        let c = blockPalette.id3;
        let d = blockPalette.id4;
        const LAYOUT = [
            [d, d, d, d, d, a, a, a, a, a, a, a, a, a, d],
            [d, d, d, a, a, a, a, a, a, a, d, d, d, d, d],
            [d, d, a, a, a, a, a, a, a, d, d, d, d, d, d],
            [d, a, a, a, a, a, a, a, d, d, d, d, d, c, c],
            [a, a, a, a, a, a, a, d, d, d, d, d, d, c, c],
            [a, a, a, a, a, a, a, d, d, d, d, d, d, c, c],
            [a, a, a, a, a, d, d, d, d, d, c, c, c, c, c],
            [a, a, a, a, a, d, d, d, d, d, c, c, c, c, c],
            [a, a, a, a, a, d, d, d, d, c, c, c, b, c, b],
            [a, a, a, a, a, d, d, d, d, c, c, c, c, b, b],
            [a, a, a, a, a, d, d, d, c, c, c, b, c, b, b],
            [a, a, a, a, d, d, d, d, c, b, c, c, b, b, b],
            [a, a, d, d, d, d, b, d, c, c, c, b, b, b, b],
            [d, d, d, d, d, b, b, b, b, b, b, b, b, b, b],
            [d, d, d, d, b, c, b, b, b, b, b, b, b, b, b]
        ];

        for (let y = 0; y < this.scaleFactor; y++) {
            for (let x = 0; x < this.scaleFactor; x++) {
                const blockId = LAYOUT[y % LAYOUT.length][x % LAYOUT[0].length];
                this.tempX = x * this.spriteWidth * this.ZOOM.grass;
                this.tempY = y * this.spriteHeight * this.ZOOM.grass;
                this.#drawBlock(blockId);
            }
        }
    }



    draw(ctx){
        this.ctx = ctx;
        this.#drawBackground(this.currentBlockSet);
        this.#drawGridBased();
        this.#recalcIndex(-this.indexX, -this.indexY);
    }
}

export class LoadAudio{
    constructor(){
        this.allAudio = [];
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
            dying: {
                body_hitting_dirt: new CreateAudio('audio/misc/body-fall-hitting-dirt.mp3', false)
            },
            hurt: {
                id1: new CreateAudio('audio/p-h/Damage-grunt-1.wav', false),
                id2: new CreateAudio('audio/p-h/Damage-grunt-2.wav', false),
                id3: new CreateAudio('audio/p-h/Damage-grunt-3.wav', false),
                id4: new CreateAudio('audio/p-h/Damage-grunt-4.wav', false),
            },
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
            background_music: new CreateAudio('audio/misc/Pirates-orchestra/Pirate-orchestra-(opengameart).mp3', true),
            pvz_gameover_sound_effect: new CreateAudio('audio/misc/game-over-pvz.mp3', false)
        };
        this.#setAudioPropertyValues();
        this.#allAudioInArray();
        allAudio = this.allAudio;
    }
    preloadAudio(callback){
        let loadedCount = 0;
        const totalAudio = this.allAudio.length;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
        } catch (e) {}

        this.allAudio.forEach((audioEl, index) => {
            audioEl.preload = 'auto';
            audioEl.volume = 0.1;
            audioEl.muted = false;
            
            const isBackgroundMusic = audioEl.src && audioEl.src.includes('Pirate-orchestra');
            
            audioEl.addEventListener('canplaythrough', () => {
                loadedCount++;
                
                try {
                    audioEl.currentTime = 0;
                } catch (e) {}
                
                if(isBackgroundMusic) {
                    audioEl.addEventListener('loadeddata', () => {
                        try {
                            audioEl.currentTime = 0;
                            setTimeout(() => {
                                if(audioEl.duration > 10) {
                                    audioEl.currentTime = 5;
                                }
                            }, 100);
                            setTimeout(() => {
                                if(audioEl.duration > 20) {
                                    audioEl.currentTime = 10;
                                }
                            }, 200);
                            setTimeout(() => {
                                audioEl.currentTime = 0;
                            }, 300);
                        } catch (e) {}
                    }, { once: true });
                }
                
                if(loadedCount === totalAudio){
                    this.#unlockAudioContext();
                    callback();
                }
            }, { once: true });
            audioEl.addEventListener('error', (e) => {
                loadedCount++;
                if(loadedCount === totalAudio){
                    this.#unlockAudioContext();
                    callback();
                }
            }, { once: true });
            audioEl.load();
        });
    }

    #unlockAudioContext() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            
            audioContext.resume().then(() => {
                const buffer = audioContext.createBuffer(1, 1, 22050);
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.destination);
                source.start();
                
                window.gameAudioContext = audioContext;
            }).catch(e => {});
        } catch (e) {}
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
            audio.a.volume = 0.2;
        })
        Object.values(this.player.hurt).forEach((audio) => {
            audio.a.volume = 0.5;
        })
        this.miscellaneous.background_music.a.volume = 0.2;
        this.miscellaneous.pvz_gameover_sound_effect.a.volume = 0.2;
        this.miscellaneous.pvz_gameover_sound_effect.a.playbackRate = 0.9;

        try{
            const AUDIOCONTEXT = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AUDIOCONTEXT();

            const dirtAudio = this.player.dying.body_hitting_dirt.a;
            const source = audioContext.createMediaElementSource(dirtAudio);
            const gainNode = audioContext.createGain();

            gainNode.gain.value = 3.5;  //volume
            source.connect(gainNode).connect(audioContext.destination);
            
            dirtAudio.addEventListener('play', async () => {
                if(audioContext.state === 'suspended'){
                    await audioContext.resume();
                }
            });
        }catch(e){
            console.warn("Web Audio API gain boost failed:", e);
        }
        try {
            const AUDIOCONTEXT = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AUDIOCONTEXT();

            const lowFilter = audioContext.createBiquadFilter();
            lowFilter.type = "lowshelf";
            lowFilter.frequency.value = 200;
            lowFilter.gain.value = 1.5;
            const midFilter = audioContext.createBiquadFilter();
            midFilter.type = "peaking";
            midFilter.frequency.value = 1200;
            midFilter.Q.value = 1;
            midFilter.gain.value = -3;
            const highFilter = audioContext.createBiquadFilter();
            highFilter.type = "highshelf";
            highFilter.frequency.value = 500;
            highFilter.gain.value = -5;

            Object.values(this.player.hurt).forEach((audioObj) => {
                const audioEl = audioObj.a;
                const source = audioContext.createMediaElementSource(audioEl);

                source
                    .connect(lowFilter)
                    .connect(midFilter)
                    .connect(highFilter)
                    .connect(audioContext.destination);

                audioEl.addEventListener("play", async () => {
                    if(audioContext.state === "suspended"){
                        await audioContext.resume();
                    }
                });
            });

        }catch(e){
            console.warn("Web Audio API EQ setup failed:", e);
        }
    }
    #allAudioInArray(){
        // Player audio
        Object.values(this.player.walking).forEach(a => this.allAudio.push(a.a));
        Object.values(this.player.hurt).forEach(a => this.allAudio.push(a.a));
        Object.values(this.player.reloading).forEach(a => this.allAudio.push(a.a));
        Object.values(this.player.shooting.shoot).forEach(a => this.allAudio.push(a.a));
        if (this.player.shooting.blank) this.allAudio.push(this.player.shooting.blank.a);
        this.allAudio.push(this.player.dying.body_hitting_dirt.a);

        // Enemies audio
        Object.values(this.enemies.rattle.id2).forEach(a => this.allAudio.push(a.a));
        Object.values(this.enemies.attacking).forEach(a => this.allAudio.push(a.a));

        // Miscellaneous audio
        Object.values(this.miscellaneous).forEach(a => this.allAudio.push(a.a));

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