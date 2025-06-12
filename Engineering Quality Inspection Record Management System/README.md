# 工程质检记录管理系统

一个支持移动端和PWA的工程质检管理系统，包含质检记录、数据统计、整改追踪和报告导出功能。

## 功能特性
- 响应式设计，适配移动端和桌面端
- PWA支持，可安装到主屏幕
- 语音输入支持
- 拍照上传功能
- 数据可视化统计
- 整改追踪时间轴

## 部署指南

### 1. 本地开发
```bash
pnpm install
pnpm dev
```

### 2. 构建生产版本
```bash
pnpm build
```
构建结果将生成在 `dist/static` 目录

### 3. 部署选项

#### 选项1: Vercel (推荐)
1. 注册Vercel账号
2. 连接Git仓库
3. 导入项目
4. 自动部署

#### 选项2: Netlify
1. 注册Netlify账号
2. 拖拽 `dist/static` 文件夹到Netlify
3. 自动部署

#### 选项3: GitHub Pages
1. 在仓库设置中启用GitHub Pages
2. 选择 `gh-pages` 分支或 `dist/static` 目录
3. 访问 `https://[username].github.io/[repo]`

### PWA配置
项目已包含以下PWA必要文件：
- `manifest.json`
- Service Worker (`sw.js`)
- 离线支持

### 自定义域名
1. 在托管平台配置自定义域名
2. 申请SSL证书(平台通常自动提供)
3. 确保所有请求使用HTTPS

## 环境变量
无需特殊环境变量

## 测试账号
- 用户名: test@example.com
- 密码: test123
