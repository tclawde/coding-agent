#!/bin/bash
# X-MCP 完全自动化安装配置脚本

set -e

echo "🚀 X-MCP 完全自动化安装配置"
echo "============================"
echo ""

# 配置变量
EXTENSION_DIR="/tmp/xhs-mcp-extension"
CONFIG_FILE="$HOME/.openclaw/xmcp_config.json"
MCP_SERVER="https://mcp.zouying.work/mcp"

# 1. 检查并下载扩展
echo "📦 步骤1：检查Chrome扩展..."
if [ ! -d "$EXTENSION_DIR" ]; then
  echo "下载扩展..."
  cd /tmp
  curl -L -o xhs-mcp.zip "https://github.com/xpzouying/x-mcp/releases/download/v2026.02.04-0902/xiaohongshu-mcp-extension-latest.zip"
  unzip -o xhs-mcp.zip
  mkdir -p xhs-mcp-extension
  mv background.js icon-*.png manifest.json popup.html assets chunks inject-scripts assets/icons xhs-mcp-extension/
  rm -rf xhs-mcp.zip
fi

echo "✅ 扩展已就绪: $EXTENSION_DIR"
echo ""

# 2. 创建安装指南
echo "📋 步骤2：创建安装指南..."
cat > /tmp/xmcp_install_guide.md << 'MARKDOWN'
# X-MCP 安装指南

## 需要手动完成的步骤

### 1️⃣ 安装Chrome扩展

```bash
# 1. 打开Chrome扩展页面
open chrome://extensions/

# 2. 开启【开发者模式】

# 3. 点击【加载已解压的扩展程序】

# 4. 选择文件夹: /tmp/xhs-mcp-extension
```

### 2️⃣ 获取API Token

```bash
# 1. 打开浏览器访问
open https://x.zouying.work

# 2. 注册账号并登录

# 3. 点击【创建连接】

# 4. 复制API Token
```

### 3️⃣ 配置扩展

```bash
# 1. 点击Chrome工具栏上的X-MCP图标

# 2. 填入API Token

# 3. 确认连接状态
```

### 4️⃣ 告诉我Token

**复制Token后发送给我，我会自动完成配置！**
MARKDOWN

echo "✅ 安装指南已保存到: /tmp/xmcp_install_guide.md"
echo ""

# 3. 等待用户完成手动步骤
echo "⏳ 等待用户完成手动步骤..."
echo ""
echo "=========================================="
cat /tmp/xmcp_install_guide.md
echo "=========================================="
echo ""
echo "完成后请将API Token发送给我！"
echo ""

