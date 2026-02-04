/**
 * 小红书自动化发布 v4
 */
const { chromium } = require('playwright');
const fs = require('fs');

async function main() {
  console.log('🚀 开始自动化...\n');
  
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
    console.log('✅ 已加载 cookies\n');
  }
  
  // 访问小红书
  console.log('🌐 打开小红书...');
  await page.goto('https://www.xiaohongshu.com');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // 点击发布按钮 (使用更精确的选择器)
  console.log('📝 点击发布按钮...');
  const publishBtn = page.locator('xpath=//span[contains(text(),"发布")]').first();
  await publishBtn.click({ timeout: 5000 }).catch(() => {
    console.log('⚠️ 使用备用选择器...');
    return page.click('xpath=//*[contains(@class,"publish")]').catch(() => {});
  });
  
  await page.waitForTimeout(5000);
  await page.screenshot({ path: '/tmp/xhs_auto_01.png' });
  
  // 点击图文
  console.log('📷 点击图文...');
  await page.click('text=图文').catch(() => {});
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/tmp/xhs_auto_02.png' });
  
  // 上传图片
  console.log('📤 上传图片...');
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles('/Users/apple/Desktop/screenshot_20260204_233211.png');
  await page.waitForTimeout(5000);
  await page.screenshot({ path: '/tmp/xhs_auto_03.png' });
  
  // 填写标题
  console.log('✏️ 填写标题...');
  const titleArea = page.locator('textarea').first();
  await titleArea.fill('自动化测试');
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: '/tmp/xhs_auto_04.png' });
  
  console.log('\n✅ 自动化完成！');
  console.log('请手动点击发布按钮\n');
}

main().catch(err => {
  console.error('❌ 错误:', err.message);
  process.exit(1);
});
