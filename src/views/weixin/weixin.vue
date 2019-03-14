<template>
    <div class="weixinban">
      <section class="section1">
        <div class="container">
          <div class="sec-top">
            <h3>和泰点金策略APP</h3>
            <p>安全、方便、快捷</p>
            <p>让你随时体验A股策略交易的乐趣。</p>
            <div class="app-down clearfix">
              <div class="f-left">
                <a v-for="(item, index) of downLink" :key="index" :class="{active: downloadChoose == index}" @click.prevent="downloadChooseCode(item.id)">{{item.name}}</a>
              </div>
              <div class="f-right">
                <canvas id="canvas"></canvas>
                <span>扫二维码下载</span>
              </div>
            </div>
          </div>
          <div class="sec-bottom sec-div">
            <h4>实时数据  在线点买</h4>
            <div class="sec-bottom-div ">
              <p class="top-arrow">专业风控&nbsp;&nbsp;&nbsp;降低风险</p>
              <p class="bottom-arrow">一键交易&nbsp;&nbsp;&nbsp;轻松赚钱</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section2">
        <div class="container">
          <div class="sec-top2">
            <h4>三方合作 安全保障</h4>
            <div class="sec-top-div">
              <p class="top-arrow">团队专业&nbsp;&nbsp;&nbsp;技术保障</p>
              <p class="bottom-arrow">三方合作&nbsp;&nbsp;&nbsp;资金安全</p>
            </div>
          </div>
          <div class="sec-bottom sec-div">
            <h4>一手掌握 便捷操作</h4>
            <div class="sec-bottom-div">
              <p class="top-arrow">手机交易&nbsp;&nbsp;&nbsp;方便灵活</p>
              <p class="bottom-arrow">随时随地&nbsp;&nbsp;&nbsp;轻松点买</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section3">
        <div class="container">
          <div class="sec-top2">
            <h4>贴心管家 优秀服务</h4>
            <div class="sec-top-div">
              <p class="top-arrow">专业客服&nbsp;&nbsp;&nbsp;优质服务</p>
              <p class="bottom-arrow">无时无刻&nbsp;&nbsp;&nbsp;为您服务</p>
            </div>
          </div>
        </div>
      </section>
    </div>
</template>

<script>
    import QRCode from 'qrcode'     //引入生成二维码组件
    export default {
      name: "weixin",
      data(){
        return {
          downloadChoose: '0', //下载地址
          androidImg: '', //安卓下载二维码
          iosImg: '', //ios下载二维码
          downLink: [
            {name: 'Android下载',id: 0},
            {name: 'iOS下载',id: 1}
          ],
        }
      },
      mounted(){
        this.getDownLink()
      },
      methods: {

        getDownLink() { //获取下载链接
          this.$axios.post('/api/index/app_down_link').then(res => {
            if(res.data.errorCode === 0) {
              this.androidImg = res.data.data.android;
              this.iosImg = res.data.data.ios;

              if(this.androidImg) {
                this.useqrcode(this.androidImg);
              }
            }
          })
        },
        //动态生成二维码
        useqrcode(url){
          //生成的二维码内容，可以添加变量
          var canvas = document.getElementById('canvas')
          QRCode.toCanvas(canvas, url, function (error) {
            if (error) console.error(error)
            console.log('success!');
          })
        },

        downloadChooseCode(curCode) {
          this.downloadChoose = curCode;

          if(this.androidImg) {
            this.useqrcode(this.androidImg);
          }
          if(this.iosImg) {
            this.useqrcode(this.iosImg);
          }
        },
      }
    }
</script>

<style scoped>
  .weixinban .section1 {
    background: url(../../../public/img/phone-bg1.jpg) no-repeat center center;
    background-size: cover;
  }
  .container {
    width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
    position: relative;
  }
  .weixinban .section1 .sec-top {
    height: 550px;
    color: white;
  }
  .weixinban .section1 .sec-bottom {
    height: 730px;
    text-align: right;
    color: #4c4c4c;
  }
  .weixinban .section1 .sec-top h3 {
    font-size: 52px;
    padding-top: 126px;
    padding-bottom: 24px;
    line-height: 1;
    letter-spacing: 3px;
  }
  .weixinban .section1 .sec-top p {
    font-size: 22px;
    line-height: 40px;
  }
  .weixinban .section1 .sec-top .app-down {
    width: 490px;
    margin-top: 30px;
  }
  .f-left {
    float: left;
  }
  .weixinban .section1 .sec-top .app-down a {
    display: block;
    width: 220px;
    line-height: 54px;
    font-size: 22px;
    color: white;
    border-radius: 10px;
    text-align: center;
    margin-top: 10px;
    border-radius: 54px;
    background: white;
    color: #FD7336;
  }
  .weixinban .section1 .sec-top .app-down a.active {
    background-color: #338fff;
    color: #fff
  }
  .weixinban .section1 .sec-top .app-down a + a {
    margin-top: 26px;
  }
  .weixinban .section1 .sec-top .app-down a:nth-child(1):before {
    content: "\e90c";
    font-family: icomoon;
    padding-right: 10px;
    font-size: 24px;
  }

  .weixinban .section1 .sec-top .app-down a:nth-child(2):before {
    content: "\e90b";
    font-family: icomoon;
    padding-right: 10px;
    font-size: 24px;
  }



  .f-right {
    float: right;
  }
  .weixinban .section1 .sec-top .app-down img {
    width: 150px;
  }
  .weixinban .section1 .sec-top .app-down span {
    display: block;
    width: 150px;
    text-align: center;
    font-size: 18px;
  }
  .weixinban .section1 .sec-bottom {
    height: 730px;
    text-align: right;
    color: #4c4c4c;
  }
  .weixinban .section1 h4, .weixinban .section2 .sec-bottom h4 {
    padding-right: 104px;
    padding-top: 296px;
  }
  .weixinban section .sec-div h4 {
    font-size: 30px;
    letter-spacing: 3px;
  }
  .weixinban section .sec-bottom-div {
    position: relative;
    width: 227px;
    height: 120px;
    margin-right: 126px;
    margin-top: 60px;
    float: right;
    font-size: 20px;
    text-align: center;
    line-height: 1;
  }
  .weixinban section .sec-div .top-arrow {
    margin-top: 30px;
  }
  .weixinban section .sec-div .top-arrow:before {
    display: block;
    width: 22px;
    height: 22px;
    border-top: 1px solid #4c4c4c;
    border-left: 1px solid #4c4c4c;
    content: " ";
    top: 0px;
    left: -20px;
    position: absolute;
  }
  .weixinban section .sec-div .top-arrow:after {
    display: block;
    width: 22px;
    height: 22px;
    border-top: 1px solid #4c4c4c;
    border-right: 1px solid #4c4c4c;
    content: " ";
    top: 0px;
    right: -20px;
    position: absolute;
  }
  .weixinban section .sec-div .bottom-arrow:before {
    display: block;
    width: 22px;
    height: 22px;
    border-bottom: 1px solid #4c4c4c;
    border-left: 1px solid #4c4c4c;
    content: " ";
    bottom: 0px;
    left: -20px;
    position: absolute;
  }
  .weixinban section .sec-div .bottom-arrow:after {
    display: block;
    width: 22px;
    height: 22px;
    border-bottom: 1px solid #4c4c4c;
    border-right: 1px solid #4c4c4c;
    content: " ";
    bottom: 0px;
    right: -20px;
    position: absolute;
  }
  .weixinban section .sec-div .bottom-arrow {
    margin-top: 18px;
  }
  .weixinban .section2 {
    background: url(../../../public/img/phone-bg3.png) no-repeat center center;
    background-size: cover;
  }
  .weixinban .section2 .sec-top2 {
    height: 600px;
    color: white;
  }
  .weixinban section .sec-top2 h4, .weixinban section .sec-top3 h4 {
    font-size: 30px;
    letter-spacing: 3px;
    padding-top: 230px;
    padding-left: 110px;
  }
  .weixinban section .sec-top2 .sec-top-div, .weixinban section .sec-top3 .sec-top-div {
    position: relative;
    width: 267px;
    height: 120px;
    margin-left: 110px;
    margin-top: 60px;
    font-size: 20px;
    text-align: center;
    line-height: 1;
    background: rgba(255,255,255,0.2);
  }
  .weixinban section .sec-top2 .top-arrow {
    padding-top: 30px;
  }
  .weixinban section .sec-top2 .top-arrow:before {
    display: block;
    width: 22px;
    height: 22px;
    border-top: 1px solid #fff;
    border-left: 1px solid #fff;
    content: " ";
    top: 0px;
    left: 0px;
    position: absolute;
  }
  .weixinban section .sec-top2 .top-arrow:after {
    display: block;
    width: 22px;
    height: 22px;
    border-top: 1px solid #fff;
    border-right: 1px solid #fff;
    content: " ";
    top: 0px;
    right: 0px;
    position: absolute;
  }
  .weixinban section .sec-top2 .bottom-arrow {
    margin-top: 18px;
  }
  .weixinban section .sec-top2 .bottom-arrow:before {
    display: block;
    width: 22px;
    height: 22px;
    border-bottom: 1px solid #fff;
    border-left: 1px solid #fff;
    content: " ";
    bottom: 0px;
    left: 0px;
    position: absolute;
  }
  .weixinban section .sec-top2 .bottom-arrow:after {
    display: block;
    width: 22px;
    height: 22px;
    border-bottom: 1px solid #fff;
    border-right: 1px solid #fff;
    content: " ";
    bottom: 0px;
    right: 0px;
    position: absolute;
  }
  .weixinban .section2 .sec-bottom {
    height: 730px;
    text-align: right;
  }
  .weixinban .section3 {
    background: url(../../../public/img/phone-bg2.png) no-repeat center center;
    background-size: cover;
    height: 600px;
    color: white;
  }
  .group:after, .container:after, .field-wrapper:after, .row:after {
    content: " ";
    display: block;
    height: 0;
    overflow: hidden;
    clear: both;
  }
  #canvas{
    width: 100%!important;
    height: auto!important;
  }
</style>
