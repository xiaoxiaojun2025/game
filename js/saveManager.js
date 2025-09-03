class saveMap{
    constructor(){
        this.atelier=atelier;
        this.pathNearAtelier=pathNearAtelier;
        this.pathToTheTown=pathToTheTown;
    }
}
class saveManager{
    constructor(game){
        this.username=localStorage.getItem("LA-username");
        this.init(game)
    }
    init(game){
        if(!localStorage.getItem("LA-save-"+this.username)){
            game.changeMap(atelier);
            this.save(game);
        }
    }
    save(game){
        this.storage=game.storage.item;
        this.bag=game.bag.item;
        this.pos=[game.Lilies.x,game.Lilies.y];
        this.RecipeGroup=game.RecipeGroup;
        this.position=game.Map.name;
        this.map=new saveMap;
        this.timer=game.timer;
        this.event=game.eventChecker.event;
        this.achievement=game.achievement.achievements;
        this.cash=game.cash;
        this.hearts=game.Lilies.hearts;
        this.damage=game.Lilies.damage;
        this.getteditems=game.getteditems;
        localStorage.setItem("LA-save-"+this.username,true);
        localStorage.setItem("LA-save-"+this.username+"storage",JSON.stringify(this.storage));
        localStorage.setItem("LA-save-"+this.username+"bag",JSON.stringify(this.bag));
        localStorage.setItem("LA-save-"+this.username+"pos",JSON.stringify(this.pos));
        localStorage.setItem("LA-save-"+this.username+"RecipeGroup",JSON.stringify(this.RecipeGroup));
        localStorage.setItem("LA-save-"+this.username+"position",JSON.stringify(this.position));
        localStorage.setItem("LA-save-"+this.username+"map",JSON.stringify(this.map));
        localStorage.setItem("LA-save-"+this.username+"timer",JSON.stringify(this.timer));
        localStorage.setItem("LA-save-"+this.username+"event",JSON.stringify(this.event));
        localStorage.setItem("LA-save-"+this.username+"achievement",JSON.stringify(this.achievement));
        localStorage.setItem("LA-save-"+this.username+"cash",JSON.stringify(this.cash));
        localStorage.setItem("LA-save-"+this.username+"hearts",JSON.stringify(this.hearts));
        localStorage.setItem("LA-save-"+this.username+"damage",JSON.stringify(this.damage));
        localStorage.setItem("LA-save-"+this.username+"getteditems",JSON.stringify(this.getteditems));
        for(let i=0;i<game.permanentEntity.length;i++){
            game.permanentEntity[i].save();
        }
    }
    load(game){
        this.storage=JSON.parse(localStorage.getItem("LA-save-"+this.username+"storage"));
        this.bag=JSON.parse(localStorage.getItem("LA-save-"+this.username+"bag"));
        this.pos=JSON.parse(localStorage.getItem("LA-save-"+this.username+"pos"));
        this.RecipeGroup=JSON.parse(localStorage.getItem("LA-save-"+this.username+"RecipeGroup"));
        this.position=JSON.parse(localStorage.getItem("LA-save-"+this.username+"position"));
        this.map=JSON.parse(localStorage.getItem("LA-save-"+this.username+"map"));
        this.timer=JSON.parse(localStorage.getItem("LA-save-"+this.username+"timer"));
        this.event=JSON.parse(localStorage.getItem("LA-save-"+this.username+"event"));
        this.achievement=JSON.parse(localStorage.getItem("LA-save-"+this.username+"achievement"));
        this.cash=JSON.parse(localStorage.getItem("LA-save-"+this.username+"cash"));
        this.hearts=JSON.parse(localStorage.getItem("LA-save-"+this.username+"hearts"));
        this.damage=JSON.parse(localStorage.getItem("LA-save-"+this.username+"damage"));
        this.getteditems=JSON.parse(localStorage.getItem("LA-save-"+this.username+"getteditems"));
        game.storage.item=this.storage;
        game.bag.item=this.bag;
        game.Lilies.x=this.pos[0];
        game.Lilies.y=this.pos[1];
        game.RecipeGroup=this.RecipeGroup;
        for(let key in this.map){
            globalThis[this.map[key].name]=this.map[key];
        }
        game.timer=this.timer;
        game.eventChecker.event=this.event;
        game.achievement.achievements=this.achievement;
        game.cash=this.cash;
        game.Lilies.hearts=this.hearts;
        game.Lilies.damage=this.damage;
        for(let i=0;i<game.permanentEntity.length;i++){
            game.permanentEntity[i].load();
        }
        game.changeMap(eval(this.position));
        game.getteditems=this.getteditems;
        for(let i=0;i<game.Entity.length;i++){
            if(game.Entity[i] instanceof item){
                for(let j=0;j<this.getteditems.length;j++){
                    if(game.Entity[i].name==this.getteditems[j].name&&game.Entity[i].x==this.getteditems[j].x&&game.Entity[i].y==this.getteditems[j].y){
                        game.Entity.splice(i,1);
                    }
                }
            }
        }
    }
}