<template>
  <div class="">
    <nodata v-show="total==0" />
    <ul class="listInfo" v-show='total!=0&&orders.length'>
      <li class="clearfix">
        <div><span>买入时间</span></div>
        <div><span>策略金额</span></div>
        <div><span>股票名称</span></div>
        <div><span>委托价</span></div>
        <div><span>操作</span></div>
      </li>
      <li class="clearfix" v-for="(i,index) in orders" :key="index">
        <div><span>{{i.buyTime}}</span> <span>委托类型：{{i.status==1?'买入':'卖出'}}</span></div>
        <div><span>{{i.money}}</span><span>止盈/止损：{{i.stopProfit}}/{{i.stopLoss}}</span></div>
        <div><span>{{i.stockName}}</span><span>股数：{{i.stockNum}}</span></div>
        <div><span>{{ i.restrictPoint||i.sellPoint  }}</span><span>自动递延：{{i.isDefer==0?'是':'否'}}</span></div>
        <div><span> <button @click="model=true;order=i">取消委托</button></span></div>
      </li>
    </ul>
      <div style="text-align: right;padding: 20px">
        <Page :total="total" size="small" :page-size='params.rows' show-total @on-change="changePage"/>
      </div>
      <Modal title="确认取消委托" v-model="model" class-name="vertical-center-modal" width='360' @on-ok='cancel(order)'>
        <p>确认取消委托?</p>
      </Modal>
  </div>
</template>

<script type="">
import nodata from "@/components/nodata";
export default {
  name: "history",
  data() {
    return {
      // params: {
      //   start: 0,
      //   rows: 10,
      //   type: 1, //状态(默认是0)：0 持仓 1 委托中持仓 2 取消委托持仓 3 行权申请 4 平仓 5 订单取消
      //   isSimulate: 1 //1 不是 2 模拟
      // },
      orders: [],//订单
      total: null,
      order:{},
      model:false
    };
  },
  components: {
    nodata
  },
   computed: {
    params() {
      return {
        start: 0,
        rows: 10,
        type: 1, //状态(默认是0)：0 持仓 1 委托中持仓 2 取消委托持仓 3 行权申请 4 平仓 5 订单取消
        isSimulate: this.$route.params.simulate //1 不是 2 模拟
      }
    }
  },
  created() {
    this.getorders()
    
  },

  methods: {
    //翻页
    changePage(p){
      this.params.start=(p-1)*this.params.rows
      this.getorders().then(() => this.getMarket());
    },
    //盈亏计算
    PAL(i){
      return {
        PAL:((i.price-i.buyPoint)*i.stockNum).toFixed(2),
        ratio:((i.price-i.buyPoint)*i.stockNum/i.money).toFixed(2)
      }
    },
    //获取订单
    getorders() {
      return this.$axios
        .post("api/trade/query/orders", this.params)
        .then(res => {
          if (!res.data.errorCode) {
            this.orders = res.data.data.data;
            this.total = res.data.data.total;
          }
        });
    },
    cancel(i){
      this.$axios.post(`api/trade/del/entrust/?id=${i.id}`).then(res=>this.getorders())
    }
  }
};
</script>

<style scoped lang="less">

.stoprange li{
  margin: 10px 0;
  font-size: 14px;
}
.sell li{
  margin: 5px 0;
  font-size: 14px;
}
.d-flex-center{
  display: flex;
  align-items: center;
}
.fc{
  // width: 100%;
    height: 32px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 12px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    color: #515a6e;
}

.up{
  color: red;
}
.down{
  color:green;
}
.listInfo {
  width: 100%;
  margin-top: 20px;
}
.listInfo li {
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
  > div {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 20%;
    line-height: 30px;
    button {
      background: #0088f1;
      padding: 5px;
      color: #fff;
      text-align: center;
      margin-right: 5px;
      border-radius: 3px;
    }
  }
}
</style>
