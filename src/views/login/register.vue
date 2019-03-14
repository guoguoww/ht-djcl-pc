<template>
  <div class="">
    <section class="section section-form page_auth" id="page_auth_reg">
        <div class="container">
            <div class="section-border f-right" v-if="path=='/register'">
                <h2>和泰点金策略注册</h2>
                <form id="reg-form-step1" class="">
                    <div class="form">
                        <div class="field-wrapper">
                            <i class="icomoon icon-phone2"></i>
                            <input type="text" class="text" placeholder="请输入11位手机号" name="phone" v-model="reg.mobile" @input="handleInputEvent">
                        </div>
                        <p class="name-err1 hide"><i class="err-warning">!</i>请输入正确的手机号</p>
                        <div class="field-wrapper">
                            <i class="icomoon icon-password"></i>
                            <input type="text" class="text input-short1" placeholder="请输入短信验证码" name="verifyCode" v-model="reg.validCode" @input="handleInputEvent">
                            <input type="button" class="input-short2  get-Psw" :value="regBtnText" name="get-Psw" @click="smsCode" :class="regSmsDisabled?'disabled':''">
                        </div>
                        <p class="psw-err1 hide"><i class="err-warning">!</i>请输入登录密码</p>
                        <div class="field-wrapper">
                            <i class="icomoon icon-password"></i>
                            <input type="password" class="text" placeholder="密码为6-16位数字和字母组成" name="password" v-model="reg.tradePassword" @input="handleInputEvent">
                        </div>
                        <div class="field-wrapper">
                            <i class="icomoon icon-password"></i>
                            <input type="password" class="text" placeholder="请再次输入密码" name="pswAgain" v-model="repwd" >
                        </div>
                        <p class="pswAgain-err hide"><i class="err-warning">!</i>两次输入的密码不一致</p>
                        <div class="field-wrapper">
                            <i class="icomoon icomoon icon-real-info"></i>
                            <input type="text" class="text" placeholder="请输入邀请码(必填)" name="phone" v-model="reg.inviteCode" @input="handleInputEvent">
                        </div>
                    </div>
    
                    <div style="text-align:center;margin-top:20px;">
                        <p class="protocol_row-agree reg-checkbox"><input type="checkbox" id="agree_pro" checked="" name="agree_pro" v-model="xy"><label for="agree_pro"></label>我已阅读并同意<a id="reg_agree" @click="showNotice=true">《用户服务协议》</a></p>
                        <p>已有账号? 直接<router-link to="/login">登录</router-link></p>
                    </div>
                    <a class="confirm-btn  next-btn1" :class="regDisabled?'disabled':''" id="reg-next-btn1" @click="register">点击注册</a>
                </form>
            
                <!-- <form id="reg-form-step2" class="">
                    <div class="form">
                        <div class="field-wrapper">
                            <i class="icomoon icon-phone2"></i>
                            <input type="text" class="text" placeholder="请设置您的用户名" name="userName" id="userName">
                        </div>
                        <p class="userName-err hide"><i class="err-warning">!</i>请输入您的用户名</p>
                        <div class="field-wrapper">
                            <i class="icomoon icon-password"></i>
                            <input type="password" class="text" placeholder="密码为6-16位数字和字母组成" name="password" id="password">
                        </div>
                        <p class="password-err hide"><i class="err-warning">!</i>密码必须为6-16位数字和字母组成</p>
                        <div class="field-wrapper">
                            <i class="icomoon icon-password"></i>
                            <input type="password" class="text" placeholder="请再次输入密码" name="pswAgain" id="pswAgain">
                        </div>
                        <p class="pswAgain-err hide"><i class="err-warning">!</i>两次输入的密码不一致</p>
                    </div> 
                    <a class="confirm-btn disabled next-btn2" id="reg-next-btn2">下一步</a>
                </form> -->

                <form id="reg-form-step3" class="finish hide">
                    <i class="icomoon icon-finish"></i>
                    <p class="finish-info">您已成功注册和泰点金策略</p>
                    
                    <a class="confirm-btn" href="/user/login">完成</a>
                </form>
            </div>
            <div class="section-border f-right" v-else>
                <h2>牛策略登录</h2>
                <div class="form">
                    <div class="field-wrapper">
                        <i class="icomoon icon-phone2"></i>
                        <input type="text" class="text" placeholder="请输入注册手机号/用户名" name="phone"  >
                    </div>
                    <p class="name-err1 hide"><i class="err-warning">!</i>请输入注册手机号/用户名</p>
                    <div class="field-wrapper">
                        <i class="icomoon icon-password"></i>
                        <input type="password" class="text" placeholder="请输入登录密码" name="pwd" >
                    </div>
                    <p class="psw-err1 hide"><i class="err-warning">!</i>请输入登录密码</p>
                    <div class="link-wrapper">
                        <a id="forget-psw-btn">忘记密码</a>
                    </div>
                </div>
                <div class="quick-link-wrapper">
                    <p>还没账号? 马上<router-link to="/register">注册</router-link></p>
                </div>
                <a class="confirm-btn disabled" id="login-btn">登录</a>
            </div>
        </div>
    </section>
    <div class="Notice" v-if="showNotice">
        <div class="mask" ></div>
        <div id="popupCon" class="popup" style="top: 150px;">
            <div class="bar-percentage">
                <i id="close-popupCon" class="icomoon icon-error" @click="showNotice=false"></i>
            </div> 
            <div class="details">
            </div>
        </div>
    </div>
    
  </div>
</template>

<script type="">
export default {
  name:"",
  data() {
    return {
        reg:{
            mobile:'',
            tradePassword:'',
            validCode:'',
            inviteCode:'',
            terminal:''
        },
        repwd:'',
        regDisabled:true,//注册按钮禁用
        regSmsDisabled:false,//短信邀请码禁用
        regBtnText:'获取验证码',
        showNotice:false,
        xy:true
    }
  },
  created () {
      this.getTerminal()
    //   console.log(this.$route.path);
      
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
            this.reg.terminal = 1;
        } else if (u.indexOf("iPhone") > -1) {
            //苹果手机
            this.reg.terminal = 2;
        } else {
            //wap
            this.reg.terminal = 3;
        }
      },
      register(){
          if (this.regDisabled) {
              return
          }
          if (!this.xy) {
            this.$Message.error('勾选阅读协议后注册!');
            return
        }
          if (this.repwd!=this.reg.tradePassword) {
                   this.$Message.error('两次密码输入不一致');

              return
          }
          this.$axios.post('api/index/reg',this.reg).then(res=>{              
              if (res.data.data.cookie) {
                this.$Message.success('注册成功');
                this.$router.push('/login');
              }
          })
      },
      // 短信邀请码
      smsCode(){
          if (this.regSmsDisabled) {
              return
          }
          if (this.reg.mobile.length!=11) {
                this.$Message.warning('请输入正确手机号');
              return
          }
          this.$axios.post(`api/sms/validate_code?mobile=${this.reg.mobile}&type=${'reg'}`).then(res=>{
              if (!res.data.errorCode) {
                   this.$Message.success('发送成功');
                  this.countDown()
              }
          })
          
      },
      //判断input是否为空
      handleInputEvent(){
        let flag=false
        for (const key in this.reg) {
            if (!this.reg[key]||!this.repwd) {
                // console.log(key + ":" + this.reg[key]);
                flag=true
            }
        }
        this.regDisabled=flag
      },
        countDown() {
            let [text,num]=[this.regBtnText,60]
            this.regSmsDisabled = true;
            this.regBtnText = `${num--}秒`;
            var timer = setInterval(() => {
                this.regBtnText = `${num--}秒`;
                if (num < 0) {
                    this.regBtnText = text;
                    this.regSmsDisabled = false;
                    clearInterval(timer);
                }
            }, 1000);
        },
  }
}
</script>

<style scoped lang="less">
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
