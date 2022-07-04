<template>
  <div class="container">
    <header class="header">
      <Header>
        <template #search>
          <div class="search flex flex-center flex-acenter" @click="toLink('search')">
            <span class="net net-sousuo" />
            &nbsp;{{ searchKey }}
          </div>
        </template>
        <template #right>
          <span class="net net-ziyuan" />
        </template>
      </Header>
    </header>
    <van-swipe class="my-swipe" :autoplay="5000">
      <van-swipe-item v-for="item in banners" :key="item.bannerId" @click="toBannerInfo(item)" class="my-swipe-item">
        <van-image radius="16" class="image" fit="fill" :src="item.pic" />
      </van-swipe-item>
      <template #indicator="{ active, total }">
        <div class="flex flex-center indicator-wrap">
          <div :class="['indicator flex', item === active + 1 ? 'active' : '']" v-for="item in total" :key="item" />
        </div>
      </template>
    </van-swipe>
    <ul class="ball flex marginTop20">
      <li v-for="item in ballList" :key="item.id" @click="toBannerInfo(item)" class="flex flex-col flex-center flex-acenter ball-item">
        <div class="icon flex flex-center flex-acenter">
          <van-icon :name="item.iconUrl" color="#d03333" size="40" />
        </div>
        <div style="font-size: 2vw; width: 12.8vw" class="text-center">
          {{ item.name }}
        </div>
      </li>
    </ul>
    <div class="main">
      <div class="cart-item">
        <CartItem>
          <template #left>
            <span>推荐歌单</span>
          </template>
          <template #right>
            <div class="flex flex-center flex-acenter right-text">
              <span>更多</span>
              <van-icon name="arrow" />
            </div>
          </template>
          <template #main>
            <div class="scrollx flex">
              <div v-for="item in musicRecommendList" :key="item.id" class="music-item">
                <MusicCart :id="item.id" :pic-url="item.picUrl" :info="item.name" :count="item.playCount" />
              </div>
            </div>
          </template>
        </CartItem>
      </div>
      <div class="cart-item">
        <CartItem>
          <template #left>
            <span><van-icon name="replay" @click="changeSpecialList" /> 精选{{ tags[tagsIndex] && tags[tagsIndex].name }}歌单</span>
          </template>
          <template #right>
            <div class="flex flex-center flex-acenter right-text">
              <span>更多</span>
              <van-icon name="arrow" />
            </div>
          </template>
          <template #main>
            <div class="scrollx flex">
              <div v-for="item in specialList" :key="item.id" class="music-item">
                <MusicCart :id="item.id" :pic-url="item.coverImgUrl" :info="item.name" :count="item.playCount" />
              </div>
            </div>
          </template>
        </CartItem>
      </div>
      <div class="cart-item">
        <CartItem>
          <template #left>
            <span>数字专辑</span>
          </template>
          <template #right>
            <div class="flex flex-center flex-acenter right-text">
              <span>更多</span>
              <van-icon name="arrow" />
            </div>
          </template>
          <template #main>
            <swiper-action @slide="changeDirection($event, 'albumList')" class="flex transition" id="albumList">
              <div v-for="it in albumTotal" :key="it" class="flex flex-wrap">
                <div v-for="item in albumList[it - 1]" :key="item.id" class="music-list flex">
                  <MusicItem :pic-url="item.coverUrl" :is-album="true" :album-name="item.albumName" :author-name="item.artistName" />
                </div>
              </div>
            </swiper-action>
          </template>
        </CartItem>
      </div>
      <div class="cart-item" style="height: calc(666 / 1667 * 100vh)">
        <CartItem>
          <template #left>
            <span>排行榜</span>
          </template>
          <template #right>
            <div class="flex flex-center flex-acenter right-text">
              <span>更多</span>
              <van-icon name="arrow" />
            </div>
          </template>
          <template #main>
            <swiper-action @slide="changeDirection($event, 'topList')" class="flex transition" id="topList">
              <div class="toplistItem" v-for="(item, index) in topList.list" :key="item.id">
                <CartItem bg-color="#1d1c21">
                  <template #left>
                    <div @click="router.push({ name: 'songsheet', params: { id: item.id, istop: 1 } })" class="flex flex-center flex-acenter">
                      <span>{{ item.name }}</span>
                      <van-icon name="arrow" />
                    </div>
                  </template>
                  <template #right>
                    <span>{{ item.updateFrequency }}</span>
                  </template>
                  <template #main>
                    <div class="flex flex-col">
                      <MusicItem v-for="(it, i) in topList.info[index]" :key="it.id" :index="i + 1" :pic-url="it.al.picUrl" :album-name="it.name" :author-name="it.ar[0].name" :description="it.al.name" class="musiclist" />
                    </div>
                  </template>
                </CartItem>
              </div>
            </swiper-action>
          </template>
        </CartItem>
      </div>
      <div class="cart-item">
        <CartItem>
          <template #left>
            <span>推荐电台</span>
          </template>
          <template #right>
            <div class="flex flex-center flex-acenter right-text">
              <span>更多</span>
              <van-icon name="arrow" />
            </div>
          </template>
          <template #main>
            <div class="scrollx flex">
              <div v-for="item in recommendFM" :key="item.id" class="music-item FM">
                <MusicCart :id="item.id" :pic-url="item.picUrl" :info="item.name" :isFM="true" />
              </div>
            </div>
          </template>
        </CartItem>
      </div>
    </div>
  </div>
  <van-divider>人家也是有底线的</van-divider>
</template>

<script>
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import Header from '@/components/Header.vue'
import CartItem from '@/components/cartItem.vue'
import MusicCart from '@/components/musicCart.vue'
import MusicItem from '@/components/musicItem.vue'
import { getSearchDefault } from '@/api/search.js'
import { getFindData, getBanners, getBallList } from '@/api/app.js'
import { getRecommendList, getSpecialListTags, getSpecialList, getAlbumList, getTopLists, getPlayListDetail } from '@/api/songList.js'
import { getRecommendFM } from '@/api/fm.js'
import { Notify, Toast } from 'vant'
import { useRouter } from 'vue-router'
export default {
  name: 'Find',
  components: {
    Header,
    CartItem,
    MusicCart,
    MusicItem
  },
  setup() {
    let searchKey = ref('')
    let banners = reactive([])
    let ballList = reactive([])
    let tags = reactive([]) // 歌单分类标签
    let tagsIndex = ref(0)
    let specialList = reactive([]) // 精选华语、欧美...歌单
    let specialListInterval = ref(null)
    let musicRecommendList = reactive([]) // 推荐歌单
    let albumList = reactive([]) // 数字专辑
    let albumTotal = ref(0)
    let albumCurrentIndex = ref(0)
    let swiperAction = ref(null)
    let topList = reactive({
      list: reactive([]),
      info: reactive([])
    }) // 排行榜前五个数据集
    let topListAction = ref(null)
    let topListCurrentIndex = ref(0)
    let recommendFM = reactive([]) // 推荐电台
    let router = useRouter()

    const toBannerInfo = (item) => {
      if (item.url) {
        window.location.href = item.url
      } else {
        Notify({ type: 'danger', message: '暂时没有数据' })
      }
    }
    getBanners().then((res) => {
      if (res.code === 200) {
        // console.log(res, 'banners')
        banners.push(...res.banners)
      }
    })
    getSearchDefault().then((res) => {
      // console.log(res, 'hfdiwoq')
      if (res.code === 200) {
        searchKey.value = res.data.realkeyword
      }
    })
    getBallList().then((res) => {
      // console.log(res, 'ballList')
      if (res.code === 200) {
        ballList.push(...res.data)
      }
    })
    getRecommendList({ limit: 6 }).then((res) => {
      // console.log(res, 'recommendList')
      if (res.code === 200) {
        musicRecommendList.push(...res.result)
      }
    })
    getSpecialListTags().then((res) => {
      // console.log(res, 'specialListTags')
      if (res.code === 200) {
        tags.push(...res.tags)
        getSpecialLists()
      }
    })
    const getSpecialLists = () => {
      getSpecialList({ limit: 12, cat: tags[tagsIndex.value].name }).then((res) => {
        // console.log(res, 'getSpecialList', tags[tagsIndex.value].name)
        if (res.code === 200) {
          specialList.length = 0
          specialList.push(...res.playlists)
          specialListInterval = setInterval(() => {
            changeSpecialList()
          }, 60 * 1000)
        }
      })
    }
    const changeSpecialList = () => {
      clearInterval(specialListInterval)
      tagsIndex.value++
      if (tagsIndex.value >= tags.length) {
        tagsIndex.value = 0
      }
      getSpecialLists()
    }
    getAlbumList().then((res) => {
      // console.log(res, 'albumList')
      albumTotal.value = Math.ceil(res.products.length / 3)
      let temp = []
      res.products.forEach((item, index) => {
        if (temp.length < 3) {
          temp.push(item)
        }
        if (temp.length === 3 || index === res.products.length - 1) {
          // console.log(temp, 'temp')
          albumList.push(temp)
          temp = []
        }
      })
    })
    // getFindData().then((res) => {
    //   console.log(res, 'findData')
    // })
    onMounted(() => {
      nextTick(() => {
        swiperAction = document.querySelector('#albumList')
        topListAction = document.querySelector('#topList')
        swiperAction.style.left = 0
        topListAction.style.left = 0
      })
    })
    onBeforeUnmount(() => {
      clearInterval(specialListInterval)
    })

    const changeDirection = (e, key) => {
      if (e.direction === 'left') {
        if (key === 'albumList') {
          albumCurrentIndex.value++
          if (albumCurrentIndex.value < albumTotal.value) {
            swiperAction.style.left = -92 + parseInt(swiperAction.style.left) + 'vw'
          } else {
            albumCurrentIndex.value = albumTotal.value - 1
            return
          }
        }
        if (key === 'topList') {
          topListCurrentIndex.value++
          if (topListCurrentIndex.value < 5) {
            topListAction.style.left = -90 + parseInt(topListAction.style.left) + 'vw'
          } else {
            topListCurrentIndex.value = 4
            return
          }
        }
      } else {
        if (key === 'albumList') {
          albumCurrentIndex.value--
          if (albumCurrentIndex.value < 0) {
            albumCurrentIndex.value = 0
            return
          } else {
            swiperAction.style.left = 92 + parseInt(swiperAction.style.left) + 'vw'
          }
        }
        if (key === 'topList') {
          topListCurrentIndex.value--
          if (topListCurrentIndex.value < 0) {
            topListCurrentIndex.value = 0
            // Toast({ message: '到头了' })
            return
          } else {
            topListAction.style.left = 90 + parseInt(topListAction.style.left) + 'vw'
          }
        }
      }
    }
    getTopLists().then((res) => {
      if (res.code === 200) {
        topList.list.push(...res.list.slice(0, 5))
      }
      topList.list.forEach((item, index) => {
        getPlayListDetail({ id: item.id }).then((res) => {
          if (res.code === 200) {
            topList.info.push(res.playlist.tracks.slice(0, 3))
          }
        })
      })
    })

    getRecommendFM().then((res) => {
      // console.log(res, 'res')
      if (res.code === 200) {
        recommendFM.push(...res.result)
      }
    })

    const toLink = (key) => {
      router.push({ path: `/${key}`, name: key, query: { keyWord: searchKey.value } })
    }

    return {
      searchKey,
      banners,
      ballList,
      musicRecommendList,
      tagsIndex,
      tags,
      specialList,
      albumList,
      albumTotal,
      topList,
      recommendFM,
      toBannerInfo,
      changeSpecialList,
      changeDirection,
      toLink,
      router
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/func.scss';
.container {
  overflow: hidden;
  .header {
    .search {
      width: 75vw;
      height: 4vh;
      border-radius: 2vh;
      background-color: #353439;
      color: #7a7e81;
      font-size: 4vw;
    }
  }
  .my-swipe {
    margin-top: 8vh;
    width: 100%;
    height: 20vh;
    position: relative;
    .my-swipe-item {
      padding: 0 4vw;
    }
    .indicator-wrap {
      width: 100%;
      position: absolute;
      bottom: 1vw;
      .indicator {
        width: 2.1333vw;
        height: 0.8vw;
        border-radius: 0.4vw;
        margin: 0 1vw;
        background-color: rgba(255, 255, 255, 0.3);
      }
      .indicator.active {
        background-color: #fff;
      }
    }
  }
  .ball {
    width: 100vw;
    height: 20vw;
    padding: 0 1.1vw;
    overflow-x: auto;
    border-bottom: 1px solid #202020;
    &::-webkit-scrollbar {
      display: none;
    }
    .ball-item {
      width: 20vw;
      height: 20vw;
      margin: 0 2.9vw;
      .icon {
        position: relative;
        width: 12vw;
        height: 12vw;
        border-radius: 6vw;
        background-color: rgba(255, 0, 0, 0.2);
      }
    }
  }
  .main {
    width: 100vw;
    background-color: #212121;
    .cart-item {
      overflow: hidden;
      height: getvh(500);
      border-radius: 3.3333vw;
      margin-bottom: getvh(30);
      &:nth-child(1) {
        border-radius: 0 0 3.3333vw 3.3333vw;
      }
      .right-text {
        width: 15vw;
      }
      .music-item {
        margin-right: 2.6667vw;
      }
      .music-list {
        width: 92vw;
        height: getvh(125);
      }
      .toplistItem {
        overflow: hidden;
        width: 86vw;
        margin-right: 4vw;
        border-radius: 2.3333vw;
        height: getvh(500);
        .musiclist {
          height: getvh(118);
        }
        :deep(.right-text) {
          border: none;
        }
      }
      .FM {
        :deep(.count) {
          display: none;
        }
      }
    }
  }
}
</style>
