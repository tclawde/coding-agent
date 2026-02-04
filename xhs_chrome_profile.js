/**
 * 小红书 - 使用Chrome用户配置文件
 */

const { chromium } = require('playwright');

async function main() {
  console.log('🚀 启动Chrome...\n');
  
  // 查找Chrome用户数据目录
  const possiblePaths = [
    '/Users/apple/Library/Application Support/Google/Chrome',
    process.env.HOME + '/Library/Application Support/Google/Chrome'
  ];
  
  let chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  
  // 检查是否存在
  if (!require('fs').existsSync(chromePath)) {
    chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  }
  
  console.log(`📱 使用Chrome: ${chromePath}\n`);
  
  try {
    const browser = await chromium.launch({
      headless: false,
      channel: 'chromium',
      executablePath: chromePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    
    const context = await browser.newContext({
      // 使用用户默认Chrome配置
      userDataDir: '/Users/apple/Library/Application Support/Google/Chrome/Default',
      acceptDownloads: true
    });
    
    const page = await context.newPage();
    
    console.log('🌐 打开小红书...');
    await page.goto('https://www.xiaohongshu.com');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('📸 截图\n');
    await page.screenshot({ path: '/tmp/xhs_chrome_01.png' });
    
    // 检查是否登录
    const loginBtn = await page.$('text=登录');
    if (loginBtn) {
      console.log('❌ 需要登录\n');
    } else {
      console.log('✅ 已登录！\n');
      
      // 点击发布
      console.log('📝 点击发布...');
      await page.click('nav:has-text("发布")').catch(() => {});
      await page.waitForTimeout(5000);
      await page.screenshot({ path: '/tmp/xhs_chrome_02.png' });
    }
    
    console.log('\n✅ 完成\n');
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

main();
