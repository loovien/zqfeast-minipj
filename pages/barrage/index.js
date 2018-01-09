let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAdmin: true, //是否为管理员
    isVerify: true,//是否ID验证
    danmakuList: [], //弹幕列表
    isScroll: true,
    userInfo: null,
    giftNum: 0, //奖励发放数量
    isProgramState: false, //节目列表弹窗状态
    isWinning: false, //是否中奖
    isLuckState: false, //弹幕抽奖设置
    isHot: false, //速弹展示状态
    isDisable: true, //发送按钮状态
    isMore: 0, //未读消息
    danmakuContent: '', //弹幕内容
    isGuessState: false, //竞猜弹窗状态
    luckState: true, //是否开启弹幕抽奖
    isConnect: true,//弹幕连接状态，
    isError: false, //弹幕连接失败
    isSetGuessState: false,//设置竞猜状态
    isSetGuessBegin: false,//是否开启设置
    setGuessResult: '', //设置竞猜结果
    chooseGuessResult: '',//选择竞猜结果1
    isGuessLayerShow: false, //用户竞猜确认
    isBootom: false,//是否到底部
    hotList: [
      '战旗威武！',
      '小姐姐666~我为你打CALL',
      '帅帅帅帅帅帅！',
      '下一个奖是我的',
      '这个节目是今晚最棒的！',
      '100把大宝剑送给你']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else { //异步获取用户信息
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // setInterval(()=>{
    //   this.bindSendDanmaku();
    //   this.setData({
    //     isMore: this.data.isMore + 1,
    //   })
    // },3000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    setTimeout(() => {
      this.setData({
        isConnect: false,
      })
    }, 6000)

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isConnect: true
    })
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
  },

  bindKeyInput: function (e) {   //获取弹幕内容
    let value = e.detail.value.trim();//去头尾空格
    this.setData({
      danmakuContent: value
    })
  },

  bindSendDanmaku: function (e) {  //发送弹幕
    if (this.data.danmakuContent.length <= 0) { //内容为空
      return;
    }
    this._pushDanmakuList(this.data.danmakuContent);
  },

  bindHotSend: function (e) { //快速弹幕发送
    let index = e.currentTarget.dataset.index;
    this._pushDanmakuList(this.data.hotList[index]);
    this.setData({
      isHot: !this.data.isHot,
    })
  },

  bindMoreMessage: function () {  //更多消息
    this.setData({
      isMore: 0,
      isScroll: true
    })
    this.bindScroll();
  },

  // private
  _pushDanmakuList: function (text) { //弹幕内容添加
    let danmakuList = this.data.danmakuList;
    danmakuList.push(
      {
        content: text,
        nickName: this.data.userInfo.nickName,
        isMyself: true
      }
    )
    this.setData({
      danmakuList: danmakuList,
      danmakuContent: '',
    })
    this.bindScroll();
  },

  //---------------弹幕抽奖---------------//
  bindLuckLayer: function () { //设置弹窗--开/关
    this.setData({
      isLuckState: !this.data.isLuckState,
    })
  },
  bindLuckState: function () { //抽奖--开/关
    this.setData({
      luckState: !this.data.luckState
    })
  },

  //---------------节目单------------------//
  bindProgramLayer: function () { //弹窗--开/关
    this.setData({
      isProgramState: !this.data.isProgramState,
    })
  },

  //---------------竞猜------------------//
  bindGuessLayer: function () { //弹窗--开/关
    this.setData({
      isGuessShow: !this.data.isGuessShow
    })
  },
  bindSetGuess: function () { //弹窗--开/关
    this.setData({
      isSetGuessState: !this.data.isSetGuessState
    })
  },
  bindSetGuessBegin: function () { //设置竞猜
    this.setData({
      isSetGuessBegin: !this.data.isSetGuessBegin
    })
  },

  bindChooseGuess: function (e) { //管理员竞猜结果设置
    let result = e.currentTarget.dataset.id;
    this.setData({
      setGuessResult: result
    })
  },

  bindChooseResult: function (e) {//用户竞猜选择
    let result = e.currentTarget.dataset.id;
    this.setData({
      chooseGuessResult: result,
      isGuessLayerShow: true,
    })
  },

  bindAffirmResult: function () { //用户确认选择
    this.setData({
      isGuessLayerShow: false,
      isGuessShow: false,
    })
  },
  bindACancelResult: function () { //用户取消选择
    this.setData({
      isGuessLayerShow: false,
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

  bindIsScroll: function (e) { //禁止弹幕滚屏
    this.setData({
      isScroll: false,
    })
  },
  
  bindScrollBottom: function (e) { //滚到底部
    this.setData({
      isBootom: true,
    })
  }
})