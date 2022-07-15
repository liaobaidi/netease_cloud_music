<template>
  <div class="header fixed flex flex-acenter">
    <van-icon class-prefix="net" name="xiangzuo-jiantou" class="icon-size marginRight10" @click="router.go(-1)" />
    歌单广场
  </div>
  <div style="height: 6vh" />
  <van-tabs v-model:active="tagName" swipeable sticky offset-top="6vh">
    <van-tab v-for="item in tags" :key="item" :title="item" :name="item">
      <div class="container flex flex-wrap">
        <div v-for="play in list" :key="play.id" class="item flex flex-center flex-acenter">
          <MusicCart :pic-url="play.coverImgUrl" :info="play.name" :count="play.playCount" :id="play.id" />
        </div>
      </div>
    </van-tab>
  </van-tabs>
</template>

<script>
import { getSongSquare } from '@/api/songList.js'
import { watch, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import MusicCart from '@/components/musicCart.vue'
export default {
  name: 'Square',
  components: { MusicCart },
  setup() {
    let list = reactive([])
    const router = useRouter()
    let offset = ref(1)
    let tagName = ref('全部')
    let tags = reactive(['全部', '华语', '古风', '流行', '欧美', '影视原声', '怀旧', '校园', '日语', '夜晚', '游戏'])
    const getList = (key) => {
      getSongSquare({ cat: key, offset: offset.value, limit: 50 }).then((res) => {
        // console.log(res, 'getSongSquare')
        if (res.code === 200) {
          list.length = 0
          list.push(...res.playlists)
        }
      })
    }
    watch(
      tagName,
      () => {
        getList(tagName.value)
      },
      { immediate: true, deep: true }
    )
    return {
      router,
      tagName,
      tags,
      list,
      getList
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
  z-index: 1;
}
.container {
  .item {
    width: 33.33%;
    height: 24vh;
  }
}
:deep(.van-sticky .van-tabs__wrap) {
  padding-left: 4vw;
  background-color: var(--theme-color);
}
</style>
