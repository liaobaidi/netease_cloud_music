<template>
  <div @click="toLink" class="music-container flex flex-col flex-ard flex-acenter">
    <div class="pic relative">
      <div class="count absolute flex flex-acenter">
        <van-icon class-prefix="net" name="play" size="10" />
        {{ countUnit(count) }}
      </div>
      <van-image :src="picUrl || './static/img/loadingErroe.png'" fit="fill" width="28vw" height="28vw" />
    </div>
    <div class="title van-multi-ellipsis--l2">
      {{ info }}
    </div>
  </div>
</template>

<script>
import { toRefs } from 'vue'
import { useRouter } from 'vue-router'
import countUnit from '@/utils/countUnit.js'
import { Toast } from 'vant'
export default {
  name: 'MusicCart',
  props: {
    id: {
      type: [Number, String],
      default: -1
    },
    picUrl: {
      type: String,
      default: ''
    },
    info: {
      type: String,
      default: '歌单描述'
    },
    count: {
      type: [Number, String],
      default: 0
    },
    isFM: {
      type: Boolean,
      default: false
    },
    isTop: {
      type: [Number, String],
      default: 0
    }
  },
  setup(props) {
    const { picUrl, info, count, id, isFM, isTop } = toRefs(props)
    const router = useRouter()

    const toLink = () => {
      if (isFM.value) {
        Toast.fail('数据尚不明确')
        // router.push({ name: 'fm', params: { id: id.value } })
        return
      }
      router.push({ name: 'songsheet', params: { id: id.value, istop: isTop.value } })
    }
    return {
      picUrl,
      info,
      count,
      countUnit,
      toLink
    }
  }
}
</script>

<style lang="scss" scoped>
.music-container {
  width: 28vw;
  height: 37.0667vw;
  .pic {
    width: 28vw;
    height: 28vw;
    overflow: hidden;
    border-radius: 3vw;
    .count {
      height: calc(36 / 1667 * 100vh);
      line-height: calc(36 / 1667 * 100vh);
      border-radius: calc(18 / 1667 * 100vh);
      background-color: rgba(0, 0, 0, 0.1);
      color: #fff;
      top: 1.3333vw;
      right: 1.3333vw;
      z-index: 1;
      font-size: 2.4vw;
      padding: 0 2vw;
    }
  }
  .title {
    font-size: 3.6667vw;
    color: var(--theme-text-color);
  }
}
</style>
