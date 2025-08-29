class config{
    constructor(){
        this.username=localStorage.getItem("LA-username");
        this.config=JSON.parse(localStorage.getItem("LA-config-"+this.username));
        this.optionButtons=document.getElementsByClassName("options");
        this.init();
        this.setOption=this.setOption.bind(this);
    }
    init(){
        for(let i=0;i<this.optionButtons.length;i++){
            this.setOption(this,this.optionButtons[i].id,i);
        }
    }
    setOption(config,option,i){
        if(config.config[option]==" "){
            config.optionButtons[i].innerHTML="Space";
        }
        else{
            config.optionButtons[i].innerHTML=config.config[option];
        }        
        config.optionButtons[i].onclick=()=>{
            config.optionButtons[i].innerHTML="请按键";
            window.addEventListener("keydown",function keydown(e){
                config.config[option]=e.key;
                localStorage.setItem("LA-config-"+config.username,JSON.stringify(config.config));
                window.removeEventListener("keydown",keydown);
                config.setOption(config,option,i);
            });
        }
    }
}
window.addEventListener("load",()=>{
    new config();
});