/**
 * 小红书自动化 - 调试版本
 * 先获取页面快照，分析元素结构
 */

const { chromium } = require('playwright');

async function main() {
  console.log('🚀 启动调试模式...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chromium'
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // 打开小红书
  await page.goto('https://www.xiaohongshu.com');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('📸 截图保存\n');
  await page.screenshot({ path: '/tmp/xhs_debug_home.png' });
  
  // 获取所有按钮的文本
  console.log('\n🔍 分析页面按钮...\n');
  const buttons = await page.$$eval('button', btns => 
    btns.map(b => ({
      text: b.innerText.slice(0, 50),
      class: b.className.slice(0, 100)
    }))
  );
  
  console.log('按钮列表:');
  buttons.forEach((btn, i) => {
    if (btn.text.trim()) {
      console.log(`${i + 1}. "${btn.text}" (${btn.class})`);
    }
  });
  
  // 获取所有链接文本
  console.log('\n🔗 分析链接...\n');
  const links = await page.$$eval('a', links => 
    links.slice(0, 20).map(l => ({
      text: l.innerText.slice(0, 50),
      href: l.href
    }))
  );
  
  console.log('链接列表:');
  links.forEach((link, i) => {
    if (link.text.trim()) {
      console.log(`${i + 1}. "${link.text}" -> ${link.href.slice(0, 80)}`);
    }
  });
  
  // 获取左侧导航栏
  console.log('\n📋 左侧导航栏...\n');
  const navItems = await page.$$eval('nav a, .nav a, [role="navigation"] a, aside a', items => 
    items.slice(0, 15).map(item => ({
      text: item.innerText.slice(0, 30),
      role: item.getAttribute('role'),
      aria: item.getAttribute('aria-label')
    }))
  );
  
  navItems.forEach((item, i) => {
    if (item.text.trim()) {
      console.log(`${i + 1}. "${item.text}" (role: ${item.role}, aria: ${item.aria})`);
    }
  });
  
  console.log('\n✅ 分析完成！');
  console.log('请查看截图和分析结果\n');
}

main();
