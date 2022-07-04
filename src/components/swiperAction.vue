<template>
  <div class="swiper-container relative" @touchstart.stop="handleStart" @touchend.stop="handleEnd">
    <slot />
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'SwiperAction',
  emits: ['slide'],
  setup(prop, context) {
    let startX = ref(0)
    let startY = ref(0)
    let direction = ref('')
    const handleStart = (e) => {
      // console.log('点击', e.changedTouches[0].clientX, e.changedTouches[0].clientY)
      startX = e.changedTouches[0].clientX
      startY = e.changedTouches[0].clientY
    }
    const handleEnd = (e) => {
      // console.log('离开', e.changedTouches[0].clientX, e.changedTouches[0].clientY)
      let endX = e.changedTouches[0].clientX
      let endY = e.changedTouches[0].clientY
      if (Math.abs(startX - endX) < 50) {
        return
      }
      startX < endX ?  direction = 'right' : direction = 'left'
      context.emit('slide', { direction })
    }

    return {
      handleStart,
      handleEnd
    }
  }
}
</script>

<style lang="scss" scoped></style>
