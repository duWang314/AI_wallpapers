# 炫酷互动桌面壁纸

一个使用HTML、CSS和JavaScript创建的现代化、可互动的电脑桌面壁纸。

## 功能特性

### 🎨 视觉效果
- **动态粒子系统**：背景中漂浮的彩色粒子，可随鼠标移动产生交互
- **中央能量球**：具有脉动效果和旋转光环的中央互动元素
- **实时时间显示**：右上角显示当前时间和日期
- **主题切换**：支持默认、暗色、明亮三种主题

### 🎮 交互功能
- **鼠标交互**：粒子会跟随鼠标移动，产生吸引效果
- **点击效果**：点击中央球体产生涟漪扩散效果
- **双击重置**：双击中央球体重置所有动画效果
- **控制面板**：底部控制按钮可切换各种效果

### ⌨️ 键盘快捷键
- `T`：切换主题
- `P`：开启/关闭粒子效果
- `M`：开启/关闭背景音乐
- `R`：重置所有动画效果

## 使用方法

1. 直接在浏览器中打开 `index.html` 文件
2. 壁纸将自动全屏显示
3. 使用鼠标或键盘快捷键进行交互

## 文件结构

```
wallpaper/
├── index.html      # 主HTML文件
├── style.css       # 样式文件
├── script.js       # JavaScript功能文件
└── README.md       # 说明文档
```

## 自定义设置

### 修改主题颜色
在 `style.css` 文件中修改以下CSS变量：
- 默认主题：`.orb-core` 的背景渐变和阴影
- 暗色主题：`body.dark-theme` 相关样式
- 明亮主题：`body.light-theme` 相关样式

### 调整粒子数量
在 `script.js` 文件的 `ParticleSystem` 类中修改：
```javascript
this.createParticles(150); // 修改数字调整粒子数量
```

### 添加背景音乐
替换 `index.html` 中的音频源：
```html
<audio id="bg-music" loop>
    <source src="your-music-file.mp3" type="audio/mpeg">
</audio>
```

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 技术特点

- 使用纯CSS3动画实现流畅视觉效果
- 基于Canvas的粒子系统
- 响应式设计，适配不同屏幕尺寸
- 模块化JavaScript代码结构
- 无外部依赖，轻量级实现

享受你的炫酷互动桌面壁纸！✨