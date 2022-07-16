<template>
  <div class="header fixed flex flex-acenter">
    <div class="absolute" @click="router.go(-1)">
      <van-icon class-prefix="net" name="xiangzuo-jiantou" class="icon-size" />
    </div>
    <div class="music-name relative flex flex-center">
      <span style="width: 80%" class="van-ellipsis text-center"
        >{{ info.name }}<span v-if="info.alia && info.alia.length">({{ info.alia[0] }})</span></span
      >
      <span class="absolute author-name">{{ info.ar && getAuthors(info.ar) }}</span>
    </div>
  </div>

  <div class="main relative flex flex-col flex-acenter">
    <div class="bg absolute" :style="info.al && `background-image:url(${info.al.picUrl})`" />
    <div class="cover">
      <van-image :src="info.al && info.al.picUrl" round fit="cover" width="100%" height="100%" @click="ImagePreview([info.al.picUrl])" />
    </div>
    <div class="lyc">
      <div class="lyc-wrap">
        <div v-for="(item, key, index) in lyr" :key="key">
          <p :class="['flex flex-center flex-acenter', currentTime >= +key && currentTime < +key + (keyArr[index + 1] - keyArr[index]) ? 'active' : '']">{{ scrollLyc(item, +key, index) }}</p>
        </div>
      </div>
    </div>
    <div class="audio-wrap flex flex-col flex-ard">
      <div class="top flex flex-bet flex-acenter">
        <div>
          <van-icon v-if="!like" name="like-o" size="4vh" @click="follow(true)" />
          <van-icon v-else name="like" size="4vh" color="#d03333" @click="follow(false)" />
        </div>
        <div>
          <van-icon class-prefix="net" name="xiazai" size="4vh" @click="download" />
        </div>
      </div>
      <div class="bottom flex flex-bet flex-acenter">
        <div>
          <van-icon class-prefix="net" name="liebiaoxunhuan" size="4vh" />
          <!-- <van-icon class-prefix="net" name="suijibofang" size="4vh" />
          <van-icon class-prefix="net" name="hanhan-01-01" size="4vh" /> -->
        </div>
        <div>
          <van-icon class-prefix="net" name="48shangyishou" size="4vh" />
        </div>
        <div>
          <van-icon class-prefix="net" name="bofang" size="5vh" />
          <!-- <van-icon class-prefix="net" name="zanting" size="5vh" /> -->
        </div>
        <div>
          <van-icon class-prefix="net" name="49xiayishou" size="4vh" />
        </div>
        <div>
          <van-icon class-prefix="net" name="24gf-playlist" size="3vh" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { getMusicDetail, getLyric, getMusicUrl, likeMusic, getLikeList } from '@/api/music.js'
import { reactive, ref, toRefs } from '@vue/reactivity'
import { getAuthors } from '@/utils'
import { nextTick, onActivated, onMounted, onUnmounted } from '@vue/runtime-core'
import { ImagePreview } from 'vant'
import { useStore } from 'vuex'
export default {
  name: 'Listen',
  props: {
    id: {
      type: [Number, String],
      default: ''
    }
  },
  setup(props) {
    const router = useRouter()
    const store = useStore()
    const { id } = toRefs(props)
    let info = reactive({})
    let current_id = ref(id.value)
    let lyr = reactive({})
    let keyArr = reactive([])
    let url = ref('')
    let audio = null
    let likeList = reactive([])
    let like = ref(false)

    const init = () => {
      getLikeList({ uid: store.getters.userid }).then((res) => {
        // console.log(res, 'store')
        if (res.code === 200) {
          likeList.push(...res.ids)
          if (likeList.includes(+current_id.value)) {
            like.value = true
          } else {
            like.value = false
          }
        }
      })

      getMusicDetail({ ids: current_id.value }).then((res) => {
        console.log(res, 'getMusicDetail')
        if (res.code === 200) {
          Object.assign(info, res.songs[0])
        }
      })
      getLyric({ id: current_id.value }).then((res) => {
        // console.log(res, 'getLyric')
        if (res.code === 200) {
          let data = res.lrc.lyric.split('\n')
          data.pop()
          // console.log(data)
          let regTime = /\[\d\d:\d\d\.\d+\]/g
          let regContent = /[^\[\d\d:\d\d\.\d+\]][.\u4e00-\u9fa5]*/g
          data.forEach((item) => {
            let tempkey = item.match(regTime)[0]
            let content = item.match(regContent)
            let reg = /\d+/g
            let min = tempkey.match(reg)[0]
            let sec = tempkey.match(reg)[1]
            let mini = tempkey.match(reg)[2]
            let key = min * 60 + parseInt(sec)
            if (parseInt(mini) * 0.01 > 1) {
              key += parseInt(mini) * 0.001
            } else {
              key += parseInt(mini) * 0.01
            }
            keyArr.push(key)
            if (content) {
              lyr[key] = content.join('')
            } else {
              lyr[key] = ''
            }
          })
          // console.log(lyr)
        }
      })
      getMusicUrl({ id: current_id.value }).then((res) => {
        // console.log(res, 'getMusicUrl')
        if (res.code === 200) {
          url.value = res.data[0].url
          audio.src = url.value
        }
      })
    }
    init()
    let player = null
    let lycWrap = null
    let currentTime = ref(0)
    let durationTime = ref(0)
    onMounted(() => {
      nextTick(() => {
        audio = document.querySelector('.myaudio')
        player = document.querySelector('#player')
        lycWrap = document.querySelector('.lyc-wrap')
        player.addEventListener('timeupdate', __currentTime)
        player.addEventListener('canplay', __durationTime)
      })
    })
    onUnmounted(() => {
      player.removeEventListener('timeupdate', __currentTime)
      player.removeEventListener('canplay', __durationTime)
      console.log('被摧毁了')
    })
    const __currentTime = () => {
      currentTime.value = parseInt(player.currentTime)
    }
    const __durationTime = () => {
      durationTime.value = parseInt(player.duration)
    }
    const scrollLyc = (item, key, index) => {
      if (currentTime.value >= key && currentTime.value < key + (keyArr[index + 1] - keyArr[index])) {
        lycWrap.style.transform = `translateY(${12 - 4 * index}vh)`
      }
      return item
    }

    onActivated(() => {
      // console.log(id.value, 'id')
      if (current_id.value === id.value) {
        return
      }
      current_id.value = id.value
      for (let key in lyr) {
        delete lyr[key]
      }
      keyArr.length = 0
      init()
    })

    const follow = (key) => {
      likeMusic({ id: current_id.value, like: key })
      if (key) {
        like.value = true
      } else {
        like.value = false
      }
    }

    const download = (url, fileName = info.name + '.mp3') => {
      const el = document.createElement('a')
      el.style.display = 'none'
      el.setAttribute('target', '_blank')
      fileName && el.setAttribute('download', fileName)
      el.href = url.value
      document.body.appendChild(el)
      el.click()
      document.body.removeChild(el)
    }
    return {
      router,
      info,
      url,
      lyr,
      like,
      currentTime,
      durationTime,
      keyArr,
      getAuthors,
      scrollLyc,
      ImagePreview,
      follow,
      download
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 6vh;
  padding: 0 4vw;
  z-index: 9;
  .icon-size {
    z-index: 1;
  }
  .music-name {
    width: 100%;
    margin-top: -1vh;
    .author-name {
      bottom: -3vh;
      font-size: 3.6667vw;
      color: #b5b5b5;
    }
  }
}

.main {
  width: 100%;
  min-height: 100vh;
  padding-top: 6vh;
  z-index: 1;
  .bg {
    width: 100%;
    min-height: 94vh;
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    -webkit-filter: blur(180px);
    filter: blur(180px);
    z-index: -1;
  }
  .cover {
    width: 25vh;
    height: 25vh;
    margin-top: 15vh;
    animation: circle 40s linear infinite forwards;
  }
  .lyc {
    width: 98%;
    height: 24vh;
    margin-top: 6vh;
    overflow: hidden;
    font-size: 4vw;
    .lyc-wrap {
      height: 100%;
      transform: translateY(12vh);
      transition: transform 0.6s ease-out;
      p {
        height: 4vh;
        &.active {
          font-size: 5vw;
          color: rgb(209, 193, 89);
          transition: font-size 0.6s ease-out;
        }
      }
    }
  }
  .audio-wrap {
    margin-top: 6vh;
    width: 100%;
    height: 14vh;
    .top {
      width: 100%;
      height: 4vh;
      padding: 0 8vw;
    }
    .bottom {
      padding: 0 8vw;
    }
  }
}
@keyframes circle {
  0% {
    transform-origin: center;
    transform: rotate(0);
  }
  100% {
    transform-origin: center;
    transform: rotate(360deg);
  }
}
</style>
