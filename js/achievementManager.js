class achievementManager{
    constructor(){
        this.achievements=[];
    }
    getAchievement(achievement,game){
        if(this.achievements.indexOf(achievement)==-1){
            this.achievements.push(achievement);
            let AllAchievements=JSON.parse(localStorage.getItem("LA-AllAchievements-"+localStorage.getItem("LA-username")));
            if(AllAchievements.indexOf(achievement)==-1){
                AllAchievements.push(achievement);
            }
            localStorage.setItem("LA-AllAchievements-"+localStorage.getItem("LA-username"),JSON.stringify(AllAchievements));
            game.Talk.see("获得成就："+achievement.name+"<br>");
            setTimeout(function(){
                game.Talk.clear();
                game.Talk.hide();
            },1000);
        }
    }
}

var ceshi={
    "img":"",
    "name":"测试"
}