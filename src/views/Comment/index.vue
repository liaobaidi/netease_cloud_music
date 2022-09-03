<template>
  <div class="header padding4vw fixed flex flex-acenter">
    <van-icon class-prefix="net" name="xiangzuo-jiantou" class="icon-size" @click="router.go(-1)" />
    <div class="marginLeft10">评论({{ total }})</div>
  </div>
  <div style="height: 6vh" />
  <div class="playlist padding4vw flex flex-acenter relative" @click="router.push({ name: 'songsheet', params: { id }, query: { al } })">
    <div class="cover">
      <van-image :src="info.coverImgUrl || info.picUrl" radius="2vw" width="100%" height="100%" />
    </div>
    <div class="info flex flex-col flex-ard">
      <div class="nickname van-ellipsis">{{ info.name }}</div>
      <div class="author flex flex-acenter">
        by
        <span v-if="!al" class="link" @click.stop="router.push({ name: 'userinfo', params: { id: info.creator.userId } })">{{ info.creator && info.creator.nickname }}</span>
        <span v-else class="link" @click.stop="router.push({ name: 'artist', params: { id: info.artist.id } })">{{ info.artist && info.artist.name }}</span>
      </div>
    </div>
    <div class="icon absolute">
      <van-icon name="arrow" />
    </div>
  </div>
  <div class="comments padding4vw">
    <van-sticky offset-top="6vh">
      <div class="com-header flex flex-bet flex-acenter">
        <div class="blod">评论区</div>
        <div>
          <span :class="['type', type === 0 ? 'active' : '']" @click="type = 0">推荐</span>
          <span :class="['type', type === 1 ? 'active' : '']" @click="type = 1">最热</span>
          <span :class="['type', type === 2 ? 'active' : '']" @click="type = 2">最新</span>
        </div>
      </div>
    </van-sticky>
    <div class="com-main">
      <van-list v-model:loading="loading" :finished="finished" finished-text="人家也是有底线的" @load="onLoad">
        <div class="item relative" v-for="(item, index) in commentsCom" :key="item.commentId">
          <div class="info flex flex-acenter relative">
            <div class="cover" @click="router.push({ name: 'userinfo', params: { id: item.user.userId } })">
              <van-image :src="item.user.avatarUrl" round width="100%" height="100%" />
            </div>
            <div class="detail" @click="router.push({ name: 'userinfo', params: { id: item.user.userId } })">
              <div class="nickname">{{ item.user.nickname }}</div>
              <div class="time">{{ item.timeStr }}</div>
            </div>
            <div class="icon absolute">
              <span :class="follows[index] ? 'active' : ''">{{ countUnit(followCount[index]) }}</span>
              <van-icon v-if="!follows[index]" name="good-job-o" size="3.2vw" @click="triggleLike(item.commentId, 1)" />
              <van-icon v-else name="good-job" size="3.2vw" color="#d03333" @click="triggleLike(item.commentId, 0)" />
            </div>
          </div>
          <div class="content flex flex-acenter">{{ item.content }}</div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref, toRefs, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPlayListDetail, getAlbums } from '@/api/songList.js'
import { getComments, likeComment, getAlbumComments } from '@/api/comment.js'
import countUnit from '@/utils/countUnit.js'
export default {
  name: 'Comment',
  props: {
    id: {
      type: [Number, String],
      default: ''
    }
  },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    let { id } = toRefs(props)
    let al = ref(0)
    let info = reactive({})
    let loading = ref(true)
    let finished = ref(false)
    let page = ref(1)
    let total = ref(0)
    let isFirst = ref(true)

    const onLoad = () => {
      if(loading.value && isFirst.value) {
        return
      }
      page.value += 50
    }
    watchEffect(async () => {
      console.log(page.value) //不能省略
      al.value = route.query.isal
      if (isNaN(al.value)) al.value = 0
      if (+al.value) {
        const res = await getAlbums({ id: id.value })
        // console.log(res, 'getAlbums')
        if (res.code === 200) {
          Object.assign(info, res.album)
        }
        loading.value = true
        getAlbumComments({ id: id.value, limit: 50, offset: page.value })
          .then((res) => {
            isFirst.value = false
            // console.log(res, 'getAlbumComments')
            if (res.code === 200) {
              if (res.comments.length === 0) {
                finished.value = true
              }
              total.value = res.total
              comments.push(...res.comments)
              follows.push(...res.comments.map((item) => item.liked))
              followCount.push(...res.comments.map((item) => item.likedCount))
            }
          })
          .finally(() => {
            loading.value = false
          })
      } else {
        const res = await getPlayListDetail({ id: id.value })
        // console.log(res, 'getPlayListDetail')
        if (res.code === 200) {
          Object.assign(info, res.playlist)
        }
        loading.value = true
        getComments({ id: id.value, limit: 50, offset: page.value })
          .then((res) => {
            isFirst.value = false
            // console.log(res, 'getComments')
            if (res.code === 200) {
              if (res.comments.length === 0) {
                finished.value = true
              }
              total.value = res.total
              comments.push(...res.comments)
              follows.push(...res.comments.map((item) => item.liked))
              followCount.push(...res.comments.map((item) => item.likedCount))
            }
          })
          .finally(() => {
            loading.value = false
          })
      }
    })

    let comments = reactive([])
    let follows = reactive([])
    let followCount = reactive([])
    let type = ref(0)
    let commentsCom = computed(() => {
      let result = [...comments]
      if (type.value === 0) {
        // 推荐排序
        follows.length = 0
        follows.push(...result.map((item) => item.liked))
        followCount.length = 0
        followCount.push(...result.map((item) => item.likedCount))
        return result
      } else if (type.value === 1) {
        // 最热排序
        follows.length = 0
        follows.push(...result.sort((a, b) => b.likedCount - a.likedCount).map((item) => item.liked))
        followCount.length = 0
        followCount.push(...result.sort((a, b) => b.likedCount - a.likedCount).map((item) => item.likedCount))
        return result.sort((a, b) => b.likedCount - a.likedCount)
      } else {
        // 最新排序
        follows.length = 0
        follows.push(...result.sort((a, b) => b.time - a.time).map((item) => item.liked))
        followCount.length = 0
        followCount.push(...result.sort((a, b) => b.time - a.time).map((item) => item.likedCount))
        return result.sort((a, b) => b.time - a.time)
      }
    })

    const triggleLike = (cid, t) => {
      let type = 2
      al.value ? (type = 3) : (type = 2)
      likeComment({ id: id.value, cid, t, type }).then((res) => {
        if (res.code === 200) {
          let index = commentsCom.value.findIndex((item) => item.commentId === cid)
          follows[index] = !follows[index]
          t ? followCount[index]++ : followCount[index]--
        }
      })
    }

    return {
      router,
      id,
      info,
      al,
      type,
      commentsCom,
      follows,
      followCount,
      countUnit,
      loading,
      finished,
      total,
      onLoad,
      triggleLike
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  width: 100vw;
  height: 6vh;
  background-color: var(--sub-theme-color);
  font-weight: 500;
  z-index: 9;
}
.playlist {
  width: 100vw;
  height: 20vw;
  .cover {
    width: 16vw;
    height: 16vw;
    margin-right: 2vw;
  }
  .info {
    height: 70%;
    .nickname {
      font-size: 4.2vw;
      width: 60vw;
    }
    .author {
      font-size: 3.4vw;
      .link {
        margin-left: 2vw;
        color: rgb(3, 95, 156);
      }
    }
  }
  .icon {
    color: #ccc;
    right: 4vw;
  }
}
.comments {
  margin-top: 2vw;
  .com-header {
    height: 6vw;
    font-size: 3.6vw;
    background-color: var(--theme-color);
    .type {
      margin-left: 4vw;
      font-size: 3.4vw;
      color: rgb(103, 103, 103);
      &.active {
        color: #fff;
      }
    }
  }
  .com-main {
    margin-top: 2vw;
    .nodata {
      height: 60vw;
      width: 100%;
    }
    .item {
      width: 100%;
      // height: 24vw;
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 12vw;
        width: 84vw;
        height: 1px;
        border-bottom: 1px solid rgb(55, 55, 55);
      }
      .info {
        height: 12vw;
        .cover {
          width: 10vw;
          height: 10vw;
        }
        .detail {
          margin-left: 2vw;
          font-size: 4vw;
          .time {
            font-size: 3.2vw;
            color: rgb(130, 130, 130);
          }
        }
        .icon {
          right: 0;
          font-size: 3.2vw;
          .active {
            color: #d03333;
          }
        }
      }
      .content {
        // height: 12vw;
        font-size: 4vw;
        margin-left: 12vw;
        padding-bottom: 4vw;
      }
    }
  }
}
</style>
