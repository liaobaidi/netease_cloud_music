<template>
  <div class="mine-container">
    <Header>
      <template #search>
        <transition name="van-fade">
          <div v-show="show" class="flex flex-ard flex-acenter">
            <div class="marginRight10">
              <van-image :src="info.avatarUrl" width="8vw" height="8vw" round />
            </div>
            <div class="nickname">{{ info.nickname }}</div>
          </div>
        </transition>
      </template>
      <template #right>
        <van-icon class-prefix="net" name="sousuo" size="20" @click="router.push({ name: 'search' })"></van-icon>
      </template>
    </Header>
    <div class="userinfo">
      <div class="logo" @click="toInfo">
        <van-image :src="info.avatarUrl" width="18vw" height="18vw" round />
      </div>
      <div class="nickname text-center" @click="toInfo">{{ info.nickname }}</div>
      <div class="threedata flex flex-acenter flex-ard">
        <div @click="router.push({ name: 'subscribe', params: { id: store.getters.userid }, query: { subscribe: 1 } })">{{ countUnit(info.follows) }} 关注</div>
        <div @click="router.push({ name: 'subscribe', params: { id: store.getters.userid }, query: { subscribe: 0 } })">{{ countUnit(info.followeds) }} 粉丝</div>
        <div v-if="level" @click="router.push({ name: 'level', query: { url: info.avatarUrl } })">Lv. {{ level }}</div>
        <div v-else @click="router.push({ name: 'level', query: { url: info.avatarUrl } })">村龄 {{ createDays }} 天</div>
      </div>
    </div>
    <van-tabs v-model:active="chooseName" scrollspy sticky offset-top="6vh">
      <van-tab title="创建歌单" name="创建歌单">
        <div v-if="userplaylist.length" class="playlist marginTop10">
          <div class="playlist-header">创建歌单({{ userplaylist.length }}个)</div>
          <div v-for="item in userplaylist" :key="item.id" class="items flex" @click="router.push({ name: 'songsheet', params: { id: item.id } })">
            <div class="item-cover marginRight10">
              <van-image :src="item.coverImgUrl" width="100%" height="100%" radius="3vw" />
            </div>
            <div class="item-description flex flex-col flex-ard">
              <div class="item-name van-ellipsis">{{ item.name }}</div>
              <div class="item-count-author van-ellipsis">{{ item.trackCount }}首</div>
            </div>
            <div class="ellipsis" @click.stop="openDelete(item)">
              <van-icon name="ellipsis" color="gray" />
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="收藏歌单" name="收藏歌单">
        <div v-if="subscribedlist.length" class="playlist marginTop20">
          <div class="playlist-header">收藏歌单({{ subscribedlist.length }}个)</div>
          <div v-for="item in subscribedlist" :key="item.id" class="items flex" @click="router.push({ name: 'songsheet', params: { id: item.id } })">
            <div class="item-cover marginRight10">
              <van-image :src="item.coverImgUrl" width="100%" height="100%" radius="3vw" />
            </div>
            <div class="item-description flex flex-col flex-ard">
              <div class="item-name van-ellipsis">{{ item.name }}</div>
              <div class="item-count-author van-ellipsis">{{ item.trackCount }}首, by {{ item.creator.nickname }}</div>
            </div>
            <div class="ellipsis">
              <van-icon name="ellipsis" color="gray" @click.stop="openDelete(item)" />
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
  <van-action-sheet v-model:show="showDelete" close-on-click-action>
    <template #description>
      <div class="description">歌单: {{ currentName }}</div>
    </template>
    <template #default>
      <div v-for="item in deleteActions" :key="item.name" class="actions" @click="handleDelete(item)">
        <van-icon class-prefix="net" :name="item.icon" />
        {{ item.name }}
      </div>
    </template>
  </van-action-sheet>
</template>

<script>
import Header from '@/components/Header.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import countUnit from '@/utils/countUnit.js'
import { getUserInfo, getUserPlaylist } from '@/api/user.js'
import { deletePlaylist } from '@/api/songList.js'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { Toast, Dialog } from 'vant'
export default {
  name: 'Mine',
  components: { Header },
  setup() {
    const router = useRouter()
    const store = useStore()
    const info = reactive({})
    let level = ref(0)
    let createDays = ref(0)
    let subscribedlist = reactive([]) // 收藏的歌单
    let userplaylist = reactive([]) // 用户创建的歌单
    let active = ref(false)
    let scrollTop = ref(0)
    let show = ref(false)
    let showDelete = ref(false)
    let subscribedTop = 0
    let deleteActions = [
      { name: '分享歌单', icon: 'fenxiang', type: 0, id: [] },
      { name: '删除歌单', icon: 'icon', type: 1, id: [] }
    ]
    let chooseName = ref('创建歌单')
    onMounted(() => {
      document.addEventListener('scroll', scrollHandler)
    })
    onUnmounted(() => {
      document.removeEventListener('scroll', scrollHandler)
    })

    const scrollHandler = () => {
      scrollTop.value = document.documentElement.scrollTop
      // console.log(document.documentElement.scrollTop)
      if (scrollTop.value >= 80) {
        show.value = true
      } else {
        show.value = false
      }
      if (scrollTop.value >= subscribedTop) {
        active.value = true
      } else {
        active.value = false
      }
    }

    const tolink = (key) => {
      if (key) {
        document.documentElement.scrollTop = subscribedTop
      } else {
        document.documentElement.scrollTop = 150
      }
    }

    getUserInfo({ uid: store.getters.userid }).then((res) => {
      // console.log(res, 'getUserInfo')
      if (res.code === 200) {
        Object.assign(info, res.profile)
        level.value = res.level
        createDays.value = res.createDays
      }
    })

    getUserPlaylist({ uid: store.getters.userid }).then((res) => {
      // console.log(res, 'getUserPlaylist')
      if (res.code === 200) {
        res.playlist.forEach((item) => {
          if (item.subscribed) {
            subscribedlist.push(item)
          } else {
            userplaylist.push(item)
          }
        })
      }
      subscribedTop = (window.screen.availWidth / 100) * 3 + 8 * (userplaylist.length - 1) + (window.screen.availHeight / 100) * 7 * userplaylist.length + (window.screen.availHeight / 100) * 27
    })

    let currentName = ref('')
    const openDelete = (key) => {
      currentName.value = key.name
      showDelete.value = true
      deleteActions.forEach((item) => {
        item.id.push(key.id)
      })
    }

    const handleDelete = (key) => {
      if (key.type) {
        Dialog.confirm({
          message: '确定要删除此歌单吗？',
          cancelButtonText: '取消',
          confirmButtonText: '删除',
          confirmButtonColor: '#d03333',
          cancelButtonColor: '#d03333'
        })
          .then(() => {
            deletePlaylist({ id: key.id[key.id.length - 1] }).then((res) => {
              if (res.code === 200) {
                Toast.success('删除成功')
              }
            })
            showDelete.value = false
          })
          .catch(() => {
            showDelete.value = false
          })
      } else {
        Toast.fail('分享功能暂时没有开发完毕')
        showDelete.value = false
      }
    }

    const toInfo = () => {
      router.push({ name: 'userinfo', params: { id: store.getters.userid } })
    }

    return {
      router,
      store,
      countUnit,
      info,
      level,
      createDays,
      subscribedlist,
      userplaylist,
      active,
      show,
      showDelete,
      deleteActions,
      currentName,
      chooseName,
      tolink,
      openDelete,
      handleDelete,
      toInfo
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/func.scss';
.mine-container {
  padding: 8vh 4vw 0;
  .userinfo {
    position: relative;
    width: 100%;
    height: 14vh;
    border-radius: 3vw;
    background-color: var(--sub-theme-color);
    margin-top: 9vw;
    padding-top: 9vw;
    .logo {
      position: absolute;
      top: -9vw;
      left: 50%;
      transform: translate(-50%, 0);
    }
    .nickname {
      margin: 10px 0;
      font-size: 4.2667vw;
    }
    .threedata {
      width: 50%;
      margin: 10px auto;
      font-size: 2.6667vw;
      color: gray;
    }
  }
  .menu {
    font-size: 4.2667vw;
    background-color: var(--theme-color);
    margin-top: 1vh;
    height: 4vh;
    line-height: 4vh;
    .menu-item {
      position: relative;
      opacity: 0.9;
      &.active {
        opacity: 1;
        &::after {
          content: '';
          position: absolute;
          bottom: 0.5vh;
          left: 0;
          width: 100%;
          height: 26%;
          border-radius: 13%;
          background: -webkit-linear-gradient(left, #d03333, #ca5f5f);
          opacity: 0.8;
        }
      }
    }
  }
  .playlist {
    background-color: var(--sub-theme-color);
    border-radius: 3vw;
    padding: 3vw 4vw 1vw;
    .playlist-header {
      font-size: 2.6667vw;
      color: gray;
    }
    .items {
      height: 7vh;
      margin: 8px 0;
      position: relative;
      .item-cover {
        width: 7vh;
      }
      .item-description {
        font-size: 3.7333vw;
        width: 75%;
        .item-count-author {
          font-size: 3.2vw;
          color: gray;
        }
      }
      .ellipsis {
        position: absolute;
        transform: rotate(90deg) translate(-50%, 0);
        right: 1.3333vw;
        top: 50%;
      }
    }
  }
}
.description,
.actions {
  padding-left: 4vw;
  text-align: left;
  height: getvh(100);
  line-height: getvh(100);
  background-color: var(--sub-theme-color);
  color: var(--theme-text-color);
  font-size: getvh(20);
}
:deep(.van-tabs__wrap .van-tabs__nav) {
  display: flex;
  justify-content: space-around;
}
:deep(.van-sticky .van-tabs__wrap) {
  padding-left: 4vw;
  background-color: var(--theme-color);
}
</style>
