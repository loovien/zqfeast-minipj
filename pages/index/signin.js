const fillZero = function (n) {
  return (n > 9) ? '' + n : '0' + n;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    END_TIME: parseInt(+new Date("2018/01/8,10:55:00")),//活动结束时间
    currentTime: '000000', //倒计时时间
    isBegin:false, //倒计时是否结束
    inputValue:[],//身份ID
    isRight:true, //ID 是否正确
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setTimes();
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
       isBegin:true,
     })
     clearInterval(this.timer);
    }
    this.setData({
      currentTime: `${h}${m}${s}`,
    })
  },

  bindButtonTap: function () { //弹出键盘
    this.setData({
      focus: true,
    })
  },

  bindKeyInput: function (e) { //数字输入
    this.setData({
      inputValue: e.detail.value,
    })
    if (this.data.inputValue.length >= 6) { //输入达到6位数自动校验
      this.setData({
        isRight:false,
      })
    }
    if (this.data.inputValue.length < 6) {
      this.setData({
        isRight: true,
      })
    }
  },

  bindViewDanmaku:function(){ //进入弹幕空间
  wx.navigateTo({
    url: '../barrage/index',
  })
  }
})