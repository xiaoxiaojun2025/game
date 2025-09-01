const gameWidth=1280;
const gameHeight=720;
var config=JSON.parse(localStorage.getItem("LA-config-"+localStorage.getItem("LA-username")));
var fps=60;
var FrameRate=1000/fps;
var Frame=0;

class game{
    constructor(){
        this.status="running";
        this.timer=8;
        this.cash=0;
        this.createCanvas();
        this.initContainer();
        this.storage=new bag(5000);
        this.bag=new bag(50);
        this.storage.putin(this.bag);
        this.RecipeGroup=new recipeGroup;
        this.Talk=new talk;
        this.input=new inputManager;
        this.achievement=new achievementManager;
        this.Lilies=new lilies(gameWidth,gameHeight,document.getElementById("Lilies"),240,486,2,2);
        this.EndChecker=new endChecker;
        this.SaveManager=new saveManager(this);
        this.SaveManager.load(this);
        this.PauseButtonGroup=new pauseButtonGroup(this);
        this.prevTimestamp=document.timeline.currentTime;
        this.sumTimestamp=0;
        this.animate=this.animate.bind(this);
    }
    initContainer(){
        document.getElementsByClassName("canvasContainer")[0].style.width=gameWidth+"px";
        document.getElementsByClassName("canvasContainer")[0].style.height=gameHeight+"px"
        document.getElementById("innerCanvasContainer").style.width=gameWidth*0.7+"px"
        document.getElementById("innerCanvasContainer").style.height=gameHeight*0.7+"px";
    }
    createCanvas(){
        this.gameCanvas=document.getElementById("canvas1");
        this.ctx=this.gameCanvas.getContext("2d");
        this.gameCanvas.width=gameWidth;
        this.gameCanvas.height=gameHeight;
    }
    changeMap(newMap){
        this.Map=new map(newMap);
        document.getElementById("mapname").innerHTML=newMap.name1;
        this.gameCanvas.style.backgroundImage="url(../img/map/"+newMap.background+")";
        this.Entity=[];
        this.createEntities();
        if(this.Map.name=="atelier"){
            document.getElementById("bag").innerHTML="材料箱";
            this.Lilies.hearts=5;
        }
        else{
            document.getElementById("bag").innerHTML="采集篮";
        }
    }
    createEntities(){
        this.Map.entityGroup.forEach(e=>{
            if(e.type=="hitbox"){
                this.Entity.push(new hitbox(e.hitbox[0],e.hitbox[1],e.hitbox[2],e.hitbox[3]));
            }
            if(e.type=="door"){
                this.Entity.push(new door(gameWidth,gameHeight,e.hitbox[0],e.hitbox[1],e.hitbox[2],e.hitbox[3],e.destinationMap,e.destinationX,e.destinationY));
            }
            if(e.type=="text"){
                this.Entity.push(new text(e.hitbox[0],e.hitbox[1],e.hitbox[2],e.hitbox[3],e.text,e.once,e));
            }
            if(e.type=="pot"){
                this.Entity.push(new pot(gameWidth,gameHeight,document.getElementById("pot"),e.hitbox[0],e.hitbox[1],e.hitbox[2],e.hitbox[3]));
            }
            if(e.type=="item"){
                this.Entity.push(new item(gameWidth,gameHeight,document.getElementById("itemimg"),e.hitbox[0],e.hitbox[1],e.hitbox[2],e.hitbox[3],512,512,e.itemname,e.amount,e.quality,e.trait));
            }
            if(e.type=="recipeItem"){
                this.Entity.push(new recipeItem(gameWidth,gameHeight,document.getElementById("itemimg"),e.hitbox[0],e.hitbox[1],e.hitbox[2],e.hitbox[3],512,512,e));
            }
            if(e.type=="entrance"){
                this.Entity.push(new entrance(gameWidth,gameHeight,e.hitbox[0],e.hitbox[1],e.hitbox[2],e.hitbox[3],e.destinationMap,e.destinationX,e.destinationY));
            }
            if(e.type=="puni"){
                this.Entity.push(new puni(gameWidth,gameHeight,document.getElementById(e.img),e.hitbox[0],e.hitbox[1],e.hitbox[2],e.hitbox[3],256,256,e.name,e.damage,e.hearts,e.actRange));
            }
        });
    }
    animate(timestamp){
        this.sumTimestamp+=timestamp-this.prevTimestamp;
        this.prevTimestamp=timestamp;
        if(this.sumTimestamp>=FrameRate){
            this.sumTimestamp-=FrameRate;
            if(this.input.key.indexOf(config.pause)>-1){
                if(this.status=="running"){
                    this.status="paused";
                    this.PauseButtonGroup.display();
                }
            }
            if(this.status=="running"){
                Frame++;
                document.getElementById("timer").innerHTML=Math.floor(this.timer/24).toString()+"天"+Math.floor(this.timer%24).toString()+"时<br>金币："+this.cash.toString()+"<br>生命："+this.Lilies.hearts.toString()+"❤";
                this.ctx.clearRect(0,0,gameWidth,gameHeight);
                this.Entity.forEach(e=>{
                    e.draw(this.ctx);
                });
                this.Lilies.draw(this.ctx);
                this.Lilies.update(this.input,this.Entity);
                this.Entity.forEach(e=>{
                    e.update(this,this.Lilies,this.input);
                });
            }
            if(this.status=="talking"){
                Frame++;
                this.ctx.clearRect(0,0,gameWidth,gameHeight);
                this.Entity.forEach(e=>{
                    e.draw(this.ctx);
                });
                this.Lilies.draw(this.ctx);
                this.Entity.forEach(e=>{
                    if(e instanceof text){
                        e.update(this,this.Lilies,this.input);
                    }
                });
            }
            this.EndChecker.update(this);
        }
        requestAnimationFrame((t)=>this.animate(t));
    }
}

window.addEventListener("load",function(){
    var Game=new game;
    Game.animate(Game.prevTimestamp);
});