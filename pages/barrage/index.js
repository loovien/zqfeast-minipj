let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAdmin: false, //是否为管理员
    isVerify: false,//是否ID验证
    danmakuList: [], //弹幕列表
    isScroll: true,
    isProgramState: false, //节目列表弹窗状态
    isWinning: false,
    isHot: false, //速弹展示状态
    isDisable: false, //发送按钮状态
    isMore:0, //未读消息
    userInfo: app.globalData.userInfo, //用户信息
    danmakuContent: '', //弹幕内容
    isGuessState:false, //竞猜弹窗状态
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

      if (!this.data.isScroll) {
        this.setData({
          isMore:this.data.isMore+1
        })
        console.log(this.data.isMore);
      }
    }, 1000)
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

// ----------------------中奖提示---------------//
  bindWinningClose: function () { //弹框--关
    this.setData({
      isWinning: false,
    })
  },

//-------------------弹幕----------------//
  bindHotShow: function () {//速弹--开/关
    this.setData({
      isHot: !this.data.isHot,
    })
    this.bindScroll();
  },

  bindKeyInput: function (e) {   //获取弹幕内容
    this.setData({
      danmakuContent: e.detail.value
    })
  },

  bindSendDanmaku: function () {   //发送弹幕
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

  bindMoreMessage: function () {  //更多消息
    this.setData({
      isMore:0,
      isScroll:true
    })
    this.bindScroll();
  },

  //---------------节目单------------------//
  bindProgramLayer: function () { //弹窗--开/关
    this.setData({
      isProgramState: !this.data.isProgramState,
    })
  },

  //---------------竞猜------------------//
  bindGuessLayer:function(){ //弹窗--开/关
    this.setData({
      isGuessShow: !this.data.isGuessShow
    })
  },

//  ---------------------公用函数-------------
  bindScroll: function () {  //滚动到最底部
    if (this.data.isScroll) {
      wx.pageScrollTo({
        scrollTop: 999999,
      })
    }
  },
  
  bindTouchMove: function (e) { //静止滚动
    this.setData({
      isScroll: false
    })
    console.log(e.target.offsetTop);
  },
})