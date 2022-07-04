<template>
  <div style="overflow: hidden">
    <header class="flex flex-bet flex-acenter header fixed transition" :style="scrolly >= 150 ? 'background: -webkit-linear-gradient(135deg, ' + arr[0].rgba + ', ' + arr[arr.length - 1].rgba + ')' : ''">
      <div class="flex">
        <van-icon class="marginRight20" class-prefix="net" name="xiangzuo-jiantou" size="24" @click="router.go(-1)" />
        <span>歌单</span>
      </div>
      <div class="flex">
        <van-icon class="marginRight20" class-prefix="net" name="sousuo" />
        <van-icon name="ellipsis" style="transform: rotate(90deg)" />
      </div>
    </header>
    <div class="top-part flex relative">
      <div class="absolute top-part-bg" :style="arr.length && 'background: -webkit-linear-gradient(135deg, ' + arr[0].rgba + ', ' + arr[arr.length - 1].rgba + ')'" />
      <div class="flex" style="height: calc(260 / 1667 * 100vh)">
        <div class="logo marginRight20 relative">
          <van-image id="logo" :src="playList.coverImgUrl || './static/img/loadingErroe.png'" width=" calc(260 / 1667 * 100vh)" height=" calc(260 / 1667 * 100vh)" radius="3vw" fit="fill" />
          <div class="count absolute">
            <van-icon class-prefix="net" name="play" size="10" />
            {{ countUnit(playList.playCount) }}
          </div>
        </div>
        <div class="info flex flex-col flex-bet">
          <div class="songsheet-name van-multi-ellipsis--l2">{{ playList.name || '' }}</div>
          <div>
            <div class="author flex flex-acenter" style="width: 10em">
              <div class="author-logo flex flex-acenter">
                <van-image :src="playList.creator.avatarUrl || './static/img/loadingErroe.png'" width="6vw" height="6vw" class="marginRight10" round fit="fill" />
              </div>
              <div class="author-name van-ellipsis">{{ playList.creator.nickname }}</div>
              <van-icon name="arrow" />
            </div>
            <div class="dec flex flex-acenter" style="width: 10em">
              <span class="van-ellipsis">{{ playList.description || '介绍： 无' }}</span>
              <van-icon name="arrow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="sanlian flex flex-center">
    <div class="sanlian-inner flex flex-acenter flex-ard">
      <div class="flex flex-acenter">
        <van-icon v-if="subscribed" name="passed" color="gray" class="marginRight10" />
        <van-icon v-else class="marginRight10" class-prefix="net" name="tianjiashoucang" />
        <span @click="like" :style="subscribed ? 'color: gray' : ''">{{ countUnit(bookedCount) || '收藏' }}</span>
      </div>
      <div style="color: gray">|</div>
      <div class="flex flex-acenter">
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
  <div class="marginTop20" style="overflow: hidden">
    <div class="music-item" v-for="(item, index) in songList" :key="item.id">
      <MusicItem :show-pic="false" :is-top="parseInt(istop)" :id="item.id" :pic-url="item.al.picUrl" :index="index + 1" :album-name="item.name" :author-name="item.ar[0].name" :description="item.al.name" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive, toRefs, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getPlayListAll, getPlayListDetail, getPlayListDynamic, triggleLike } from '@/api/songList.js'
import countUnit from '@/utils/countUnit.js'
import MusicItem from '@/components/musicItem.vue'
import { Toast } from 'vant'
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
    MusicItem
  },
  setup(props, context) {
    const router = useRouter()
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
    window.onscroll = () => {
      scrolly.value = window.scrollY
    }
    getPlayListAll({ id: id.value }).then((res) => {
      // console.log(res, 'getPlayListAll')
      if (res.code === 200) {
        songList.push(...res.songs)
      }
    })
    getPlayListDetail({ id: id.value }).then((res) => {
      // console.log(res, 'getPlayListDetail')
      if (res.code === 200) {
        Object.assign(playList, res.playlist)
      }
    })
    getPlayListDynamic({ id: id.value }).then((res) => {
      // console.log(res, 'getPlayListDynamic')
      if (res.code === 200) {
        Object.assign(slInfo, res)
        subscribed.value = slInfo.subscribed
        bookedCount.value = slInfo.bookedCount
      }
    })
    const like = () => {
      if (subscribed.value) {
        // 取关
        triggleLike({ t: 2, id: id.value }).then((res) => {
          // console.log(res, 'triggleLike')
          if (res.code === 200) {
            subscribed.value = false
            bookedCount.value--
            Toast.success('已取消收藏')
          }
        })
      } else {
        triggleLike({ t: 1, id: id.value }).then((res) => {
          // console.log(res, 'triggleLike')
          if (res.code === 200) {
            subscribed.value = true
            bookedCount.value++
            Toast.success('已添加收藏')
          }
        })
      }
    }

    onMounted(() => {
      // 获取背景蒙版主要颜色
      nextTick(() => {
        const logo = document.getElementById('logo').children[0]
        logo.crossOrigin = ''
        logo.onload = function () {
          const w = this.width
          const h = this.height
          // 创建画布
          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          // 绘制图片在画布上
          const context = canvas.getContext('2d')
          context.drawImage(this, 0, 0)
          let pxArr = context.getImageData(0, 0, w, h).data
          pxArr = Array.from(pxArr)
          const colorList = {}
          let i = 0
          while (i < pxArr.length) {
            const r = pxArr[i]
            const g = pxArr[i + 1]
            const b = pxArr[i + 2]
            const a = pxArr[i + 3]
            i = i + 4 // 最后 +4 比每次 i++ 快 10ms 左右性能
            const key = [r, g, b, a].join(',')
            key in colorList ? ++colorList[key] : (colorList[key] = 1)
          }
          for (let key in colorList) {
            arr.push({
              rgba: `rgba(${key})`,
              num: colorList[key]
            })
          }
          arr = arr.sort((a, b) => b.num - a.num)
        }
      })
    })
    return {
      id,
      songList,
      playList,
      arr,
      scrolly,
      countUnit,
      slInfo,
      subscribed,
      bookedCount,
      like,
      router,
      istop
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
      font-size: getvh(12);
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
    font-size: getvh(18);
  }
}
.music-item {
  width: 100%;
  height: getvh(120);
}
</style>
