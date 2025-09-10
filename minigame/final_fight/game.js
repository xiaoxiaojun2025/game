// game.js - 完整脚本（含怪物机制）

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 适配屏幕大小
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// 图片
const bgImg = new Image();
const heroImg = new Image();
const monsterImg = new Image();
bgImg.src = "assets/bg.png";
heroImg.src = "assets/hero.png";
monsterImg.src = "assets/monster.png";

// --------- 常量与核心数据 ----------
const HERO_MAX_HP = 400;
const MONSTER_MAX_HP = 750;

let heroHP = HERO_MAX_HP;
let monsterHP = MONSTER_MAX_HP;
let gameOver = false;
let isFighting = false; 
let turnCount = 0; // 回合数统计
let nextBigAttackTurn = 3; // 下一次大招的回合数

const hero = { x: canvas.width * 0.2, y: canvas.height * 0.6 +90, w: 80, h: 120 };
const monster = { x: canvas.width * 0.7 - 200, y: canvas.height * 0.5 - 50, w: 500, h: 400 };

// 技能 CD 配置
const skillCDConfig = { skill1: 5, skill2: 6, skill3: 4 };
let currentSkillCD = { skill1: 0, skill2: 0, skill3: 0 };
let isSkillUsedThisTurn = false;

// 怪物状态
let monsterStatus = { isArmorBroken: false };

// 技能按钮 DOM
const skillButtons = {
  skill1: document.getElementById("skill1Btn"),
  skill2: document.getElementById("skill2Btn"),
  skill3: document.getElementById("skill3Btn")
};
const attackBtn = document.getElementById("attackBtn");
const defendBtn = document.getElementById("defendBtn");

// ---------- 工具 ----------
function drawHealthBar(x, y, hp, maxHP) {
  const barWidth = 150, barHeight = 20;
  ctx.fillStyle = "red";
  ctx.fillRect(x, y, barWidth, barHeight);
  ctx.fillStyle = "lime";
  ctx.fillRect(x, y, (hp / maxHP) * barWidth, barHeight);
  ctx.strokeStyle = "white";
  ctx.strokeRect(x, y, barWidth, barHeight);
}

function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (bgImg.complete) ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  else {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // 英雄
  hero.x = canvas.width * 0.12;
  hero.y = canvas.height * 0.724;
  if (heroImg.complete) ctx.drawImage(heroImg, hero.x, hero.y, hero.w, hero.h);
  drawHealthBar(hero.x-40, hero.y - 30, heroHP, HERO_MAX_HP);

  // 怪物
  monster.x = canvas.width * 0.62;
  monster.y = canvas.height * 0.35;
  if (monsterStatus.isArmorBroken) {
    ctx.save();
    ctx.strokeStyle = "#ff4444";
    ctx.lineWidth = 4;
    ctx.strokeRect(monster.x - 10, monster.y - 10, monster.w + 20, monster.h + 20);
    ctx.restore();
  }
  
  // 绘制大招预警效果
  if (turnCount + 1 === nextBigAttackTurn) {
    ctx.save();
    ctx.globalAlpha = 0.5 + 0.2 * Math.sin(Date.now() / 200); // 闪烁效果
    ctx.fillStyle = "#ff0000";
    ctx.beginPath();
    ctx.arc(
      monster.x + monster.w / 2,
      monster.y + monster.h / 2,
      Math.min(monster.w, monster.h) * 0.7,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
  }
  
  if (monsterImg.complete) ctx.drawImage(monsterImg, monster.x, monster.y, monster.w, monster.h);
  drawHealthBar(monster.x+100, monster.y - 30, monsterHP, MONSTER_MAX_HP);

  // 结束界面
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "60px 微软雅黑";
    ctx.textAlign = "center";
    ctx.fillText(
      heroHP <= 0 ? "魔龙太强大了" : "胜利！Lilies战胜了魔龙！",
      canvas.width / 2,
      canvas.height / 2
    );
    drawReturnButton();
  }
}

function logBattle(msg) {
  if (gameOver) return;
  const log = document.getElementById("battle-log");
  if (!log) return;
  log.innerHTML += msg + "<br>";
  log.scrollTop = log.scrollHeight;
}

function checkGameOver() {
  if (monsterHP <= 0 || heroHP <= 0) {
    gameOver = true;
    disableControls();
    const isWin = heroHP > 0;
    logBattle("⚔ 战斗结束！" + (isWin ? "你获得了胜利！" : "你失败了！"));
    saveGameResult(isWin);
    return true;
  }
  return false;
}

function saveGameResult(isWin) {
  const username = localStorage.getItem("LA-username") || "defaultPlayer";
  const resultKey = `LA-trial-final_fight${username}`;
  localStorage.setItem(resultKey, JSON.stringify(isWin));
}

// 绘制返回按钮
function drawReturnButton() {
  ctx.fillStyle = "#f8d347";
  ctx.fillRect(canvas.width / 2 - 120, canvas.height / 2 + 80, 240, 60); // 原cancanvas改为canvas
  ctx.fillStyle = "#222";
  ctx.font = "28px 微软雅黑";
  ctx.textAlign = "center";
  ctx.fillText("返回大游戏", canvas.width / 2, canvas.height / 2 + 120);
}

canvas.addEventListener('click', e => {
  if (!gameOver) return;
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;
  if (clickX >= canvas.width / 2 - 120 &&
      clickX <= canvas.width / 2 + 120 &&
      clickY >= canvas.height / 2 + 80 &&
      clickY <= canvas.height / 2 + 140) {
    window.location.href = "../../html/game.html";
  }
});

function disableControls() {
  document.querySelectorAll(".controls button").forEach(btn => btn.disabled = true);
}

// ---------- CD ----------
function setSkillOnCooldown(skillKey) {
  if (!skillCDConfig.hasOwnProperty(skillKey)) return;
  currentSkillCD[skillKey] = skillCDConfig[skillKey];
  updateSkillCDDisplay();
}

function updateSkillCDDisplay() {
  for (const skillKey in skillButtons) {
    const btn = skillButtons[skillKey];
    if (!btn) continue;
    const remainingCD = currentSkillCD[skillKey] || 0;

    let cdElem = btn.querySelector(".cd-count");
    if (remainingCD > 0) {
      if (!cdElem) {
        cdElem = document.createElement("span");
        cdElem.className = "cd-count";
        btn.appendChild(cdElem);
      }
      cdElem.textContent = remainingCD;
      cdElem.style.display = "flex";
      btn.disabled = true;
    } else {
      if (cdElem) cdElem.style.display = "none";
      btn.disabled = gameOver;
    }
  }

  if (attackBtn) attackBtn.disabled = gameOver;
  if (defendBtn) defendBtn.disabled = gameOver;
}

function reduceSkillCDEachTurn() {
  // 修复BUG1: 无论是否使用技能，每回合都应该减少CD
  for (const skillKey in currentSkillCD) {
    if (currentSkillCD[skillKey] > 0) {
      currentSkillCD[skillKey] = Math.max(0, currentSkillCD[skillKey] - 1);
    }
  }
  isSkillUsedThisTurn = false;
  updateSkillCDDisplay();
}

// ---------- 敌人回合 ----------
function enemyTurn(defended = false, onComplete) {
  setTimeout(() => {
    if (gameOver) { onComplete?.(); return; }

    turnCount++; // 记录第几回合
    
    // 检查是否需要提醒玩家大招即将到来 (修复BUG2: 在回合结束时提示)
    if (turnCount + 1 === nextBigAttackTurn) {
      logBattle("⚠️ 警告：怪物正在积蓄能量，下回合将发动强力攻击！");
    }

    // 每 4 回合发动一次大招
    if (turnCount === nextBigAttackTurn) {
      let bigDmg = Math.floor(Math.random() * 21) + 30; // 30~40
      if (defended) bigDmg = Math.floor(bigDmg / 2);
      heroHP = Math.max(0, heroHP - bigDmg);
      logBattle(`⚡ 怪物释放大招！Lilies损失${bigDmg}点HP！当前HP：${heroHP}`);
      nextBigAttackTurn += 5; // 设置下一次大招的回合
    } else {
      let dmg = Math.floor(Math.random() * 9) + 9; // 9~18
      if (defended) dmg = Math.floor(dmg / 2);
      heroHP = Math.max(0, heroHP - dmg);
      logBattle(`👹 怪物攻击！造成${dmg}点伤害！ 当前HP：${heroHP}`);
    }

    checkGameOver();
    onComplete?.();
  }, 500);
}

// ---------- 按钮动作 ----------
function attack() {
  if (gameOver || isFighting) return;
  isFighting = true;
  isSkillUsedThisTurn = false; // 攻击不算使用技能，但也要设置标志

  let damage = 22;
  if (monsterStatus.isArmorBroken) {
    damage = Math.floor(damage * 1.6);
    logBattle(`⚔ 怪物处于重伤状态！伤害提升60%！`);
  }

  monsterHP = Math.max(0, monsterHP - damage);
  logBattle(`⚔ 普通攻击！怪物损失${damage}点HP！ 当前怪物HP：${monsterHP}`);

  if (!checkGameOver()) {
    enemyTurn(false, () => {
      monsterStatus.isArmorBroken = false;
      isFighting = false;
      reduceSkillCDEachTurn(); // 修复BUG1: 攻击后也减少CD
    });
  } else {
    isFighting = false;
    reduceSkillCDEachTurn(); // 修复BUG1: 即使战斗结束也要减少CD
  }
}

function defend() {
  if (gameOver || isFighting) return;
  isFighting = true;
  isSkillUsedThisTurn = false; // 防御不算使用技能，但也要设置标志

  logBattle(`🛡 防御！下回合伤害减半！`);

  if (!checkGameOver()) {
    enemyTurn(true, () => {
      monsterStatus.isArmorBroken = false;
      isFighting = false;
      reduceSkillCDEachTurn(); // 修复BUG1: 防御后也减少CD
    });
  } else {
    isFighting = false;
    reduceSkillCDEachTurn(); // 修复BUG1: 即使战斗结束也要减少CD
  }
}

function skill1() {
  if (gameOver || isFighting || currentSkillCD.skill1 > 0) return;
  isFighting = true;
  isSkillUsedThisTurn = true;

  const healAmount = 45;
  const prevHP = heroHP;
  heroHP = Math.min(HERO_MAX_HP, heroHP + healAmount);
  logBattle(`💚 生命药剂！HP从${prevHP}恢复至${heroHP}（+${healAmount}）！`);

  setSkillOnCooldown("skill1");

  if (!checkGameOver()) {
    enemyTurn(false, () => {
      reduceSkillCDEachTurn();
      monsterStatus.isArmorBroken = false;
      isFighting = false;
    });
  } else {
    isFighting = false;
    reduceSkillCDEachTurn(); // 修复BUG1: 即使战斗结束也要减少CD
  }
}

function skill2() {
  if (gameOver || isFighting || currentSkillCD.skill2 > 0) return;
  isFighting = true;
  isSkillUsedThisTurn = true;

  let damage = Math.floor(Math.random() * 21) + 40; // 40~60
  const selfDamage = 14;

  if (monsterStatus.isArmorBroken) {
    damage = Math.floor(damage * 1.6);
    logBattle(`⚔ 怪物处于重伤状态！伤害提升60%！`);
  }

  monsterHP = Math.max(0, monsterHP - damage);
  heroHP = Math.max(0, heroHP - selfDamage);
  logBattle(`🔥 魔焰药剂！怪物损失${damage}点，自身损失${selfDamage}点！`);

  setSkillOnCooldown("skill2");

  if (!checkGameOver()) {
    enemyTurn(false, () => {
      reduceSkillCDEachTurn();
      monsterStatus.isArmorBroken = false;
      isFighting = false;
    });
  } else {
    isFighting = false;
    reduceSkillCDEachTurn(); // 修复BUG1: 即使战斗结束也要减少CD
  }
}

function skill3() {
  if (gameOver || isFighting || currentSkillCD.skill3 > 0) return;
  isFighting = true;
  isSkillUsedThisTurn = true;

  let damage = 22;
  monsterStatus.isArmorBroken = true;
  monsterHP = Math.max(0, monsterHP - damage);
  logBattle(`⚡ 重伤药剂！怪物损失${damage}点HP，下回合伤害+60%！`);

  setSkillOnCooldown("skill3");

  if (!checkGameOver()) {
    enemyTurn(false, () => {
      reduceSkillCDEachTurn();
      isFighting = false;
    });
  } else {
    isFighting = false;
    reduceSkillCDEachTurn(); // 修复BUG1: 即使战斗结束也要减少CD
  }
}

// ---------- 绑定 ----------
if (attackBtn) attackBtn.addEventListener("click", attack);
if (defendBtn) defendBtn.addEventListener("click", defend);
if (skillButtons.skill1) skillButtons.skill1.addEventListener("click", skill1);
if (skillButtons.skill2) skillButtons.skill2.addEventListener("click", skill2);
if (skillButtons.skill3) skillButtons.skill3.addEventListener("click", skill3);

// ---------- 循环 ----------
function gameLoop() { drawScene(); requestAnimationFrame(gameLoop); }
bgImg.onload = () => { updateSkillCDDisplay(); gameLoop(); };
if (bgImg.complete) { updateSkillCDDisplay(); gameLoop(); }