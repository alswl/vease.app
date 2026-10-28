# Vease App 小红书宣传图

四张 1200 × 1600（3:4）竖版：清透旅行、旅行手账、霓虹电影、周末生活。

- 同名 PNG：可直接发布的成图。
- 同名 SVG：内嵌底图，文字为独立可编辑图层，可用设计工具调整。中文字体建议 PingFang SC。
- `backgrounds/`：无字原始底图，方便换文案、重新排版。
- `copy.json`：集中修改标题、说明和文字颜色；执行 `python3 render.py` 重新生成 SVG 和 PNG，需要 `rsvg-convert`。
- `prompts.json`：内置 image_gen 工具的完整生成提示词。参考仓库旧 Banner 的旅行胶片、Mac 与紫蓝视觉方向。

画面只露出 Vease App，不含域名、二维码或下载链接。底部保留 macOS / Apple Silicon / 邀请内测标识。所有画面为宣传概念图，不是产品实际运行截图。未修改网站与发布配置。
