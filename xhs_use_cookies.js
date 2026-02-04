/**
 * 小红书 - 正确使用本地cookies
 */

const { chromium } = require('playwright');
const fs = require('fs');

async function main() {
  console.log('🚀 启动...\n');
  
  // 读取现有cookies
  const cookiesPath = '/tmp/cookies.json';
  if (!fs.existsSync(cookiesPath)) {
    console.log('❌ Cookies文件不存在');
    return;
  }
  
  const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf8'));
  console.log(`📂 读取到 ${cookies.length} 个cookies\n`);
  
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chromium'
  });
  
  // 创建context并添加cookies
  const context = await browser.newContext({
    acceptDownloads: true,
    bypassCSP: true
  });
  
  // 添加cookies到context
  await context.addCookies(cookies);
  console.log('✅ Cookies已添加到context\n');
  
  const page = await context.newPage();
  
  // 访问小红书
  console.log('🌐 访问小红书...');
  await page.goto('https://www.xiaohongshu.com', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });
  
  // 等待页面完全加载
  await page.waitForTimeout(5000);
  
  console.log('📸 首页截图\n');
  await page.screenshot({ path: '/tmp/xhs_use_cookies_01.png' });
  
  // 检查是否已登录
  const loginBtn = await page.$('text=登录');
  if (loginBtn) {
    console.log('❌ Cookies未生效，仍然需要登录\n');
  } else {
    console.log('✅ 已登录！\n');
    
    // 点击发布按钮
    console.log('📝 点击发布按钮...');
    await page.click('nav:has-text("发布")').catch(async () => {
      // 尝试其他选择器
      await page.click('[aria-label="发布"]').catch(() => {});
    });
    
    await page.waitForTimeout(5000);
    console.log('📸 发布页面\n');
    await page.screenshot({ path: '/tmp/xhs_use_cookies_02.png' });
  }
  
  console.log('\n✅ 完成！\n');
}

main();
