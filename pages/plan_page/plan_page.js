var app = getApp();
Page({
    // 带'***'表示需要从后台获取的数据
    data:{
        isDisplayTaskList: true,
        isTodayTaskFinished: false, //这个数据存在数据库今天这个日期的分类下
        themeColor: "1aad19",   //主题色 
        globalEmpty:true,    //用于控制empty-demo是否展示
        todayTask: 0,    // 今日任务数 
        finish: 0,         //***  number
        focusTime: 0,     //*** number
        planList: new Array(),    //计划表 *** Object-array，新页面加载时从获取这个列表
        tapId: -1,                 //用于存储被点击的表单的id值
        deleteButtonActiveStyle: "opacity:0;",
        isSaveThisDiary:false,
        diaryContent:"",   //***  保存用户打卡后的写内容*/
        deleteButtonId: 0  //记录删除按钮的id
    },

    onLoad: function(){
        var plan = this.data.planList // 获取任务表，任务表在页面加载时从后台获取
        // 以下用来确定今日任务数，今日完成数，以及今日专注时长
        var fin = 0, min = 0;
        for(var i = 0; i < plan.length; i++)
        {
            if(plan[i].haveDone) 
            {
                fin++;
                min += plan[i].costTime;
            }
        }

        this.setData({
            statusBarHeight: app.globalData.statusHeight,  
            //获得顶部状态栏的高度
            screenHeight: app.globalData.screenHeight,
            themeColor: app.globalData.themeColor,
            windowHeight: app.globalData.windowHeight,

            todayTask: plan.length, //修改任务数
            finish: fin,  //修改完成个数
            focusTime: min ,//修改专注时长
            //isTodayTaskFinished: 从后台获取这个数据
        });
        if(this.data.isTodayTaskFinished){
            this.setData({
                isDisplayTaskList:false
            })
        }
    },

    onShow: function(){
        /*以下if语句用来更改任务栏为空时的展示效果*/ 
        if(this.data.planList.length == 0 || !this.data.isDisplayTaskList)
            this.setData({
                bgChangeForGlobal: "global-page-gray",
                globalEmpty:true
            })
        else
            this.setData({
                bgChangeForGlobal: "",
                globalEmpty:false
            })
        this.setData({
            themeColor:app.globalData.themeColor,
            todayTask: this.data.planList.length //获取今日任务数据
        })
    },

    newBoard: function(){
        this.setData({
            tapId: -1
        })
        wx.navigateTo({
            url: "/pages/plan_page/new_plan/new_plan"
        })
    },

    /*展示任务详请页面*/
    toDetail: function(event){
        var id = event.currentTarget.id;
        var style = this.data.deleteButtonActiveStyle;
        if(style[9] == "."){
            this.setData({
                deleteButtonActiveStyle: "opacity:0;" + style.substring(12, style.length)
            })
            return;
        }
        this.setData({
            tapId: id   /*选择任务的id*/
        });
        wx.navigateTo({
            url: "/pages/plan_page/new_plan/new_plan"
        })
    },

    toDelete: function(event){
        var x = event.detail.x;  //获取点击的位置
        var y = event.detail.y - 40;  //-40是为了让按钮在手指上方显示
        var style = this.data.deleteButtonActiveStyle;
        var id = event.currentTarget.id;
        this.setData({
            deleteButtonId: id
        })
        if(style[9] != ".")
        {
            this.setData({
                deleteButtonActiveStyle: 
                "opacity:0.9;left:"+ x + "px;" + "top:" + y + "px;"
            })
        }
        else{
            //再次长点击时删除按钮在原来的位置消失
            this.setData({
                deleteButtonActiveStyle: "opacity:0;" + style.substring(12, style.length)
            })
            return;
        }
    },

    deleteTask: function(event){
        var id = event.currentTarget.id;
        var style = this.data.deleteButtonActiveStyle;
        var plan = this.data.planList;
        if(this.data.planList.length != 1)
        {
            plan.splice(id, 1);
            this.setData({
                planList: plan,
                deleteButtonActiveStyle:"opacity:0;" + style.substring(12, style.length),
                todayTask: this.data.planList.length
            })
        }
        else
            this.setData({
                planList: new Array(),
                deleteButtonActiveStyle:"opacity:0;",
                globalEmpty: true,  //让任务为空时提示符显示
                bgChangeForGlobal: "global-page-gray",  //让任务为空时背景色为灰色
                todayTask: 0
            })
    },

    // 打卡按钮绑定的函数
    confirm: function(){
        var unfinished = 0;
        var that = this;
        var planList = this.data.planList;
        for(var i = 0; i < planList.length; i++){
            if(planList[i].haveDone == false) unfinished++;
        }
        if(unfinished){
            wx.showModal({
                title:"您确定不继续专注了吗",
                content:"您还有"+unfinished+"个任务没有完成，若现在打卡，会影响您的任务完成度以及排名",
                confirmText: "狠心放弃",
                cancelText: "继续坚持",
                success: function(res){
                    if(res.confirm){
                        that.setData({
                            bgChangeForGlobal: "global-page-gray",
                            isTodayTaskFinished: true, //传给后台一个数据表示今日已完成
                            isDisplayTaskList: false
                        })
                    }
                    else if(res.cancel) return;
                }
            });
        }
        else{
            this.setData({
                isTodayTaskFinished: true,
                isDisplayTaskList: false
            })
        }
    },

    searchTaskList: function(){
        this.setData({
            bgChangeForGlobal: "",
            isDisplayTaskList:true
        })
    },

    backToData: function(){
        this.setData({
            isDisplayTaskList:false,
            bgChangeForGlobal: "global-page-gray"
        })
    },

    saveDiary: function(event){
        var that = this;
        wx.showModal({
            title:"确定保存?",
            content:"保存后不可修改",
            success: function(res){
                if(res.cancel) return ;
                else if(res.confirm){
                    that.setData({
                        diaryContent:event.detail.value.diary,
                        isSaveThisDiary: true
                    })
                }
            }
        })
        
    }
})