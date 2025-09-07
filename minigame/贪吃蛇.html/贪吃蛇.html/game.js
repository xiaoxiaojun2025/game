document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    const messageElement = document.getElementById('message');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // 设置Canvas尺寸
    function setupCanvas() {
        const gameArea = document.querySelector('.game-area');
        canvas.width = gameArea.clientWidth;
        canvas.height = gameArea.clientHeight;
    }
    
    // 游戏变量 - 新增豆子数组、配置及计时器
    let gridSize = 20;
    let snake = [];
    let beans = []; // 存储所有类型豆子的数组
    let direction = 'right';
    let nextDirection = 'right';
    let gameSpeed = 180;
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameRunning = false;
    let gameLoop;
    let beanRefreshTimer; // 豆子定时刷新计时器
    const WIN_SCORE = 50; // 胜利条件：分数达到300分（可根据难度调整）
    let iswin = false; // 标记游戏是否已胜利（避免重复触发胜利）
    
    // 三种豆子配置（类型、颜色、分数、最大数量、刷新间隔、是否自动消失）
    const beanConfig = [
        {
            type: 'normal',    // 基础加分豆
            color: '#e84118',  // 红色
            score: 10,         // +10分
            maxCount: 3,       // 最多同时存在3个
            refreshTime: 2000, // 每2秒补充1个
            timeout: null      // 不自动消失
        },
        {
            type: 'high',      // 高分豆
            color: '#fbc531',  // 黄色
            score: 30,         // +30分
            maxCount: 1,       // 最多同时存在1个
            refreshTime: 5000, // 每5秒补充1个
            timeout: 5000      // 生成后5秒自动消失
        },
        {
            type: 'bad',       // 减分豆
            color: '#9c88ff',  // 紫色
            score: -15,        // -15分
            maxCount: 1,       // 最多同时存在1个
            refreshTime: 4000, // 每4秒补充1个
            timeout: null      // 不自动消失
        }
    ];
    
    // 初始化游戏 - 新增豆子初始化
    function initGame() {
        snake = [
            {x: 5, y: 10},
            {x: 4, y: 10},
            {x: 3, y: 10}
        ];
        
        beans = []; // 清空豆子数组
        initBeans(); // 初始化豆子生成
        score = 0;
    iswin = false;
        scoreElement.textContent = score;
        highScoreElement.textContent = highScore;
        direction = 'right';
        nextDirection = 'right';
        gameSpeed = 180;
        messageElement.textContent = "游戏开始！红色豆+10，黄色豆+30，紫色豆-15";
    }
    
    // 初始化豆子生成（按配置生成初始豆子 + 启动定时刷新）
    function initBeans() {
        // 清除旧的豆子刷新计时器
        if (beanRefreshTimer) clearInterval(beanRefreshTimer);
        
        // 生成每种豆子的初始数量
        beanConfig.forEach(config => {
            for (let i = 0; i < config.maxCount; i++) {
                generateBean(config);
            }
        });
        
        // 启动豆子定时刷新（每1秒检查并补充豆子）
        beanRefreshTimer = setInterval(() => {
            if (!gameRunning||iswin) return;
            beanConfig.forEach(config => {
                // 统计当前该类型豆子数量
                const currentCount = beans.filter(bean => bean.type === config.type).length;
                // 数量不足时补充
                if (currentCount < config.maxCount) {
                    generateBean(config);
                }
            });
        }, 1000);
    }
    
    // 生成单个豆子（避免与蛇身/其他豆子重叠）
    function generateBean(config) {
        const maxX = Math.floor(canvas.width / gridSize) - 1;
        const maxY = Math.floor(canvas.height / gridSize) - 1;
        let newBean;
        
        // 循环生成，直到找到不重叠的位置
        do {
            newBean = {
                x: Math.floor(Math.random() * maxX),
                y: Math.floor(Math.random() * maxY),
                type: config.type,
                color: config.color,
                score: config.score,
                createTime: Date.now() // 记录生成时间（用于高分豆自动消失）
            };
            // 检查是否与蛇身重叠
            const isOnSnake = snake.some(seg => seg.x === newBean.x && seg.y === newBean.y);
            // 检查是否与其他豆子重叠
            const isOnBean = beans.some(bean => bean.x === newBean.x && bean.y === newBean.y);
            if (!isOnSnake && !isOnBean) break;
        } while (true);
        
        // 添加到豆子数组
        beans.push(newBean);
        
        // 高分豆：生成后指定时间自动消失
        if (config.timeout) {
            setTimeout(() => {
                beans = beans.filter(bean => !(bean.x === newBean.x && bean.y === newBean.y && bean.type === config.type));
            }, config.timeout);
        }
    }
    
    // 绘制游戏元素 - 修改为绘制多种豆子
    function draw() {
        // 清空画布
        ctx.fillStyle = '#1e272e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制蛇（保留原逻辑）
        for (let i = 0; i < snake.length; i++) {
            if (i === 0) {
                ctx.fillStyle = '#4cd137'; // 蛇头绿色
            } else {
                // 蛇身渐变
                const greenValue = 150 + Math.floor(100 * (i / snake.length));
                ctx.fillStyle = `rgb(50, ${greenValue}, 50)`;
            }
            
            ctx.fillRect(
                snake[i].x * gridSize, 
                snake[i].y * gridSize, 
                gridSize - 1, 
                gridSize - 1
            );
            
            // 蛇头眼睛（按方向绘制）
            if (i === 0) {
                ctx.fillStyle = '#000';
                if (direction === 'right') {
                    ctx.fillRect(snake[i].x * gridSize + gridSize - 5, snake[i].y * gridSize + 3, 2, 2);
                    ctx.fillRect(snake[i].x * gridSize + gridSize - 5, snake[i].y * gridSize + gridSize - 5, 2, 2);
                } else if (direction === 'left') {
                    ctx.fillRect(snake[i].x * gridSize + 3, snake[i].y * gridSize + 3, 2, 2);
                    ctx.fillRect(snake[i].x * gridSize + 3, snake[i].y * gridSize + gridSize - 5, 2, 2);
                } else if (direction === 'up') {
                    ctx.fillRect(snake[i].x * gridSize + 3, snake[i].y * gridSize + 3, 2, 2);
                    ctx.fillRect(snake[i].x * gridSize + gridSize - 5, snake[i].y * gridSize + 3, 2, 2);
                } else if (direction === 'down') {
                    ctx.fillRect(snake[i].x * gridSize + 3, snake[i].y * gridSize + gridSize - 5, 2, 2);
                    ctx.fillRect(snake[i].x * gridSize + gridSize - 5, snake[i].y * gridSize + gridSize - 5, 2, 2);
                }
            }
        }
        
        // 绘制所有豆子（圆形，高分豆添加闪烁效果）
        beans.forEach(bean => {
            // 高分豆最后1秒闪烁（提示即将消失）
            if (bean.type === 'high' && Date.now() - bean.createTime > 4000) {
                ctx.globalAlpha = Math.sin(Date.now() * 10) > 0 ? 1 : 0.3;
            }
            
            ctx.fillStyle = bean.color;
            ctx.beginPath();
            ctx.arc(
                bean.x * gridSize + gridSize / 2,
                bean.y * gridSize + gridSize / 2,
                gridSize / 2 - 2, // 豆子大小（留1px间隙）
                0,
                Math.PI * 2
            );
            ctx.fill();
            ctx.globalAlpha = 1; // 重置透明度
        });
    }
    
    // 更新游戏状态 - 修改为检测多种豆子碰撞
    function update() {
        // 更新方向（避免180度转向）
        direction = nextDirection;
        
        // 移动蛇头
        const head = {x: snake[0].x, y: snake[0].y};
        switch(direction) {
            case 'right': head.x++; break;
            case 'left': head.x--; break;
            case 'up': head.y--; break;
            case 'down': head.y++; break;
        }
        
        // 检查游戏结束条件（保留原逻辑）
        if (
            head.x < 0 || 
            head.y < 0 || 
            head.x >= canvas.width / gridSize || 
            head.y >= canvas.height / gridSize ||
            checkCollision(head)
        ) {
            gameOver();
            return;
        }
        
        // 添加新蛇头
        snake.unshift(head);
        
        // 检查是否吃到豆子（替换原食物检测逻辑）
        const beanIndex = beans.findIndex(bean => bean.x === head.x && bean.y === head.y);
        if (beanIndex > -1) {
            const eatenBean = beans[beanIndex];
            // 更新分数
            score += eatenBean.score;
            scoreElement.textContent = score;
        // 新增：胜利检测（分数达标且未胜利过，避免重复触发）
        if (score >= WIN_SCORE && !iswin) {
            gameWin(); // 触发胜利逻辑
            return; // 终止后续操作，避免状态混乱
        }           
            // 更新最高分
            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = highScore;
                localStorage.setItem('snakeHighScore', highScore);
            }
            
            // 显示吃到豆子的提示
            if (eatenBean.score > 0) {
                messageElement.textContent = `吃到${eatenBean.type === 'high' ? '高分' : '基础'}豆！+${eatenBean.score}分`;
            } else {
                messageElement.textContent = `吃到减分豆！${eatenBean.score}分`;
            }
            // 1秒后清除提示
            setTimeout(() => {
                if (gameRunning) messageElement.textContent = "继续前进！";
            }, 1000);
            
            // 移除被吃的豆子
            beans.splice(beanIndex, 1);
            
            // 加快游戏速度（保留原逻辑）
            if (gameSpeed > 50) {
                gameSpeed -= 2;
                // 重新设置游戏循环（应用新速度）
                clearInterval(gameLoop);
                gameLoop = setInterval(gameMain, gameSpeed);
            }
        } else {
            // 没吃到豆子，移除蛇尾（保留原逻辑）
            snake.pop();
        }
    }
    
    // 检查碰撞（保留原逻辑）
    function checkCollision(position) {
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === position.x && snake[i].y === position.y) {
                return true;
            }
        }
        return false;
    }
    
    // 游戏主循环（保留原逻辑）
    function gameMain() {
        update();
        draw();
    }
    
    // 开始游戏（保留原逻辑）
    function startGame() {
        if (!gameRunning) {
            gameRunning = true;
            initGame();
            gameLoop = setInterval(gameMain, gameSpeed);
            startBtn.textContent = "重新开始";
            messageElement.textContent = '游戏开始！红色豆+10，黄色豆+30，紫色豆-15，达到${WIN_SCORE}分获胜！';
        }
    }
    
    // 暂停游戏（新增清除豆子刷新计时器的逻辑）
    function pauseGame() {
    if (iswin) return; 
        if (gameRunning) {
            clearInterval(gameLoop);
            clearInterval(beanRefreshTimer); // 暂停时停止刷新豆子
            gameRunning = false;
            messageElement.textContent = "游戏已暂停";
            pauseBtn.textContent = "继续游戏";
        } else {
            gameLoop = setInterval(gameMain, gameSpeed);
            initBeans(); // 继续时重新启动豆子刷新
            gameRunning = true;
            messageElement.textContent = "游戏继续";
            pauseBtn.textContent = "暂停游戏";
        }
    }
    
    // 重置游戏（新增清除豆子刷新计时器的逻辑）
    function resetGame() {
        clearInterval(gameLoop);
        clearInterval(beanRefreshTimer); // 重置时停止豆子刷新
        gameRunning = false;
        initGame();
        draw();
        startBtn.textContent = "开始游戏";
        pauseBtn.textContent = "暂停游戏";
        messageElement.textContent = "点击开始游戏，使用方向键或WASD控制蛇的移动";
    }
function gameWin() {
    // 停止游戏循环和豆子刷新，避免持续运行
    clearInterval(gameLoop);
    clearInterval(beanRefreshTimer);
    gameRunning = false;
    iswin = true; // 标记为已胜利，锁定后续操作
    messageElement.textContent = `恭喜获胜！最终得分: ${score}（目标${WIN_SCORE}分）`;

    // 绘制胜利画面（覆盖画布，绿色主题与蛇头呼应）
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 胜利文字绘制（分层次展示，提升视觉体验）
    ctx.font = '40px Arial';
    ctx.fillStyle = '#4cd137'; // 胜利用绿色，与蛇头颜色统一
    ctx.textAlign = 'center';
    ctx.fillText('恭喜获胜！', canvas.width / 2, canvas.height / 2 - 40);

    ctx.font = '24px Arial';
    ctx.fillStyle = '#fbc531'; // 分数用黄色，与高分豆呼应
    ctx.fillText(`最终得分: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText('点击"重新开始"或"重置游戏"继续挑战', canvas.width / 2, canvas.height / 2 + 50);
}
    
    // 游戏结束（新增清除豆子刷新计时器的逻辑）
    function gameOver() {
        clearInterval(gameLoop);
        clearInterval(beanRefreshTimer); // 结束时停止豆子刷新
        gameRunning = false;
        messageElement.textContent = `游戏结束！最终得分: ${score}`;
        
        // 绘制游戏结束画面（保留原逻辑）
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = '40px Arial';
        ctx.fillStyle = '#e84118';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束!', canvas.width / 2, canvas.height / 2 - 40);
        
        ctx.font = '30px Arial';
        ctx.fillStyle = '#fbc531';
        ctx.fillText(`得分: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    }
    
    // 键盘控制（保留原逻辑）
    function keyDownHandler(e) {
        if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            pauseGame();
            return;
        }
        
        if (!gameRunning||iswin) return;
        
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (direction !== 'left') nextDirection = 'right';
                break;
        }
    }
    
    // 移动端控制（保留原逻辑）
    function setupMobileControls() {
        document.querySelector('.up-btn').addEventListener('click', () => {
            if (direction !== 'down') nextDirection = 'up';
        });
        
        document.querySelector('.down-btn').addEventListener('click', () => {
            if (direction !== 'up') nextDirection = 'down';
        });
        
        document.querySelector('.left-btn').addEventListener('click', () => {
            if (direction !== 'right') nextDirection = 'left';
        });
        
        document.querySelector('.right-btn').addEventListener('click', () => {
            if (direction !== 'left') nextDirection = 'right';
        });
    }
    
    // 初始化（保留原逻辑）
    function init() {
        setupCanvas();
        initGame();
        draw();
        setupMobileControls();
        
        window.addEventListener('resize', () => {
            setupCanvas();
            draw();
        });
        
        window.addEventListener('keydown', keyDownHandler);
        
        startBtn.addEventListener('click', startGame);
        pauseBtn.addEventListener('click', pauseGame);
        resetBtn.addEventListener('click', resetGame);
    }
    
    // 启动游戏
    init();
});