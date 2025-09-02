// 游戏数据
const symbols = ['imgs/dragon-eye.webp','imgs/eisen-ore.webp','imgs/enlightenment-staff.webp','imgs/gold-eisen.webp'
    ,'imgs/noble-sapphire.webp','imgs/passion-ruby.webp','imgs/silvalia.webp','imgs/straight-baum.webp'
    ,'imgs/drinking-water.webp','imgs/philosopher-s-stones.webp','imgs/ingot.webp','imgs/koinos-grass.webp'
];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let gameStarted = false;
let timerInterval;

// DOM元素
const gameBoard = document.querySelector('.game-board');
const movesElement = document.querySelector('.moves');
const timerElement = document.querySelector('.timer');
const restartButton = document.querySelector('.restart');

function goToMainGame() {
    // 替换为你的大游戏页面URL
    window.location.href = 'main-game.html';
}
// 初始化游戏
function initGame() {
    // 清除旧状态
    gameBoard.innerHTML = '';
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    timer = 0;
    gameStarted = false;
    clearInterval(timerInterval);
    
    // 更新显示
    movesElement.textContent = '0 步';
    timerElement.textContent = '时间: 0秒';
    
    // 准备卡牌数据 (8对，总共16张)
    const cardSymbols = [...symbols, ...symbols];
    
    /**
     * 洗牌算法（Fisher-Yates / Knuth 算法）
     * 这是一种高效的随机排序算法，时间复杂度为 O(n)
     * 算法步骤:
     * 1. 从数组最后一个元素开始向前遍历
     * 2. 对于当前位置 i，生成一个随机位置 j (范围是 0 到 i)
     * 3. 交换位置 i 和位置 j 的元素
     * 4. 向前移动到下一个位置，重复步骤2和3，直到处理完所有元素
     * 
     * 这种方法确保每种排列组合的概率是相等的，产生了完全随机的结果
     */
    for (let i = cardSymbols.length - 1; i > 0; i--) {
        // 生成从 0 到 i 的随机索引
        const j = Math.floor(Math.random() * (i + 1));
        
        // 使用ES6的解构赋值语法交换元素，避免使用临时变量
        [cardSymbols[i], cardSymbols[j]] = [cardSymbols[j], cardSymbols[i]];
    }
    
    // 创建卡牌元素
    cardSymbols.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        
        // 卡片正面 (背面朝上)
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');
        // cardFront.textContent = '?';
        
        // 卡片背面 (符号面)
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-face', 'card-back');
          // 1. 创建img标签
        const cardImg = document.createElement('img');
        // 2. 设置图片路径（symbol即symbols数组中的图片路径）
        cardImg.src = symbol;
        // 3. 设置图片alt文本（优化 accessibility）
        cardImg.alt = '卡牌图片';
        // 4. 添加img到cardBack中
        cardBack.appendChild(cardImg);
        
        // 将正面和背面添加到卡片
        card.appendChild(cardFront);
        card.appendChild(cardBack);
        
        // 添加点击事件
        card.addEventListener('click', () => flipCard(card));
        
        // 将卡片添加到游戏板和数组
        gameBoard.appendChild(card);
        // 强制图片适配卡牌尺寸，避免变形
    cardImg.style.width = '100%';
    cardImg.style.height = '100%';
    cardImg.style.objectFit = 'cover'; // 保持图片比例，裁剪超出部分
    cardImg.style.borderRadius = '3px'; // 与卡牌圆角呼应
        cards.push(card);
    });
}

// 翻转卡片
function flipCard(card) {
    // 如果已经匹配或者正在翻转中，则忽略点击
    if (card.classList.contains('matched') || flippedCards.length >= 2 || flippedCards.includes(card)) {
        return;
    }
    
    // 开始游戏计时
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }
    
    // 翻转卡片
    card.classList.add('flipped');
    flippedCards.push(card);
    
    // 检查是否翻转了两张牌
    if (flippedCards.length === 2) {
        moves++;
        movesElement.textContent = `${moves} 步`;
        checkMatch();
    }
}

// 检查是否匹配
function checkMatch() {
    const [card1, card2] = flippedCards;
    
    setTimeout(()=>{if (card1.dataset.symbol === card2.dataset.symbol) {
        // 匹配成功
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];
        matchedPairs++;
        
        // 检查游戏是否结束
        if (matchedPairs === symbols.length) {
            setTimeout(() => {
                endGame();
            }, 500);
        }
    } else {
        // 不匹配，翻回
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 0);
    }},700);
}

// 开始计时器
function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        timerElement.textContent = `时间: ${timer}秒`;
    }, 1000);
}

// 结束游戏
function endGame() {
    clearInterval(timerInterval);
    
    // 创建模态框元素
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.style.display = 'flex';
    
    // 模态框内容
    modal.innerHTML = `
        <div class="modal-content">
            <h2>恭喜你赢了！</h2>
            <p>你用了 ${moves} 步</p>
            <p>耗时 ${timer} 秒</p>
            <button class="play-again">再玩一次</button>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(modal);
    
    // 再玩一次按钮事件
    const playAgainButton = modal.querySelector('.play-again');
    playAgainButton.addEventListener('click', () => {
        document.body.removeChild(modal);
        initGame();
    });
}

// 重新开始按钮事件
restartButton.addEventListener('click', initGame);

// 游戏初始化
initGame();
