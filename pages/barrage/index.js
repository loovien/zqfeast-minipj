let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAdmin: false,
    isVerify: true,
    danmakuList: [],
    isScroll: true,
    isProgramShow: false,
    isWinning: false,
    isHot: false,
    isDisable: false,
    userInfo: app.globalData.userInfo,
    danmakuContent: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(app.globalData.userInfo)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    setInterval(() => {
      let list = this.data.danmakuList;
      list.push(1);
      this.setData({
        danmakuList: list,
      })
      this.bindScroll();
    }, 1000000)
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
  bindTouchMove: function () {
    this.setData({
      isScroll: false,
    })
  },

  //节目单展示
  bindProgramShowState: function () {
    this.setData({
      isProgramShow: !this.data.isProgramShow,
    })
  },

  //关闭中奖弹框
  bindWinningClose: function () {
    this.setData({
      isWinning: false,
    })
  },

  //速弹展示
  bindHotShow: function () {
    this.setData({
      isHot: !this.data.isHot,
    })
    this.bindScroll();
  },

  //获取弹幕内容
  bindKeyInput: function (e) {
    this.setData({
      danmakuContent: e.detail.value
    })
  },
  //发送弹幕
  bindSendDanmaku: function () {
    let danmakuList = this.data.danmakuList;
    danmakuList.push(
      {
        content: this.data.danmakuContent,
        nickName: this.data.userInfo.nickName
      }
    )

    this.setData({
      danmakuList: danmakuList
    })
  },
  //滚动到最底部
  bindScroll: function () {
    if (this.data.isScroll) {
      wx.pageScrollTo({
        scrollTop: 999999,
      })
    }
  }
})