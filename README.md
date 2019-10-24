# 武大活动api

## 环境
```
Nodejs: v11.13.0
数据库: postgres 8.0, 配置请查看 config目录下的文件
```

## 启动
### 1. 直接使用node管理
```
$ node bin/www api服务
```

### 2. 使用PM2 管理
```
$ pm2 start pm2.product.js # 启动服务
$ pm2 ls # 查看系统部署服务列表
$ pm2 stop <instance_id> # 停止服务， 其中 instance_id 为 pm2 管理程序id
```
具体PM2 的操作，请查看其官网说明 http://pm2.keymetrics.io/

### 3. 测试接口
本程序采用 mocha 测试
```
$ npm run test

```

## 说明
### 1. 视屏图片上传获取
1. 视屏图片上传返回图片名称
2. 服务端需要配置nginx做静态文件服务器，nginx 配置如下
```
    server {
        listen      <PORT>;
        server_name <server_name>;        
        location ~ .*\.(js|css|gif|jpg|jpeg|png|bmp|swf|flv|html|htm)$ {
            root  file_root;
            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-For $remote_addr;
            proxy_cache cache_one;
            proxy_cache_valid 200 304 5m;
            proxy_cache_valid any 1m;
            proxy_cache_key $host$uri$is_args$args;
            add_header Nginx-Cache "$upstream_cache_status";
            expires 10d;
        }
    }

```

比如 `a123.jpg` 采用 `:server_name/images/a123.jpg` 获取图片

另外 nginx 限制上传下载文件大小，可使用 `client_max_body_size` 控制
