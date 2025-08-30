window.addEventListener('load', function() {
    const prevFullUrl = document.referrer;

    // 2. 定义需要判断的“目标相对路径”（根据你的实际需求修改）
    const targetRelativePaths = {
        path1: "../../../about.html",       
        path2: "../../group_introduce.html",   
    };

    const backBtn = document.getElementsByClassName('return_control')[0];


 
    if (prevFullUrl.includes("group_introduce.html")) {
        backBtn.href = targetRelativePaths.path2;
    }
    else {
        backBtn.href = targetRelativePaths.path1;
    } 
});