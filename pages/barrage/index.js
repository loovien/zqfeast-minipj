let app = getApp();
let apis = require("../../API/api.js");

let strategyTypes = { //协议集合
  "common": function (data) { //弹幕列表
    this.pushDanmakuList(data);
    this.setData({
      isMore: this.data.isMore + 1,
    })
  },
  "luck": function (data) { //中奖
    if (data.token == this.data.uid) { //token值等于UID值中奖
      this.setData({
        isWinning: true
      })
    }
  },
  "guess.go": function (data) {//开启竞猜
    let content = Object.assign({}, data, { userInfo: { nickname: '系统消息' } });
    this.pushDanmakuList(content);
    if (this.data.isVerify) { //验证用户才能竞猜
      this.guessTimer = setTimeout(() => {
        this.setData({
          isGuessShow: true,
          isBeginSuess: true,
        })
      }, 3000)
    }
  },
  "guess.bye": function (data) {//关闭竞猜
    let content = Object.assign({}, data, { userInfo: { nickname: '系统消息' } });
    this.pushDanmakuList(content);
    this.setData({
      isGuessShow: false,
      isBeginSuess: false,
    })
  },
  "kick": function (data) {
    this.pushDanmakuList(data);
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAdmin: false, //是否为管理员
    isVerify: false,//是否ID验证
    danmakuList: [], //弹幕列表
    isScroll: true,
    values: null,//input value值
    hasChoosed: -1,//-1未操作
    userInfo: null,
    guessTop: false, //竞猜积分榜
    uid: null,//用户绑定ID
    giftNum: 0, //奖励发放数量
    isProgramState: false, //节目列表弹窗状态
    isWinning: false, //是否中奖
    isLuckState: false, //弹幕抽奖设置
    isHot: false, //速弹展示状态
    isDisable: false, //发送按钮状态
    isMore: 0, //未读消息
    topList: [],//其他积分榜
    myselfList: {},//自己积分榜
    danmakuContent: '', //弹幕内容
    isGuessState: false, //竞猜弹窗状态
    luckState: true, //是否开启弹幕抽奖
    isConnect: false,//弹幕连接状态，
    isError: false, //弹幕连接失败
    isSetGuessState: false,//设置竞猜状态
    isSetGuessBegin: true,//是否开启设置
    setGuessResult: '', //设置竞猜结果
    chooseGuessResult: '',//选择竞猜结果
    isGuessLayerShow: false, //用户竞猜确认
    isBootom: false,//是否到底部
    isBeginSuess: false,//竞猜活动是否开启
    voteState: false,//投票状态
    guessNumber: 1,//竞猜次数
    voteLayerState: false, //投票确认弹框状态
    voteLayerMsg: '投票未开启',//投票确认弹框提示语
    voteBoxState: false, //投票弹窗状态
    isChecker: false,//是否选择投票
    voteList: [],//投票列表
    checkerId: '', //投票ID
    voteAjax:false, //是否发起ajax请求
    hotList: [ //速弹列表
      '战旗威武！',
      '小姐姐666~我为你打CALL',
      '帅帅帅帅帅帅！',
      '下一个奖是我的',
      '这个节目是今晚最棒的！'],
    msg: { "type": "common", "txt": "", "token": "", color: "" },//弹幕默认模板
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    console.log(options);
    if (options.info !== 'undefined') {
      let data = JSON.parse(options.info);
      this.initData(data);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // setInterval(()=>{
    //   let i = parseInt(Math.random()*7);
    //   this.sendSocketMessage(this.data.hotList[i]);
    // },200)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.socketFunction();
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
    wx.closeSocket();
    this.setData({
      danmakuList: []
    })
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
      danmakuContent: value,
      isDisable: value.length > 0
    })
  },

  bindSendDanmaku: function (e) {  //发送弹幕
    if (this.data.danmakuContent.length <= 0) { //内容为空
      return;
    }
    this.sendSocketMessage(this.data.danmakuContent);
    this.setData({
      danmakuContent: '',
      values: null,
    })
  },

  bindHotSend: function (e) { //快速弹幕发送
    let index = e.currentTarget.dataset.index;
    let content = this.data.hotList[index];
    let color = `dm-color-${index}`;
    this.sendSocketMessage(content, color);
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

  //停止滚屏提示
  bindTips: function () {

  },

  //---------------弹幕抽奖---------------//
  bindLuckLayer: function () { //设置弹窗--开
    this.setData({
      isLuckState: !this.data.isLuckState,
    })
    this.fetchLuckyNumber();
    this.fetchLotteryInfo();
  },

  bindLuckLayerCancel: function () { //设置弹窗--关
    this.setData({
      isLuckState: !this.data.isLuckState,
    })
  },

  bindLuckState: function () {//弹幕抽奖-开/关
    this.setData({
      luckState: !this.data.luckState,
    })
    this.fetchLotteryFlag(this.data.luckState);
    this.bindLuckLayerCancel();
  },


  pushDanmakuList: function (list) { //弹幕内容添加
    let danmakuList = this.data.danmakuList;
    danmakuList.push(list)
    this.setData({
      danmakuList: danmakuList,
      danmakuContent: '',
    })
  },
  //---------------节目单------------------//
  bindProgramLayer: function () { //弹窗--开/关
    this.setData({
      isProgramState: !this.data.isProgramState,
    })
  },

  //---------------竞猜------------------//
  bindGuessLayer: function (e) { //弹窗--开/关
    let flag = e.currentTarget.dataset.id;
    if (flag === 'ajax') {
      this.fetchGuessInfo();
      this.fetchGuessTop();
    }
    this.setData({
      isGuessShow: !this.data.isGuessShow
    })

  },
  bindSetGuess: function (e) { //设置弹窗--开/关
    let flag = e.currentTarget.dataset.id;
    this.setData({
      isSetGuessState: !this.data.isSetGuessState
    })

    if (flag === "ajax") { //带有ajax标签才会发起请求
      this.fetchGuessInfo();
      this.fetchVoteState();
    }
  },
  bindSetGuessAffirm: function (e) { //确认竞猜
    let flag = e.currentTarget.dataset.id;
    if (flag === 'ok') { //可点击状态
      this.fetchGuessFlag();
    } else {
      return;
    }
    this.setData({
      isSetGuessState: false
    })
  },
  bindSetGuessBegin: function () { //设置竞猜
    this.setData({
      isSetGuessBegin: !this.data.isSetGuessBegin
    })
    if (this.data.isSetGuessBegin === true) {
      this.setData({
        setGuessResult: ''
      })
    }
  },

  bindChooseGuess: function (e) { //管理员竞猜结果设置
    let result = e.currentTarget.dataset.id;
    this.setData({
      setGuessResult: result
    })
  },

  bindChooseResult: function (e) {//用户竞猜选择
    if (this.data.hasChoosed >= 0) {
      return;
    }
    let result = e.currentTarget.dataset.id;
    this.setData({
      chooseGuessResult: result,
      isGuessLayerShow: true,
    })
  },

  bindAffirmResult: function () { //用户提交竞猜
    let data = { uid: this.data.uid, choice: this.data.chooseGuessResult }
    if (data.choice === 'A') {
      data.choice = 0
    } else if (data.choice === 'B') {
      data.choice = 1
    }
    apis.fetch(apis.API.GUESS_CHOICE, data, "POST")
      .then(res => {
        console.log(res);
      })
    this.setData({
      isGuessLayerShow: false,
      isGuessShow: false,
    })
  },
  bindACancelResult: function () { //用户取消选择
    this.setData({
      isGuessLayerShow: false,
      chooseGuessResult: '' //取消重置选择
    })
  },
  // ---------------------投票------------------

  bindSetVote: function () {
    this.setData({
      voteState: !this.data.voteState,
    })
    this.fetchSetVoteState();
  },
  bindChooseVote: function () {
    this.fetchVoteState('user');
  },
  //关闭弹窗
  bindCloseVoteLayer: function () {
    this.setData({
      voteBoxState: false,
    })
  },

  //选择用户
  bindChooseItem: function (e) {
    let id = e.currentTarget.dataset.id;
    let flag = e.currentTarget.dataset.flag;
    // let arr = this.data.checkerId;
    let list = this.data.voteList;

    let index = list.findIndex(item => {
      return item.id === id
    })
    //已投票不执行
    if (flag === 1) {
      return;
    }
    list[index].uvoted = !flag;


    // console.log(index);
    // list.forEach((item, index) => {
    //   if (index === id) {
    //     item.uvoted = !flag;
    // if (item.uvoted ===true) {
    //   arr.push(item.id);
    // } else{
    //   let index = arr.findIndex(i=>{
    //     return i===item.id
    //   });
    //   if(index !== -1) {
    //     arr.splice(index,1);
    //   }
    // }
    //   }
    // })
    this.setData({
      // voteList: list,
      voteLayerState: true,
      checkerId: id,
    })
    // if (arr.length === 5) { //已选择5个
    //   this.setData({
    //     voteLayerState: true
    //   })
    //   return;
    // }
  },

  //提交选择
  bindCommitVote: function (e) {
    let flag = e.currentTarget.dataset.ajax;
    if(!flag) { //不提交ajax
      this.setData({
        voteLayerState:false,
      })
      return;
    }
    this.fetchChooseVote();
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
      isMore: 0,
      isScroll: false,
    })
  },

  bindScrollBottom: function (e) { //滚到底部
    this.setData({
      isBootom: true,
    })
  },

  initData: function (data) { //异步获取用户信息
    this.setData({
      isAdmin: data.is_admin,
      uid: data.uid,
      isVerify: data.uid,
      userInfo: data
    })
  },

  //弹窗
  alertFunc: function (msg) {
    wx.showToast({
      title: msg,
      image: '/pages/index/img/sb.png',
      duration: 2000
    })
  },
  // ----------------接口交互-----------------//
  fetchGuessInfo: function () { //获取竞猜状态
    let _this = this;
    let data = { uid: this.data.uid };
    apis.fetch(apis.API.GUESS_INFO, data)
      .then(res => {
        if (res.data.code === 0) { //成功
          _this.setData({
            isBeginSuess: res.data.data.status,
            guessNumber: res.data.data.index,
            chooseGuessResult: _stringToNumber(res.data.data.u),
            isSetGuessBegin: res.data.data.status,
            hasChoosed: res.data.data.u.choice,
          })
        } else { //失败
          _this.setData({
            isBeginSuess: false,
            chooseGuessResult: '',
            isSetGuessBegin: false,
          })
        }
      })

    function _stringToNumber(data) {
      let choice;
      if (data.choice === 0) {
        choice = "A"
      } else if (data.choice === 1) {
        choice = "B"
      } else { //没选择
        choice = ""
      }
      return choice;
    }
  },

  fetchGuessTop: function () { //获取竞猜积分榜
    let _this = this;
    apis.fetch(apis.API.GUESS_TOP, { uid: this.data.uid })
      .then(res => {
        let data = res.data;
        if (data.code === 0) {
          if (data.data.list && data.data.list.length < 10) {
            let len = data.data.list.length;
            for (let i = 0; i < 10 - len; i++) {
              data.data.list.push({});
            }
          }
          _this.setData({
            guessTop: data.data.list,
            topList: data.data.list,
            myselfList: data.data.u,
          })
        }
      })
  },

  fetchLuckyNumber: function () { //中奖数量
    let _this = this;
    apis.fetch(apis.API.ADMIN_LUCKY_NUM, { uid: this.data.uid }, "POST")
      .then(res => {
        console.log(res);
        if (res.data.code === 0) {
          _this.setData({
            giftNum: res.data.data.num,
          })
        }
      })
  },

  fetchLotteryInfo: function () { //获取设置弹幕抽奖状态
    let _this = this;
    apis.fetch(apis.API.ADMIN_LOTTERY_INFO, { uid: this.data.uid })
      .then(res => {
        let data = res.data;
        if (res.data.code === 0) {
          _this.setData({
            luckState: res.data.data.status,
          })
        }
      }
      )
  },

  fetchLotteryFlag: function (type) {//设置弹幕抽奖开/关
    let data = { uid: this.data.uid };
    if (type === false) {
      data.status = 0;
    } else if (type === true) {
      data.status = 1;
    }
    apis.fetch(apis.API.ADMIN_LOTTERY_FLAG, data, 'POST')
      .then(res => {
        console.log(res);
      })
  },

  fetchGuessFlag: function () { //竞彩-开/关
    let result = this.data.setGuessResult;
    let swich = Number(!this.data.isSetGuessBegin);
    let data = { uid: this.data.uid, status: swich };
    let _this = this;
    if (result === "A") {
      data.answer = 0;
    } else if (result === 'B') {
      data.answer = 1;
    }
    apis.fetch(apis.API.ADMIN_GUESS_FLAG, data, 'POST')
      .then(res => {
        if (res.data.code === 1) {
          _this.alertFunc(res.data.message);
        }
      })
  },

  //管理员获取投票状态
  fetchVoteState: function (type = 'admin') {
    const _this = this;
    apis.fetch(apis.API.ADMIN_VOTE_STATE, { uid: this.data.uid })
      .then(res => {
        if (res.data.code === 0) {
          if (type === 'admin') { //管理员
            _this.setData({
              voteState: res.data.data.status
            })
          } else if (type === 'user') { //用户
            if (!res.data.data.status) { //关闭状态
              _this.setData({
                voteLayerState: true,
                voteAjax: false,
              })
            } else { //开启状态
              _this.setData({
                voteLayerState: false,
                voteAjax:true,
                voteLayerMsg: '请确认你的选择',
              })
              _this.fetchVoteList();
            }
          }
        }
      })
  },

  //设置投票开关
  fetchSetVoteState: function () {
    const _this = this;
    let data = {
      uid: this.data.uid,
      status: Number(this.data.voteState)
    }
    apis.fetch(apis.API.ADMIN_VOTE_SWITCHER, data, "POST")
      .then(res => {
        if (res.data.code === 0) { //成功
          _this.setData({
            isSetGuessState: false
          })
        } else { //失败
          _this.alertFunc(res.data.message);
        }
      })
  },

  //用户投票
  fetchChooseVote: function () {
    let _this = this;
    let data = {
      uid: this.data.uid,
      voteId: this.data.checkerId
    }
    apis.fetch(apis.API.VOTE_DONE, data, "POST")
      .then(res => {
        if (res.data.code === 0) {
          _this.setData({
            voteLayerState: false
          })
          _this.fetchVoteList();
        } else if (res.data.code === 1) {
          this.setData({
            voteLayerMsg: '抱歉, 您的投票次数用完了',
            voteAjax:false,
          })
        }
      })
  },

  //投票列表
  fetchVoteList: function () {
    const _this = this;
    let data = {
      uid: this.data.uid,
      page: 1,
      size: 999999,
    }
    apis.fetch(apis.API.VOTE_LIST, data)
      .then(res => {
        if (res.data.code === 0) {
          let list = res.data.data.list;
          // list.forEach(item => {
          //   item.state = false;
          // })
          _this.setData({
            voteList: list,
            voteBoxState: true,
          })
        }
      })
  },
  //取消提交
  bindCancelVote: function () {
    this.setData({
      voteLayerState: false,
    })
  },
  //---------------------------socket------------------
  socketFunction: function () { //socket连接
    let _this = this;
    //建立连接
    wx.connectSocket({
      url: apis.API.WSS,
    })

    //连接成功
    wx.onSocketOpen(function (res) {
      console.log('----------------------连接成功------------------')
      _this.setData({
        isConnect: true,
        isError: false,
      })
    });

    //接收数据
    wx.onSocketMessage(function (res) {
      console.log('---------------------接收数据------------------')
      console.log(res);
      let data = JSON.parse(res.data);
      _this.calcStrategyTypes(data.type, data);
    });

    //连接失败
    wx.onSocketError(function () {
      console.log('websocket连接失败！');
      _this.setData({
        isError: true,
        isConnect: false,
      })
    })

    //关闭连接
    wx.onSocketClose(function () {
      console.log('websocket连接关闭！');
      _this.setData({
        isError: true,
        isConnect: false,
      })
    })
  },

  sendSocketMessage: function (content, color) { //socket发送消息
    color = color || `dm-color-${parseInt(Math.random() * 7)}`;
    let msg = this.data.msg;
    msg.txt = content;
    msg.token = this.data.uid;
    msg.color = color;
    wx.sendSocketMessage({
      data: JSON.stringify(msg),
    })
  },
  calcStrategyTypes: function (type, data) { //下发协议计算
    strategyTypes[type].call(this, data);
  },

  iSdminFetch: function () { //管理员权限
    this.fetchLuckyNumber();
    this.fetchLotteryInfo();
  }
})