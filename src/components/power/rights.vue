<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>            
            <!-- 表格区域 -->
            <el-table :data="rightList" style="width: 100%" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="authName" label="姓名"></el-table-column>
                <el-table-column prop="path" label="电话号码"></el-table-column>
                <el-table-column prop="level" label="状态">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.level == 0">一级</el-tag>
                        <el-tag type="primary" v-else-if="scope.row.level == 1">二级</el-tag>
                        <el-tag type="warning" v-else-if="scope.row.level == 2">三级</el-tag>
                        <el-tag v-else>/</el-tag>
                    </template>
                </el-table-column>
            </el-table>
          
        </el-card>
    </div>
</template>
<script>
export default{
    data(){
        return{
            rightList:[]
        }
    },
    created(){
        this.getRightList()
    },
    methods: {
        async getRightList(){
            const {data: res} = await this.$http.get('rights/list')
            console.log(res)
            if(res.meta.status !== 200){
                this.$message.error('权限列表获取失败！')
            }
            this.$message.success('权限列表获取成功')
            this.rightList = res.data
        }
    }
}
</script>
<style lang="less" scoped>

</style>
