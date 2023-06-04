# chatgpt-miniprogram

![小程序](./static/wechat.jpg)

## 快速开始

1. 在根目录下添加 .env 文件, 添加如下内容

- VITE_BASE_URL: 请求 OpenAI 的接口，国内访问需要部署对应代理，具体可自行搜索
- VITE_OPEN_API_KEY：OpenAI 申请到的 key

注意，真实部署不推荐直接 OPEN_API_KEY 直接暴露在前端，本项目只是为了简单演示。

2. 开发构建

```bash
# 安装
$ pnpm i
# 开发
$ pnpm dev
# 构建
$ pnpm build
```

## 注意

- 项目写了些“神奇”的代码的代码，用来绕过微信的审核，建议娱乐下就好，勿真实使用

## 其他文档

- [vin-ui](https://vingogo.cn/docs/index.html)

## 联系

有关 chatgpt-miniprogram 的问题，欢迎添加微信交流，加微信请备注：gpt

![wechat](https://cdn.vingogo.cn/wechat.jpg)
