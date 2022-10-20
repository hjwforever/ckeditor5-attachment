<p align='center'>
  <img src='docs/img/screenshot.png' alt='screenshot' width='600'/>
</p>

<p align='center'>
集成<b>附件上传</b>及<b>全屏</b>功能的 Ckeditor5富文本编辑器
</p>

<p align='center'>
  <a href="https://github.com/hjwforever/ckeditor5-attachment/blob/main/README.md">English</a> | <b>简体中文</b>
<!-- Contributors: Thanks for getting interested, however, we DON'T accept new transitions to the README, thanks. -->
</p>

## Features

- 支持附件上传
- 支持全屏功能
- 基于[classic-editor5](https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/predefined-builds.html#classic-editor)

## 在任意框架中集成(React, Vue...)

```
import CustomEditor from 'ckeditor5-attachment'

```

[在框架中集成 Ckeditor 编辑器](https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/frameworks/overview.html)

[React 中使用](https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/frameworks/react.html)

[Vue3 中使用](https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/frameworks/vuejs-v3.html) | [Vue2 中使用](https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/frameworks/vuejs-v2.html)

[Angular 中使用](https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/frameworks/angular.html)

and more...

## 仅在 HTML 中使用

```
// import CustomEditor from 'ckeditor5-attachment'
<script src="https://unpkg.com/browse/ckeditor5-attachment@1.0.5/build/ckeditor.js"></script>

<body>
  <h1>Classic editor</h1>
    <div id="editor">
        <p>This is some sample content.</p>
    </div>
    <script>
      CustomEditor
        .create( document.querySelector( '#editor' ) )
        .catch( error => {
            console.error( error );
          });
    </script>
</body>

```

## 构建及测试 CKEditor 富文本编辑器

### 开始构建

1. `pnpm i && pnpm build build` 安装依赖并构建, 编辑器产物为`./build/ckeditor.js`
2. **根目录**下本地开启 http 服务，并访问`sample/index.html`来测试编辑器效果。例如`http-server .`
