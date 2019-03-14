<template>
  <div class="">
    <!-- <router-view></router-view> -->
    <!-- <div class="stock-buy container"> -->
      <!-- <section class="play-area"> -->
        <!-- <nav>
          <ul class="clearfix">

            <li class="active">
              <router-link :to="{name:'buy',params: {type: this.$route.params.type}}">策略创建</router-link>
            </li>
            <li>
              <router-link :to="{name:'sell',params: {type: this.$route.params.type}}">当前委托</router-link>
            </li>
            <li>
              <router-link :to="{name:'entrust',params: {type: this.$route.params.type}}">当前持仓</router-link>
            </li>
            <li>
              <router-link :to="{name: 'settleAccount',params: {type: this.$route.params.type}}">历史持仓</router-link>
            </li>

          </ul>
        </nav> -->

        <!-- <section class="clearfix"> -->

          <div class="left-info">
            <header>
              <div class="change-stock clearfix">
                <i class="icomoon icon-search"></i>
                <input
                  id="searchTxt"
                  class="search_txt"
                  type="text"
                  placeholder="请输入股票名称/代码/拼音"
                  v-model="keywords"
                  @input="search"
                  @blur="searchFocus('')"
                  @focus="searchFocus(1)"
                >
                <button id="searchConfirm" class="searchConfirm" type="button" @click="search">搜索</button>
                <!-- <div id="search_history" class="search-table">
                  <table>
                    <thead>
                      <tr>
                        <th>名称</th>
                        <th>代码</th>
                        <th>简拼</th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </table>
                </div> -->
                <div id="search_cue" class="search-table" v-show="searchShow">
                  <table>
                    <thead>
                      <tr>
                        <th>名称</th>
                        <th>代码</th>
                        <th>简拼</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(i,index) in searchResult" :key="index" @click="codeChange(i.code)">
                        <td>{{i.name}}</td>
                        <td>{{i.code}}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="stock-name clearfix">
                <div class="stock-name-left">
                  <h4>{{market[0]}}</h4>
                  <p>{{marketCode}}</p>
                </div>
                <div class="stock-name-right " :class="(market[3] - market[2]).toFixed(2)>0?'red':'green'">
                  <h5 class="new">{{market[3]}}<i class="icomoon" :class="(market[3] - market[2]).toFixed(2)>0?'icon-up':'icon-down'"></i></h5>
                  <p>
                    <span class="top"><span>{{ (market[3] - market[2]).toFixed(2)}}</span></span>
                    <span class="bottom"><span>{{((market[3] - market[2])* 100 / market[2]).toFixed(2)}}</span>%</span>
                  </p>
                </div>

              </div>
            </header>

            <section class="stock-figure">
              <ul class="row">
                <li :class="chartsType==index?'active':''" @click="chartsType=index"  v-for="(i,index) in chartsTypeList" :key="index">{{i}}</li>
              </ul>
              <div class="figure" id="chart" >
                <div style="position: relative; overflow: hidden; width: 520px; ">

                  <div class="chart">
                    <div id="fEcharts" v-show="chartsType==0" style="height: 17.5rem;width: 520px;"></div>
                    <div id="kEcharts" v-show="chartsType==1" style="height: 17.5rem;width: 520px;"></div>
                  </div>

                </div>
              </div>
              <!-- <div class="figure" id="chartk">
                <div style="position: relative; overflow: hidden; width: 520px; ">
                  <div class="chart">
                    <div id="kEcharts" style="height: 17.5rem;width: 520px;"></div>
                  </div>

                </div>
              </div> -->
            </section>

            <section class="stock-info">
              <ul class="clearfix">
                <li class="open"><span>今开</span><span class="r"> {{market[1]}}</span></li>
                <li class="amplitude"><span>振幅</span><span class="r"> {{((market[4] - market[5]) / market[5] * 100).toFixed(2)=="NaN" ? 0 : ((market[4] - market[5]) / market[5] * 100).toFixed(2)}}</span></li>
                <li class="high"><span>最高</span><span class="r"> {{market[4]}}</span></li>
                <li class="low"><span>最低</span><span class="r"> {{market[5]}}</span></li>
                <li class="max"><span>涨停价</span><span class="r"> {{(market[2] * 1.1).toFixed(2)}}</span></li>
                <li class="min"><span>跌停价</span><span class="r"> {{(market[2] * 0.9).toFixed(2)}}</span></li>
                <li class="volume"><span>成交量</span><span class="r"> {{(market[8] / 100).toFixed(0)}}万</span></li>
                <li class="amount"><span>成交额</span><span class="r"> {{(market[9] / 10000).toFixed(0)}}万</span></li>
              </ul>
            </section>

            <section class="stock-detail">
              <div class="stock-percentage clearfix">
                <div class="buy">
                  <p>买盘</p>
                </div>
                <div class="sell">
                  <p>卖盘</p>
                </div>
              </div>
              <div class="stock-price clearfix">
                <ul class="buy">
                  <li v-for="(i,index) in buy5" :key="index"><em>{{index+1}}</em><b :class="i.price>=market[1]?'red':'greed'">{{i.price}}</b><i>{{i.vol}}</i></li>

                </ul>
                <ul class="sell">
                  <li v-for="(i,index) in sell5" :key="index"><em>{{index+1}}</em><b :class="i.price>=market[1]?'red':'greed'">{{i.price}}</b><i>{{i.vol}}</i></li>

                </ul>
              </div>
            </section>

          </div>

          <!--A股点买中的右边部分-->
          <div class="right-buy">
            <div class="buy_price">
              <p class="top">保&nbsp;&nbsp;证&nbsp;&nbsp;金
                <!-- <select class="f-right" style="border: none" v-model="tacticsType">
                  <option disabled>请先选择购买方式</option>
                  <option value="0">市价委托</option>
                  <option value="1">限价委托</option>
                </select>
                <span class="f-right">购买方式：</span> -->

              </p>
              <ul
                id="buy_price_ul"
                class="ul-list"
              >
                <li
                  @click="()=>{selectMoney=i}"
                  :class="selectMoney==i?'active':''"
                  v-for="(i,index) in moneyList"
                  :key="index"
                >{{i}}</li>
              </ul>
            </div>
            <div v-if="simulate==1">

              <p class="efficiency" v-show="tacticsType==1">
                <span>限&nbsp;价&nbsp;金&nbsp;额</span>
                <input type="number" placeholder="请输入金额" @blur="restrictBlur" v-model="restrictPoint">
                <span style="font-size: 14px;">委托范围: {{(market[2] * 0.9).toFixed(2)||'--.--'}}-{{(market[2] * 1.1).toFixed(2)||'--.--'}}</span>
              </p>

              <p class="efficiency"><span>保&nbsp;证&nbsp;金&nbsp;额</span><input
                  type="number"
                  v-model="selectMoney"
                  placeholder="请输入金额（整数）"
                >元</p>
              <!-- <p class="efficiency"><span>资金使用率</span> 可买入 股，资金利用率 %</p> -->
            </div>
           
            <div class="open-time c-div" v-if="simulate==1">
              <span>策&nbsp;略&nbsp;匹&nbsp;配</span>
              <div class="delay_tip">
                <ul
                  id="buy_price_ul"
                  class="ul-list c-list"
                >
                  <li
                    @click="()=>{selectBase=i}"
                    :class="selectBase==i?'active':''"
                    v-for="(i,index) in baseList"
                    :key="index"
                  >{{i}}倍</li>
                </ul>
              </div>
            </div>
            <div class="market_val">
                <span>{{numberOfShares}}股&nbsp;</span> 
                <i>市值{{marketValue}}万元</i>
            </div>

            <div class="check-surplus" v-if="simulate==1">
              <span>触&nbsp;发&nbsp;止&nbsp;盈</span>
              <div class="delay_tip">
                <i class="icon icon-help"></i>
                <div class="showtip">当合作交易品种的浮动盈亏率达到特定数值时，投资人有权即时卖出交易品种全部持有数量进行止盈。</div>
              </div>
              <!-- <ul id="check-surplus_ul">
                <li class="active"></li>
              </ul> -->
              <div class="surplus">
                <span @click="surplusChange(-1)">-</span>
                <input type="number" v-model="surplus" @blur="surplusBlur">
                <span @click="surplusChange(1)">+</span>
              </div>
              <div class="surplus_range">
                <span style="display:none;">{{surplusRange.min}}-{{surplusRange.max}}</span>
                <span>股票上涨{{stopRate(surplus,1)}}%</span>
              </div>
            </div>
            <div class="stop-loss choose-loss" id="stop-loss" v-if="simulate==1">
              <span>触&nbsp;发&nbsp;止&nbsp;损</span>
              <div class="delay_tip"><i class="icomoon icon-help"></i>
                <div class="showtip">当合作交易品种的浮动盈亏率达到特定数值时，投资人有权即时卖出交易品种全部持有数量进行止损。</div>
              </div>
              <div class="stoploss">
                <span @click="lossChange(-1)">-</span>
                <input type="number" v-model="loss" @blur="lossBlur">
                <span @click="lossChange(1)">+</span>
              </div>
              <div class="loss_range">
                <span  style="display:none;">{{lossRange.min}}-{{lossRange.max}}</span>
                <span>股票下跌{{stopRate(loss)}}%</span>
              </div>
            </div>
            <div class="com_fee" v-if="simulate==1">
              <span>建&nbsp;&nbsp;仓&nbsp;&nbsp;费&nbsp;&nbsp;</span>
              <div class="delay_tip"><i class="icomoon icon-help"></i>
                <div class="showtip">建仓费包含第一天的交易费，第二天的递延费，每万元点买金的建仓费为45元，每万元点买金的递延费18元/天。</div>
              </div>
              <span
                class="old"
                style="display: none;"
              ></span>
              <strong>{{createFee}}</strong>元（含前两个交易日的费用）
            </div>
            <!-- <div class="perf_bond">
              <span>交&nbsp;&nbsp;易&nbsp;&nbsp;费&nbsp;&nbsp;</span>
              <div class="delay_tip"><i class="icomoon icon-help"></i>
                <div class="showtip">交易建仓费是当策略人第一次发起时，策略人要支付给平台的费用，费用包括利息。此费用根据策略金额收取，在第一天收取，一般标准为48元/万（数据仅供参考，以实际平台公布为准）</div>
              </div>
              <strong>{{pingtaiFee}}</strong>元
            </div> -->
            <!-- <div class="delay_condition">
              <span>递&nbsp;延&nbsp;条&nbsp;件</span>
              <div class="delay_tip"><i class="icomoon icon-help"></i>
                <div class="showtip">满足以下两个条件，自动递延：1、不在黑名单股票，2、当策略满足公式：（浮动盈亏+保证金）/交易本金&gt;6%,并且余额够缴纳递延费。</div>
              </div>
              浮动盈亏小于<em>-</em>
            </div> -->
            <div class="delay_fee" v-if="simulate==1">
              <span>递&nbsp;&nbsp;延&nbsp;&nbsp;费&nbsp;&nbsp;</span>
              <div class="delay_tip"><i class="icomoon icon-help"></i>
                <div class="showtip">满足以下两个条件，自动递延：1、不在黑名单股票，2、当策略满足公式：（浮动盈亏+保证金）/交易本金&gt;6%,并且余额够缴纳递延费。</div>
              </div>
              <span class="old"></span> <em>{{fees.deferFee||0}}</em> 元/天/万元
                  <p style="display:inline-block;margin-left: 1rem;" class="protocol_row-agree"><input
                  type="checkbox"
                  id="isDefer"
                  v-model="isDefer"
                ><label for="isDefer"></label>自动递延</p>
              <!-- <p
                type="checkbox"
                class="red"
                style="margin-left: 20px"
              >使用递延费折扣券</p> -->
            </div>
            <!-- <div class="delay_fee">
              <span>管&nbsp;&nbsp;理&nbsp;&nbsp;费&nbsp;&nbsp;</span>
              <div class="delay_tip"><i class="icomoon icon-help"></i>
                <div class="showtip">策略持仓超过T+1时，第三个交易日起，策略人需要缴纳递延费用，扣费时间为14:40，直接从策略人平台余额中扣除。如策略人不想递延，请务必在第二个交易日的14:40分前发起卖出指令，否则视为要求递延，递延成功即扣费，扣费标准一般为18元/万（数据仅供参考，以实际平台公布为准）</div>
              </div>
              <span class="old"></span> <em>{{fees.manageFee||0}}</em> 元/天/千元
            </div> -->
            <div class="balance">
              <p>需支付{{totalPayment}}元</p>
              <p>账户余额{{userInfo.money}}元</p>
            </div>
            <div class="protocol_row">
              <p class="protocol_row-agree"><input
                  type="checkbox"
                  id="agree_pro"
                  checked
                  name="agree_pro"
                  v-model="xy"
                ><label for="agree_pro"></label>我已阅并签署以下协议</p>
              <ul>
                <li>
                  <a>《暂无协议》</a>
                </li>
              </ul>
            </div>
            <button id="btn_buy" class="color-btn " :class="in_time_range?'':'disabled'" @click="order">{{$route.params.simulate==2?'体验':''}}点买</button>
            <p style="text-align:center;margin-top:10px;">点买时间段： 交易日 09:30-11:30 | 13:00-15:00</p>
          </div>

          <!--模拟体验中的右边部分-->

          <div class="right-buy" style="display:none;">
            <div class="buy_price">
              <p class="top">点买金额
                <span>（只需支付100元就可以立刻获得元体验操盘账户）</span>
              </p>
              <ul class="ul-list">
                <li class=active></li>
              </ul>
            </div>
            <p class="efficiency"><span>资金使用率</span> 可买入 股，资金利用率 %</p>
            <div class="open-time">
              <span>持&nbsp;仓&nbsp;时&nbsp;间</span>
              <ul
                class="work-interval"
                style="margin-left: 50px;"
              >
                <li class="active">T+1|D</li>
              </ul>
            </div>
            <div class="check-surplus">
              <span>触&nbsp;发&nbsp;止&nbsp;盈</span>
              <ul style="margin-left: 50px">
                <li
                  class="active"
                  data-val="50"
                >%</li>
              </ul>
            </div>
            <div class="com_fee">
              <span>交易综合费</span>
              <strong style="margin-left:50px;">0</strong> 元
            </div>
            <div class="perf_bond">
              <span>履约保证金</span>
              <strong style="margin-left:50px;">100</strong>
            </div>
            <button class="color-btn">体验点买</button>
            <div class="protocol_row">
              <h4>点买时间段： 交易日 09:30-11:30 | 13:00-14:55</h4>
              <p class="protocol_row-agree"><input
                  type="checkbox"
                  id="agree_pro1"
                  checked=""
                  name="agree_pro"
                ><label for="agree_pro1"></label>我已阅并签署以下协议</p>
              <ul>
                <li>
                  <router-link :to="'/Policy/'">《》</router-link>
                </li>
              </ul>
            </div>
          </div>

        <!-- </section> -->

        <!-- <pointBuyVue></pointBuyVue> -->
      <!-- </section> -->
    <!-- </div> -->

  </div>
</template>

<script>
import echarts from "echarts";
import { chart, transformTool } from "../../assets/js/charts";
import { marketJudgment } from "@/assets/js/tool";
import { socket } from "@/assets/js/ws";
import $ from "jquery";
export default {
  name: "buy",
  data() {
    return {
      moneyList: [1000, 2000, 3000, 5000, 10000, 20000, 30000, 100000], //保证金
      selectMoney: 1000,//保证金
      baseList:[],//策略倍数
      selectBase:8,//选择的倍数
      surplus:0,//止盈止损
      loss:0,
      marketCode:sessionStorage.marketCode||'sh600036',//默认股票代码
      market:[],//最新行情
      fees:{},//费率
      tacticsType:0,// 策略类型 0 市价 1 限价
      restrictPoint:null,//限价委托价格
      sell5:[],//卖5
      buy5:[],//买5
      keywords:'',//关键词
      searchResult:[],//搜索结果
      searchShow:false,//搜索结果显示
      chartsType:0,
      chartsTypeList:['分时图','K线图'],//
      timer:null,
      time:{},//服务端获取的时间
      in_time_range:false,//是否在点买时间
      isDefer:1,//是否递延
      userInfo:{},//
      socket:null,
      xy:true,//协议
    };
  },
  computed: {
    //股数 : math.floor(保证金*倍数/当前价/100)*100   
    numberOfShares(){      
      const [money,base,price]=[this.selectMoney,this.selectBase,this.market[3]||0]
      if (price==0) {
        return 0
      }
     return Math.floor(money*base/price/100)*100

    },
    //市值 :  股数 * 当前价
    marketValue(){
      const price=this.market[3]||0
      if (isNaN(this.numberOfShares*price/10000)) {
        return 0.00
      }
      return (this.numberOfShares*price/10000).toFixed(2)
    },
    //止盈=保证金*倍数*（1+止盈率）
    surplusRange(){
      if (!this.fees.maxLoss) {
        return {
          min:0,
          max:0
        }
      }      
      const [money,base,maxBase,minBase]=[this.market[3]||0,this.selectBase,+this.fees.maxProfit+1,+this.fees.minProfit+1]
      //初始止盈
     if (money&&minBase) {
       if (!this.surplus) {
        this.surplus=((money)*minBase).toFixed(2)          
       }
     }
      return {
        min:(money*minBase).toFixed(2),
        max:(money*maxBase).toFixed(2)
      }
    },
    //止损=保证金*（1-止损率）
    lossRange(){
      if (!this.fees.maxLoss) {
        return {
          min:0,
          max:0
        }
      }            
      const [money,base,maxBase,minBase]=[this.market[3]||0,this.selectBase,(1-(+this.fees.maxLoss)),(1-(+this.fees.minLoss))]
      //初始止损
     if (money&&minBase) {
       if (!this.loss) {
        this.loss=(money*minBase).toFixed(2)
       }
     }
      console.log(this.numberOfShares*money);
      
      return {
        min:(money*minBase).toFixed(2),
        // max: (money-(((this.selectMoney*maxBase)/(((this.selectMoney*this.selectBase/this.market[3]/100)*100)*money))*money)).toFixed(2)
        max: (money-(((this.selectMoney*maxBase)/(this.numberOfShares*money))*money)).toFixed(2)


      }
    },
    // 建仓费 保证金 * 倍数/1000 向上取整 * 建仓费比例 
    createFee(){
     const [selectMoney,base,createFeeBase]=[this.selectMoney,this.selectBase,+this.fees.createFee]
    return (Math.ceil(selectMoney*base/10000)*createFeeBase).toFixed(2)
    },
    //交易费
    pingtaiFee(){
        const [selectMoney,base,pingtaiFee]=[this.selectMoney,this.selectBase,+this.fees.pingtaiFee]
        if (selectMoney*base<10000) {
          return 20.00
        }
        
       return (Math.ceil(selectMoney*base)*pingtaiFee).toFixed(2)
    },
    //总支付
    totalPayment(){
      if (this.simulate==2) {
        return 100
      }
      return +this.createFee+(+this.selectMoney)
    },
    simulate(){
      return this.$route.params.simulate
    }

  },
  created () {
    this.getMarket()
    this.getFees()
    this.setTimer()
    this.getUser()
    this.isSimulate()

  },
  mounted() {
    console.log(process.env);
    this.getChartData()
    this.chartKInit()
  
    
  },
  destroyed () {
    clearInterval(this.timer)
    this.socket.close() 
  },
  watch: {
    simulate(v){
      this.isSimulate()
      
    }
  },
  methods: {
    //止盈止损百分比
    stopRate(i,type){
      if (type) {
        if (i<=0) {
          return 0
        }
        if ((i-this.market[3])*100/i<0) {
          return 0
        }
       return ((i-this.market[3])*100/i).toFixed(2)
      }
      if (i<=0) {
          return 100
      }
      if ((this.market[3]-i)*100/this.market[3]<0) {
        return 0
      }
      return ((this.market[3]-i)*100/this.market[3]).toFixed(2)
    },
    //判断是否是模拟点买
    isSimulate(){
      if (this.simulate==2) {
          this.moneyList=[5000]
          this.selectMoney=this.moneyList[0]
        }else{
          this.moneyList=[1000, 2000, 3000, 5000, 10000, 20000, 30000, 100000]
          this.selectMoney=this.moneyList[0]
        }
    },
    //创建策略
    order(){
      // console.log(Number(this.marketCode.substr(2)));
      if (!this.xy) {
        this.$Message.error('勾选协议后交易!');
        return
      }
      if (!this.in_time_range) {
        this.$Message.error('不在交易时段!');
        return
      }
      if (this.tacticsType==1) {
         if (this.restrictPoint<(this.market[2] * 0.9).toFixed(2) || this.restrictPoint>(this.market[2] * 1.1).toFixed(2)) {
          this.$Message.warning('价格不在委托范围')
          return
        }
      }
      if (this.simulate==2) {
        if (this.userInfo.tradeSimulate==1) {
          this.$Modal.info({
              title: '提示',
              content: '您已体验过模拟点买!',
              onOk: () => {
                   this.$router.push(`/trade/1/`)
              },
          });
          return
        }
        this.surplus=((+this.m.price)*(1+(+this.fees.minProfit))).toFixed(2)     
        this.loss=((+this.m.price)*(1-(+this.fees.minLoss))).toFixed(2)
      }
      this.$axios({
        url:'api/trade/create/order',
        method:'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data:{
            "buyPrice": this.market[3],//股票现价
            "isDefer":+!this.isDefer,//是否递延
            "money": this.simulate==2?100:this.selectMoney,//保证金
            "restrictPoint": this.restrictPoint,//委托价
            "rightMoneyRatio": this.selectBase,//倍数
            "simulate": this.$route.params.simulate,//是否模拟点买 1否 2是
            "stockCode": (this.marketCode.substr(2)),//股票代码
            "stockName": this.market[0],//股票名字
            "stopLoss": this.loss,//止损
            "stopProfit": this.surplus,
            "tacticsType":this.tacticsType,// 策略类型 0 市价 1 限价
          }
      }).then(res=>{
        if (res.data.errorCode === 0) {
          // this.$Message.success(res.data.data.retMsg);
          this.userInfo.money=res.data.data.userMoney
          if (this.tacticsType==0) {
            this.$router.push(`/trade/${this.$route.params.simulate}/sell`)
          }else{
            this.$router.push(`/trade/${this.$route.params.simulate}/entrust`)
          }
          
        }
      })
    },
    //设置判断是否在交易时间的定时器
    setTimer(){
      if (this.timer) {
        clearInterval(this.timer)
        this.timer=null
      }
      this.Date()
     this.timer=setInterval(()=>{
        // console.log(this.time.time,this.time_range('9:29','11:30',this.time.time)||this.time_range('12:59','15:00',this.time.time));
        this.Date()
        
      },3000)
    },
    //获取行情
    getMarket(){
      if(this.socket){
        // console.log(this.socket);
        this.socket.close()         
      }
     this.socket=new socket(this.marketCode,(data)=>{
        // console.log(data.split('=')[1].split(','));
        this.market =data.split('=')[1].split(',')
        
        this.getChartData()

         //卖5
          if (this.sell5.length) {
              [this.sell5,this.buy5]=[[],[]]
            }   
          for (let i = 5; i >0; i--) {
            // console.log((+this.market[29 - i * 2]).toFixed(2),(+this.market[28 - i * 2] / 100).toFixed(0));  
            this.sell5.push({
              price:(+this.market[29 - i * 2]).toFixed(2),
              vol:(+this.market[28 - i * 2] / 100).toFixed(0)
            })
          }
          //买5
          for (let i = 0; i < 5; i++) {
            // console.log((+this.market[11 + i * 2]).toFixed(2),(+this.market[10 + i * 2] / 100).toFixed(0));
            this.buy5.push({
              price:(+this.market[11 + i * 2]).toFixed(2),
              vol:(+this.market[10 + i * 2] / 100).toFixed(0)
            })
          }
        
      })
      // $.ajax({
      //   type:'get',
      //   url:`https://hq.sinajs.cn/list=${this.marketCode}`,
      //   cache: true,
      //   async: false,
      //   dataType: 'script',
      //   success:()=>{
      //     this.market = eval("(" + [`hq_str_${this.marketCode}`] + ")").split(",");
      //     console.log( eval("(" + [`hq_str_${this.marketCode}`] + ")"));
          
      //     //卖5
      //     if (this.sell5.length) {
      //         [this.sell5,this.buy5]=[[],[]]
      //     }   
      //     for (let i = 5; i >0; i--) {
      //       // console.log((+this.market[29 - i * 2]).toFixed(2),(+this.market[28 - i * 2] / 100).toFixed(0));  
      //       this.sell5.push({
      //         price:(+this.market[29 - i * 2]).toFixed(2),
      //         vol:(+this.market[28 - i * 2] / 100).toFixed(0)
      //       })
      //     }
      //     //买5
      //     for (let i = 0; i < 5; i++) {
      //       // console.log((+this.market[11 + i * 2]).toFixed(2),(+this.market[10 + i * 2] / 100).toFixed(0));
      //       this.buy5.push({
      //         price:(+this.market[11 + i * 2]).toFixed(2),
      //         vol:(+this.market[10 + i * 2] / 100).toFixed(0)
      //       })
      //     }
          
      //   }
      // })
    },
    //获取分时线数据
    getChartData(){
      $.ajax({
        type: 'GET',
        url: `https://hq.sinajs.cn/list=ml_${this.marketCode}`,
        data: {},
        cache: true,
        async: false,
        dataType: 'script',
        success:()=>{
          var sChartData = eval("(" + [`hq_str_ml_${this.marketCode}`] + ")")
          // console.log(sChartData)
         var result=transformTool.fB( transformTool.db(sChartData),false,"CN");
         console.log(result);
         
          var chartVal = [];
          result.forEach(function(i, index) {
            // console.log(i);
            var inVal = [];
            if (i.price >= 0) {
              var dVal = new Date().format("yyyy-MM-dd");
              
              var s1arr1 = dVal.split("-");
              var s1arr2 = i.time.split(":");
              if (s1arr2.length == 2) {
                s1arr2.push("00");
              }

              var rVal = new Date(
                s1arr1[0],
                s1arr1[1] - 1,
                s1arr1[2],
                s1arr2[0],
                s1arr2[1],
                s1arr2[2]
              ).getTime();
              inVal.push(rVal);
              inVal.push(i.price);
              chartVal.push(inVal);
            }
            // console.log(inVal);
            // console.log(chartVal);
          });
          console.log(this.market[2]);
          var json = {
            records: chartVal,
            y_close: +this.market[2]
          };
            console.log(json);
            if (document.querySelector('#fEcharts')){
              chart(echarts).chartLine.init("#fEcharts", json);
            }
        }})


   
    },
    //获取k线数据
    chartKInit(){
      //  service.Ajax({
      //       url: "Market/GetCurrentMarket?stockNumber=" + curStock[3],
      //       data: {},
      //       type: m_cfg.GET,
      //       module: m_cfg.API,
      //       login: false,
      //       cache: true,
      //       success: function (json) {
      //           if (json.success) {
                    
      //           } else {
      //               //chartKInit_old();
      //           }
      //       }
      //   });
      // http://118.190.104.207/www_eastmoney_com/api/js?cb=jQuery111004440308607556287_1546590959127&rtntype=5&isCR=false&id=6000361&type=k&_=1546590959132
      // http://118.190.104.207/www_eastmoney_com/api/js?cb=jQuery331003205356847210061_1546591444488&rtntype=5&isCR=false&id=600036&type=k&_=1546591444493
      $.ajax({
        url: 'http://118.190.104.207/www_eastmoney_com/api/js',
        data: 'rtntype=5&isCR=false&id=' + this.marketCode.slice(2)+marketJudgment(this.marketCode.slice(2)) +'&type=' + 'k',
        type: 'GET',
        async: false,
        dataType: 'jsonp',
        jsonp: 'cb',
        success: function (data) {
            let [res,total]=[data.data.slice(data.data.length-200,data.data.length),[]]
            res.forEach((i,index)=>{
              let [item,val]=[i.split(','),[]]
              val.push(item[0],+item[1],+item[3],+item[4],+item[2],+item[5])
              total.push(val)
              // console.log(val);
            })
            console.log(total);
            var json = {
                "records": total
            };
            console.log(json);
            if (document.querySelector('#kEcharts')) {
              chart(echarts).chartK.init("#kEcharts", json);
            }
            
        }
      });
      //  var arr='2019-01-03,24.40,24.88,25.05,24.38,374108,929035568,2.73%,0.18'.split(',')
      // // height: arr[3],low:arr[4],close:[2],open:arr[1]
      //     var data = [{amount: 929035600,
      //         basic_info_id: 1942,
      //         close: 24.88,
      //         day: "2019-01-03T00:00:00",
      //         dea: -0.818,
      //         dif: -1.044,
      //         high: 25.05,
      //         id: 7317696,
      //         low: 24.38,
      //         ma5: 24.87,
      //         ma10: 25.316,
      //         ma20: 26.93,
      //         ma30: 27.453,
      //         macd: -0.45,
      //         open: 24.4,
      //         volume: 374108}];
      //     var chartVal = [];
      //     $.each(data, function (i, n) {
      //         var inVal = [];
      //         var xVal = n.day.substring(0, 10);
      //         inVal.push(xVal);
      //         inVal.push(n.open);
      //         inVal.push(n.high);
      //         inVal.push(n.low);
      //         inVal.push(n.close);
      //         inVal.push(n.volume);
      //         chartVal.push(inVal);
      //     });

    },
    //获取费率
    getFees(){
      this.$axios.post('api/trade/params').then(res=>{
        console.log(res);
        if (!res.data.errorCode) {
          this.fees=res.data.data
          this.baseList=this.fees.lever.split(',')
        }
      })
    },
    //止盈变化
    surplusChange(num){
      if (num>0) {
        if (+this.surplus+0.01>+this.surplusRange.max) {
          return
        }
        this.surplus=(+this.surplus+0.01).toFixed(2)
      }else{
        if (+this.surplus-0.01<+this.surplusRange.min) {
          return
        }
        this.surplus=(+this.surplus-0.01).toFixed(2)
      }
    },
    //止盈失去焦点
    surplusBlur(){
      if (+this.surplus>+this.surplusRange.max) {
        this.surplus=this.surplusRange.max
          return
      }
      if (+this.surplus<+this.surplusRange.min) {
        this.surplus=this.surplusRange.min
        return
      }
    },
     //止损变化
    lossChange(num){
      if (num>0) {
        if (+this.loss+0.01>+this.lossRange.min) {
          return
        }
        this.loss=+(this.loss+0.01).toFixed(2)
      }else{
        if (+this.loss-0.01<+this.lossRange.max) {
          return
        }
        this.loss=+(this.loss-0.01).toFixed(2)
      }
    },
    //止盈失去焦点
    lossBlur(){
      if (+this.loss>+this.lossRange.max) {
        this.loss=this.lossRange.max
          return
      }
      if (+this.loss<+this.lossRange.min) {
        this.loss=this.lossRange.min
        return
      }
    },
    //限价委托范围
    restrictBlur(){      
      if(this.restrictPoint<(this.market[2] * 0.9).toFixed(2)){
        // this.restrictPoint=(this.market[2] * 0.9).toFixed(2)
        return
      }
      if(this.restrictPoint>(this.market[2] * 1.1).toFixed(2)){
        // this.restrictPoint=(this.market[2] * 1.1).toFixed(2)
      }
    },
    //搜索
    search(){
      this.$axios.post(`api/trade/stock/search?searchContent=${this.keywords}`).then(res=>{
        if (!res.data.errorCode) {
            this.searchResult=res.data.data
            console.log(this.searchResult);
        }
      })  
    },
    //搜索框获取焦点
    searchFocus(bool){
      if (bool) {
        this.searchShow=true
      }else{
        setTimeout(() => {
          this.searchShow=false
        }, 200);
      }
    },
    //切换股票代码
    codeChange(code){
      let indexCode = code.substr(0,1)
      if (indexCode==6) {
        this.marketCode=`sh${code}`
      }else{
        this.marketCode=`sz${code}`
      }
        sessionStorage.marketCode=this.marketCode
        this.getMarket()
        this.getChartData()  
    },
    //获取当前时间
    Date(){
        this.$axios.post('api/trade/new/date').then(res=>{
          this.time=res.data.data
          this.in_time_range=this.time_range('9:29','11:30',this.time.time)||this.time_range('12:59','15:00',this.time.time)
        })
    },
    //判断时间范围
    time_range (beginTime, endTime, nowTime) {
        var strb = beginTime.split (":");
        if (strb.length != 2) {
            return false;
        }

        var stre = endTime.split (":");
        if (stre.length != 2) {
            return false;
        }

        var strn = nowTime.split (":");
        if (stre.length != 2) {
            return false;
        }
        var b = new Date ();
        var e = new Date ();
        var n = new Date ();

        b.setHours (strb[0]);
        b.setMinutes (strb[1]);
        e.setHours (stre[0]);
        e.setMinutes (stre[1]);
        n.setHours (strn[0]);
        n.setMinutes (strn[1]);

        if (n.getTime () - b.getTime () > 0 && n.getTime () - e.getTime () < 0) {
            return true;
        } else {
            // alert ("当前时间是：" + n.getHours () + ":" + n.getMinutes () + "，不在该时间范围内！");
            return false;
        }
    },
    //获取用户信息
    getUser(){
      this.$axios.post('api/user/query_user_msg').then(res=>{
        if (!res.data.errorCode) {
          this.userInfo=res.data.data
          
        }
      })
    }
  }
};
</script>

<style scoped lang='less'>
input:focus {
    box-shadow: 0 0 6px 0 #ff4519;
    outline: none;
    border: 1px solid #ff4519;
}
#searchTxt:focus{
    box-shadow:none;
    border-left: none;
    border-right: none;
}
.market_val{
  text-align: right;
}
.c-div{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.check-surplus,.stop-loss{
  display: flex;
  align-items: center;

}
  .surplus,.stoploss{
    display: flex;
    span{
      border: 1px solid #ff4519;
      display: inline-block;
      line-height: 2rem;
      padding:0 1rem;
      cursor: pointer;
    }
    input{
      width: 4rem;
      text-align: center;
      border: 1px solid #ff4519;
      border-right: 0;
      border-left: 0;
    }
  }
.loss_range,.surplus_range{
  margin-left: 2rem;
}
.check-surplus,.stop-loss,.com_fee{
  margin-top: 10px;
}




.stock-sell-section {
  padding-top: 20px;
  padding-bottom: 40px;
  background: url(../../../public/img/buyBG.jpg) no-repeat left top;
  background-size: 100%;
  min-width: 1585px;
}
.stock-buy {
  height: 970px;
}
.container {
  width: 1200px;
  min-width: 1200px;
  margin: 0 auto;
  position: relative;
}
.stock-buy .play-area {
  background-color: white;
  // box-shadow: 0 0 5px 1px rgba(143, 38, 14, 0.1);
  padding-left: 4px;
}
.stock-buy .play-area > nav {
  height: 70px;
  line-height: 66px;
}
.stock-buy .play-area > nav li.active {
  border-bottom: 4px solid #ff4519;
}
.stock-buy .play-area > nav li {
  width: 25%;
  float: left;
  text-align: center;
}
.stock-buy .play-area > nav li.active > a {
  color: #ff4519;
}
.stock-buy .play-area > nav a {
  font-size: 30px;
  color: #c7c7c7;
  display: block;
}
.stock-buy .play-area > section {
  padding: 40px 50px 20px;
  box-sizing: border-box;
}
.stock-buy .left-info {
  width: 570px;
  float: left;
  border-right: 1px solid #f1f1f1;
  position: relative;
  padding-right: 50px;
  box-sizing: border-box;
}
.stock-buy .right-buy {
  width: 480px;
  float: right;
  color: #4c4c4c;
  font-size: 16px;
}
.stock-buy .change-stock {
  width: 520px;
  height: 40px;
  margin: 0px auto;
  font-size: 16px;
}
.stock-buy .left-info .stock-name {
  margin-top: 30px;
  vertical-align: middle;
}
.change-stock .icon-search {
  display: block;
  width: 40px;
  text-align: right;
  font-size: 18px;
  color: #c7c7c7;
  float: left;
  line-height: 40px;
  border-top: 1px solid #ff4519;
  border-left: 1px solid #ff4519;
  border-bottom: 1px solid #ff4519;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.change-stock .search_txt {
  width: 310px;
  line-height: 38px;
  border-radius: 0px;
  float: left;
  border-top: 1px solid #ff4519;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid #ff4519;
  padding: 1px 0;
  padding-left: 10px;
}
.change-stock .searchConfirm {
  float: left;
  display: block;
  width: 158px;
  color: white;
  line-height: 40px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: #ff4519;
  border: 1px solid #ff4519;
  cursor: pointer;
  outline: none;
  padding: 0;
}
.search-table {
  width: 460px;
  top: 50px;
  border: 1px solid #ff4519;
  border-radius: 5px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  position: absolute;
  z-index: 10;
  background-color: white;
  padding: 0 30px;
}
#search_cue {
  max-height: 450px;
  overflow: auto;
}
.search-table table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}
.search-table table th {
  font-size: 16px;
  color: #808080;
  line-height: 44px;
  font-weight: 500;
  border-bottom: 1px solid #c7c7c7;
  width: 33.33%;
}
.search-table table tbody tr {
  cursor: pointer;
  color: rgba(0, 0, 0, 0.8);
}
.search-table table tbody tr:hover {
  color: #ff4519;
}
.stock-buy .change-stock .empty td {
  border: none;
  cursor: default;
  text-align: center;
}
.search-table table td {
  text-align: center;
  width: 33.33%;
  line-height: 40px;
}
.search-table {
  width: 460px;
  top: 50px;
  border: 1px solid #ff4519;
  border-radius: 5px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  position: absolute;
  z-index: 10;
  background-color: white;
  padding: 0 30px;
}
.hide {
  display: none;
}
.stock-buy .left-info .stock-name {
  margin-top: 30px;
  vertical-align: middle;
}
.stock-buy .left-info .stock-name-left {
  float: left;
}
.stock-buy .left-info .stock-name-left h4 {
  font-size: 30px;
  color: #4c4c4c;
  font-weight: normal;
}
.stock-buy .left-info .stock-name label {
  font-size: 20px;
  margin-left: 10px;
}
.stock-buy .left-info .stock-name-left p {
  font-size: 18px;
  color: #808080;
}
.stock-buy .left-info .stock-name-right {
  float: right;
  text-align: right;
}
.red {
  color: #ff4519 !important;
}
.stock-buy .left-info .stock-name-right h5 {
  font-size: 30px;
  font-weight: normal;
}
.stock-buy .left-info .stock-name-right p {
  font-size: 18px;
  line-height: 1;
}
.stock-buy .left-info .stock-name-right span {
  padding-left: 20px;
}
.stock-buy .left-info i.icon-refresh {
  float: right;
  display: block;
  font-size: 30px;
  padding-top: 14px;
  color: #808080;
  cursor: pointer;
}
.stock-buy .stock-figure {
  width: 520px;
  margin-top: 10px;
}
.stock-buy .stock-figure li {
  cursor: pointer;
  display: inline-block;
  font-size: 16px;
  color: #c7c7c7;
  width: 60px;
  text-align: center;
  line-height: 30px;
  position: relative;
}
.stock-buy .stock-figure li.active {
  color: #ff4519;
}
.group:after,
.container:after,
.field-wrapper:after,
.row:after {
  content: " ";
  display: block;
  height: 0;
  overflow: hidden;
  clear: both;
}
.stock-buy .figure {
  width: 520px;
  margin-top: 16px;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  background: none;
  cursor: default;
}
.stock-buy .stock-info {
  margin-top: 20px;
  color: #808080;
  font-size: 14px;
}
.stock-buy .stock-info li {
  width: 25%;
  margin-bottom: 8px;
  float: left;
}
.stock-buy .stock-info span.l {
  margin-right: 10px;
}
.stock-buy .right-buy {
  width: 480px;
  float: right;
  color: #4c4c4c;
  font-size: 16px;
}
.stock-buy .buy_price .top {
  font-size: 18px;
}
.stock-buy .buy_price .top > span {
  font-size: 14px;
  color: #ff4519;
}
.f-right {
  float: right;
}
.stock-buy .play-area .right-buy select,
.stock-buy .play-area .right-buy ul,
.stock-buy .play-area .right-buy li,
.stock-buy .play-area .right-buy label,
.stock-buy .play-area .right-buy em,
.stock-buy .play-area .right-buy b,
.stock-buy .play-area .right-buy i {
  display: inline-block;
  font-style: normal;
  font-weight: normal;
}
.stock-buy .buy_price b {
  width: 22px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  background-color: #ffdad1;
  color: #ff4519;
  margin: 0 5px;
  border-radius: 3px;
}
.right-buy .buy_price ul {
  width: 490px;
  margin-top: 10px;
}
.right-buy .ul-list li {
  width: 110px;
  float: left;
  height: 40px;
  margin-top: 8px;
  margin-right: 10px;
  border: 1px solid #e6e6e6;
  border-radius: 5px;
  text-align: center;
  line-height: 40px;
  font-size: 16px;
  cursor: pointer;
}
.open-time .delay_tip .c-list li.active{
  font-size: 16px;
}
.right-buy .c-list li{
    width: 50px;
    float: left;
    height: 40px;
    margin-top: 8px;
    margin-right: 10px;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    cursor: pointer;
}

.right-buy p.efficiency {
  line-height: 20px;
  margin-top: 10px;
}
.right-buy .efficiency > span {
  margin-right: 50px;
}
.right-buy .efficiency > input {
  padding: 6px;
  border: 1px solid #ff4519;
  border-radius: 5px;
  margin-right: 10px;
  font-size: 16px;
}
.right-buy .open-time {
  margin-top: 10px;
}
.right-buy .open-time > span,
.right-buy .check-surplus > span,
.right-buy .stop-loss > span,
.right-buy .com_fee > span,
.right-buy .perf_bond > span,
.right-buy .delay_condition span,
.right-buy .delay_fee span,
.right-buy .efficiency > span {
  line-height: 44px;
  font-size: 18px;
}
.delay_tip {
  position: relative;
  display: inline-block;
  margin-right: 10px;
}
.delay_tip i {
  margin-right: 6px;
  vertical-align: middle;
  color: #5cb1ff;
  font-size: 30px;
}
.delay_tip:hover .showtip{
  display: block;
}
.delay_tip > div.showtip {
  display: none;
  font-size: 12px;
  position: absolute;
  width: 242px;
  line-height: 18px;
  padding: 10px;
  top: -20px;
  left: 40px;
  color: #666;
  border-radius: 5px;
  border: 1px solid #f2df1c;
  z-index: 999;
  background-color: #fffde7;
  text-align: justify;
}
.delay_tip > div.showtip {
  display: none;
  font-size: 12px;
  position: absolute;
  width: 242px;
  line-height: 18px;
  padding: 10px;
  top: -20px;
  left: 40px;
  color: #666;
  border-radius: 5px;
  border: 1px solid #f2df1c;
  z-index: 999;
  background-color: #fffde7;
  text-align: justify;
}
.delay_tip > div.showtip:after {
  position: absolute;
  top: 30px;
  left: -5px;
  content: " ";
  width: 10px;
  height: 10px;
  background-color: #fffde7;
  transform: rotate(45deg);
  border-left: 1px solid #f2df1c;
  border-bottom: 1px solid #f2df1c;
}
.right-buy .open-time li.active,
.right-buy .check-surplus li.active,
.right-buy .com_fee strong,
.right-buy .perf_bond strong,
.right-buy .delay_condition em {
  color: #ff4519;
  font-size: 20px;
  font-weight: normal;
}
.right-buy .ul-list li.active {
  background-color: #ff4519;
  border: 1px solid #ff4519;
  color: #fff;
}
.right-buy .com_fee .old,
.right-buy .delay_fee .old {
  text-decoration: line-through;
  color: #ff4519;
  font-size: 20px;
}
.right-buy .delay_fee em {
  color: #ff4519;
  font-size: 20px;
  font-weight: normal;
}
.disabled {
  background: #c7c7c7 !important;
  color: #fff !important;
}
.color-btn {
  width: 100%;
  display: block;
  height: 40px;
  line-height: 40px;
  margin-top: 16px;
  background-color: #ff4519;
  border-radius: 5px;
  color: white;
  font-size: 20px;
  position: relative;
  cursor: pointer;
  outline: 0;
}
.color-btn.disabled:before,
.color-btn.disabled:after {
  background-color: #eeeeee;
}
.color-btn:before {
  content: " ";
  display: block;
  position: absolute;
  top: 0;
  right: 55px;
  width: 20px;
  height: 40px;
  -moz-transform: skewX(-45deg);
  -webkit-transform: skewX(-45deg);
  -o-transform: skewX(-45deg);
  -ms-transform: skewX(-45deg);
  transform: skewX(-45deg);
  background-color: #ff7807;
}
.color-btn:after {
  content: " ";
  display: block;
  position: absolute;
  top: 0;
  right: 84px;
  width: 6px;
  height: 40px;
  -moz-transform: skewX(-45deg);
  -webkit-transform: skewX(-45deg);
  -o-transform: skewX(-45deg);
  -ms-transform: skewX(-45deg);
  transform: skewX(-45deg);
  background-color: #ff7807;
}
.stock-buy .right-buy > div.protocol_row {
  margin-top: 20px;
  margin-bottom: 10px;
}
.protocol_row-agree {
  position: relative;
  line-height: 46px;
  padding-left: 10px;
  font-size: 14px;
  color: #808080;
}
.protocol_row-agree input[type="checkbox"] {
  width: 16px;
  height: 16px;
  opacity: 0;
}
.protocol_row-agree input:checked + label {
  background-color: #ff4519;
}
.protocol_row-agree label {
  position: absolute;
  left: 4px;
  top: 14px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #c7c7c7;
}
.protocol_row-agree input + label:after {
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
.protocol_row a {
  display: block;
  font-size: 14px;
  line-height: 1.9;
  color: #5cb1ff;
}
input:focus {
  outline: none;
}
.right-buy .ul-list li:hover {
    box-shadow: 0 0 6px 0 #ff4519;
    outline: none;
    border: 1px solid #ff4519!important;
  color: #ff4519;
}
.right-buy .ul-list li.active {
  background-color: #ff4519;
  border: 1px solid #ff4519;
  color: #fff;
}
.protocol_row h4 {
  font-size: 16px;
  color: #4c4c4c;
  line-height: 60px;
  font-weight: normal;
}
.stock-buy .stock-detail {
  margin-top: 20px;
}
.stock-buy .stock-percentage .buy {
  float: left;
  text-align: left;
  color: #ff4519;
  width: 50%;
}
.stock-buy .stock-percentage .sell {
  float: right;
  text-align: right;
  color: #00d47d;
  width: 50%;
}
.stock-buy .stock-percentage p {
  font-size: 16px;
}
.stock-buy .stock-price {
  margin-top: 8px;
}
.stock-buy .stock-detail ul {
  width: 50%;
  float: left;
}
.stock-buy .stock-detail em {
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 16px;
  font-size: 14px;
  color: white;
  text-align: center;
  border-radius: 3px;
  margin-left: 16px;
}
.stock-buy .stock-detail .buy em {
  background-color: #ff4519;
}
.stock-buy .stock-detail b {
  font-size: 14px;
  padding-left: 10px;
  line-height: 16px;
}
.stock-buy .stock-detail i {
  float: right;
  color: #4d4d4d;
  font-size: 14px;
  padding-right: 10px;
}
.stock-buy .stock-detail em {
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 16px;
  font-size: 14px;
  color: white;
  text-align: center;
  border-radius: 3px;
  margin-left: 16px;
}
.stock-buy .stock-detail .sell em {
  background-color: #00d47d;
}
.green {
  color: green !important;
}
.stock-buy .buy_price .top > select {
  font-size: 14px;
  color: #ff4519;
}
.stock-buy .stock-figure li.active:after {
    content: " ";
    display: block;
    position: absolute;
    width: 14px;
    bottom: 0;
    left: 40%;
    height: 2px;
    background-color: #ff4519;
}
</style>
