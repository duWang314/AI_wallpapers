# 互动炫酷桌面壁纸 (HTML/CSS/JS)

这是一个可以直接在浏览器里打开、也可通过第三方工具设为桌面壁纸的可交互动画壁纸。

特性：
- 近代感的 Neon/Synth/Space/Calm 主题
- 粒子系统 + 连线 + 鼠标视差
- 点击生成脉冲与粒子爆发
- 实时时钟 + UI 控制主题/粒子数量/速度/模糊效果

文件：
- `index.html` — 主文件
- `style.css` — 样式
- `script.js` — 交互逻辑

如何运行：
1. 本地预览：在文件夹打开 `index.html`，用任意现代浏览器打开（Chrome/Edge/Firefox）。

2. 设为桌面壁纸（Windows）：
- 使用 Wallpaper Engine（付费但功能强大）:
  - 在 Wallpaper Engine 中选择“浏览”，加载 `index.html` 所在的文件夹，添加为网页壁纸。
- 或者使用 "WebView2-based" 桌面壁纸程序，如 "Lively Wallpaper"（免费）：
  - Lively -> 右键 -> Add Wallpaper -> 从文件夹选择 `index.html`。

3. 高级：直接将本页面作为 Electron/Webview 的窗口放到桌面层并隐藏任务栏以获得完全集成体验。

可定制项：
- 右侧控制区可调主题、粒子数量、速度、是否模糊。
- 在 `script.js` 中修改 `THEMES` 常量以添加或替换主题配色。

开发建议：
- 如果想在壁纸程序里保持性能，请把粒子数量调低（例如 40-100）。
- 若想导出为独立的屏幕保护或应用，请将代码嵌入 Electron 或 NW.js。

反馈：欢迎提出想要的特效或风格，我可以帮你加入额外的视觉元素（例如星轨、云彩、音频响应）。