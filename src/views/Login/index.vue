<template>
  <van-nav-bar :border="false" title="手机号登录" safe-area-inset-top />
  <div class="contianer">
    <transition name="van-slide-left">
      <div class="inp-phone" v-show="send">
        <div class="title flex flex-start">登录体验更多精彩</div>
        <div class="tip">未注册手机号登录后将自动创建账号</div>
        <van-form class="marginTop20" @submit="sendPhoneCode">
          <van-cell-group inset>
            <van-field v-model="tel" type="tel" icon-prefix="net" left-icon="shouji" placeholder="请输入手机号" maxlength="11" :rules="rules" class="inp" />
          </van-cell-group>
          <div style="margin-top: 10vw">
            <van-button round block type="danger" native-type="submit"> 下一步 </van-button>
          </div>
          <div class="text-center marginTop20 findback">
            <!-- <router-link to="/home">找回账号</router-link> -->
          </div>
        </van-form>
      </div>
    </transition>
    <transition name="van-slide-left">
      <div class="code" v-show="!send">
        <div class="title flex flex-start">请输入验证码</div>
        <div class="tip flex flex-bet">
          <div class="flex">
            <div class="marginRight10">已发送至 {{ tel }}</div>
            <div style="font-size: 4vw" @click="send = !send"><svg-icon icon-class="edit" /></div>
          </div>
          <div v-if="!downCount" @click="sendPhoneCode">重新发送</div>
          <div v-else>重新发送 {{ downCount }} s</div>
        </div>
        <div class="marginTop20">
          <van-password-input :value="code" :length="4" :focused="showKeyboard" @focus="showKeyboard = true" :mask="false" :gutter="10" />
          <van-number-keyboard v-model="code" :show="showKeyboard" @blur="showKeyboard = false" maxlength="4" />
        </div>
        <div class="text-center marginTop20">
          <div @click="cantGetCode">手机号已更换，无法接收短信？<van-icon name="arrow" /></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { onBeforeUnmount, reactive, ref, watch } from 'vue'
import { sendCode, verifyCode } from '@/api/user.js'
import { Toast } from 'vant'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'Phone',
  setup() {
    let store = ref(null)
    let router = ref(null)
    store = useStore()
    router = useRouter()
    const tel = ref('')
    const send = ref(true)
    const rules = reactive([
      { required: true, message: '请填写手机号' },
      { pattern: /^1[3|4|5|8|]\d{9}$/, message: '请输入正确的手机号' }
    ])
    const code = ref('')
    const showKeyboard = ref(false)
    const downCount = ref(0)
    const downTimer = ref(null)
    watch(code, (newval) => {
      console.log(newval)
      if (newval.length === 4) {
        verifyCode({ phone: tel.value, captcha: newval }).then((res) => {
          if (+res.code === 200) {
            // console.log(res, newval, 'verify')
            store.dispatch('user/login', { phone: tel.value, captcha: newval }).then((res) => {
              if (+res.code === 200) {
                // console.log(res, 'login')
                router.push({ path: '/home', name: 'home' })
              } else if (+res.code === 503) {
                Toast.fail('验证码有误')
              } else {
                Toast.fail('您的手机尚未绑定云音乐')
              }
            })
          } else {
            Toast.fail(res.message)
          }
        })
      }
    })
    const sendPhoneCode = () => {
      downCount.value = 60
      sendCode({ phone: tel.value, ctcode: 86 }).then((res) => {
        if (+res.code === 200) {
          Toast.success('发送成功')
          send.value = false
          downTimer.value = setInterval(() => {
            downCount.value--
            if (downCount.value === 0) {
              clearInterval(downTimer.value)
            }
          }, 1000)
        } else {
          Toast.fail(res.message)
        }
      })
    }
    const cantGetCode = () => {
      Toast.fail('该功能暂时还没开通')
    }

    onBeforeUnmount(() => {
      clearInterval(downTimer.value)
    })
    return {
      tel,
      send,
      code,
      showKeyboard,
      rules,
      downCount,
      sendPhoneCode,
      cantGetCode
    }
  }
}
</script>

<style lang="scss" scoped>
.contianer {
  padding: 8vw 4vw 0;
  .inp-phone {
    line-height: 2;
    .title {
      font-size: 6vw;
    }
    .tip {
      font-size: 4.2667vw;
      color: #a6a6a6;
    }
    .findback {
      font-size: 4vw;
    }
  }
  .code {
    line-height: 2;
    .title {
      font-size: 6vw;
    }
    .tip {
      font-size: 4.2667vw;
      color: #a6a6a6;
    }
    .router-link-active {
      color: #8d8d8d;
      font-size: 4vw;
    }
  }
}
</style>
