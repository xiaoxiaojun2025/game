class recipeGroup{
    constructor(){
        this.init()
    }
    init(){
        this.recipe=[
            {
                "name":"山师之药",
                "recipe":{
                    "饮用水":1
                }
            }
        ]
    }
    craft(name,bag){
        var item=null;
        this.recipe.forEach(r=>{
            if(r.name==name){
                item=r;
            }
        });
        for(var key in item.recipe){
            bag.item.forEach(i=>{
                if(i.name==key){
                    if(i.amount<item.recipe[key]){
                        return false;
                    }
                }
            });
        }
        for(var key in item.recipe){
            bag.subItem(key,item.recipe[key]);
        }
        bag.addItem(item.name,1);
        return true;
    }
}