App({
    globalData:{
      themeColor: "1aad19",
      pxRatio: 0,
      screenWidth: 0,
      screenHeight: 0,
      statusHeight: 0
  },
  onLaunch: function(){
    var getData = this.globalData;
    wx.getSystemInfo({
      success(res){
        getData.pxRatio = res.pixelRatio;
        getData.screenWidth = res.screenWidth;
        getData.screenHeight = res.screenHeight;
        getData.statusHeight = res.statusBarHeight;
        getData.windowHeight = res.windowHeight;
      }
    })
    wx.setNavigationBarColor({
        frontColor: "#ffffff",
        backgroundColor: getData.themeColor,
        animation:{}
    })
      /*var theColor = this.globalData.themeColor;
      wx.setTabBarStyle({
        selectedColor: theColor
      });
      for(var i = 0; i < 3; i++)
      {
        var iconPath = "images/tabBar/" + theColor + "/" +
                        selectedIcon[i];
          wx.setTabBarItem({
            index: i,
            selectedIconPath: iconPath 
          })
      }*/
  }
})