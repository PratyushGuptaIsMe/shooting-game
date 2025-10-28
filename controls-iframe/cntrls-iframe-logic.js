function ArrowOrWASD(Arroworwasd){
    if(Arroworwasd){
        // Display WASD
        document.getElementById("udlr-container").classList.add("displaynone");
        document.getElementById("wasd-container").classList.remove("displaynone");
    }else{
        // Display arrow keys
        document.getElementById("wasd-container").classList.add("displaynone");
        document.getElementById("udlr-container").classList.remove("displaynone");
    }  
}

function applyGlow(){
    if(keysArray.includes(" ")){
        document.getElementById("spaceKey").classList.add("active");
    }else{
        document.getElementById("spaceKey").classList.remove("active");
    }

    if(keysArray.includes("r") || keysArray.includes("R")){
        document.getElementById("rKey").classList.add("active");
    }else{
        document.getElementById("rKey").classList.remove("active");
    }

    if(keysArray.includes("ArrowRight")){
        document.getElementById("ar").classList.add("active");
    }else{
        document.getElementById("ar").classList.remove("active");
    }

    if(keysArray.includes("ArrowLeft")){
        document.getElementById("al").classList.add("active");
    }else{
        document.getElementById("al").classList.remove("active");
    }

    if(keysArray.includes("ArrowUp")){
        document.getElementById("au").classList.add("active");
    }else{
        document.getElementById("au").classList.remove("active");
    }

    if(keysArray.includes("ArrowDown")){
        document.getElementById("ad").classList.add("active");
    }else{
        document.getElementById("ad").classList.remove("active");
    }

    if(keysArray.includes("w")){
        document.getElementById("w").classList.add("active");
    }else{
        document.getElementById("w").classList.remove("active");
    }

    if(keysArray.includes("a")){
        document.getElementById("a").classList.add("active");
    }else{
        document.getElementById("a").classList.remove("active");
    }

    if(keysArray.includes("s")){
        document.getElementById("s").classList.add("active");
    }else{
        document.getElementById("s").classList.remove("active");
    }

    if(keysArray.includes("d")){
        document.getElementById("d").classList.add("active");
    }else{
        document.getElementById("d").classList.remove("active");
    }
}


let Arroworwasd = false;
let keysArray = [];

ArrowOrWASD(Arroworwasd);

window.addEventListener('message', (msg)=>{
    if(!msg.data || msg.data.type !== 'syncKeys'){
        return;
    }else{
        keysArray = [...msg.data.keys];
        applyGlow();
    }
});