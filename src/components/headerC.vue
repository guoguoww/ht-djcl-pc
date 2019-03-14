<template>
    <div>
      <header class="page-header">
        <div class="top-bar group">
          <div class="container">
            <ul class="f-left">
              <li class="service-tel">服务热线：<label id="m_basic_mobile">***-***-****</label></li>
              <li class="qq">
                <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=*********&site=qq&menu=yes">
                  <i class="icon icon-qq"></i>
                </a>
              </li>
            </ul>
            <ul id="page_shared_layout_unlogin" class="top-links f-right">
              <li class="show-logout" v-if="initShow"><router-link to="/register" >注册</router-link></li>
              <li class="show-logout" v-if="initShow"><router-link to="/login" class="active" >登录</router-link></li>

              <li class="show-login" v-if="!initShow">您好！&nbsp;&nbsp;{{userData.nickName}}&nbsp;&nbsp;</li>
              <li class="show-login top-user-wrapper" v-if="!initShow" @mouseover="toggleShowHide">
                <span class="top-username"><router-link id="page_shared_layout_login_name" to="/member"> </router-link><i class="icomoon icon-arrow-drop-down"></i></span>
                <div class="overlay-account" style="display: none;">
                  <div class="group account-group">
                    <span class="f-left">账户余额：<b class="account-val" id="shared_header_mb">{{userData.money}}</b></span>
                    <router-link name="realnameAuth" class="f-right" to="/user/topUp">充值</router-link>
                  </div>
                  <div class="account-links group">
                    <router-link class="a-left" to="/user">个人中心</router-link>
                    <a href="javascript:;" class="a-right js-logout" @click="logout">安全退出</a>
                  </div>
                </div>
              </li>

            </ul>
          </div>
        </div>
        <div class="banner group">
          <div class="container">
            <router-link to="/"><h1 class="site-logo f-left"><img src="../../public/img/logo.png" alt="" height="100%"></h1></router-link>

            <ul class="top-nav clearfix">
              <li class=""><router-link to="/" exact >首页</router-link></li>

              <li class=""><router-link to="/trade/1">A股点买</router-link></li>

              <li class=""><router-link to="/trade/2">点买体验</router-link></li>

              <li class=""><router-link to="/weixin">手机客户端</router-link></li>

              <li class=""><router-link id="headGrzxA" to="/user">个人中心</router-link></li>
              <li>
                <a>
                  <img src="../../public/img/hot.png" id="show-ewm-tip">
                  <span class="hot">Hot</span>
                  <div class="showEwm">
                    <img src="../../public/img/ewm.png">
                  </div>
                </a>

              </li>
            </ul>
          </div>

        </div>
      </header>
    </div>
</template>

<script>
    import $ from "jquery";
    export default {
      name: "headerC",
      data(){
        return {
          initShow: true, //是否登录
          userData: {},
        }
      },
      created() {
        if(!!this.$cookie.get('_auth')) {
          this.initShow = false;
        }else {
          this.initShow = true;
        }
      },
      mounted() {
        if(!this.initShow) {
          this.getUserData()
        }
      },
      methods: {
        toggleShowHide(){//鼠标放上去和移开

          $(".top-user-wrapper").mouseover(function () {
            $(this).addClass("top-user-hovered");
            $(".overlay-account", $(this)).stop().fadeIn(200);
          }).mouseout(function () {
            $(this).removeClass("top-user-hovered");
            $(".overlay-account", $(this)).stop().fadeOut(200);
          });
        },

        getUserData() {
          this.$axios.post('/api/user/query_user_msg').then(res => {
            if (res.data.errorCode === 0) {
              this.userData = res.data.data
            }
          })
        },

        logout() { //退出登录
          if(this.$cookie.get('_auth')){
            this.$cookie.clear() //清除cookie
            this.$router.push('/login') //跳转登录页
          }else{
            this.$router.push('/login')
          }
        },
      },
      computed: {
        router() {
          return this.$route.path;
        }
      },
      watch:{
        router(){ //监听路由改变是否还在登录状态
          if(!!this.$cookie.get('_auth')) {
            this.initShow = false;
          }else {
            this.initShow = true;
          }
          if(!this.initShow) {
            this.getUserData()
          }
        },
      },
    }
</script>

<style scoped>
  a.router-link-active {
    color: #ff4519 !important;
    font-weight: bold;
  }
  li.router-link-active a {
    color: #ff4519;
  }
  .page-header {
    background-color: white;
  }
  .f-left {
    float: left;
  }
  .f-right {
    float: right;
  }
  .a-right {
    text-align: right;
  }
  .show-login {
    color: #C8C8C8;
  }
  /*头部*/
  .top-bar {
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #808080;
  }
  .top-bar li {
    display: inline-block;
  }
  .container {
    width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
    position: relative;
  }
  .group:after, .container:after {
    content: " ";
    display: block;
    height: 0;
    overflow: hidden;
    clear: both;
  }
  .top-bar .qq a i {
    display: block;
    width: 22px;
    height: 22px;
    line-height: 22px;
    background-color: #808080;
    border-radius: 50%;
    vertical-align: middle;
    text-align: center;
    font-size: 16px;
    color: white;
    margin-left: 10px;
  }
  .top-bar .qq a:hover i {
    background-color: #ff4519;
  }
  .top-links {
    position: relative;
  }
  .top-links li {
    float: left;
    display: list-item;
  }
  .top-links .show-logout a {
    height: 20px;
    line-height: 20px;
    width: 54px;
    color: #ff4519;
    border: 1px solid #ff4519;
    text-align: center;
    display: inline-block;
    font-size: 14px;
    border-radius: 5px;
    margin-top: 5px;
  }
  .top-links .show-logout + .show-logout {
    margin-left: 10px;
  }
  .top-links .show-logout a.active {
    color: white !important;
    background-color: #ff4519;
  }
  .top-links .top-user-wrapper {
    position: relative;
  }
  .top-links .show-help {
    margin-left: 20px;
  }
  .top-links .show-help a {
    font-size: 14px;
    color: #808080;
  }
  .top-links .show-help a:hover {
    color: #ff4519;
  }
  .top-links .top-username a {
    color: #ff4519;
  }
  .top-links .top-username i {
    font-size: 12px;
    color: #ff4519;
    padding-left: 2px;
    transition: transform 0.5s ease 0s;
    display: inline-block;
  }
  .top-links .top-user-hovered i {
    -moz-transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    -o-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    transform: rotate(180deg);
    margin-left: 3px;
  }

  .top-links .top-user-hovered .top-username {
    border-top: 1px solid #ffe8e2;
    border-left: 1px solid #ffe8e2;
    border-right: 1px solid #ffe8e2;
    box-shadow: 0 -1px 4px 1px #ffe8e2;
  }

  .top-links .top-user-hovered .top-username:after {
    display: block;
    position: absolute;
    z-index: 120;
    width: 99%;
    height: 10px;
    top: 24px;
    content: " ";
    left: 0;
    background-color: white;
  }

  .overlay-account {
    position: absolute;
    z-index: 100;
    top: 30px;
    right: 0;
    width: 204px;
    height: 80px;
    box-shadow: 0 0 4px 1px #ffe8e2;
    border: 1px solid #ffe8e2;
    padding: 0 30px;
    background-color: #fff;
    box-sizing: content-box;
  }

  .overlay-account .group {
    line-height: 40px;
  }
  .overlay-account .account-val {
    color: #4c4c4c;
  }
  .overlay-account .account-group a {
    color: #ff4519;
  }
  .overlay-account .group + .group {
    border-top: 1px solid #ffe8e2;
  }
  .overlay-account .account-links a {
    font-size: 14px;
    color: #808080;
    width: 49%;
    display: inline-block;
    float: left;
  }
  .overlay-account .account-links a + a {
    border-left: 1px solid #ffe8e2;
  }
  .overlay-account .account-links a:hover {
    color: #ff4519;
  }
  /*跳转部分*/
  .banner {
    height: 80px;
    z-index: 90;
    position: relative;
  }
  h1.site-logo {
    display: block;
    overflow: hidden;
    margin-top: 8px;
    /*background-image: url(../../../static/imgs/logo.png);*/
    width: 160px;
    height: 55px;
  }
  .top-nav {
    line-height: 82px;
    font-size: 20px;
    color: #4c4c4c;
    position: absolute;
    right: 0;
  }
  .top-nav li {
    float: left;
    display: inline-block;
  }
  .top-nav li a {
    color: #4c4c4c;
  }
  .top-nav > li + li {
    margin-left: 50px;
  }
  .top-nav li:nth-last-child(1) {
    position: relative;
  }
  .top-nav li:nth-last-child(1) #show-ewm-tip {
    -webkit-animation: icon-bounce 3s infinite;
    -moz-animation: icon-bounce 3s infinite;
    -o-animation: icon-bounce 3s infinite;
    animation: icon-bounce 3s infinite;
    margin-right: 6px;
    margin-top: 32px;
    display: block;
  }
  .top-nav li:nth-last-child(1) span {
    position: absolute;
    right: 0;
    top: 14px;
    line-height: 12px;
    width: 22px;
    display: block;
    color: white;
    background-color: #ff4519;
    font-size: 10px;
    text-align: center;
    border-radius: 2px;
  }
  .top-nav li a:hover {
    color: #ff4519;
  }
  .top-nav li:nth-last-child(1) .showEwm {
    display: none;
    position: absolute;
    z-index: 100;
    top: 59px;
    right: 0;
    background-color: white;
    box-shadow: 0 -1px 4px 1px #ffe8e2;
    height: 150px;
  }
  .top-nav li:nth-last-child(1) .showEwm img {
    height: 150px;
  }
  /*.top-nav li:nth-last-child(1) a:hover .showEwm {*/
    /*display: block;*/
  /*}*/
  /*动画*/
  @keyframes icon-bounce {
    0%, 18% {
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    3% {
      -moz-transform: rotate(30deg);
      -ms-transform: rotate(30deg);
      -webkit-transform: rotate(30deg);
      transform: rotate(30deg);
    }

    6% {
      -moz-transform: rotate(-30deg);
      -ms-transform: rotate(-30deg);
      -webkit-transform: rotate(-30deg);
      transform: rotate(-30deg);
    }

    9% {
      -moz-transform: rotate(15deg);
      -ms-transform: rotate(15deg);
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }

    12% {
      -moz-transform: rotate(-15deg);
      -ms-transform: rotate(-15deg);
      -webkit-transform: rotate(-15deg);
      transform: rotate(-15deg);
    }

    14% {
      -moz-transform: rotate(15deg);
      -ms-transform: rotate(15deg);
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }

    16% {
      -moz-transform: rotate(-15deg);
      -ms-transform: rotate(-15deg);
      -webkit-transform: rotate(-15deg);
      transform: rotate(-15deg);
    }
  }
  @-webkit-keyframes icon-bounce {
    0%, 18% {
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    3% {
      -moz-transform: rotate(30deg);
      -ms-transform: rotate(30deg);
      -webkit-transform: rotate(30deg);
      transform: rotate(30deg);
    }

    6% {
      -moz-transform: rotate(-30deg);
      -ms-transform: rotate(-30deg);
      -webkit-transform: rotate(-30deg);
      transform: rotate(-30deg);
    }

    9% {
      -moz-transform: rotate(15deg);
      -ms-transform: rotate(15deg);
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }

    12% {
      -moz-transform: rotate(-15deg);
      -ms-transform: rotate(-15deg);
      -webkit-transform: rotate(-15deg);
      transform: rotate(-15deg);
    }

    14% {
      -moz-transform: rotate(15deg);
      -ms-transform: rotate(15deg);
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }

    16% {
      -moz-transform: rotate(-15deg);
      -ms-transform: rotate(-15deg);
      -webkit-transform: rotate(-15deg);
      transform: rotate(-15deg);
    }
  }
  @-moz-keyframes icon-bounce {
    0%, 18% {
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    3% {
      -moz-transform: rotate(30deg);
      -ms-transform: rotate(30deg);
      -webkit-transform: rotate(30deg);
      transform: rotate(30deg);
    }

    6% {
      -moz-transform: rotate(-30deg);
      -ms-transform: rotate(-30deg);
      -webkit-transform: rotate(-30deg);
      transform: rotate(-30deg);
    }

    9% {
      -moz-transform: rotate(15deg);
      -ms-transform: rotate(15deg);
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }

    12% {
      -moz-transform: rotate(-15deg);
      -ms-transform: rotate(-15deg);
      -webkit-transform: rotate(-15deg);
      transform: rotate(-15deg);
    }

    14% {
      -moz-transform: rotate(15deg);
      -ms-transform: rotate(15deg);
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }

    16% {
      -moz-transform: rotate(-15deg);
      -ms-transform: rotate(-15deg);
      -webkit-transform: rotate(-15deg);
      transform: rotate(-15deg);
    }
  }
  @-o-keyframes icon-bounce {
    0%, 18% {
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    3% {
      -moz-transform: rotate(30deg);
      -ms-transform: rotate(30deg);
      -webkit-transform: rotate(30deg);
      transform: rotate(30deg);
    }

    6% {
      -moz-transform: rotate(-30deg);
      -ms-transform: rotate(-30deg);
      -webkit-transform: rotate(-30deg);
      transform: rotate(-30deg);
    }

    9% {
      -moz-transform: rotate(15deg);
      -ms-transform: rotate(15deg);
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }

    12% {
      -moz-transform: rotate(-15deg);
      -ms-transform: rotate(-15deg);
      -webkit-transform: rotate(-15deg);
      transform: rotate(-15deg);
    }

    14% {
      -moz-transform: rotate(15deg);
      -ms-transform: rotate(15deg);
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }

    16% {
      -moz-transform: rotate(-15deg);
      -ms-transform: rotate(-15deg);
      -webkit-transform: rotate(-15deg);
      transform: rotate(-15deg);
    }
  }
</style>
