let api = require("API/api.js");

App({
  onLaunch: function () {
    var that = this;
    that.fetchUserInfo();
    // this.getSystemInfo();
    // console.log(this.fetchUserInfo());
  },
  fetchUserInfo: function (callback) {
    var that = this;
    if (that.globalData.userInfo) {
      if (typeof callback == "function") {
        callback(that.globalData.userInfo);
      }
      return;
    }
    let login = new Promise((resolve)=>{
      wx.login({ // 登录
        success: function (resp) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId    
          api.fetch(api.API.USER_OPENID, { code: resp.code })
            .then(res => {
              console.log(res);
              if (res.data.code === 0) {
                resolve(res.data.data);
                that.globalData.loginInfo = res.data.data
              } else {
                wx.showToast({
                  title: '网络异常，请关闭后，重新进入！',
                });
                console.log(res.data.message)
              }
            })
            .catch(err => {
              console.log(err);
            });
        },
        fail: function (resp) {
          wx.showToast({
            title: '网络异常，请关闭后，重新进入！',
          });
        }
      })
    })
  let userInfo = new Promise((resolve)=>{
    wx.getSetting({ // 获取用户信息
      success: function (resp) {
        if (!resp.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success: function (resp) {
              console.log(resp);
              console.log("授权成功")
            },
            fail: function (resp) {
              console.log("未授权")
            }
          });
        }
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: function (resp) {
            console.log("用户信息", resp.userInfo);
            that.globalData.userInfo = resp.userInfo // 可以将 res 发送给后台解码出 unionId
            if (typeof callback == "function") {
              callback(resp.userInfo);
            }
            resolve(resp.userInfo);
          }
        });
      }
    });
  })
    Promise.all([login,userInfo]).then(res=>{
      if (that.userInfoReadyCallback) { // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        that.userInfoReadyCallback(res)
      }
      that.globalData.info = res;
    });
  },
  onError: function (msg) {
  },
  globalData: {
    zafeast: {}, // 这里作为一个全局变量, 方便其它页面调用
    userInfo: null,
    loginInfo:null,
    info:null,
  },
  getSystemInfo: function () {
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
      }
    })
  }
})
