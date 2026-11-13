# yzd's notebook

用于论文阅读与技术笔记的 Hugo 博客。基于 PaperMod，参考 Lil’Log 的内容结构：纯白背景、单栏正文、标题和摘要组成的文章列表。主题本身保持原样。

## 本地预览

需要 **Hugo Extended 0.168.0**（PaperMod 当前至少需要 0.158.0）。

```powershell
hugo server -D
```

本机也可使用下载到工作区的 Hugo：

```powershell
& D:\blog\.tools\hugo\hugo.exe server -D
```

## 写文章

```powershell
hugo new content posts/my-post/index.md
```

写论文阅读时，可使用你的九节笔记模板：

```powershell
hugo new content --kind paper posts/my-paper/index.md
```

模板保存在 `archetypes/paper.md`，新建文章默认是草稿，发布前需替换占位内容。

论文阅读和技术笔记统一放在 `content/posts/`，不分类。图片与 `index.md` 放在同一个目录，通过 `![说明](figure.png)` 引用。填写标题、description；写完后把 `draft = true` 改成 `false`。日期必须不晚于实际发布日期，未来日期文章默认不发布。

需要附加论文信息时，可选填写 `paper_title`、`paper_url`、`paper_authors`、`paper_venue`，在正文上方显示。

## 公式和代码

行内公式写成 `$E=mc^2$`，独立公式用 `$$` 包围。也支持 `\( ... \)` 和 `\[ ... \]`。公式在构建时转换为 MathML，无需访问外部公式 CDN；建议使用现代浏览器。正文中的货币美元符号需要转义成 `\$`。

代码块标注语言，例如 ` ```python `，即可显示语法高亮与复制按钮。二、三级 Markdown 标题自动生成文章目录。

## 构建

```powershell
hugo --gc --minify --panicOnWarning
```

发布目录为 `public/`。首页仅显示 POST 文章列表，不包含搜索、关于或分类页。草稿不会出现在正式网站。

## 发布到 GitHub Pages

仓库使用 `yzd05/yzd05.github.io`。将本项目的源码放到 `main` 分支，在 GitHub 的 Settings → Pages 中将 Source 设为 **GitHub Actions**。之后推送 `main` 时会自动构建并部署，网址仍为 `https://yzd05.github.io/`。

工作流位于 `.github/workflows/hugo.yml`，固定 Hugo 版本为 0.168.0，主题以完整源码随站点保存，版本为 969bebdc5600a1639158b5ef4eff9cf6cbb511ac，保留上游 MIT 许可证。旧账号工程保留在 D:\blog\yzd-blog；新工程不会覆盖旧站。

## 项目结构

- `content/posts/`：全部文章
- `archetypes/`：写作模板，默认创建草稿
- `assets/css/extended/notebook.css`：个人样式
- `layouts/`：首页、空状态、公式与论文元数据扩展
- `themes/PaperMod/`：固定版本的上游主题（随站点保存的主题源码）

旧站和原有 24 篇文章单独保存在 `D:\blog\backups\`，不参与新站构建。

主题采用 [PaperMod](https://github.com/adityatelange/hugo-PaperMod/)（MIT）。


## 本次迁移

2026-11-13：由原站工程迁移到 `yzd05.github.io`，保留 HybridFlow 阅读笔记并新增 AIMS 阅读笔记。原 Hexo 历史备份继续保存在原目录，不包含在本仓库中。
