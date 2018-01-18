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
    END_TIME: parseInt(+new Date("2018/01/25,17:30:00")),//活动结束时间
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
    let _this = this;
    this.setTimes();
    app.fetchUserInfo().then(res => {
      _this.initData(res);
    }).catch(err => {
      
    })
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

  //倒计时计算
  setTimes: function () {
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

  //键盘聚焦
  bindButtonTap: function (e) {
    let flag = e.currentTarget.dataset.id;
    this.setData({
      focus: true,
    })
    if (this.data.isVerify && flag === 'ajax') {
      this.bindVerifyOk();
    }
  },

  //UID输入
  bindKeyInput: function (e) {
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

  //签到提交
  bindVerifyOk: function () {
    let _this = this;
    app.fetchUserInfo().then(arrInfo => {
      let userInfo = arrInfo[1]; //用户信息
      userInfo.avatar = userInfo.avatarUrl;
      userInfo.nickname = userInfo.nickName;
      delete userInfo.avatarUrl;
      delete userInfo.nickName;

      let data = Object.assign({}, userInfo,
        { uid: this.data.inputValue }, { openid: arrInfo[0].openid })

      apis.fetch(apis.API.USER_INFO, data, "POST")
        .then(res => {
          _this.setData({
            verifyLayer: false,//隐藏提示
          })

          if (res.data.code === 0) { //验证通过
            let info = JSON.stringify(res.data.data);
            _this.setData({
              inputValue: data.uid,
              isVerify: true,
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
    }).catch(err => {
      _this.impowerAlert();
    })
  },

  //进入弹幕空间
  bindViewDanmaku: function () {
    app.fetchUserInfo().then(res => {
      let data = Object.assign(res[0], res[1]);
      data.nickname = data.nickName; //大小写切换
      delete data.nickName;
      if (res[0].uid) { //已绑定用户
        let info = JSON.stringify(data);
        wx.navigateTo({
          url: `../barrage/index?info=${info}`,
        })
      } else {
        wx.navigateTo({ //非绑定用户
          url: `../barrage/index?info`,
        })
      }
    }).catch(err => {//没授权用户
      wx.navigateTo({
        url: `../barrage/index?info`,
      })
    })
  },

  //隐藏提示
  bindcVerifyCancel: function () {
    this.setData({
      verifyLayer: false,
    })
  },

  //用户信息初始化
  initData: function (data) {
    this.setData({
      info: data,
      inputValue: data[0].uid,
      isVerify: data[0].uid,
    })
  },

  //授权弹窗
  impowerAlert:function(){
    wx.showModal({
      title: '提示',
      content: '绑定弹幕身份ID，需授权访问用户信息！',
      confirmText:'授权',
      success: function (res) {
        if (res.confirm) {//确定
          wx.openSetting({
            success: (res) => {
              res.authSetting = {
                "scope.userInfo": true,
              }
            }
          })
        } else if (res.cancel) {//取消
          // todo
        }
      }
    })
  }
})