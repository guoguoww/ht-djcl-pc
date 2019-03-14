<template>
    <section class="article">
      <!--交易动态全部-->
      <div class="container">
        <div class="deals" v-if="router === '1'">
          <h4>交易动态</h4>
          <div id="trading" class="trade-scroll">
            <ul>
              <li class="clearfix" v-for="item in dealsList.list">
                <span>{{item.chnName}}</span>
                <span>{{parseInt((Date.parse(new Date()) - Date.parse(new Date(item.buyTime)))/1000/60)}}分钟前</span>
                <span>谋略</span>
                <router-link class="goToBuyNow" to="/trade/1">{{item.stockName}}[{{item.stockCode}}]</router-link>
              </li>
            </ul>
          </div>
          <div class="page" v-if="dealsList.total > page.rows">
            <Page :total="dealsList.total" :page-size="page.rows" size="small" show-total show-elevator @on-change="pageChange"/>
          </div>
        </div>

        <!--公告全部-->
        <div class="notice" v-if="router === '2'">
          <h4>公告</h4>
          <div id="conNews" class="trade-scroll">
            <ul id="conNews1">
              <li class="clearfix" v-for="item in noticeList.list" @click="openContentDetails(item)">
                <p>
                  <a href="javascript: void (0)" class="fl" title="item.title">{{item.title}}</a>
                  <span class="fr">{{item.createTime}}</span>
                </p>
              </li>
            </ul>
          </div>
          <div class="page" v-if="noticeList.total > page.rows">
            <Page :total="noticeList.total" :page-size="page.rows" size="small" show-total show-elevator @on-change="pageChange"/>
          </div>
        </div>

        <!--资讯全部-->
        <div class="news" v-if="router === '3'">
          <h4>资讯</h4>
          <div class="trade-scroll">
            <ul>
              <li class="clearfix" v-for="item in newsList.list">
                <p>
                  <a :href="item.url" target="_blank" class="fl" :title="item.title">{{item.title}}</a>
                  <span class="fr">{{item.createTime}}</span>
                </p>
              </li>
            </ul>
          </div>
          <div class="page" v-if="newsList.total > page.rows">
            <Page :total="newsList.total" :page-size="page.rows" size="small" show-total show-elevator @on-change="pageChange"/>
          </div>
        </div>
      </div>

      <!--朦版-->
      <div class="mask" id="mask"></div>
      <!--公告详情-->
      <div class="popup" id="popupCon">
        <div class="bar-percentage">
          <i class="icomoon icon-error" id="close-popupCon" @click="closeContentDetails()"></i>
        </div>
        <h3>{{contentDetails.title}}</h3>
        <div class="details" v-html="contentDetails.content"></div>

      </div>

    </section>
</template>

<script>
  import $ from "jquery";
  export default {
    name: "index",
    data() {
      return {
        dealsList: {
          total: 0, //总条数
          list: [], //交易动态列表
        },
        noticeList: {
          total: 0, //总条数
          list: [], //交易动态列表
        },
        newsList: {
          total: 0, //总条数
          list: [], //新闻资讯列表
        },
        page: {
          start: 0, //第多少天
          rows: 13, //页容量
        },
        contentDetails: {}, //模态框内容详情
      }
    },
    computed: {
      router() {
        return this.$route.params.id;
      }
    },
    mounted() {
      this.choose();
    },
    methods: {

      choose() {
        switch (this.router) {
          case '1':
            this.getDeals();
            break;
          case '2':
            this.getNotice();
            break;
          case '3':
            this.getNews();
            break;
        }
      },

      getDeals() { //获取最新交易
        this.$axios({
          url: '/api/home/trade/deals',
          method: 'post',
          data: this.page
        }).then(res => {
          if(res.data.errorCode === 0) {
            this.dealsList.list = res.data.data.data
            this.dealsList.total = res.data.data.total
          }
        })
      },

      getNotice() { //获取首页公告
        this.$axios({
          url: '/api/home/notice',
          method: 'post',
          data: this.page
        }).then(res => {
          if(res.data.errorCode === 0) {
            this.noticeList.list = res.data.data.data
            this.noticeList.total = res.data.data.total
          }
        })
      },

      getNews() { //获取新闻资讯
        this.$axios({
          url: '/api/home/stock/news',
          method: 'post',
          data: this.page
        }).then(res => {
          if(res.data.errorCode === 0) {
            this.newsList.list = res.data.data.data
            this.newsList.total = res.data.data.total
          }
        })
      },

      pageChange(page) { //分页
        this.page.start = (page - 1) * this.page.rows;
        this.choose();
      },

      openContentDetails(conDetails) { //获取详情
        this.contentDetails = conDetails;
        $('#mask').css({'display':'block','zIndex': '1002'});
        $('#popupCon').css({'display': 'block'}).animate({top: "150px"},100);
      },
      closeContentDetails() {
        this.contentDetails = {};
        $('#mask').css({'display':'none','zIndex': '1000'});
        $('#popupCon').css({'display': 'none'});
      }

    }
  }
</script>

<style scoped>
    .article {
      background: #fff;
      min-height: 708px;
      border-top: 1px dashed #e5e5e5;
    }
    .container {
      width: 1200px;
      min-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }
    .container h4 {
      font-size: 20px;
      padding-left: 10px;
      line-height: 40px;
    }
    .trade-scroll li{
      line-height: 50px;
      text-align: center;
      font-size: 14px;
      color: #4c4c4c;
    }
    .deals li span{
      display: block;
      float: left;
      width: calc(100% / 5);
    }

    .notice li, .news li {
      line-height: 50px;
      text-align: center;
      font-size: 14px;
      color: #4c4c4c;
    }
    .notice li:not(:last-child), .news li:not(:last-child) {
      border-bottom: 1px dashed #f2f2f2;
    }
    .notice li span, .news li span{
      display: block;
      float: left;
      width: calc(100% / 5);
    }
    .notice li p, .news li p {
      width: 97%;
      text-align: left;
      padding-left: 3%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    .notice li p a, .news li p a {
      width: 60%;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }

    .notice li p span, .news li p span {
      width: 40%;
      text-align: right;
    }
    .deals .item li a:hover, .notice li p a:hover, .news li p a:hover {
      color: #57a3f3;
    }

    /*分页*/
    .page {
      margin: 10px 0;
      text-align: center;
    }

    /*朦版*/
    .mask {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1000;
      background: rgba(0,0,0,0.4);
    }
    /*弹出框*/
    .popup {
      display: none;
      position: fixed;
      z-index: 1001;
      left: 50%;
      top: 0;
      width: 500px;
      background-color: #ffffff;
      box-shadow: 0 0 6px 0 #ffd9d0;
      -moz-transition-duration: .4s;
      -webkit-transition-duration: .4s;
      transition-duration: .4s;
      border-radius: 10px;
    }
    #popupCon {
      width: 800px;
      margin-left: -400px;
      max-height: 600px;
      z-index: 1003;
      overflow-y: auto;
      overflow-x: hidden;
    }
    #popupCon .bar-percentage {
      width: 440px;
      height: 6px;
      border-radius: 3px;
      margin: 40px auto 0;
      position: relative;
    }
    #popupCon .bar-percentage .icon-error {
      position: absolute;
      top: -30px;
      right: -160px;
      font-size: 30px;
      /*color: white;*/
      cursor: pointer;
    }
    #popupCon h3 {
      text-align: center;
    }
    #popupCon .details {
      line-height: 22px;
      font-size: 14px;
      padding: 30px;
    }
</style>