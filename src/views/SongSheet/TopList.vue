<template>
  <div class="header fixed flex flex-acenter">
    <van-icon class-prefix="net" name="xiangzuo-jiantou" class="marginRight10 icon-size" @click="router.go(-1)" />
    排行榜
  </div>
  <div style="height: 8vh" />
  <div class="main flex flex-wrap">
    <div v-for="item in list" :key="item.id" class="item flex flex-center">
      <MusicCart :pic-url="item.coverImgUrl" :info="item.name" :count="item.playCount" :id="item.id" is-top="1" />
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { getTopLists } from '@/api/songList.js'
import { reactive, ref } from 'vue'
import MusicCart from '@/components/musicCart.vue'
export default {
  name: 'TopList',
  components: { MusicCart },
  setup() {
    const router = useRouter()
    let list = reactive([])
    getTopLists().then((res) => {
      // console.log(res, 'getTopLists')
      if(res.code === 200) {
        list.push(...res.list)
      }
    })

    return {
      router,
      list
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 6vh;
  background-color: var(--theme-color);
  padding: 0 4vw;
  z-index: 9;
}
.main {
  min-height: 100vh;
  .item {
    width: 33.33%;
    height: 24vh;
  }
}
</style>
