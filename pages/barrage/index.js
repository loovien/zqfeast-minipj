Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAdmin:false,
    isVerify:false,
    danmakuList:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    isScroll:true,
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
     if(this.data.isScroll) {
       wx.pageScrollTo({
         scrollTop: 999999,
       })
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
  bindTouchMove:function(){
    this.setData({
      isScroll: false,
    })
  },
})