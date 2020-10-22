<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <div slot="header">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-button icon="el-icon-plus" type="primary"  @click="showAddDialog">添加角色</el-button>
                    </el-col>
                </el-row>
            </div>
            
            <!-- 表格区域 -->
            <el-table :data="roleList" style="width: 100%" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-row :gutter="10" :class="['bd-bottom', id==0 ?'bd-top': '']" v-for="(item, id) in props.row.children" :key="id">
                            <el-col :span="8">
                                <el-tag type="success" closable @close="openRightsDelConfirm(props.row, item.id)">{{item.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="16">
                                <el-row :gutter="10" v-for="(item2, id2) in item.children" :class="id2==0 ?'': 'bd-top'" :key="id2">
                                    <el-col :span="8">
                                        <el-tag type="primary" closable @close="openRightsDelConfirm(props.row, item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="16">
                                        <el-tag v-for="(item3, id3) in item2.children" :key="id3" type="warning" closable 
                                        @close="openRightsDelConfirm(props.row, item3.id)">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <!-- 编辑 -->
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showModifyRole(scope.row.id)">编辑</el-button>
                        <!-- 删除 -->
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="openRoleDelConfirm(scope.row.id)">删除</el-button>
                        <!-- 分配权限 -->
                        <el-button size="mini" type="warning" icon="el-icon-setting" @click="openRightAllotDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
           

            <!-- 添加角色对话框 -->
            <el-dialog
                title="添加角色"
                :visible.sync="addDialogVisible"
                width="50%" :close-on-click-modal="false" @close="resetAddForm">
                <!-- 内容主体区域 -->
                <el-form ref="addRoleFormRef" :rules="addRoleFormRules" :model="addRoleForm" label-width="80px">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="addRoleForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc" :required="false">
                        <el-input v-model="addRoleForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <div slot="footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addRole">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 修改角色对话框 -->
            <el-dialog
                title="修改角色"
                :visible.sync="modifyRoleDialogVisible"
                width="50%" :close-on-click-modal="false" @close="resetModifyRoleForm">
                <!-- 内容主体区域 -->
                <el-form ref="modifyRoleFormRef" :rules="modifyRoleFormRules" :model="modifyRoleForm" label-width="80px">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="modifyRoleForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc" :required="false">
                        <el-input v-model="modifyRoleForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <div slot="footer">
                    <el-button @click="modifyRoleDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="modifyRole">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 分配权限对话框 -->
            <el-dialog title="分配权限" :visible.sync="allotRightVisible" width="50%" :close-on-click-modal="false" @close="resetTakenRightList">
                <el-tree
                    show-checkbox
                    default-expand-all
                    :default-checked-keys="rightTakenList"
                    :data="rightList"
                    :props="rightProps"
                    node-key="id"
                    ref="treeRef">
                </el-tree>
                <div slot="footer">
                    <el-button @click="allotRightVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateRights">确 定</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
export default{
    data(){
        return{
            roleList:[],
            addDialogVisible: false,
            // 添加角色表单
            addRoleForm:{
                roleName: '',
                roleDesc: ''
            },

            // 添加角色表单校验
            addRoleFormRules:{
                roleName:[
                    {required: true, message:'请输入角色名称', trigger: 'blur'}
                ]
            },
            // 添加角色表单校验
            modifyRoleFormRules:{
                roleName:[
                    {required: true, message:'请输入角色名称', trigger: 'blur'}
                ]
            },
            modifyRoleDialogVisible: false,
            // 修改角色信息弹框
            modifyRoleForm:{},
            // 所有权限树形列表
            rightList:[],
            // 分配权限对话框显示控制
            allotRightVisible: false,
            rightProps:{
                children: 'children',
                label:'authName'
            },
            // 角色已有权限的id列表
            rightTakenList: [],
            // 当前角色的id
            activeRoleId: 0


                
        }
    },
    created(){
        this.getRoleList()
    },
    methods: {
        // 获取角色列表
        async getRoleList(){
            const {data: res} = await this.$http.get('roles')
            if(res.meta.status !== 200){
                return this.$message.error('角色列表获取失败！')
            }
            // this.$message.success('角色列表获取成功')
            this.roleList = res.data
        },
        // 显示添加角色对话框
        showAddDialog(){
            this.addDialogVisible = true
        },
        // 重置添加角色对话框
        resetAddForm(){
            this.$refs.addRoleFormRef.resetFields()
        },
        // 重置添加角色对话框
        resetModifyRoleForm(){
            this.$refs.modifyRoleFormRef.resetFields()
        },
        // 添加角色
        addRole(){
            this.$refs.addRoleFormRef.validate(async (valid) => {
                if (!valid) {
                    return this.$message.error('出现了问题！')
                }
                const {data: res} = await this.$http.post('roles', this.addRoleForm)
                console.log(res)
                if(res.meta.status !==201){
                    return this.$message.error('添加角色失败！')
                }
                this.$message.success('角色创建成功')
                this.addDialogVisible = false
                this.getRoleList()
            })
        },

        // 打开删除角色确认弹出框
        openRoleDelConfirm(id){
            this.$confirm('此操作将永久删除此角色，是否继续？', '删除角色', {
                confirmButtonText: '确定',
                concelButtonText: '取消',
                type: 'warning'
            }).then(async ()=>{
                const {data: res} = await this.$http.delete('roles/'+id)
                if(res.meta.status !==200){
                     this.$message.error('删除角色失败！')
                }
                this.$message.success('删除成功')
                this.getRoleList()
            }).catch(()=>{
                this.$message.info('已取消删除')
            })
        },
        
        // 打开修改角色对话框
        async showModifyRole(id){
            this.modifyRoleDialogVisible = true
            const {data: res} = await this.$http.get('roles/'+ id)
            // console.log()
            if(res.meta.status !== 200){
                return this.$message.error('角色信息获取失败！')
            }
            this.modifyRoleForm = res.data
        },
        
        // 修改角色信息
        modifyRole(){
            this.$refs.modifyRoleFormRef.validate(async (valid) => {
                if(!valid){
                    return this.$message.error('表单有错误，请检查！')
                }
                const {data: res} = await this.$http.put('roles/'+ this.modifyRoleForm.roleId, {
                    roleName: this.modifyRoleForm.roleName,
                    roleDesc: this.modifyRoleForm.roleDesc
                })
                if(res.meta.status !==200){
                    return this.$message.error('修改用户信息失败！')
                }
                this.modifyRoleDialogVisible = false
                this.$message.success('修改用户信息成功！')
                // 重新获取用户列表
                this.getRoleList()                
            })
        },

        // 打开删除角色确认弹出框
        openRightsDelConfirm(role, rightId){
            this.$confirm('此操作将删除该角色的此权限，是否继续？', '删除权限', {
                confirmButtonText: '确定',
                concelButtonText: '取消',
                type: 'warning'
            }).then(async ()=>{
                const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                if(res.meta.status !==200){
                    console.log(res)
                    return this.$message.error('删除权限失败！')
                }
                this.$message.success('权限已删除')
                // 将返回的数据直接赋值给当前的role的children，这里的role就是props.row
                role.children = res.data   
                // this.getRoleList()
            }).catch(()=>{
                this.$message.info('已取消删除')
            })
        },

        // 分配权限对话框
        async openRightAllotDialog(role){
            // 获取所有的权限列表
            const {data: res} = await this.$http.get('rights/tree')
            if(res.meta.status !== 200){
                return this.$message.error('权限获取失败！')
            }
            // this.$message.success('权限获取成功！')
            this.rightList = res.data
            this.getTakeRightsId(role,this.rightTakenList)

            // 赋值保存当前roleId
            this.activeRoleId = role.id
            // 对话框显示控制
            this.allotRightVisible = true

        },

        // 通过递归获取当前角色已有的三级权限，并保存到rightTakenList数组中
        getTakeRightsId(node, arr){
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach((item) =>{
                this.getTakeRightsId(item, arr)
            })
        },

        // 重置rightTakenList列表，防止再次打开时数据叠加
        resetTakenRightList(){
            this.rightTakenList = []
        },
        
        // 分配更新权限
        async updateRights(){

            // 获取选中和半选中的列表keys
            const keys =[
                // ...是扩展运算符，将后面的数组拆分开
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ] 
            const keysStr = keys.join(',')

            // 发送请求
            const {data: res} = await this.$http.post(`roles/${this.activeRoleId}/rights`, {
                rids: keysStr
            })
            if(res.meta.status !== 200){
                return this.$message.error('权限分配失败！')
            }
            this.$message.success('权限分配成功')
            this.getRoleList()
            this.allotRightVisible = false
        }
    }
}
</script>

<style lang="less" scoped>
.el-tag{
    margin: 7px;
}
.bd-top{
    border-top: 1px solid #eee;
}
.bd-bottom{
    border-bottom: 1px solid #eee;
}

.el-row{
    display: flex;
    align-items: center;
}
</style>
