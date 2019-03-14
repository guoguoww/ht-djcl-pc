<template>
  <div class="">
    <nodata v-show="total==0" />
    <ul class="listInfo" v-show='total!=0&&orders.length'>
      <li class="clearfix">
        <div><span>买入时间</span></div>
        <div><span>策略金额</span></div>
        <div><span>股票名称</span></div>
        <div><span>买入价/当前价</span></div>
        <div><span>操作</span></div>
      </li>
      <li class="clearfix" v-for="(i,index) in orders" :key="index">
        <div><span>{{i.buyTime}}</span> <span>止盈：{{i.stopProfit}}</span></div>
        <div><span>{{i.money}}</span><span>止损：{{i.stopLoss}}</span></div>
        <div><span>{{i.stockName}}</span><span>股数：{{i.stockNum}}</span></div>
        <div><span>{{i.buyPoint}} -&gt; {{i.price}}</span><span>盈亏：<span :class="PAL(i).PAL>0?'up':PAL(i).PAL<0?'down':''">{{PAL(i).PAL}}({{PAL(i).ratio}}%)</span></span></div>
        <div v-if="$route.params.simulate==1"><span> <button @click="stopOpen(i,true)">修改止盈</button> <button @click="stopOpen(i)">修改止损</button><button @click="sellOrder=i;sellShow=true;sellParams.entrustPoint=null;">平仓</button></span></div>
      </li>
    </ul>
      <div style="text-align: right;padding: 20px">
        <Page :total="total" size="small" :page-size='params.rows' show-total @on-change="changePage"/>
      </div>
      <Modal title="确认平仓" v-model="sellShow" class-name="vertical-center-modal" @on-ok="sell" width="400">
        <ul class="sell">
          <li>交易品种:{{sellOrder.stockName}}({{sellOrder.stockCode}})</li>
          <li>卖出股数:{{sellOrder.stockNum}}股</li>
          <li>买入时间:{{sellOrder.buyTime}}</li>
          <li>策略金额:{{sellOrder.money}}</li>
          <li>浮动盈亏:{{PAL(sellOrder).PAL}}</li>
          <!-- <li class="d-flex-center">是否分仓:
            <RadioGroup v-model="sellParams.value">
                <Radio label="1">
                  <span>全部平仓</span>
                </Radio>
                <Radio label="2">
                  <span>分仓</span>
                </Radio>
            </RadioGroup>
            <input type="text" class="fc" v-if="sellParams.value==2" v-model="sellParams.stockNum" placeholder="请输入平仓股数">
          </li> -->
          <!-- <li class="d-flex-center">平仓类型: 
            <RadioGroup v-model="sellParams.type">
                <Radio label="0">
                  <span>市价卖出</span>
                </Radio>
                <Radio label="1">
                  <span>限价卖出</span>
                </Radio>
            </RadioGroup>
            <input v-if="sellParams.type==1" type="text" class="fc"  v-model="sellParams.entrustPoint" placeholder="请输入委托价格" @blur="entrustBlur">
            <span v-show="sellParams.type==1">{{(sellOrder.close*0.9).toFixed(2)}}-{{(sellOrder.close*1.1).toFixed(2)}}</span>
          </li> -->
        </ul>
    </Modal>
    <Modal title="修改止盈" v-model="stopShow" class-name="vertical-center-modal" @on-ok="updateStop" width="400">
      <ul class="stoprange">
        <li>
          <span>修改止盈: </span>
          <input type="number" class="fc" placeholder="请输入止盈" style="width: 200px"  v-model="stop.stopProfit" @blur="stopBlur(1,stopRange(sellOrder).profit[1],stopRange(sellOrder).profit[0])"/>
          <!-- <span>{{stopRange(sellOrder).profit[0]}}-{{stopRange(sellOrder).profit[1]}}</span>     -->
          <span>股票上涨{{stopRate(stop.stopProfit,1)}}%</span>    
        </li>
      </ul>
    </Modal>
    <Modal title="修改止损" v-model="stopLShow" class-name="vertical-center-modal" @on-ok="updateStop" width="400">
      <ul class="stoprange">
        <li>
          <span>修改止损: </span>
            <input type="number" class="fc" placeholder="请输入止盈" style="width: 200px"  v-model="stop.stopLoss"  @blur="stopBlur(0,stopRange(sellOrder).loss[1],stopRange(sellOrder).loss[0])"/>
          <!-- <span>{{stopRange(sellOrder).loss[0]}}-{{stopRange(sellOrder).loss[1]}}</span>    -->
          <span>股票下跌{{stopRate(stop.stopLoss)}}%</span>   
        </li>
      </ul>
      <p>需补充保证金:{{supplement}}元</p>
    </Modal>
  </div>
</template>

<script type="">
import { socket } from "@/assets/js/ws";
import nodata from "@/components/nodata";

export default {
  name: "sell",
  data() {
    return {
      sellParams:{
        id:'',//订单id
        stockCode:'',
        // stockNum:'',//平仓股数(分仓时必填)
        value:'1',//是否分仓 1 不分 2 分仓
        type:'0',//是否卖出委托 0 不委托 1 委托
        entrustPoint:undefined,//委托价格(委托卖出时,必填)
      },
      orders: [],//订单
      total: null,
      sellOrder:{},//平仓的订单
      sellShow:false,//显示平仓
      stopShow:false,//显示修改止盈止损
      stopLShow:false,
      stop:{//止盈止损参数
        id:'',
        stopProfit:null,
        stopLoss:null
      }
    };
  },
  computed: {
    params() {
      return {
        start: 0,
        rows: 10,
        type: 0, //状态(默认是0)：0 持仓 1 委托中持仓 2 取消委托持仓 3 行权申请 4 平仓 5 订单取消
        isSimulate: this.$route.params.simulate //1 不是 2 模拟
      }
    },
    //补充的保证金
    supplement(){
        let s=(this.stopRange(this.sellOrder).loss[1]-this.stop.stopLoss)*this.sellOrder.stockNum 
        if (this.sellOrder.stopLoss<this.stopRange(this.sellOrder).loss[1]) {
            s=(this.sellOrder.stopLoss-this.stop.stopLoss)*this.sellOrder.stockNum 
        }
        if (s<0) {
            return 0.00
        }
        return s.toFixed(2)
    },
  },
  components: {
    nodata
  },
  created() {    
    this.getorders().then(() => this.getMarket());
  },
  destroyed () {
     if (!this.orders.length) {
        return
      }
    this.socket.close()    
  },
  methods: {
    //止盈止损百分比
    stopRate(i,type){
      if (type) {
        if (i<=0) {
          return 0
        }
        if ((i-this.sellOrder.price)*100/i<0) {
          return 0
        }
       return ((i-this.sellOrder.price)*100/i).toFixed(2)
      }
      if (i<=0) {
          return 100
      }
      if ((this.sellOrder.price-i)*100/this.sellOrder.price<0) {
        return 0
      }
      return ((this.sellOrder.price-i)*100/this.sellOrder.price).toFixed(2)
    },    
    //打开修改止盈止损
    stopOpen(i,type){
      this.sellOrder=i;
      this.stop.stopProfit=null
      this.stop.stopLoss=null
      if (type) {
        this.stopShow=true;
        this.stop.stopProfit=this.sellOrder.stopProfit
        return
      }
      this.stopLShow=true
      this.stop.stopLoss=this.sellOrder.stopLoss
      

    },
    //止盈止损范围
      stopRange(i){        
        return{
          profit:[+(i.buyPoint*((+i.minStopProfitRatio)+1)).toFixed(2),+(i.buyPoint*((+i.maxStopProfitRatio)+1)).toFixed(2)],
          loss:[+(i.buyPoint*(1-(+i.minStopLossRatio))).toFixed(2),(+i.price-(((i.money*(1-i.maxStopLossRatio))/(i.marketValue))*i.price)).toFixed(2)]
        }
    },
    //限制止盈止损范围
    stopBlur(type,max,min){
      if (type) {
        if (this.stop.stopProfit>max) {
          this.stop.stopProfit=max
        }
        if (this.stop.stopProfit<min) {
          this.stop.stopProfit=min
        }
      }else{
        if (this.stop.stopLoss<max) {
          // this.stop.stopLoss=max
        }
        if (this.stop.stopLoss>min) {
          this.stop.stopLoss=min
        }
      }
    },
    //修改止盈止损
    updateStop(){
      if (!this.stop.stopProfit&&!this.stop.stopLoss) {
        this.$Message.warning('请至少修改一个')
        return
      }
      if (!this.stop.stopProfit) {
        this.stop.stopProfit=this.sellOrder.stopProfit
      }
      if (!this.stop.stopLoss) {
        this.stop.stopLoss=this.sellOrder.stopLoss
      }
      this.stop.id=this.sellOrder.id
      this.$axios.post('api/trade/update/stop',this.stop).then(res=>{
        if (!res.data.errorCode) {
            this.$Message.success('操作成功')
         }
        if (res.data.errorCode == 0) {
          this.getorders().then(() => this.getMarket());
        }
      })
    },
    //委托价格限制价格
    entrustBlur(){
      if (this.sellParams.entrustPoint>this.sellOrder.close*1.1) {
        this.sellParams.entrustPoint=(this.sellOrder.close*1.1).toFixed(2)
      }
      if (this.sellParams.entrustPoint<this.sellOrder.close*0.9) {
        this.sellParams.entrustPoint=(this.sellOrder.close*0.9).toFixed(2)
      }
    },
    //平仓
    sell(){
      if (this.sellParams.type==1&&!this.sellParams.entrustPoint) {
        this.$Message.warning('请输入委托价格')
        return false
      }
      this.sellParams.id=this.sellOrder.id
      this.sellParams.stockCode=this.sellOrder.stockCode
      this.$axios.post('api/trade/apply/for',this.sellParams).then(res=>{
        if (res.data.errorCode==0) {
          // this.$Message.success(res.data.data.retMsg)
          this.getorders().then(() => this.getMarket());
          this.$router.push(`/trade/${this.$route.params.simulate}/history`)          
        }
        
      })
    },
    //翻页
    changePage(p){
      this.params.start=(p-1)*this.params.rows
      this.getorders().then(() => this.getMarket());
    },
    //盈亏计算
    PAL(i){
      return {
        // PAL:((i.price-i.buyPoint)*i.stockNum).toFixed(2),
        // ratio:((i.price-i.buyPoint)*i.stockNum/i.money).toFixed(2)
        PAL:((i.price-i.buyPoint)*i.stockNum).toFixed(2),
        ratio:((i.price-i.buyPoint)/i.buyPoint*100).toFixed(2)

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
    //获取行情
    getMarket() {
      if (!this.orders.length) {
        return
      }
      let codes = [];
      this.orders.map((v, i) => {
        let indexCode = v.stockCode.substr(0, 1);
        // console.log(v);
        if (indexCode == 6) {
          codes.push(`sh${v.stockCode}`);
        } else {
          codes.push(`sz${v.stockCode}`);
        }
      });
      codes=Array.from(new Set(codes))
      this.socket=new socket(codes.join(","), data => {
        data.split("=").map((v, i) => {
          this.orders.map((item,index)=>{
            if (v.split(",")[0]==item.stockName) {
                  this.$set(item,'price',(+v.split(",")[3]).toFixed(2)) 
                  this.$set(item,'close',(+v.split(",")[2]).toFixed(2))      
            }
          })
          // console.log(v.split(","));
          
        });
      });
      //
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
