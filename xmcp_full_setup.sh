#!/bin/bash
# X-MCP 完整安装配置脚本

set -e

echo "🚀 X-MCP 完整安装配置"
echo "===================="
echo ""

# 1. 解压扩展（如果还没解压）
if [ ! -d "/tmp/xhs-mcp-extension" ]; then
  echo "📦 解压 Chrome 扩展..."
  cd /tmp
  unzip -o xhs-mcp.zip -d xhs-mcp-extension 2>/dev/null || true
  mv background.js icon-*.png manifest.json popup.html assets chunks inject-scripts assets/icons xhs-mcp-extension/ 2>/dev/null || true
fi

echo "✅ 扩展文件位置：/tmp/xhs-mcp-extension"
echo ""

# 2. 检查是否已安装 Chrome 扩展
echo "🔍 检查 Chrome 扩展..."
EXTENSION_PATH="/tmp/xhs-mcp-extension"

if [ ! -d "$EXTENSION_PATH" ]; then
  echo "❌ 扩展文件不存在，请先下载"
  exit 1
fi

echo "✅ 扩展文件已准备就绪"
echo ""
echo "📋 手动步骤（需要你操作）："
echo ""
echo "======================================"
echo "步骤 1：安装 Chrome 扩展"
echo "======================================"
echo ""
echo "1. 打开 Chrome 浏览器"
echo "2. 地址栏输入：chrome://extensions/"
echo "3. 开启右上角 【开发者模式】"
echo "4. 点击 【加载已解压的扩展程序】"
echo "5. 选择文件夹：/tmp/xhs-mcp-extension"
echo ""
echo "======================================"
echo "步骤 2：获取 API Token"
echo "======================================"
echo ""
echo "1. 打开浏览器访问：https://x.zouying.work"
echo "2. 注册账号并登录"
echo "3. 点击【创建连接】"
echo "4. 复制 API Token（只会显示一次！）"
echo ""
echo "======================================"
echo "步骤 3：配置扩展"
echo "======================================"
echo ""
echo "1. 点击 Chrome 工具栏上的 X-MCP 图标"
echo "2. 填入你的 API Token"
echo "3. 确认连接状态显示【已连接】"
echo ""
echo "======================================"
echo ""
echo "完成后告诉我，我将继续配置！"
echo ""
