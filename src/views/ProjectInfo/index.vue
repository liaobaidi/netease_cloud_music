<template>
  <div class="header flex flex-acenter">
    <van-icon class-prefix="net" name="xiangzuo-jiantou" color="#fff" class="icon-size" @click="router.go(-1)" />
    <div class="marginLeft10">项目详情</div>
  </div>
  <div class="container">
    <div class="part">
      <div class="title">基本信息</div>
      <div class="desc">本项目是一个纯前端项目，本项目所用到的所有后台数据，均来自GitHub开源库<a class="achor" href="https://github.com/Binaryify/NeteaseCloudMusicApi">网易云音乐API</a></div>
      <div class="table">
        <div class="tr flex flex-acenter" v-for="(item, index) in info" :key="index">
          <div class="tr-left flex flex-center flex-acenter">{{ item.name }}</div>
          <div class="tr-right flex flex-center flex-acenter">
            <a :href="tem.link" class="achor" v-if="item.link">{{ item.desc }}</a>
            <span v-else>{{ item.desc }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="part marginTop20">
      <div class="title">生产环境依赖</div>
      <div class="table">
        <div class="tr flex flex-acenter" v-for="(value, key) in dependencies" :key="key">
          <div class="tr-left version flex flex-center flex-acenter">{{ key }}</div>
          <div class="tr-right version flex flex-center flex-acenter">{{ value }}</div>
        </div>
      </div>
    </div>
    <div class="part marginTop20">
      <div class="title">开发环境依赖</div>
      <div class="table">
        <div class="tr flex flex-acenter" v-for="(value, key) in devDependencies" :key="key">
          <div class="tr-left version flex flex-center flex-acenter">{{ key }}</div>
          <div class="tr-right version flex flex-center flex-acenter">{{ value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="ProjectInfo">
import { useRouter } from 'vue-router'
import { dependencies, devDependencies } from '@/../package.json'
const router = useRouter()
const info = [
{
    name: '项目名称',
    desc: 'netease_cloud_music'
  },
  {
    name: '作者',
    desc: 'liaobaidi',
    link: 'http://175.178.123.70:5000/liao'
  },
  {
    name: 'Github',
    desc: 'Github',
    link: 'https://github.com/liaobaidi/netease_cloud_music'
  },
  {
    name: 'Gitee',
    desc: 'Gitee',
    link: 'https://gitee.com/liaobaidi/netease_cloud_music'
  },
  {
    name: '预览地址',
    desc: '预览地址',
    link: 'http://175.178.123.70:5000'
  },
  {
    name: 'Api',
    desc: 'Api',
    link: 'https://github.com/Binaryify/NeteaseCloudMusicApi'
  }
]
</script>

<style lang="scss" scoped>
.header {
  width: 100vw;
  padding: 0 4vw;
  height: 6vh;
  line-height: 6vh;
  top: 0;
  left: 0;
  z-index: 9;
  position: fixed;
  background-color: var(--theme-color);
}
.container {
  background-color: #eee;
  min-height: 94vh;
  color: #222;
  padding-top: 6vh;
  .title {
    font-size: 4.2667vw;
    font-weight: 600;
  }
  .desc {
    font-size: 4vw;
    margin-top: 2.6667vw;
  }
  .part {
    padding: 4vw;
    background: #fff;
  }
  .table {
    width: 100%;
    border: 1px solid #ccc;
    margin: 4vw 0;
    .tr {
      height: 10.6667vw;
      border-bottom: 1px solid #ccc;
      .tr-left {
        flex: 1;
        height: 100%;
        border-right: 1px solid #ccc;
        background-color: #eee;
        &.version {
          flex: 2;
        }
      }
      .tr-right {
        flex: 2;
        &.version {
          flex: 1;
        }
      }
    }
  }
  .achor {
    color: rgb(103, 203, 243);
  }
}
</style>
