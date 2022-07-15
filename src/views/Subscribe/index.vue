<template>
  <div class="header padding4vw flex flex-acenter fixed">
    <van-icon class-prefix="net" name="xiangzuo-jiantou" color="#fff" size="6vw" @click="router.go(-1)" />
    <span class="marginLeft10">{{ +subscribe ? '关注' : '粉丝' }}</span>
  </div>
  <div class="padding4vw" style="overflow: hidden">
    <div v-if="+subscribe" style="margin-top: 8vh">
      <div v-for="item in follows" :key="item.userId" class="flex flex-acenter sublist relative" @click="router.push({ name: 'userinfo', params: { id: item.userId } })">
        <div class="flex flex-acenter info">
          <div class="logo">
            <van-image :src="item.avatarUrl" width="100%" height="100%" round />
          </div>
          <div class="nickname marginLeft10">{{ item.nickname }}</div>
        </div>
        <div v-if="+id === store.getters.userid" class="icon">
          <van-icon name="ellipsis" @click.stop="openSubscribe(item.followed, item.userId)" />
        </div>
      </div>
    </div>
    <div v-else style="margin-top: 8vh">
      <div v-for="item in followeds" :key="item.userId" class="flex flex-acenter flex-bet sublist relative" @click="router.push({ name: 'userinfo', params: { id: item.userId } })">
        <div class="flex flex-acenter info">
          <div class="logo">
            <van-image :src="item.avatarUrl" width="100%" height="100%" round />
          </div>
          <div class="nickname marginLeft10">{{ item.nickname }}</div>
        </div>
        <div v-if="+id === store.getters.userid" class="icon">
          <van-icon name="ellipsis" @click.stop="openSubscribe(item.followed, item.userId)" />
        </div>
      </div>
    </div>
  </div>
  <van-action-sheet v-model:show="showSubscribe" close-on-click-action>
    <template #description>
      <div class="description">{{ description }}</div>
    </template>
    <template #default>
      <div v-for="item in actions" :key="item.name">
        <div class="actions" @click="openDialog(item.name)">
          <van-icon :class-prefix="item.iconPreix || ''" :name="item.icon" />
          <span class="marginLeft10">{{ item.name }}</span>
        </div>
      </div>
    </template>
  </van-action-sheet>
</template>

<script>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { getFollows, getFolloweds, followUser } from '@/api/user.js'
import { Toast } from 'vant'
export default {
  name: 'Subscribe',
  props: {
    id: {
      type: [Number, String],
      default: ''
    }
  },
  setup(props, context) {
    const router = useRouter()
    const routes = useRoute()
    const store = useStore()
    const { id } = props
    const { subscribe } = routes.query
    let follows = reactive([])
    let followeds = reactive([])
    if (+subscribe) {
      getFollows({ uid: id }).then((res) => {
        // console.log(res, ' getFollows')
        if (res.code === 200) {
          follows.push(...res.follow)
        }
      })
    } else {
      getFolloweds({ uid: id }).then((res) => {
        // console.log(res, 'getFolloweds')
        if (res.code === 200) {
          followeds.push(...res.followeds)
        }
      })
    }

    let showSubscribe = ref(false)
    let actions = reactive([])
    let description = ref('')
    let chooseId = ref('')
    const openSubscribe = (key, id) => {
      chooseId.value = id
      if (!key) {
        actions.length = 0
        actions.push({ name: '回关', icon: 'like-o', iconPreix: '' })
        description.value = '回关后，对方将出现在你的关注列表中'
        showSubscribe.value = true
      } else {
        actions.length = 0
        actions.push({ name: '取关', icon: 'quxiaoguanzhu', iconPreix: 'net' })
        description.value = '取消关注后，对方将从你的关注列表中移除'
        showSubscribe.value = true
      }
    }

    const openDialog = (key) => {
      if (key === '回关') {
        followUser({ id: chooseId.value, t: 1 }).then((res) => {
          console.log(res)
          if (res.code === 200) {
            Toast.success('关注成功！')
          } else {
            Toast.fail(res.data.blockText)
          }
        })
      } else {
        followUser({ id: chooseId.value, t: 2 }).then((res) => {
          if (res.code === 200) {
            Toast.success('操作成功！')
          } else {
            Toast.fail(res.data.blockText)
          }
        })
      }
    }

    return {
      router,
      store,
      subscribe,
      follows,
      followeds,
      showSubscribe,
      actions,
      description,
      openDialog,
      openSubscribe
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 8vh;
  background-color: var(--theme-color);
  z-index: 1;
}
.sublist {
  overflow: hidden;
  width: 100%;
  height: 10vh;
  &::after {
    content: '';
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 7vh;
    border-bottom: 1px solid var(--sub-theme-color);
  }
  .info {
    width: 100%;
    height: 100%;
    .logo {
      width: 7vh;
      height: 7vh;
    }
    .nickname {
      height: 100%;
      line-height: 10vh;
      font-size: 4vw;
    }
  }
  .icon {
    transform-origin: center center;
    transform: rotate(90deg);
  }
}
.description,
.actions {
  overflow: hidden;
  height: 6vh;
  line-height: 6vh;
  text-align: left;
  padding-left: 2vh;
  color: #fff;
  font-size: 2.4vw;
  background-color: var(--theme-color);
}
</style>
