class saveMap{
    constructor(){
        this.ateliter=ateliter;
        this.A=A;
    }
}
class saveManager{
    constructor(game){
        this.username=localStorage.getItem("LA-username");
        this.init(game)
    }
    init(game){
        if(!localStorage.getItem("LA-save-"+this.username)){
            game.changeMap(ateliter);
            this.save(game);
        }
    }
    save(game){
        this.storage=game.storage.item;
        this.bag=game.bag.item;
        this.pos=[game.Lilies.x,game.Lilies.y];
        this.position=game.Map.name;
        this.map=new saveMap;
        localStorage.setItem("LA-save-"+this.username,true);
        localStorage.setItem("LA-save-"+this.username+"storage",JSON.stringify(this.storage));
        localStorage.setItem("LA-save-"+this.username+"bag",JSON.stringify(this.bag));
        localStorage.setItem("LA-save-"+this.username+"pos",JSON.stringify(this.pos));
        localStorage.setItem("LA-save-"+this.username+"position",JSON.stringify(this.position));
        localStorage.setItem("LA-save-"+this.username+"map",JSON.stringify(this.map));
    }
    load(game){
        this.storage=JSON.parse(localStorage.getItem("LA-save-"+this.username+"storage"));
        this.bag=JSON.parse(localStorage.getItem("LA-save-"+this.username+"bag"));
        this.pos=JSON.parse(localStorage.getItem("LA-save-"+this.username+"pos"));
        this.position=JSON.parse(localStorage.getItem("LA-save-"+this.username+"position"));
        this.map=JSON.parse(localStorage.getItem("LA-save-"+this.username+"map"));
        game.storage.item=this.storage;
        game.bag.item=this.bag;
        game.Lilies.x=this.pos[0];
        game.Lilies.y=this.pos[1];
        for(let key in this.map){
            globalThis[this.map[key].name]=this.map[key];
            console.log(globalThis[this.map[key].name]);
        }
        game.changeMap(eval(this.position));
    }
}