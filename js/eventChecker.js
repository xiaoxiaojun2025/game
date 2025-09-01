class event{
    constructor(){
        this.end=false;
        this.canEnd=false;
        this.end_1=false;
        this.end_2=false;
        this.end_3=false;
        this.end_4=false;
    }
}
class eventChecker{
    constructor(){
        this.event=new event;
    }
    update(game){
        if(game.timer>=2880){
            this.event.end=true;
        }
        if(game.storage.item[0].amount>=1){
            this.event.canEnd=true;
        }
        if(game.status=="paused"&&this.event.canEnd){
            document.getElementById("ender").style.display="block";
        }
        else{
            document.getElementById("ender").style.display="none";
        }
    }
}