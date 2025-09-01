class ender{
    constructor(){
        this.end=false;
        this.canEnd=false;
        this.end_1=false;
        this.end_2=false;
        this.end_3=false;
        this.end_4=false;
    }
}
class endChecker{
    constructor(){
        this.ender=new ender;
    }
    update(game){
        if(game.timer>=2880){
            this.ender.end=true;
        }
        if(game.storage.item[0].amount>=1){
            this.ender.canEnd=true;
        }
        if(game.status=="paused"&&this.ender.canEnd){
            document.getElementById("ender").style.display="block";
        }
        else{
            document.getElementById("ender").style.display="none";
        }
    }
}