<template>
  <div class="header fixed flex flex-acenter">
    <div class="absolute" @click="router.go(-1)">
      <van-icon class-prefix="net" name="xiangzuo-jiantou" class="icon-size" />
    </div>
    <div class="music-name relative flex flex-center">
      <span style="width: 80%" class="van-ellipsis text-center"
        >{{ info.name }}<span v-if="info.alia && info.alia.length">({{ info.alia[0] }})</span></span
      >
      <span style="width: 40%" class="absolute author-name text-center van-ellipsis">{{ info.ar && getAuthors(info.ar) }}</span>
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
          <van-icon class-prefix="net" name="xiazai" size="4vh" @click="download(info.name + '.mp3')" />
        </div>
      </div>
      <div class="bottom flex flex-bet flex-acenter">
        <div>
          <van-icon v-if="play_type === 0" class-prefix="net" name="liebiaoxunhuan" size="4vh" @click="triggle" />
          <van-icon v-if="play_type === 1" class-prefix="net" name="suijibofang" size="4vh" @click="triggle" />
          <van-icon v-if="play_type === 2" class-prefix="net" name="hanhan-01-01" size="4vh" @click="triggle" />
        </div>
        <div>
          <van-icon class-prefix="net" name="48shangyishou" size="4vh" @click="play_previous" />
        </div>
        <div>
          <van-icon v-if="pause" class-prefix="net" name="bofang" size="5vh" @click="pause = false" />
          <van-icon v-else class-prefix="net" name="zanting" size="5vh" @click="pause = true" />
        </div>
        <div>
          <van-icon class-prefix="net" name="49xiayishou" size="4vh" @click="play_next" />
        </div>
        <div>
          <van-icon class-prefix="net" name="gengduo-shuxiang" size="4vh" @click="showMore = true" />
        </div>
      </div>
    </div>
  </div>
  <van-action-sheet v-model:show="showMore">
    <template #description>
      <div class="description van-ellipsis">{{ info.name }}</div>
    </template>
    <template #default>
      <div class="cart flex flex-center flex-acenter">
        <div class="inner-cart">
          <div class="flex flex-acenter flex-bet" @click="toArtist(null, info.ar)">
            <div><van-icon name="contact" size="3vh" /></div>
            <div class="cart-info flex flex-acenter van-ellipsis">
              <span>??????: {{ info.ar && getAuthors(info.ar) }}</span>
            </div>
          </div>
          <div class="flex flex-acenter flex-bet" @click="toArtist(info.originSongSimpleData, info.ar)">
            <van-icon class-prefix="net" name="friend" size="3vh" />
            <div class="cart-info flex flex-acenter van-ellipsis">
              <span>?????????: {{ info.originSongSimpleData ? getAuthors(info.originSongSimpleData.artists) : info.ar && getAuthors(info.ar) }}</span>
            </div>
          </div>
          <div class="flex flex-acenter flex-bet" @click="router.push({ name: 'songsheet', params: { id: info.al.id }, query: { al: 1 } })">
            <van-icon class-prefix="net" name="zhuanji" size="3vh" />
            <div class="cart-info flex flex-acenter van-ellipsis">
              <span>??????: {{ info.al && info.al.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </van-action-sheet>
</template>

<script>
import { useRouter } from 'vue-router'
import { getMusicDetail, getLyric, getMusicUrl, likeMusic, getLikeList } from '@/api/music.js'
import { getPlayListAll, getAlbums } from '@/api/songList.js'
import { reactive, ref, toRefs } from 'vue'
import { getAuthors } from '@/utils'
import { nextTick, onActivated, onMounted, onUnmounted, watch } from '@vue/runtime-core'
import { ImagePreview, Toast } from 'vant'
import { useStore } from 'vuex'
import axios from 'axios'
export default {
  name: 'Listen',
  props: {
    id: {
      type: [Number, String],
      default: ''
    },
    listid: {
      type: [Number, String],
      default: 0
    },
    isal: {
      type: [Number, String],
      default: 0
    }
  },
  setup(props) {
    const router = useRouter()
    const store = useStore()
    const { id, listid, isal } = toRefs(props)
    let info = reactive({})
    let current_id = ref(id.value)
    let current_listid = ref(listid.value)
    let lyr = reactive({})
    let keyArr = reactive([])
    let url = ref('') // ??????????????????
    let audio = null
    let likeList = reactive([]) // ?????????????????????
    let like = ref(false) // ????????????
    let playList = reactive([]) // ????????????
    let current_index = ref(-1) // ???????????????????????????????????????
    let showMore = ref(false)

    const getPlayList = () => {
      if (+isal.value) {
        getAlbums({ id: current_listid.value }).then((res) => {
          // console.log(res, 'getAlbums')
          if (res.code === 200) {
            let ids = res.songs.map((item) => item.id)
            playList.push(...ids)
            current_index.value = playList.findIndex((item) => item === +current_id.value)
            console.log(current_index.value, 'current_index')
          }
        })
      } else {
        getPlayListAll({ id: current_listid.value }).then((res) => {
          // console.log(res, 'getPlayListAll')
          if (res.code === 200) {
            let ids = res.songs.map((item) => item.id)
            playList.push(...ids)
            current_index.value = playList.findIndex((item) => item === +current_id.value)
            console.log(current_index.value, 'current_index')
          }
        })
      }
    }
    // getPlayList()

    const init = () => {
      for (let key in lyr) {
        delete lyr[key]
      }
      keyArr.length = 0
      likeList.length = 0
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
        // console.log(res, 'getMusicDetail')
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
          if (!res.data[0].url) {
            Toast.fail('??????????????????')
            play_next()
            return
          }
          url.value = res.data[0].url

          audio.src = url.value
          pause.value = false
        }
      })
    }
    // init()
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
        audio.addEventListener('ended', play_next)
      })
    })
    onUnmounted(() => {
      player.removeEventListener('timeupdate', __currentTime)
      player.removeEventListener('canplay', __durationTime)
      audio.removeEventListener('ended', play_next)
      console.log('????????????')
    })
    const __currentTime = () => {
      currentTime.value = parseFloat(player.currentTime)
    }
    const __durationTime = () => {
      durationTime.value = parseFloat(player.duration)
    }
    const scrollLyc = (item, key, index) => {
      if (currentTime.value >= key && currentTime.value < key + (keyArr[index + 1] - keyArr[index])) {
        lycWrap.style.transform = `translateY(${12 - 4 * index}vh)`
      }
      return item
    }

    watch(
      id,
      () => {
        if (current_id.value === +id.value) return
        if (!listid.value) {
          playList.length = 0
          playList.push(...JSON.parse(localStorage.getItem('tempids')))
        }
        store.commit('app/setCurrentId', +id.value)
        current_id.value = id.value
        current_index.value = playList.findIndex((item) => item === +current_id.value)
        init()
      },
      { deep: true, immediate: true }
    )
    watch(
      listid,
      () => {
        if (!listid.value) return
        playList.length = 0
        current_listid.value = listid.value
        getPlayList()
      },
      { deep: true, immediate: true }
    )
    onActivated(() => {
      showMore.value = false
      // console.log(listid.value, 'id')
    })

    const follow = (key) => {
      likeMusic({ id: current_id.value, like: key })
      if (key) {
        like.value = true
      } else {
        like.value = false
      }
    }

    const download = (fileName) => {
      axios({
        method: 'get',
        url: url.value,
        responseType: 'blob',
        headers: { 'content-type': 'audio/mpeg' }
      })
        .then((res) => {
          let blob = new Blob([res.data], { type: res.data.type }) // ??????blob ??????blob???????????? data ??????????????????????????????(??????mp3,jpeg) type:????????????????????????????????? ??? mp3
          let downa = document.createElement('a') // ??????A??????
          let href = window.URL.createObjectURL(blob) // ?????????????????????
          downa.href = href // ????????????
          downa.download = fileName // ???????????????
          document.body.appendChild(downa)
          downa.click() // ????????????A??????
          document.body.removeChild(downa) // ????????????????????????
          window.URL.revokeObjectURL(href) // ??????blob??????
        })
        .catch(function (error) {
          console.log(error)
        })
    }

    let play_type = ref(0)
    const triggle = () => {
      play_type.value += 1
      if (play_type.value > 2) {
        play_type.value = 0
      }
      switch (play_type.value) {
        case 0: // ????????????
          audio.loop = false
          Toast('????????????')
          break
        case 1: // ????????????
          audio.loop = false
          Toast('????????????')
          break
        case 2: // ????????????
          audio.loop = true
          Toast('????????????')
          break
      }
    }
    let next_id = ref(-1)
    let previous_id = reactive([])

    const play_previous = () => {
      if (play_type.value === 2) {
        play_next()
        return
      }
      if (previous_id.length) {
        current_id.value = previous_id.pop()
        current_index.value = playList.findIndex((item) => item === current_id.value)
      } else {
        current_index.value - 1 < 0 ? (current_id.value = playList[playList.length - 1]) : (current_id.value = playList[current_index.value])
        current_index.value - 1 < 0 ? (current_index.value = playList.length - 1) : current_index.value--
      }
      pause.value = true
      init()
    }

    const getNext = () => {
      if (play_type.value === 1) {
        // ????????????
        next_id.value = playList[Math.floor(Math.random() * playList.length)]
        current_index.value = playList.findIndex((item) => item === next_id.value)
      } else if (play_type.value === 0) {
        // ????????????
        current_index.value + 1 >= playList.length ? (next_id.value = playList[0]) : (next_id.value = playList[current_index.value + 1])
        current_index.value + 1 >= playList.length ? (current_index.value = 0) : current_index.value++
      } else {
        next_id.value = current_id.value
      }
    }

    const play_next = () => {
      getNext()
      if (current_id.value !== previous_id[0]) {
        previous_id.push(current_id.value)
      }

      current_id.value = next_id.value
      pause.value = true
      init()
    }

    let pause = ref(false) // ???????????????
    watch(
      pause,
      () => {
        nextTick(() => {
          if (audio !== null) {
            pause.value ? audio.pause() : audio.play()
          }
        })
      },
      { immediate: true, deep: true }
    )

    const toArtist = (origin, artist) => {
      if (!origin) {
        getAuthors(artist).indexOf('/') === -1 && router.push({ name: 'artist', params: { id: artist[0].id } })
        return
      }
      getAuthors(origin.artists).indexOf('/') === -1 && router.push({ name: 'artist', params: { id: origin.artists[0].id } })
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
      download,
      play_type,
      pause,
      triggle,
      play_next,
      play_previous,
      showMore,
      toArtist
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
.description {
  overflow: hidden;
  height: 6vh;
  line-height: 6vh;
  color: #fff;
  font-size: 1.8vh;
  background-color: var(--theme-color);
}
.cart {
  height: 30vh;
  background-color: var(--theme-color);
  .inner-cart {
    width: 80%;
    height: 24vh;
    padding: 1vh 1vh 0 2vh;
    background-color: var(--sub-theme-color);
    border-radius: 2vh;
    .cart-info {
      width: 90%;
      height: 7vh;
      border-bottom: 1px solid rgb(74, 74, 74);
      font-size: 2vh;
    }
  }
}
</style>
