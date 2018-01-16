const BASEURL = 'https://luckybb.zhanqi.tv'
const API = {
  USER_OPENID: BASEURL + '/minipg/user/openid.json', //openid
  USER_INFO: BASEURL + '/common/user/info.json', //签到信息
  GUESS_INFO: BASEURL + '/common/guess/info.json', //获取竞猜状态
  GUESS_CHOICE: BASEURL + '/common/guess/choice.json', //提交竞猜答案
  GUESS_TOP: BASEURL + '/common/guess/top.json',//竞猜排行榜
  ADMIN_LUCKY_NUM: BASEURL + '/admin/luckydog/num.json',//获取中奖用户数量
  ADMIN_LOTTERY_INFO: BASEURL + '/admin/lottery/info.json', //管理员获取弹幕抽奖开关信息
  ADMIN_LOTTERY_FLAG: BASEURL + '/admin/lottery/switcher.json',//管理员开启关闭弹幕关闭弹幕抽奖
  ADMIN_GUESS_FLAG: BASEURL + '/admin/guess/switcher.json', //管理员开启关闭竞猜 
  WSS: 'wss://luckybb.zhanqi.tv/websocket' //wss连接
}

let fetch = function (url, data, type = 'GET') {
  wx.showLoading({
    mask:true,
  });
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: type,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        resolve(res);
        wx.hideLoading()
      },
      fail: function (err) {
        wx.showToast({
          title: '接口请求异常!',
          icon: 'loading',
          duration: 2000
        })
        reject(err);
      }
    })
  })
}

module.exports = {
  API: API,
  fetch: fetch,
  BASEURL: BASEURL,
}