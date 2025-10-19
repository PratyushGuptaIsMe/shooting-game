class Preloading{
    constructor(html_class = "preloading"){
        this.root = document.documentElement;
        this.cssWidthVariable = "--LOADING-BAR-PROGRESS-NUM";
        this.loadingScreen = document.getElementById("loadingScreen");
        this.percentageCounter = document.getElementById("loadingPercentageCounter");

        this.elementsToBeLoaded = document.getElementsByClassName(html_class);
        this.numberOfElements = this.elementsToBeLoaded.length + 1;
        this.audioPreloaded = false;
        this.percentLoadingProgress = 0;
        this.intervalID;
        this.#constructorSingleUseCode();
    }
    updateLoadingBar(){
        this.root.style.setProperty(this.cssWidthVariable, `${this.percentLoadingProgress}%`);
        this.percentageCounter.textContent = `${Math.floor(this.percentLoadingProgress)}%`;
    }
    inscribeElements(){
        Array.from(this.elementsToBeLoaded).forEach(element => {
            if(element.complete){
                element.finishedLoadingProperty = true;
            }else{
                element.finishedLoadingProperty = false;
                element.addEventListener("load", () => {
                    element.finishedLoadingProperty = true;
                })
            }
        });
    }
    checkLoadingProgress(){
        let elementsComplete = 0;
        Array.from(this.elementsToBeLoaded).forEach(element => {
            if(element.finishedLoadingProperty === true){
                elementsComplete++;
            }
        })
        if(this.audioPreloaded){
            elementsComplete++;
        }
        let currentPercentLoadingProgress = (elementsComplete / this.numberOfElements) * 100;
        
        if(this.percentLoadingProgress < currentPercentLoadingProgress){
            this.percentLoadingProgress = currentPercentLoadingProgress;
            this.updateLoadingBar();
        }
        if(this.audioPreloaded && elementsComplete >= this.elementsToBeLoaded.length){
            this.percentLoadingProgress = 100;
            this.updateLoadingBar();
        }
        this.checkIfAllLoaded();
    }
    allLoaded(){
        clearInterval(this.intervalID);
        this.loadingScreen.style.display = "none";
        this.#addMainCanvas();
        document.getElementById("textArea").classList.remove("displaynone");
        document.getElementById("textArea").style.display = "block";
        new GameStart();
    }
    #addMainCanvas(){
        const mCanvas = document.createElement('canvas');
        mCanvas.id = "mainCanvas";
        mCanvas.width = window.innerHeight;
        mCanvas.height = window.innerHeight;
        mCanvas.style.display = "block";
        document.body.appendChild(mCanvas);
    }
    checkIfAllLoaded(){
        if(this.percentLoadingProgress >= 100 && this.audioPreloaded){
            this.allLoaded();
        }
    }
    #constructorSingleUseCode(){
        try{
            this.inscribeElements();
            const startAudioPreload = () => {
                if(window.__audioReady){
                    window.__audioReady.then(() => {
                        this.audioPreloaded = true;
                        this.checkLoadingProgress();
                    }).catch((error) => {
                        this.audioPreloaded = true;
                        this.checkLoadingProgress();
                    });
                } else {
                    setTimeout(startAudioPreload, 50);
                }
            };
            startAudioPreload();
            this.intervalID = setInterval(() => {
                this.checkLoadingProgress();
            }, 10);
        }catch(e){
            this.e(e);
        }
    }
    e(e){
        console.error(e);
    }
}
class GameStart{
    constructor(){
        this.INFO = {
            msg1: {
                text: "Click to start Game.",
                x: 50,
                y: 50,
                fontsize: "50px",
                fontfamily: "Hind Siliguri"
            }
        }
        this.fillStyle = "black";

        const space = " ";
        const s = space;
        const _canvas = document.getElementById("mainCanvas");
        const ctx = _canvas.getContext('2d');
        ctx.textBaseline = "top";
        ctx.fillStyle = this.fillStyle;

        ctx.font = this.INFO.msg1.fontsize + s + this.INFO.msg1.fontfamily;
        ctx.fillText(this.INFO.msg1.text, this.INFO.msg1.x, this.INFO.msg1.y);
        
        this.#clickToStartGameListener(_canvas, ctx);
    }
    #clickToStartGameListener(_canvas, ctx){
        document.addEventListener("click", () => {
            ctx.clearRect(0, 0, _canvas.width, _canvas.height);

            this.#unlockAudioOnClick();

            const mainscript = document.createElement('script');
            mainscript.type = 'module';
            mainscript.src = 'main.js';
            document.body.appendChild(mainscript);
            mainscript.onload = () => {
                game.playMainBackgroundMusic();
            };
        }, {
            once: true
        });
    }

    #unlockAudioOnClick() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            
            audioContext.resume().then(() => {
                const buffer = audioContext.createBuffer(1, 1, 22050);
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.destination);
                source.start();
                
                if(window.allAudio && window.allAudio.length > 0) {
                    const backgroundMusic = window.allAudio.find(audio => 
                        audio.src && audio.src.includes('Pirate-orchestra')
                    );
                    
                    const testAudio = backgroundMusic || window.allAudio[0];
                    if(testAudio) {
                        testAudio.currentTime = 0;
                        testAudio.volume = 0.01;
                        testAudio.play().then(() => {
                            testAudio.pause();
                            testAudio.currentTime = 0;
                        }).catch(e => {});
                    }
                }
            });
        } catch (e) {}
    }
}
let game;
let allAudio;
new Preloading();