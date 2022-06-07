# element-ui

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 项目目录结构

```
element-ui
├─ .browserslistrc																-- browserslist 配置文件
├─ .env																			
├─ .env.development
├─ .env.production
├─ .eslintrc.js																	-- eslint 配置文件
├─ .git
├─ .gitignore
├─ .prettierignore																-- prettier 忽略配置文件
├─ .prettierrc.json																-- prettier 配置文件
├─ .stylelintrc.js																-- stylelint 配置文件
├─ .vscode																		-- vscode 配置文件
├─ babel.config.js																-- babel 配置文件
├─ jsconfig.json
├─ package.json
├─ public
├─ README.md
├─ src
│  ├─ App.vue
│  ├─ assets																	-- 静态资源
│  ├─ components																-- 组件
│  ├─ main.js
│  ├─ router																	-- 路由
│  ├─ services																	-- 放置请求与接口集中处理
│  ├─ store																		-- vuex
│  ├─ utils																		-- 工具库
│  └─ views																		-- 页面
├─ vue.config.js																-- 项目配置文件
└─ yarn.lock

```

### 依赖环境版本

- vue-cli@3.11.0
- webpack@5.72.1
- node@16.15.0
- npm@8.5.5
- yarn@1.22.18

### 依赖库

- axios				0.27.2				接口请求
- dayjs				1.11.2				时间日期
- lodash-es			4.17.21				js工具库
- vue				2.6.14				VUE
- vue-router		3.5.1				路由
- vuex				3.6.2				缓存

### env

- VUE_APP_BASE_API					ip地址
- NODE_ENV 							端
- VUE_APP_TITLE						环境，dev开发，prod生产
- VUE_APP_SYSTEM_PREFIX				缓存前缀

### yarn

使用npm安装yarn

```
npm install -g yarn
```

查看yarn是否安装成功/查看yarn版本号

```
yarn --version
```

### 一些情况注意

- 该项目使用的是yarn