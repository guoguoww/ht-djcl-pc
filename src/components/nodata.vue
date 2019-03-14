<template>
  <div class="data-empty">
    <div id="stock-sell-no-record">
      <p>暂无数据，请先创建策略</p>
      <router-link
        :to="`/trade/${$route.params.simulate}`"
        class="color-btn router-link-active"
      >立即去点买</router-link>
    </div>
  </div>
</template>

<script type="">
export default {
  name: "nodata",
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>

<style scoped lang="less">
.data-empty {
  display: block;
  text-align: center;
  font-size: 26px;
  color: #bbb;
  padding-top: 40px;
  .color-btn {
    display: block;
    height: 40px;
    line-height: 40px;
    background-color: #ff4519;
    border-radius: 5px;
    color: #fff;
    font-size: 20px;
    position: relative;
    cursor: pointer;
    width: 220px;
    margin: 30px auto;
    &:after,
    &:before {
      content: " ";
      display: block;
      position: absolute;
      top: 0;
      height: 40px;
      transform: skewX(-15deg);
      background-color: #ff7807;
    }
    &:before {
      right: 10px;
      width: 20px;
    }
  }
}
#stock-sell-no-record {
  background-color: #fff;
  margin-top: -60px;
  text-align: center;
  height: 500px;
  box-shadow: 0 1px 5px 0 rgba(143, 38, 14, 0.1);
  p {
    color: #ff4519;
    font-size: 24px;
    line-height: 70px;
    padding-top: 112px;
  }
}
</style>
