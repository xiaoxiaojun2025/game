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
class lilies extends entity{
    constructor(gameWidth,gameHeight,img,x,y,width,height){
        super(gameWidth,gameHeight,img,x,y,0,0);
        this.spriteWidth=55.75;
        this.spriteHeight=77;
        this.width=this.spriteWidth*width;
        this.height=this.spriteHeight*height;
        this.weight=0.3;
        this.face="right";
    }
    update(input,hitboxGroup){
        var isOnFloor=false;
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
                        isOnFloor=true;
                        this.y=hitbox.y-this.height;
                    }
                }
            }
        });
        if(input.key.indexOf(config.left)>-1){
            this.frameY=1;
            this.face="left";
            this.vx=-2;
        }
        else if(input.key.indexOf(config.right)>-1){
            this.frameY=1;
            this.face="right";
            this.vx=2;
        }
        else{
            this.frameY=0;
            this.vx=0;
        }
        if(input.key.indexOf(config.jump)>-1&&isOnFloor){
            this.vy-=12;
        }
        else if(!isOnFloor){
            this.vy+=this.weight;
        }
        else{
            this.vy=0;
        }
    }
    draw(ctx){
        this.frameX=Math.floor(Frame/60)%4;
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
        if(this.y<=lilies.y+lilies.height&&this.y+this.height>=lilies.y&&this.x+this.width>lilies.x&&this.x<lilies.x+lilies.width){
            if(input.key.indexOf(config.interact)>-1){
                lilies.frameY=0;
                game.status="talking";
                var recipeContainer=document.getElementsByClassName("innerCanvasContainer")[0];
                recipeContainer.style.display="block";
                for(let i=0;i<game.RecipeGroup.recipe.length;i++){
                    var recipe=document.createElement("div");
                    recipe.className="itemContainer";
                    recipe.innerHTML=game.RecipeGroup.recipe[i].name+"<br>配方:<br>";
                    for(let key in game.RecipeGroup.recipe[i].recipe){
                        recipe.innerHTML+=key+"x"+game.RecipeGroup.recipe[i].recipe[key]+"<br>";
                    }
                    recipeContainer.appendChild(recipe);
                    recipe.onclick=function(){
                        recipeContainer.innerHTML="";
                        let page=0;
                        let itemID=0;
                        let usedItem=[];
                        let selectNum=0;
                        let recipeItemName=Object.keys(game.RecipeGroup.recipe[i].recipe);
                        let newQuality=0;
                        let newTrait="";
                        let storage=JSON.parse(JSON.stringify(game.storage));
                        (function craft(){
                            for(let j=0;j<game.storage.item.length;j++){
                                if(game.storage.item[j].name==recipeItemName[page]){
                                    itemID=j;
                                    break;
                                }
                            }
                            for(let j=0;j<game.storage.item[itemID].amount;j++){
                                let newItem=document.createElement("div");
                                newItem.className="itemContainer";
                                newItem.innerHTML=game.storage.item[itemID].name+"<br>品质"+game.storage.item[itemID].quality[j]+"<br>"+game.storage.item[itemID].trait[j];
                                document.getElementsByClassName("innerCanvasContainer")[0].appendChild(newItem);
                                newItem.onclick=function(){
                                    newItem.style.display="none";
                                    let usingItem={
                                        "name":storage.item[itemID].name,
                                        "quality":storage.item[itemID].quality[j],
                                        "trait":storage.item[itemID].trait[j]
                                    }
                                    usedItem.push(usingItem);
                                    game.storage.useItem(storage.item[itemID].name,storage.item[itemID].quality[j],storage.item[itemID].trait[j]);
                                    selectNum++;
                                    if(selectNum>=game.RecipeGroup.recipe[i].recipe[recipeItemName[page]]){
                                        page++;
                                        if(page<recipeItemName.length){
                                            recipeContainer.innerHTML="";
                                            craft();
                                            return;
                                        }
                                        recipeContainer.innerHTML="";
                                        recipeContainer.style.display="none";
                                        game.PauseButtonGroup.hideAll();
                                        document.getElementById("continue").onclick=function(){
                                            game.status="running";
                                            game.PauseButtonGroup.hideAll();
                                        }
                                        usedItem.forEach(it=>{
                                            newQuality+=it.quality;
                                        });
                                        game.timer=Number(game.timer)+game.RecipeGroup.recipe[i].time;
                                        newQuality=Math.floor(newQuality/usedItem.length);
                                        newTrait=usedItem[0].trait;
                                        switch(newTrait){
                                            case "好喝":
                                                newQuality+=Math.floor(newQuality/5);
                                                break;
                                        }
                                        game.storage.addItem(game.RecipeGroup.recipe[i].name,1,[newQuality],[newTrait]);
                                        game.status="running";
                                        selectNum=0;
                                    }
                                }
                            }
                        })();
                    }
                }
                document.getElementById("continue").style.display="block";
                document.getElementById("continue").onclick=function(){
                    recipeContainer.innerHTML="";
                    recipeContainer.style.display="none";
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
        this.frameX=Math.floor(Frame/20)%3;
        super.draw(ctx);
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
            game.Talk.see(this.name+"x"+this.amount);
            if(input.key.indexOf(config.interact)>-1){
                game.timer=Number(game.timer)+3;
                game.bag.addItem(this.name,this.amount,this.quality,this.trait);
                game.Entity.splice(game.Entity.indexOf(this),1);
                game.Talk.clear();
                game.Talk.hide();
            }
        }
        else if(game.Talk.displayed==true){
            game.Talk.clear();
            game.Talk.hide();
        }
    }
}
class recipeItem extends item{
    constructor(gameWidth,gameHeight,img,x,y,width,height,spriteWidth,spriteHeight,recipe){
        super(gameWidth,gameHeight,img,x,y,width,height,spriteWidth,spriteHeight,recipe.recipe.name,1,[0],[""]);
        this.recipe=recipe;
    }
    update(game,lilies,input){
        if(this.y<=lilies.y+lilies.height&&this.y+this.height>=lilies.y&&this.x+this.width>lilies.x&&this.x<lilies.x+lilies.width){
            if(input.key.indexOf(config.interact)>-1){
                game.RecipeGroup.recipe.push(this.recipe.recipe);
                game.Map.entityGroup.splice(game.Map.entityGroup.indexOf(this.recipe),1);
                game.Entity.splice(game.Entity.indexOf(this),1);
                globalThis[game.Map.name].entity=game.Map.entityGroup;
            }
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
                            game.Talk.clear();
                        }
                    }
                }
                else if(!this.fast){
                    this.fast=true;
                    this.slow=false;
                    clearTimeout(game.Talk.timeout);
                    game.Talk.display(this.text[this.index],50,game.Talk);
                }
            }
            else if(!this.slow){
                this.slow=true;
                this.fast=false;
                clearTimeout(game.Talk.timeout);
                game.Talk.display(this.text[this.index],20,game.Talk);
            }
        }
    }
}