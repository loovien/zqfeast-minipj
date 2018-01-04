var app = getApp()
Page({
    data: {
        flag: true,//加号的控制打开/关闭
        userInfo: [],//用户信息，用于头像显示
        msgList: [{
            content: '发送弹幕随机抽奖',
            content_type: 0,
            contract_info: '',//弹出框input值
            myDate: '',
            role: false,
            img: '../../images/01_03.png',
        }, {
            content: '我要发弹幕中奖',
            content_type: 0,
            contract_info: '',
            myDate: '',
            role: true,
            img: "../../images/01_07.png"
        }
        ],//返回数据
        minutes: '',//分钟间隔
        addinput: '',//清楚input框的值
        sendflag: false,//发送按钮控制
        networkType: '',//判断当前网络类型
        addtell: {
            addtellHidden: true,//弹出框显示/隐藏

        },
    },

    onLoad: function (options) {

        // 页面监控
        //app.globalData.hotapp.count(this)
        // 页面初始化 options为页面跳转所带来的参数
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
        //将全局的方法赋值
        var that = this;
    },

    bindfocus: function (e) {
        var that = this;
    },

    bindblur: function (e) {
        var that = this;
        this.setData({
            sendflag:false
        })
        //提交输入框的数据
        if (e.detail.value != '' && this.data.networkType != 'fail') {

            //获取当前时间
            var myDate = new Date();
            var hours = myDate.getHours();       //获取当前小时数(0-23)
            var minutes = myDate.getMinutes();     //获取当前分钟数(0-59)
            //如果两次时间
            if (minutes == this.data.minutes) {
                var mydata = ''
            } else {
                var mydata = hours + ':' + minutes
            }


            //消息数组，系统默认
            var newMsgList = this.data.msgList
            newMsgList.push({
                content: e.detail.value,
                content_type: 0,
                contract_info: that.data.contract_info,
                myDate: mydata,
                role: false,
                img: that.data.userInfo.avatarUrl,
            }, {
                content: '恭喜您, 中奖了个大宝剑',
                content_type: 0,
                contract_info: '',
                myDate: '',
                role: true,
                img: "../../images/01_07.png"
            })

            this.setData({
                addinput: [],
                sendflag: false,
                minutes: minutes,
                msgList: newMsgList
            })
        }
    },
    bindtapimg: function () {
        //打开添加图片框
        this.setData({
            flag: false
        })
    },
    closeimg: function () {
        //闭合添加图片框
        this.setData({
            flag: true
        })
    },
    footaddimg: function () {
        var that = this;
        //使用hotapp接口获取图片路径
        app.globalData.hotapp.uploadFeedbackImage(res => {
            //添加到反馈数组
            var newfeedback = that.data.feedback;
            newfeedback.push({
                content: res,
                content_type: 1,
                contract_info: '',
                role: false,
                img: that.data.userInfo.avatarUrl,
            }, {
                content: '【系统消息】：您的反馈已收到！',
                content_type: 0,
                contract_info: that.data.contract_info,
                role: true,
                img: "../../images/01_07.png"
            })
            //修改feedback
            that.setData({
                flag: true,
                feedback: newfeedback
            })
            //添加图片到服务器

            app.globalData.hotapp.feedback(res, 1, that.data.contract_info, function (res) {
                console.log(res)
            })
        })
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
})
