class inputManager{
    constructor(){
        this.key=[];
        window.addEventListener("keydown",e=>{
            if(this.key.indexOf(e.key)==-1){
                this.key.push(e.key);
            }
        });
        window.addEventListener("keyup",e=>{
            this.key.splice(this.key.indexOf(e.key),1);
        });
    }
}