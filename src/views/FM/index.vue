<template>
  <div style="overflow: hidden">
    <header class="flex flex-bet flex-acenter header fixed transition">
      <!-- :style="scrolly >= 150 ? 'background: -webkit-linear-gradient(135deg, ' + arr[0].rgba + ', ' + arr[arr.length - 1].rgba + ')' : ''" -->
      <div class="flex">
        <van-icon class="marginRight20" class-prefix="net" name="xiangzuo-jiantou" size="24" @click="router.go(-1)" />
        <span>电台</span>
      </div>
      <div class="flex">
        <van-icon class="marginRight20" class-prefix="net" name="sousuo" />
        <van-icon name="ellipsis" style="transform: rotate(90deg)" />
      </div>
    </header>
    <div class="top-part flex relative">
      <div class="absolute top-part-bg" />
      <!-- :style="arr.length && 'background: -webkit-linear-gradient(135deg, ' + arr[0].rgba + ', ' + arr[arr.length - 1].rgba + ')'" -->
      <div class="flex" style="height: calc(260 / 1667 * 100vh)">
        <div class="logo marginRight20 relative">
          <van-image id="logo" :src=" programInfo.coverUrl || './static/img/loadingErroe.png'" width=" calc(260 / 1667 * 100vh)" height=" calc(260 / 1667 * 100vh)" radius="3vw" fit="fill" />
          <div class="count absolute">
            <van-icon class-prefix="net" name="play" size="10" />
            {{ '' }}
          </div>
        </div>
        <div class="info flex flex-col">
          <div class="songsheet-name van-multi-ellipsis--l2">{{ 123 }}</div>
          <div>
            <div class="author flex flex-acenter" style="width: 10em">
              <div class="author-logo flex flex-acenter">
                <van-image src="./static/img/loadingErroe.png" width="6vw" height="6vw" class="marginRight10" round fit="fill" />
              </div>
              <div class="author-name van-ellipsis">{{ 0 }}</div>
              <div class="icon flex flex-center flex-acenter">
                <van-icon name="plus" color="#fff" />
              </div>
              <van-icon name="arrow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { getFMInfo } from '@/api/fm.js'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
export default {
  name: 'FM',
  props: {
    id: {
      type: [Number, String],
      default: -1
    }
  },
  setup(props, context) {
    const router = useRouter()
    const { id } = toRefs(props)
    let programInfo = reactive({}) // 详情

    getFMInfo({ rid: id.value }).then((res) => {
      console.log(res, 'getFMInfo')
      if (res.code === 200) {
        Object.assign(programInfo, res.program)
      } else {
        Toast.fail(res.msg)
      }
    })

    return {
      id,
      router,
      programInfo
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
    .icon {
      width: 6vw;
      height: getvh(40);
      border-radius: getvh(20);
      background-color: rgba(255, 255, 255, 0.6);
    }
  }
}
</style>
