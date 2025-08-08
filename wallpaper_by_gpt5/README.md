# 互动炫酷桌面壁纸 (HTML/CSS/JS)

纯前端 (HTML/CSS/JavaScript) 实现的可交互动态桌面壁纸，包含：
- 多层渐变 + 网格 + 动态辉光背景
- 粒子流动 + 粒子连接网络 + 鼠标引力
- 点击 Ripple 波纹特效
- 实时时钟 & 日期（中文）
- 随机中文/英文短句轮播
- 多套主题一键切换（含 default / neo / sunset / violet / matrix / gold）
- 自动随时间变化的辉光色彩（可关闭）
- 性能控制（粒子数量、连线距离）
- FPS + 粒子统计显示
- 配置持久化 (localStorage)

## 运行
直接使用浏览器打开 `index.html` 即可。可配合 Wallpaper Engine / Lively Wallpaper 等工具设置为桌面背景。

## 文件说明
- `index.html` 页面结构 & 控制面板
- `styles.css` 视觉样式、主题、动画
- `main.js` 主逻辑、粒子、主题切换、交互
- `README.md` 说明文档

## 自定义建议
1. 增加短句：编辑 `main.js` 内的 `quotes` 数组。
2. 新主题：在 `styles.css` 中添加 `body.theme-xxx{ --accent:... }`，并在 `themes` 数组追加条目。
3. 性能调优：降低 粒子数量 (粒子数量滑块) 和 连线距离 减少连线计算。
4. 伪 4K 优化：可提高 canvas 分辨率 (乘以 devicePixelRatio) 并缩放绘制。
5. 深色/浅色自动：监听系统 `matchMedia('(prefers-color-scheme: dark)')` 动态切换主题。

## 壁纸引擎适配（思路）
- 去除面板按钮（或者设置定时自动隐藏）
- 将配置写死或提供 URL 参数方式传入
- 关闭滚动条影响：已禁用 body 滚动

## License
MIT (可自由修改 & 分发，保留版权声明即可)
