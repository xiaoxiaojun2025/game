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
        // 单帧尺寸，根据精灵图 223×154 计算（2行4列）
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

// 莉莉丝玩家类 - 包含动画和移动逻辑
class Lilies extends Entity {
    constructor(game, img) {
        super(
            game.canvas.width,
            game.canvas.height,
            img,
            game.canvas.width / 2 - 50, // 初始X（居中）
            game.canvas.height - 120, // 初始Y（靠下）
            100, 100 // 显示尺寸
        );
        this.face = "right"; // 初始朝向
        this.animationFrame = 0; // 动画帧计数器
        this.normalSpeed = 7 * 60;
        this.wSpeed = 14 * 60;
        this.game = game;
    }

    update(timeScale, keys) {
        // 动画帧更新（每10帧切换一次）
        this.animationFrame++;
        this.frameX = Math.floor(this.animationFrame / 20) % 4;

        // 重置水平速度
        this.vx = 0;

        // 处理移动 & 切换动画行（frameY）
        if (keys["a"]) {
            this.face = "left";
            this.frameY = 1; // 行走动画行（第2行）
            this.vx = -this.normalSpeed * timeScale;
            if (keys["w"]) {
                this.vx = -this.wSpeed * timeScale;
            }
        } else if (keys["d"]) {
            this.face = "right";
            this.frameY = 1; // 行走动画行（第2行）
            this.vx = this.normalSpeed * timeScale;
            if (keys["w"]) {
                this.vx = this.wSpeed * timeScale;
            }
        } else {
            this.frameY = 0; // 站立动画行（第1行）
        }

        // 应用移动
        this.x += this.vx;

        // 边界检查
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > this.gameWidth) {
            this.x = this.gameWidth - this.width;
        }
    }

    draw(ctx) {
        if (this.face === "right") {
            super.draw(ctx);
        } else {
            // 左侧翻转绘制
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
class ShieldEffect {
    constructor(player) {
        this.player = player; // 关联玩家对象（跟随玩家位置）
        this.radius = player.width * 0.8; // 护盾初始半径（比玩家大20%）
        this.maxRadius = this.radius; // 最大半径（用于动画计算）
        this.opacity = 1; // 初始透明度（完全不透明）
        this.remainingTime = 0; // 剩余显示时间
        this.duration = 0; // 总持续时间（用于计算动画进度）
    }

    // 激活护盾（重置动画状态）
    activate(duration) {
        this.remainingTime = duration;
        this.duration = duration;
        this.opacity = 1;
        this.radius = this.maxRadius;
    }

    // 更新动画状态（随时间变化透明度和大小）
    update(deltaTime) {
        if (this.remainingTime <= 0) return;

        // 减少剩余时间
        this.remainingTime -= deltaTime;

        // 计算动画进度（0~1，0=刚激活，1=即将消失）
        const progress = 1 - (this.remainingTime / this.duration);

        // 透明度随进度降低（最后0.3秒加速消失）
        if (progress > 0.7) {
            this.opacity = 1 - ((progress - 0.7) / 0.3); // 最后30%时间内从1→0
        } else {
            this.opacity = 1 - (progress * 0.3); // 前70%时间保持较高透明度
        }

        // 半径随进度轻微放大（营造"消散"感）
        this.radius = this.maxRadius * (1 + progress * 0.15); // 最大放大20%
    }

    // 绘制护盾（环形+闪烁效果）
    draw(ctx) {
        if (this.remainingTime <= 0 || this.opacity <= 0) return;

        // 获取玩家中心位置（护盾跟随玩家）
        const centerX = this.player.x + this.player.width / 2;
        const centerY = this.player.y + this.player.height / 2;

        // 绘制外圆环（半透明蓝色）
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 180, 255, ${this.opacity})`; // 蓝色护盾
        ctx.lineWidth = 2;
        ctx.stroke();

        // 绘制内圆环（更亮的蓝色，增强层次感）
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.radius * 0.8, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100, 200, 255, ${this.opacity * 0.7})`; // 亮蓝色内环
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 绘制闪烁点（随机位置的亮点，增强动态感）
        if (Math.random() > 0.7) { // 30%概率绘制一个亮点
            const angle = Math.random() * Math.PI * 2;
            const dotRadius = this.radius * (0.8 + Math.random() * 0.2); // 在内环和外环之间
            const dotX = centerX + Math.cos(angle) * dotRadius;
            const dotY = centerY + Math.sin(angle) * dotRadius;
            
            ctx.beginPath();
            ctx.arc(dotX, dotY, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`; // 白色亮点
            ctx.fill();
        }
    }
}
// 游戏主类
class Game {
    constructor() {
        // DOM元素获取（依赖HTML中的对应元素）
        this.canvas = document.getElementById("canvasOfGame");
        this.ctx = this.canvas.getContext("2d");
        this.bgm = document.getElementById('alchemyBgm');
        this.startButton = document.getElementById("startButton");
        this.startScreen = document.getElementById("startScreen");

        // 游戏状态
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

        // 游戏配置
        this.GAME_DURATION = 40;
        this.winScore = 120;
        this.loseScore = -80;
        this.beanSpawnInterval = 150;
        this.maxBeans = 25;
        this.shieldDuration = 5000;
        this.time_adderDuration = 5000;

        // 资源加载
        this.images = {
            player: new Image(), // 精灵图
            good: new Image(),
            bad: new Image(),
            time_adder: new Image(),
            shield: new Image(),
            background: new Image(),
        };
        this.images.player.src = "精灵图.png"; // 你的精灵图路径，需与HTML同级或正确相对路径
        this.images.good.src = "./小道具/蓝宝石.png";
        this.images.bad.src = "./小道具/毒药瓶.png";
        this.images.time_adder.src = "./小道具/沙漏.png";
        this.images.shield.src = "./小道具/护盾.png";
        this.images.background.src = "atelier.png";

        // 初始化玩家和道具
        this.player = new Lilies(this, this.images.player);
        this.beans = [new Bean(this)];

        // 事件监听
        this.keys = {};
        this.initEventListeners();

        // 画布适配
        this.resizeCanvas();
        this.shieldEffect = new ShieldEffect(this.player);
    }

    initEventListeners() {
        // 键盘控制
        document.addEventListener("keydown", (e) => {
            this.keys[e.key] = true;
        });
        document.addEventListener("keyup", (e) => {
            this.keys[e.key] = false;
        });

        // 开始游戏
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

        // 调整玩家位置
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

        setTimeout(() => window.location.reload(), 2000);
    }

    update() {
        if (!this.isGameRunning) return;

        const now = Date.now();
        const deltaTime = now - this.lastUpdateTime;
        this.lastUpdateTime = now;
        const timeScale = deltaTime / 1000;

        // 生成新道具
        if (now - this.lastBeanSpawnTime > this.beanSpawnInterval && this.beans.length < this.maxBeans) {
            this.beans.push(new Bean(this));
            this.lastBeanSpawnTime = now;
        }

        // 更新玩家（包含动画）
        this.player.update(timeScale, this.keys);

        // 更新道具
        for (let i = this.beans.length - 1; i >= 0; i--) {
            const bean = this.beans[i];
            bean.update(timeScale);

            if (bean.y > this.canvas.height) {
                this.beans.splice(i, 1);
                continue;
            }

            // 碰撞检测
            if (this.isColliding(this.player, bean)) {
                this.handleBeanCollision(bean);
                this.beans.splice(i, 1);
            }
        }

        // 更新护盾状态
        if (this.isShieldActive) {
            this.shieldRemainingTime -= deltaTime;
            if (this.shieldRemainingTime <= 0) {
                this.isShieldActive = false;
            }
        }

        // 检查胜负条件
        if (this.scoreValue >= this.winScore) {
            this.endGame(true);
        }
        if (this.scoreValue <= this.loseScore) {
            this.endGame(false);
        }

        // 检查时间结束
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

        // 绘制玩家（带动画）
        this.player.draw(this.ctx);

        // 绘制道具
        this.beans.forEach(bean => bean.draw(this.ctx, this.images));
        // 绘制护盾特效（在玩家上方，道具下方）
        if (this.isShieldActive) {
            this.shieldEffect.draw(this.ctx);
        }

        // 绘制游戏信息
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
            this.ctx.fillStyle = "black";
            this.ctx.font = "48px Lolita, sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText("试炼成功!", this.canvas.width / 2, this.canvas.height / 2);
        }
        if (this.scoreValue <= this.loseScore) {
            this.ctx.fillStyle = "red";
            this.ctx.font = "48px Arial";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText("试炼失败!", this.canvas.width / 2, this.canvas.height / 2);
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