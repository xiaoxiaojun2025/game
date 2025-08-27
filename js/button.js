class pauseButtonGroup{
    constructor(game){
        this.buttonGroup=document.getElementsByClassName("pauseButton");
        this.init(game);
        this.hideAll();
    }
    hideAll(){
        for(var e=0;e<this.buttonGroup.length;e++){
            this.buttonGroup[e].style.display="none";
        }
    }
    display(){
        for(var e=0;e<this.buttonGroup.length;e++){
            this.buttonGroup[e].style.display="block";
        }
    }
    init(game){
        for(var e=0;e<this.buttonGroup.length;e++){
            if(this.buttonGroup[e].id=="continue"){
                this.buttonGroup[e].onclick=function(){
                    game.status="running";
                    this.hideAll();
                }.bind(this);
            }
            else if(this.buttonGroup[e].id=="bag"){
                this.buttonGroup[e].innerHTML="材料箱";
                this.buttonGroup[e].onclick=function(){
                    game.status="running";
                    this.hideAll();
                }.bind(this);
            }
        }
    }
}