class config{
    constructor(){
        this.username=localStorage.getItem("LA-username");
        this.config=JSON.parse(localStorage.getItem("LA-config-"+this.username));
        this.optionButtons=document.getElementsByClassName("options");
        this.init();
    }
    init(){
        for(let key in this.optionButtons){
            if(this.optionButtons[key].id=="up"){
                function a(){
                    this.optionButtons[key].innerHTML=this.config.up;
                    this.optionButtons[key].onclick=()=>{
                        this.optionButtons[key].innerHTML="请按键";
                        
                    }
                }
            }
        }
    }
}
window.addEventListener("load",()=>{
    var Config=new config();
});