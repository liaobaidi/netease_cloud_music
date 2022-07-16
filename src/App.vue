<template>
  <!-- <keep-alive>
    <router-view />
  </keep-alive> -->
  <router-view v-slot="{ Component }">
    <transition>
      <div id="app">
        <keep-alive include="Listen">
          <component :is="Component" />
        </keep-alive>
      </div>
    </transition>
  </router-view>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import '@/style/iconfont.scss';
@import '@/style/base.scss';
@import '@/style/custom.scss';
@import '@/style/vant.scss';
</style>
