define({
  "name": "武大活动服务端",
  "version": "1.0.0",
  "description": "武大活动服务端",
  "title": "武大活动服务端",
  "url": "http://alumnihome1893.whu.edu.cn/activity_api",
  "header": {
    "title": "武大活动服务端",
    "content": "<h1>武大活动API</h1>\n<p>此处提供活动模块 API。</p>\n<h2>基础说明</h2>\n<h3>1.  API访问地址</h3>\n<ol>\n<li>BaseUrl <code>http://alumnihome1893.whu.edu.cn/activity_api</code></li>\n</ol>\n<p>例如: <code>/api/auth/login</code> 接口 访问时使用 使用  <code>http://alumnihome1893.whu.edu.cn/activity_api/api/auth/login</code></p>\n<h3>2. 文件服务</h3>\n<ol>\n<li>文件上传</li>\n</ol>\n<p>BaseUrl: <code>http://alumnihome1893-1.whu.edu.cn/fs_upload</code></p>\n<p>a. 图片上传  POST: <code>${BaseUrl}/api/files/image</code>, 只能上传 .jpg .png 格式图片</p>\n<p>b. 上传视屏  POST: <code>${BaseUrl}/api/files/video</code></p>\n<p>上述接口会返回媒体文件名称，访问媒体文件如下</p>\n<ol start=\"2\">\n<li>文件访问</li>\n</ol>\n<p>BaseUrl: <code>http://alumnihome1893-1.whu.edu.cn/files</code></p>\n<p>c. 访问图片 <code>${BaseUrl}/image/a.jpg</code></p>\n<p>c. 访问视屏 <code>${BaseUrl}/video/b.mp4</code></p>\n"
  },
  "sampleUrl": false,
  "defaultVersion": "0.0.0",
  "apidoc": "0.3.0",
  "generator": {
    "name": "apidoc",
    "time": "2019-11-13T05:12:55.762Z",
    "url": "http://apidocjs.com",
    "version": "0.17.7"
  }
});
