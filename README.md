# Web3 DApp 演示项目

这是一个基于 Web3 技术栈的去中心化应用（DApp）演示项目，展示了如何构建一个与以太坊区块链交互的现代化网页应用。

## 技术栈

- **前端框架**
  - React 18
  - TypeScript
  - Vite (构建工具)

- **UI 组件**
  - Chakra UI
  - Framer Motion (动画)

- **Web3 相关**
  - ethers.js (区块链交互)
  - MetaMask (钱包连接)

## 主要功能

### 1. 钱包连接
- MetaMask 钱包集成
- 支持多链网络（Mainnet、Goerli、Sepolia）
- 账户状态管理
- 网络切换检测

### 2. 账户管理
- 显示当前账户地址
- 实时余额查询
- 账户切换监听
- 安全断开连接

### 3. 交易功能
- 发送 ETH 到指定地址
- 交易金额验证
- 交易状态跟踪
- 交易历史记录

### 4. 安全特性
- 地址格式验证
- 网络兼容性检查
- 交易金额验证
- 完整错误处理

## 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0 或 yarn >= 1.22.0
- 现代浏览器（Chrome、Firefox、Safari 等）
- MetaMask 浏览器扩展（最新版本）
- macOS、Windows 或 Linux 操作系统

### 推荐开发工具
- Visual Studio Code
- TypeScript >= 5.0.0
- Git >= 2.0.0

### 安装步骤

1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

3. 在浏览器中打开 http://localhost:5173

### MetaMask 配置

1. 安装 MetaMask 浏览器扩展
2. 创建或导入钱包
3. 连接到支持的网络：
   - Ethereum Mainnet
   - Goerli 测试网
   - Sepolia 测试网

## 项目结构

```
src/
├── components/     # React 组件
├── utils/         # 工具函数
│   └── web3.ts    # Web3 相关功能
├── types/         # TypeScript 类型定义
├── App.tsx        # 主应用组件
└── main.tsx       # 应用入口
```

## 开发指南

### 添加新网络
在 `App.tsx` 中的 `SUPPORTED_NETWORKS` 对象中添加新的网络配置：

```typescript
const SUPPORTED_NETWORKS = {
  1: 'Ethereum Mainnet',
  5: 'Goerli Testnet',
  11155111: 'Sepolia Testnet',
  // 添加新网络
};
```

### 错误处理
项目使用 Chakra UI 的 Toast 组件显示错误信息：

```typescript
toast({
  title: '错误标题',
  description: '错误描述',
  status: 'error',
  duration: 3000,
});
```

## 注意事项

- 确保 MetaMask 已安装并解锁
- 首次使用需要授权网站连接到 MetaMask
- 建议在测试网络上进行测试
- 请勿在生产环境中存储私钥或敏感信息

## 许可证

MIT License
