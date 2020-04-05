<template>
   <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="'https://edu-lyg.oss-cn-hangzhou.aliyuncs.com/subject.xlsx'">点击查看模版</a>
        </el-tag>

      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API+'/edu/subject/import'"
          name="file"
          accept="application/vnd.ms-excel">
          <el-button slot="trigger" size="small" type="primary" >选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">{{ fileUploadBtnText }}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
 
</template>


<script>
export default {

  data() {
    return {
      BASE_API: process.env.BASE_API, // 接口API地址
     // OSS_PATH: process.env.OSS_PATH, // 阿里云OSS地址
      fileUploadBtnText: '上传到服务器', // 按钮文字
      importBtnDisabled: false, // 按钮是否禁用,
      loading: false
    }
  },
  created() {
      
  },
  methods: {
      submitUpload(){
          // 将上传按钮置为灰色
          this.importBtnDisabled=true;
           //将上传到服务器文字修改成正在上传
           this.fileUploadBtnText='正在上传'
           this.loading=true
           this.$refs.upload.submit()
           
      },
      fileUploadSuccess(response){
        if(response.code===20000){
            //导入成功
            this.fileUploadBtnText='导入成功'
            this.loading=false
            this.$message({
                type:'success',
                message:'导入成功'
            })
            this.importBtnDisabled=true;
            this.fileUploadBtnText='上传成功'
        }else{
            this.fileUploadBtnText='导入成功'
             this.loading=false
            this.$message({
                type:'message',
                message:response.data.emptyMessage
            })
            this.importBtnDisabled=true;
        }
      },
      fileUploadError(response){
          //导入失败
          this.fileUploadBtnText='导入失败'
          this.loading=false
          this.message({
              type:'error',
              message:response.message
          })
      }

  },
     
}
</script>