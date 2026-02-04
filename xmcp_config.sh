#!/bin/bash
# X-MCP 配置脚本

echo "🔧 配置 X-MCP..."
echo ""

# API Token (需要用户填入)
API_TOKEN="${1:-YOUR_API_TOKEN_HERE}"

# 检查是否提供了Token
if [ "$API_TOKEN" = "YOUR_API_TOKEN_HERE" ]; then
  echo "❌ 需要提供 API Token"
  echo ""
  echo "📋 获取 Token 步骤："
  echo "1. 打开 https://x.zouying.work"
  echo "2. 注册账号并登录"
  echo "3. 点击【创建连接】"
  echo "4. 复制 API Token"
  echo ""
  echo "📝 使用方法："
  echo "   ./xmcp_config.sh YOUR_API_TOKEN"
  echo ""
  exit 1
fi

echo "✅ Token 已配置"
echo ""
echo "🔗 MCP 服务器地址：https://mcp.zouying.work/mcp"
echo ""
echo "📝 下一步："
echo "1. 安装 Chrome 扩展"
echo "2. 在扩展中填入 Token"
echo "3. 我会自动连接 MCP"
echo ""
