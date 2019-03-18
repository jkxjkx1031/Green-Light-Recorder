//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    time: (new Date()).toString(),
    steps: getApp().globalData.userRunData,
    updateY: 0,
    updateM: 0,
    updateD: 0,
    updateHr: 0,
    updateMin: 0,
    updateSec: 0
  },

  //事件处理函数
  jumpToUpload: function() {
    wx.navigateTo({
      url: '../upload/upload'
    })
  },

  //生命周期函数
  onLoad: function () {
    // 登录
    let that = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var appid = "wx8e12dcb024fe1d6f";
        var secret = "09abbe6438c2964f16fdc86c3b2d9f0b";
        if (res.code) {
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + res.code + '&grant_type=authorization_code',
            header: {
              'content-type': 'json'
            },
            success: function (res) {
              var session_key = res.data.session_key;
              console.log(session_key);
              that.setData({appid: appid, session_key: session_key});
            }
          })
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: function (res) {
        console.log(res);
        if (!res.authSetting['scope.werun']) {
          wx.showModal({
            title: '提示',
            content: '获取微信运动步数，需要开启计步权限',
            success: function (res) {
              if (res.confirm) {
                //跳转去设置
                wx.openSetting({
                  success: function (res) {
                  }
                })
              } else {
                //不设置
              }
            }
          })
        } else {
          wx.getWeRunData({
            success: function (res) {
              console.log(res);
              var appid = that.data.appid;
              var session_key = that.data.session_key;
              var encryptedData = res.encryptedData;
              var iv = res.iv;
              console.log("appid:" + appid + "\nsession_key:" + session_key + "\nencryptedData:" + res.encryptedData + "\niv:" + res.iv);
              wx.request({
                url: 'https://green-light.top/wxcrypt/',
                method: 'post',
                header: {
                  'content-type': 'json'
                },
                data: {appId: that.data.appid, sessionKey: that.data.session_key, encryptedData: res.encryptedData, iv: res.iv},
                success: function (res) {
                  console.log(res.data.steps)
                  console.log(res.data.timestamp)
                  that.setData({steps: res.data.steps})
                  var date = new Date(res.data.timestamp * 1000)
                  that.setData({updateY: date.getFullYear(), updateM: date.getMonth(), updateD: date.getDate(), updateHr: date.getHours(), updateMin: date.getMinutes(), updateSec: date.getSeconds()})
                  wx.setStorageSync('steps', res.data.steps)
                },
                fail: function () {
                  console.log('解码失败')
                }
              })
            },
            fail: function (res) {
              wx.showModal({
                title: '提示',
                content: '开发者未开通微信运动，请关注“微信运动”公众号后重试',
                showCancel: false,
                confirmText: '知道了'
              })
            }
          })
        }
      }
    });
  }
})
