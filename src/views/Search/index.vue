<template>
  <van-nav-bar :border="false" @click-left="router.go(-1)">
    <template #left>
      <svg-icon icon-class="leftArrow" style="font-size: 6vw" />
    </template>
    <template #title>
      <input class="searchInp" type="text" :placeholder="query.keyWord" />
    </template>
  </van-nav-bar>
  <div v-if="historySearchList.length" class="history flex flex-bet padding4vw marginTop20">
    <span>历史</span>
    <div class="hisList relative">
      <div class="absolute">
        <span class="hisword text-center marginRight10" v-for="item in historySearchList" :key="item">{{ item }}</span>
      </div>
    </div>
    <van-icon class-prefix="net" name="icon" color="#7a7e81" />
  </div>
  <van-tabs v-model:active="activeName" swipeable line-height="0" background="#151515" class="marginTop20">
    <van-tab title="热搜榜" name="热搜榜">
      <div class="tab_content flex flex-col flex-bet">
        <div v-if="activeName === '热搜榜'">
          <div class="flex flex-wrap flex-bet" :style="showMore ? 'height: calc(450 / 1667 * 100vh)' : 'height: calc(900 / 1667 * 100vh)'">
            <div v-for="(item, index) in hotSearchList" :key="item.first" class="top_item van-ellipsis">
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
            <div v-for="(item, index) in hotTopicList" :key="item.title" class="top_item van-ellipsis flex flex-bet" style="width: 100%">
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
</template>

<script>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BScroll from '@better-scroll/core'
import { getHotSearchList, getHotSearchListDetail, getTopicList } from '@/api/search.js'
import countUnit from '@/utils/countUnit.js'

export default {
  name: 'Search',
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
    query = route.query
    onMounted(() => {
      nextTick(() => {
        new BScroll('.hisList', {
          scrollX: true,
          scrollY: false
        })
      })
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
      // console.log(res, 'getHotSearchListDetail')
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
      countUnit
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
  height: getvh(80);
  color: #bbb;
}
:deep(.van-nav-bar__title) {
  max-width: 100%;
  margin-left: 15vw;
}
.history {
  font-size: 3.7333vw;
  .hisList {
    overflow: hidden;
    width: 70vw;
    height: getvh(50);
    white-space: nowrap;
    .hisword {
      height: getvh(50);
      line-height: getvh(50);
      background-color: var(--sub-theme-color);
      border-radius: getvh(25);
      padding: 0 3vw;
    }
  }
}
:deep(.van-tabs__wrap) {
  padding-left: 10vw;
}
:deep(.van-tab) {
  flex: none;
  margin-right: 2.6667vw;
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
</style>
