<template>
  <div class="">
    <nodata v-show="total==0" />
    <ul class="listInfo" v-show='total!=0&&orders.length'>
      <li class="clearfix">
        <div><span>卖出时间</span></div>
        <div><span>股票名称</span></div>
        <div><span>买入价</span></div>
        <div><span>交易盈亏</span></div>
        <div><span>操作</span></div>
      </li>
      <li class="clearfix" v-for="(i,index) in orders" :key="index">
        <div><span>{{i.sellTime}}</span> <span>保证金：{{i.stopProfit}}</span></div>
        <div><span>{{i.stockName}}</span><span>股数：{{i.stockNum}}</span></div>
        <div><span>{{i.buyPoint}}</span><span>卖出价:{{i.sellPoint}}</span></div>
        <div><span>盈亏：<span :class="PAL(i).PAL>0?'up':PAL(i).PAL<0?'down':''">{{PAL(i).PAL}}({{PAL(i).ratio}}%)</span></span></div>
        <div><span> <button @click="$router.push({name:'details',params:{id:i.id}})">查看详情</button></span></div>
      </li>
    </ul>
      <div style="text-align: right;padding: 20px">
        <Page :total="total" size="small" :page-size='params.rows' show-total @on-change="changePage"/>
      </div>
  </div>
</template>

<script type="">
import nodata from "@/components/nodata";

export default {
  name: "history",
  components: {
    nodata
  },
  data() {
    return {
      orders: [],//订单
      total: null,
    };
  },
   computed: {
    params() {
      return {
        start: 0,
        rows: 10,
        type: 4, //状态(默认是0)：0 持仓 1 委托中持仓 2 取消委托持仓 3 行权申请 4 平仓 5 订单取消
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
        PAL:((i.sellPoint-i.buyPoint)*i.stockNum).toFixed(2),
        ratio:((i.sellPoint-i.buyPoint)/i.buyPoint*100).toFixed(2)
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
