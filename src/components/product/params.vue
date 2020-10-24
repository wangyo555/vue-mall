<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <div slot="header">
                <!-- 提示框 -->
                <el-alert
                    title="注意：只允许为第三级分类设置相关参数！"
                    type="warning" show-icon :closable="false">
                </el-alert>
                <!-- 级联选择框 -->
                <el-row :gutter="10" class="row-gap">
                    <el-col>
                        <span>选择商品分类：</span>
                        <el-cascader
                            :options="cateList"
                            :props="casProps"
                            v-model="selectedCate"
                            @change="cateChange">
                        </el-cascader>
                    </el-col>
                </el-row>
            </div>
            <div>
                <!-- 标签切换 -->
                <el-tabs v-model="activeName" @tab-click="handleTabClick">
                    <!-- 动态参数 -->
                    <el-tab-pane label="动态参数" name="many">
                        <el-button type="primary" :disabled="btnStatus" @click="oepnAddParamsDialog()">添加参数</el-button>
                        <!-- 动态参数表格 -->
                        <el-table border stripe
                            :data="manyParams"
                            style="width: 100%">
                            <el-table-column type="expand">
                                <template slot-scope="scope">
                                </template>
                            </el-table-column>
                            <el-table-column type="index" label="#"></el-table-column>
                            <el-table-column
                                prop="attr_name"
                                label="参数名称">
                            </el-table-column>
                            <el-table-column
                                label="操作" width="200px">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="oepnEditParamsDialog(scope.row)">修改</el-button>
                                    <el-button size="mini" type="primary" icon="el-icon-delete" @click="delParams(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <!-- 静态属性 -->
                    <el-tab-pane label="静态属性" name="only">
                        <el-button type="primary" :disabled="btnStatus" @click="oepnAddParamsDialog()">添加属性</el-button>
                        <!-- 静态属性表格 -->
                        <el-table border stripe type="index"
                            :data="onlyParams"
                            style="width: 100%">
                            <el-table-column type="expand">
                                <template slot-scope="scope">
                                </template>
                            </el-table-column>
                            <el-table-column type="index" label="#"></el-table-column>
                            <el-table-column
                                prop="attr_name"
                                label="属性名称">
                            </el-table-column>
                            <el-table-column
                                label="操作" width="200px">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="oepnEditParamsDialog(scope.row)">修改</el-button>
                                    <el-button size="mini" type="primary" icon="el-icon-delete" @click="delParams(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>

                <!-- 添加属性参数对话框 -->
                <el-dialog
                    :title="'添加'+addParamsDialogTitle"
                    :visible.sync="addParamsDialog"
                    width="50%" @close="resetAddParamsForm">
                    <el-form ref="addParamsFormRef" :model="addParamsForm" :rules="addParamsFormRules" label-width="150px">
                        <el-form-item :label="'添加'+addParamsDialogTitle" prop="attr_name">
                            <el-input v-model="addParamsForm.attr_name"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer">
                        <el-button @click="addParamsDialog = false">取 消</el-button>
                        <el-button type="primary" @click="addParams">确 定</el-button>
                    </div>
                </el-dialog>

                <!-- 修改属性参数对话框 -->
                <el-dialog
                    :title="'修改'+addParamsDialogTitle"
                    :visible.sync="editParamsDialog"
                    width="50%" @close="resetEditParamsForm">
                    <el-form ref="editParamsFormRef" :model="editParamsForm" :rules="editParamsFormRules" label-width="150px">
                        <el-form-item :label="'修改'+addParamsDialogTitle" prop="attr_name">
                            <el-input v-model="editParamsForm.attr_name"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer">
                        <el-button @click="editParamsDialog = false">取 消</el-button>
                        <el-button type="primary" @click="editParams">确 定</el-button>
                    </div>
                </el-dialog>

            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            // 分类列表
            cateList:[],
            // 从级联选择框选中的分类
            selectedCate: [],
            // 级联选择框属性设置
            casProps:{ 
                expandTrigger: 'hover',
                // checkStrictly: true,
                label: 'cat_name',
                value: 'cat_id',
                children:'children'
            },
            // 标签页激活
            activeName: 'many',
            // 获取动态参数和静态属性的列表
            manyParams:[],
            onlyParams: [],
            // 控制添加属性参数对话框显示
            addParamsDialog: false,
            editParamsDialog: false,
            // 添加属性参数对话框的标题
            addParamsForm:{
                attr_name: '',
                attr_vals: ''
            },
            editParamsForm:{
                attr_name: '',
                attrId: 0
            },
            // 操作属性名
            optAction: '',
            // 添加表单校验规则
            addParamsFormRules:{
                attr_name:[{required: true, message:'请输入内容', trigger: 'blur'}]                
            },
            editParamsFormRules:{
                attr_name:[{required: true, message:'请输入内容', trigger: 'blur'}]                
            }
                

        }
    },
    created(){
        this.getCateList()
    },
    computed:{
        // 返回添加属性或参数的按钮激活状态
        btnStatus:function(){
            if(this.selectedCate.length ==3){
                return false
            }
            else{
                return true
            }
        },
        cateId(){
            if(this.selectedCate.length ===3){
                return this.selectedCate[2]
            } else{
                return null
            }            
        },
        addParamsDialogTitle(){
            if(this.activeName === 'many'){
                return '动态参数'
            }else if(this.activeName === 'only'){
                return '静态属性'
            } else{
                return null
            }
        }

    },
    methods:{
        // 获取分类列表
        async getCateList(){
            const {data: res} = await this.$http.get('categories')
            if(res.meta.status !== 200){
                return this.$message.error('获取父分类列表失败！')
            }
           this.cateList = res.data
        },

        // 级联选择框变化选择功能
        cateChange(){
            if(this.selectedCate.length !==3){
                this.selectedCate = []
                return this.$message('请选择第三级分类')
            }
            this.getParams()
        },
        // 控制tab切换事件
        handleTabClick(){
            // console.log(this.activeName)
            this.getParams()
            
        },
        // 获取参数列表
        async getParams(){
            const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params:{sel: this.activeName}})
            console.log(res)
            if(res.meta.status !==200){
                return this.$message.error('参数获取失败！')
            } else{
                this.$message.success('参数获取成功')
            }
            if(this.activeName == 'many'){
                this.manyParams = res.data
            }else if(this.activeName == 'only'){
                this.onlyParams = res.data
            }
        },
        // 打开添加属性对话框
        oepnAddParamsDialog(){
            this.addParamsDialog = true
        },
        oepnEditParamsDialog(params){
            this.editParamsForm.attr_name = params.attr_name
            this.editParamsForm.attrId = params.attr_id
            this.editParamsDialog = true
        },
        // 重置添加属性参数表单
        resetAddParamsForm(){
            this.$refs.addParamsFormRef.resetFields()
            this.addParamsForm.attr_name = ''
        },
        resetEditParamsForm(){
            this.$refs.editParamsFormRef.resetFields()
            this.editParamsForm.attr_name = ''
        },
        // 添加属性参数功能
        addParams(){
            this.$refs.addParamsFormRef.validate(async (valid) =>{
                if(!valid){
                    return this.$message.error('表单错误！')
                } else{
                    const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
                        attr_name: this.addParamsForm.attr_name,
                        attr_sel: this.activeName
                    })
                    if(res.meta.status !==201){
                        return this.$message.error('添加参数属性失败！')
                    } else{
                        this.$message.success('添加参数属性成功')
                        this.getParams()
                        this.addParamsDialog = false
                    }

                }
            })
        },
        // 编辑属性参数功能
        editParams(){
            this.$refs.editParamsFormRef.validate(async (valid) =>{
                if(!valid){
                    return this.$message.error('表单错误！')
                } else{
                    const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attrId}`,{
                        attr_name: this.editParamsForm.attr_name,
                        attr_sel: this.activeName
                    })
                    // console.log(res)
                    if(res.meta.status !==200){
                        return this.$message.error('修改参数属性失败！')
                    } else{
                        this.$message.success('修改参数属性成功')
                        this.getParams()
                        this.editParamsDialog = false
                    }

                }
            })
        },
        // 删除属性参数
        delParams(params){
            this.$confirm('确定要删除此参数吗，是否继续？', '删除用户', {
                confirmButtonText: '确定',
                concelButtonText: '取消',
                type: 'warning'
            }).then(async ()=>{
                const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${params.attr_id}`)
                if(res.meta.status !==200){
                     this.$message.error('删除参数失败！')
                }
                this.$message.success('删除成功')
                this.getParams()
            }).catch(()=>{
                this.$message.info('已取消删除')
            })
        }
    }
}
</script>

<style lang="less" scoped>
.row-gap{
    margin-top: 15px;
}

</style>