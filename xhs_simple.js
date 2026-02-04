/**
 * 小红书发布助手 - 极简版
 * 假设用户已经点击了"发布"按钮
 */

const { chromium } = require('playwright');
const fs = require('fs');

async function main() {
  console.log('🚀 启动...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chromium'
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // 加载 cookies
  if (fs.existsSync('/tmp/cookies.json')) {
    const cookies = JSON.parse(fs.readFileSync('/tmp/cookies.json', 'utf8'));
    await context.addCookies(cookies);
    console.log('✅ 已加载登录状态\n');
  }
  
  // 直接访问发布页面 URL
  console.log('🌐 访问发布页面...');
  await page.goto('https://www.xiaohongshu.com/editor/publish');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  console.log('📸 截图\n');
  await page.screenshot({ path: '/tmp/xhs_simple_01.png' });
  
  // 上传图片
  console.log('📤 上传图片...');
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles('/Users/apple/Desktop/screenshot_20260204_233211.png');
  await page.waitForTimeout(5000);
  
  console.log('📸 上传后\n');
  await page.screenshot({ path: '/tmp/xhs_simple_02.png' });
  
  // 填写标题
  console.log('✏️ 填写标题...');
  const titleArea = page.locator('textarea').first();
  await titleArea.fill('自动化测试标题');
  
  console.log('📸 标题后\n');
  await page.screenshot({ path: '/tmp/xhs_simple_03.png' });
  
  console.log('\n✅ 完成！请手动发布\n');
}

main();
