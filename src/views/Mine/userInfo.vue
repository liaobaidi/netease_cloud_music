<template>
  <header class="header flex flex-acenter" :style="showName ? { backgroundColor: '#151515' } : ''">
    <van-icon class-prefix="net" name="xiangzuo-jiantou" color="#fff" class="icon-size" @click="router.go(-1)" />
    <transition name="van-fade">
      <span v-show="showName" class="marginLeft10">{{ userProfile.nickname }}</span>
    </transition>
  </header>
  <div class="top-part flex relative">
    <div class="absolute top-part-bg" :style="{ backgroundImage: `url(${userProfile.backgroundUrl})` }" />
  </div>
  <div class="padding4vw">
    <div class="userinfo">
      <div class="logo" @click="preview(userProfile.avatarUrl)">
        <van-image :src="userProfile.avatarUrl" width="18vw" height="18vw" round />
      </div>
      <div class="nickname text-center" @click="toInfo">{{ userProfile.nickname }}</div>
      <div class="threedata flex flex-acenter flex-ard">
        <div @click="router.push({ name: 'subscribe', params: { id }, query: { subscribe: 1 } })">{{ countUnit(userProfile.follows) }} 关注</div>
        <div @click="router.push({ name: 'subscribe', params: { id }, query: { subscribe: 0 } })">{{ countUnit(userProfile.followeds) }} 粉丝</div>
        <div v-if="level" @click="permission && router.push({ name: 'level', query: { url: userProfile.avatarUrl } })">Lv. {{ level }}</div>
        <div v-else @click="permission && router.push({ name: 'level', query: { url: userProfile.avatarUrl } })">村龄 {{ createDays }} 天</div>
      </div>
      <div class="tags flex flex-center flex-acenter">
        <span class="tags-item flex flex-acenter marginRight10">
          <van-icon class-prefix="net" name="nan" v-if="userProfile.gender === 1" color="skyblue" />
          <van-icon class-prefix="net" name="nv" v-if="userProfile.gender === 2" color="pink" />
          {{ getBirth(userProfile.birthday) }}
        </span>
        <span v-if="getCity(userProfile.city, userProfile.province)" class="tags-item flex flex-acenter">
          {{ getCity(userProfile.city, userProfile.province) }}
        </span>
      </div>
    </div>
    <div class="base">
      <div class="base-header">基本信息</div>
      <div class="base-body">
        <div class="tr"><span class="th">村龄: </span>{{ dayjs().format('YYYY') - dayjs(userProfile.createTime).format('YYYY') }}年 ({{ dayjs(userProfile.createTime).format('YYYY') + '年' + dayjs(userProfile.createTime).format('MM') + '月注册' }})</div>
        <div class="tr"><span class="th">性别: </span>{{ userProfile.gender === 1 ? '男' : userProfile.gender === 2 ? '女' : '未知' }}</div>
        <div class="tr"><span class="th">年龄: </span>{{ getBirth(userProfile.birthday) }}</div>
        <div class="tr van-ellipsis"><span class="th">简介: </span>{{ userProfile.signature || '主人很懒，什么都没写' }}</div>
      </div>
    </div>
    <div v-if="userplaylist.length" class="playlist marginTop20">
      <div class="playlist-header">
        创建歌单<span>({{ userplaylist.length }}个, 被收藏{{ subscribedCount }}次)</span>
      </div>
      <div v-for="item in userplaylist" :key="item.id" class="items flex" @click="router.push({ name: 'songsheet', params: { id: item.id } })">
        <div class="item-cover marginRight10">
          <van-image :src="item.coverImgUrl" width="100%" height="100%" radius="3vw" />
        </div>
        <div class="item-description flex flex-col flex-ard">
          <div class="item-name van-ellipsis">{{ item.name }}</div>
          <div class="item-count-author van-ellipsis">{{ item.trackCount }}首</div>
        </div>
      </div>
    </div>
    <div v-if="subscribedlist.length" class="playlist marginTop20">
      <div class="playlist-header">
        收藏歌单<span>({{ subscribedlist.length }}个)</span>
      </div>
      <div v-for="item in subscribedlist" :key="item.id" class="items flex" @click="router.push({ name: 'songsheet', params: { id: item.id } })">
        <div class="item-cover marginRight10">
          <van-image :src="item.coverImgUrl" width="100%" height="100%" radius="3vw" />
        </div>
        <div class="item-description flex flex-col flex-ard">
          <div class="item-name van-ellipsis">{{ item.name }}</div>
          <div class="item-count-author van-ellipsis">{{ item.trackCount }}首, by {{ item.creator.nickname }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onMounted, onUnmounted, watch } from 'vue'
import { getUserInfo, getUserPlaylist } from '@/api/user.js'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import countUnit from '@/utils/countUnit.js'
import { getCity, getBirth } from '@/utils'
import dayjs from 'dayjs'
import { ImagePreview, Toast } from 'vant'
export default {
  name: 'UserInfo',
  props: {
    id: {
      type: [Number, String],
      default: ''
    }
  },
  setup(props, context) {
    const { id } = toRefs(props)
    const router = useRouter()
    const store = useStore()
    let userProfile = reactive({})
    let level = ref(0)
    let createDays = ref(0)
    let permission = ref(false)

    watch(
      id,
      () => {
        let userId = +store.getters.userid
        if (!userId) {
          userId = +JSON.parse(localStorage.getItem('userId'))
        }
        permission.value = userId === +id.value
      },
      { immediate: true, deep: true }
    )

    getUserInfo({ uid: id.value }).then((res) => {
      // console.log(res, 'getUserInfo')
      if (res.code === 200) {
        Object.assign(userProfile, res.profile)
        level.value = res.level
        createDays.value = res.createDays
      } else {
        Toast.fail('没有找到该村民的信息')
        router.go(-1)
      }
    })

    let subscribedlist = reactive([]) // 收藏的歌单
    let userplaylist = reactive([]) // 用户创建的歌单
    let subscribedCount = ref(0) // 被收藏次数
    getUserPlaylist({ uid: id.value }).then((res) => {
      // console.log(res, 'getUserPlaylist')
      if (res.code === 200) {
        res.playlist.forEach((item) => {
          if (item.userId !== +id.value) {
            subscribedlist.push(item)
          } else {
            userplaylist.push(item)
            subscribedCount.value += item.subscribedCount
          }
        })
      }
    })

    let scrollTop = ref(0)
    let showName = ref(false)
    const handler = () => {
      scrollTop.value = document.documentElement.scrollTop
      // console.log(scrollTop.value)
      if (scrollTop.value >= 200) {
        showName.value = true
      } else {
        showName.value = false
      }
    }
    onMounted(() => {
      document.addEventListener('scroll', handler)
    })
    onUnmounted(() => {
      document.removeEventListener('scroll', handler)
    })

    const preview = (url) => {
      ImagePreview([url])
    }

    return {
      userProfile,
      router,
      store,
      level,
      createDays,
      countUnit,
      subscribedlist,
      userplaylist,
      scrollTop,
      showName,
      subscribedCount,
      getCity,
      getBirth,
      dayjs,
      permission,
      preview
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/func.scss';
.header {
  width: 100vw;
  padding: 0 4vw;
  height: 6vh;
  line-height: 6vh;
  top: 0;
  left: 0;
  z-index: 9;
  position: fixed;
}
.top-part {
  position: relative;
  padding: getvh(150) 4vw 0 4vw;
  height: getvh(520);
  background: none;
  overflow: hidden;
  .top-part-bg {
    top: 0;
    left: -50%;
    width: 200%;
    height: 100%;
    border-radius: 0 0 50% 50% / 0 0 30% 30%;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }
}
.userinfo {
  position: relative;
  width: 100%;
  height: 20vh;
  border-radius: 3vw;
  background: -webkit-linear-gradient(top, rgba(44, 44, 44, 0.9), rgba(21, 21, 21, 1));
  margin-top: -9vw;
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
    font-size: 3.2vw;
    color: gray;
  }
  .tags {
    width: 80%;
    height: 6vw;
    margin: 0 auto;
    .tags-item {
      height: 100%;
      border-radius: 2vw;
      background-color: var(--sub-theme-color);
      font-size: 2.4vw;
      text-align: center;
      line-height: 6vw;
      padding: 0 2vw;
    }
  }
}
.base {
  width: 100%;
  height: 24vh;
  background: var(--sub-theme-color);
  border-radius: 4vw;
  padding: 4vw;
  margin-top: 4vw;
  .base-header {
    font-size: 4.6vw;
    margin-bottom: 1vh;
  }
  .base-body {
    font-size: 3.6vw;
    .th {
      color: rgb(128, 126, 126);
    }
    .tr {
      line-height: 4vh;
      color: rgb(207, 206, 206);
    }
  }
}
.playlist {
  background-color: var(--sub-theme-color);
  border-radius: 3vw;
  padding: 3vw 4vw 1vw;
  .playlist-header {
    font-size: 4.2vw;
    margin-bottom: 1vw;
    span {
      margin-left: 1vw;
      font-size: 3.6vw;
      color: gray;
    }
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
  }
}
</style>
