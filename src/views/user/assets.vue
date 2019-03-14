<template>
  <section class="mem-overview">
    <div class="mem-top-section clearfix">
      <div class="left-info">
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
        <!--<p class="loginDate">上次登录时间：2019-01-08 15:53:00</p>-->
      </div>
      <div class="right-info">
        <h4>可用余额</h4>
        <div class="money clearfix">
          <span>{{userData.money}}元</span>
          <router-link class="withdraw" to="/user/withdrawal">提现</router-link>
          <router-link class="recharge" to="/user/topUp">充值</router-link>
        </div>
      </div>
      <div class="right-info">
        <h4>模拟金额</h4>
        <div class="money clearfix">
          <span>{{userData.simulationMoney}}元</span>
        </div>
      </div>
    </div>
    <div class="mem-middle-section">
      <ul class="clearfix">
        <li class="fl">
          <h6>持仓中订单</h6>
          <p>{{tradeInfo.holdTradeCount || 0}}</p>
        </li>
        <li class="fl">
          <h6>委托中订单</h6>
          <p>{{tradeInfo.entrustTradeCount || 0}}</p>
        </li>
        <li class="fl">
          <h6>历史订单</h6>
          <p>{{tradeInfo.historyTradeCount || 0}}</p>
        </li>
      </ul>
      <ul class="clearfix">
        <li class="fl">
          <h6>模拟持仓中订单</h6>
          <p>{{tradeInfo.holdTradeCountSim || 0}}</p>
        </li>
        <li class="fl">
          <h6>模拟委托中订单</h6>
          <p>{{tradeInfo.entrustTradeCountSim || 0}}</p>
        </li>
        <li class="fl">
          <h6>模拟历史订单</h6>
          <p>{{tradeInfo.historyTradeCountSim || 0}}</p>
        </li>
      </ul>
    </div>
    <div class="mem-down-section">
      <h3 class="page_member-title">资金明细</h3>
      <!--筛选条件-->
      <div class="filtrate clearfix">
        <div class="filtrate-tab fl">
          <p>资金流向：</p>
          <ul>
            <li class="active">全部</li>
            <!--<li>收入</li>-->
            <!--<li>支出</li>-->
          </ul>
        </div>
        <div class="filtrate-date fr">
          <select id="" v-model="capitalData.type" @change="changeSearch()">
            <option value="">全部</option>
            <option value="0">充值</option>
            <option value="1">提现</option>
            <option value="9">保证金</option>
            <option value="10">建仓费</option>
            <option value="8">递延费</option>
            <option value="12">管理费</option>
            <option value="3">盈亏值</option>
            <option value="14">手续费</option>
          </select>
        </div>
      </div>
      <!--列表头部-->
      <div class="header clearfix">
        <span>时间</span>
        <span>类型</span>
        <span>金额</span>
      </div>
      <!--列表-->
      <ul class="list" id="member_bh_list">
        <li v-for="item in capital.capitalList" v-if="capital.total > 0">
          <span>{{item.createTime}}</span>
          <span>{{item.type}}</span>
          <span>{{item.difMoney}}</span>
        </li>
      </ul>
      <!--分页器-->
      <div class="page" v-if="capital.total > 10">
        <Page :total="capital.total" :page-size="capitalData.rows" size="small" show-total show-elevator @on-change="pageChange"/>
      </div>
      <!--暂无数据-->
      <div class="data-empty" v-if="capital.total === 0">
        <div class="data-empty">暂无数据,请先创建策略</div>
      </div>
    </div>
  </section>
</template>

<script>
  import $ from "jquery";
  export default {
    name: "assets",
    data() {
      return {
        userData: {},
        tradeInfo: {}, //策略信息
        capitalData: { //资金流水
          start: 0, //从第几条开始
          rows: 10, //页容量
          type: '', //筛选状态
        },
        capital: {
          capitalList: [], //列表
          total: 0, //总条数
        },
      }
    },
    created() {
      this.getUserData();
      this.getTradeInfo();
      this.getUserCapital();
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
      getTradeInfo() { //获取订单信息
        this.$axios.post('/api/user/trade/count').then(res => {
          if (res.data.errorCode === 0) {
            this.tradeInfo = res.data.data
          }
        })
      },
      getUserCapital() { //获取用户资金明细
        this.$axios({
          url: '/api/user/moneyinandout/count',
          method: 'post',
          data: this.capitalData,
        }).then(res => {
          if(res.data.errorCode === 0) {
            this.capital.total = res.data.data.total;
            this.capital.capitalList = res.data.data.data
            this.capital.capitalList.forEach(function (item) {
              switch (item.type) {
                case '0':
                  item.type = '充值';
                  break;
                case '1':
                  item.type = '提现';
                  break;
                case '3':
                  item.type = '盈亏值';
                  break;
                case '8':
                  item.type = '递延费';
                  break;
                case '9':
                  item.type = '保证金';
                  break;
                case '10':
                  item.type = '建仓费';
                  break;
                case '12':
                  item.type = '管理费';
                  break;
                case '14':
                  item.type = '手续费';
                  break;
              }
            })
          }
        })
      },
      pageChange(page) { //分页
        this.capitalData.start = page * this.capitalData.rows;
        this.getUserCapital()
      },
      changeSearch() { //更改查询条件
        this.capitalData.start = 0;
        this.capitalData.rows = 10;
        this.getUserCapital()
      },
    },
  }
</script>

<style scoped>
  a {
    color: #5cb1ff;
    cursor: pointer;
  }
  /*头部*/
  .mem-top-section {
    background-color: white;
    padding: 20px 40px;
  }
  /*头部左侧安全等级*/
  .mem-overview .mem-top-section .left-info {
    width: 368px;
    float: left;
  }
  /*标题*/
  .mem-overview .mem-top-section h4 {
    line-height: 38px;
    font-weight: normal;
    font-size: 16px;
  }
  /*安全等级*/
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
  /*安全等级长度*/
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
  /*已完成的安全验证*/
  .mem-overview .mem-top-section .left-info i.active {
    color: #ff4519;
  }
  .mem-overview .mem-top-section .left-info i {
    font-size: 32px;
    color: #c7c7c7;
    margin-right: 14px;
  }
  .loginDate {
    margin-top: 10px;
  }
/*头部右侧 余额*/
  .mem-overview .mem-top-section .right-info {
    float: right;
    padding-left: 30px;
    min-width: 40%;
    max-width: 50%;
    border-left: 1px solid #f2f2f2;
  }
  .mem-overview .mem-top-section .right-info .money {
    margin-top: 10px;
  }
  /*余额多少*/
  .mem-overview .mem-top-section .right-info .money span {
    font-size: 18px;
    color: #ff4519;
    line-height: 1;
  }
  /*充值提现按钮*/
  .mem-overview .mem-top-section .right-info .money a {
    display: inline-block;
    width: 50px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    font-size: 16px;
    border-radius: 3px;
    vertical-align: top;
    float: right;
    border: 1px solid #ff4519;
  }
  .mem-overview .mem-top-section .right-info .recharge {
    color: white;
    background-color: #ff4519;
  }
  .mem-overview .mem-top-section .right-info .withdraw {
    color: #ff4519;
    margin-left: 10px;
  }
  .mem-overview .mem-top-section .right-info .records {
    font-size: 16px;
    line-height: 1;
    margin-top: 16px;
    display: block;
  }
  /*中间内容*/
  .mem-middle-section {
    margin-top: 20px;
    background-color: white;
  }
  .mem-middle-section ul {
    width: 100%;
    padding: 10px 40px;
    border-bottom: 1px dashed #eaeaea;
  }
  .mem-middle-section ul:last-child {
    border-bottom: 0;
  }
  .mem-middle-section ul li {
    width: calc(100% / 3);
    text-align: center;
  }
  .mem-middle-section ul li h6 {
    font-weight: normal;
    font-size: 14px;
  }
  .mem-middle-section ul li p {
    font-size: 18px;
    margin-top: 8px;
  }
/*资金明细*/
  .mem-down-section {
    margin-top: 20px;
    min-height: 360px;
    background-color: white;
  }
  .page_member-title {
    line-height: 58px;
    font-size: 18px;
    font-weight: normal;
    border-bottom: 1px solid #e6e6e6;
    padding: 0 40px;
  }
  /*筛选条件*/
  .filtrate {
    padding: 20px 40px;
  }
  .filtrate .filtrate-tab  p, .filtrate .filtrate-tab ul, .filtrate .filtrate-tab ul li {
    float: left;
  }
  .filtrate .filtrate-tab ul li {
    margin: 0 20px;
    cursor: pointer;
  }
  .filtrate .filtrate-tab ul li.active {
    color: #ff4519;
  }
  .filtrate-date select {
    cursor: pointer;
  }
  .filtrate-date select:focus {
    outline: none;
  }
  /*明细列表*/
  /*头部*/
  .mem-down-section .header {
    border-top: 1px solid #f2f2f2;
    background-color: #fafafa;
    height: 39px;
    line-height: 40px;
    font-size: 16px;
    color: #4c4c4c;
    padding: 0 40px;
  }
  .mem-down-section .header span,  .mem-down-section .list li span {
    display: block;
    float: left;
    text-align: center;
    width: 25%;
  }
  .mem-down-section .header span:last-child, .mem-down-section .list li span:last-child {
    width: 50%;
  }
  .mem-down-section .list {
    padding: 0 40px;
  }
  .mem-down-section .list li {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: #4c4c4c;
    border-bottom: 1px dashed #eaeaea;
  }
  .mem-down-section .list li:last-child {
    border-bottom: 1px solid #ededed;
  }
  .mem-down-section .list li span {
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
  /*分页*/
  .page {
    text-align: center;
    padding: 10px 0;
  }
  /*暂无数据*/
  .data-empty {
    display: block;
    text-align: center;
    font-size: 26px;
    color: #bbb;
    padding-top: 40px;
  }
</style>
