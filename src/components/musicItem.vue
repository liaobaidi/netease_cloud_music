<template>
  <div class="music-item flex flex-acenter" @click="router.push({ name: 'listen', params: { id, listid: listId, isal: isAlbum } })">
    <div v-if="showPic" class="pic marginRight10 flex flex-center flex-acenter">
      <van-image :src="picUrl" width="100%" height="100%" fit="fill" error-icon="./static/img/loadingErroe.png" />
    </div>
    <div v-if="index" :class="['flex flex-center flex-acenter marginRight10', showPic ? '' : 'nopic']" :style="parseInt(isTop) && index <= 3 ? 'color: #d03333' : ''">
      {{ index }}
    </div>
    <div class="info flex flex-col flex-center">
      <div class="author van-ellipsis">
        {{ albumName }} <span v-if="!description">- {{ authorName }}</span>
      </div>
      <div class="dec van-ellipsis" v-if="description">
        <span>{{ authorName }} - </span><span>{{ description }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { toRefs } from '@vue/reactivity'
import { useRouter } from 'vue-router'
export default {
  name: 'MusicItem',
  props: {
    showPic: {
      type: Boolean,
      default: true
    },
    picUrl: {
      type: String,
      default: './static/img/loadingErroe.png'
    },
    albumName: {
      type: String,
      default: ''
    },
    authorName: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    index: {
      type: [String, Number],
      default: ''
    },
    id: {
      type: [String, Number],
      default: ''
    },
    listId: {
      type: [String, Number],
      default: ''
    },
    isTop: {
      type: [Number, String],
      default: 0
    },
    isAlbum: {
      type: [Number, String],
      default: 0
    }
  },
  setup(props) {
    const { picUrl, albumName, authorName, description, index, showPic, id, isTop, listId, isAlbum } = toRefs(props)
    const router = useRouter()
    return {
      router,
      picUrl,
      albumName,
      authorName,
      description,
      index,
      showPic,
      isTop,
      id,
      listId,
      isAlbum
    }
  }
}
</script>

<style lang="scss" scoped>
.music-item {
  width: 100%;
  height: 100%;
  .pic {
    width: 15vw;
    height: 12vw;
    border-radius: 2vw;
    overflow: hidden;
  }
  .info {
    width: 100%;
    height: 100%;
    border-bottom: 1px solid #212121;
    .author,
    .dec {
      font-size: 4vw;
      color: #fff;
      width: 80%;
      span {
        font-size: 3.2vw;
        color: #b8b8b8;
      }
    }
  }
}
.nopic {
  min-width: 12vw;
  margin: 0;
  color: #b8b8b8;
  font-size: 3.6vw;
}
</style>
