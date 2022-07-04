<template>
  <div class="cart-container flex flex-col" :style="{ 'background-color': bgColor }">
    <div class="title flex flex-acenter flex-bet">
      <div class="left-text">
        <slot name="left" />
      </div>
      <div class="right-text flex flex-acenter">
        <slot name="right" />
      </div>
    </div>
    <div class="content flex">
      <slot name="main" />
    </div>
  </div>
</template>

<script>
import { toRefs } from '@vue/reactivity'
export default {
  name: 'CartItem',
  props: {
    bgColor: {
      type: String
    }
  },
  setup(prop, context) {
    const { bgColor } = toRefs(prop)
    return {
      bgColor
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/func.scss';
.cart-container {
  width: 100%;
  height: 100%;
  padding: getvh(30) 0 4vw 4vw;
  background-color: var(--theme-color);
  color: var(--theme-text-color);
  .title {
    padding-right: 4vw;
    .left-text {
      font-size: 4.5333vw;
      font-weight: 500;
    }
    .right-text {
      height: getvh(70);
      line-height: getvh(70);
      font-size: 3.6vw;
      padding: 0 1.3333vw;
      border-radius: getvh(35);
      border: 1px solid #373737;
    }
  }
  .content {
    margin-top: getvh(30);
  }
}
</style>
