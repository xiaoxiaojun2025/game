class bag{
    constructor(size){
        this.size=size;
        this.init();
    }
    putin(otherBag){
        for(var key in otherBag.item){
            this.item[key]+=otherBag.item[key];
            otherBag.item[key]=0;
        }
    }
    init(){
        this.item=[
            {
                "name":"饮用水",
                "img":"",
                "amount":0
            }
        ]
    }
}