// script.js
document.getElementById('starrySky').addEventListener('click', function(event) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // 设置星星的位置
    star.style.left = event.clientX + 'px';
    star.style.top = event.clientY + 'px';

    // 添加到DOM中
    this.appendChild(star);

    // 可以添加动画或随机大小等额外效果
});

// 加载时自动添加几颗星星
window.onload = function() {
    for (let i = 0; i < 50; i++) {
        let star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * window.innerWidth + 'px';
        star.style.top = Math.random() * window.innerHeight + 'px';
        document.getElementById('starrySky').appendChild(star);
    }
};