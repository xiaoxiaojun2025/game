const gameWidth=1280;
const gameHeight=720;
var config=JSON.parse(localStorage.getItem("LA-config-"+localStorage.getItem("LA-username")));

class game{
    constructor(){
        this.status="running";
        document.getElementsByClassName("canvasContainer")[0].style.width=gameWidth+"px";
        document.getElementsByClassName("canvasContainer")[0].style.height=gameHeight+"px";
        this.createCanvas();
        this.changeMap(ateliter);
        this.PauseButtonGroup=new pauseButtonGroup(this);
        this.input=new inputManager;
        this.Lilies=new lilies(gameWidth,gameHeight,document.getElementById("Lilies"),gameWidth/2,0,0.2,0.25);
        this.animate=this.animate.bind(this);
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
        this.hitboxEntity=[];
        this.noHitboxEntity=[];
        this.createEntities();
    }
    createEntities(){
        this.Map.entityGroup.forEach(e=>{
            if(e.type=="hitbox"){
                this.hitboxEntity.push(new hitbox(e.hitbox[0],e.hitbox[1],e.hitbox[2],e.hitbox[3]));
            }
            if(e.type=="door"){
                this.noHitboxEntity.push(new door(gameWidth,gameHeight,e.hitbox[0],e.hitbox[1],e.hitbox[2],e.hitbox[3],e.destinationMap,e.destinationX,e.destinationY));
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
            this.hitboxEntity.forEach(e=>{
                e.draw(this.ctx);
            });
            this.noHitboxEntity.forEach(e=>{
                e.draw(this.ctx);
            });
            this.Lilies.update(this.input,this.hitboxEntity);
            this.noHitboxEntity.forEach(e=>{
                e.update(this,this.Lilies,this.input);
            });
        }
        requestAnimationFrame(this.animate);
    }
}

window.addEventListener("load",function(){
    var Game=new game;
    Game.animate();
});