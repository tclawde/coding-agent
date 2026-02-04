/**
 * 小红书 - 使用Chrome配置文件
 */

const { chromium } = require('playwright');

async function main() {
  console.log('🚀 启动Chrome...\n');
  
  const browser = await chromium.launch({
    headless: false,
    channel: 'chromium',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox']
  });
  
  // 使用Chrome的默认配置
  const context = await browser.newContext({
    userDataDir: '/Users/apple/Library/Application Support/Google/Chrome/Default',
    acceptDownloads: true
  });
  
  const page = await context.newPage();
  
  console.log('🌐 打开小红书...');
  await page.goto('https://www.xiaohongshu.com');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('📸 截图\n');
  await page.screenshot({ path: '/tmp/xhs_chrome_login.png' });
  
  // 检查登录状态
  const loginBtn = await page.$('text=登录');
  console.log(loginBtn ? '❌ 需要登录' : '✅ 已登录');
  
  if (!loginBtn) {
    console.log('📝 点击发布...');
    await page.click('nav:has-text("发布")').catch(() => {});
    await page.waitForTimeout(5000);
    await page.screenshot({ path: '/tmp/xhs_chrome_publish.png' });
  }
  
  console.log('\n✅ 完成\n');
}

main();
