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
            else if(this.buttonGroup[e].id=="exit"){
                this.buttonGroup[e].onclick=function(){
                    game.SaveManager.save(game);
                    window.location.href="../index.html"
                }
            }
            else if(this.buttonGroup[e].id=="save"){
                this.buttonGroup[e].onclick=function(){
                    game.SaveManager.save(game);
                    game.status="running";
                    this.hideAll();
                }.bind(this);
            }
            else if(this.buttonGroup[e].id=="load"){
                this.buttonGroup[e].onclick=function(){
                    game.SaveManager.load(game);
                    game.status="running";
                    this.hideAll();
                }.bind(this);
            }
            else if(this.buttonGroup[e].id=="bag"){
                document.getElementById("bag").onclick=()=>{
                    select.bind(this)();
                }
                function select(){
                    document.getElementById("innerCanvas").innerHTML="";
                    document.getElementById("innerCanvasContainer").style.display="block";
                    this.hideAll("continue");
                    document.getElementById("continue").innerHTML="返回";
                    document.getElementById("continue").onclick=()=>{
                        game.Talk.clear();
                        game.Talk.hide();
                        document.getElementById("innerCanvasContainer").style.display="none";
                        document.getElementById("innerCanvas").innerHTML="";
                        document.getElementById("continue").innerHTML="继续游戏";
                        document.getElementById("continue").onclick=()=>{
                            game.status="running";
                            this.hideAll();
                        }
                        this.display();
                    }
                    if(game.Map.name=="atelier"){
                        for(let i=0;i<game.storage.item.length;i++){
                            if(game.storage.item[i].amount==0) continue;
                            let item=document.createElement("div");
                            item.className="itemContainer";
                            item.id=game.storage.item[i].name[0];
                            item.innerHTML="<img src=../img/item/"+game.bag.item[i].img+">"+game.storage.item[i].name[0]+"x"+game.storage.item[i].amount;
                            item.onclick=()=>{
                                document.getElementById("continue").onclick=()=>{
                                    game.Talk.clear();
                                    game.Talk.hide();
                                    select.bind(this)();
                                }
                                game.Talk.see(game.storage.item[i].intro);
                                document.getElementById("innerCanvas").innerHTML="";
                                for(let j=0;j<game.storage.item[i].amount;j++){
                                    let newItem=document.createElement("div");
                                    newItem.className="itemContainer";
                                    newItem.innerHTML="<img src=../img/item/"+game.storage.item[i].img+">"+game.storage.item[i].name[0]+"<br>品质"+game.storage.item[i].quality[j]+"<br>"+game.storage.item[i].trait[j];
                                    newItem.id=newItem.id+"-"+j;
                                    document.getElementById("innerCanvas").appendChild(newItem);
                                }
                            }
                            document.getElementById("innerCanvas").appendChild(item);
                        }
                    }
                    else{
                        for(let i=0;i<game.bag.item.length;i++){
                            if(game.bag.item[i].amount==0) continue;
                            let item=document.createElement("div");
                            item.className="itemContainer";
                            item.innerHTML="<img src=../img/item/"+game.bag.item[i].img+">"+game.bag.item[i].name[0]+"x"+game.bag.item[i].amount;
                            item.onclick=()=>{
                                document.getElementById("innerCanvas").innerHTML="";
                                document.getElementById("continue").onclick=()=>{
                                    game.Talk.clear();
                                    game.Talk.hide();
                                    select.bind(this)();
                                }
                                for(let j=0;j<game.bag.item[i].amount;j++){
                                    game.Talk.see(game.storage.item[i].intro);
                                    let newItem=document.createElement("div");
                                    newItem.className="itemContainer";
                                    newItem.innerHTML="<img src=../img/item/"+game.bag.item[i].img+">"+game.bag.item[i].name[0]+"<br>品质"+game.bag.item[i].quality[j]+"<br>"+game.bag.item[i].trait[j];
                                    newItem.id=newItem.id+"-"+j;
                                    document.getElementById("innerCanvas").appendChild(newItem);
                                }
                            }
                            document.getElementById("innerCanvas").appendChild(item);
                        }
                    }
                }
            }
            else if(this.buttonGroup[e].id=="ender"){
                this.buttonGroup[e].onclick=function(){
                    game.EndChecker.ender.end=true;
                }
            }
        }
    }
}