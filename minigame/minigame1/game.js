// 基础实体类 - 提供动画和位置基础功能
class Entity {
    constructor(gameWidth, gameHeight, img, x, y, width, height) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.img = img;
        this.vx = 0;
        this.vy = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.weight = 0;
        this.spriteWidth = 55.75; 
        this.spriteHeight = 77; 
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx) {
        ctx.drawImage(
            this.img,
            this.spriteWidth * this.frameX,
            this.spriteHeight * this.frameY,
            this.spriteWidth,
            this.spriteHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }
}

// 莉莉丝玩家类
class Lilies extends Entity {
    constructor(game, img) {
        super(
            game.canvas.width,
            game.canvas.height,
            img,
            game.canvas.width / 2 - 50,
            game.canvas.height - 120,
            100, 100
        );
        this.face = "right";
        this.animationFrame = 0;
        this.normalSpeed = 7 * 60;
        this.wSpeed = 14 * 60;
        this.game = game;
    }

    update(timeScale, keys) {
        this.animationFrame++;
        this.frameX = Math.floor(this.animationFrame / 20) % 4;

        this.vx = 0;

        if (keys["a"]) {
            this.face = "left";
            this.frameY = 1;
            this.vx = -this.normalSpeed * timeScale;
            if (keys["w"]) {
                this.vx = -this.wSpeed * timeScale;
            }
        } else if (keys["d"]) {
            this.face = "right";
            this.frameY = 1;
            this.vx = this.normalSpeed * timeScale;
            if (keys["w"]) {
                this.vx = this.wSpeed * timeScale;
            }
        } else {
            this.frameY = 0;
        }

        this.x += this.vx;

        if (this.x < 0) this.x = 0;
        if (this.x + this.width > this.gameWidth) {
            this.x = this.gameWidth - this.width;
        }
    }

    draw(ctx) {
        if (this.face === "right") {
            super.draw(ctx);
        } else {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.img,
                this.spriteWidth * this.frameX,
                this.spriteHeight * this.frameY,
                this.spriteWidth,
                this.spriteHeight,
                -this.x - this.width,
                this.y,
                this.width,
                this.height
            );
            ctx.restore();
        }
    }
}

// 道具类
class Bean extends Entity {
    constructor(game) {
        super(
            game.canvas.width,
            game.canvas.height,
            null,
            Math.random() * (game.canvas.width - 30),
            -700,
            50, 50
        );
        this.game = game;
        this.dy = (Math.random() * 4 + 4) * 60;
        this.type = this.getRandomType();
    }

    getRandomType() {
        const rand = Math.random();
        if (rand < 0.17) return "good";
        else if (rand < 0.93) return "bad";
        else if (rand < 0.95) return "time_adder";
        else return "shield";
    }

    update(timeScale) {
        this.y += this.dy * timeScale;
    }

    draw(ctx, images) {
        let image;
        switch (this.type) {
            case "good": image = images.good; break;
            case "bad": image = images.bad; break;
            case "time_adder": image = images.time_adder; break;
            case "shield": image = images.shield; break;
        }
        ctx.drawImage(image, this.x, this.y, this.width, this.height);
    }
}

// 护盾效果类
class ShieldEffect {
    constructor(player) {
        this.player = player;
        this.radius = player.width * 0.8;
        this.maxRadius = this.radius;
        this.opacity = 1;
        this.remainingTime = 0;
        this.duration = 0;
    }

    activate(duration) {
        this.remainingTime = duration;
        this.duration = duration;
        this.opacity = 1;
        this.radius = this.maxRadius;
    }

    update(deltaTime) {
        if (this.remainingTime <= 0) return;

        this.remainingTime -= deltaTime;
        const progress = 1 - (this.remainingTime / this.duration);

        if (progress > 0.7) {
            this.opacity = 1 - ((progress - 0.7) / 0.3);
        } else {
            this.opacity = 1 - (progress * 0.3);
        }

        this.radius = this.maxRadius * (1 + progress * 0.15);
    }

    draw(ctx) {
        if (this.remainingTime <= 0 || this.opacity <= 0) return;

        const centerX = this.player.x + this.player.width / 2;
        const centerY = this.player.y + this.player.height / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 180, 255, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, this.radius * 0.8, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100, 200, 255, ${this.opacity * 0.7})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (Math.random() > 0.7) {
            const angle = Math.random() * Math.PI * 2;
            const dotRadius = this.radius * (0.8 + Math.random() * 0.2);
            const dotX = centerX + Math.cos(angle) * dotRadius;
            const dotY = centerY + Math.sin(angle) * dotRadius;
            
            ctx.beginPath();
            ctx.arc(dotX, dotY, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }
}

// 游戏主类 - 核心修改在endGame方法
class Game {
    constructor() {
        this.canvas = document.getElementById("canvasOfGame");
        this.ctx = this.canvas.getContext("2d");
        this.bgm = document.getElementById('alchemyBgm');
        this.startButton = document.getElementById("startButton");
        this.startScreen = document.getElementById("startScreen");

        this.isGameRunning = false;
        this.isGameStarted = false;
        this.gameStartTime = null;
        this.lastUpdateTime = null;
        this.lastBeanSpawnTime = null;
        this.scoreValue = 0;
        this.isShieldActive = false;
        this.shieldRemainingTime = 0;
        this.isTimeAdderActive = false;
        this.showTimeAdderText = false;
        this.lastTimeAdderTime = 0;

        this.GAME_DURATION = 40;
        this.winScore = 120;
        this.loseScore = -80;
        this.beanSpawnInterval = 150;
        this.maxBeans = 25;
        this.shieldDuration = 5000;
        this.time_adderDuration = 5000;

        this.images = {
            player: new Image(),
            good: new Image(),
            bad: new Image(),
            time_adder: new Image(),
            shield: new Image(),
            background: new Image(),
        };
        this.images.player.src = "精灵图.png";
        this.images.good.src = "./小道具/蓝宝石.png";
        this.images.bad.src = "./小道具/毒药瓶.png";
        this.images.time_adder.src = "./小道具/沙漏.png";
        this.images.shield.src = "./小道具/护盾.png";
        this.images.background.src = "atelier.png";

        this.player = new Lilies(this, this.images.player);
        this.beans = [new Bean(this)];

        this.keys = {};
        this.initEventListeners();

        this.resizeCanvas();
        this.shieldEffect = new ShieldEffect(this.player);
    }

    initEventListeners() {
        document.addEventListener("keydown", (e) => {
            this.keys[e.key] = true;
        });
        document.addEventListener("keyup", (e) => {
            this.keys[e.key] = false;
        });

        this.startButton.addEventListener("click", () => {
            this.startScreen.style.display = "none";
            this.isGameStarted = true;
            this.isGameRunning = true;
            this.gameStartTime = Date.now();
            this.lastUpdateTime = Date.now();
            this.lastBeanSpawnTime = Date.now();
            this.bgm.volume = 0.5;
            this.bgm.play().catch(err => {
                console.log("音频播放需要用户交互：", err);
            });
        });

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const style = window.getComputedStyle(this.canvas);
        this.canvas.width = parseInt(style.width);
        this.canvas.height = parseInt(style.height);

        if (this.player) {
            this.player.gameWidth = this.canvas.width;
            this.player.gameHeight = this.canvas.height;
            this.player.setX(this.canvas.width / 2 - this.player.width / 2);
            this.player.setY(this.canvas.height - this.player.height - 10);
        }
    }

    isColliding(a, b) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }

    // 核心修改：存储试炼结果到localStorage
    endGame(isWin) {
        if (!this.isGameRunning) return;
        this.isGameRunning = false;

        // 音乐淡出
        let fadeInterval = setInterval(() => {
            if (this.bgm.volume > 0) {
                this.bgm.volume -= 0.05;
            } else {
                this.bgm.pause();
                clearInterval(fadeInterval);
            }
        }, 100);

        // 获取用户名并设置localStorage键名
        const username = localStorage.getItem("LA-username") || "default";
        const trialResultKey = `LA-trial-${username}`;

        
        // 存储结果：胜利存true，失败存false
        localStorage.setItem(trialResultKey, JSON.stringify(isWin));
        // 3. 关键修复：定义并读取“大游戏页面路径”（从 localStorage 中获取）
        const preTrialPageKey = `LA-pre-trial-page-${username}`; // 和大游戏中存储的键名保持一致
        const preTrialPageUrl = localStorage.getItem(preTrialPageKey); // 读取大游戏页面路径

        // 3. 跳转逻辑：优先返回原页面，无原页面时用默认大游戏页面（避免异常）
        setTimeout(() => {
            if (preTrialPageUrl) {
                // 原路返回：跳回进小游戏前的大游戏页面
                window.location.href = preTrialPageUrl;
                // 可选：删除已使用的路径存储（避免重复使用）
                localStorage.removeItem(preTrialPageKey);
            } else {
                // 异常情况：无存储路径时，跳大游戏默认页面（需替换为你的大游戏默认路径）
                window.location.href = "../../index.html";
            }
        }, 2000); // 延迟2秒，让玩家看到“试炼成功/失败”提示
    }

    update() {
        if (!this.isGameRunning) return;

        const now = Date.now();
        const deltaTime = now - this.lastUpdateTime;
        this.lastUpdateTime = now;
        const timeScale = deltaTime / 1000;

        if (now - this.lastBeanSpawnTime > this.beanSpawnInterval && this.beans.length < this.maxBeans) {
            this.beans.push(new Bean(this));
            this.lastBeanSpawnTime = now;
        }

        this.player.update(timeScale, this.keys);

        for (let i = this.beans.length - 1; i >= 0; i--) {
            const bean = this.beans[i];
            bean.update(timeScale);

            if (bean.y > this.canvas.height) {
                this.beans.splice(i, 1);
                continue;
            }

            if (this.isColliding(this.player, bean)) {
                this.handleBeanCollision(bean);
                this.beans.splice(i, 1);
            }
        }

        if (this.isShieldActive) {
            this.shieldRemainingTime -= deltaTime;
            if (this.shieldRemainingTime <= 0) {
                this.isShieldActive = false;
            }
        }

        if (this.scoreValue >= this.winScore) {
            this.endGame(true);
        }
        if (this.scoreValue <= this.loseScore) {
            this.endGame(false);
        }

        if (this.isGameStarted && this.isGameRunning &&
            (now - this.gameStartTime) >= this.GAME_DURATION * 1000) {
            this.endGame(false);
        }
        if (this.isShieldActive) {
            this.shieldEffect.update(deltaTime);
        }
    }

    handleBeanCollision(bean) {
        switch (bean.type) {
            case "good":
                this.scoreValue += 10;
                break;
            case "bad":
                if (!this.isShieldActive) this.scoreValue -= 10;
                break;
            case "time_adder":
                this.scoreValue += 5;
                this.gameStartTime += this.time_adderDuration;
                this.isTimeAdderActive = true;
                break;
            case "shield":
                this.scoreValue += 5;
                this.isShieldActive = true;
                this.shieldRemainingTime = this.shieldDuration;
                this.shieldEffect.activate(this.shieldDuration);
                break;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();

        if (!this.isGameStarted) return;

        this.player.draw(this.ctx);
        this.beans.forEach(bean => bean.draw(this.ctx, this.images));
        
        if (this.isShieldActive) {
            this.shieldEffect.draw(this.ctx);
        }

        this.drawTimer();
        this.drawTimeAdderHint();
        this.drawShieldHint();
        this.drawGameResult();
        this.drawScore();
    }

    drawBackground() {
        if (!this.images.background.complete) return;

        const bgWidth = this.images.background.width;
        const bgHeight = this.images.background.height;
        const scale = Math.max(
            this.canvas.width / bgWidth,
            this.canvas.height / bgHeight
        );
        const scaledWidth = bgWidth * scale;
        const scaledHeight = bgHeight * scale;
        const offsetX = (this.canvas.width - scaledWidth) / 2;
        const offsetY = (this.canvas.height - scaledHeight) / 2;

        this.ctx.drawImage(
            this.images.background,
            offsetX, offsetY,
            scaledWidth, scaledHeight
        );
    }

    drawTimer() {
        this.ctx.fillStyle = "black";
        this.ctx.font = "24px Lolita, sans-serif";
        let timeText = this.isGameRunning
            ? `试炼时间: ${Math.max(0, this.GAME_DURATION - Math.floor((Date.now() - this.gameStartTime) / 1000))}s`
            : "试炼时间: 0s";
        const textWidth = this.ctx.measureText(timeText).width;
        this.ctx.fillText(timeText, this.canvas.width / 2 - 20 - textWidth / 2, 30);
    }

    drawTimeAdderHint() {
        if (this.isTimeAdderActive) {
            if (!this.showTimeAdderText) {
                this.showTimeAdderText = true;
                this.lastTimeAdderTime = Date.now();
            }

            if (this.showTimeAdderText && (Date.now() - this.lastTimeAdderTime <= this.time_adderDuration)) {
                this.ctx.fillStyle = "black";
                this.ctx.font = "30px Lolita, sans-serif";
                this.ctx.fillText(`+${Math.ceil(this.time_adderDuration / 1000)}s!!!`, this.canvas.width / 2 + 50, 30);
            } else {
                this.showTimeAdderText = false;
                this.isTimeAdderActive = false;
            }
        }
    }

    drawShieldHint() {
        if (this.isShieldActive) {
            this.ctx.fillStyle = "rgba(128, 0, 128, 0.7)";
            this.ctx.font = "24px Lolita, sans-serif";
            this.ctx.fillText(`护盾生效中: ${Math.ceil(this.shieldRemainingTime / 1000)}秒`, this.canvas.width - 180, 30);
        }
    }

    drawGameResult() {
        if (this.scoreValue >= this.winScore) {
            this.ctx.fillStyle = "#2ecc71";
            this.ctx.font = "60px Lolita, sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText("试炼成功!", this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = "24px Lolita, sans-serif";
            this.ctx.fillStyle = "#34495e";
            this.ctx.fillText("即将返回大地图...", this.canvas.width / 2, this.canvas.height / 2 + 80);
        }
        if (this.scoreValue <= this.loseScore) {
            this.ctx.fillStyle = "red";
            this.ctx.font = "48px Arial";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText("试炼失败!", this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = "20px Arial";
            this.ctx.fillText("点击页面重新挑战", this.canvas.width / 2, this.canvas.height / 2 + 60);
        }
    }

    drawScore() {
        this.ctx.fillStyle = "black";
        this.ctx.font = "24px Lolita, sans-serif";
        this.ctx.fillText("元素能量值: " + this.scoreValue, 70, 30);
    }

    gameLoop() {
        if (!this.gameStartTime && this.isGameStarted) {
            this.gameStartTime = Date.now();
        }
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    start() {
        this.gameLoop();
    }
}

// 初始化游戏
const game = new Game();
game.start();
