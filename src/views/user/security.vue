<template>
  <div>
    <section id="page_member_security" class="col-main">
      <h3 class="page_member-title">账户安全</h3>
      <div class="level-div">
        <h4>安全等级</h4>
        <div class="safe-level-line clearfix">
          <div class="line">
            <div class="choose-line"></div>
          </div>
          <p class="level" id="safe-level">{{userData.authStatus === 2? '高' : '中'}}</p>
        </div>
        <div>
          <i class="icomoon icon-phone-info active"></i>
          <i class="icomoon icon-psw-info active"></i>
          <i class="icomoon icon-real-info" :class="userData.authStatus === 2? 'active' : ''"></i>
        </div>
      </div>
      <div class="info-div">
        <h4>个人信息</h4>
        <p><label>用户昵称</label><span id="userName">{{userData.nickName}}</span><button class="change-psw" @click="openModify('popup-nickName')">修改</button></p>
        <p><label>绑定手机</label><span id="手机号">{{userData.mobile}}</span></p>
      </div>
      <div class="info-div">
        <h4>账户安全</h4>
        <p><label>实名认证</label><span id="real_name">{{(userData.authStatus === 0 || userData.authStatus === 3)? '未认证': (userData.authStatus === 1? '审核中':  userData.chnName)}}</span> <button v-if="(userData.authStatus === 0 || userData.authStatus === 3)" class="verify" @click="openModify('popup-realname-auth')">马上实名</button></p>
        <p><label>登录密码</label><span>登录网址时需要输入的密码</span><button class="change-psw" @click="openModify('popup-changePwd')">修改</button></p>
      </div>
    </section>
    <!--朦版-->
    <div class="mask" id="mask"></div>
    <!--修改昵称  -->
    <div class="popup popup-big" id="popup-nickName">
          <div class="form">
              <div class="inbox">
                  <label>新昵称</label>
                  <input type="text" class="text" placeholder="请输入新昵称" id="nickName" v-model="newNickName.nickName">
              </div>
          </div>
          <div class="btn-div clearfix" style="display:block;margin-top:30px;">
              <a class="preStep" @click="closeNickName">取消</a>
              <a class="nextStep next-btn2" @click="submitNickName">确定</a>
          </div>
      </div>
    <!--实名认证-->
    <div class="popup popup-big" id="popup-realname-auth">
      <div class="tip">
        <p>温馨提示：为保障您的账户安全，请先进行实名认证，只能认证一次，确认后不再修改，如有疑问请联系  <span>***-***-****</span>。</p>
      </div>
      <div class="form">
        <div class="inbox">
          <label>真实姓名</label>
          <input type="text" class="text" placeholder="请输入您的真实姓名" id="realname" v-model="realNameData.chnName">
        </div>
        <div class="inbox">
          <label>身份证号</label>
          <input type="text" class="text" placeholder="请输入正确的身份证号" id="cardID" v-model="realNameData.idCard">
        </div>
      </div>
      <div class="btn-div clearfix" style="display:block;margin-top:30px;">
        <a class="preStep" @click="colseRealName">取消认证</a>
        <a class="nextStep next-btn2" @click="submitRealNameData">确定认证</a>
      </div>
    </div>
    <!--修改密码-->
    <div class="popup popup-big" id="popup-changePwd">
      <div class="form">
        <div class="inbox">
          <label>原密码</label>
          <input type="password" class="text" placeholder="请输入原密码" v-model="changePwdData.formerPwd">
        </div>
        <div class="inbox">
          <label>新密码</label>
          <input type="password" class="text" placeholder="请输入新密码" v-model="changePwdData.tradePassword">
        </div>
      </div>
      <div class="btn-div clearfix" style="display:block;margin-top:30px;">
        <a class="preStep" @click="closeChangePwd">取消</a>
        <a class="nextStep next-btn2" @click="submitChangePwdData">提交</a>
      </div>
    </div>
  </div>

</template>

<script>
  import $ from "jquery";
  export default {
    name: "security",
    data() {
      return {
        userData: {},
        errModal: { //错误模态框
          errorCode: '',
        },
        newNickName: {
          nickName: '', //新昵称
        },
        realNameData: { //实名认证上传信息
          chnName: '', //姓名
          idCard: '', //身份证号
        },
        changePwdData: {
          formerPwd: '', //旧密码
          tradePassword: '', //新密码
        }
      }
    },
    mounted() {
      this.getUserData();
    },
    methods: {
      getUserData() { //获取父路由的个人信息
        this.$parent.userData.then((userData) => {
          this.userData = userData;
          if(this.userData.authStatus === 2) { //实名认证进度长度
            $('.choose-line').css('width', '100%')
          }else {
            $('.choose-line').css('width', '66.66%')
          }
        })
      },

      openModify(type) { //打开模态框
        $('#mask').css({'display':'block','zIndex': '1002'});
        $('#' + type).css({'display': 'block'}).animate({top: "317px"},100);
      },
      submitNickName() { //上传实名认证信息
        if(!this.newNickName.nickName) {
          this.$Message.warning('请输入新昵称');
          return
        }
        this.$axios({
          url: '/api/user/update/nickname',
          method: 'post',
          data: this.newNickName
        }).then(res => {
          if(res.data.errorCode === 0) {
            this.$Notice.success({
              title: '修改成功',
            });
            this.closeNickName()
            this.$parent.getUserData();
            this.getUserData();
          }
        })
      },
      closeNickName() { //关闭/完成修改昵称
        $('#mask').css({'display':'none','zIndex': '1000'});
        $('#popup-nickName').css({'display': 'none'});
        this.newNickName.nickName = '';
      },
      //实名认证
      submitRealNameData() { //上传实名认证信息
        if(!this.realNameData.chnName) {
          this.$Message.warning('请输入正确姓名');
          return
        }
        if(!this.realNameData.idCard || !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.realNameData.idCard)) {
          this.$Message.warning('请输入正确身份证号');
          return
        }
        this.$axios({
          url: '/api/user/certification',
          method: 'post',
          data: this.realNameData
        }).then(res => {
          if(res.data.errorCode === 20) {
            this.$Notice.success({
              title: '提交成功 请耐心等待审核结果',
            });
            this.colseRealName();
            this.$parent.getUserData();
            this.getUserData();
          } else if(res.data.errorCode === 0) {
            this.$Notice.success({
              title: '审核成功',
            });
            this.colseRealName();
            this.$parent.getUserData();
            this.getUserData();
          }
        })
      },
      colseRealName() { //关闭实名认证模态框
        $('#mask').css({'display':'none','zIndex': '1000'});
        $('#popup-realname-auth').css({'display': 'none'});
        this.realNameData.chnName = '';
        this.realNameData.idCard = '';
      },
      //修改密码
      submitChangePwdData() { //上传修改密码信息
        if(!this.changePwdData.formerPwd) {
          this.$Message.warning('请输入旧密码');
          return
        }
        if(!this.changePwdData.tradePassword) {
          this.$Message.warning('请输入新密码');
          return
        }
        this.$axios({
          url: '/api/user/update/password',
          method: 'post',
          data: this.changePwdData
        }).then(res => {
          if(res.data.errorCode === 0) {
            this.$Notice.success({
              title: '修改成功 请重新登陆',
            });
            this.$router.push('/login');
          }
        })
      },
      closeChangePwd() { //关闭修改密码
        $('#mask').css({'display':'none','zIndex': '1000'});
        $('#popup-changePwd').css({'display': 'none'});
        this.changePwdData.formerPwd = '';
        this.changePwdData.tradePassword = '';
      },
    },
  }
</script>

<style scoped>
  #page_member_security {
    background-color: white;
    color: #4c4c4c;
    height: 634px;
  }
  /*标题*/
  .page_member-title {
    line-height: 58px;
    font-size: 18px;
    font-weight: normal;
    padding-left: 40px;
    border-bottom: 1px solid #e6e6e6;
  }
  /*安全等级*/
  #page_member_security > div {
    margin: 0 40px;
  }
  #page_member_security > div + div {
    border-top: 1px solid #e6e6e6;
  }
  #page_member_security h4 {
    font-weight: normal;
    font-size: 16px;
    margin: 30px 0 14px;
  }
  #page_member_security .level-div > div {
    margin-left: 20px;
  }
  .safe-level-line {
    width: 382px;
  }
  .safe-level-line .line {
    width: 332px;
    margin: 16px 0 18px;
    height: 6px;
    background-color: #ffccc2;
    border-radius: 3px;
    float: left;
  }
  .safe-level-line .choose-line {
    width: 66.66%;
    box-shadow: 0 0 5px 0 #ff4519;
    background-color: #ff4519;
    height: 6px;
    border-radius: 3px;
  }
  .safe-level-line .level {
    float: right;
    color: #ff4519;
    font-size: 16px;
    vertical-align: middle;
    margin-top: 6px;
  }
  #page_member_security .level-div > div {
    margin-left: 20px;
  }
  #page_member_security .level-div i.active {
    color: #ff4519;
  }
  #page_member_security .level-div i {
    display: inline-block;
    font-size: 32px;
    color: #c7c7c7;
    margin-right: 14px;
    padding-bottom: 24px;
  }
  /*个人信息*/
  #page_member_security .info-div {
    padding-bottom: 20px;
  }
  #page_member_security .info-div p {
    line-height: 40px;
    padding-left: 20px;
    padding-right: 34px;
    font-size: 16px;
  }
  #page_member_security .info-div p label {
    width: 120px;
    display: inline-block;
  }
  #page_member_security .info-div p span {
    color: #808080;
  }
  #page_member_security .info-div p .verify {
    background-color: #ff4519;
    color: white;
  }
  #page_member_security .info-div p button {
    float: right;
    width: 96px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    display: block;
    border: 1px solid #ff4519;
    border-radius: 3px;
    margin-top: 3px;
    outline: 0;
    background: #fff;
    cursor: pointer;
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
  .popup input.text:focus{
    box-shadow: 0 0 6px 0 #ff4519;
    outline: none;
    border: 1px solid #ff4519 !important;
  }
  .popup .btn-div a {
    display: block;
    width: 50%;
    font-size: 16px;
    float: left;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
  }
  input.text {
    background-color: #ffffff;
  }
  .page_auth .form p{
    margin-top: 5px;
    color: #ff4519;
  }
  .popup .btn-div a.nextStep {
    background-color: #ff4519;
    color: white;
    border-bottom-right-radius: 10px;
  }
  .popup .btn-div a.preStep {
    background-color: #e6e6e6;
    color: #808080;
    border-bottom-left-radius: 10px;
  }
  /*实名认证   修改密码*/
  .popup-big {
    width: 500px;
    margin-left: -250px;
    min-width: 500px;
    z-index: 1004;
  }
  #popup-realname-auth .tip {
    width: 438px;
    height: 60px;
    border: 1px solid #ff4519;
    background-color: #fff0ec;
    color: #ff7959;
    line-height: 2;
    padding: 0 8px;
    border-radius: 4px;
    text-align: justify;
    margin: 28px auto;
  }
  #popup-realname-auth .tip span {
    color: #5cb1ff;
  }
  #popup-nickName .form,
  #popup-realname-auth .form,
  #popup-changePwd .form{
    width: 420px;
    margin: 10px auto 0;
    font-size: 16px;
    color: #808080;
  }
  #popup-nickName .form .inbox,
  #popup-realname-auth .form .inbox,
  #popup-changePwd .form .inbox {
    height: 40px;
    line-height: 40px;
    margin-top: 20px;
  }
  #popup-nickName .form input,
  #popup-realname-auth .form input,
  #popup-changePwd .form input{
    width: 310px;
    border: 1px solid #e6e6e6;
    padding-left: 16px;
    margin-left: 20px;
    height: 40px;
    border-radius: 5px;
    font-size: 16px;
  }
  /*按钮*/
  .popup .btn-div a.preStep {
    background-color: #e6e6e6;
    color: #808080;
    border-bottom-left-radius: 10px;
  }
  .popup .btn-div a.nextStep {
    background-color: #ff4519;
    color: white;
    border-bottom-right-radius: 10px;
  }
</style>
