<template>
  <div class="header fixed flex flex-acenter" :style="scrollTop >= 180 ? `background-color: var(--theme-color)` : ''">
    <van-icon class-prefix="net" name="xiangzuo-jiantou" class="icon-size marginRight10" @click="router.go(-1)"/>
    今日推荐
  </div>
  <div class="main">
    <div class="main-header relative">
      <div class="date absolute">
        <van-icon class-prefix="net" :name="`rili-${dayjs(new Date()).format('DD')}`" size="10vw" />
        <span class="day">{{ dayjs(new Date()).format('DD') }}</span>
        <span class="month"> / {{ dayjs(new Date()).format('MM') }}</span>
      </div>
    </div>
    <div class="main-body">
      <div v-for="item in list" :key="item.id" class="item">
        <MusicItem :id="item.id" :pic-url="item.al.picUrl" :album-name="item.name" :author-name="getAuthors(item.ar)" :description="item.al.name" />
      </div>
    </div>
  </div>
</template>

<script>
import { getRecommedSong } from '@/api/songList.js'
import MusicItem from '@/components/musicItem.vue'
import dayjs from 'dayjs'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { getAuthors } from '@/utils'
import { useRouter } from 'vue-router'
export default {
  name: 'Recommend',
  components: {
    MusicItem
  },
  setup() {
    let list = reactive([])
    let scrollTop = ref(0)
    const router = useRouter()
    getRecommedSong().then((res) => {
      // console.log(res, 'getRecommedSong')
      if (res.code === 200) {
        list.push(...res.data.dailySongs)
      }
    })

    const handlerScroll = () => {
      scrollTop.value = document.documentElement.scrollTop
    }

    onMounted(() => {
      document.addEventListener('scroll', handlerScroll)
    })

    onUnmounted(() => {
      document.removeEventListener('scroll', handlerScroll)
    })

    return {
      dayjs,
      router,
      list,
      getAuthors,
      scrollTop
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  width: 100vw;
  height: 6vh;
  padding: 0 4vw;
  z-index: 1;
}
.main {
  .main-header {
    height: 34vh;
    background: url("@/assets/img/bg.jpg") no-repeat center center;
    background-size: cover;
    border-radius: 60vw / 0 0 3vw 3vw;
    .date {
      left: 6vw;
      bottom: 4vh;
      color: #fff;
      .day {
        font-size: 10vw;
      }
      .month {
        font-size: 4vw;
      }
    }
  }
  .main-body {
    .item {
      height: 8vh;
      padding: 0 4vw;
    }
  }
}
</style>
