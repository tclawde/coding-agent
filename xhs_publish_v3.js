/**
 * 小红书发布助手 v3 - 直接点击发布按钮
 */

const { chromium } = require('playwright');
const fs = require('fs');

async function main() {
  console.log('🚀 小红书发布助手 v3\n');
  
  const browser = await chromium.launch({ headless: false, channel: 'chromium' });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // 加载 cookies
  if (fs.existsSync('/tmp/cookies.json')) {
    const cookies = JSON.parse(fs.readFileSync('/tmp/cookies.json', 'utf8'));
    await context.addCookies(cookies);
    console.log('✅ 已加载登录状态\n');
  }
  
  // 打开首页
  console.log('🌐 打开小红书首页...');
  await page.goto('https://www.xiaohongshu.com', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  console.log('📸 截图: 首页\n');
  await page.screenshot({ path: '/tmp/xhs_v3_home.png' });
  
  // 点击发布按钮
  console.log('📝 点击发布按钮...');
  
  // 多种选择器尝试
  const publishBtn = await page.$('button:has-text("发布")');
  if (publishBtn) {
    await publishBtn.click();
    console.log('✅ 点击发布按钮\n');
    await page.waitForTimeout(5000);
  } else {
    console.log('⚠️ 未找到发布按钮\n');
  }
  
  console.log('📸 截图: 点击后\n');
  await page.screenshot({ path: '/tmp/xhs_v3_after_click.png' });
  
  // 点击图文发布
  console.log('📷 点击图文选项...');
  const tuwenBtn = await page.$('text=图文');
  if (tuwenBtn) {
    await tuwenBtn.click();
    console.log('✅ 点击图文\n');
    await page.waitForTimeout(3000);
  }
  
  console.log('📸 截图: 图文发布页\n');
  await page.screenshot({ path: '/tmp/xhs_v3_tuwen.png' });
  
  // 上传图片
  console.log('📤 上传图片...');
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles('/Users/apple/Desktop/screenshot_20260204_233211.png');
    console.log('✅ 图片已选择\n');
    await page.waitForTimeout(3000);
  }
  
  console.log('📸 截图: 上传后\n');
  await page.screenshot({ path: '/tmp/xhs_v3_uploaded.png' });
  
  // 填写标题
  console.log('✏️ 填写标题...');
  const titleInputs = await page.$$('textarea, input[type="text"]');
  if (titleInputs.length > 0) {
    await titleInputs[0].fill('测试标题');
    console.log('✅ 标题已填写\n');
  }
  
  console.log('📸 截图: 填写标题后\n');
  await page.screenshot({ path: '/tmp/xhs_v3_title.png' });
  
  console.log('═══════════════════════════════════════');
  console.log('✅ 发布助手任务完成！');
  console.log('');
  console.log('📋 请检查浏览器中的发布表单，');
  console.log('   然后手动点击【发布】按钮');
  console.log('═══════════════════════════════════════\n');
}

main().catch(err => {
  console.error('❌ 错误:', err.message);
});
