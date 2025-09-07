const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 适配屏幕大小
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 图片加载
const bgImg = new Image();
const heroImg = new Image();
const monsterImg = new Image();
bgImg.src = "assets/bg.png";
heroImg.src = "assets/hero.png";
monsterImg.src = "assets/monster.png";

// 游戏数据
let heroHP = 100;
let monsterHP = 100;
let gameOver = false;

const hero = { x: canvas.width * 0.2, y: canvas.height * 0.6+90, w: 80, h: 120 };
const monster = { x: canvas.width * 0.7-200, y: canvas.height * 0.5-50, w: 500, h: 400 };

// 更新血条
function drawHealthBar(x, y, hp, maxHP) {
  const barWidth = 150;
  const barHeight = 20;

  ctx.fillStyle = "red";
  ctx.fillRect(x, y, barWidth, barHeight);

  ctx.fillStyle = "lime";
  ctx.fillRect(x, y, (hp / maxHP) * barWidth, barHeight);

  ctx.strokeStyle = "white";
  ctx.strokeRect(x, y, barWidth, barHeight);
}

// 渲染场景
function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 背景
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // 英雄
  ctx.drawImage(heroImg, hero.x, hero.y, hero.w, hero.h);
  drawHealthBar(hero.x, hero.y - 30, heroHP, 100);

  // 怪物
  ctx.drawImage(monsterImg, monster.x, monster.y, monster.w, monster.h);
  drawHealthBar(monster.x, monster.y - 30, monsterHP, 100);

  // 游戏结束提示
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "60px 微软雅黑";
    ctx.textAlign = "center";
    ctx.fillText(
      heroHP <= 0 ? "游戏失败！怪物胜利！" : "胜利！勇士打败了怪物！",
      canvas.width / 2,
      canvas.height / 2
    );
    drawReturnButton();
  }
}

// 战斗日志
function logBattle(msg) {
  if (gameOver) return; // 结束后不再记录
  const log = document.getElementById("battle-log");
  log.innerHTML += msg + "<br>";
  log.scrollTop = log.scrollHeight;
}

// 判断胜负
function checkGameOver() {
  if (monsterHP <= 0 || heroHP <= 0) {
    gameOver = true;
    disableControls();
    const isWin = heroHP > 0; // 判断是否胜利
    logBattle("⚔ 战斗结束！" + (isWin ? "你获得了胜利！" : "你失败了！"));
    
    // 存储游戏结果到localStorage
    saveGameResult(isWin);
    
    // 绘制返回按钮（游戏结束后显示）
    drawReturnButton();
  }
}
// 新增：存储游戏结果到localStorage
function saveGameResult(isWin) {
  // 获取用户名，无则用默认值
  const username = localStorage.getItem("LA-username") || "defaultPlayer";
  // 按照约定的键名存储结果（胜利为true，失败为false）
  const resultKey = `LA-trial-final_fight${username}`;
  localStorage.setItem(resultKey, JSON.stringify(isWin));
  console.log("游戏结果已存储：", resultKey, "=", isWin);
}
// 新增：绘制返回按钮
function drawReturnButton() {
  // 绘制按钮背景
  ctx.fillStyle = "#f8d347";
  ctx.fillRect(canvas.width / 2 - 120, canvas.height / 2 + 80, 240, 60);
  
  // 绘制按钮文字
  ctx.fillStyle = "#222";
  ctx.font = "28px 微软雅黑";
  ctx.textAlign = "center";
  ctx.fillText("返回大游戏", canvas.width / 2, canvas.height / 2 + 120);
}
// 新增：处理返回按钮点击
canvas.addEventListener('click', function(e) {
  if (gameOver) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // 检查是否点击了返回按钮区域
    if (clickX >= canvas.width / 2 - 120 && 
        clickX <= canvas.width / 2 + 120 && 
        clickY >= canvas.height / 2 + 80 && 
        clickY <= canvas.height / 2 + 140) {
      returnToMainGame();
    }
  }
});

// 新增：返回大游戏页面
function returnToMainGame() {
  const username = localStorage.getItem("LA-username") || "defaultPlayer";
  // 读取进入小游戏前的页面路径
  const preGamePathKey = `LA-pre-trial-page-${username}`;
  const preGameUrl = localStorage.getItem(preGamePathKey);
  
  // 优先返回原页面，无则使用默认路径
  if (preGameUrl) {
    window.location.href = preGameUrl;
    // 清除已使用的路径记录
    localStorage.removeItem(preGamePathKey);
  } else {
    // 替换为你的大游戏首页路径
    window.location.href = "../../index.html";
  }
}

// 按钮功能
function attack() {
  if (gameOver) return;
  monsterHP = Math.max(0, monsterHP - 15);
  logBattle("勇士攻击！怪物损失15点HP！");
  checkGameOver();
  if (!gameOver) enemyTurn();
}

function defend() {
  if (gameOver) return;
  logBattle("勇士防御！下回合受到的伤害减半！");
  enemyTurn(true);
}

function skill() {
  if (gameOver) return;
  monsterHP = Math.max(0, monsterHP - 30);
  heroHP = Math.max(0, heroHP - 5);
  logBattle("勇士释放技能！怪物-30 HP，自身-5 HP！");
  checkGameOver();
  if (!gameOver) enemyTurn();
}

// 敌人行动
function enemyTurn(defended = false) {
  setTimeout(() => {
    if (gameOver) return;
    let dmg = defended ? 5 : 10;
    heroHP = Math.max(0, heroHP - dmg);
    logBattle("怪物攻击！勇士损失" + dmg + "点HP！");
    checkGameOver();
  }, 500);
}

// 禁用按钮
function disableControls() {
  const buttons = document.querySelectorAll(".controls button");
  buttons.forEach(btn => btn.disabled = true);
}

// 循环绘制
function gameLoop() {
  drawScene();
  requestAnimationFrame(gameLoop);
}

bgImg.onload = () => gameLoop();
