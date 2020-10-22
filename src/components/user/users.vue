<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <div slot="header"></div>
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-input v-model="queryInfo.query" clearable placeholder="请输入内容" @clear="getUserList" @change="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 表格区域 -->
            <el-table :data="userList" style="width: 100%" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="mobile" label="电话号码"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column prop="mg_state" label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" 
                        active-color="#13ce66" 
                        inactive-color="#ff4949"
                        @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150px">
                    <template slot-scope="scope">
                        <!-- 修改用户 -->
                        <el-button circle size="mini" type="primary" icon="el-icon-edit" @click="showModifyUser(scope.row.id)"></el-button>
                        <!-- 删除用户 -->
                        <el-button circle size="mini" type="danger" icon="el-icon-delete" @click="openDelConfirm(scope.row.id)"></el-button>
                        <!-- 分配角色 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top">
                            <el-button circle size="mini" type="warning" icon="el-icon-setting"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>

            <!-- 添加用户对话框 -->
            <el-dialog modal
                title="添加用户"
                :visible.sync="dialogVisible"
                width="50%" :close-on-click-modal="false" @close="resetAddForm()">
                <!-- 内容主体区域 -->
                <el-form ref="addFormRef" :rules="addFormRules" :model="addForm" label-width="80px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <div slot="footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 修改用户对话框 -->
            <el-dialog
                title="修改用户信息"
                :visible.sync="modifyDialogVisible"
                width="50%" :close-on-click-modal="false" destroy-on-close>
                <!-- 内容主体区域 -->
                <el-form ref="modifyFormRef" :rules="modifyFormRules" :model="modifyForm" label-width="80px">
                    <el-form-item label="用户名">
                        <el-input v-model="modifyForm.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="modifyForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="modifyForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <div slot="footer">
                    <el-button @click="modifyDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="modifyUser()">确 定</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
export default{
    data(){
        // 验证邮箱
        var checkEmail = (rule, value, cb) =>{
            // 验证邮箱的正则表达式
            const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
            if(regEmail.test(value)){
                return cb()
            }

            cb(new Error('请输入格式正确的邮箱地址'))

        }

        // 验证手机号
        var checkMobile = (rule, value, cb) =>{
            // 验证手机的正则表达式
            const regMobile = /^1[0-9]{10}$/
            if(regMobile.test(value)){
                return cb()
            }

            cb(new Error('请输入合法的手机号'))

        }


        return{
            // 获取用户列表的参数对象
            queryInfo:{
                query: '',
                // 当前页数
                pagenum: 1,
                // 当前每页显示多少条数据
                pagesize: 2
            },
            userList: [],
            total: 0,
            // 添加用户对话框显示控制
            dialogVisible: false,
            // 修改用户对话框显示控制
            modifyDialogVisible: false,
            // 添加用户
            addForm:{
                username: '',
                password: '',
                email: '',
                password: ''
            },
            // 修改用户
            modifyForm:{
                username: '',
                email: '',
                password: ''
            },
            // 添加用户表单的校验规则
            addFormRules:{
                username:[
                    {required: true, message:'请输入用户名', trigger: 'blur'},
                    {require: true, min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    {required: true, message:'请输入密码', trigger: 'blur'},
                    {require: true, min: 6, max: 10, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                ],
                email:[
                    {required: true, message:'请输入邮箱', trigger: 'blur'},
                    {validator: checkEmail, trigger:'blur'}
                ],
                mobile:[
                    {required: true, message:'请输入手机号', trigger: 'blur'},
                    {validator: checkMobile, trigger:'blur'}
                ],
            },
            // 修改用户表单的校验规则
            modifyFormRules:{
                email:[
                    {required: true, message:'请输入邮箱', trigger: 'blur'},
                    {validator: checkEmail, trigger:'blur'}
                ],
                mobile:[
                    {required: true, message:'请输入手机号', trigger: 'blur'},
                    {validator: checkMobile, trigger:'blur'}
                ],
            },
        }
    },
    created(){
        this.getUserList()
    },
    methods:{
        // 获取用户列表
        async getUserList(){
            const {data: res} = await this.$http.get('/users', {
                params: this.queryInfo
            })
            if(res.meta.status !== 200) {
                return this.$message.error('数据获取失败！')
            }
            this.userList = res.data.users
            this.total = res.data.total
            // console.log(res)
        },

        // 监听pagesize改变事件
        handleSizeChange(newsize){
            this.queryInfo.pagesize = newsize
            this.getUserList()
        },
        
        // 监听页码数改变事件
        handleCurrentChange(newpage){
            this.queryInfo.pagenum = newpage
            this.getUserList()
        },
        // 监听switch开关状态的改变
        async userStateChanged(userinfo){
            // console.log(userinfo)
            const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            // console.log(res)
            if(res.meta.status !== 200){
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error('更新用户状态失败！')
            }
            this.$message.success('更新用户状态成功')
        },
        
        // 重置添加用户表单
        resetAddForm(){
            this.$refs.addFormRef.resetFields()
        },
        // 重置修改用户表单
        resetModifyForm(){
            this.$refs.modifyFormRef.resetFields()
        },

        // 添加新用户
        addUser(){
            this.$refs.addFormRef.validate(async (valid) => {
                if(!valid) return
                // 校验通过，发送网络请求
                const {data: res} = await this.$http.post('users', this.addForm)
                if(res.meta.status !== 201){
                    return this.$message.error('用户添加失败！')
                }
                this.$message.success('用户添加成功！')
                this.dialogVisible = false
                this.getUserList()
                
            })
        },

        // 打开修改用户对话框
        async showModifyUser(id){
            this.modifyDialogVisible = true
            const {data: res} = await this.$http.get('users/'+ id)
            // console.log()
            if(res.meta.status !== 200){
                return this.$message.error('用户信息获取失败！')
            }
            this.modifyForm = res.data
        },
        // 修改用户信息
        modifyUser(){
            this.$refs.modifyFormRef.validate(async (valid) => {
                if(!valid){
                    return this.$message.error('表单有错误，请检查！')
                }
                
                const {data: res} = await this.$http.put('users/'+ this.modifyForm.id, {
                    email: this.modifyForm.email,
                    mobile: this.modifyForm.mobile
                })
                if(res.meta.status !==200){
                    return this.$message.error('修改用户信息失败！')
                }
                this.modifyDialogVisible = false
                this.$message.success('修改用户信息成功！')
                // 重新获取用户列表
                this.getUserList()                
            })
        },

        // 打开删除用户确认弹出框
        openDelConfirm(id){
            this.$confirm('确定要删除此用户吗，是否继续？', '删除用户', {
                confirmButtonText: '确定',
                concelButtonText: '取消',
                type: 'warning'
            }).then(async ()=>{
                const {data: res} = await this.$http.delete('users/'+id)
                if(res.meta.status !==200){
                     this.$message.error('删除用户失败！')
                }
                this.$message.success('删除成功')
                this.getUserList()
            }).catch(()=>{
                this.$message.info('已取消删除')
            })
        },


    }
}
</script>
<style lang="less" scoped>

</style>
