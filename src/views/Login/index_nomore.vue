<template>
  <div class="container">
    <div>
      <van-icon name="cross" color="#d6857d" size="24" />
    </div>
    <div class="text-center marginTop20">
      <van-image src="./static/img/logo.png" />
    </div>
    <div class="phone">
      <div class="number flex flex-center">
        <div class="flex marginRight10">{{ 15013376050 }}</div>
        <div class="triggle flex">
          <svg-icon icon-class="triggle" @click="toPhone" />
        </div>
      </div>
      <div class="flex flex-center serve marginTop10">中国移动提供认证服务</div>
      <div class="marginTop20 login">
        <van-button round size="large">
          <span class="font-weight500" style="color: red">
            一键登录
            <van-tag type="danger" plain round>推荐</van-tag>
          </span>
        </van-button>
      </div>
      <div class="flex flex-center flex-acenter marginTop10">
        <van-checkbox v-model="checked" checked-color="#ee0a24" shape="square" icon-size="10px">
          <span style="color: rgba(255, 255, 255, 0.6)">同意</span>
        </van-checkbox>
        <a href="javascript:;" class="marginLeft10" @click="dialog">服务条款、隐私政策</a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { Dialog } from 'vant'
import { useRouter } from 'vue-router'
export default {
  name: 'Login',
  setup() {
    const checked = ref(true)
    const router = useRouter()
    const dialog = () => {
      Dialog.alert({
        message: '同意条款才可以登录哦',
        theme: 'round-button',
        confirmButtonColor: '#d81d06',
        className: 'dialog'
      })
    }
    const toPhone = () => {
      router.push({ path: '/phone', name: 'phone' })
    }
    return {
      checked,
      dialog,
      toPhone
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  padding: 6.6667vw 5.3333vw 0;
  background-color: #d81d06;
  .phone {
    margin-top: 20vh;
    .number {
      font-size: 4vw;
      .triggle {
        width: 4vw;
        height: 4vw;
        border-radius: 2vw;
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
    .serve {
      font-size: 3.2vw;
      color: rgba(255, 255, 255, 0.6);
    }
    .login {
      padding: 0 8.6667vw;
    }
  }
}
</style>
