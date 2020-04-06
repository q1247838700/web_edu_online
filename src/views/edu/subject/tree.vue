<template>
<div class="app-container">

    <el-input v-model="filterText" placeholder="请输入要查找的功课" style="margin-bottom:30px;" />
    <el-button type="text" @click="append()">添加一级分类</el-button>
    
     <el-tree
     
      ref="subjectTree"
      :data="subjects"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      class="filter-tree"
      default-expand-all
      node-key="id">
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <!-- 使用Chrome的Vue插件调试 -->
          <el-button
            v-if="node.level == 1 " 
            type="text"
            size="mini"
            @click="() => append(data)">添加</el-button>
          <el-button
            v-if="node.level == 2||data.children.length==0"
            type="text"
            size="mini"
            
            @click="() => remove(node, data)">删除</el-button>
            
        </span>
      </span>
    </el-tree>

    <!-- Form -->

 

  </div>
</template>
<script>
import subjectApi from '@/api/subject'
export default {
    data(){
        return{
            filterText: '',
            subjects :[],
            defaultProps: {
        children: 'children',
        label: 'title',
        dialogFormVisible: false,
        
      }
        }
    },
     watch: {
      filterText(val) {
      this.$refs.subjectTree.filter(val)
    }
    },
    created(){
        this.getSubjects()
    },
    methods: {

        filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
     append(data=1) {
       
var str='请输入二级功课名称'
      if(data==1){
        data={
         id:null
        }
      str='请输入一级功课名称'
      }
       
       
      this.$prompt(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
         
        }).then(({ value }) => {
         
          const subject={
            parentId:data.id,
            title:value
          }
        
          return subjectApi.addSubject(subject)//继续向下操作
       
        }).then(response=>{
          this.$message({
            type: 'success',
            message: '添加成功'
          }); 
          //刷新该树
          this.getSubjects()
          
        }).catch(response => {
           if(response=='error'){
         this.$message({
            type: 'error',
            message: '发生错误啦'
          })
      }else{
        this.$message({
            type: 'info',
            message: '已取消'
          })
      }        
        });
      },
    
    //获取所有功课
        getSubjects(){
       subjectApi.subjects().then(response =>{
           this.subjects=response.data.subjects;
           console.log(this.subjects)
       }).catch()
        },
      
    

      remove(node, data) {
        console.log(node)
        this.$confirm('永久删除['+data.title+']这门功课, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          return subjectApi.deleteSubject(data.id)//这样做可以继续向下执行
        }).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
             
          });
               // this.fetchNodeList()// 刷新列表
        this.$refs.subjectTree.remove(node) //在树中删除该节点（效率高）
        }).catch(response => {
      if(response=='error'){
         this.$message({
            type: 'error',
            message: '发生错误啦'
          })
      }else{
        this.$message({
            type: 'info',
            message: '已取消删除'
          })
      }           
        });
      },
          
    },
    
}
</script>