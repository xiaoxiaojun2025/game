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
        this.frameX=Math.floor(this.frame/30);
        if(lilies.face=="right"){
            this.face="right";
            this.x=lilies.x+lilies.width;
            this.y=lilies.y+lilies.height/2-this.height/2;
        }
        if(lilies.face=="left"){
            this.face="left";
            this.x=lilies.x-this.width;
            this.y=lilies.y+lilies.height/2-this.height/2;
        }
        if(this.frameX>=3){
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
        this.spriteWidth=55.75;
        this.spriteHeight=77;
        this.width=this.spriteWidth*width;
        this.height=this.spriteHeight*height;
        this.weight=1;
        this.face="right";
        this.jumped=false;
        this.damage=5;
        this.hearts=5;
        this.atk=null;
        this.invincible=false;
    }
    update(input,hitboxGroup){
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
        if(input.key.indexOf(config.left)>-1){
            if(this.frameY==0){
                this.frameY=1;
            }
            this.face="left";
            this.vx=-5;
        }
        else if(input.key.indexOf(config.right)>-1){
            if(this.frameY==0){
                this.frameY=1;
            }
            this.face="right";
            this.vx=5;
        }
        else{
            if(this.frameY==1){
                this.frameY=0;
            }
            this.vx=0;
        }
        if(input.key.indexOf(config.jump)>-1&&this.isOnFloor){
            if(!this.jumped){
                this.jumped=true;
                this.vy-=20;
            }
        }
        else if(!this.isOnFloor){
            this.vy+=this.weight;
        }
        else{
            if(input.key.indexOf(config.jump)==-1){
                this.jumped=false;
            }
            this.vy=0;
        }
        if(input.key.indexOf(config.attack)>-1&&this.atk==null){
            this.atk=new atk(this.gameWidth,this.gameHeight,document.getElementById("atk"),this.x+this.width,this.y+this.height/2-this.height*1.5,this.width/2,this.height*1.5);
        }
        if(this.atk!=null){
            this.atk.update(this);
        }
    }
    draw(ctx){
        this.frameX=Math.floor(Frame/10)%4;
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
                game.changeMap(atelier);
                game.bag.clear();
                game.timer+=72;
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
            if(input.key.indexOf(config.interact)>-1){
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
            input.key.splice(input.key.indexOf(config.interact),1);
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
            if(input.key.indexOf(config.interact)>-1){
                lilies.frameY=0;
                game.status="talking";
                game.achievement.getAchievement(ceshi,game);
                var recipeContainer=document.getElementById("innerCanvas");
                document.getElementById("innerCanvasContainer").style.display="block";
                for(let i=0;i<game.RecipeGroup.recipe.length;i++){
                    var recipe=document.createElement("div");
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
                    }
                    recipeContainer.appendChild(recipe);
                    recipe.onclick=function(){
                        recipeContainer.innerHTML="";
                        let page=0;
                        let itemID=[];
                        let usedItem=[];
                        let selectNum=0;
                        let recipeItemName=Object.keys(game.RecipeGroup.recipe[i].recipe);
                        let newQuality=0;
                        let newTrait="";
                        let storage=JSON.parse(JSON.stringify(game.storage));
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
                                            document.getElementById("innerCanvasContainer").style.display="none";
                                            game.PauseButtonGroup.hideAll();
                                            document.getElementById("continue").onclick=function(){
                                                game.status="running";
                                                game.PauseButtonGroup.hideAll();
                                            }
                                            usedItem.forEach(it=>{
                                                newQuality+=it.quality;
                                            });
                                            game.timer=Number(game.timer)+game.RecipeGroup.recipe[i].time;
                                            newQuality=Math.floor(newQuality/usedItem.length+Math.random()*5);
                                            newTrait=usedItem[0].trait;
                                            for(let l=1;l<usedItem.length;l++){
                                                if([newTrait,usedItem[l].trait].includes("品质提升")||[newTrait,usedItem[l].trait].includes("品质提升+")){
                                                    newTrait="品质提升++";
                                                }
                                                else if([newTrait,usedItem[l].trait].includes("品质提升+")||[newTrait,usedItem[l].trait].includes("品质提升++")){
                                                    newTrait="超级品质";
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
                                            game.status="running";
                                            game.Talk.see("成功制作"+game.RecipeGroup.recipe[i].name+"&emsp;消耗时间"+game.RecipeGroup.recipe[i].time+"小时"+"<br>品质："+newQuality);
                                            setTimeout(() => {
                                                game.Talk.clear();
                                                game.Talk.hide();
                                            },1000)
                                            selectNum=0;
                                        }
                                    }
                                }
                            }
                        })();
                    }
                }
                document.getElementById("continue").style.display="block";
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
            }
        }
    }
    draw(ctx){
        this.frameX=Math.floor(Frame/5)%3;
        super.draw(ctx);
    }
}
class enemy extends entity{
    constructor(gameWidth,gameHeight,img,x,y,width,height,spriteWidth,spriteHeight,name,damage,hearts,actRange){
        super(gameWidth,gameHeight,img,x,y,width,height);
        this.spriteWidth=spriteWidth;
        this.spriteHeight=spriteHeight;
        this.name=name;
        this.damage=damage;
        this.maxHearths=hearts;
        this.hearts=hearts;
        this.actRange=actRange;
        this.invincible=false;
    }
    draw(ctx){
        ctx.fillText(this.name+" "+this.hearts+"/"+this.maxHearths,this.x,this.y-this.height/2);
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
            }
        }
    }
}
class puni extends enemy{
    constructor(gameWidth,gameHeight,img,x,y,width,height,spriteWidth,spriteHeight,name,damage,hearts,actRange){
        super(gameWidth,gameHeight,img,x,y,width,height,spriteWidth,spriteHeight,name,damage,hearts,actRange);
        this.vx=2;
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
        if(this.y<=lilies.y+lilies.height&&this.y+this.height>=lilies.y&&this.x+this.width>lilies.x&&this.x<lilies.x+lilies.width){
            lilies.getDamaged(this.damage,game);
        }
        if(lilies.atk!=null&&this.y<=lilies.atk.y+lilies.atk.height&&this.y+this.height>=lilies.atk.y&&this.x+this.width>lilies.atk.x&&this.x<lilies.atk.x+lilies.atk.width){
            this.getDamaged(lilies.damage,game);
        }
    }
    draw(ctx){
        if(this.face=="right"){
            super.draw(ctx);
        }
        else{
            ctx.fillText(this.name+" "+this.hearts+"/"+this.maxHearths,this.x,this.y-this.height/2);
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
            if(input.key.indexOf(config.interact)>-1){
                document.getElementById("innerCanvasContainer").style.display="block";
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
                            document.getElementById("innerCanvas").innerHTML="";
                            let storage=JSON.parse(JSON.stringify(game.storage));
                            for(let j=0;j<storage.item[i].amount;j++){
                                let price=Math.floor(storage.item[i].price*(1+storage.item[i].quality[j]/333));
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
            }
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
        this.nowGoods=goods;
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
                    this.nowGoods[i]=this.goods[i];
                }
            }
            if(this.y<=lilies.y+lilies.height&&this.y+this.height>=lilies.y&&this.x+this.width>lilies.x&&this.x<lilies.x+lilies.width){
                if(input.key.indexOf(config.interact)>-1){
                    document.getElementById("innerCanvasContainer").style.display="block";
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
                                    }
                                    newItem.innerHTML="<img src=../img/item/"+nowgoods[i].img+">"+nowgoods[i].name+"<br>品质"+nowgoods[i].quality[j]+"<br>价格"+price+"<br>"+nowgoods[i].trait[j];
                                    document.getElementById("innerCanvas").appendChild(newItem);
                                    newItem.onclick=()=>{
                                        if(game.cash>=price){
                                            game.cash-=price;
                                            game.bag.addItem(nowgoods[i].name,1,[nowgoods[i].quality[j]],[nowgoods[i].trait[j]]);
                                            for(let k=0;k<this.nowGoods[i].amount;k++){
                                                if(this.nowGoods[i].quality[k]==nowgoods[i].quality[j]&&this.nowGoods[i].trait[k]==nowgoods[i].trait[j]){
                                                    this.nowGoods[i].quality.splice(k,1);
                                                    this.nowGoods[i].trait.splice(k,1);
                                                    break;
                                                }
                                            }
                                            this.nowgoods[i].amount--;
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
                }
            }
        }
    }
    draw(){}
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
            if(!this.displayed){
                game.Talk.see(this.name+"x"+this.amount);
            }
            this.displayed=true;
            if(input.key.indexOf(config.interact)>-1){
                if(game.bag.itemAmount()+this.amount>game.bag.size){
                    game.Talk.see("背包已满");
                    return;
                }
                game.timer=Number(game.timer)+4;
                game.bag.addItem(this.name,this.amount,this.quality,this.trait);
                game.Entity.splice(game.Entity.indexOf(this),1);
                this.displayed=false;
                game.Talk.clear();
                game.Talk.hide();
            }
        }
        else if(game.Talk.displayed&&this.displayed){
            this.displayed=false;
            game.Talk.clear();
            game.Talk.hide();
        }
    }
    draw(ctx){
        this.frameX=Math.floor(Frame/2)%19;
        super.draw(ctx);
    }
}
class recipeItem extends item{
    constructor(gameWidth,gameHeight,img,x,y,width,height,spriteWidth,spriteHeight,recipe){
        super(gameWidth,gameHeight,img,x,y,width,height,spriteWidth,spriteHeight,recipe.recipe.name,1,[0],[""]);
        this.recipe=recipe;
    }
    update(game,lilies,input){
        if(this.y<=lilies.y+lilies.height&&this.y+this.height>=lilies.y&&this.x+this.width>lilies.x&&this.x<lilies.x+lilies.width){
            this.displayed=true;
            game.Talk.see(this.recipe.name);
            if(input.key.indexOf(config.interact)>-1){
                this.recipe.recipe.forEach(it=>{
                    game.RecipeGroup.recipe.push(it);
                });
                game.Map.entityGroup.splice(game.Map.entityGroup.indexOf(this.recipe),1);
                game.Entity.splice(game.Entity.indexOf(this),1);
                globalThis[game.Map.name].entity=game.Map.entityGroup;
                this.displayed=false;
                game.Talk.clear();
                game.Talk.hide();
            }
        }
        else if(game.Talk.displayed&&this.displayed){
            this.displayed=false;
            game.Talk.clear();
            game.Talk.hide();
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
                    game.Talk.display(this.text[this.index]?this.text[this.index]:"",100,game.Talk);
                }
            }
            else if(!this.slow){
                this.slow=true;
                this.fast=false;
                clearTimeout(game.Talk.timeout);
                game.Talk.display(this.text[this.index]?this.text[this.index]:"",20,game.Talk);
            }
        }
    }
}