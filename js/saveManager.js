class saveManager{
    constructor(game){
        this.storage=game.storage.item;
        this.bag=game.bag.item;
        this.init();
        this.Lilies.x=game.Lilies.x;
        this.Lilies.y=game.Lilies.y;
        
    }
    init(){
        if(!localStorage.getItem(JSON.parse("LA-save-"+localStorage.getItem("LA-username")))){
            localStorage.setItem("LA-save-"+localStorage.getItem("LA-username"),)
        }
    }
}