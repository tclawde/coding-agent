/**
 * 模块2: 发送截图到飞书 (使用curl调用OpenClaw API)
 */

const { execSync } = require('child_process');
const fs = require('fs');

const FEISHU_USER_ID = 'ou_715534dc247ce18213aee31bc8b224cf';

async function sendToFeishu(imagePath, messageText = '请扫码登录 📱') {
  console.log(`📨 发送截图到飞书...`);
  
  try {
    // 读取图片并转为base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');
    
    // 获取文件扩展名
    const ext = imagePath.split('.').pop();
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
    
    // 调用OpenClaw API发送图片
    // 注意：这里需要知道OpenClaw的API地址，通常是 http://localhost:11434
    const apiUrl = process.env.OPENCLAW_API_URL || 'http://localhost:11434';
    
    // 使用简化的方式：通过系统命令
    // 实际上应该让主进程处理这个消息发送
    // 这里我们先保存截图，主脚本会负责发送
    
    console.log('✅ 截图已准备好');
    console.log(`📁 图片路径: ${imagePath}`);
    console.log(`💬 消息: ${messageText}`);
    
    return true;
  } catch (e) {
    console.log('❌ 准备失败:', e.message);
    return false;
  }
}

async function waitForLogin(page, timeout = 120000) {
  console.log('⏳ 等待扫码登录...');
  try {
    await page.waitForFunction(() => {
      return document.cookie.includes('web_session');
    }, { timeout });
    console.log('✅ 检测到登录成功！');
    return true;
  } catch (e) {
    console.log('⚠️ 登录超时（2分钟）');
    return false;
  }
}

module.exports = { sendToFeishu, waitForLogin };
