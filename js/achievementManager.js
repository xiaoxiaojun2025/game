class achievementManager{
    constructor(){
        this.achievements=[];
    }
    getAchievement(achievementName,game){
        let achievement=achievements.find(i=>i.name==achievementName);
        let getted=false;
        for(let i=0;i<this.achievements.length;i++){
            if(this.achievements[i].name==achievementName){
                getted=true;
            }
        }
        if(!getted){
            this.achievements.push(achievement);
            let AllAchievements=JSON.parse(localStorage.getItem("LA-AllAchievements-"+localStorage.getItem("LA-username")));
            let Allgetted=false;
            for(let i=0;i<AllAchievements.length;i++){
                if(AllAchievements[i].name==achievementName){
                    Allgetted=true;
                }
            }
            if(!Allgetted){
                AllAchievements.push(achievement);
            }
            localStorage.setItem("LA-AllAchievements-"+localStorage.getItem("LA-username"),JSON.stringify(AllAchievements));
            game.Talk.see("获得成就："+achievementName+"<br>");
            setTimeout(function(){
                game.Talk.clear();
                game.Talk.hide();
            },1000);
        }
    }
}

var achievements=[
    {
        "name":"打开炼金釜",
        "img":"achievement1.png"
    },
    {
        "name":"第一次调和",
        "img":"achievement1.png"
    },
    {
        "name":"第一次采集",
        "img":"achievement1.png"
    },
    {
        "name":"跑得快！",
        "img":"achievement2.png"
    },
    {
        "name":"小虫得豸",
        "img":"achievement2.png"
    },
    {
        "name":"这不是铁镐吗",
        "img":"achievement2.png"
    },
    {
        "name":"艺术就是爆炸！",
        "img":"achievement2.png"
    },
    {
        "name":"坏结局",
        "img":"achievement3.png"
    },
    {
        "name":"普通结局",
        "img":"achievement3.png"
    },
    {
        "name":"好结局",
        "img":"achievement3.png"
    },
    {
        "name":"真结局",
        "img":"achievement3.png"
    },
]