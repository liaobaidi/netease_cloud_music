<template>
  <!-- <keep-alive>
    <router-view />
  </keep-alive> -->
  <router-view v-slot="{ Component }">
    <transition>
      <div id="app">
        <keep-alive :include="['Listen', 'Search']">
          <component :is="Component" />
        </keep-alive>
      </div>
    </transition>
  </router-view>
</template>

<script setup>
const initViewport = function (height) {
  const metaEl = document.getElementById('viewportMeta')
  const content = 'width=device-width,initial-scale=1.0,user-scalable=no,maximum-scale=1.0,height=' + height
  metaEl.setAttribute('name', 'viewport')
  metaEl.setAttribute('content', content)
}
initViewport(window.innerHeight)
</script>

<style lang="scss">
@import '@/style/iconfont.scss';
@import '@/style/base.scss';
@import '@/style/custom.scss';
@import '@/style/vant.scss';
</style>
