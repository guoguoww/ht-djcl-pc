<template>
    <section class="page-personal">
      <div class="container clearfix">
        <Affix>
          <aside class="col-left">
            <!--头像账号-->
            <div class="user-img">
              <!--<img src="../../../public/img/user-img.png" style="width: 44%;">-->
              <div class="imgUpload">
                <img id="myImg" :src="user.userHeader? user.userHeader : userHeaderUrl" alt="">
                <div class="file">
                  <input type="file" name="file" accept="image/*" @change="changImg($event)">
                </div>
              </div>
              <p>欢迎回来</p>
              <h4 id="shared_layout_mem_lnm">{{user.nickName}}</h4>
            </div>
            <!--菜单-->
            <h5>我的资产</h5>
            <ul>
              <li :class="{'active':router === '/user'}">
                <router-link to="/user">我的资产</router-link>
              </li>
              <li :class="{'active':router === '/user/topUp'}">
                <router-link to="/user/topUp">充值</router-link>
              </li>
              <li :class="{'active':router === '/user/withdrawal'}">
                <router-link to="/user/withdrawal">提现</router-link>
              </li>
            </ul>
            <h5>我的账户</h5>
            <ul>
              <li :class="{'active':router === '/user/bankCard'}">
                <router-link to="/user/bankCard">银行卡管理</router-link>
              </li>
              <li :class="{'active':router === '/user/security'}">
                <router-link to="/user/security">账户安全</router-link>
              </li>
            </ul>
          </aside>
        </Affix>
        <aside class="col-right">
          <router-view></router-view>
        </aside>
      </div>
    </section>
</template>

<script>
  import url from '../../../public/img/user-img.png'
  export default {
    name: "user",
    data() {
      return {
        user: {}, //获取信息
        userData: {}, //传递子路由信息
        userHeader: '', //头像
        userHeaderUrl: url, //本地头像
      }
    },
    computed: {
      router() {
        return this.$route.path;
      }
    },
    created() {
      this.getUserData()
    },
    methods: {
      getUserData() { //获取个人信息
        this.userData = new Promise(resolve => {
          this.$axios.post('/api/user/query_user_msg').then(res => {
            if (res.data.errorCode === 0) {
              this.user = res.data.data;
              resolve(res.data.data)
            }
          })
        })
      },
      changImg(e) { //上传图片回显
        var that = this;
        for (var i = 0; i < e.target.files.length; i++) {
          var file = e.target.files.item(i);
          if (!(/^image\/.*$/i.test(file.type))) {
            continue; //不是图片 就跳出这一次循环
          }
          if(e.target.files[i].size > 1048576) { //大小不能超过1M
            this.$Message.warning('头像大小不能超过1M');
            continue
          }
          //实例化FileReader API
          var freader = new FileReader();
          freader.readAsDataURL(file);
          freader.onload = function(e) {
            that.userHeader = e.target.result;
            that.submit();
            // document.getElementById('myImg').setAttribute('src',e.target.result);
          }
        }
      },

      submit() { //提交修改头像
        this.$axios({
          url: "/api/user/update/header",
          method: "post",
          data: {
            header: this.userHeader, //头像
          }
        }).then(res=>{
          if(res.data.errorCode === 0){
            this.$Notice.success({
              title: '上传成功',
            });
            this.getUserData();
          }
        })
      },
    },
  }
</script>

<style scoped lang="less">
  /*最外围盒子*/
  .page-personal {
    background: url('../../../public/img/product-bg.jpg') no-repeat center center;
    padding: 40px 0;
  }
  .container {
    width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
    position: relative;
  }

  /*左侧导航*/
  .page-personal .col-left {
    background-color: white;
    width: 240px;
    height: 634px;
    float: left;
    text-align: center;
    color: #4c4c4c;
  }
  /*头像信息*/
  .page-personal .col-left img {
    padding: 20px 0 10px;
  }
  .page-personal .col-left .user-img {
    /*position: relative;*/
    /*头像上传*/
    .imgUpload {
      width: 44%;
      margin: 0 auto;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      .file {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        color: #f7ffff;
        text-align: center;
        overflow: hidden;
        font-style: normal;
        input[name="file"] {
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          position: absolute;
          left: 0;
        }
        span {
          position: absolute;
          left: 52%;
          bottom: 0.5rem;
          font-size: 0.7rem;
        }
      }
    }

  }

  .page-personal .col-left .user-img p {
    font-size: 14px;
    line-height: 1;
  }
  .page-personal .col-left .user-img h4 {
    font-size: 16px;
    font-weight: normal;
    margin-top: 10px;
    line-height: 1;
    margin-bottom: 16px;
  }
  /*菜单*/
  .page-personal .col-left ul li {
    line-height: 46px;
  }
  .page-personal .col-left li.active a {
    color: #ff4519;
  }
  .page-personal .col-left a {
    font-size: 18px;
    color: #4c4c4c;
    display: block;
  }
  .page-personal .col-left h5 {
    font-size: 14px;
    text-align: left;
    font-weight: normal;
    margin-left: 55px;
    line-height: 32px;
  }

  /*右侧内容*/
  .page-personal .col-right {
    float: right;
    width: 940px;
    min-height: 634px;
    color: #4c4c4c;
  }
</style>
