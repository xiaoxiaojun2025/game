function hint(text){
    document.getElementById("login-hint").textContent=text;
}
function login(){
    var UN=document.getElementById("login-username").value;
    var PW=document.getElementById("login-password").value;
    if(!UN||!PW){
        hint("请填写用户名与密码");
        return;
    }
    if(!localStorage.getItem("LA-user-"+UN)){
        hint("用户不存在");
        return;
    }
    if(localStorage.getItem("LA-user-"+UN)!=PW){
        hint("密码错误");
        return;
    }
    localStorage.setItem("LA-username",UN);
    window.location.href="../index.html";
}
function register(){
    var UN=document.getElementById("login-username").value;
    var PW=document.getElementById("login-password").value;
    if(!UN||!PW){
        hint("请填写用户名与密码");
        return;
    }
    if(localStorage.getItem("LA-user-"+UN)){
        hint("用户已存在");
        return;
    }
    localStorage.setItem("LA-user-"+UN,PW);
    localStorage.setItem("LA-username",UN);
    window.location.href="../index.html";
}