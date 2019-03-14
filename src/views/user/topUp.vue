<template>
    <section id="page_member_payment" class="col-main">
      <h3 class="page_member-title">
        <span v-for="(item,index) of rechargeType" :key="index" :class="{active: selTabActive == item.title}" @click="selTab(item.title)">{{item.title}}</span>
      </h3>
      <div v-if="selTabActive == equivFirstVal">
        <div class="money-info">
          <label>可用余额</label>
          <span id="账户余额">{{userData.money}}</span>
        </div>
        <div class="money-info">
          <label class="label2">充值方式</label>
          <div class="recharge-type">
            <Select v-model="topUpType">
              <Option v-for="item in topUpList" :value="item.id" :key="item.id" v-if="!item.use || item.use.indexOf('pc') !== -1">{{ item.name }}</Option>
            </Select>
          </div>
        </div>

        <div class="money-info bankCard" v-if="topUpType === '1'">
          <label class="label2">银行卡号</label>
          <div class="bankCard-num">
            <input type="number" v-model="account" id="bankCard-amount" class="text" placeholder="请输入银行卡号">
          </div>
        </div>

        <div class="money-info bank" v-if="topUpType === '2'">
          <label class="label2">银行选择</label>
          <div class="recharge-type">
            <Select v-model="bankCode">
              <Option v-for="item in bankTypes" :value="item.bankCode" :key="item.bankCode">{{ item.bankName }}</Option>
            </Select>
          </div>
        </div>

        <div class="money-info border-bottom recharge-box">
          <label class="label2">充值金额</label>
          <div class="recharge-num">
            <input type="number" v-model="money" id="b-pay-amount" class="text" placeholder="请输入充值金额">
            <span>元</span>
          </div>
        </div>
        <div class="submitBtn" @click="submitBtn">
          <button>提交</button>
        </div>
        <div class="bank-notes">
          <h5>温馨提示</h5>
          <ol>
            <li>1.  <span class="orange">入金卡和出金卡必须同一张；</span></li>
            <li>2.  为了您的资金安全，您的账户资金将由第三方银行托管；</li>
            <li>3.  充值前请注意您的银行卡充值限制，以免造成不便；</li>
            <li>4.  禁止洗钱、信用卡套现、虚假交易等行为，一经发现并确认，将终止该账户的使用；</li>
            <li>5.  为了您的资金安全，建议充值前进行实名认证、手机绑定；</li>
            <li>6.  如果充值遇到任何问题，请联系客服：<label id="m_basic_mobile">***-***-****</label>。</li>
          </ol>
        </div>
      </div>
      <div class="alipay-details" v-show="selTabActive == equivSecondeVal">
        <div>
          <ul class="QR-code">
            <li v-for="(item, index) of QRCodeList" :key="index">
              <img :src="item.url" alt="">
              <div style="font-size: 15px;">支付宝扫码 向我付款</div>
            </li>
          </ul>
          <div class="bank-notes">
            <h5>温馨提示</h5>
            <ol>
              <li>1.  入金时候务必备注 填写开户手机号 方便我们多重核对信息 10分钟左右到账；</li>
            </ol>
          </div>
        </div>
        <div v-if="QRCodeList.length == 0" style="text-align: center">
          暂时无支付宝二维码
        </div>

      </div>


      <form id="zft_form" method="post" action="http://47.52.160.122:8080/YBT/YBTPAY">
        <input type="hidden" name="version" />
        <input type="hidden" name="merchantNum" />
        <input type="hidden" name="nonce_str" />
        <input type="hidden" name="merMark" />
        <input type="hidden" name="client_ip" />
        <input type="hidden" name="orderTime" />
        <input type="hidden" name="payType" />
        <input type="hidden" name="orderNum" />
        <input type="hidden" name="amount" />
        <input type="hidden" name="body" />
        <input type="hidden" name="signType" />
        <input type="hidden" name="bank_code" />
        <input type="hidden" name="notifyUrl"/>
        <input type="hidden" name="sign"/>
      </form>

    </section>
</template>

<script>
  import $ from "jquery"
  export default {
      name: "topUp",
      data(){
        return {
          rechargeType: [{title:'充值',},{title:'支付宝充值'}],//两种充值方式
          selTabActive: '充值',//默认选中的充值方式
          equivFirstVal: '',//默认去rechargeType的第一个值
          equivSecondeVal: '',//默认去rechargeType的第二个值
          QRCodeList: '',//支付宝充值的二维码集合
          userData: {},
          topUpList: [], //充值列表
          topUpType: '', //充值方式
          account: '', //银行卡号
          bankCode: '', //选择银行类型
          bankTypes: [ //银行类型
            {bankCode: 'CCB', bankName: '建设银行',i: 1},
            {bankCode: 'BOC', bankName: '中国银行',i: 2},
            {bankCode: 'ABC', bankName: '农业银行',i: 3},
            {bankCode: 'BCOM', bankName: '交通银行',i: 4},
            {bankCode: 'POST', bankName: '邮政银行',i: 5},
            {bankCode: 'CMB', bankName: '招商银行',i: 6},
            {bankCode: 'CITIC', bankName: '中信银行',i: 7},
            {bankCode: 'SPDB', bankName: '浦发银行',i: 8},
            {bankCode: 'CIB', bankName: '兴业银行',i: 9},
            {bankCode: 'CMBC', bankName: '民生银行',i: 10},
            {bankCode: 'CEB', bankName: '光大银行',i: 11},
            {bankCode: 'PAB', bankName: '平安银行',i: 12},
            {bankCode: 'HXB', bankName: '华夏银行',i: 13},
            {bankCode: 'BOB', bankName: '北京银行',i: 14},
            {bankCode: 'GDB', bankName: '广发银行',i: 15},
            {bankCode: 'SHB', bankName: '上海银行',i: 16},
            {bankCode: 'JSB', bankName: '江苏银行',i: 17},
            {bankCode: 'EGB', bankName: '恒丰银行',i: 18},
            {bankCode: 'ICBC', bankName: '工商银行',i: 19},
          ],
          money: '', //充值金额
        }
      },
      created() {
        this.equivFirstVal = this.rechargeType[0].title;
        this.equivSecondeVal = this.rechargeType[1].title;
      },
      mounted(){
        this.getUserData();
        this.getTopUpList();
      },
      methods: {
        getUserData() { //获取父路由的个人信息
          this.$parent.userData.then((userData) => {
            this.userData = userData;
          })
        },
        getTopUpList() { //获取充值方式
          this.$axios({
            url: '/api/money/money_payment',
            method: 'post',
          }).then(res => {
            if(res.data.errorCode === 0) {
              this.topUpList = res.data.data;
            }
          })
        },
        selTab(tit) {//切换充值方式
          this.selTabActive = tit;
          if(tit == this.equivSecondeVal) {
            this.getQRCode();
          }
        },
        getQRCode() {//获取支付宝充值二维码
          this.$axios.post('/api/home/slide/show',{type:'3'}).then(res => {
            if(res.data.errorCode == 0) {
              if(res.data.data.length != 0) {
                this.QRCodeList = res.data.data;
              }
            }
          })
        },
        submitBtn() { //充值
          if (this.topUpType === '') {
            this.$Notice.warning({title: '请选择充值方式',});
            return
          }
          if(this.topUpType === '1' && this.account === '') {
            this.$Notice.warning({title: '请输入银行卡号',});
            return
          }
          if(this.topUpType === '2' && this.bankCode === '') {
            this.$Notice.warning({title: '请选择银行卡',});
            return
          }
          if (!this.money) {
            this.$Notice.warning({title: '充值金额不能为空',});
            return
          }

          this.$axios({
            url: '/api/money/recharge',
            method: 'post',
            data: {
              paymentId: this.topUpType,
              money: this.money,
            }
          }).then(res => {
            if (res.data.errorCode === 0) {
              this.$Notice.success({
                title: '充值成功',
              });
              for (var i in res.data.data) {
                if (res.data.data.hasOwnProperty(i) === true) {
                  $('#zft_form input[name=' + i +']').val(res.data.data[i])
                }
              }
              $("#zft_form").submit();

              this.$parent.getUserData();
              this.getUserData();
            }
          })
          .catch(err => {
            this.$Notice.error({title: err,})
          })
        }
      },
  }
</script>

<style scoped>
  #page_member_payment {
    background-color: white;
    color: #4c4c4c;
    height: 634px;
  }
  /*头部*/
  .page_member-title {
    line-height: 58px;
    font-size: 18px;
    font-weight: normal;
    padding-left: 40px;
    border-bottom: 1px solid #e6e6e6;
  }
  .page_member-title:after {
    content: '';
    display: block;
    clear: both;
  }
  .page_member-title span {
    float: left;
    width: 50%;
    cursor: pointer;
  }
  .page_member-title span.active {
    color: #ff4519;
  }
  /*可用余额*/
  #page_member_payment .money-info {
    line-height: 1;
    font-size: 16px;
    margin: 30px 40px 0;
  }
  #page_member_payment .money-info label {
    width: 108px;
    display: inline-block;
  }
  /*充值方式/金额*/
  #page_member_payment .money-info .label2 {
    vertical-align: top;
    line-height: 40px;
  }
  .recharge-num, .bankCard-num, .recharge-type {
    width: 244px;
    height: 38px;
    line-height: 38px;
    color: #808080;
    display: inline-block;
  }
  .bankCard-num input{
    width: 100%;
    height: 38px;
    color: #808080;
    padding-left: 10px;
    border: 1px solid #e6e6e6;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .recharge-num input {
    height: 38px;
    color: #808080;
    padding-left: 10px;
    width: 212px;
    float: left;
    border: 1px solid #e6e6e6;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .recharge-num input:focus {
    outline: 0;
  }
  .recharge-num span {
    float: right;
    width: 32px;
    background-color: #e6e6e6;
    text-align: center;
    display: block;
    height: 38px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    border: 1px solid #e6e6e6;
  }
  /*提交*/
  #page_member_payment .submitBtn {
    margin: 30px 40px 0;
  }
  #page_member_payment .submitBtn button {
    border: 0;
    outline: 0;
    width: 355px;
    height: 40px;
    background: #ff4519;
    color: #fff;
    cursor: pointer;
  }
  /*温馨提示*/
  #page_member_payment .bank-notes {
    margin-top: 20px;
    font-size: 16px;
    color: #808080;
    padding: 0 60px;
  }
  #page_member_payment .bank-notes h5 {
    font-size: 16px;
    font-weight: normal;
    line-height: 34px;
  }
  #page_member_payment .bank-notes ol li {
    font-size: 14px;
    line-height: 22px;
  }

  /*支付宝二维码*/
  .alipay-details {
    padding: 0 0 50px 0;
    /*border-bottom: 1px solid #e6e6e6;*/
    margin: 50px 0;
  }
  .QR-code {
    display: flex;
    align-items: center;
  }
  .QR-code li {
    flex: 1;
    text-align: center;
  }
  .QR-code li img {
    margin-bottom: 20px;
    max-width: 100%;
    height: 160px;
  }
  .orange {
    color: #ff4519;
    font-weight: bold;
  }
</style>
