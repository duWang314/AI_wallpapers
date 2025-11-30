# Neon Interactive Wallpaper

这是一个基于 HTML/CSS/JS 的交互式电脑桌面壁纸示例。特点：

- 炫酷霓虹粒子特效
- 鼠标交互（移动、点击、按住左键吸引粒子）
- 主题切换（暗/亮）和参数控制（粒子数、大小、颜色、运动模糊）
- 设置会保存在 `localStorage` 中

## 快速运行

在 Windows 上，从 `wallpaper` 文件夹运行：

```cmd
cd C:\Users\Administrator\VscodeProjects\AI_wallpapers\wallpaper
start index.html
```

在浏览器中打开后，按 `F11` 进入全屏以获得最佳桌面效果。

## 作为桌面壁纸（建议方法）

- 使用支持网页作为壁纸的工具，例如 Wallpaper Engine、RainWallpaper 或其他“网页壁纸/Live Wallpaper”应用。
- 这些工具通常允许你指定一个本地 HTML 文件或网页 URL，并将其设置为桌面背景。

## 文件

- `index.html` — 页面入口和 UI
- `style.css` — 样式和主题变量
- `app.js` — 粒子系统与交互逻辑

## 小技巧

- 若要开始时自动进入全屏，可在支持的工具中打开并启用全屏。
- 若想录制或截屏高清壁纸，将浏览器窗口设置为目标分辨率并使用高质量录制工具。
