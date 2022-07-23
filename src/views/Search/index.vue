<template>
  <van-nav-bar :border="false" fixed safe-area-inset-top placeholder @click-left="router.go(-1)">
    <template #left>
      <svg-icon icon-class="leftArrow" style="font-size: 6vw" />
    </template>
    <template #title>
      <input v-model="searchInfo" v-focus class="searchInp van-ellipsis" type="text" :placeholder="query.keyWord || keyword" @keyup.enter="toSearch(searchInfo)" />
    </template>
  </van-nav-bar>
  <div v-if="!showResult && historyArr.length" class="history marginTop20 flex flex-acenter flex-bet padding4vw">
    <div>历史:</div>
    <div class="wrap" id="wrap">
      <div class="content">
        <div class="item marginRight10" v-for="item in historyArr" :key="item.id" @click="toSearch(item.word)">{{ item.word }}</div>
      </div>
    </div>
    <van-icon class-prefix="net" name="icon" @click="clearHis" />
  </div>

  <van-tabs v-if="!showResult" v-model:active="activeName" swipeable line-height="0" background="#151515" class="marginTop20">
    <van-tab title="热搜榜" name="热搜榜">
      <div class="tab_content flex flex-col flex-bet">
        <div v-if="activeName === '热搜榜'">
          <div class="flex flex-wrap flex-bet" :style="showMore ? 'height: calc(450 / 1667 * 100vh)' : 'height: calc(900 / 1667 * 100vh)'">
            <div v-for="(item, index) in hotSearchList" :key="item.first" class="top_item van-ellipsis" @click="toSearch(item.first || item.searchWord)">
              <span class="marginRight10" :style="index < 3 ? 'color: #d03333' : 'color: #7a7e81'">{{ index + 1 }}</span>
              <span>{{ item.first || item.searchWord }}</span>
            </div>
          </div>
        </div>
        <div v-if="showMore" @click="getDetail" class="text-center more">展开更多热搜<van-icon name="arrow-down" /></div>
      </div>
    </van-tab>
    <van-tab title="话题榜" name="话题榜">
      <div class="tab_content flex flex-col flex-bet">
        <div class="flex flex-col" :style="showMore ? 'height: calc(450 / 1667 * 100vh)' : 'height: calc(900 / 1667 * 100vh)'">
          <div v-if="hotTopicList.length">
            <div v-for="(item, index) in hotTopicList" :key="item.title" class="top_item van-ellipsis flex flex-bet" style="width: 100%" @click="toSearch(item.title || item.searchWord)">
              <div>
                <span class="marginRight10" :style="index < 3 ? 'color: #d03333' : 'color: #7a7e81'">{{ index + 1 }}</span>
                <span>{{ item.title || '' }}</span>
              </div>
              <span style="color: gray; font-size: 3.4vw">{{ countUnit(item.participateCount) }}热度</span>
            </div>
          </div>
        </div>
        <div v-if="showMore" @click="getDetail" class="text-center more">展开更多热搜<van-icon name="arrow-down" /></div>
      </div>
    </van-tab>
  </van-tabs>

  <van-tabs v-else v-model:active="searchName" swipeable sticky offset-top="7vh" line-height="0" background="#2c2c2c">
    <van-tab v-for="item in tablist" :key="item" :name="item" :title="item">
      <div v-if="item === '单曲'">
        <div v-for="song in resultList[item]" :key="song.id" class="music-item flex flex-acenter">
          <MusicItem :id="song.id" :show-pic="false" :album-name="song.name" :author-name="getAuthors(song.ar)" :description="song.al.name" />
        </div>
      </div>
      <div v-if="item === '歌单'">
        <div v-for="playlist in resultList[item]" :key="playlist.id" class="music-item flex flex-acenter" @click="router.push({ name: 'songsheet', params: { id: playlist.id } })">
          <div class="cover marginRight10">
            <van-image :src="playlist.coverImgUrl" radius="1vh" />
          </div>
          <div class="main flex flex-col flex-center">
            <div class="playlist-name van-ellipsis">{{ playlist.name }}</div>
            <div class="playlist-author van-ellipsis">{{ playlist.trackCount }}首, by {{ playlist.creator.nickname }}, 播放 {{ countUnit(playlist.playCount) }}次</div>
          </div>
        </div>
      </div>
      <div v-if="item === '专辑'">
        <div v-for="album in resultList[item]" :key="album.id" class="music-item flex flex-acenter" @click="router.push({ name: 'songsheet', params: { id: album.id }, query: { al: 1 } })">
          <div class="cover marginRight10">
            <van-image :src="album.picUrl" radius="1vh" />
          </div>
          <div class="main flex flex-col flex-center">
            <div class="playlist-name van-ellipsis">{{ album.name }}</div>
            <div class="playlist-author van-ellipsis">{{ getAuthors(album.artists) }} {{ dayjs(album.publishTime).format('YYYY.M.D') }}</div>
          </div>
        </div>
      </div>
      <div v-if="item === '歌手' || item === '用户'">
        <div v-if="resultList[item].length">
          <div v-for="user in resultList[item]" :key="user.id || user.userId" class="music-item flex flex-acenter relative" @click="item === '用户' && router.push({ name: 'userinfo', params: { id: user.userId } })">
            <div class="cover marginRight20">
              <van-image :src="user.img1v1Url || user.avatarUrl" round loading-icon="./static/img/logo.png" />
            </div>
            <div class="main flex flex-col flex-center">
              <div class="playlist-name van-ellipsis">{{ user.name || user.nickname }}</div>
            </div>
            <div v-if="user.followed" class="absolute sub flex flex-center flex-acenter" style="color: #aaa" @click.stop="triggleFollow(user.id, 2)"><van-icon name="success" size="1.8vh" color="#aaa" />已关注</div>
            <div v-else class="absolute sub flex flex-center flex-acenter" @click.stop="triggleFollow(user.id, 1)"><van-icon name="plus" size="1.8vh" color="red" />关注</div>
          </div>
        </div>
        <div v-else class="nodata flex flex-col flex-center flex-acenter">
          <van-icon class-prefix="net" name="nodata" size="40vw" />
          <span class="marginTop20">什么都没有找到</span>
        </div>
      </div>
    </van-tab>
  </van-tabs>
</template>

<script>
import { nextTick, onActivated, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getHotSearchList, getHotSearchListDetail, getTopicList, getSearchDefault, search } from '@/api/search.js'
import { followUser } from '@/api/user.js'
import countUnit from '@/utils/countUnit.js'
import { getAuthors } from '@/utils'
import dayjs from 'dayjs'
import MusicItem from '@/components/musicItem.vue'
import { Toast } from 'vant'
import BScroll from '@better-scroll/core'

export default {
  name: 'Search',
  components: {
    MusicItem
  },
  setup() {
    let route = useRoute()
    let router = useRouter()
    let query = reactive({})
    let historySearchList = reactive(['电台']) // 历史搜索关键词
    let activeName = ref('热搜榜')
    let topList = reactive(['热搜榜', '话题榜'])
    let hotSearchList = reactive([]) // 热搜
    let hotTopicList = reactive([]) // 话题
    let showMore = ref(true)
    let keyword = ref('')
    let showResult = ref(false)
    Object.assign(query, route.query)

    watch(
      query,
      () => {
        if (!query.keyWord) {
          getSearchDefault().then((res) => {
            if (res.code === 200) {
              keyword.value = res.data.realkeyword
            }
          })
        }
      },
      { deep: true, immediate: true }
    )

    let bs = null
    let wrap = null
    const init = () => {
      wrap = document.getElementById('wrap')
      bs = new BScroll(wrap, {
        scrollX: true,
        scrollY: false,
        probeType: 3,
        click: true
      })
    }

    const clearHis = () => {
      localStorage.setItem('history', '[]')
      historyArr.length = 0
      localStorage.getItem('history') && historyArr.push(...JSON.parse(localStorage.getItem('history')))
    }

    onMounted(() => {
      nextTick(() => {
        init()
      })
    })

    onActivated(async () => {
      historyArr.length = 0
      localStorage.getItem('history') && historyArr.push(...JSON.parse(localStorage.getItem('history')))
      nextTick(() => {
        init()
      })
      Object.assign(query, route.query)
      // console.log(query.show, 'query.show')
      if (+query.show) {
        showResult.value = false
        searchInfo.value = ''
      } else {
        showResult.value = true
        bs.destroy()
      }
    })

    getHotSearchList().then((res) => {
      // console.log(res, 'getHotSearchList')
      if (res.code === 200) {
        hotSearchList.push(...res.result.hots)
      }
    })
    const getDetail = async () => {
      const res1 = await getHotSearchListDetail()
      const res2 = await getTopicList({ limit: 10, offset: 10, timestamp: Date.now() * 1000 })
      if (res1.code === 200) {
        showMore.value = false
        hotSearchList.length = 0
        hotSearchList.push(...res1.data)
      }
      if (res2.code === 200) {
        showMore.value = false
        hotTopicList.length = 0
        hotTopicList.push(...res2.hot)
      }
    }
    getTopicList({ limit: 5, offset: 5, timestamp: Date.now() * 1000 }).then((res) => {
      // console.log(res, 'getTopicList')
      if (res.code === 200) {
        hotTopicList.push(...res.hot)
      }
    })

    let searchInfo = ref('')
    let offset = ref(0)
    let limit = ref(30)
    let tablist = ['单曲', '歌单', '专辑', '歌手', '用户']
    let type = ref(1)
    let searchName = ref('单曲')
    let resultList = reactive({
      单曲: [],
      歌单: [],
      专辑: [],
      歌手: [],
      用户: []
    })

    watch(searchName, () => {
      switch (searchName.value) {
        case '单曲':
          type.value = 1
          if (resultList['单曲'].length) return
          break
        case '歌单':
          type.value = 1000
          if (resultList['歌单'].length) return
          break
        case '专辑':
          type.value = 10
          if (resultList['专辑'].length) return
          break
        case '歌手':
          type.value = 100
          if (resultList['歌手'].length) return
          break
        case '用户':
          type.value = 1002
          if (resultList['用户'].length) return
          break
      }
      toSearch(searchInfo.value)
    })

    let historyArr = reactive([])
    let hisId = 0
    const toSearch = (key) => {
      searchInfo.value = key
      if (!searchInfo.value) {
        searchInfo.value = query.keyWord || keyword.value
      }
      // 存入历史搜索信息
      if (!historyArr.length || searchInfo.value.trim() !== historyArr[0].word) {
        historyArr.unshift({ id: hisId++, word: searchInfo.value })
        localStorage.setItem('history', JSON.stringify(historyArr))
      }
      search({ keywords: searchInfo.value.trim(), limit: limit.value, offset: offset.value, type: type.value }).then((res) => {
        console.log(res)
        if (res.code === 200) {
          switch (type.value) {
            case 1:
              resultList['单曲'].length = 0
              let tempIds = res.result.songs.map((item) => item.id)
              localStorage.setItem('tempids', JSON.stringify(tempIds))
              resultList['单曲'].push(...res.result.songs)
              break
            case 1000:
              resultList['歌单'].length = 0
              resultList['歌单'].push(...res.result.playlists)
              break
            case 10:
              resultList['专辑'].length = 0
              resultList['专辑'].push(...res.result.albums)
              break
            case 100:
              resultList['歌手'].length = 0
              if (res.result.artistCount) {
                resultList['歌手'].push(...res.result.artists)
              }

              break
            case 1002:
              resultList['用户'].length = 0
              if (JSON.stringify(res.result) === '{}') {
                break
              }
              resultList['用户'].push(...res.result.userprofiles)
              break
          }
          historyArr.length = 0
          historyArr.push(...JSON.parse(localStorage.getItem('history')))
          showResult.value = true
          bs.destroy()
        }
      })
    }

    const triggleFollow = (id, type) => {
      followUser({ id, t: type }).then((res) => {
        if (res.code === 200) {
          let msg = ''
          if (type === 1) {
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

    return {
      query,
      router,
      historySearchList,
      activeName,
      topList,
      hotSearchList,
      showMore,
      hotTopicList,
      getDetail,
      countUnit,
      keyword,
      searchInfo,
      showResult,
      tablist,
      resultList,
      searchName,
      toSearch,
      getAuthors,
      dayjs,
      triggleFollow,
      historyArr,
      clearHis
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/func.scss';
.searchInp {
  background-color: var(--sub-theme-color);
  border: none;
  outline: none;
  border-bottom: 1px solid #7a7e81;
  width: 78vw;
  height: 6vh;
  color: #bbb;
}
:deep(.van-nav-bar__title) {
  max-width: 100%;
  margin-left: 15vw;
}
:deep(.van-sticky .van-tabs__wrap) {
  padding-left: 4vw;
  background-color: #2c2c2c;
}
.tab_content {
  width: 80vw;
  background-color: var(--sub-theme-color);
  margin: 0 auto;
  border-radius: getvh(20);
  padding: 4vw;
  .top_item {
    width: 45%;
    font-size: 4vw;
    line-height: getvh(80);
  }
  .more {
    font-size: 3.4667vw;
    color: #7a7e81;
  }
}
.music-item {
  padding-left: 3vw;
  height: 8vh;
  .cover {
    width: 7vh;
    height: 7vh;
  }
  .main {
    height: 100%;
    font-size: 4vw;
    .playlist-author {
      color: #7a7e81;
      font-size: 3.2vw;
    }
    .playlist-name {
      width: calc(100vw - 7vh - 10px - 4vw);
    }
  }
  .sub {
    width: 14vw;
    height: 4vh;
    border-radius: 2vh;
    color: red;
    border: 1px solid currentColor;
    right: 4vw;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1vh;
  }
}
.nodata {
  height: 86vh;
  width: 100vw;
  font-size: 6vw;
}
.history {
  height: 3vh;
  font-size: 4.2667vw;
  .wrap {
    overflow: hidden;
    width: 70vw;
    height: 3vh;
    white-space: nowrap;
    .content {
      height: 3vh;
      display: inline-block;
      .item {
        display: inline-block;
        height: 3vh;
        line-height: 3vh;
        padding: 0 2vw;
        border-radius: 1.5vh;
        font-size: 3.4667vw;
        background-color: var(--sub-theme-color);
      }
    }
  }
}
</style>
