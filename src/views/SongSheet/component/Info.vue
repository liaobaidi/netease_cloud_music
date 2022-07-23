<template>
  <div v-if="show" class="bg absolute" :style="{ backgroundImage: `url(${url})` }" />
  <div v-if="show" class="info-container relative" style="overflow: hidden; padding: 0 8vw">
    <div class="cross absolute">
      <van-icon name="cross" color="#fff" size="20" @click="close" />
    </div>
    <div class="cover flex flex-col flex-acenter flex-bet">
      <div class="logo">
        <van-image :src="url" fit="fill" radius="4vw" />
      </div>
      <div class="nickname">
        {{ nickname }}
      </div>
    </div>
    <div class="divider" />
    <div v-if="tabs.length" class="tabs flex">
      <span>标签:</span>
      <span class="tab_item marginLeft10 text-center" v-for="item in tabs" :key="item">{{ item }}</span>
    </div>
    <div class="descript">
      {{ descript || '作者很懒，什么都没写' }}
    </div>
  </div>
</template>

<script>
import { toRefs } from '@vue/reactivity'
export default {
  name: 'Info',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ''
    },
    descript: {
      type: String,
      default: '无'
    },
    nickname: {
      type: String,
      default: ''
    },
    tabs: {
      type: Array,
      default: () => {
        return []
      }
    },
    colorArr: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  emits: ['close'],
  setup(props, context) {
    let { show, url, descript, tabs, nickname, colorArr } = toRefs(props)
    const close = () => {
      context.emit('close')
    }

    return {
      show,
      url,
      descript,
      tabs,
      nickname,
      colorArr,
      close
    }
  }
}
</script>

<style lang="scss" scoped>
.info-container {
  width: 100vw;
  min-height: 100vh;
  .cross {
    top: 4vw;
    right: 4vw;
  }
  .cover {
    margin-top: 12vh;
    height: 32vh;
    .logo {
      width: 26vh;
      height: 26vh;
    }
    .nickname {
      font-size: 4vw;
    }
  }
  .divider {
    margin-top: 4vh;
    margin-left: -27vw;
    width: 140vw;
    height: 1px;
    transform: scale(0.5);
    background: -webkit-linear-gradient(left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
  }
  .tabs {
    margin-top: 2vh;
    font-size: 3.4vw;
    .tab_item {
      // width: 10vw;
      padding: 0 2vw;
      height: 5vw;
      line-height: 5vw;
      border-radius: 2.5vw;
      font-size: 1.8667vw;
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
  .descript {
    margin-top: 2vh;
    font-size: 1.8667vw;
  }
}
.bg {
  width: 100vw;
  min-height: 100vh;
  background-size: 100% 100%;
  background-position: center center;
  background-repeat: no-repeat;
  -webkit-filter: blur(120px);
  filter: blur(120px);
}
</style>
