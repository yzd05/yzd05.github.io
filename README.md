# yzd 的博客

记录边缘智能、端云协同与大模型系统方向的论文阅读和技术思考。

**[访问博客 →](https://yzd05.github.io/)**

## 阅读内容

关注模型如何在有限的算力、时延和费用下完成任务，以及这些约束如何影响智能体的规划、路由和执行。

| 阅读笔记 | 关注的问题 |
|---|---|
| [AIMS · EuroSys 2026](https://yzd05.github.io/posts/aims/) | 模型选择如何改变智能体的后续轨迹？能否通过收敛预测和任务分解减少云端调用？ |
| [HybridFlow · ICML 2026](https://yzd05.github.io/posts/hybridflow/) | 如何把查询拆成可并行的子任务，并在资源预算内决定哪些步骤上云？ |

论文笔记采用统一的九节结构：问题与动机、核心思路、方法细节、实验、我的理解与疑问、相关工作、可探索方向、术语速查和引用。除了整理方法与关键公式，也会记录实验口径、实现歧义和仍需验证的问题，便于对照阅读不同工作。

笔记中的论文结论、个人推导与推测会分别说明；实验数字尽量注明对应的章节、图表和版本。欢迎通过 [Issues](https://github.com/yzd05/yzd05.github.io/issues) 交流或指出错误。

## 站点实现

使用 [Hugo](https://gohugo.io/) 与 [PaperMod](https://github.com/adityatelange/hugo-PaperMod/) 构建，由 GitHub Pages 托管。页面采用白底双栏布局，提供全文搜索、归档、标签、分类、关于页，以及随阅读位置高亮的侧栏目录。支持移动端导航、阅读字号与护眼背景设置、代码高亮与复制；公式在构建时转换为 MathML，无需加载外部公式渲染服务。

文章和配图保存在同一个目录中，便于直接阅读源码与维护内容：

```text
content/posts/          文章与配图
archetypes/paper.md     论文阅读笔记模板
assets/css/            站点样式
assets/js/blog.js      搜索、目录高亮与阅读设置
static/images/         头像等站点图片
layouts/               页面布局与公式渲染扩展
themes/PaperMod/        主题源码及许可证
hugo.toml              站点配置
.github/workflows/     自动构建与部署
```

## 本地运行

安装 **Hugo Extended 0.168.0**（与部署环境一致），然后运行：

```sh
git clone https://github.com/yzd05/yzd05.github.io.git
cd yzd05.github.io
hugo server -D
```

主题源码已包含在仓库内。新建论文笔记可使用 `hugo new content --kind paper posts/my-paper/index.md`；完成后将文章的 `draft` 设为 `false`，并检查发布日期。

正式构建使用 `hugo --gc --minify --panicOnWarning`，输出到 `public/`。推送至 `main` 后，GitHub Actions 自动构建并部署。

## 引用与许可

论文和图表的出处、许可及修改说明见对应文章。引用相关研究时，请优先引用原论文。

PaperMod 主题采用 [MIT 许可证](themes/PaperMod/LICENSE)。
