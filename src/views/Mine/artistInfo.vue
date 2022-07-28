<template>
  <div class="header padding4vw fixed flex flex-acenter" :style="show ? { backgroundColor: '#151515' } : ''">
    <van-icon class-prefix="net" name="xiangzuo-jiantou" class="icon-size" @click="router.go(-1)" />
    <transition name="van-fade">
      <span v-if="show" class="marginLeft10">{{ userProfile.name }}</span>
    </transition>
    <transition name="van-fade">
      <div v-if="show" class="top-follow absolute flex flex-center">
        <span v-if="!fInfo.isFollow" class="no flex flex-center flex-acenter" @click="toFollow(1)">+ 关注</span>
        <span v-else class="yes flex flex-center flex-acenter" @click="toFollow(0)">{{ fInfo.followDay.slice(0, 3) }}</span>
      </div>
    </transition>
  </div>
  <div class="top-part flex relative">
    <div class="absolute top-part-bg" :style="{ backgroundImage: `url(${userProfile.cover})` }" />
  </div>
  <div class="padding4vw">
    <div class="userinfo">
      <div class="nickname text-center">{{ userProfile.name }}</div>
      <div class="tabs flex flex-acenter flex-center">
        <span class="van-ellipsis text-center">{{ tabs }}</span>
      </div>
      <div class="threedata flex flex-acenter flex-ard" @click="router.push({ name: 'subscribe', params: { id }, query: { subscribe: 0, isArtist: 1 } })">
        <div>{{ countUnit(fInfo.fansCnt) }} 粉丝</div>
      </div>
      <div class="follow flex flex-center">
        <span v-if="!fInfo.isFollow" class="no flex flex-center flex-acenter" @click="toFollow(1)">+ 关注</span>
        <span v-else class="yes flex flex-center flex-acenter" @click="toFollow(0)">{{ fInfo.followDay.slice(0, 3) }}</span>
      </div>
    </div>
    <div class="dec" v-if="userProfile.briefDesc">
      <div class="dec-header flex flex-acenter">艺人描述</div>
      <div class="dec-main">{{ userProfile.briefDesc }}</div>
    </div>
    <div class="hots">
      <div class="hots-header flex flex-acenter">热门歌曲50首</div>
      <div class="hots-main">
        <div v-for="(item, index) in songList" :key="item.id" class="item" @click="router.push({ name: 'listen', params: { id: item.id } })">
          <MusicItem :id="item.id" :showPic="false" :index="index + 1" :album-name="item.name" :author-name="getAuthors(item.ar)" :description="item.al && item.al.name" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, toRefs, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getArtistInfo, getFollowCount, followArtist, getTopSong } from '@/api/artist.js'
import countUnit from '@/utils/countUnit.js'
import { getAuthors } from '@/utils'
import { Toast } from 'vant'
import MusicItem from '@/components/musicItem.vue'
export default {
  name: 'ArtistInfo',
  props: {
    id: {
      type: [Number, String],
      default: ''
    }
  },
  components: { MusicItem },
  setup(props) {
    const router = useRouter()
    let { id } = toRefs(props)
    let userProfile = reactive({})
    let fInfo = reactive({})
    let tabs = ref('')

    getArtistInfo({ id: id.value }).then((res) => {
      // console.log(res, 'getArtistInfo')
      if (res.code === 200) {
        Object.assign(userProfile, res.data.artist)
        tabs.value = res.data.identify.imageDesc
      }
    })

    getFollowCount({ id: id.value }).then((res) => {
      // console.log(res, 'getFollowCount')
      if (res.code === 200) {
        Object.assign(fInfo, res.data)
      }
    })

    let songList = reactive([])
    getTopSong({ id: id.value }).then((res) => {
      // console.log(res, 'getTopSong')
      if (res.code === 200) {
        songList.push(...res.songs)
      }
    })

    const toFollow = (key) => {
      followArtist({ id: id.value, t: key }).then((res) => {
        if (res.code === 200) {
          let msg = ''
          if (key === 1) {
            msg = '关注成功！'
          } else {
            msg = '取关成功！'
          }
          Toast.success(msg)
        } else {
          Toast.fail(res.data.blockText)
        }
      })
    }

    let show = ref(false)
    onMounted(() => {
      const follows = document.querySelectorAll('.follow')
      const callback = (entries) => {
        entries.forEach((entry) => {
          // 判断是否可见
          if (entry.isIntersecting) {
            // 进入可视区
            show.value = false
          } else {
            show.value = true
          }
        })
      }
      const observer = new IntersectionObserver(callback)
      // 观察每一个元素
      follows.forEach((follow) => {
        observer.observe(follow)
      })
    })

    return {
      router,
      id,
      userProfile,
      tabs,
      fInfo,
      countUnit,
      songList,
      getAuthors,
      show,
      toFollow
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/func.scss';
.header {
  top: 0;
  left: 0;
  width: 100vw;
  height: 6vh;
  z-index: 9;
  .top-follow {
    right: 4vw;
    font-size: 3.2vw;
    .yes,
    .no {
      width: 16vw;
      height: 6vw;
      border-radius: 3vw;
      border: 1px solid #ccc;
    }
    .no {
      color: #d03333;
      border-color: currentColor;
    }
  }
}
.top-part {
  padding: getvh(150) 4vw 0 4vw;
  height: getvh(520);
  background: none;
  overflow: hidden;
  .top-part-bg {
    top: 0;
    left: -50%;
    width: 200%;
    height: 100%;
    border-radius: 0 0 50% 50% / 0 0 30% 30%;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }
}
.userinfo {
  position: relative;
  width: 100%;
  height: 40vw;
  border-radius: 3vw;
  background: -webkit-linear-gradient(top, rgba(44, 44, 44, 0.9), rgba(21, 21, 21, 1));
  margin-top: -9vw;
  padding-top: 3vw;
  .nickname {
    margin: 10px 0;
    font-size: 4.2667vw;
  }
  .tabs {
    margin: 2vw auto;
    width: 60%;
    font-size: 3.6vw;
    height: 6vw;
    color: rgb(137, 137, 137);
    span {
      width: 100%;
    }
  }
  .threedata {
    width: 50%;
    margin: 10px auto;
    font-size: 3.2vw;
    color: gray;
  }
  .follow {
    font-size: 3.2vw;
    margin-top: 4vw;
    .yes,
    .no {
      width: 16vw;
      height: 6vw;
      border-radius: 3vw;
      border: 1px solid #ccc;
    }
    .no {
      color: #d03333;
      border-color: currentColor;
    }
  }
}
.dec,
.hots {
  margin-top: 4vw;
  padding: 1vw 3vw 3vw 3vw;
  background-color: var(--sub-theme-color);
  border-radius: 2vw;
  .dec-header,
  .hots-header {
    height: 8vw;
    font-size: 4.2vw;
    border-bottom: 1px solid rgb(61, 61, 61);
  }
  .dec-main {
    font-size: 3.6vw;
    padding-top: 2vw;
  }
  .hots-main {
    .item {
      height: 14vw;
      margin-left: -3vw;
    }
  }
}
.hots {
  background: -webkit-linear-gradient(top, rgba(44, 44, 44, 0.9), rgba(21, 21, 21, 1));
}
</style>
