class Preloading{
    constructor(_class_ = "preloading"){
        this.barProgress = 0;
        this.elementsToBeLoaded = document.getElementsByClassName(_class_);
        this.numberOfElements = this.elementsToBeLoaded.length;
        this.percentLoadingProgress =  0;    //percent
        this.#constructorSingleUseCode();
    }
    updateLoadingBar(){}
    inscribeElements(){
        Array.from(this.elementsToBeLoaded).forEach(element => {
            element.finishedLoadingProperty = false;
            element.addEventListener("load", () => {
                element.finishedLoadingProperty = true;
            })
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
        console.log(this.percentLoadingProgress);
    }
    onAllLoaded() {
        const mainscript = document.createElement('script');
        mainscript.type = 'module';
        mainscript.src = 'main.js';
        document.body.appendChild(script);
    }
    #constructorSingleUseCode(){
        try{
            this.inscribeElements();
            setInterval(() => {
                this.checkLoadingProgress();
            }, 10);
        }catch(e){
            e(e);
        }
    }
    e(e){
        console.error(e);
    }
}
let preload = new Preloading();