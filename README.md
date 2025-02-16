# Data Guardian

Data Guardian 是一个基于 Vue 3 + TypeScript + Vite 的前后端分离项目，旨在实现前后端分离的现代化 Web 应用并服务于数据稽核功能。
本项目集成了以下主要技术/库：

- **Vue 3**：组件式前端框架
- **TypeScript**：静态类型支持
- **Vite**：轻量高速的前端构建工具
- **Pinia**：Vue 官方推荐的状态管理库
- **Vue Router**：页面路由管理
- **axios**：HTTP 请求库，用于与后端进行数据交互
- **mitt**：轻量级事件总线，用于跨组件通信
- **Element Plus**：UI 组件库

## 目录结构

```
Data-Guardian/
├── public/                    // 纯静态文件（**favicon、logo** 等图标文件）
├── src/
│   ├── api/                   // 封装与后端交互的 axios 实例及业务请求方法
│   ├── assets/                // 静态资源，如图片、全局样式、字体等
│   ├── components/            // 可复用的通用组件
│   ├── hooks/                 // 自定义 Hooks，抽离和复用逻辑
│   ├── mitt/                  // 事件总线 (mitt) 相关文件
│   ├── router/
│   │   └── index.ts           // Vue Router 配置与路由规则
│   ├── store/                 // Pinia 全局状态管理
│   ├── types/                 // TypeScript 类型声明/接口/泛型定义
│   ├── views/                 // 页面级组件，对应各路由视图
│   ├── App.vue                // 根组件
│   └── main.ts                // 应用入口文件，注册路由、状态管理、全局插件等
├──  index.html                // 应用入口 HTML
├── .gitattributes
├── .gitignore
└── index.html                 // 入口文件（部分配置可能使用 Vite 默认配置）
```

### 主要文件/文件夹说明

1. public/index.html
   - 用于存放无需 Vite 处理的纯静态文件（**favicon、logo** 等图标文件），这些文件会被直接复制到打包结果中。
2. src/api/
   - 统一管理后端 API 调用，使用 `axios` 封装请求、响应拦截器。
3. src/assets/
   - 放置图片、字体、全局样式等静态资源。
4. src/components/
   - 通用可复用的组件，如弹窗、表单等。
5. src/hooks/
   - Vue 3 自定义 Hooks，用于抽离复用逻辑，如请求数据、处理表单等。
6. src/mitt/
   - 事件总线相关文件，通过 `mitt` 实现跨组件通信。
7. src/router/
   - 路由配置文件夹，`index.ts` 中定义了路由表。
8. src/store/
   - Pinia 的 store 文件夹，用于管理全局状态。
9. src/types/
   - 项目中使用的公共类型声明，包含接口、枚举等。
10. src/views/
    - 页面级组件，每个文件通常对应一个路由页面。
11. App.vue
    - Vue 应用的根组件，包含全局布局或 `<router-view>`。
12. main.ts
    - 项目入口文件，初始化 Vue 应用并注册路由、Pinia、UI 库等。

------

## 安装与运行

> [!NOTE]
>
> 以下命令基于 [Node.js](https://nodejs.org/) 和 [npm](https://www.npmjs.com/) 进行示例。

1. **克隆项目**

   ```
   git clone data-guardian https://github.com/LandonZhang/Data-Guardian.git
   cd Data-Guardian
   ```

2. **安装依赖**

   ```
   npm install
   ```

   - 该命令会自动安装本项目中 `package.json` 里声明的所有依赖，包括 Vue、Pinia、axios 等。

3. **开发环境运行**

   ```
   npm run dev
   ```

   - 运行后会启动一个开发服务器（默认端口通常为 5173 或者终端提示的端口），可在浏览器中打开 http://localhost:5173 查看项目。

---

## Git 协作流程指南

1. **队员拉取最新代码**：

```
git pull origin main
```

2. **队员创建并切换到自己的分支**：

```
git checkout -b feature/xxx
```

- `feature/xxx`：功能开发
- `bugfix/xxx`：bug 修复
- `docs/xxx`：文档修改

3. **队员完成代码并提交**：

```
git add .
git commit -m "feat: 新增用户登录功能"
git push origin feature/xxx
```

4. **在 GitHub 上发起 Pull Request**：

- **标题**：清楚说明完成任务。
- **描述**：说明修改的内容和注意事项，如果是前端页面的UI改动，需要附上对应的截图。

> [!CAUTION]
>
> 请不要直接推送到`main`主分支，每次的任务都在分支上进行，完成后发送PR请求，张耀宗在确认新改动能正常运行之后，会进行分支合并。
>
> 提交的历史记录最好保持清晰和线性，无关紧要的提交信息请使用`rebase`和上一次提交合并或者发出ISSUE让张耀宗进行处理即可。
