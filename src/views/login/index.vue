<template>
  <div class="">
    <section class="section section-form page_auth" id="page_auth_reg">
        <div class="container">
            <div class="section-border f-right" >
                <h2>和泰点金策略登录</h2>
                <div class="form">
                    <div class="field-wrapper">
                        <i class="icomoon icon-phone2"></i>
                        <input type="text" class="text" placeholder="请输入注册手机号/用户名" name="phone"  v-model="user.mobile" @input="handleInputEvent(user,'login')">
                    </div>
                    <p class="name-err1 hide"><i class="err-warning">!</i>请输入注册手机号/用户名</p>
                    <div class="field-wrapper">
                        <i class="icomoon icon-password"></i>
                        <input type="password" class="text" placeholder="请输入登录密码" name="pwd" v-model="user.password" @input="handleInputEvent(user,'login')">
                    </div>
                    <p class="psw-err1 hide"><i class="err-warning">!</i>请输入登录密码</p>
                    <div class="link-wrapper">
                        <a id="forget-psw-btn" @click="showForget=true">忘记密码</a>
                    </div>
                </div>
                <div class="quick-link-wrapper">
                    <p>还没账号? 马上<router-link to="/register">注册</router-link></p>
                </div>
                <a class="confirm-btn " id="login-btn" :class="loginDisabled?'disabled':''" @click="login">登录</a>
            </div>
        </div>
    </section>
    <div class="forget" v-if="showForget">
        <div class="mask"></div>
        <div class="popup" id="popup-forgetPsw" style="display: block; top: 298px;">
            <div class="bar-percentage">
                <p>忘记密码</p>
                <i class="icomoon icon-error" id="close-popup-forgetPsw" @click="showForget=false"></i>
            </div>
            <div></div>
            <form id="forget-form-step1" class="">
                <div>
                    <input type="text" class="text" placeholder="请输入11位手机号" name="phone"  v-model="forget.mobile" @input="handleInputEvent(forget,'forget');isDisabled()" >
                </div>
                <p class="name-err1 hide"><i class="err-warning">!</i>请输入正确的手机号</p>
                <div>
                    <input type="password" class="text" placeholder="请输入新密码" name="password"  v-model="forget.tradePassword" @input="handleInputEvent(forget,'forget')">
                </div>
                <div class="clearfix">
                    <input type="text" class="input-short1" placeholder="请输入验证码" name="verifyCode" v-model="forget.validCode" @input="handleInputEvent(forget,'forget')">
                    <input :value="btnText" class="input-short2 " id="get-Psw" :class="smsDisabled?'disabled':''" type="button" @click="smsCode">
                </div>
                <p class="psw-err1 hide"><i class="err-warning">!</i>请输入正确的验证码</p>
                
                <a class="confirm-btn  next-btn1" :class="forgetDisabled?'disabled':''" @click="resetpPassword">确认修改</a>
            </form>
            <!-- <form id="forget-form-step2" class="hide" >
                <div>
                    <input type="password" class="text" placeholder="密码为6-16位数字和字母组成" name="password" id="password">
                </div>
                <p class="password-err hide"><i class="err-warning">!</i>密码必须为6-16位数字和字母组成</p>
                <div>

                    
                    <input type="password" class="text" placeholder="请再次输入密码" name="pswAgain" id="pswAgain">
                </div>
                <p class="pswAgain-err hide"><i class="err-warning">!</i>两次输入的密码不正确</p>
                <div class="btn-div clearfix" id="" style="display:block;margin-top:30px;">
                    <a class="preStep" id="forget-pre-step1">上一步</a>
                    <a class="nextStep disabled next-btn2" id="forget-next-btn2">下一步</a>
                </div>
            </form> -->
            <form id="forget-form-step3" class="hide finish" >
                <i class="icomoon icon-finish"></i>
                <p>您已成功修改登录密码</p>
                <div class="btn-div" id="" style="display:block;margin-top:30px;">
                <a class="confirm-btn  next-btn1" >完成</a>
                </div>
            </form>
        </div>
    </div>
    
  </div>
</template>

<script type="">
export default {
  name:"",
  data() {
    return {
        user:{
            mobile:'',
            password:'',
            terminal:''
        },
        repwd:'',
        loginDisabled:true,//登录按钮禁用
        forgetDisabled:true,//重置密码禁用
        smsTimer:false,//获取邀请码等待
        smsDisabled:true,//短信邀请码禁用
        btnText:'获取验证码',
        showForget:false,//显示忘记密码
        forget:{
            mobile:'',
            tradePassword:'',
            validCode:''
        }
        
    }
  },
  created () {
      this.getTerminal()
    //   console.log(this.$route.path);
      
  },
  mounted () {
    // 
  },
  computed: {
     path(){
         return this.$route.path
     } 
  },
  methods: {    
      getTerminal(){
        var u = navigator.userAgent;
        if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
            //安卓手机
            this.user.terminal = 1;
        } else if (u.indexOf("iPhone") > -1) {
            //苹果手机
            this.user.terminal = 2;
        } else {
            //wap
            this.user.terminal = 3;
        }
      },
      login(){
          if (this.loginDisabled) {
              return 
          }
          this.$axios.post('api/index/login',this.user).then(res=>{
              console.log();
              if (res.data.data.loginError) {
                this.$Message.warning(res.data.data.loginError);                  
                return
              }
              if (!res.data.data.errorMsg) {
                  this.$cookie.set('_auth',res.data.data.cookie)
                  this.$router.push(this.$route.query.redirect||'/')
              }else {
                this.$Message.warning(res.data.data.errorMsg.error);
              }
          })
      },
      isDisabled(){          
          if (this.smsTimer) {
              this.smsDisabled=true
              return
          }
          console.log(this.forget.mobile.length);
          
          if (this.forget.mobile.length==11) {
              this.smsDisabled=false
          }else{
              this.smsDisabled=true
          }

      },
        //判断input是否为空
      handleInputEvent(obj,type){
        let flag=false
        for (const key in obj) {
            if (!obj[key]) {
                // console.log(key + ":" + this.reg[key]);
                flag=true
            }
        }
        if (type=='login') {
            this.loginDisabled=flag        
        }else{
            this.forgetDisabled=flag
        }
      },
      // 短信邀请码
      smsCode(){
          if (this.smsDisabled) {
              return
          }
          this.$axios.post(`api/sms/validate_code?mobile=${this.forget.mobile}&type=${'mtpwd'}`).then(res=>{
              if (!res.data.errorCode) {
                   this.$Message.success('发送成功');
                  this.countDown()
              }
          })
          
      },
      //倒计时
        countDown() {
            let [text,num]=[this.btnText,60]
            this.smsTimer = true;
            this.smsDisabled=true
            this.btnText = `${num--}秒`;
            var timer = setInterval(() => {
                this.btnText = `${num--}秒`;
                if (num < 0) {
                    this.btnText = text;
                    this.smsTimer = false;
                    if (this.forget.mobile.length==11) {
                        this.smsDisabled=false
                    }else{
                        this.smsDisabled=true
                    }
                    clearInterval(timer);
                }
            }, 1000);
        },
        //重置密码
        resetpPassword(){
            if (this.forgetDisabled) {
                return 
            }
            this.$axios.post('api/index/modify_password',this.forget).then(res=>{
                if (!res.data.errorCode) {
                    this.showForget=false;
                }
            })
        }
  }
}
</script>

<style scoped lang="less">
#popup-forgetPsw {
    width: 500px;
    margin-left: -250px;
    .finish {
        margin-top: 40px;
        i {
            display: block;
            font-size: 70px;
            text-align: center;
            color: #00d47d;
        }
         p {
            font-size: 16px;
            color: #4c4c4c;
            text-align: center;
            line-height: 48px;
            margin-left: 0;
        }
    }
    form {
        margin-top: 10px;
        input {
            display: block;
            border: 1px solid #e6e6e6;
            font-size: 16px;
            height: 40px;
            line-height: 40px;
            padding-left: 10px;
            border-radius: 5px;
            color: #808080;
            margin-top: 30px;
            &:focus {
                box-shadow: 0 0 6px 0 #ff4519;
                outline: none;
                border: 1px solid #ff4519;
            }
        }
        .text {
            width: calc(100% - 152px);
            margin-left: 70px;
            background-color: #ffffff;
        }
        .input-short1 {
            width: 210px;
            float: left;
            margin-left: 70px;
        }
        .input-short2 {
            float: right;
            width: 110px;
            text-align: center;
            background-color: #ff6a47;
            color: white;
            padding: 0;
            margin-right: 70px;
            margin-bottom: 30px;
            cursor: pointer;
        }
         
    }
     .bar-percentage {
         background: linear-gradient(left, rgba(255, 140, 0, 0.8), rgba(255, 69, 25, 0.8));
        border-radius: 5px;
        margin: 0 auto;
        position: relative;
        text-align: center;
        line-height: 50px;
        font-size: 20px;
        color: #fff;
        .icon-error {
            position: absolute;
            top: 0px;
            right: -40px;
            font-size: 30px;
            color: white;
            cursor: pointer;
        }
    }
    .confirm-btn{
        line-height: 50px;
        font-size: 18px;
        display: block;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        color: white;
        text-align: center;
        margin-top: 14px;
        background: #ff4519;
        cursor: pointer;
    }
}
.mask {
    // display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: rgba(0,0,0,.4);
}
.popup {
    display: block;
    position: fixed;
    z-index: 1001;
    left: 50%;
    top: 0;
    width: 500px;
    background-color: #fff;
    box-shadow: 0 0 6px 0 #ffd9d0;
    transition-duration: .4s;
    border-radius: 10px;
}
#popupCon{
    width: 800px;
    margin-left: -400px;
    max-height: 600px;
    z-index: 1003;
    overflow-y: auto;
    overflow-x: hidden;
    .bar-percentage{
        width: 440px;
        height: 6px;
        border-radius: 3px;
        margin: 40px auto 0;
        position: relative;
        .icon-error{
            position: absolute;
            top: -30px;
            right: -160px;
            font-size: 30px;
            cursor: pointer;
        }
    }
    .details{
        line-height: 22px;
        font-size: 14px;
        padding: 30px;
    }
}
.f-right {
    float: right;
}
.hide {
    display: none;
}
.container {
    width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
    position: relative;
}
a {
    color: #5cb1ff;
    cursor: pointer;
}
a:hover {
    color: #ff4519;
}
.page_auth .err-warning, #popup-forgetPsw .err-warning, #popup-getVefifyCode .err-warning {
    width: 16px;
    height: 16px;
    line-height: 16px;
    display: inline-block;
    text-align: center;
    border-radius: 50%;
    background-color: #ff4519;
    color: white;
    margin-right: 2px;
}
.page_auth {
    background: url(../../../public/img/login-bg.jpg) no-repeat center top;
    background-size: cover;
    min-height: 608px;
    width: 100%;
    .link-wrapper {
        text-align: right;
        line-height: 34px;
    }
    .quick-link-wrapper {
        padding-top: 24px;
        text-align: center;
    }
    .section-border {
        width: 400px;
        background-color: white;
        margin-top: 84px;
        border: 10px solid #fffbfa;
        border-radius: 10px;
        h2 {
            line-height: 72px;
            color: white;
            text-align: center;
            font-size: 24px;
            font-weight: normal;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            background: -webkit-linear-gradient(left, rgba(255, 140, 0, 0.8), rgba(255, 69, 25, 0.8));
        }
    }
     .form {
        margin: 0 30px;
        p {
            margin-top: 5px;
            color: #ff4519;
        }
    }
     .field-wrapper {
        border-bottom: 1px solid #f2f2f2;
        margin-top: 24px;
        font-size: 16px;
        color: #808080;
        line-height: 55px;
        i {
            padding-right: 10px;
            color: #c7c7c7;
        }
        input {
            border: none;
            width: 250px;
            font-size: 16px;
            outline: 0;
        }
    }
    .confirm-btn {
        display: block;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        color: white;
        line-height: 70px;
        text-align: center;
        margin-top: 14px;
        font-size: 20px;
        background: -webkit-linear-gradient(left, rgba(255, 69, 25, 0.8), rgba(255, 140, 0, 0.8));
        cursor: pointer;
    }
}
#page_auth_reg {
    .input-short1 {
        width: 180px !important;
    }
    .input-short2 {
        width: 100px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        color: white;
        background-color: #ff4519;
        border-radius: 10px;
        margin-top: 5px;
        text-align: center;
        cursor: pointer;
    }
    .reg-checkbox label {
        top: 14px;
        left: 80px;
    }
    .finish {
        text-align: center;
        margin-top: 48px;
        font-size: 16px;
         i {
            color: #00d47d;
            font-size: 70px;
            display: block;
        }
         .finish-info {
            line-height: 56px;
            color: #4c4c4c;
        }
    }
}
.disabled {
    background: #c7c7c7 !important;
    color: #fff !important;
}
.protocol_row-agree {
    position: relative;
    line-height: 46px;
    padding-left: 10px;
    font-size: 14px;
    color: #808080;
    input[type='checkbox'] {
        width: 16px;
        height: 16px;
        opacity: 0;
    }
    

    label {
        position: absolute;
        left: 4px;
        top: 14px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #c7c7c7;
    }
    input:checked + label {
        background-color: #ff4519;
        &:after {
            position: absolute;
            content: " ";
            width: 3px;
            height: 6px;
            top: 4px;
            left: 6px;
            border: 2px solid #fff;
            border-top: none;
            border-left: none;
            transform: rotate(45deg);
        }
    }
}
input.text {
    border: 1px solid #eee;
    background-color: #ffffff;
}

</style>
