<template>
 <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>
<el-button type="text" @click="addChapter()">添加章节</el-button>
<!-- 添加和修改章节表单 -->
<el-dialog :visible.sync="dialogChapterFormVisible" :title="addOrUpdateChapter">
    <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
            <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
            <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="clearChapter()">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate" :disabled="saveBtnDisabled" >确 定</el-button>
    </div>
</el-dialog>
<!-- 添加和修改课时表单 -->
<el-dialog :visible.sync="dialogVideoFormVisible" :title="addOrUpdateVideo">
    <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
            <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
            <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="上传视频">
    <el-upload
           :on-success="handleVodUploadSuccess"
           :on-remove="handleVodRemove"
           :before-remove="beforeVodRemove"
           :on-exceed="handleUploadExceed"
           :file-list="fileList"
           :action="BASE_API+'/vod/video/uploadVideo'"
           :limit="1"
           class="upload-demo">
    <el-button size="small" type="primary">上传视频</el-button>
    <el-tooltip placement="right-end">
        <div slot="content">最大支持1G，<br>
            支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
            GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
            MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
            SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
        <i class="el-icon-question"/>
    </el-tooltip>
    </el-upload>
</el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="clearVideo()">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo" :disabled="saveBtnDisabled" >确 定</el-button>
    </div>
</el-dialog>
<!-- 章节 -->
 <form >
    <el-li
        v-for="chapter in chapterNestedList"
        :key="chapter.id">
        <p>
            {{ chapter.title }}

            <span >
              
                <el-button size="small" type="text" @click="addVideo(chapter.id)"  plain>添加课时</el-button>
                <el-button size="small" type="text" @click="editChapter(chapter.id)" plain>编辑</el-button>
                <el-button size="small" type="text" @click="removeChapter(chapter.id)">删除</el-button>
            </span>
        </p>

        <!-- 视频 -->
        <form class="chanpterList videoList">
            <li
                v-for="video in chapter.children"
                :key="video.id">
                <p>{{ video.title }}
                    <span class="acts">
                       <el-button type="primary" size="small" @click="editVideo(video.id)" icon="el-icon-edit" circle></el-button>
                         <el-button type="danger" size="small" @click="removeVideo(video.id)" icon="el-icon-delete" circle></el-button>
                    </span>
                </p>
            </li>
        </form>
    </el-li>
</form> 
  
     
    <el-form label-width="120px">

      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
 import chapter from '@/api/chapter'
 import video from '@/api/video'
 import vod from '@/api/vod'
export default {
 
  data() {
    return {
      
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId: '', // 所属课程
      chapterNestedList: [], // 章节嵌套视频列表
      dialogChapterFormVisible: false, //是否显示章节表单
      dialogVideoFormVisible:false,
      addOrUpdateChapter:'添加章节',
      addOrUpdateVideo:'添加课时',
      fileList: [],//上传文件列表
      BASE_API: process.env.BASE_API, // 接口API地址
      chapter: {// 章节对象
           id:'', 
           courseId:'',
           title: '',
           sort: 0
               },
      video:{    //video对象
            id:'',
            courseId:'',
            chapterId:'',
            title:'',
            sort:0,
            videoSourceId:'',
           videoOriginalName: ''
            }         
    }

  },


  created() {
    this.init()
  },

  methods: {
    //删除阿里云视频之前弹窗
    beforeVodRemove(file, fileList) {
  return this.$confirm(`确定移除 ${file.name}？`)
},
//删除之后的处理
handleVodRemove(file, fileList) {

  vod.removeById(this.video.videoSourceId).then(response=>{
     this.video.videoSourceId = ''
        this.video.videoOriginalName = ''
        this.fileList = []
    this.$message({
      type: 'success',
      message: response.message
    })
  })
},
  //成功回调
handleVodUploadSuccess(response, file, fileList) {
 
  this.video.videoSourceId = response.data.videoId
   
  this.video.videoOriginalName = file.name;
},
//视图上传多于一个视频
handleUploadExceed(files, fileList) {
  this.$message.warning('想要重新上传视频，请先删除已上传的视频')
},

//保存或者修改课时,通过此时video是否有Id来判断
    saveOrUpdateVideo(){
if (!this.video.id) {
    this.saveVideoData()
  } else {
    this.addOrUpdateChapter='修改课时'
    this.updateVideoData()
  }
    },
    //保存或者修改,通过chapter是否有ID来判断
   saveOrUpdate() {
 
  if (!this.chapter.id) {
    this.saveData()
  } else {
    this.addOrUpdateChapter='修改章节'
    this.updateData()
  }
},
    //清空掉章节
    clearChapter(){
         this.dialogChapterFormVisible = false
         this.chapter={}
    },
     //清空掉课时
    clearVideo(){
         this.dialogVideoFormVisible = false
         this.video={}
    },
  //删除课时
  removeVideo(movieId){
  this.$confirm('此操作将永久删除该课时, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
  
    return video.deleteVideo(movieId)
  }).then(() => {
    this.init()// 刷新列表
    this.$message({
      type: 'success',
      message: '删除成功!'
    })
  }).catch((response) => { // 失败
    if (response === 'cancel') {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    }
  })
  },

    //删除章节
    removeChapter(chapterId) {
  this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
  
    return chapter.deleteChapter(chapterId)
  }).then(() => {
    this.init()// 刷新列表
    this.$message({
      type: 'success',
      message: '删除成功!'
    })
  }).catch((response) => { // 失败
    if (response === 'cancel') {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    }
  })
},
//添加课时按钮
addVideo(chapterId){
  this.saveBtnDisabled=false
   this.addOrUpdateVideo='添加课时'
  this.video.id='',
  this.video.title = ''// 重置章节标题
  this.video.sort = 0// 重置章节标题
  this.video.chapterId=chapterId
this.dialogVideoFormVisible = true
},
//添加章节按钮
addChapter(){
 this.saveBtnDisabled=false
   this.addOrUpdateChapter='添加章节'
  this.chapter.id='',
  this.chapter.title = ''// 重置章节标题
  this.chapter.sort = 0// 重置章节标题
this.dialogChapterFormVisible = true
},
//课时上的编辑按钮
editVideo(videoId){
this.saveBtnDisabled=false
     
    this.dialogVideoFormVisible = true
    video.getVideo(videoId).then(response=>{
      this.video=response.data.video
      this.fileList = [{'name': this.video.videoOriginalName}]
     
    }).catch(response =>{
       this.$message({
         type:'error',
         message:this.response.message
       })
    })
},
    //章节上的编辑按钮
   editChapter(chapterId) {
    this.saveBtnDisabled=false
     
    this.dialogChapterFormVisible = true
    
    chapter.getChapter(chapterId).then(response => {
       
        this.chapter = response.data.item
          this.addOrUpdateChapter='编辑章节'
    }
    )
    
},

//添加课时
saveVideoData(){
  this.saveBtnDisabled=true
this.video.courseId=this.courseId
video.addVideo(this.video).then(response =>{
this.$message({
  type:'success',
  message:'保存成功'
})
this.helpSaveVideo()
}).catch(response=>{
 this.$message({
     type:'error',
     message:response.message
   })
})
},
//添加章节
saveData() {
this.saveBtnDisabled=true
 this.chapter.courseId=this.courseId
 chapter.addChapter(this.chapter).then(response =>{
   
   this.$message({
     type:'success',
     message:'保存成功',
      
   })
 this.helpSave()
 }).catch(response=>{
   this.$message({
     type:'error',
     message:response.message
   })
 })
},
//更新课时方法
updateVideoData(){
this.saveBtnDisabled=true
video.updateVideo(this.video).then(response=>{
  this.$message({
    type:'success',
    message:'修改成功'
  })
   
    this.init()
    this.dialogVideoFormVisible = false// 如果保存成功则关闭对话框
}).catch(response=>{
 this.$message({
      type: 'error',
      message: response.message
    })
})

},
    //更新章节方法
updateData() {
  this.saveBtnDisabled=true
  chapter.updateChapter(this.chapter).then(response => {
    
    this.$message({
      type: 'success',
      message: '修改成功!'
    })
    
    this.init()
    this.dialogChapterFormVisible = false// 如果保存成功则关闭对话框
  }).catch((response) => {
    // console.log(response)
    this.$message({
      type: 'error',
      message: response.message
    })
  })
},

helpSaveVideo(){
this.dialogVideoFormVisible = false// 如果保存成功则关闭对话框
this.init()// 刷新列表
this.video.id='',
this.video.chapterId=''//重置课时章节
  this.video.title = ''// 重置课时标题
  this.video.sort = 0// 重置课时标题
  this.saveBtnDisabled = true
} ,   
helpSave(){
  this.dialogChapterFormVisible = false// 如果保存成功则关闭对话框
  
  this.init()// 刷新列表
  this.chapter.id='',
  this.chapter.title = ''// 重置章节标题
  this.chapter.sort = 0// 重置章节标题
  this.saveBtnDisabled = false
},

    //页面加载初始化
    init(){
      if(this.$route.params&&this.$route.params.id){
        this.courseId=this.$route.params.id 
      }
     chapter.getTree(this.courseId).then(request =>{
       this.chapterNestedList=request.data.tree
     }
     ).catch(response =>{
       this.$message({
         type:'error',
         message:'response.message'
       })
     }
     )
    },
    //上一步
    previous() {
      console.log(this.$route)
      this.$router.push({ path: '/edu/course/info/'+this.$route.params.id })
    },
   //下一步
    next() {
      
      this.$router.push({ path: '/edu/course/publish/'+this.$route.params.id })
    }
  }
}
</script>
<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.acts {
    float: right;
    font-size: 100%;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>