class map{
    constructor(map){
        this.name=map.name
        this.src=map;
        this.entityGroup=[];
        this.src.entity.forEach(e=>{
            this.entityGroup.push(e);
        });
        this.randomTrait();
        this.randonmQuality();
    }
    randomTrait(){
        this.entityGroup.forEach(e=>{
            if(e.type=="item"){
                let trait=[];
                for(let i=0;i<e.amount;i++){
                    trait.push(mapTraitGroup[this.name][Math.floor(Math.random()*mapTraitGroup[this.name].length)]);
                }
                e.trait=trait;
            }
        });
    }
    randonmQuality(){
        this.entityGroup.forEach(e=>{
            if(e.type=="item"){
                let quality=[];
                for(let i=0;i<e.amount;i++){
                    quality.push(mapQualityGroup[this.name][Math.floor(Math.random()*mapQualityGroup[this.name].length)]);
                }
                e.quality=quality;
            }
        });
    }
}
var buystore=[
    // {
    //     map:"pathNearAtelier",
    //     "name":"",
    //     "hitbox":[0,0,600,720],
    //     "goods":[
    //         {
    //             "name":"饮用水",
    //             "img":"drinking-water.webp",
    //             "amount":3,
    //             "quality":[10,10,10],
    //             "trait":["","",""],
    //             "price":10,
    //             "refreshTime":72
    //         }
    //     ],
    // }
]
var mapTraitGroup={
    "pathNearAtelier":[
        "",
        "",
        "",
        "",
        "",
        "品质提升",
        "低价",
        "高价"
    ],
    "pathToTheTown":[
        "",
        "",
        "",
        "",
        "",
        "品质提升",
        "品质提升",
        "品质提升",
        "品质提升+",
        "低价",
        "低价",
        "低价+",
        "高价",
        "高价"
    ],
    "CrystalCave":[
        "",
        "",
        "",
        "",        
        "品质提升",
        "品质提升",
        "品质提升",
        "品质提升+",
        "品质提升+",
        "品质提升++",
    ]
}
var mapQualityGroup={
    "pathNearAtelier":[
        5,
        5,
        10,
        10,
        10,
        10,
        20
    ],
    "pathToTheTown":[
        10,
        10,
        10,
        15,
        15,
        20,
        25
    ],
    "CrystalCave":[
        10,
        20,
        20,
        20,
        20,
        25,
        25,
        30,
        30,
        35,
        35
    ]
}

var atelier={
    "name":"atelier",
    "name1":"炼金工房",
    "background":"atelier.png",
    "entity":[
        {
            "type":"hitbox",//地板
            "hitbox":[0,640,1280,80]
        },
        {
            "type":"hitbox",//左侧墙
            "hitbox":[0,0,80,720]
        },
        {
            "type":"hitbox",//右侧墙
            "hitbox":[1200,0,80,370]
        },
        {
            "type":"hitbox",//门右边的碰撞箱
            "hitbox":[1280,240,80,480]
        },
        {
            "type":"door",
            "destinationMap":"pathNearAtelier",
            "destinationX":0,
            "destinationY":438,
            "hitbox":[1200,240,80,480]
        },
        {
            "type":"text",
            "hitbox":[200,540,200,100],
            "text":[
                "喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵",
                "测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试"
            ],
            "once":true
        },
        {
            "type":"pot",
            "hitbox":[240,320,254,320]
        }
    ]
}
var pathNearAtelier={
    "name":"pathNearAtelier",
    "name1":"工房旁小路",
    "background":"pathNearAtelier.png",
    "entity":[
        {
            "type":"hitbox",//地板
            "hitbox":[0,640,1360,80]
        },
        {
            "type":"hitbox",//左侧墙
            "hitbox":[0,0,80,393]
        },
        {
            "type":"hitbox",//上台阶
            "hitbox":[0,560,320,40]
        },
        {
            "type":"hitbox",//下台阶
            "hitbox":[0,600,360,400]
        },
        {
            "type":"hitbox",//右侧碰撞箱
            "hitbox":[1360,0,80,720]
        },
        {
            "type":"hitbox",//左门左边的碰撞箱
            "hitbox":[-80,393,80,167]
        },
        {
            "type":"door",
            "destinationMap":"atelier",
            "destinationX":1168,
            "destinationY":518,
            "hitbox":[0,393,80,167]
        },
        {
            "type":"entrance",
            "destinationMap":"pathToTheTown",
            "destinationX":0,
            "destinationY":518,
            "hitbox":[1280,0,80,720]
        },
        {
            "type":"item",
            "itemname":"饮用水",
            "amount":4,
            "quality":[],
            "trait":[],
            "hitbox":[732,504,128,128]
        },
        {
            "type":"item",
            "itemname":"寻常草",
            "amount":3,
            "quality":[],
            "trait":[],
            "hitbox":[465,550,90,90]
        },
        // {
        //     "type":"recipeItem",
        //     "name":"喵",
        //     "hitbox":[600,400,200,200],
        //     "recipe":[
        //         {
        //             "name":"丝薇丽银",
        //             "time":8,
        //             "recipe":{
        //                 "金属块":1,
        //                 "中和剂（红）":2,
        //                 "（石材）":2
        //             }
        //         },
        //         {
        //             "name":"黄金艾森矿",
        //             "time":16,
        //             "recipe":{
        //                 "丝薇丽银":1,
        //                 "中和剂（黄）":2,
        //                 "黄金色之岩":4
        //             }
        //         },
        //         {
        //             "name":"精灵银块",
        //             "time":32,
        //             "recipe":{
        //                 "黄金艾森矿":1,
        //                 "七色棱镜":1,
        //                 "残破矿石":3
        //             }
        //         },
        //         {
        //             "name":"海银",
        //             "time":64,
        //             "recipe":{
        //                 "精灵银块":1,
        //                 "黑洞":1,
        //                 "（神秘之力）":3
        //             }
        //         }
        //     ]
        // }
    ]
}
var pathToTheTown={
    "name":"pathToTheTown",
    "name1":"通往城镇的小路",
    "background":"pathToTheTown.png",
    "entity":[
        {
            "type":"hitbox",//地板左
            "hitbox":[-80,640,600,160]
        },
        {
            "type":"hitbox",//地板右
            "hitbox":[680,640,680,160]
        },
        {
            "type":"hitbox",//左侧碰撞箱
            "hitbox":[-160,0,80,720]
        },
        {
            "type":"hitbox",//右侧碰撞箱
            "hitbox":[1420,0,80,720]
        },
        {
            "type":"hitbox",//下侧碰撞箱
            "hitbox":[520,800,160,80]
        },
        {
            "type":"item",
            "itemname":"直木",
            "amount":5,
            "quality":[],
            "trait":[],
            "hitbox":[160,512,128,128]
        },
        {
            "type":"entrance",
            "destinationMap":"pathNearAtelier",
            "destinationX":1168,
            "destinationY":518,
            "hitbox":[-80,0,80,720]
        },
        {
            "type":"entrance",
            "destinationMap":"CrystalCave",
            "destinationX":250,
            "destinationY":0,
            "hitbox":[520,720,160,80]
        },
        {
            "type":"item",
            "itemname":"蓝色的花",
            "amount":2,
            "quality":[],
            "trait":[],
            "hitbox":[732,585,81,81]
        },
        {
            "type":"item",
            "itemname":"黄色的花",
            "amount":2,
            "quality":[],
            "trait":[],
            "hitbox":[838,594,66,66]
        },
        {
            "type":"item",
            "itemname":"红色的花",
            "amount":2,
            "quality":[],
            "trait":[],
            "hitbox":[920,594,66,66]
        },
        {
            "type":"item",
            "itemname":"绿色的花",
            "amount":2,
            "quality":[],
            "trait":[],
            "hitbox":[1014,588,85,85]
        },
        {
            "type":"item",
            "itemname":"白色的花",
            "amount":2,
            "quality":[],
            "trait":[],
            "hitbox":[1146,585,85,85]
        }
    ]
}
var CrystalCave={
    "name":"CrystalCave",
    "name1":"水晶洞穴",
    "background":"CrystalCave.jpg",
    "entity":[
        {
            "type":"hitbox",
            "hitbox":[0,0,250,80]
        },
        {
            "type":"hitbox",
            "hitbox":[640,0,250,80]
        },
        {
            "type":"hitbox",
            "hitbox":[960,0,320,96]
        },
        {
            "type":"hitbox",
            "hitbox":[260,150,160,10]
        },
        {
            "type":"hitbox",
            "hitbox":[430,350,160,10]
        },
        {
            "type":"hitbox",
            "hitbox":[100,450,160,10]
        },
        {
            "type":"hitbox",
            "hitbox":[1160,354,120,10]
        },
        {
            "type":"hitbox",
            "hitbox":[1000,440,160,10]
        },
        {
            "type":"hitbox",
            "hitbox":[0,640,1280,80]
        },
        {
            "type":"puni",
            "name":"蓝噗尼",
            "img":"blue-puni",
            "hitbox":[180,366,64,84],
            "actRange":[110,366,140,84],
            "damage":1,
            "hearts":8
        },
        {
            "type":"entrance",
            "destinationMap":"pathToTheTown",
            "destinationX":560,
            "destinationY":398,
            "hitbox":[250,-80,490,80]
        },
        {
            "type":"item",
            "itemname":"艾森矿",
            "amount":3,
            "quality":[],
            "trait":[],
            "hitbox":[1076,354,81,81]
        },
        {
            "type":"item",
            "itemname":"艾森矿",
            "amount":3,
            "quality":[],
            "trait":[],
            "hitbox":[105,555,81,81]
        },
        {
            "type":"item",
            "itemname":"白砂",
            "amount":4,
            "quality":[],
            "trait":[],
            "hitbox":[130,365,81,81]
        },
    ]
}