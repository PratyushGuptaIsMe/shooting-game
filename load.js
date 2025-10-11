class Preloading{
    constructor(html_class = "preloading"){
        this.root = document.documentElement;
        this.cssWidthVariable = "--LOADING-BAR-PROGRESS-NUM";
        this.loadingScreen = document.getElementById("loadingScreen");
        this.percentageCounter = document.getElementById("loadingPercentageCounter");

        this.elementsToBeLoaded = document.getElementsByClassName(html_class);
        this.numberOfElements = this.elementsToBeLoaded.length;
        this.percentLoadingProgress = 0;    //percent
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
        let currentPercentLoadingProgress = (elementsComplete / this.numberOfElements) * 100;
        if(this.percentLoadingProgress < currentPercentLoadingProgress){
            this.percentLoadingProgress = currentPercentLoadingProgress;
            this.updateLoadingBar();
        }
        this.checkIfAllLoaded();
        console.log(this.percentLoadingProgress);
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
        if(this.percentLoadingProgress >= 100){
            this.allLoaded();
        }
    }
    #constructorSingleUseCode(){
        try{
            this.inscribeElements();
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
                x: 0,
                y: 0,
                fontsize: "40px",
                fontfamily: "sans-serif"
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

            //load main.js script
            const mainscript = document.createElement('script');
            mainscript.type = 'module';
            mainscript.src = 'main.js';
            document.body.appendChild(mainscript);
        });
    }
}
new Preloading();