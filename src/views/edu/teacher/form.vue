<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" :min="1" :max="10" controls-position="right" />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <el-form-item label="讲师头像">

    <!-- 头衔缩略图 -->
    <pan-thumb :image="teacher.avatar"/>
    <!-- 文件上传按钮 -->
    <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
    </el-button>

    <!--
v-show：是否显示上传组件
:key：类似于id，如果一个页面多个图片上传控件，可以做区分
:url：后台上传的url地址
@close：关闭上传组件
@crop-upload-success：上传成功后的回调 -->
    <image-cropper
                   v-show="imagecropperShow" 
                   :width="300"
                   :height="300"
                   :key="imagecropperKey"
                   :url="BASE_API+'/edu/oss/upload'"
                   field="file"
                   @close="close"
                   @crop-upload-success="cropSuccess"/>

</el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherObj from '@/api/teacher'
import ImageCropper from '@/components/ImageCropper'//这是额外组件导入,需要在vue代码里面声明
import PanThumb from '@/components/PanThumb'
const defalutTeacher={
    name: '',
    
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        avatar: ''
}
export default {
  components:{ImageCropper,PanThumb},//声明使用的额外的组件
  data() {
    return {
      teacher: defalutTeacher,
      isSave:true,
      saveBtnDisabled: false ,// 保存按钮是否禁用,
      BASE_API: process.env.BASE_API, // 接口API地址
      imagecropperShow: false, // 是否显示上传组件
      imagecropperKey: 0 // 上传组件标记位,用来刷新
    }
  },
  watch: {
    $route(newRoute,old){
       this.init();
    }
  },
   created() {
      this.init();
   },

  methods: {

    // 上传成功后的回调函数
    cropSuccess(response) {
     this.imagecropperShow=false
     this.teacher.avatar=response.url
     this.imagecropperKey+=1
    },

    // 关闭上传组件
    close() {
      //点击×,将上传组件隐藏
    this.imagecropperShow=false
     this.imagecropperKey+=1
    },
     
    //初始化判断是保存还是修改
    init(){
      if(this.$route.query&&this.$route.query.id){
        //此时为修改操作,显示该教师信息
        this. getTeacher(this.$route.query.id)
      }else{
        //此时为保存操作,清空教师信息
        this.teacher={...defalutTeacher}
      }
    },

    saveOrUpdate() {
      if(!this.teacher.id){
      //保存方法
      this.saveBtnDisabled = true
      this.saveData()
      }else{
        //修改方法
         this.updateTeacher()
      }
        
      },
       // 保存
    saveData() {
    teacherObj.addTeacher(this.teacher)
    .then(()=>{
        this.suNotice('保存') //消息提示
        this.$router.push({path :'/teacherList'}) //跳转到列表页
    })
    .catch(
      ()=>{ 
        this.erNotice('保存') //消息提示
      }
    )


    },
    //通过id获取教师信息
    getTeacher(id){
      teacherObj.getTeacherById(id).then(
        response =>{
          this.teacher=response.data.teacher
        }
      ).catch(

      )
    },
    //更新教师
    updateTeacher(){
       teacherObj.updateTeacherById(this.teacher)
                 .then(() => {
                   this.suNotice('更新')
                   this.$router.push({path :'/teacherList'}) })
                 .catch(() => this.erNotice('更新'))
    },
    //成功提示
    suNotice(msg) {
        this.$message({
          message: '恭喜你,'+msg+'成功',
          type: 'success'
        
        });
      },
      erNotice(msg) {
        this.$message({
          message: '对不起,'+msg+'失败',
          type: 'error'
        });
      },
    
     
    }

   

  }

</script>