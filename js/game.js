const gameWidth=1280;
const gameHeight=720;
var config=JSON.parse(localStorage.getItem("LA-config-"+localStorage.getItem("LA-username")));

class game{
    constructor(){
        this.status="running";
        this.createCanvas();
        this.initContainer();
        this.storage=new bag(5000);
        this.bag=new bag(50);
        this.storage.putin(this.bag);
        this.RecipeGroup=new recipeGroup;
        this.Talk=new talk;
        this.changeMap(ateliter);
        this.PauseButtonGroup=new pauseButtonGroup(this);
        this.input=new inputManager;
        this.Lilies=new lilies(gameWidth,gameHeight,document.getElementById("Lilies"),gameWidth/2,0,0.2,0.25);
        this.animate=this.animate.bind(this);
    }
    initContainer(){
        document.getElementsByClassName("canvasContainer")[0].style.width=gameWidth+"px";
        document.getElementsByClassName("canvasContainer")[0].style.height=gameHeight+"px"
        document.getElementsByClassName("innerCanvasContainer")[0].style.width=gameWidth*0.7+"px"
        document.getElementsByClassName("innerCanvasContainer")[0].style.height=gameHeight*0.7+"px";
    }
    createCanvas(){
        this.gameCanvas=document.getElementById("canvas1");
        this.ctx=this.gameCanvas.getContext("2d");
        this.gameCanvas.width=gameWidth;
        this.gameCanvas.height=gameHeight;
    }
    changeMap(newMap){
        this.Map=new map(newMap);
        //this.gameCanvas.style.backgroundImage="url('img/map/'+newMap.background)";
        this.Entity=[];
        this.createEntities();
        if(this.Map.name=="ateliter"){
            document.getElementById("bag").innerHTML="材料箱";
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
                this.Entity.push(new text(e.hitbox[0],e.hitbox[1],e.hitbox[2],e.hitbox[3],e.text,e.once));
            }
            if(e.type=="pot"){
                this.Entity.push(new pot(gameWidth,gameHeight,document.getElementById("Lilies"),e.hitbox[0],e.hitbox[1],e.hitbox[2],e.hitbox[3]));
            }
        });
    }
    animate(){
        if(this.input.key.indexOf("Tab")>-1){
            if(this.status=="running"){
                this.status="paused";
                this.PauseButtonGroup.display();
            }
        }
        if(this.status=="running"){
            this.ctx.clearRect(0,0,gameWidth,gameHeight);
            this.Lilies.draw(this.ctx);
            this.Entity.forEach(e=>{
                e.draw(this.ctx);
            });
            this.Lilies.update(this.input,this.Entity);
            this.Entity.forEach(e=>{
                e.update(this,this.Lilies,this.input);
            });
        }
        if(this.status=="talking"){
            this.Entity.forEach(e=>{
                if(e instanceof text){
                    e.update(this,this.Lilies,this.input);
                }
            });
        }
        requestAnimationFrame(this.animate);
    }
}

window.addEventListener("load",function(){
    var Game=new game;
    Game.animate();
});