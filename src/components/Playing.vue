<template>
  <div class="container flex flex-bet" @click="router.push({ name: 'listen', params: { id: store.getters.current_id } })">
    <span :style="{ backgroundColor: color }"></span>
    <span :style="{ backgroundColor: color }"></span>
    <span :style="{ backgroundColor: color }"></span>
    <span :style="{ backgroundColor: color }"></span>
  </div>
</template>

<script>
import { toRefs } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'Playing',
  props: {
    color: {
      type: String,
      default: '#d03333'
    }
  },
  setup(props) {
    const router = useRouter()
    const store = useStore()
    const { color } = toRefs(props)
    console.log(color.value, 'color')

    return {
      router,
      store,
      color
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 6vw;
  height: 6vw;
  transform: rotate(180deg);
  transform-origin: center;
  span {
    width: 16%;
    height: 6vw;
    border-radius: 0.5vw;
    background-color: #d03333;
    &:nth-child(1) {
      animation: go 1.2s linear 0.2s infinite forwards;
    }
    &:nth-child(2) {
      animation: go 1.2s linear 0.6s infinite forwards;
    }
    &:nth-child(3) {
      animation: go 1.2s linear 0.4s infinite forwards;
    }
    &:nth-child(4) {
      animation: go 1.2s linear 0.8s infinite forwards;
    }
  }
}
@keyframes go {
  0% {
    height: 6vw;
  }
  50% {
    height: 2vw;
  }
  100% {
    height: 6vw;
  }
}
</style>
