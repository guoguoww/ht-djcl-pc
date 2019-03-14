<template>
    <section id="page_member_bankcard">
      <h3 class="page_member-title">银行卡管理</h3>
      <!--已绑定卡-->
      <div id="page_member_bankcard_card">
        <h5>当前绑定的银行卡 <a href="javascript: void (0);" class="fr" @click="openAddCard">绑定新银行卡</a></h5>
        <div class="bankcard-info" v-if="bankCardlist.length > 0" v-for="item in bankCardlist">
          <div class="bankcard-img">
            <div class="clearfix">
              <p class="fl"><label id="bank_card_own">{{item.bankName}}</label></p>
              <p class="fr">储蓄卡</p>
            </div>
            <h6 id="user-bankNo2">{{item.bankAccount}}</h6>
          </div>
          <div class="bankcard-text bankcard-text2">
            <p>户名：<label id="user-bankNo">{{item.chnName}}</label></p>
            <p>预留手机：<label id="user_bankPhone">{{item.phone}}</label></p>
            <p>身份证号：<label id="user_bankOn">{{item.idCard}}</label></p>
          </div>
          <div class="bankcard-remove">
            <Button type="error" ghost @click="remove(item.id)">解绑</Button>
          </div>
        </div>
        <!--暂无数据-->
        <div class="data-empty" v-if="bankCardlist.length === 0">
          <div class="data-empty">暂未绑定银行卡 点击右上角新增</div>
        </div>
      </div>

      <!--朦版 绑定银行卡窗口-->
      <div class="background-000" v-if="addCard"></div>
      <div class="addCard" v-if="addCard">
        <!--头部-->
        <div class="addCard_title">
          <h3>绑定新银行卡</h3>
          <Icon class="close" type="ios-close" @click="cancel()"/>
        </div>
        <div class="form">
          <div class="inbox">
            <label>开户姓名</label>
            <input type="text" placeholder="请输入持卡人姓名" v-model="submitBankCardData.chnName">
          </div>
          <div class="inbox">
            <label>身份证号</label>
            <input type="text" placeholder="请输入持卡人的身份证号" v-model="submitBankCardData.idCard">
          </div>
          <div class="inbox">
            <label>所在省份</label>
            <input type="text" placeholder="请输入您的所在省份" v-model="submitBankCardData.province">
          </div>
          <div class="inbox">
            <label>开户银行</label>
            <input type="text" placeholder="请输入您的开户银行" v-model="submitBankCardData.bankName">
          </div>
          <div class="inbox">
            <label>支行名称</label>
            <input type="text" placeholder="请输入您的支行名称" v-model="submitBankCardData.openBankName">
          </div>
          <div class="inbox">
            <label>银行卡号</label>
            <input type="text" placeholder="请输入您的银行卡号" v-model="submitBankCardData.bankAccount">
          </div>
          <div class="inbox">
            <label>预留手机</label>
            <input type="text" placeholder="请输入您的预留手机号" v-model="submitBankCardData.phone">
          </div>
        </div>
        <button class="color-btn" id="submit-btn" @click="submitBankCardInfo">提交信息</button>
      </div>
    </section>
</template>

<script>
  export default {
    name: "bankCard",
    data() {
      return {
        userData: {},
        bankCardlist: [], //银行卡列表
        addCard: false, // 绑定银行卡窗口显示
        submitBankCardData: { //需要提交的银行卡信息
          chnName: '', //持卡人姓名
          idCard: '', //身份证号
          province: '', //省份
          bankName: '', //银行名称
          openBankName: '', //开户行信息
          bankAccount: '', //银行卡号
          phone: '', //银行卡预留手机号
        },
      }
    },
    created() {
      this.getUserData();
      this.getBankCardInfo();
    },
    methods: {
      getUserData() { //获取父路由的个人信息
        this.$parent.userData.then((userData) => {
          this.userData = userData
        })
      },

      getBankCardInfo() { //获取绑定银行卡列表
        this.$axios.post('/api/user/query/bankcard').then(res => {
          if(res.data.errorCode === 0) {
            this.bankCardlist = res.data.data;
          }
        })
      },

      openAddCard() { //打开新增银行卡窗口
        if(this.userData.authStatus === 0 || this.userData.authStatus === 3) {
          this.$Message.warning('请先实名认证')
          return
        }
        if(this.userData.authStatus === 1) {
          this.$Message.warning('请等待实名认证审核通过')
          return
        }
        this.addCard = true
      },

      submitBankCardInfo() { //绑定/修改银行卡
        if(!this.submitBankCardData.chnName) {
          this.$Message.warning('请输入持卡人姓名')
          return
        }
        if(!this.submitBankCardData.idCard) {
          this.$Message.warning('请输入身份证号')
          return
        }
        if(!this.submitBankCardData.province) {
          this.$Message.warning('请输入所在省份')
          return
        }
        if(!this.submitBankCardData.bankName) {
          this.$Message.warning('请输入银行名称')
          return
        }
        if(!this.submitBankCardData.openBankName) {
          this.$Message.warning('请输入开户行信息')
          return
        }
        if(!this.submitBankCardData.bankAccount) {
          this.$Message.warning('请输入银行卡号')
          return
        }
        if(!this.submitBankCardData.phone) {
          this.$Message.warning('请输入银行预留手机号')
          return
        }
        this.$axios({
          headers: {
            'Content-Type': 'application/json'
          },
          url: '/api/user/add/bankcard',
          method: 'post',
          data: this.submitBankCardData,
        }).then(res => {
          if(res.data.errorCode === 0) {
            this.$Notice.success({
              title: '绑定成功',
            });
            this.cancel();
            this.getBankCardInfo();
          }
        })
      },

      cancel() { //关闭新增银行卡
        this.addCard = false;
        // 关闭窗口 初始化填写信息
        this.submitBankCardData.chnName = ''; //持卡人姓名
        this.submitBankCardData.idCard = ''; //身份证号
        this.submitBankCardData.province = ''; //省份
        this.submitBankCardData.bankName = ''; //银行名称
        this.submitBankCardData.openBankName = ''; //开户行信息
        this.submitBankCardData.bankAccount = ''; //银行卡号
        this.submitBankCardData.phone = ''; //银行卡预留手机号
      },

      remove(id) { //解除绑定银行卡
        this.$Modal.confirm({
          content: '<p>确认解除绑定？</p>',
          onOk: () => {
            this.$axios.post('/api/user/del/bankcard', {id: id}).then(res => {
              if(res.data.errorCode === 0) {
                this.$Message.success('解除绑定成功')
                this.getBankCardInfo();
              }
            })
          }
        })
      },
    },
  }
</script>

<style scoped>
  a {
    color: #5cb1ff;
    cursor: pointer;
  }
  #page_member_bankcard {
    background-color: white;
    color: #4c4c4c;
    min-height: 634px;
  }
  /*头部*/
  .page_member-title {
    line-height: 58px;
    font-size: 18px;
    font-weight: normal;
    padding-left: 40px;
    border-bottom: 1px solid #e6e6e6;
  }
  /*已绑定银行卡*/
  #page_member_bankcard_card h5 {
    margin: 0 40px;
    font-weight: normal;
    line-height: 70px;
    font-size: 16px;
  }
  #page_member_bankcard_card h5 a {
    font-size: 14px;
  }
  #page_member_bankcard_card .bankcard-info {
    width: 730px;
    padding: 15px 0;
    border-bottom: 1px dashed #e6e6e6;
    margin: auto;
  }
  .bankcard-img {
    position: relative;
    display: inline-block;
    width: 240px;
    padding: 30px 20px;
    color: white;
    border-radius: 5px;
    background: rgba(248,54,0,0.7);
    /*background: linear-gradient(right, rgba(248,54,0,0.7), rgba(255,115,0,0.7));*/
    /*background: -moz-linear-gradient(right, rgba(248,54,0,0.7), rgba(255,115,0,0.7));*/
    /*background: -webkit-linear-gradient(right, rgba(248,54,0,0.7), rgba(255,115,0,0.7));*/
    /*background: -o-linear-gradient(right, rgba(248,54,0,0.7), rgba(255,115,0,0.7));*/
    vertical-align: middle;
  }
  .bankcard-img:after {
    font-family: icomoon;
    content: "\e927";
    position: absolute;
    color: white;
    opacity: 0.1;
    right: -10px;
    font-size: 140px;
    top: 0;
    bottom: 0;
    line-height: 1;
  }
  .bankcard-img > div {
    border-bottom: 1px solid rgba(255,255,255,0.6);
    padding-bottom: 12px;
  }
  .bankcard-img p {
    line-height: 24px;
    font-size: 14px;
  }
  .bankcard-img h6 {
    font-size: 14px;
    text-align: center;
    letter-spacing: 2px;
    font-weight: normal;
    padding-top: 14px;
  }
  .bankcard-text2 {
    vertical-align: top;
    margin-top: 12px;
    line-height: 30px;
  }
  .bankcard-text {
    display: inline-block;
    margin-left: 80px;
    font-size: 14px;
    color: #808080;
    line-height: 24px;
    /*padding: 30px 0;*/
    vertical-align: middle;
  }
  .bankcard-remove {
    display: inline-block;
    vertical-align: middle;
    margin-left: 100px;
  }

  /*暂无数据*/
  .data-empty {
    display: block;
    text-align: center;
    font-size: 26px;
    color: #bbb;
    padding-top: 40px;
  }

  /*朦版*/
  .background-000 {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1001;
    background: #000;
    opacity: .6;
  }
  /*新增银行卡窗口模态框*/
  .addCard {
    margin: 50px auto;
    min-width: 560px;
    background: #FFF;
    position: fixed;
    top: 80px;
    left: calc(50% - 280px);
    overflow: hidden;
    z-index: 1002;
  }
  /*模态头部*/
  .addCard .addCard_title h3{
    height: 25px;
    margin: 40px 443px 20px 40px;
    font-size: 18px;
    color: #222;
  }
  .addCard .addCard_title .close {
    position: absolute;
    right: 30px;
    top: 30px;
    display: block;
    transition: all .6s;
    font-size: 32px;
    cursor: pointer;
  }
  .addCard .addCard_title .close:hover {
    transform:rotate(-180deg);
  }
  /*添加银行卡 form*/
  .addCard .form {
    width: 442px;
    margin: auto;
  }
  .addCard .inbox {
    margin-top: 15px;
  }
  .addCard label {
    width: 108px;
    display: inline-block;
    line-height: 40px;
    font-size: 16px;
  }
  .addCard .inbox > div {
    display: inline-block;
    width: 310px;
  }
  .addCard .inbox .name {
    color: #ff4519;
    line-height: 40px;
  }
  .addCard .inbox .nameHide {
    color: rgb(128, 128, 128) !important;
    font-size: 16px;
  }
  .addCard .inbox a {
    float: right;
  }
  .addCard input {
    width: 324px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    font-size: 16px;
    padding-left: 12px;
    display: inline-block;
  }
  .addCard input:focus {
    box-shadow: 0 0 3px 0 #ff4519;
    outline: none
  }
  .addCard .input1 + .input1 {
    margin-left: 20px;
  }
  .addCard .input1 {
    width: 150px;
  }
  /*提交按钮*/
  .color-btn {
    width: 70%;
    display: block;
    height: 40px;
    line-height: 40px;
    margin: 20px auto;
    background-color: #ff4519;
    border-radius: 5px;
    color: white;
    font-size: 20px;
    position: relative;
    cursor: pointer;
  }
  .color-btn:focus {
    outline: 0;
    border: 0;
  }
</style>
