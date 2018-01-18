let api = require("API/api.js");

App({
  onLaunch: function () {
    var that = this;
  },
  fetchUserInfo: function (callback) {
    var that = this;
    // if (that.globalData.userInfo) {
    //   if (typeof callback == "function") {
    //     callback(that.globalData.userInfo);
    //   }
    //   return;
    // }
    let login = new Promise((resolve) => {
      wx.login({ // 登录
        success: function (resp) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId    
          api.fetch(api.API.USER_OPENID, { code: resp.code })
            .then(res => {
              if (res.data.code === 0) {
                resolve(res.data.data);
                that.globalData.loginInfo = res.data.data;
              } else {
                wx.showToast({
                  title: '网络异常，请关闭后，重新进入！',
                });
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
    let userInfo = new Promise((resolve,reject) => {
      wx.getSetting({ // 获取用户信息
        success: function (resp) {
          if (!resp.authSetting['scope.userInfo']) {
            wx.authorize({
              scope: 'scope.userInfo',
              success: function (resp) {
                // console.log("授权成功")
              },
              fail: function (resp) {
                reject(resp);
                // console.log("未授权");
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
            },
            fail:function(err) { //获取用户信息失败
              reject(err);
            }
          });
        }
      });
    })
    return Promise.all([login, userInfo]);
  },
  onError: function (msg) {
  },
  globalData: {
    zafeast: {}, // 这里作为一个全局变量, 方便其它页面调用
    userInfo: null,
    loginInfo: null,
    info: null,
  },
})
