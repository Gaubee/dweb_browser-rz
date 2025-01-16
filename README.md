# 《自由穿梭》软著资料

两个文档都是用html技术来生成的，本来打算直接走代码生成pdf，这些代码的底层逻辑无非也就是用无头浏览器来进行输出网页。

但发现还是直接手动在网页上打印成pdf会比较方便，因为可以实时预览。

## 示例代码

关键在于用了primsjs，它的亮点在于官网有一个download页面，可以选择所需的语言（如果有依赖关系，会自动勾选依赖集）、选择所需的样式表，然后下载最终的很小的js+css文件。

关于代码换行，修改 prism.css 将 `white-space: pre;` 修改为 `white-space: pre-wrap;`

## 说明书

说明书我选择用markdown来写html，会比较干净有规律。
这里首先用tailwind来做reset，
然后用 [github.com/sindresorhus/github-markdown-css]() 来提供默认样式。

然后用这个代码来确保一个基本的分页行为：

```css
h2 {
  page-break-before: always;
}
```

只要遇到h2元素，就会令起一页。

接着就是最关键的 [https://pagedjs.org]() 这个库了，它可以在网页上提供实时的预览功能。
这里的关键时配合 [interface.css](https://gitlab.coko.foundation/pagedjs/interface-polyfill)，它能美化预览界面（默认是双屏的，打开里头的一些注释，就可以单屏预览了），这些预览在打印的时候并不会生效。（这里是利用 `@media screen` 来写样式）

另外，图片压缩是有必要的，这里用浏览器的canvas来对图片进行所需大小的导出即可，在 paged.js 加载之前，配置好全局的 PagedConfig 对象，可以放置一些生命周期的钩子函数。

另外，关于页眉页脚的定义，可以参考官方文档：
[https://www.w3.org/TR/css-gcpm-3/#example-e698ead2]()
