// pages/upload/upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    txtHidden: true,
    responseTxt: 'txt'
  },

  formSubmit: function (sbmt) {
    let that = this;
    wx.request({
      url: 'https://green-light.top/wxupload/',
      data: {
        steps: wx.getStorageSync('steps'),
        username: sbmt.detail.value.username,
        password: sbmt.detail.value.password
      },
      method: 'post',
      success: function (res) {
        console.log('statusCode: ', res.statusCode)
        console.log('responseBody: ', res.data)
        if (res.data.success == true)
          that.setData({txtHidden: false, responseTxt: '上传成功！（' + res.data.uploadTime + '）'})
        else
          that.setData({txtHidden: false, responseTxt: '用户名或密码错误！'})
      }
    })
  }
})