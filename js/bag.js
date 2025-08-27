class bag{
    constructor(size){
        this.size=size;
        this.item={
            "饮用水":0
        }
    }
    putin(otherBag){
        for(var key in otherBag.item){
            this.item[key]+=otherBag.item[key];
            otherBag.item[key]=0;
        }
    }
}