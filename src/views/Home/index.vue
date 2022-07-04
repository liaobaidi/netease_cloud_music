<template>
  <div class="home-container">
    <router-view />
    <van-tabbar v-model="active" :border="false" route placeholder inactive-color="#848486" active-color="#d03333">
      <van-tabbar-item name="find" to="/home/find" icon-prefix="net" icon="netlogo">发现</van-tabbar-item>
      <van-tabbar-item name="play" to="/home/play" icon-prefix="net" icon="leida">播客</van-tabbar-item>
      <van-tabbar-item name="mine" to="/home/mine" icon-prefix="net" icon="yinle">我的</van-tabbar-item>
      <van-tabbar-item name="like" to="/home/like" icon-prefix="net" icon="friend">关注</van-tabbar-item>
      <van-tabbar-item name="community" to="/home/community" icon-prefix="net" icon="medium">云村</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'Home',
  setup() {
    const active = ref('find')
    return {
      active
    }
  }
}
</script>

<style lang="scss">
.home-container {
  width: 100vw;
  height: 100vh;
}
</style>
