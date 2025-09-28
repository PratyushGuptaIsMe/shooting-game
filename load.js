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
        this.#addScript();
        document.getElementById("textArea").classList.remove("displaynone");
        document.getElementById("textArea").style.display = "block";
    }
    #addScript(){
        const mainscript = document.createElement('script');
        mainscript.type = 'module';
        mainscript.src = 'main.js';
        document.body.appendChild(mainscript);
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
let preload = new Preloading();