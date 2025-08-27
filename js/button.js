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
                        document.getElementsByClassName("innerCanvasContainer")[0].innerHTML="";
                        document.getElementById("continue").innerHTML="继续游戏";
                        document.getElementById("continue").onclick=function(){
                            game.status="running";
                            this.hideAll();
                        }.bind(this);
                        this.display();
                    }.bind(this);
                    if(game.Map.name=="ateliter"){
                        for(var i=0;i<game.storage.item.length;i++){
                            if(game.storage.item[i].amount==0) continue;
                            var item=document.createElement("div");
                            item.className="itemContainer";
                            item.innerHTML=game.storage.item[i].name+"x"+game.storage.item[i].amount;
                            document.getElementsByClassName("innerCanvasContainer")[0].appendChild(item);
                        }
                    }
                    else{
                        for(var i=0;i<game.bag.item.length;i++){
                            if(game.bag.item[i].amount==0) continue;
                            var item=document.createElement("div");
                            item.className="itemContainer";
                            item.innerHTML=game.bag.item[i].name+"x"+game.bag.item[i].amount;
                            document.getElementsByClassName("innerCanvasContainer")[0].appendChild(item);
                        }
                    }
                }.bind(this);
            }
        }
    }
}