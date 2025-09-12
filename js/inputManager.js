class inputManager{
    constructor(){
        this.key=[];
        window.addEventListener("keydown",e=>{
            if(e.key[0]!='F'){
                e.preventDefault();
            }
            let newKey=e.key.toLowerCase();
            if(this.key.indexOf(newKey)==-1){
                this.key.push(newKey);
            }
        });
        window.addEventListener("keyup",e=>{
            let newKey=e.key.toLowerCase();
            this.key.splice(this.key.indexOf(newKey),1);
        });
    }
}