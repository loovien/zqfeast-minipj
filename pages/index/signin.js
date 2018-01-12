let app = getApp();
let apis = require("../../API/api.js");
const fillZero = function (n) {
  return (n > 9) ? '' + n : '0' + n;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    END_TIME: parseInt(+new Date("2018/01/15,17:30:00")),//活动结束时间
    currentTime: '000000', //倒计时时间
    isBegin: false, //倒计时是否结束
    inputValue: [],//身份ID
    isRight: true, //ID 是否正确
    info: null,//数据信息
    isVerify: false, //是否已验证
    verifyLayer: false, //验证确认弹框
    focus: false,//是否弹出键盘
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.fetchUserInfo();
    this.setTimes();
    this.initData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
    this.timer = setInterval(() => {
      this.setTimes()
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.data.inputValue;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.timer);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  setTimes: function () { //倒计时计算
    let h, m, s;
    let start_time = parseInt(Date.now());
    let diff_time = parseInt((this.data.END_TIME - start_time) / 1000);

    if (diff_time >= 0) { //未开始
      h = fillZero(parseInt(diff_time / 3600));
      m = fillZero(parseInt(diff_time % 3600 / 60));
      s = fillZero(parseInt(parseInt(diff_time % 3600 % 60)));
    } else { //倒计时结束
      this.setData({
        isBegin: true,
      })
      clearInterval(this.timer);
    }
    this.setData({
      currentTime: `${h}${m}${s}`,
    })
  },

  bindButtonTap: function (e) { //弹出键盘
    let flag = e.currentTarget.dataset.id;
    this.setData({
      focus: true,
    })
    if (this.data.isVerify && flag==='ajax') {
      this.bindVerifyOk();
    }
  },

  bindKeyInput: function (e) { //数字输入
    let _this = this;
    this.setData({
      inputValue: e.detail.value,
    })
    if (this.data.inputValue.length >= 6) { //输入达到6位数自动提示是否绑定
      this.setData({
        verifyLayer: true,
        focus: false,
      })
    }
    if (this.data.inputValue.length < 6) {
      this.setData({
        isRight: true,
      })
    }
  },

  bindVerifyOk: function () { //签到提交
    let _this = this;
    let userInfo = this.data.info[1];
    userInfo.avatar = userInfo.avatarUrl,
      delete userInfo.avatarUrl;
    let data = Object.assign({}, userInfo,
      { uid: this.data.inputValue }, { openid: this.data.info[0].openid })
    console.log(data);
    apis.fetch(apis.API.USER_INFO, data, "POST")
      .then(res => {
        _this.setData({
          verifyLayer: false,//隐藏提示
        })
        if (res.data.code === 0) { //验证通过
        let info = JSON.stringify(res.data.data);
          _this.setData({
            inputValue: data.uid,
            isVerify:true,
          })
          wx.navigateTo({
            url: `../barrage/index?info=${info}`,
          })
        } else { //验证失败
          this.setData({
            isRight: false,
          })
        }
      })
  },
  bindViewDanmaku: function () { //进入弹幕空间
    wx.navigateTo({
      url: `../barrage/index?info`,
    })
  },
  bindcVerifyCancel: function () {
    this.setData({
      verifyLayer: false,//隐藏提示
    })
  },
  initData: function () { //异步获取用户信息
    if (app.globalData.info) {
      this.setData({
        info: app.globalData.info,
        inputValue: app.globalData.info[0].uid,
        isVerify: app.globalData.info[0].uid,
      })
    } else { //异步获取用户信息
      app.userInfoReadyCallback = res => {
        // delete res[0].uid;
        this.setData({
          info: res,
          inputValue: res[0].uid,
          isVerify: res[0].uid,
        })
      }
    }
  },
})