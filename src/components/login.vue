<template>
    <div class="login-container">
        <div class="login-box">
            <!-- 头像区域 -->
            <div class="avatar-box">
                <img src="../assets/loli.jpg" alt="Avatar">
            </div>
            <!-- 登录表单区域 -->
            <el-form ref="loginFormRef" class="login-form" :rules="loginFormRules" :model="loginForm">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btn-box">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        
    </div>
    
</template>

<script>
    export default {
        data(){
            return{
                // 登录表单的数据绑定对象
                loginForm: {
                    username: 'admin',
                    password: '123456',
                },
                // 表单的验证规则对象
                loginFormRules: {
                    // 验证用户名是否合法
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur'}
                    ],

                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            // 点击重置按钮，重置表单
            resetLoginForm(){
                // console.log(this)
                this.$refs.loginFormRef.resetFields()
            },
            // 验证表单
            login(){
                this.$refs.loginFormRef.validate(async (valid) => {
                    // console.log(valid)
                    if(!valid) return;
                    const {data: res} =await this.$http.post('login', this.loginForm)
                    if(res.meta.status !== 200) return this.$message.error('登陆失败');
                    this.$message.success('登陆成功');

                    // console.log(res)
                    window.sessionStorage.setItem("token", res.data.token);
                    this.$router.push('/home');

                    // 1.将登陆成功之后的token，保存到客户端的sessionStorage中
                    // 2. 登陆后跳转到主页，路由地址是/home
                } )
            }
        }
        
    };
</script>

<style lang="less" scoped>
    .login-container {
        background-color: #2b4b6b;
        height: 100%;
        position: relative;
    }
    
    .login-box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        

        .avatar-box {
            height: 130px;
            width: 130px;
            // border: 1px solid #eee;
            border-radius: 50%;
            padding: 8px;
            background-color: #eee;
            box-shadow: 0 0 8px #ccc;
            position: absolute;        
            left: 50%;
            top: -25%;
            transform: translate(-50%);
            
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }

    }
    .login-form{
        margin-top: 100px;
        padding:0 30px;
    }

    .btn-box{
        display: flex;
        justify-content: flex-end;
    }

</style>