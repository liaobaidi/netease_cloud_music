<template>
  <div v-show="!showInfo" style="overflow: hidden">
    <header
      class="flex flex-bet flex-acenter header fixed transition"
      :style="scrolly >= 150 ? { backgroundColor: '#151515' } : ''"
    >
      <div class="flex">
        <van-icon class="marginRight20" class-prefix="net" name="xiangzuo-jiantou" size="24" @click="router.go(-1)" />
        <span v-if="!showInp">{{ al ? '专辑' : '歌单' }}</span>
        <input
          v-if="showInp"
          v-model="searKey"
          v-focus
          type="text"
          class="searInp"
          placeholder="请输入您要搜索的歌曲"
          @keyup.enter="showInp = !showInp"
        />
      </div>
      <div class="flex">
        <van-icon v-if="!showInp" class="marginRight20" class-prefix="net" name="sousuo" @click="tosearh" />
        <!-- <van-icon name="ellipsis" style="transform: rotate(90deg)" /> -->
        <Playing color="#d03333" />
      </div>
    </header>
    <div class="top-part flex relative">
      <div
        class="absolute top-part-bg"
        :style="{ backgroundImage: `url(${playList.coverImgUrl || playList.picUrl})` }"
      />
      <div class="flex" style="height: calc(260 / 1667 * 100vh)">
        <div class="logo marginRight20 relative" @click="showInfo = true">
          <van-image
            id="logo"
            :src="playList.coverImgUrl || playList.picUrl || './static/img/logo.png'"
            width=" calc(260 / 1667 * 100vh)"
            height=" calc(260 / 1667 * 100vh)"
            radius="3vw"
            fit="fill"
          />
          <div class="count absolute" v-if="!al">
            <van-icon class-prefix="net" name="play" size="10" />
            {{ countUnit(playList.playCount) }}
          </div>
        </div>
        <div class="info flex flex-col flex-bet">
          <div class="songsheet-name van-multi-ellipsis--l2">{{ playList.name || '' }}</div>
          <div>
            <div class="author flex flex-acenter" style="width: 10em">
              <div class="author-logo flex flex-acenter" v-if="!al">
                <van-image
                  :src="(playList.creator && playList.creator.avatarUrl) || './static/img/loadingErroe.png'"
                  width="6vw"
                  height="6vw"
                  class="marginRight10"
                  round
                  fit="fill"
                />
              </div>
              <div
                class="author-name van-ellipsis marginRight10"
                @click="router.push({ name: 'userinfo', params: { id: userId } })"
              >
                {{
                  (playList.creator && playList.creator.nickname) || (songListCom[0] && getAuthors(songListCom[0].ar))
                }}
              </div>
              <van-icon name="arrow" v-if="followed || userId === +store.getters.userid || al" />
              <van-icon v-else class-prefix="net" name="plus" class="follow" color="#bbb5b5" @click="toFollow" />
            </div>
            <div class="dec flex flex-acenter" style="width: 10em" @click="showInfo = true">
              <span class="van-ellipsis">{{ playList.description || '介绍： 无' }}</span>
              <van-icon name="arrow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-show="!showInfo" class="sanlian flex flex-center">
    <div class="sanlian-inner flex flex-acenter flex-ard">
      <div class="flex flex-acenter">
        <van-icon
          v-if="subscribed || userId === +store.getters.userid"
          name="passed"
          color="gray"
          class="marginRight10"
        />
        <van-icon v-else class="marginRight10" class-prefix="net" name="tianjiashoucang" />
        <span @click="like" :style="subscribed || userId === +store.getters.userid ? 'color: gray' : ''">{{
          countUnit(bookedCount) || '收藏'
        }}</span>
      </div>
      <div style="color: gray">|</div>
      <div class="flex flex-acenter" @click="router.push({ name: 'comment', params: { id }, query: { isal: al } })">
        <van-icon class="marginRight10" class-prefix="net" name="pinglun" />
        <span>{{ countUnit(slInfo.commentCount) || '评论' }}</span>
      </div>
      <div style="color: gray">|</div>
      <div class="flex flex-acenter">
        <van-icon class="marginRight10" class-prefix="net" name="fenxiang" />
        <span>{{ countUnit(slInfo.shareCount) || '分享' }}</span>
      </div>
    </div>
  </div>
  <div v-show="!showInfo" class="marginTop20" style="overflow: hidden">
    <div class="music-item" v-for="(item, index) in songListCom" :key="item.id">
      <MusicItem
        :list-id="id"
        :is-album="+al"
        :show-pic="false"
        :is-top="parseInt(istop)"
        :id="item.id"
        :pic-url="item.al.picUrl"
        :index="index + 1"
        :album-name="item.name"
        :author-name="getAuthors(item.ar)"
        :description="item.al.name"
      />
    </div>
  </div>
  <Info
    @close="showInfo = false"
    :tabs="playList.tags"
    :show="showInfo"
    :url="playList.coverImgUrl || playList.picUrl"
    :descript="playList.description"
    :nickname="playList.name"
    :color-arr="arr"
  />
</template>

<script>
import { ref, onMounted, reactive, toRefs, nextTick, defineAsyncComponent, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { followUser } from '@/api/user.js'
import {
  getPlayListAll,
  getPlayListDetail,
  getPlayListDynamic,
  triggleLike,
  getAlbums,
  getAlbumDetail,
  subAlbum
} from '@/api/songList.js'
import countUnit from '@/utils/countUnit.js'
import MusicItem from '@/components/musicItem.vue'
import Playing from '@/components/Playing.vue'
import { getAuthors } from '@/utils'
import { Toast } from 'vant'
const Info = defineAsyncComponent(() => import('./component/Info.vue'))
export default {
  name: 'SongSheet',
  props: {
    id: {
      type: [Number, String],
      default: -1
    },
    istop: {
      type: [Number, String],
      default: 0
    }
  },
  components: {
    MusicItem,
    Info,
    Playing
  },
  setup(props, context) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const { id, istop } = toRefs(props)
    let songList = reactive([]) // 歌单
    let playList = reactive({
      creator: reactive({})
    }) // 歌单详情，描述
    let arr = reactive([]) // 背景图主要色调
    let slInfo = reactive({}) // 三连详情
    let scrolly = ref(0)
    let subscribed = ref(false) // 是否已经关注
    let bookedCount = ref(0) // 收藏数量
    let followed = ref(false) // 是否关注歌手
    let userId = ref(-1)
    let showInfo = ref(false)
    let al = ref(0)
    window.onscroll = () => {
      scrolly.value = document.documentElement.scrollTop
    }
    watch(
      route,
      () => {
        al.value = +route.query.al
      },
      { immediate: true, deep: true }
    )
    if (+al.value) {
      getAlbums({ id: id.value }).then(res => {
        // console.log(res, 'getalbums')
        if (res.code === 200) {
          songList.push(...res.songs)
          Object.assign(playList, res.songs[0].al)
        }
      })
      getAlbumDetail({ id: id.value }).then(res => {
        // console.log(res, 'getAlbumDetail')
        if (res.code === 200) {
          Object.assign(slInfo, res)
          subscribed.value = slInfo.isSub
          bookedCount.value = slInfo.subCount
        }
      })
    } else {
      getPlayListAll({ id: id.value }).then(res => {
        // console.log(res, 'getPlayListAll')
        if (res.code === 200) {
          songList.push(...res.songs)
        }
      })
      getPlayListDetail({ id: id.value }).then(res => {
        // console.log(res, 'getPlayListDetail')
        if (res.code === 200) {
          Object.assign(playList, res.playlist)
          userId.value = playList.userId
        }
      })
      getPlayListDynamic({ id: id.value }).then(res => {
        // console.log(res, 'getPlayListDynamic')
        if (res.code === 200) {
          Object.assign(slInfo, res)
          subscribed.value = slInfo.subscribed
          bookedCount.value = slInfo.bookedCount
          followed.value = slInfo.followed
        }
      })
    }
    const like = () => {
      if (+al.value) {
        if (userId.value === +store.getters.userid) {
          return
        }
        if (subscribed.value) {
          // 取关
          subAlbum({ t: 2, id: id.value }).then(res => {
            // console.log(res, 'triggleLike')
            if (res.code === 200) {
              subscribed.value = false
              bookedCount.value--
              Toast.success('已取消收藏')
            }
          })
        } else {
          subAlbum({ t: 1, id: id.value }).then(res => {
            // console.log(res, 'triggleLike')
            if (res.code === 200) {
              subscribed.value = true
              bookedCount.value++
              Toast.success('已添加收藏')
            }
          })
        }
      } else {
        if (userId.value === +store.getters.userid) {
          return
        }
        if (subscribed.value) {
          // 取关
          triggleLike({ t: 2, id: id.value }).then(res => {
            // console.log(res, 'triggleLike')
            if (res.code === 200) {
              subscribed.value = false
              bookedCount.value--
              Toast.success('已取消收藏')
            }
          })
        } else {
          triggleLike({ t: 1, id: id.value }).then(res => {
            // console.log(res, 'triggleLike')
            if (res.code === 200) {
              subscribed.value = true
              bookedCount.value++
              Toast.success('已添加收藏')
            }
          })
        }
      }
    }

    const toFollow = () => {
      followUser({ id: userId.value, t: 1 }).then(res => {
        // console.log(res, 'toFollow')
        if (res.code === 200) {
          Toast.success(res.followContent || '关注成功！')
          followed.value = true
        } else {
          Toast.fail({ message: res.data.blockText, duration: 2500 })
        }
      })
    }

    let showInp = ref(false)
    let searKey = ref('')
    let songListCom = computed(() => {
      if (!searKey.value) {
        return songList
      }
      let result = songList.filter(
        item =>
          item.name.indexOf(searKey.value) !== -1 ||
          getAuthors(item.ar).indexOf(searKey.value) !== -1 ||
          item.al.name.indexOf(searKey.value) !== -1
      )
      if (!result.length) {
        Toast.fail('没有您要找的歌曲')
        return songList
      }
      return result
    })

    const tosearh = () => {
      showInp.value = !showInp.value
      searKey.value = ''
    }

    return {
      id,
      al,
      userId,
      songList,
      playList,
      arr,
      scrolly,
      countUnit,
      slInfo,
      subscribed,
      bookedCount,
      followed,
      like,
      router,
      istop,
      toFollow,
      showInfo,
      store,
      getAuthors,
      showInp,
      searKey,
      songListCom,
      tosearh
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/func.scss';
.header {
  width: 100vw;
  padding: 0 4vw;
  height: getvh(100);
  top: 0;
  left: 0;
  z-index: 9;
  .searInp {
    width: 64vw;
    background: none;
    outline: none;
    border: none;
    font-size: 4.2667vw;
    border-bottom: 1px solid #eee;
    &::-moz-placeholder {
      color: #ccc;
    }
    &::placeholder {
      color: #ccc;
    }
  }
}
.top-part {
  position: relative;
  padding: getvh(150) 4vw 0 4vw;
  height: getvh(520);
  background: none;
  .top-part-bg {
    top: 0;
    left: -50%;
    width: 200%;
    height: 100%;
    border-radius: 0 0 50% 50% / 0 0 30% 30%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center center;
    -webkit-filter: blur(80px);
    filter: blur(80px);
  }
  .logo {
    flex: 1;
    z-index: 1;
    .count {
      height: getvh(36);
      line-height: getvh(36);
      border-radius: getvh(18);
      background-color: rgba(0, 0, 0, 0.1);
      color: #fff;
      top: 1.3333vw;
      right: 1.3333vw;
      z-index: 1;
      font-size: 2.4vw;
      padding: 0 2vw;
    }
  }
  .info {
    flex: 2;
    z-index: 1;
    .author {
      font-size: getvh(30);
      color: #bbb5b5;
    }
    .dec {
      font-size: getvh(30);
      color: #bbb5b5;
      margin-top: getvh(20);
    }
  }
}
.sanlian {
  position: absolute;
  padding: 0 10vw;
  top: getvh(430);
  left: 50%;
  transform: translate(-50%, 50%);
  height: getvh(80);
  .sanlian-inner {
    padding: 0 4vw;
    width: 80vw;
    height: 100%;
    border-radius: getvh(40);
    line-height: getvh(40);
    background-color: var(--sub-theme-color);
    font-size: getvh(32);
  }
}
.music-item {
  width: 100%;
  height: getvh(120);
}
.follow {
  width: 6vw;
  height: 4vw;
  border-radius: 2vw;
  text-align: center;
  line-height: 4vw;
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
