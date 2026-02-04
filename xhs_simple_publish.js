/**
 * 小红书发布助手 - 极简版
 * 用途：打开小红书发布页面，自动填写内容，等待手动发布
 */

const { chromium } = require('playwright');
const fs = require('fs');

// 配置
const CONFIG = {
  loginUrl: 'https://www.xiaohongshu.com',
  publishUrl: 'https://www.xiaohongshu.com/editor/publish',
  cookiePath: '/tmp/cookies.json',
  imagePath: process.argv[2] || '/Users/apple/Desktop/screenshot_20260204_233211.png',
  title: process.argv[3] || '测试标题',
  content: process.argv[4] || '这是自动填写的内容'
};

async function main() {
  console.log('🚀 小红书发布助手启动...\n');
  
  // 1. 启动浏览器
  console.log('📱 启动浏览器...');
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chromium'
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // 2. 加载 cookies
  if (fs.existsSync(CONFIG.cookiePath)) {
    const cookies = JSON.parse(fs.readFileSync(CONFIG.cookiePath, 'utf8'));
    await context.addCookies(cookies);
    console.log('✅ 已加载登录状态\n');
  } else {
    console.log('⚠️ 未找到 cookies，需要先登录\n');
  }
  
  // 3. 打开发布页面
  console.log('🌐 打开发布页面...');
  await page.goto(CONFIG.publishUrl, { waitUntil: 'networkidle', timeout: 30000 });
  
  // 4. 等待页面加载
  await page.waitForTimeout(3000);
  
  console.log('📸 截图保存中...\n');
  await page.screenshot({ path: '/tmp/xhs_01_editor.png' });
  
  // 5. 检测发布表单
  console.log('🔍 检测发布表单...\n');
  
  // 检测是否需要登录
  const loginText = await page.$('text=登录');
  if (loginText) {
    console.log('❌ 需要登录！请扫码登录\n');
    await page.screenshot({ path: '/tmp/xhs_login_required.png' });
  } else {
    console.log('✅ 已登录\n');
  }
  
  // 检测标题输入框
  const titleInput = await page.$('textarea[placeholder*="标题"], textarea[maxlength="20"]');
  if (titleInput) {
    console.log('✏️ 填写标题...');
    await titleInput.fill(CONFIG.title);
    console.log(`   标题: ${CONFIG.title}\n`);
  }
  
  // 检测内容输入框
  const contentInput = await page.$('div[contenteditable="true"]');
  if (contentInput) {
    console.log('📝 填写内容...');
    await contentInput.fill(CONFIG.content);
    console.log(`   内容: ${CONFIG.content}\n`);
  }
  
  // 检测图片上传
  const fileInput = await page.$('input[type="file"]');
  if (fileInput && fs.existsSync(CONFIG.imagePath)) {
    console.log('📤 上传图片...');
    await fileInput.setInputFiles(CONFIG.imagePath);
    console.log(`   图片: ${CONFIG.imagePath}\n`);
    
    // 等待图片上传
    await page.waitForTimeout(3000);
  }
  
  // 最终截图
  await page.screenshot({ path: '/tmp/xhs_02_filled.png' });
  
  console.log('═══════════════════════════════════════');
  console.log('✅ 表单已填写完成！');
  console.log('');
  console.log('📋 请检查页面内容，然后手动点击发布按钮');
  console.log('');
  console.log('注意事项:');
  console.log('  • 图片可能需要几秒钟上传');
  console.log('  • 标题限制20字');
  console.log('  • 正文限制1000字');
  console.log('═══════════════════════════════════════\n');
  
  // 不关闭浏览器，让用户手动操作
  console.log('⏸️ 浏览器保持打开状态');
  
}

main().catch(err => {
  console.error('❌ 错误:', err.message);
  process.exit(1);
});
