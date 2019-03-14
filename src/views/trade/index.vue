<template>
  <div class="">
    <div class="stock-sell-section">
        <div class="stock-buy stock-sell container">
            <section class="play-area">
                <nav>
                    <ul class="clearfix">
                       <router-link tag="li" active-class="active" v-for="(i,index) in nav" :key="index" :to="i.path">
                          <a>{{i.name}}</a>
                        </router-link>
                    </ul>
                </nav>
            </section>
            <section id="stock-sell-record" class="stock-record-list">
                  <section class="play-area">
                    <section class="clearfix" :style="this.$route.path!='/trade/buy'?style:''">
                      <router-view />
                    </section>
                  </section>
              
            </section>
        </div>
    </div>
  </div>
</template>

<script type="">
export default {
  name:"trade",
  data() {
    return {
        //   nav:[
        //       {name:'策略创建',path:`/trade/buy`},
        //       {name:'当前委托',path:'/trade/entrust'},
        //       {name:'当前持仓',path:'/trade/sell'},
        //       {name:'历史持仓',path:'/trade/history'},
        //     ],
            style:{'padding':'40px 20px 20px'}
    }
  },
  created () {
    // console.log(this.$route.params.simulate);
    
    
  },
  computed: {
      param(){
          return this.$route.params.simulate
      },
      nav(){
          return [
              {name:'策略创建',path:`/trade/${this.param}/buy`},
            //   {name:'当前委托',path:`/trade/${this.param}/entrust`},
              {name:'当前持仓',path:`/trade/${this.param}/sell`},
              {name:'历史持仓',path:`/trade/${this.param}/history`},
            ]
      }
  },
  methods: {

  },
}
</script>

<style scoped lang="less">
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
      li {
          width: 33.33%;
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
