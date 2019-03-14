<template>
  <div class="">
    <div class="stock-sell-section">
        <div class="stock-buy stock-sell container">
            <section class="play-area">
                <nav>
                    <ul class="clearfix">
                       <li>
                           <a>交易单</a>
                       </li>
                    </ul>
                    <div @click="$router.go(-1)" style="cursor: pointer;">
                        <span>返回</span>
                    </div>
                </nav>
            </section>
            <section id="stock-sell-record" class="stock-record-list">
                  <section class="play-area">
                    <section class="clearfix" :style="this.$route.path!='/trade/buy'?style:''">
                    <ul class="info">
                        <li>订单流水号: <span>{{i.serialNo }}</span></li>
                        <li>平仓（交割）时间: <span>{{i.sellTime }}</span></li>
                        <li>建仓时间: <span>{{i.buyTime }}</span></li>
                        <li>建仓价: <span>{{i.buyPoint }}</span></li>
                        <li>用户昵称: <span>{{i.chnName }}</span></li>
                        <li>建仓费: <span>{{i.createFee }}</span></li>
                        <!-- <li>,: <span>{{i.customerId }}</span></li> -->
                        <li>递延费: <span>{{i.deferFee }}</span></li>
                        <li>结算金额: <span>{{i.difMoney }}</span></li>
                        <li>是否为实盘订单: <span>{{i.isActual==0?'不是':'是' }}</span></li>
                        <!-- <li>是否关注改牛人: <span>{{i.isAttention==0?'未关注':'已关注' }}</span></li> -->
                        <li>是否自动递延: <span>{{i.isDefer==0?'是':'不是' }}</span></li>
                        <li>管理费: <span>{{i.manageFee }}</span></li>
                        <li>市值: <span>{{i.marketValue }}</span></li>
                        <!-- <li>,: <span>{{i.memberUnitId }}</span></li> -->
                        <li>用户手机号: <span>{{i.mobile }}</span></li>
                        <li>名义本金: <span>{{i.money }}</span></li>
                        <li>倍数: <span>{{i.mulripleNum }}</span></li>
                        <!-- <li>,: <span>{{i.operationCenterId }}</span></li> -->
                        <li>平台手续费: <span>{{i.pingtaiFee }}</span></li>
                        <li>委托价: <span>{{i.restrictPoint }}</span></li>
                        <li>平仓价: <span>{{i.sellPoint }}</span></li>
                        <li>行权类型: <span>{{sellType(i.sellType) }}</span></li>
                        <li>分红: <span>{{i.shareFee }}</span></li>
                        <li>是否模拟点买: <span>{{i.simulate==1?'不是':'是' }}</span></li>
                        <li>状态: <span>{{status(i.status) }}</span></li>
                        <li>股票代码: <span>{{i.stockCode }}</span></li>
                        <li>股票名称: <span>{{i.stockName }}</span></li>
                        <li>股数: <span>{{i.stockNum }}</span></li>
                        <li>止损: <span>{{i.stopLoss }}</span></li>
                        <li>止盈: <span>{{i.stopProfit }}</span></li>
                        <li>策略类型: <span>{{i.tacticsType==0?'市价':'限价' }}</span></li>
                        <!-- <li>策略类型: <span>{{i.type==0?'普通策略':'牛人策略' }}</span></li> -->
 
                    </ul>
                    </section>
                  </section>
                    <!-- buyTime (string, optional): 建仓时间 ,
                    chnName (string, optional): 用户昵称 ,
                    createFee (number, optional): 建仓费 ,
                    customerId (string, optional),
                    deferFee (number, optional): 递延费 ,
                    difMoney (number, optional): 结算金额 ,
                    isActual (string, optional): 是否为实盘订单 0 不是 1是 ,
                    isAttention (integer, optional): 是否关注改牛人 0 未关注 1 已关注 ,
                    isDefer (integer, optional): 是否自动递延 0 是 1 不是 ,
                    manageFee (number, optional): 管理费 ,
                    marketValue (number, optional): 市值 ,
                    memberUnitId (string, optional),
                    mobile (string, optional): 用户手机号 ,
                    money (number, optional): 名义本金 ,
                    mulripleNum (number, optional): 倍数 ,
                    operationCenterId (string, optional),
                    pingtaiFee (number, optional): 平台手续费 ,
                    restrictPoint (number, optional): 委托价 ,
                    sellPoint (number, optional): 平仓价 ,
                    sellTime (string, optional): 平仓（交割）时间 ,
                    sellType (integer, optional): 行权类型 0 手动 1 到期 2 止盈止损 3 递延不足 ,
                    serialNo (string, optional): 订单流水号 ,
                    shareFee (number, optional): 分红 ,
                    simulate (string, optional): 是否模拟点买; 1 不是 2 模拟 ,
                    status (string, optional): 状态：0 持仓 1 委托中持仓 2 取消委托持仓 3 行权申请 4 平仓 5 订单取消 ,
                    stockCode (string, optional): 股票代码 ,
                    stockName (string, optional): 股票名称 ,
                    stockNum (number, optional): 股数 ,
                    stopLoss (string, optional): 止损 ,
                    stopProfit (string, optional): 止盈 ,
                    tacticsType (string, optional): 策略类型 0 市价 1 限价 ,
                    type (string, optional): 策略类型 0 普通策略 1 牛人策略 ,
                    userHeader (string, optional): 用户头像 -->
            </section>
        </div>
    </div>
  </div>
</template>

<script type="">
export default {
  name:"detail",
  data() {
    return {
        i:{},
        style:{'padding':'40px 20px 20px'}
    }
  },
  created () {
    // console.log(this.$route.params.simulate);
    this.getInfo()
    
  },
  computed: {

  },
  methods: {
      //获取详情
      getInfo(){
          this.$axios.post(`api/trade/order/info?id=${this.$route.params.id}`).then(res=>{
              this.i=res.data.data
          })
      },
      //行权类型
      sellType(n){
           if (n==0)return '手动';
           if (n==1)return '到期';
           if (n==2)return '止盈止损';
           if (n==3)return '递延不足';
      },
      //状态
      status(n){
           if (n==0)return '持仓';
           if (n==1)return '委托中持仓';
           if (n==2)return '取消委托持仓';
           if (n==3)return '行权申请';
           if (n==4)return '平仓';
           if (n==5)return '订单取消';
      }
  },
}
</script>

<style scoped lang="less">
.info{
   display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    text-align: center;
    font-size: 16px;
    li{
        width: calc(calc(100% / 3) - 10px);
        margin: 10px 0;
    }
}
.stock-sell-section {
  padding-top: 20px;
  padding-bottom: 40px;
  background: url(../../../public/img/buyBG.jpg) no-repeat left top;
  background-size: 100%;
  min-width: 1585px;
}
.stock-sell {
    height: inherit;
}
.container {
    width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
    position: relative;
}
.stock-buy .play-area {
    background-color: white;
    // box-shadow: 0 0 5px 1px rgba(143,38,14,0.1);
    padding-left: 4px;
    > nav {
      height: 70px;
      line-height: 66px;
        display: flex;
    justify-content: space-between;
    ul{
            flex: 1;
    }
      li {
          width: 25%;
          float: left;
          text-align: center;
          &.active {
                border-bottom: 4px solid #ff4519;
                 > a {
                      color: #ff4519;
                  }
            }
           a {
              font-size: 30px;
              color: #c7c7c7;
              display: block;
          }
      }
  }
   > section {
        padding: 40px 50px 20px;
        box-sizing: border-box;
    }
}
</style>
