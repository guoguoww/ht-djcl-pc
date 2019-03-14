<template>
  <div class="home">
    <!--轮播-->
    <section id="carousel" class="index-header">
      <swiper :options="swiperOption" ref="mySwiper">
         <!--slides -->
        <!--<swiper-slide><img src="../../public/img/banner1.jpg" alt=""></swiper-slide>-->
        <!--<swiper-slide><img src="../../public/img/banner2.jpg" alt=""></swiper-slide>-->
        <!--<swiper-slide><img src="../../public/img/banner3.jpg" alt=""></swiper-slide>-->

        <swiper-slide v-for="(item,index) in bannerList" :key="index"><img :src="item.url" alt=""></swiper-slide>
        <!-- Optional controls -->
        <div class="swiper-pagination"  slot="pagination"></div>
        <div class="swiper-button-prev icon-chevron-thin-left" slot="button-prev"></div>
        <div class="swiper-button-next icon-right" slot="button-next"></div>
      </swiper>
      <!--轮播上的登录-->
      <div class="container" id="index-login-form">
        <div class="index-login un-login" v-if="!$cookie.get('_auth')">
          <h4>请登录和泰点金策略</h4>
          <router-link class="login-btn" id="login-btn" to="/login">前往登录</router-link>
          <p class="index-reg">还没账号？<router-link class="link-reg" to="/register">立即注册</router-link></p>
        </div>
        <div class="index-login login" v-if="$cookie.get('_auth')">
          <h3>您好！<span id="index-login-form-nickname">{{userData.nickName}}</span></h3>
          <p class="welcome">欢迎回来</p>

          <p class="money-title">账户余额(元)<router-link class="recharge" to="/user/topUp">充值</router-link></p>
          <p class="p-money" id="index-login-form-mb">{{userData.money}} 元</p>
          <ul class="clearfix">
            <li>
              <p>模拟资金</p>
              <p id="diyongquan">{{userData.simulationMoney}} 元</p>
            </li>
            <li>
              <p>实名认证</p>
              <p id="today-buy">{{(userData.authStatus === 0 || userData.authStatus === 3)? '未认证': (userData.authStatus === 1? '审核中':  '已认证')}}</p>
            </li>
          </ul>
          <router-link class="login-btn" to="/trade/1">点买策略</router-link>
          <div class="notice2 clearfix" id="goToVerify" v-if="userData.authStatus === 0 || userData.authStatus === 3">
            <p class="fl">保障资金安全，确认策略人身份，请先进行实名认证。</p>
            <router-link class="fr" to="/user/security">马上认证</router-link>
          </div>
        </div>
      </div>
    </section>
    <!--概览-->
    <section class="overall">
      <div class="container">
        <ul class="clearfix">
          <li>
            <i class="icomoon icon-active-num"></i>
            <div>
              <h4 id="user_count">{{overallInf.userCount || 0}}</h4>
              <p>活跃用户人数</p>
            </div>
          </li>
          <li>
            <i class="icomoon icon-profit-num"></i>
            <div>
              <h4 id="total_profit">{{overallInf.profitMoney || (0).toFixed(2)}}</h4>
              <p>累计盈利金额</p>
            </div>
          </li>
          <li>
            <i class="icomoon icon-strategy-num"></i>
            <div>
              <h4 id="stockplan_count">{{overallInf.tradeCount || 0}}</h4>
              <p>累计匹配策略</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <!--交易动态/公告-->
    <section class="tradelist">
      <div class="sec_header"></div>
      <div class="container clearfix">
        <div class="item">
          <h4>交易动态  <router-link class="fr" to="/article/1">更多</router-link></h4>
          <div id="trading" class="trade-scroll" @mouseover="stopTop('trading')" @mouseout="continueTop('trading')">
            <ul id="trading1">
              <li class="clearfix" v-for="item in dealsList">
                <span>{{item.chnName}}</span>
                <span>{{parseInt((Date.parse(new Date()) - Date.parse(new Date(item.buyTime)))/1000/60/60/24)}}天前</span>
                <span>谋略</span>
                <router-link class="goToBuyNow" to="/trade/1">{{item.stockName}}[{{item.stockCode}}]</router-link>
              </li>
            </ul>
            <ul id="trading2">
              <li class="clearfix" v-for="item in dealsList">
                <span>{{item.chnName}}</span>
                <span>{{parseInt((Date.parse(new Date()) - Date.parse(new Date(item.buyTime)))/1000/60/60/24)}}天前</span>
                <span>谋略</span>
                <router-link class="goToBuyNow" to="/trade/1">{{item.stockName}}[{{item.stockCode}}]</router-link>
              </li>
            </ul>
            <p class="thereNo" v-if="noticeList.length === 0">暂无信息...</p>
          </div>
        </div>
        <div class="item">
          <h4>公告  <router-link class="fr" to="/article/2">更多</router-link></h4>
          <div id="conNews" class="trade-scroll">
            <ul id="conNews1">
              <li class="clearfix" v-for="item in noticeList" @click="openContentDetails(item)">
                <p>
                  <a href="javascript: void (0)" class="fl" title="item.title">{{item.title}}</a>
                  <span class="fr">{{item.createTime}}</span>
                </p>
              </li>
            </ul>
            <p class="thereNo" v-if="dealsList.length === 0">暂无信息...</p>
          </div>
        </div>
      </div>
    </section>
    <!--资讯-->
    <section class="inflist">
      <div class="container">
        <h4>资讯  <router-link class="fr" to="/article/3">更多</router-link></h4>
        <div class="trade-scroll">
          <ul>
            <li class="clearfix" v-for="item in newsList">
              <p>
                <a :href="item.url" target="_blank" class="fl" :title="item.title">{{item.title}}</a>
                <span class="fr">{{item.createTime}}</span>
              </p>
            </li>
          </ul>
          <p class="thereNo" v-if="newsList.length === 0">暂无信息...</p>
        </div>
      </div>
    </section>
    <!--产品介绍-->
    <section class="product-info">
      <div class="container">
        <div class="sec_header">
          <h3>策略动态<span>第一时间了解大神们的策略！</span></h3>
        </div>
        <ul>
          <li class="bg-red clearfix">
            <div class="left-info">
              <h3>和泰点金策略</h3>
              <!--<h4>200%</h4>-->
              <p>5倍 - 10倍</p>
            </div>
            <div class="right-info clearfix">
              <div class="part1">
                <router-link id="question-exp-guide" to="/">如何点买？</router-link>
              </div>
              <div class="part2">
                <h5>持仓时间</h5>
                <p><span>T</span>+n个交易日</p>
              </div>
              <div class="part3">
                <p><span>1250</span>元起</p>
                <router-link to="/trade/1">创建策略</router-link>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <!--客户端下载-->
    <section class="app-info">
      <div class="container">
        <div class="sec_header"><h3>客户端下载<span>随时随地抓住行情！</span></h3></div>
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
    </section>

    <!--朦版-->
    <div class="mask" id="mask"></div>
    <!--公告详情-->
    <div class="popup" id="popupCon">
      <div class="bar-percentage">
        <i class="icomoon icon-error" id="close-popupCon" @click="closeContentDetails()"></i>
      </div>
      <h3>{{contentDetails.title}}</h3>
      <div class="details" v-html="contentDetails.content"></div>

    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import QRCode from 'qrcode'     //引入生成二维码组件
import $ from "jquery";
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'home',
  data() {
    return {
      downLink: [
        {name: 'Android下载',id: 0},
        {name: 'iOS下载',id: 1}
      ],
      page: {
        start: 0, //第多少天
        rows: 6, //页容量
      },
      loginState: true, //登录状态
      userData: {}, //个人信息
      bannerList: [], //获取轮播图列表
      swiperOption: {
        // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，<br>　　　　　　　　假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
        notNextTick: true,
        autoplay: true, //自动轮播
        delay: 2000, //两秒切换
        loop: true,
        grabCursor: true,
        setWrapperSize: true,
        centeredSlides: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        paginationType: 'bullets',
        paginationClickable: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        observeParents: true,
      },
      overallInf: {}, // 获取概览数据
      tradingTimer: null, //交易动态定时器
      dealsList: [], //交易动态列表
      noticeList: [], //首页公告列表
      newsList: [], //新闻资讯列表
      contentDetails: {}, //模态框内容详情
      downloadChoose: 0, //下载地址
      androidImg: '', //安卓下载二维码
      iosImg: '', //ios下载二维码
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  created() {
    if(this.$cookie.get('_auth')) {
      this.getUserData()
    }
    this.getBanner();
    this.getOverall();
    this.getDeals();
    this.getNotice();
    this.getNews();
    this.getDownLink();

  },
  mounted() {
    this.upTop('trading');

  },
  beforeDestroy() { //销毁组件前 清除计时器
    clearInterval(this.tradingTimer);
  },
  methods: {

    getUserData() { //获取登录信息
      this.$axios.post('/api/user/query_user_msg').then(res => {
        if (res.data.errorCode === 0) {
          this.userData = res.data.data
        }
      })
    },

    getBanner() { //获取轮播图
      this.$axios.post('/api/home/slide/show?type=2').then(res => {
        if(res.data.errorCode === 0) {
          this.bannerList = res.data.data
        }
      })
    },

    getOverall() { //获取首页数据统计
      this.$axios.post('/api/home/trade/count').then(res => {
        if(res.data.errorCode === 0) {
          this.overallInf = res.data.data
        }
      })
    },

    getDeals() { //获取最新交易
      this.$axios({
        url: '/api/home/trade/deals',
        method: 'post',
        data: this.page
      }).then(res => {
        if(res.data.errorCode === 0) {
          if(res.data.data.total > this.page.rows) {
            this.dealsList = res.data.data.data.slice(0, this.page.rows)
          }else {
            this.dealsList = res.data.data.data
          }
        }
      })
    },

    getNotice() { //获取首页公告
      this.$axios({
        url: '/api/home/notice',
        method: 'post',
        data: this.page
      }).then(res => {
        if(res.data.errorCode === 0) {
          if(res.data.data.total > this.page.rows) {
            this.noticeList = res.data.data.data.slice(0, this.page.rows)
          }else {
            this.noticeList = res.data.data.data
          }
        }
      })
    },

    getNews() { //获取新闻资讯
      this.$axios({
        url: '/api/home/stock/news',
        method: 'post',
        data: this.page
      }).then(res => {
        if(res.data.errorCode === 0) {
          if(res.data.data.total > this.page.rows) {
            this.newsList = res.data.data.data.slice(0, this.page.rows)
          }else {
            this.newsList = res.data.data.data
          }
        }
      })
    },

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

    upTop(id) { //盒子向上移动
      const timer = setInterval(() => {
        if (document.getElementById(id + "2").offsetTop - document.getElementById(id).scrollTop <= 0){
          document.getElementById(id).scrollTop -= document.getElementById(id + "1").offsetHeight
        }else {
          document.getElementById(id).scrollTop++
        }
      }, 50);
      switch (id) {
        case 'trading':
          this.tradingTimer = timer
          break;
      }
    },
    stopTop(that) { //停止滑中盒子
      switch (that) {
        case 'trading':
          clearInterval(this.tradingTimer)
          break;
      }
    },
    continueTop(that) { //开启滑中盒子
      switch (that) {
        case 'trading':
          this.upTop('trading')
          break;
      }
    },

    openContentDetails(conDetails) { //获取详情
      this.contentDetails = conDetails;
      $('#mask').css({'display':'block','zIndex': '1002'});
      $('#popupCon').css({'display': 'block'}).animate({top: "150px"},100);
    },
    closeContentDetails() {
      this.contentDetails = {};
      $('#mask').css({'display':'none','zIndex': '1000'});
      $('#popupCon').css({'display': 'none'});
    }
  }
}
</script>

<style scoped lang="less">
  .container {
    width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }
  /*轮播图片*/
  .index-header img {
    width: 100%;
    height: 550px;
  }
  /*轮播登录*/
  .index-header .index-login {
    height: 470px;
    width: 318px;
    background-color: rgba(0,0,0,0.6);
    border-radius: 5px;
    color: white;
    position: absolute;
    bottom: 40px;
    right: 0;
  }
  /*未登录*/
  .index-header .index-login h4 {
    font-size: 24px;
    font-weight: normal;
    line-height: 100px;
    text-align: center;
    margin-top: 50px
  }
  .index-header .index-login input {
    background-color: white;
    padding-left: 22px;
    border-radius: 5px;
    width: 260px;
    height: 40px;
    line-height: 40px;
    color: #4c4c4c;
    font-size: 16px;
    border: none;
    display: block;
    margin: 0 auto;
  }
  .index-header .un-login a {
    display: block;
    line-height: 54px;
    color: white;
    font-size: 16px;
  }
  .index-header .index-login .login-btn {
    display: block;
    background-color: #ff4519;
    color: white;
    cursor: pointer;
    width: 260px;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    margin: 0 auto;
    border-radius: 5px;
    text-align: center;
  }
  .index-header .index-login .index-reg {
    text-align: center;
    line-height: 1;
    padding: 38px 0;
  }
  .index-header .index-login .index-reg a {
    display: inline-block;
    padding-bottom: 2px;
    border-bottom: 1px solid #fff;
    line-height: 1;
    padding-right: 0;
  }
  .index-header .index-login .notice {
    background: url('../../public/img/notice-bg.png') no-repeat center center;
    position: absolute;
    z-index: 102;
    bottom: 38px;
    left: -42px;
    height: 78px;
    width: 400px;
  }
  .index-header .index-login .notice p {
    width: 320px;
    line-height: 78px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .index-header .index-login .notice a {
    line-height: 78px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .index-header .index-login .notice a:nth-child(1) {
    padding-left: 86px;
  }
  .index-header .index-login .notice a.paddingRight {
    padding-right: 40px;
  }
  /*已登录*/
  .index-header .login h3 {
    margin-top: 38px;
    text-align: center;
    font-size: 24px;
    line-height: 1;
    font-weight: normal;
  }
  .index-header .login p {
    font-size: 16px;
    width: 260px;
    margin: 0 auto;
  }
  .index-header .login .welcome {
    padding-bottom: 18px;
    border-bottom: 1px solid white;
    text-align: center;
    line-height: 38px;
  }
  .index-header .login .money-title {
    padding-top: 20px;
  }
  .index-header .login .recharge {
    display: inline-block;
    width: 38px;
    height: 20px;
    border-radius: 3px;
    background-color: #ff4519;
    color: white;
    text-align: center;
    line-height: 20px;
    margin-left: 20px;
  }
  .index-header .login .p-money {
    font-size: 30px;
  }
  .index-login ul {
    width: 260px;
    margin: 20px auto;
  }
  .index-login ul li:nth-child(1) {
    float: left;
    width: 108px;
    border-right: 1px solid rgba(255,255,255,0.3);
  }
  .index-login ul li:nth-child(2) {
    width: 134px;
    float: right;
  }
  .index-header .index-login .login-btn {
    display: block;
    background-color: #ff4519;
    color: white;
    cursor: pointer;
    width: 260px;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    margin: 0 auto;
    border-radius: 5px;
    text-align: center;
  }
  .index-header #goToNotice a {
    color: white !important;
  }
  /*未实名*/
  .index-header .login .notice2 {
    background: url('../../public/img/verify-bg.png') no-repeat center center;
    position: absolute;
    z-index: 102;
    bottom: 38px;
    left: -42px;
    height: 78px;
    width: 400px;
  }
  .index-header .login .notice2 p {
    width: 210px;
    padding-left: 34px;
    padding-top: 16px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .index-header .login .notice2 a {
    display: block;
    width: 100px;
    height: 30px;
    line-height: 30px;
    background-color: white;
    text-align: center;
    color: #ff4519;
    border-radius: 5px;
    margin-top: 22px;
    margin-right: 40px;
  }
  /*概览*/
  .overall ul {
    position: absolute;
    z-index: 100;
    width: 1180px;
    height: 120px;
    top: -20px;
    left: 10px;
    color: white;
    /*background: #ffc300;*/
    background: linear-gradient(left, #ffc300,#ff9100);
    /*background: -moz-linear-gradient(left, #ffc300,#ff9100);*/
    /*background: -webkit-linear-gradient(left,#ffc300,#ff9100);*/
    /*background: -o-linear-gradient(left,#ffc300,#ff9100);*/
    text-align: center;
  }
  .overall ul li {
    float: left;
    width: 33.33%;
  }
  .overall ul li i {
    display: inline-block;
    font-size: 60px;
    line-height: 120px;
    padding-right: 10px;
  }
  .overall ul li > div {
    display: inline-block;
  }
  .overall ul li h4 {
    font-size: 30px;
    font-weight: normal;
  }
  .overall ul li p {
    font-size: 16px;
  }
  /*交易动态/公告/资讯*/
  .tradelist, .inflist {
    background-color: #fff;
  }
  .inflist {
    border-top: 1px solid #f2f2f2;
  }
  .tradelist .sec_header {
    background-color: #f7f7f7;
    padding: 120px 0 18px;
  }
  .tradelist .item {
    float: left;
    width: calc((100% / 2) - 1px);
  }
  .tradelist h4, .inflist h4 {
    font-size: 20px;
    color: #4c4c4c;
    padding: 20px 0 20px;
    line-height: 1;
  }
  .tradelist h4 a, .inflist h4 a {
    font-size: 12px;
    margin: 5px 10px 0;
    color: #ccc;
  }
  .tradelist h4:before,
  .inflist h4:before {
    content: " ";
    display: inline-block;
    vertical-align: middle;
    height: 12px;
    width: 2px;
    background-color: #808080;
    margin-right: 10px;
  }
  .trade-scroll {
    height: 305px;
    overflow: hidden;
  }
  .tradelist .item li,  .inflist li {
    line-height: 50px;
    text-align: center;
    font-size: 14px;
    color: #4c4c4c;
  }
  .tradelist .item li:not(:last-child),
  .inflist li:not(:last-child) {
    border-bottom: 1px dashed #f2f2f2;
  }
  .tradelist #trading li span{
    display: block;
    float: left;
    width: calc(100% / 5);
  }
  .tradelist #conNews li p, .inflist li p {
    width: 97%;
    text-align: left;
    padding-left: 3%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
  .tradelist #conNews li p a, .inflist li p a {
    width: 60%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .tradelist .item li a:hover, .tradelist #conNews li p a:hover, .inflist li p a:hover {
    color: #57a3f3;
  }
  .tradelist #conNews li p span, .inflist li p span {
    width: 40%;
    text-align: right;
  }
  /*产品介绍*/
  .product-info {
    height: 320px;
  }
  .product-info .sec_header {
    padding: 32px 0 20px;
  }
  .sec_header {
    width: 100%;
  }
  .sec_header h3 {
    color: #4c4c4c;
    font-size: 24px;
    width: 1200px;
    margin: 0 auto;
    line-height: 24px;
  }
  .sec_header h3:before {
    content: " ";
    display: inline-block;
    vertical-align: middle;
    height: 24px;
    width: 4px;
    background-color: #ff4519;
    margin-right: 10px;
  }
  .sec_header h3 span {
    padding-left: 10px;
    font-size: 16px;
    color: #808080;
    font-weight: normal;
  }
  .product-info li {
    width: 100%;
  }
  .product-info li .left-info {
    width: 268px;
    height: 220px;
    float: left;
    position: relative;
    color: white;
    line-height: 1;
    text-align: center;
  }
  .bg-red .left-info {
    background: url('../../public/img/bg-red.jpg') no-repeat center center;
  }
  .product-info li .left-info h3 {
    font-size: 34px;
    padding: 50px 0 35px;
  }
  .product-info li .left-info h4 {
    font-size: 24px;
    font-weight: normal;
  }
  .product-info li .left-info p {
    font-size: 16px;
    padding-top: 44px;
  }
  .bg-red .left-info:after {
    display: block;
    content: " ";
    width: 0;
    height: 0;
    border-bottom: 20px solid #af3317;
    border-right: 10px solid transparent;
    position: absolute;
    top: 0;
    right: -10px;
    z-index: 100;
  }
  .product-info li .right-info {
    float: right;
    width: 930px;
    height: 200px;
    margin-top: 18px;
    background-color: white;
    border: 1px solid #e6e6e6;
    font-size: 16px;
    line-height: 1;
    color: #4c4c4c;
  }
  .product-info .right-info .part1 {
    width: 310px;
    float: left;
    text-align: center;
  }
  .bg-red .right-info .part1 a {
    border: 1px solid #ff4b21;
    color: #ff4b21;
  }
  .bg-red .right-info .part1 a:hover {
    background: #ff4b21;
    color: #fff;
  }
  .product-info .right-info .part1 a {
    display: block;
    width: 180px;
    height: 40px;
    line-height: 40px;
    margin: 80px auto 0;
    font-size: 16px;
    border-radius: 5px;
  }
  .product-info .right-info .part2 {
    float: left;
    width: 270px;
    margin-top: 18px;
    padding: 0 20px;
    border-left: 1px solid #f2f2f2;
    height: 170px;
  }
  .product-info .right-info .part2 h5 {
    font-size: 16px;
    font-weight: normal;
    border-bottom: 1px solid #f2f2f2;
    padding: 29px 0 40px;
    text-align: center;
  }
  .product-info .right-info .part2 p {
    padding-top: 30px;
    padding-left: 15px;
    text-align: center;
  }
  .product-info .right-info .part2 p span {
    font-size: 30px;
  }
  .product-info .right-info .part3 {
    float: left;
    width: 266px;
    margin: 18px 0;
    padding: 0 20px;
    border-left: 1px solid #f2f2f2;
    height: 170px;
    text-align: center;
  }
  .product-info .right-info .part3 p {
    border-bottom: 1px solid #f2f2f2;
    padding: 15px 0 40px;
  }
  .product-info .right-info .part3 p span {
    font-size: 30px;
    padding-right: 5px;
  }
  .bg-red .right-info .part3 a {
    background-color: #ff4b21;
  }
  .product-info .right-info .part3 a {
    margin: 30px auto 0;
    display: block;
    width: 180px;
    height: 40px;
    color: white;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    border-radius: 5px;
  }
  /*客户端下载*/
  .app-info {
    background: url('../../public/img/appInfo-bg.jpg') no-repeat center center;
    height: 400px;
  }
  .app-info .sec_header h3 {
    color: white;
    padding-top: 20px;
  }
  .app-info .sec_header h3 span {
    color: white;
  }
  .app-info .app-down {
    float: right;
    width: 490px;
    margin-top: 10%;
  }
  .f-left {
    float: left;
  }
  .f-right {
    float: right;
  }
  .app-info .app-down a {
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
  .app-info .app-down a.active {
    background-color: #338fff;
    color: #fff
  }
  .app-info .app-down a + a {
    margin-top: 26px;
  }
  .app-info .app-down a:nth-child(1):before {
    content: "\e90c";
    font-family: icomoon;
    padding-right: 10px;
    font-size: 24px;
  }
  .app-info .app-down a:nth-child(2):before {
    content: "\e90b";
    font-family: icomoon;
    padding-right: 10px;
    font-size: 24px;
  }
  .app-info .app-down img {
    width: 150px;
  }
  .app-info .app-down span {
    display: block;
    width: 150px;
    text-align: center;
    font-size: 18px;
    color: #fff;
    margin-top: 10px;
  }


  /*暂无消息*/
  .thereNo {
    text-align: center;
    line-height: 200px;
    font-size: 16px;
    color: #808080;
  }

  /*朦版*/
  .mask {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: rgba(0,0,0,0.4);
  }
  /*弹出框*/
  .popup {
    display: none;
    position: fixed;
    z-index: 1001;
    left: 50%;
    top: 0;
    width: 500px;
    background-color: #ffffff;
    box-shadow: 0 0 6px 0 #ffd9d0;
    -moz-transition-duration: .4s;
    -webkit-transition-duration: .4s;
    transition-duration: .4s;
    border-radius: 10px;
  }
  #popupCon {
    width: 800px;
    margin-left: -400px;
    max-height: 600px;
    z-index: 1003;
    overflow-y: auto;
    overflow-x: hidden;
  }
  #popupCon .bar-percentage {
    width: 440px;
    height: 6px;
    border-radius: 3px;
    margin: 40px auto 0;
    position: relative;
  }
  #popupCon .bar-percentage .icon-error {
    position: absolute;
    top: -30px;
    right: -160px;
    font-size: 30px;
    /*color: white;*/
    cursor: pointer;
  }
  #popupCon h3 {
    text-align: center;
  }
  #popupCon .details {
    line-height: 22px;
    font-size: 14px;
    padding: 30px;
  }
  #canvas{
    width: 100%!important;
    height: auto!important;
  }
</style>
