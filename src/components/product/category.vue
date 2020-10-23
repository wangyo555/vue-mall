<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <div slot="header">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-button icon="el-icon-plus" type="primary"  @click="showAddCateDialog">添加分类</el-button>
                    </el-col>
                </el-row>
            </div>
            
            <!-- 表格区域 -->
            <tree-table :data="cateList" :columns="columns" :show-index="true" :selection-type="false" 
            :expand-type="false" index-text="#" border>
                <!-- 检查是否有效的模板 -->
                <template slot="valid" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted == false"></i>
                    <i class="el-icon-error" v-else></i>
                </template>

                <!-- 排序模板 -->
                <template slot="level" slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.cat_level == 0">一级</el-tag>
                    <el-tag type="primary" v-else-if="scope.row.cat_level == 1">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>

                <!-- 操作列表模板 -->
                <template slot="option" slot-scope="scope">
                    <!-- 编辑 -->
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="showModifyCate(scope.row)">编辑</el-button>
                    <!-- 删除 -->
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="openCateDelConfirm(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页组件 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[10, 20, 50]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>

            <!-- 添加分类对话框 -->
            <el-dialog
                title="添加分类"
                :visible.sync="addCateDialogVisible"
                width="50%" :close-on-click-modal="false" @close="resetAddCateForm">
                <!-- 内容主体区域 -->
                <el-form ref="addCateFormRef" :rules="addCateFormRules" :model="addCateForm" label-width="80px">
                    <el-form-item label="分类名称" prop="cat_name">
                        <el-input v-model="addCateForm.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类" >
                        <el-cascader
                        :options="parentCateList"
                        :props="casProps"
                        v-model="selectedCate"
                        clearable
                        @change="parentCateChange"></el-cascader>
                    </el-form-item>
                    
                </el-form>
                <!-- 底部区域 -->
                <div slot="footer">
                    <el-button @click="addCateDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addCate">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 修改分类对话框 -->
            <el-dialog
                title="添加分类"
                :visible.sync="modifyCateDialogVisible"
                width="50%" :close-on-click-modal="false" @close="resetModifyCateForm">
                <!-- 内容主体区域 -->
                <el-form ref="modifyCateFormRef" :rules="modifyCateFormRules" :model="modifyCateForm" label-width="80px">
                    <el-form-item label="分类名称" prop="cat_name">
                        <el-input v-model="modifyCateForm.cat_name"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <div slot="footer">
                    <el-button @click="modifyCateDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="modifyCate">确 定</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            // 添加分类对话框控制
            addCateDialogVisible: false,
            // 修改分类对话框控制
            modifyCateDialogVisible:false,
            // 添加分类表单
            addCateForm: {
                // 分类父id
                cat_pid: 0,
                // 分类名称
                cat_name: '',
                // 分类层级
                cat_level: 0
            },
            modifyCateForm: {
                // 分类父id
                cat_id: 0,
                // 分类名称
                cat_name: '',
                // 分类层级
            },
            // 商品分类列表
            cateList:[],
            // 父分类列表
            parentCateList:[],
            casProps:{ 
                expandTrigger: 'hover',
                checkStrictly: true,
                label: 'cat_name',
                value: 'cat_id',
                children:'children'
            },
            // 选中的分类
            selectedCate:[],
            // 查询参数
            queryInfo:{
                type:3,
                pagenum: 1,
                pagesize: 5
            },
            total: 0,
            // 表格配置
            columns:[
                {label: '分类名称', prop: 'cat_name'},
                {label: '是否有效', prop: 'cat_deleted',type: 'template', template: 'valid'},
                {label: '排序', prop: 'cat_level',type: 'template', template: 'level'},
                {label: '操作', type: 'template', template: 'option'}
            ],
            // 添加分类校验规则
            addCateFormRules:{
                cat_name:[
                    {required: true, message:'请输入分类名称', trigger: 'blur'}
                ]
            },
            // 修改分类校验规则
            modifyCateFormRules:{
                cat_name:[
                    {required: true, message:'请输入分类名称', trigger: 'blur'}
                ]
            }
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        // 打开添加分类对话框
        showAddCateDialog(){
            this.getParentCate()
            this.addCateDialogVisible = true
        },
        showModifyCate(cate){
            this.modifyCateForm.cat_id = cate.cat_id
            this.modifyCateForm.cat_name = cate.cat_name
            this.modifyCateDialogVisible = true
        },
        // 重置添加分类对话框
        resetAddCateForm(){
            this.$refs.addCateFormRef.resetFields()
            this.selectedCate = []
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0

        },
        // 重置修改分类对话框
        resetModifyCateForm(){
            this.$refs.modifyCateFormRef.resetFields()
            this.modifyCateForm.cat_id = 0

        },
        // 添加分类
        async addCate(){
            this.$refs.addCateFormRef.validate((valid) => {
                if (!valid) {
                    return this.$message.error('表单验证失败！')
                }
                const {data: res} = await this.$http.post('categories',this.addCateForm)
                if(res.meta.status !== 201){
                    return this.$message.error('添加分类失败！')
                }
                this.$message.success('添加分类成功！')
                this.getCateList()
                this.addCateDialogVisible = false
            })
        },
        async modifyCate(){
            this.$refs.modifyCateFormRef.validate((valid) =>{
                if (!valid) {
                    return this.$message.error('表单验证失败！')
                }
                const {data: res} = await this.$http.put('categories/'+this.modifyCateForm.cat_id,{
                    cat_name: this.modifyCateForm.cat_name
                })
                if(res.meta.status !== 200){
                    return this.$message.error('更新分类失败！')
                }
                this.$message.success('更新分类成功！')
                this.getCateList()
                this.modifyCateDialogVisible = false
            })
        },
        // 获取父分类
        async getParentCate(){
            const {data: res} = await this.$http.get('categories',{params:{type:2}})
            if(res.meta.status !== 200){
                return this.$message.error('获取父分类列表失败！')
            }
            this.parentCateList = res.data
        },
        // 父分类动态改变获取值
        parentCateChange(){
            // console.log(this.selectedCate)
            const parentCateLength = this.selectedCate.length
            this.addCateForm.cat_level = parentCateLength
            if(parentCateLength !== 0){
                this.addCateForm.cat_pid = this.selectedCate[parentCateLength-1]
                // this.addCateForm.cat_pid = this.selectedCate.pop()
            } else{
                this.addCateForm.cat_level = 0
                this.addCateForm.cat_pid = 0

            }
        },
        // 获取分类
        async getCateList(){
            const {data: res} = await this.$http.get('categories',{params: this.queryInfo})
            if(res.meta.status !== 200){
                return this.$message.error('获取商品分类列表失败！')
            }
            this.cateList = res.data.result
            this.total = res.data.total
        },

        // 分页方法
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        // 删除分类确认对话框
        openCateDelConfirm(id){
            this.$confirm('此操作将删除该分类，是否继续', '删除分类',{
                confirmButtonText: '确定',
                concelButtonText: '取消',
                type: 'warning'
            }).then(async ()=>{
                const {data: res} = await this.$http.delete('categories/'+id)
                if(res.meta.status !==200){
                     this.$message.error('删除分类失败！')
                }
                this.$message.success('删除分类成功')
                this.getCateList()
            }).catch(()=>{
                this.$message.info('已取消删除')
            })
        }
    }
}
</script>

<style lang="less" scoped>

</style>