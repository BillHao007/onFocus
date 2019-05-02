var app = getApp()
var util = require('../../../utils/util_date.js'); //获取系统日期
var date = util.formatDate(new Date());

Page({
    data:{
        pageId: 0,
        isDetail: -1, //
        tabBarStyleList: new Array(),
        taskName: "",
        startTime: "00:00",  /*开始时间picker绑定的数据*/
        focusTime: "0分钟",   /*专注时长picker绑定的数据*/
        remindTime: "00:00",  /*提醒picker绑定的数据*/
        startDate: "", /*多日计划的开始日期picker的绑定*/ 
        endDate:"", 
        isStartTimeOpen: true,  //任务开始时间是否是设置
        isRemindPickerDisplay: false, /*控制提醒picker是否打开*/
        focPlace: "",
        levelType: "十万火急（8级）",  
        levelArray:["十万火急（8级）","刻不容缓（7级）","迫不及待（6级）",
        "拭目以待（5级）","从容不迫（4级）","不慌不忙（3级）",
        "稳住能赢（2级）","若无其事（1级）"],
        isLevelPickerDisplay: false, /*控制提醒picker是否开启*/
        textContent:""  //任务内容
    },

    onLoad: function(){
        var pages = getCurrentPages();
        var lastPage = pages[pages.length - 2];
        var id = lastPage.data.tapId;
        console.log(id);
        var task = lastPage.data.planList[id];
        this.setData({
            themeColor: app.globalData.themeColor,
            startDate: date,
            endDate: date,
            nowYear: date.slice(0, 4)
        })

        // 下面是用于点击任务展示板后看到的任务详情
        if(id != -1)
        {
            wx.setNavigationBarTitle({
                title: "任务详情"
            })
            this.setData({
                isDetail: id,
                taskName: task.heading,
                startTime: task.begTime,
                isStartTimeOpen: task.isStartTimeOpen,
                focusTime: task.focTime+"min",
                remindTime: task.remindTime,
                isRemindPickerDisplay: task.isRemind,
                startDate: task.startDate,
                endDate: task.endDate,
                focPlace: task.place,
                isLevelPickerDisplay: task.isLevelOpen,
                levelType: this.data.levelArray[task.level],
                textContent: task.textContent
            })
        }
        else
            wx.setNavigationBarTitle({
                title: "新建任务"
            })
    },
 
    onShow: function(){
        this.setData({
            "tabBarStyleList[0]":
            "border-bottom:6rpx solid #"+this.data.themeColor+";color:#"+this.data.themeColor
        })
    },

    /* 提交button绑定的submit函数 */
    submit: function(event){
        var pages = getCurrentPages();   //获取页面栈
        var lastPage = pages[pages.length - 2];   //获取计划表那一页
        var list = lastPage.data.planList;  //获取任务表
        var formValue = event.detail.value;  //获取form表单组件的value值
        var level = formValue.level;
        var levelColor;
        var focusPlace = formValue.place;  //获取任务地点
        var isLevelOpen = formValue.levelSwitch;  //获取是否设置了优先级
        var hour = parseInt(formValue.focusTime[0]+formValue.focusTime[1]);
        var min = parseInt(formValue.focusTime[3]+formValue.focusTime[4]);
        var focusTime = hour * 60 + min;
        var text = formValue.textareaContent;

        if(formValue.taskName == ""){
            wx.showModal({
                title:"任务名称不能为空哦！",
                showCancel:false
            });
            return ;
        }
        if(focusTime < 10){
            wx.showModal({
                title:"您还不够专注哦",
                content:"专注时长不得低于10分钟，您可以通过设置备忘来提醒短时事宜",
                showCancel:false
            });
            return ;
        }
        if(focusPlace == "") focusPlace = "未设置"
        if(isLevelOpen){
            switch(level)
            {
                case '0': levelColor = 'f05c5c';break;
                case '1': levelColor = 'ffa500';break;
                case '2': levelColor = 'ebe70d';break;
                case '3': levelColor = '51d107';break;
                case '4': levelColor = '4ce298';break;
                case '5': levelColor = '03c0c0';break;
                case '6': levelColor = '5883bd';break;
                case '7': levelColor = '9b9b9b';break;
            }
        }  // 获取优先级，更改plan_page页优先级标志的颜色
        else levelColor = '9b9b9b';  // 不设置优先级的默认样式

        list.push({
            heading: formValue.taskName, // 任务标题
            begTime: formValue.startTime, // 开始时间
            isStartTimeOpen: formValue.startTimeSwitch,
            taskInDayX: 1,  //多日任务时任务展板上提醒这是该任务的第几天，Number
            focTime: focusTime, // 预计专注时长
            costTime: 0,   // 初始花费的时间为0
            remindTime: formValue.remindTime,  // 提醒时间
            isRemind: formValue.remindSwitch,  // 是否开启了提醒
            place: focusPlace,  // 专注地点
            status: "代办",  // 任务状态，还有一个值“已完成”
            isLevelOpen: isLevelOpen,
            levelColor: levelColor,  // 优先级
            level: level,
            textContent: text,
            iconType: "waiting",  // 图标显示类型，若状态是已完成，则为success
            single: true,       // 是否是单日任务,boolean
            partner: false,   //是否为合作任务
            haveDone: false    // 是否完成 boolean
        }); 
        if(!this.data.isStartTimeOpen) list[list.length - 1].begTime = "未设置";
        if(this.data.pageId == '1'){
            if(this.data.startDate == this.data.endDate) {
                wx.showModal({
                    title:"您还未设置结束日期",
                    content:"结束日期不能和开始日期相同",
                    showCancel:false
                });
                return;
            }
            list[list.length - 1].startDate = this.data.startDate;  //多日任务的开始日期
            list[list.length - 1].endDate = this.data.endDate;  //多日任务的结束日期
            list[list.length - 1].single = false;    //设为多日任务
        }  //  ***在设置过这个后，向后台提交这个数组，作为新的任务列表
        lastPage.setData({
            planList: list
        })
        wx.navigateBack({
            delta: 1
        })
        // wx.showLoading({
        //     title: '加载中',
        //   })
          
        // setTimeout(function () {
        //   wx.hideLoading()
        // }, 2000)
    },

    changePage: function(event){
        var id = event.currentTarget.id;
        var style = "tabBarStyleList["+id+"]";
        this.setData({
            tabBarStyleList:  new Array(),
            [style]: "border-bottom:6rpx solid #"+this.data.themeColor+";color:#"+this.data.themeColor,
            pageId: id
        });
    },

    /*时间选择器绑定的函数，更改时间值*/
    timePickerChange: function(event){
        this.setData({
            startTime: event.detail.value
        })
    },

    controlStartTime: function(event){
        this.setData({
            isStartTimeOpen: event.detail.value
        })
    },

    datePickerChange: function(event){
        var id = event.currentTarget.id;
        if(id == "date-picker-st"){
            this.setData({
                startDate: event.detail.value,
                endDate: event.detail.value
            })
        }
        else{
            this.setData({
                endDate: event.detail.value
            })
        }
    },

    focusPickerChange: function(event){
        var time = event.detail.value;
        var hour, min;
        if(time[0] == "0") hour = time[1];
        else hour = time[0] + time[1];
        if(time[3] == "0") min = time[4];
        else min = time[3] + time[4];
        if(hour == "0")
        {
            this.setData({
                focusTime: min+"分钟"
            })
        }
        else
            this.setData({
                focusTime: hour+"小时"+min+"分钟"
            })
        
    },
    remindPickerChange: function(event){
        this.setData({
            remindTime: event.detail.value
        })
    },

    controlRemindPicker: function(event){
        this.setData({
            isRemindPickerDisplay: event.detail.value
        })
    },

    levelPickerChange: function(event){
        var index = event.detail.value
        this.setData({
            levelType: this.data.levelArray[index]
        })
    },

    controlLevelPicker: function(event){
        this.setData({
            isLevelPickerDisplay: event.detail.value
        })
    }
})