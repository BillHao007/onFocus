var app = getApp();
Page({
  data: {
    themeColor: "1aad19",
    medal:"diamond" ,         //勋章路径关键词&本月段位
    day:5,                   //连续打卡
    taskNum:120,              //总任务数
    finishNum:100,           //总完成数
    focusTime:1.5,           //专注时长
    datatop: 0,
    swipertop: 0,
    /*轮播图属性*/
    circular:1,           //衔接滑动
    previous:0,              //previous-margin
    next:0,                  //next-margin
    auto:0,               //自动切换
    interval:5000,           //自动切换时长
    /*备忘事项*/
    note1:"1.取快递", //从后台获取
    note2: "2.打篮球",  //从后台获取
    note3: "3.写作业",  //从后台获取
  },
  
  onLoad: function () {
    this.setData({
      themeColor: app.globalData.themeColor,
      statusBarHeight: app.globalData.statusHeight,
      screenHeight: app.globalData.screenHeight,
      windowHeight: app.globalData.windowHeight
    });
  }

})