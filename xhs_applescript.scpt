tell application "Google Chrome"
    activate
    delay 2
    
    -- 检查小红书是否已打开
    if (exists window 1) then
        set currentTab to active tab of window 1
        set currentURL to URL of currentTab
        
        if currentURL contains "xiaohongshu" then
            reload currentTab
            delay 3
            return "已刷新小红书页面"
        else
            open location "https://www.xiaohongshu.com"
            delay 3
            return "已打开小红书"
        end if
    else
        open location "https://www.xiaohongshu.com"
        delay 3
        return "已打开小红书"
    end if
end tell
