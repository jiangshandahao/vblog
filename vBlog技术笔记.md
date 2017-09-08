#ueditor样式
## ueditor默认主题样式文件：
`/themes/default/css/ueditor.css`



#ueditor配置选项

## ueditor.config.js
- 工具栏

```
toolbars: [
		[
            'fullscreen', 'source', '|', 
            'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 
            'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
            'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
            'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
            'directionalityltr', 'directionalityrtl', 'indent', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 
            'touppercase', 'tolowercase', '|',
            'link', 'unlink', 'anchor', '|', 
            'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
            'simpleupload', 'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
            'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
            'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
            'print', 'preview', 'searchreplace', 'drafts', 'help'
        ]
    ]
```

```
toolbars: [
		[
            '全屏', '源代码', '|', '撤销', '重做', '|',
            '加粗', '斜体', '下划线', 'fontborder', '删除线', '上标', '下表', '清楚格式', 'formatmatch', 'autotypeset', '引用', '无格式粘贴', '|', 
            'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
            'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
            'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
            'directionalityltr', 'directionalityrtl', 'indent', '|',
            '左对齐', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
            'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
            'simpleupload', 'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
            'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
            'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
            '打印', '预览', 'searchreplace', 'drafts', 'help'
        ]
    ]
```

- 服务器统一请求接口路径

```
serverUrl: 'http://localhost:3000/ueditor/ue'
```
- 是否开启字数统计

```
wordCount:true  
```      

# 前后端通信相关的配置
## 文件地址： ueditor.config.json
- 上传图片配置项 
    
```
"imageActionName": "uploadimage", /* 执行上传图片的action名称 */
 "imageFieldName": "upfile", /* 提交的图片表单名称 */
 "imageMaxSize": 2048000, /* 上传大小限制，单位B */
 "imageAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"], /* 上传图片格式显示 */
```
 
# ueditor组件
## 上传图片对话框
 
 - 页面结构文件地址： `ueditor/dialogs/image/image.html`
 - 逻辑代码文件地址： `ueditor/dialogs/image/image.js` , 包括 ***远程图片/上传图片/在线图片/搜索图片*** 


