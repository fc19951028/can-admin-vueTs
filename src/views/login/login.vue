<template>
    <div id="Login">
        <el-form ref="ruleFormRef" class="form" :model="form" :rules="rules">
            <h3>can后台管理系统</h3>
            <el-form-item prop="username">
                <el-input size="large" :prefix-icon="Avatar" v-model.trim="form.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item prop="password">
                <el-input :type="eyeView ? 'text' : 'password'" size="large" :prefix-icon="Lock"
                    v-model.trim="form.password" placeholder="请输入密码">
                    <template #suffix>
                        <el-icon @click="seePassword">
                            <View v-show="!eyeView" />
                            <Hide v-show="eyeView" />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="loginTap()" size="large" type="primary" style="width: 100%">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Avatar, Lock, View, Hide } from '@element-plus/icons-vue'
import { loginApi } from '@/request/api'
import { useStore } from '@/stores/user'

const router = useRouter();
//是否显示密码
const eyeView = ref(false);
const seePassword = () => {
    eyeView.value = !eyeView.value
}

// 表單數據
const form = ref({
    username: 'admin',
    password: 'admin'
})
const ruleFormRef = ref();
const rules = ref({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 20, message: '用户名长度为5-20位', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 20, message: '密码长度为5-20位', trigger: 'blur' },
    ]
})

// 點擊登錄
const store = useStore();
const loginTap = () => {
    ruleFormRef.value.validate((valid: any, fields: any): void => {
        if (valid) {
            // 校驗成功
            loginApi(form.value).then(res => {
                if (res.code == 200) {
                    store.SET_TOKEN(res.data.token)
                    store.SET_USERINFO(res.data)
                    router.push({ name: 'index' })
                }
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}
</script>

<style lang="scss" scoped>  #Login {
      width: 100vw;
      height: 100vh;
      display: flex;
  }

  .form {
      width: 400px;
      background: #fff;
      border-radius: 10px;
      margin: auto;
      padding: 20px;
      box-sizing: border-box;

      h3 {
          text-align: center;
          margin-bottom: 30px;
      }
  }
</style>
../../request/api