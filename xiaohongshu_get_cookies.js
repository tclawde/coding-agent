/**
 * 获取小红书Cookie
 */

const { chromium } = require('playwright');

async function getCookies() {
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('🌐 打开小红书...');
  await page.goto('https://www.xiaohongshu.com');
  await page.waitForLoadState('networkidle');
  
  // 点击登录
  console.log('👆 点击登录...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('登录'));
    if (btn) btn.click();
  });
  
  await page.waitForTimeout(3000);
  
  // 获取Cookie
  const cookies = await context.cookies();
  console.log(`\n📦 获取到 ${cookies.length} 个Cookie`);
  
  const sessionCookie = cookies.find(c => c.name.includes('web_session'));
  if (sessionCookie) {
    console.log('✅ 找到登录Session！');
  } else {
    console.log('⚠️ 未找到登录Session');
  }
  
  // 保存Cookie
  const fs = require('fs');
  fs.writeFileSync('xiaohongshu_cookies.json', JSON.stringify(cookies, null, 2));
  console.log('✅ Cookie 已保存到 xiaohongshu_cookies.json');
  
  console.log('\nCookie列表:');
  cookies.forEach(c => {
    console.log(`  ${c.name}: ${c.value.substring(0, 20)}...`);
  });
  
  await browser.close();
}

getCookies().catch(console.error);
