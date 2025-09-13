class entity{
    constructor(gameWidth,gameHeight,img,x,y,width,height){
        this.gameWidth=gameWidth;
        this.gameHeight=gameHeight;
        this.img=img;
        this.vx=0;
        this.vy=0;
        this.frameX=0;
        this.frameY=0;
        this.weight=0;
        this.spriteWidth=0;
        this.spriteHeight=0;
        this.width=width;
        this.height=height;
        this.x=x;
        this.y=y;
        this.hitbox=false;
    }
    update(){
        this.x+=this.vx;
        this.y+=this.vy;
    }
    draw(ctx){
        ctx.drawImage(this.img,this.spriteWidth*this.frameX,this.spriteHeight*this.frameY,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
    }
    setX(x){
        this.x=x;
    }
    setY(y){
        this.y=y;
    }
}
class atk extends entity{
    constructor(gameWidth,gameHeight,img,x,y,width,height){
        super(gameWidth,gameHeight,img,x,y,width,height);
        this.spriteWidth=100;
        this.spriteHeight=180;
        this.frame=0;
        this.face="right";
    }
    update(lilies){
        this.frame++;
        this.frameX=Math.floor(this.frame/20);
        if(lilies.face=="right"){
            this.face="right";
            this.x=lilies.x+lilies.width;
            this.y=lilies.y+lilies.height-this.height;
        }
        if(lilies.face=="left"){
            this.face="left";
            this.x=lilies.x-this.width;
            this.y=lilies.y+lilies.height-this.height;
        }
        if(this.frameX>=4){
            lilies.atk=null;
        }
    }
    draw(ctx){
        if(this.face=="right"){
            super.draw(ctx);
        }
        else{
            ctx.save();
            ctx.scale(-1,1);
            ctx.drawImage(this.img,this.spriteWidth*this.frameX,this.spriteHeight*this.frameY,this.spriteWidth,this.spriteHeight,-this.x-this.width,this.y,this.width,this.height);
            ctx.restore();
        }
    }
}
class lilies extends entity{
    constructor(gameWidth,gameHeight,img,x,y,width,height){
        super(gameWidth,gameHeight,img,x,y,0,0);
        this.spriteWidth=56;
        this.spriteHeight=81;
        this.width=this.spriteWidth*width;
        this.height=this.spriteHeight*height;//84*122
        this.weight=1;
        this.face="right";
        this.jumped=false;
        this.damage=3;
        this.maxHearts=5;
        this.hearts=5;
        this.atk=null;
        this.invincible=false;
        this.innerframe=0;
    }
    update(game,input,hitboxGroup){
        this.isOnFloor=false;
        var originX=this.x;
        var originY=this.y;
        super.update();
        hitboxGroup.forEach(hitbox=>{
            if(hitbox.hitbox){
                if(this.y<=hitbox.y+hitbox.height&&this.y+this.height>=hitbox.y&&this.x+this.width>hitbox.x&&this.x<hitbox.x+hitbox.width){
                    if(originX+this.width<=hitbox.x){
                        this.vx=0;
                        this.x=hitbox.x-this.width;
                    }
                    if(originX>=hitbox.x+hitbox.width){
                        this.vx=0;
                        this.x=hitbox.x+hitbox.width;
                    }
                    if(originY>=hitbox.y+hitbox.height){
                        this.vy=0;
                    }
                    if(originY+this.height<=hitbox.y){
                        this.vy=0;
                        this.isOnFloor=true;
                        this.y=hitbox.y-this.height;
                    }
                }
            }
        });
        if(input.key.indexOf(config.left)>-1&&this.atk==null){
            if(this.frameY==0){
                this.frameY=1;
            }
            this.face="left";
            if(input.key.indexOf(config.run)>-1&&game.storage.item[5].amount>0){
                this.vx=-10;
            }
            else{
                this.vx=-5;
            }
        }
        else if(input.key.indexOf(config.right)>-1&&this.atk==null){
            if(this.frameY==0){
                this.frameY=1;
            }
            this.face="right";
            if(input.key.indexOf(config.run)>-1&&game.storage.item[5].amount>0){
                this.vx=10;
            }
            else{
                this.vx=5;
            }
        }
        else{
            if(this.frameY==1){
                this.frameY=0;
            }
            this.vx=0;
        }
        if(input.key.indexOf(config.jump)>-1&&this.isOnFloor&&!this.jumped&&this.atk==null){
            this.jumped=true;
            if(input.key.indexOf(config.up)>-1&&game.storage.item[9].amount>0){
                this.vy=-30;
            }
            else{
                this.vy-=20;
            }
        }
        else if(!this.isOnFloor){
            if(this.frameY!=3){
                this.frameY=2;
            }
            this.vy+=this.weight;
        }
        else{
            if(input.key.indexOf(config.jump)==-1){
                this.jumped=false;
            }
            this.vy=0;
            if(this.frameY==2){
                this.frameY=0;
            }
        }
        if(input.key.indexOf(config.attack)>-1&&this.atk==null){
            this.frameY=3;
            this.atk=new atk(this.gameWidth,this.gameHeight,document.getElementById("atk"),this.x+this.width,this.y+this.height-this.height*1.5,this.width/2,this.height*1.5);
        }
        if(this.atk!=null){
            this.atk.update(this);
        }
        else if(this.frameY==3){
            this.frameY=0;
        }
    }
    draw(ctx){
        switch(this.frameY){
            case 0:
                this.frameX=Math.floor(Frame/20)%4;
                break;
            case 1:
                this.frameX=Math.floor(Frame/20)%4;
                break;
            case 2:
                this.frameX=0;
                break;
            case 3:
                this.innerframe++;
                this.frameX=Math.floor(this.innerframe/20)%4;
                if(this.innerframe>=80){
                    this.frameY=0;
                    this.innerframe=0;
                }
                break;
        }
        if(this.face=="right"){
            super.draw(ctx);
        }
        else{
            ctx.save();
            ctx.scale(-1,1);
            ctx.drawImage(this.img,this.spriteWidth*this.frameX,this.spriteHeight*this.frameY,this.spriteWidth,this.spriteHeight,-this.x-this.width,this.y,this.width,this.height);
            ctx.restore();
        }
        if(this.atk!=null){
            this.atk.draw(ctx);
        }
    }
    getDamaged(damage,game){
        if(!this.invincible){
            if(this.hearts-damage>0){
                this.hearts-=damage;
                this.invincible=true;
                setTimeout(()=>{
                    this.invincible=false;
                },2000);
            }
            else{
                game.Talk.see("你死了，丢失了采集篮中的全部物品");
                if(timeout){
                    clearTimeout(timeout);
                }
                timeout=setTimeout(()=>{
                    game.Talk.clear();
                    game.Talk.hide();
                    clearTimeout(timeout);
                },1000);
                game.changeMap(atelier);
                this.x=240;
                this.y=518;
                game.bag.clear();
                game.timer+=168;
            }
        }
    }
}
class door extends entity{
    constructor(gameWidth,gameHeight,x,y,width,height,destinationMap,destinationX,destinationY){
        super(gameWidth,gameHeight,0,x,y,width,height);
        this.destinationMap=destinationMap;
        this.destinationX=destinationX;
        this.destinationY=destinationY;
        this.hitbox=false;
    }
    update(game,lilies,input){
        if(this.y<=lilies.y+lilies.height&&this.y+this.height>=lilies.y&&this.x+this.width>lilies.x&&this.x<lilies.x+lilies.width){
            this.in=true;
            document.getElementById("Ehint").style.display="block";
            if(input.key.indexOf(config.interact)>-1){
                document.getElementById("Ehint").style.display="none";
                if(this.destinationMap=="atelier"){
                    game.storage.putin(game.bag);
                }
                if(game.Map.name!="atelier"){
                    game.timer=Number(game.timer)+4;
                }
                input.key.splice(input.key.indexOf(config.interact),1);
                game.changeMap(eval(this.destinationMap));
                lilies.setX(this.destinationX);
                lilies.setY(this.destinationY);
            }
        }
        else if(this.in){
            this.in=false;
            document.getElementById("Ehint").style.display="none";
        }
    }
    draw(){}
}
class entrance extends entity{
    constructor(gameWidth,gameHeight,x,y,width,height,destinationMap,destinationX,destinationY){
        super(gameWidth,gameHeight,0,x,y,width,height);
        this.destinationMap=destinationMap;
        this.destinationX=destinationX;
        this.destinationY=destinationY;
        this.hitbox=false;
    }
    update(game,lilies,input){
        if(this.y<=lilies.y+lilies.height&&this.y+this.height>=lilies.y&&this.x+this.width>lilies.x&&this.x<lilies.x+lilies.width){
            if(this.destinationMap=="atelier"){
                game.storage.putin(game.bag);
            }
            if(game.Map.name!="atelier"){
                game.timer=Number(game.timer)+4;
            }
            if(input.key.indexOf(config.interact)>-1){
                input.key.splice(input.key.indexOf(config.interact),1);
            }
            game.changeMap(eval(this.destinationMap));
            lilies.setX(this.destinationX);
            lilies.setY(this.destinationY);
        }
    }
    draw(){}
}
class pot extends entity{
    constructor(gameWidth,gameHeight,img,x,y,width,height){
        super(gameWidth,gameHeight,img,x,y,width,height);
        this.spriteWidth=254;
        this.spriteHeight=320;
        this.width=width;
        this.height=height;
        this.hitbox=false;
    }
    update(game,lilies,input){
        if(lilies.isOnFloor&&this.y<=lilies.y+lilies.height&&this.y+this.height>=lilies.y&&this.x+this.width>lilies.x&&this.x<lilies.x+lilies.width){
            this.in=true;
            document.getElementById("Ehint").style.display="block";
            if(input.key.indexOf(config.interact)>-1){
                (function select(){
                    lilies.frameY=0;
                    game.status="talking";
                    game.achievement.getAchievement("打开炼金釜",game);
                    var recipeContainer=document.getElementById("innerCanvas");
                    document.getElementById("innerCanvas").innerHTML="";
                    document.getElementById("innerCanvasContainer").style.display="block";
                    for(let i=0;i<game.RecipeGroup.recipe.length;i++){
                        var recipe=document.createElement("div");
                        let canCraft=true;
                        recipe.className="itemContainer";
                        let recipeNameInItemIndex=0;
                        for(let j=0;j<game.storage.item.length;j++){
                            if(game.storage.item[j].name.includes(game.RecipeGroup.recipe[i].name)){
                                recipeNameInItemIndex=j;
                                break;
                            }
                        }
                        recipe.innerHTML="<img src=../img/item/"+game.storage.item[recipeNameInItemIndex].img+">"+game.RecipeGroup.recipe[i].name+"<br>配方:<br>";
                        for(let key in game.RecipeGroup.recipe[i].recipe){
                            recipe.innerHTML+=key+"x"+game.RecipeGroup.recipe[i].recipe[key]+"<br>";
                            let itemAmount=0;
                            for(let j=0;j<game.storage.item.length;j++){
                                if(game.storage.item[j].name.includes(key)){
                                    itemAmount+=game.storage.item[j].amount;
                                }
                            }
                            if(itemAmount<game.RecipeGroup.recipe[i].recipe[key]){
                                canCraft=false;
                            }
                        }
                        recipeContainer.appendChild(recipe);
                        recipe.onclick=function(){
                            if(!canCraft){
                                game.Talk.see("材料不足");
                                if(timeout){
                                    clearTimeout(timeout);
                                }
                                timeout=setTimeout(()=>{
                                    game.Talk.clear();
                                    game.Talk.hide();
                                },1000);
                                return;
                            }
                            recipeContainer.innerHTML="";
                            let page=0;
                            let itemID=[];
                            let usedItem=[];
                            let selectNum=0;
                            let recipeItemName=Object.keys(game.RecipeGroup.recipe[i].recipe);
                            let newQuality=0;
                            let newTrait="";
                            let storage=JSON.parse(JSON.stringify(game.storage));
                            document.getElementById("continue").style.display="block";
                            document.getElementById("continue").innerHTML="返回";
                            document.getElementById("continue").onclick=select;
                            (function craft(){
                                for(let j=0;j<game.storage.item.length;j++){
                                    if(game.storage.item[j].name.includes(recipeItemName[page])){
                                        itemID.push(j);
                                    }
                                }
                                for(let k=0;k<itemID.length;k++){
                                    for(let j=0;j<game.storage.item[itemID[k]].amount;j++){
                                        let newItem=document.createElement("div");
                                        newItem.className="itemContainer";
                                        newItem.innerHTML="<img src=../img/item/"+game.storage.item[itemID[k]].img+">"+game.storage.item[itemID[k]].name[0]+"<br>品质"+game.storage.item[itemID[k]].quality[j]+"<br>"+game.storage.item[itemID[k]].trait[j];
                                        document.getElementById("innerCanvas").appendChild(newItem);
                                        newItem.onclick=function(){
                                            document.getElementById("continue").style.display="none";
                                            newItem.style.display="none";
                                            let usingItem={
                                                "name":storage.item[itemID[k]].name[0],
                                                "quality":storage.item[itemID[k]].quality[j],
                                                "trait":storage.item[itemID[k]].trait[j]
                                            }
                                            usedItem.push(usingItem);
                                            game.storage.useItem(storage.item[itemID[k]].name[0],storage.item[itemID[k]].quality[j],storage.item[itemID[k]].trait[j]);
                                            selectNum++;
                                            if(selectNum>=game.RecipeGroup.recipe[i].recipe[recipeItemName[page]]){
                                                page++;
                                                selectNum=0;
                                                itemID=[];
                                                if(page<recipeItemName.length){
                                                    recipeContainer.innerHTML="";
                                                    craft();
                                                    return;
                                                }
                                                recipeContainer.innerHTML="";
                                                usedItem.forEach(it=>{
                                                    newQuality+=it.quality;
                                                });
                                                game.timer=Number(game.timer)+game.RecipeGroup.recipe[i].time;
                                                newQuality=Math.floor(newQuality/usedItem.length);
                                                newTrait=usedItem[0].trait;
                                                for(let l=1;l<usedItem.length;l++){
                                                    if([newTrait,usedItem[l].trait].includes("品质提升")&&[newTrait,usedItem[l].trait].includes("品质提升+")){
                                                        newTrait="品质提升++";
                                                        break;
                                                    }
                                                    else if([newTrait,usedItem[l].trait].includes("品质提升+")&&[newTrait,usedItem[l].trait].includes("品质提升++")){
                                                        newTrait="超级品质";
                                                        break;
                                                    }
                                                    else if([newTrait,usedItem[l].trait].includes("超级品质")&&[newTrait,usedItem[l].trait].includes("究极之力")){
                                                        newTrait="究极的逸品";
                                                        break;
                                                    }
                                                    else if([newTrait,usedItem[l].trait].includes("低价")&&[newTrait,usedItem[l].trait].includes("低价+")){
                                                        newTrait="低价++";
                                                        break;
                                                    }
                                                    else if([newTrait,usedItem[l].trait].includes("低价+")&&[newTrait,usedItem[l].trait].includes("低价++")){
                                                        newTrait="量产品";
                                                        break;
                                                    }
                                                    else if([newTrait,usedItem[l].trait].includes("量产品")&&[newTrait,usedItem[l].trait].includes("究极之力")){
                                                        newTrait="无价";
                                                        break;
                                                    }
                                                    else if([newTrait,usedItem[l].trait].includes("高价")&&[newTrait,usedItem[l].trait].includes("高价+")){
                                                        newTrait="高价++";
                                                        break;
                                                    }
                                                    else if([newTrait,usedItem[l].trait].includes("高价+")&&[newTrait,usedItem[l].trait].includes("高价++")){
                                                        newTrait="限定价格";
                                                        break;
                                                    }
                                                    else if([newTrait,usedItem[l].trait].includes("限定价格")&&[newTrait,usedItem[l].trait].includes("究极之力")){
                                                        newTrait="稀少的逸品";
                                                        break;
                                                    }
                                                }
                                                switch(newTrait){
                                                    case "品质提升":
                                                        newQuality+=Math.floor(newQuality/10);
                                                        break;
                                                    case "品质提升+":
                                                        newQuality+=Math.floor(newQuality/5);
                                                        break;
                                                    case "品质提升++":
                                                        newQuality+=Math.floor(newQuality/4);
                                                        break;
                                                    case "超级品质":
                                                        newQuality+=Math.floor(newQuality/2);
                                                        break;
                                                    case "究极的逸品":
                                                        newQuality+=newQuality;
                                                        break;
                                                }
                                                game.storage.addItem(game.RecipeGroup.recipe[i].name,1,[newQuality],[newTrait]);
                                                game.Talk.see("成功制作"+game.RecipeGroup.recipe[i].name+"&emsp;消耗时间"+game.RecipeGroup.recipe[i].time+"小时"+"<br>品质："+newQuality);
                                                game.achievement.getAchievement("第一次调和",game);
                                                if(game.RecipeGroup.recipe[i].name=="旅人之鞋"){
                                                    game.achievement.getAchievement("跑得快！",game);
                                                }
                                                if(game.RecipeGroup.recipe[i].name=="十字镐"){
                                                    game.achievement.getAchievement("这不是铁镐吗",game);
                                                }
                                                if(game.RecipeGroup.recipe[i].name=="爆破用炎烧"){
                                                    game.achievement.getAchievement("艺术就是爆炸！",game);
                                                }
                                                if(game.RecipeGroup.recipe[i].name=="捕虫网"){
                                                    game.achievement.getAchievement("小虫得豸",game);
                                                }
                                                if(game.RecipeGroup.recipe[i].name=="星导手杖"&&lilies.damage<5){
                                                    lilies.damage=5;
                                                    game.RecipeGroup.recipe.push(
                                                        {
                                                            "name":"苍蓝星笼",
                                                            "time":4,
                                                            "recipe":{
                                                                "丝薇丽银":1,
                                                                "闪亮原色砂":2,
                                                                "安宁药膏":2,
                                                                "星导手杖":1
                                                            }
                                                        }
                                                    );
                                                }
                                                if(game.RecipeGroup.recipe[i].name=="苍蓝星笼"&&lilies.damage<8){
                                                    lilies.damage=8;
                                                    game.RecipeGroup.recipe.push(
                                                        {
                                                            "name":"银河星座",
                                                            "time":4,
                                                            "recipe":{
                                                                "黄金艾森矿":1,
                                                                "朔月暗雾":1,
                                                                "（气体）":2,
                                                                "苍蓝星笼":1
                                                            }
                                                        }
                                                    );
                                                }
                                                if(game.RecipeGroup.recipe[i].name=="银河星座"&&lilies.damage<10){
                                                    lilies.damage=10;
                                                    game.RecipeGroup.recipe.push(
                                                        {
                                                            "name":"大地之母",
                                                            "time":4,
                                                            "recipe":{
                                                                "精灵银块":1,
                                                                "生命之蜜":1,
                                                                "星之粉":2,
                                                                "银河星座":1
                                                            }
                                                        }
                                                    );
                                                }
                                                if(game.RecipeGroup.recipe[i].name=="大地之母"&&lilies.damage<15){
                                                    lilies.damage=15;
                                                    game.RecipeGroup.recipe.push(
                                                        {
                                                            "name":"天启与智慧之杖",
                                                            "time":4,
                                                            "recipe":{
                                                                "海银":1,
                                                                "翠岚之滴":1,
                                                                "百万水晶":1,
                                                                "大地之母":1
                                                            }
                                                        }
                                                    );
                                                }
                                                if(game.RecipeGroup.recipe[i].name=="旅人背心"&&lilies.maxHearts<8){
                                                    lilies.maxHearts=8;
                                                    lilies.hearts=lilies.maxHearts;
                                                    game.RecipeGroup.recipe.push(
                                                        {
                                                            "name":"飞翔之衣",
                                                            "time":4,
                                                            "recipe":{
                                                                "天鹅绒布":2,
                                                                "易熔金属":2,
                                                                "（布料）":1
                                                            }
                                                        }
                                                    );
                                                }
                                                if(game.RecipeGroup.recipe[i].name=="飞翔之衣"&&lilies.maxHearts<10){
                                                    lilies.maxHearts=10;
                                                    lilies.hearts=lilies.maxHearts;
                                                }
                                                setTimeout(() => {
                                                    game.Talk.clear();
                                                    game.Talk.hide();
                                                },1000);
                                                selectNum=0;
                                                select();
                                            }
                                        }
                                    }
                                }
                            })();
                        }
                    }
                    document.getElementById("continue").style.display="block";
                    document.getElementById("continue").innerHTML="继续游戏";
                    document.getElementById("continue").onclick=function(){
                        recipeContainer.innerHTML="";
                        document.getElementById("innerCanvasContainer").style.display="none";
                        game.PauseButtonGroup.hideAll();
                        game.status="running";
                        document.getElementById("continue").onclick=function(){
                            game.status="running";
                            game.PauseButtonGroup.hideAll();
                        }
                    }
                })();
            }
        }
        else if(this.in){
            this.in=false;
            document.getElementById("Ehint").style.display="none";
        }
    }
    draw(ctx){
        this.frameX=Math.floor(Frame/5)%3;
        super.draw(ctx);
    }
}
class dragon extends entity{
    constructor(gameWidth,gameHeight,img,x,y,width,height,spriteWidth,spriteHeight,DRAGON){
        super(gameWidth,gameHeight,img,x,y,width,height);
        this.spriteWidth=spriteWidth;
        this.spriteHeight=spriteHeight;
        this.DRAGON=DRAGON;
        if(!localStorage.getItem("LA-dragon-started-"+localStorage.getItem("LA-username"))){
            localStorage.setItem("LA-dragon-started-"+localStorage.getItem("LA-username"),JSON.stringify(false));
        }
    }
    update(game,lilies,input){
        if(JSON.parse(localStorage.getItem("LA-trial-final_fight"+localStorage.getItem("LA-username")))==true){
            localStorage.setItem("LA-trial-final_fight"+localStorage.getItem("LA-username"),JSON.stringify(false));
            localStorage.setItem("LA-dragon-started-"+localStorage.getItem("LA-username"),JSON.stringify(false));
            game.Entity.splice(game.Entity.indexOf(this),1);
            game.Map.entityGroup.splice(game.Map.entityGroup.indexOf(this.DRAGON),1);
            globalThis[game.Map.name].entity=game.Map.entityGroup;
            return;
        }
        if(this.y<=lilies.y+lilies.height&&this.y+this.height>=lilies.y&&this.x+this.width>lilies.x&&this.x<lilies.x+lilies.width){
            if(JSON.parse(localStorage.getItem("LA-dragon-started-"+localStorage.getItem("LA-username")))==false){
                localStorage.setItem("LA-dragon-started-"+localStorage.getItem("LA-username"),JSON.stringify(true));
                game.SaveManager.save(game);
                window.location.href="../minigame/final_fight/index.html";
            }
            else{
                lilies.getDamaged(999999,game);
                localStorage.setItem("LA-dragon-started-"+localStorage.getItem("LA-username"),JSON.stringify(false));
            }
        }
    }
}
class enemy extends entity{
    constructor(gameWidth,gameHeight,img,x,y,width,height,spriteWidth,spriteHeight,name,damage,hearts,actRange){
        super(gameWidth,gameHeight,img,x,y,width,height);
        this.spriteWidth=spriteWidth;
        this.spriteHeight=spriteHeight;
        this.name=name;
        this.damage=damage;
        this.maxHearts=hearts;
        this.hearts=hearts;
        this.actRange=actRange;
        this.invincible=false;
    }
    update(game,lilies,input){
        super.update();
        if(this.y<=lilies.y+lilies.height&&this.y+this.height>=lilies.y&&this.x+this.width>lilies.x&&this.x<lilies.x+lilies.width){
            lilies.getDamaged(this.damage,game);
        }
        if(lilies.atk!=null&&this.y<=lilies.atk.y+lilies.atk.height&&this.y+this.height>=lilies.atk.y&&this.x+this.width>lilies.atk.x&&this.x<lilies.atk.x+lilies.atk.width){
            this.getDamaged(lilies.damage,game);
        }
    }
    draw(ctx){
        ctx.fillText(this.name+" "+this.hearts+"/"+this.maxHearts,this.x,this.y-this.height/2);
        super.draw(ctx);
    }
    getDamaged(damage,game){
        if(!this.invincible){
            if(this.hearts-damage>0){
                this.hearts-=damage;
                this.invincible=true;
                setTimeout(()=>{
                    this.invincible=false;
                },1500);
            }
            else{
                game.Entity.splice(game.Entity.indexOf(this),1);
                game.getteditems.push(this);
            }
        }
    }
}
class dog extends enemy{
    constructor(gameWidth,gameHeight,img,x,y,width,height,spriteWidth,spriteHeight,name,damage,hearts){
        super(gameWidth,gameHeight,img,x,y,width,height,spriteWidth,spriteHeight,name,damage,hearts,[x,y,width,height]);
    }
    getDamaged(damage,game){
        if(!this.invincible){
            if(this.hearts-damage>0){
                this.hearts-=damage;
                this.invincible=true;
                setTimeout(()=>{
                    this.invincible=false;
                },1500);
            }
            else{
                game.bag.addItem("野兽毛皮",2,[30,30],["",""]);
                game.Talk.see("获得野兽毛皮x2");
                if(timeout){
                    clearTimeout(timeout);
                }
                timeout=setTimeout(()=>{
                    game.Talk.clear();
                    game.Talk.hide();
                    clearTimeout(timeout);
                },1000);
                game.Entity.splice(game.Entity.indexOf(this),1);
                game.getteditems.push(this);
            }
        }
    }
}
class puni extends enemy{
    constructor(gameWidth,gameHeight,img,x,y,width,height,spriteWidth,spriteHeight,name,damage,hearts,actRange){
        super(gameWidth,gameHeight,img,x,y,width,height,spriteWidth,spriteHeight,name,damage,hearts,actRange);
        this.vx=1;
        this.face="left";
    }
    update(game,lilies,input){
        super.update(game,lilies,input);
        if(this.x+this.width>=this.actRange[0]+this.actRange[2]||this.x+this.width>=gameWidth){
            this.face="right";
            this.vx=-this.vx;
        }
        if(this.x<=this.actRange[0]||this.x<=0){
            this.face="left";
            this.vx=-this.vx;
        }
    }
    draw(ctx){
        if(this.face=="right"){
            ctx.font="20px Lolita";
            super.draw(ctx);
        }
        else{
            ctx.font="20px Lolita";
            ctx.fillText(this.name+" "+this.hearts+"/"+this.maxHearts,this.x,this.y-this.height/2);
            ctx.save();
            ctx.scale(-1,1);
            ctx.drawImage(this.img,this.spriteWidth*this.frameX,this.spriteHeight*this.frameY,this.spriteWidth,this.spriteHeight,-this.x-this.width,this.y,this.width,this.height);
            ctx.restore();
        }
    }
}
class sellstore extends entity{
    constructor(gameWidth,gameHeight,x,y,width,height,name){
        super(gameWidth,gameHeight,0,x,y,width,height);
        this.name=name;
    }
    update(game,lilies,input){
        if(this.y<=lilies.y+lilies.height&&this.y+this.height>=lilies.y&&this.x+this.width>lilies.x&&this.x<lilies.x+lilies.width){
            this.in=true;
            document.getElementById("Ehint").style.display="block";
            if(input.key.indexOf(config.interact)>-1){
                (function select(){
                    document.getElementById("innerCanvas").innerHTML="";
                    document.getElementById("innerCanvasContainer").style.display="block";
                    document.getElementById("continue").innerHTML="继续游戏";
                    document.getElementById("continue").onclick=function(){
                        document.getElementById("innerCanvas").innerHTML="";
                        document.getElementById("innerCanvasContainer").style.display="none";
                        game.PauseButtonGroup.hideAll();
                        game.status="running";
                        document.getElementById("continue").onclick=function(){
                            game.status="running";
                            game.PauseButtonGroup.hideAll();
                        }
                    }
                    document.getElementById("continue").style.display="block";
                    game.status="pause";
                    for(let i=0;i<game.storage.item.length;i++){
                        if(game.storage.item[i].amount>0&&game.storage.item[i].price!=undefined){
                            let item=document.createElement("div");
                            item.className="itemContainer";
                            item.innerHTML="<img src=../img/item/"+game.storage.item[i].img+">"+game.storage.item[i].name[0]+"x"+game.storage.item[i].amount;
                            document.getElementById("innerCanvas").appendChild(item);
                            item.onclick=function(){
                                document.getElementById("continue").innerHTML="返回";
                                document.getElementById("continue").onclick=select;
                                document.getElementById("innerCanvas").innerHTML="";
                                let storage=JSON.parse(JSON.stringify(game.storage));
                                for(let j=0;j<storage.item[i].amount;j++){
                                    let price=Math.floor(storage.item[i].price*(1+storage.item[i].quality[j]/100));
                                    switch(storage.item[i].trait[j]){
                                        case "低价":
                                            price=Math.floor(price*0.8);
                                            break;
                                        case "低价+":
                                            price=Math.floor(price*0.6);
                                            break;
                                        case "低价++":
                                            price=Math.floor(price*0.4);
                                            break;
                                        case "量产品":
                                            price=Math.floor(price*0.2);
                                            break;
                                        case "无价":
                                            price=0;
                                            break;
                                        case "高价":
                                            price=Math.floor(price*1.1);
                                            break;
                                        case "高价+":
                                            price=Math.floor(price*1.3);
                                            break;
                                        case "高价++":
                                            price=Math.floor(price*1.5);
                                            break;
                                        case "限定价格":
                                            price=Math.floor(price*1.8);
                                            break;
                                        case "稀少的逸品":
                                            price=Math.floor(price*2.5);
                                            break;
                                    }
                                    let newItem=document.createElement("div");
                                    newItem.className="itemContainer";
                                    newItem.innerHTML="<img src=../img/item/"+storage.item[i].img+">"+storage.item[i].name[0]+"<br>品质"+storage.item[i].quality[j]+"<br>价格"+price+"<br>"+storage.item[i].trait[j];
                                    document.getElementById("innerCanvas").appendChild(newItem);
                                    newItem.onclick=function(){
                                        newItem.style.display="none";
                                        game.cash+=price;
                                        game.storage.useItem(storage.item[i].name[0],storage.item[i].quality[j],storage.item[i].trait[j]);
                                    }
                                }
                            }
                        }
                    }
                })();
            }
        }
        else if(this.in){
            this.in=false;
            document.getElementById("Ehint").style.display="none";
        }
    }
    draw(){}
}
class buyStore extends entity{
    constructor(gameWidth,gameHeight,x,y,width,height,map,name,goods){
        super(gameWidth,gameHeight,0,x,y,width,height);
        this.map=map;
        this.name=name;
        this.goods=goods;
        this.nowGoods=JSON.parse(JSON.stringify(goods));
        this.lasttimer=[];
        for(let i=0;i<this.goods.length;i++){
            this.lasttimer.push(0);
        }
    }
    update(game,lilies,input){
        if(game.Map.name==this.map){
            for(let i=0;i<this.goods.length;i++){
                if(this.goods[i].refreshTime!=-1&&game.timer-this.lasttimer[i]>=this.goods[i].refreshTime){
                    this.lasttimer[i]=game.timer;
                    this.nowGoods[i]=JSON.parse(JSON.stringify(this.goods[i]));
                }
            }
            if(this.y<=lilies.y+lilies.height&&this.y+this.height>=lilies.y&&this.x+this.width>lilies.x&&this.x<lilies.x+lilies.width){
                this.in=true;
                document.getElementById("Ehint").style.display="block";
                if(input.key.indexOf(config.interact)>-1){
                    (function select(){
                        document.getElementById("innerCanvas").innerHTML="";
                        document.getElementById("innerCanvasContainer").style.display="block";
                        document.getElementById("continue").innerHTML="继续游戏";
                        document.getElementById("continue").onclick=function(){
                            document.getElementById("innerCanvas").innerHTML="";
                            document.getElementById("innerCanvasContainer").style.display="none";
                            game.PauseButtonGroup.hideAll();
                            game.status="running";
                            document.getElementById("continue").onclick=function(){
                                game.status="running";
                                game.PauseButtonGroup.hideAll();
                            }
                        }
                        document.getElementById("continue").style.display="block";
                        game.status="pause";
                        for(let i=0;i<this.nowGoods.length;i++){
                            if(this.nowGoods[i].amount>0){
                                let item=document.createElement("div");
                                item.className="itemContainer";
                                item.innerHTML="<img src=../img/item/"+this.nowGoods[i].img+">"+this.nowGoods[i].name+"x"+this.nowGoods[i].amount;
                                document.getElementById("innerCanvas").appendChild(item);
                                item.onclick=()=>{
                                    document.getElementById("innerCanvas").innerHTML="";
                                    document.getElementById("continue").innerHTML="返回";
                                    document.getElementById("continue").onclick=select.bind(this);
                                    let nowgoods=JSON.parse(JSON.stringify(this.nowGoods));
                                    for(let j=0;j<nowgoods[i].amount;j++){
                                        let newItem=document.createElement("div");
                                        newItem.className="itemContainer";
                                        let price=Math.floor(nowgoods[i].price*(1+nowgoods[i].quality[j]/333));
                                        switch(nowgoods[i].trait[j]){
                                            case "低价":
                                                price=Math.floor(price*0.9);
                                                break;
                                            case "低价+":
                                                price=Math.floor(price*0.75);
                                                break;
                                            case "低价++":
                                                price=Math.floor(price*0.5);
                                                break;
                                            case "量产品":
                                                price=Math.floor(price*0.4);
                                                break;
                                            case "无价":
                                                price=Math.floor(price*0.25);
                                                break;
                                            case "高价":
                                                price=Math.floor(price*1.2);
                                                break;
                                            case "高价+":
                                                price=Math.floor(price*1.5);
                                                break;
                                            case "高价++":
                                                price=Math.floor(price*2);
                                                break;
                                            case "限定价格":
                                                price=Math.floor(price*2.5);
                                                break;
                                            case "稀少的逸品":
                                                price=Math.floor(price*4);
                                                break;
                                        }
                                        newItem.innerHTML="<img src=../img/item/"+nowgoods[i].img+">"+nowgoods[i].name+"<br>品质"+nowgoods[i].quality[j]+"<br>价格"+price+"<br>"+nowgoods[i].trait[j];
                                        document.getElementById("innerCanvas").appendChild(newItem);
                                        newItem.onclick=()=>{
                                            if(game.cash>=price){
                                                newItem.style.display="none";
                                                game.cash-=price;
                                                game.bag.addItem(nowgoods[i].name,1,[nowgoods[i].quality[j]],[nowgoods[i].trait[j]]);
                                                for(let k=0;k<this.nowGoods[i].amount;k++){
                                                    if(this.nowGoods[i].quality[k]==nowgoods[i].quality[j]&&this.nowGoods[i].trait[k]==nowgoods[i].trait[j]){
                                                        this.nowGoods[i].quality.splice(k,1);
                                                        this.nowGoods[i].trait.splice(k,1);
                                                        break;
                                                    }
                                                }
                                                this.nowGoods[i].amount--;
                                            }
                                            else{
                                                if(timeout){
                                                    clearTimeout(timeout);
                                                }
                                                game.Talk.see("钱不够");
                                                timeout=setTimeout(function(){
                                                    game.Talk.clear();
                                                    game.Talk.hide();
                                                },1000);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }.bind(this))();
                }
            }
            else if(this.in){
                this.in=false;
                document.getElementById("Ehint").style.display="none";
            }
        }
    }
    draw(){}
    save(){
        let username=localStorage.getItem("LA-username");
        localStorage.setItem("LA-save-buystore-"+username+this.name,JSON.stringify(this));
    }
    load(){
        let username=localStorage.getItem("LA-username");
        this.nowGoods=JSON.parse(localStorage.getItem("LA-save-buystore-"+username+this.name)).nowGoods;
        this.lasttimer=JSON.parse(localStorage.getItem("LA-save-buystore-"+username+this.name)).lasttimer;
    }
}
class trial extends entity{
    constructor(gameWidth,gameHeight,img,x,y,width,height,spriteWidth,spriteHeight,name,map,item,refreshTime){
        super(gameWidth,gameHeight,img,x,y,width,height);
        this.spriteWidth=spriteWidth;
        this.spriteHeight=spriteHeight;
        this.name=name;
        this.map=map;
        this.item=item;
        this.refreshTime=refreshTime;
        this.lasttimer=0;
        this.ifupdate=true;
        this.ifdraw=false;
    }
    update(game,lilies,input){
        if(game.Map.name==this.map){
            if(game.timer-this.lasttimer>=this.refreshTime){
                this.lasttimer=this.timer;
                this.ifupdate=true;
            }
            if(this.ifupdate){
                this.ifdraw=true;
            }
            if(this.ifupdate){
                if(this.y<=lilies.y+lilies.height&&this.y+this.height>=lilies.y&&this.x+this.width>lilies.x&&this.x<lilies.x+lilies.width){
                    this.in=true;
                    document.getElementById("Ehint").style.display="block";
                    if(input.key.indexOf(config.interact)>-1){
                        const username = localStorage.getItem("LA-username");
                        const preTrialPageKey = `LA-pre-trial-page-${username}`;
                        localStorage.setItem(preTrialPageKey, window.location.href);
                        this.ifupdate=false;
                        this.ifdraw=false;
                        document.getElementById("Ehint").style.display="none";
                        game.SaveManager.save(game);
                        window.location.href="../minigame/getting_beans/index.html";
                    }
                }
                else if(this.in){
                    this.in=false;
                    document.getElementById("Ehint").style.display="none";
                }
            }
            if(JSON.parse(localStorage.getItem("LA-trial-"+localStorage.getItem("LA-username")))==true){
                localStorage.setItem("LA-trial-"+localStorage.getItem("LA-username"),JSON.stringify(false));
                this.item.forEach(e=>{
                    game.bag.addItem(e.name,e.amount,e.quality,e.trait);
                });
            }
        }
        else{
            this.ifdraw=false;
        }
    }
    draw(ctx){
        if(this.ifdraw){
            this.frameX=this.frameX=Math.floor(Frame/2)%19;
            super.draw(ctx);
        }
    }
    save(){
        let username=localStorage.getItem("LA-username");
        localStorage.setItem("LA-save-trial-"+username+this.name,JSON.stringify(this));
    }
    load(){
        let username=localStorage.getItem("LA-username");
        this.ifupdate=JSON.parse(localStorage.getItem("LA-save-trial-"+username+this.name)).ifupdate;
        this.lasttimer=JSON.parse(localStorage.getItem("LA-save-trial-"+username+this.name)).lasttimer;
    }
}
class item extends entity{
    constructor(gameWidth,gameHeight,img,x,y,width,height,spriteWidth,spriteHeight,name,amount,quality,trait){
        super(gameWidth,gameHeight,img,x,y,width,height);
        this.spriteWidth=spriteWidth;
        this.spriteHeight=spriteHeight;
        this.name=name;
        this.amount=amount;
        this.quality=quality;
        this.trait=trait;
        this.hitbox=false;
    }
    update(game,lilies,input){
        if(this.y<=lilies.y+lilies.height&&this.y+this.height>=lilies.y&&this.x+this.width>lilies.x&&this.x<lilies.x+lilies.width){
            this.in=true;
            document.getElementById("Ehint").style.display="block";
            if(input.key.indexOf(config.interact)>-1){
                game.achievement.getAchievement("第一次采集",game);
                if(game.bag.itemAmount()+this.amount>game.bag.size){
                    game.Talk.see("背包已满");
                    if(timeout){
                        clearTimeout(timeout);
                    }
                    timeout=setTimeout(function(){
                        game.Talk.clear();
                        game.Talk.hide();
                        clearTimeout(timeout);
                    },1000);
                    return;
                }
                document.getElementById("Ehint").style.display="none";
                game.Talk.see("获得"+this.name+"x"+this.amount);
                if(timeout){
                    clearTimeout(timeout);
                }
                timeout=setTimeout(function(){
                    game.Talk.clear();
                    game.Talk.hide();
                    clearTimeout(timeout);
                },1000);
                game.timer=Number(game.timer)+4;
                game.bag.addItem(this.name,this.amount,this.quality,this.trait);
                game.Entity.splice(game.Entity.indexOf(this),1);
                game.getteditems.push(this);
            }
        }
        else if(this.in){
            this.in=false;
            document.getElementById("Ehint").style.display="none";
        }
    }
    draw(ctx){
        this.frameX=Math.floor(Frame/2)%19;
        super.draw(ctx);
    }
}
class needToolItem extends item{
    constructor(gameWidth,gameHeight,img,x,y,width,height,spriteWidth,spriteHeight,name,amount,quality,trait,needTool,use){
        super(gameWidth,gameHeight,img,x,y,width,height,spriteWidth,spriteHeight,name,amount,quality,trait);
        this.needTool=needTool;
        this.use=use;
    }
    update(game,lilies,input){
        this.toolID=game.storage.itemID(this.needTool);
        if(this.y<=lilies.y+lilies.height&&this.y+this.height>=lilies.y&&this.x+this.width>lilies.x&&this.x<lilies.x+lilies.width){
            this.in=true;
            document.getElementById("Ehint").style.display="block";
            if(input.key.indexOf(config.interact)>-1){
                if(game.storage.item[this.toolID].amount>0){
                    if(game.bag.itemAmount()+this.amount>game.bag.size){
                        game.Talk.see("背包已满");
                        if(timeout){
                            clearTimeout(timeout);
                        }
                        timeout=setTimeout(function(){
                            game.Talk.clear();
                            game.Talk.hide();
                            clearTimeout(timeout);
                        },1000);
                        return;
                    }
                    document.getElementById("Ehint").style.display="none";
                    game.Talk.see("获得"+this.name+"x"+this.amount);
                    if(this.use!=undefined){
                        game.storage.subItem(this.needTool,this.use);
                    }
                    if(timeout){
                        clearTimeout(timeout);
                    }
                    timeout=setTimeout(function(){
                        game.Talk.clear();
                        game.Talk.hide();
                        clearTimeout(timeout);
                    },1000);
                    game.timer=Number(game.timer)+4;
                    game.bag.addItem(this.name,this.amount,this.quality,this.trait);
                    game.Entity.splice(game.Entity.indexOf(this),1);
                    game.getteditems.push(this);
                }
                else{
                    game.Talk.see("你需要"+this.needTool+"才能采集");
                    if(timeout){
                        clearTimeout(timeout);
                    }
                    timeout=setTimeout(function(){
                        game.Talk.clear();
                        game.Talk.hide();
                        clearTimeout(timeout);
                    },1000);
                }
            }
        }
        else if(this.in){
            this.in=false;
            document.getElementById("Ehint").style.display="none";
        }
    }
}
class recipeItem extends item{
    constructor(gameWidth,gameHeight,img,x,y,width,height,spriteWidth,spriteHeight,name,recipe){
        super(gameWidth,gameHeight,img,x,y,width,height,spriteWidth,spriteHeight,name,1,[0],[""]);
        this.recipe=recipe;
    }
    update(game,lilies,input){
        if(this.y<=lilies.y+lilies.height&&this.y+this.height>=lilies.y&&this.x+this.width>lilies.x&&this.x<lilies.x+lilies.width){
            this.in=true;
            document.getElementById("Ehint").style.display="block";
            if(input.key.indexOf(config.interact)>-1){
                document.getElementById("Ehint").style.display="none";
                game.Talk.see("获得了"+this.name);
                if(timeout){
                    clearTimeout(timeout);
                }
                timeout=setTimeout(function(){
                    game.Talk.clear();
                    game.Talk.hide();
                    clearTimeout(timeout);
                },1000);
                game.timer=Number(game.timer)+4;
                this.recipe.recipe.forEach(it=>{
                    game.RecipeGroup.recipe.push(it);
                });
                game.Map.entityGroup.splice(game.Map.entityGroup.indexOf(this.recipe),1);
                game.Entity.splice(game.Entity.indexOf(this),1);
                globalThis[game.Map.name].entity=game.Map.entityGroup;
            }
        }
        else if(this.in){
            this.in=false;
            document.getElementById("Ehint").style.display="none";
        }
    }
}
class chest extends recipeItem{
    constructor(gameWidth,gameHeight,img,x,y,width,height,spriteWidth,spriteHeight,name,recipe,CHEST){
        super(gameWidth,gameHeight,img,x,y,width,height,spriteWidth,spriteHeight,name,recipe);
        this.CHEST=CHEST;
    }
    update(game,lilies,input){
        if(JSON.parse(localStorage.getItem("LA-trial-"+localStorage.getItem("LA-username")))==true){
            localStorage.setItem("LA-trial-"+localStorage.getItem("LA-username"),JSON.stringify(false));
            document.getElementById("Ehint").style.display="none";
            this.recipe.forEach(it=>{
                game.RecipeGroup.recipe.push(it);
            });
            game.Talk.see("获得了"+this.name);
            if(timeout){
                clearTimeout(timeout);
            }
            timeout=setTimeout(function(){
                game.Talk.clear();
                game.Talk.hide();
                clearTimeout(timeout);
            },1000);
            game.Entity.splice(game.Entity.indexOf(this),1);
            game.Map.entityGroup.splice(game.Map.entityGroup.indexOf(this.CHEST),1);
            globalThis[game.Map.name].entity=game.Map.entityGroup;
            return;
        }
        if(this.y<=lilies.y+lilies.height&&this.y+this.height>=lilies.y&&this.x+this.width>lilies.x&&this.x<lilies.x+lilies.width){
            this.in=true;
            document.getElementById("Ehint").style.display="block";
            if(input.key.indexOf(config.interact)>-1){
                const username = localStorage.getItem("LA-username");
                const preTrialPageKey = `LA-pre-trial-page-${username}`;
                localStorage.setItem(preTrialPageKey, window.location.href);
                document.getElementById("Ehint").style.display="none";
                game.SaveManager.save(game);
                window.location.href="../minigame/card_pairing/index.html";
            }
        }
        else if(this.in){
            this.in=false;
            document.getElementById("Ehint").style.display="none";
        }
    }
}
class hitbox{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.hitbox=true;
    }
    draw(){}
    update(){}
}
class text extends hitbox{
    constructor(x,y,width,height,text,once,TEXT){
        super(x,y,width,height);
        this.hitbox=false;
        this.once=once;
        this.text=text;
        this.index=0;
        this.TEXT=TEXT;
        this.fast=false;
        this.slow=false;
    }
    update(game,lilies=undefined,input){
        if(this.y<=game.Lilies.y+game.Lilies.height&&this.y+this.height>=game.Lilies.y&&this.x+this.width>game.Lilies.x&&this.x<game.Lilies.x+game.Lilies.width){
            game.status="talking";
            if(input.key.indexOf(config.interact)>-1){
                if(this.index>=this.text.length||game.Talk.index>=this.text[this.index].length){
                    if(this.index>=this.text.length){
                        if(this.once){
                            game.Map.entityGroup.splice(game.Map.entityGroup.indexOf(this.TEXT),1);
                            game.Entity.splice(game.Entity.indexOf(this),1);
                            globalThis[game.Map.name].entity=game.Map.entityGroup;
                        }
                        input.key.splice(input.key.indexOf(config.interact),1);
                        game.Talk.clear();
                        game.Talk.hide();
                        game.status="running";
                    }
                    else{
                        if(game.Talk.displayed){
                            this.index++;
                            this.fast=false;
                            this.slow=false;
                            game.Talk.clear();
                        }
                    }
                }
                else if(!this.fast){
                    this.fast=true;
                    this.slow=false;
                    clearTimeout(game.Talk.timeout);
                    game.Talk.display(this.text[this.index]?this.text[this.index]:"",10,game.Talk);
                }
            }
            else if(!this.slow){
                this.slow=true;
                this.fast=false;
                clearTimeout(game.Talk.timeout);
                game.Talk.display(this.text[this.index]?this.text[this.index]:"",25,game.Talk);
            }
            if(input.key.indexOf("control")>-1){
                clearTimeout(game.Talk.timeout);
                if(this.once){
                    game.Map.entityGroup.splice(game.Map.entityGroup.indexOf(this.TEXT),1);
                    game.Entity.splice(game.Entity.indexOf(this),1);
                    globalThis[game.Map.name].entity=game.Map.entityGroup;
                }
                input.key.splice(input.key.indexOf(config.interact),1);
                game.Talk.clear();
                game.Talk.hide();
                game.status="running";
                return;
            }
        }
    }
}