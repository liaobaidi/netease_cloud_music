<template>
  <div class="header flex flex-acenter">
    <van-icon class-prefix="net" name="xiangzuo-jiantou" color="#fff" class="icon-size" @click="router.go(-1)" />
    <div class="marginLeft10">我的等级</div>
  </div>
  <div class="main">
    <div class="part-1 flex flex-col flex-acenter flex-center">
      <div class="logo">
        <van-image :src="url" width="100%" height="100%" round />
      </div>
      <div class="current">
        当前等级: <span>Lv.{{ userInfo.level }}</span>
      </div>
      <div class="progress relative">
        <span class="absolute tages" v-for="item in 11" :key="item" :style="`left: ${(item - 1) * 9.8}%`">{{ item - 1 }}</span>
        <van-progress :percentage="percentage" pivot-text="" color="linear-gradient(to right, #f5c4c4, #d03333)" />
        <div class="description">等级数据每天下午2点更新</div>
      </div>
    </div>
    <div class="part-2">
      <div class="currentFree">当前等级特权</div>
      <ul>
        <li v-for="item in info" :key="item">{{ item }}</li>
      </ul>
    </div>
    <div class="part-3">
      <div class="part-3-header">
        距离下一个等级: <span>Lv.{{ userInfo.level + 1 }}</span>
      </div>
      <div class="part-3-main flex flex-ard flex-acenter">
        <div class="flex flex-col flex-acenter flex-ard">
          <van-circle v-model:current-rate="needSongs" :stroke-width="60" layer-color="#eee" color="#f67b7b" :text="`还需${userInfo.nextPlayCount - userInfo.nowPlayCount}首`" />
          <span style="font-size: 3.6vw; margin-top: 1vh">听歌量</span>
        </div>
        <div class="flex flex-col flex-acenter">
          <van-circle v-model:current-rate="needDays" :stroke-width="60" layer-color="#eee" color="#0ec1e1" :text="`还需${userInfo.nextLoginCount - userInfo.nowLoginCount}天`" />
          <span style="font-size: 3.6vw; margin-top: 1vh">登录天数</span>
        </div>
      </div>
    </div>
    <div class="padding4vw tips">听歌量是指累计播放的歌曲次数而非播放次数，并且实际播放时间过短的歌曲将不纳入计算，每天最多计算300首。</div>
  </div>
</template>

<script>
import { getLevelInfo } from '@/api/user.js'
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref } from 'vue'
export default {
  name: 'MyLevel',
  setup(props, context) {
    const router = useRouter()
    const routes = useRoute()
    let { url } = routes.query
    let userInfo = reactive({})
    let percentage = ref(0)
    let info = reactive([])
    let needSongs = ref(0)
    let needDays = ref(0)

    getLevelInfo().then((res) => {
      // console.log(res, 'getLevelInfo')
      if (res.code === 200) {
        Object.assign(userInfo, res.data)
        let data = res.data
        percentage.value = parseInt(data.progress.toFixed(2)) + data.level * 10
        info.push(...data.info.split('$'))
        needSongs.value = Math.floor(data.nowPlayCount / data.nextPlayCount) * 100
        needDays.value = Math.floor(data.nowLoginCount / data.nextLoginCount) * 100
      }
    })

    return {
      router,
      url,
      userInfo,
      percentage,
      info,
      needSongs,
      needDays
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  width: 100vw;
  padding: 0 4vw;
  height: 6vh;
  line-height: 6vh;
  top: 0;
  left: 0;
  z-index: 9;
  position: fixed;
  background-color: var(--theme-color);
}
.main {
  overflow: hidden;
  width: 100%;
  height: 100vh;
  padding-top: 6vh;
  background-color: #eeeeee;
  .part-1 {
    height: 27vh;
    background-color: #fff;
    .logo {
      width: 8vh;
      height: 8vh;
    }
    .current {
      font-size: 4.6vw;
      font-weight: 500;
      color: #000;
      margin-top: 1vh;
      span {
        font-weight: bold;
        color: #d03333;
        font-style: italic;
        font-family: serif;
      }
    }
    .progress {
      margin-top: 5vh;
      width: 90%;
      .tages {
        width: 10%;
        top: -56%;
        color: #d03333;
        font-size: 2.4vw;
      }
      .description {
        font-size: 2.6667vw;
        margin-top: 1vh;
        color: rgb(183, 183, 183);
      }
    }
  }
  .part-2 {
    height: 24vh;
    background-color: #fff;
    margin-top: 1px;
    color: #000;
    padding: 3vh 4vw 0;
    .currentFree {
      font-size: 4vw;
      line-height: 2;
    }
    li {
      font-size: 2.4vw;
      color: rgb(84, 84, 84);
      list-style: inside;
      line-height: 2;
      &::marker {
        color: #f67b7b;
      }
    }
  }
  .part-3 {
    height: 30vh;
    background-color: #fff;
    margin-top: 2vh;
    color: #000;
    padding: 2vh 4vw 0;
    .part-3-header {
      height: 2vh;
      font-size: 2.4vw;
      color: rgb(121, 120, 120);
      span {
        color: #d03333;
        font-weight: bold;
        font-family: 'Times New Roman', Times, serif;
        font-style: italic;
        font-size: 3.6vw;
      }
    }
    .part-3-main {
      height: 25vh;
    }
  }
  .tips {
    font-size: 2.4vw;
    color: rgb(144, 144, 144);
  }
}
</style>
