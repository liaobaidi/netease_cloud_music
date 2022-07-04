<template>
  <van-popup v-model:show="show" :style="{ height: '100vh', width: '85vw', backgroundColor: 'var(--theme-color)' }" teleport="body" position="left">
    <div class="flex flex-col flex-acenter flex-bet popup-container">
      <div class="flex flex-col flex-acenter flex-bet" style="height: 26vh">
        <van-image :src="userInfo.avatarUrl || ''" round width="20vh" height="20vh" />
        <div>
          <span>{{ userInfo.nickname || '' }}</span>
          <van-icon name="arrow" />
        </div>
      </div>
      <van-button @click="showClose" type="primary" block color="#2c2c2c" class="logout" style="color: #d03333">退出登录/关闭</van-button>
    </div>
  </van-popup>
  <van-action-sheet v-model:show="close">
    <template #description>
      <div class="dec">退出登录/关闭</div>
    </template>
    <template #default>
      <div v-for="item in actions" :key="item.name" class="actions" @click="handlerClose(item.name)">{{ item.name }}</div>
    </template>
  </van-action-sheet>
  <div class="flex flex-bet flex-acenter header-container">
    <div @click="showPopup">
      <van-icon name="wap-nav" size="6vw" />
    </div>
    <div>
      <slot name="search" />
    </div>
    <div>
      <slot name="right" />
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { getUserInfo } from '@/api/user.js'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
export default {
  name: 'Header',
  setup(props, context) {
    let show = ref(false)
    let close = ref(false)
    const store = useStore()
    const router = useRouter()
    let userid = store.getters.userid
    let userInfo = reactive({})
    const actions = [
      { name: '关闭云音乐', color: '#fff' },
      { name: '退出登陆', color: '#fff' }
    ]
    const showPopup = () => {
      show.value = true
      // console.log(userid, ' userid')
      getUserInfo({ uid: userid }).then((res) => {
        // console.log(res, 'userinfo')
        if (res.code === 200) {
          Object.assign(userInfo, res.profile)
        }
      })
    }
    const showClose = () => {
      close.value = true
    }
    const handlerClose = (key) => {
      if (key === '关闭云音乐') {
        window.opener = null
        window.open(import.meta.env.VITE_APP_CLOSE_API, '_self')
        window.close()
        return
      }
      store.dispatch('user/logout').then((res) => {
        if(res.code === 200) {
          Toast.success('您已退出登录')
          router.push({ name: 'login', path: '/login' })
        }
      })
    }
    return {
      show,
      userInfo,
      close,
      actions,
      showPopup,
      showClose,
      handlerClose
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/func.scss';
.header-container {
  position: fixed;
  left: 0;
  top: 0;
  padding: 0 4vw;
  width: 100vw;
  height: 8vh;
  background-color: var(--theme-color);
  z-index: 99;
}
.popup-container {
  width: 100%;
  height: 75vh;
  margin-top: 25vh;
  padding: 0 2vw 0 4vw;
  .logout {
    font-size: 4vw;
    line-height: 100%;
    margin-bottom: 25vh;
  }
}
.dec,
.actions {
  padding-left: 4vw;
  text-align: left;
  height: getvh(100);
  line-height: getvh(100);
  background-color: var(--sub-theme-color);
  color: var(--theme-text-color);
  font-size: getvh(20);
}
.actions {
  font-size: getvh(36);
}
</style>
