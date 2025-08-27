class pauseButtonGroup{
    constructor(game){
        this.buttonGroup=document.getElementsByClassName("pauseButton");
        this.init(game);
        this.hideAll();
    }
    hideAll(){
        if(arguments.length>0){
            for(var i=0;i<arguments.length;i++){
                for(var e=0;e<this.buttonGroup.length;e++){
                    if(this.buttonGroup[e].id!=arguments[i]){
                        this.buttonGroup[e].style.display="none";
                    }
                }
            }
            return;
        }
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
                    document.getElementsByClassName("innerCanvasContainer")[0].style.display="block";
                    this.hideAll("continue");
                    document.getElementById("continue").innerHTML="返回";
                    document.getElementById("continue").onclick=function(){
                        document.getElementsByClassName("innerCanvasContainer")[0].style.display="none";
                        document.getElementById("continue").innerHTML="继续游戏";
                        document.getElementById("continue").onclick=function(){
                            game.status="running";
                            this.hideAll();
                        }.bind(this);
                        this.display();
                    }.bind(this);
                }.bind(this);
            }
        }
    }
}