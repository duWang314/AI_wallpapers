// 获取粒子容器
const particlesContainer = document.querySelector('.particles');

// 鼠标移动事件
document.addEventListener('mousemove', (event) => {
  // 创建新的粒子元素
  const particle = document.createElement('div');
  particle.classList.add('particle');
  
  // 设置粒子的初始位置
  particle.style.left = event.clientX + 'px';
  particle.style.top = event.clientY + 'px';
  
  // 将粒子添加到容器中
  particlesContainer.appendChild(particle);
  
  // 粒子动画结束后移除粒子
  particle.addEventListener('animationend', () => {
    particle.remove();
  });
});