var app = getApp();
Page({
    data:{
        themeColor:"1aad19",
    },
    onLoad: function(){
        this.setData({
            themeColor: app.globalData.themeColor,
            statusBarHeight:app.globalData.statusHeight,
            screenHeight: app.globalData.screenHeight,
            windowHeight: app.globalData.windowHeight
        });
        wx.setNavigationBarColor({
            frontColor:"#ffffff",
            backgroundColor: "#" + this.data.bgColor,
            animation:{}
        });
    },
    changeColor: function(event){
        app.globalData.themeColor = event.target.dataset.color;
        this.setData({
            bgColor: app.globalData.themeColor
        })
        wx.setNavigationBarColor({
            frontColor:"#ffffff",
            backgroundColor: "#" + this.data.bgColor,
            animation:{}
        });
        for(var i = 0; i < 3; i++)
        {
            var selectedIcon = [
                "homed.png", "noted.png", "faced.png"
              ];
            var iconPath = "images/tabBar/" + this.data.bgColor
                            + "/" + selectedIcon[i];
            wx.setTabBarItem({
                index: i,
                selectedIconPath: iconPath
            })
        }
    }
})