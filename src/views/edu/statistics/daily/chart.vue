<template>
  <div class="app-container">
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item>
        <el-select v-model="searchObj.type" clearable placeholder="请选择">
          <el-option label="学员登录数统计" value="loginNum"/>
          <el-option label="学员注册数统计" value="registerNum"/>
          <el-option label="课程播放数统计" value="videoViewNum"/>
          <el-option label="每日课程数统计" value="courseNum"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="searchObj.begin"
          type="date"
          placeholder="选择开始日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchObj.end"
          type="date"
          placeholder="选择截止日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-button
        :disabled="btnDisabled"
        type="primary"
        icon="el-icon-search"
        @click="showChart()">查询</el-button>
    </el-form>

    <div class="chart-container">
      <div id="chart" class="chart" style="height:500px;width:100%" />
    </div>
  </div>
</template>
<script>
import daily from '@/api/statistics/daily'
import echarts from 'echarts'

export default {
  data() {
    return {
      searchObj: {
        type: '',
        begin: '',
        end: ''
      },
      dailyList:[],
      btnDisabled: false,
      chart: null,
      title: '',
      xData: [],
      yData: []
    }
  },
  
  methods: {
    showChart() {
      
      this.initChartData()

      this.setChart()
    },

    // 准备图表数据
    initChartData() {
      
         this.dailyList=daily.showChart(this.searchObj.begin,this.searchObj.end).then(
           response=>{
             this.dailyList=response.data.daily
             
            this.editChart()
           
           }
           
         ).catch(response=>{
           this.$message({
          type: 'error',
          message: response.message
        })
         })
    },
    editChart(){
     
      let type=this.searchObj.type
      let dailyl=this.dailyList
      var Xcopy=[]
      var Ycopy=[]
     for (var i = 0; i < dailyl.length; i++) {
         Xcopy.push(dailyl[i].dateCalculated)
     
      switch(type) {
     case 'registerNum':
      Ycopy.push(dailyl[i].registerNum)
      break;
     case 'loginNum':
        Ycopy.push(dailyl[i].loginNum)
        break;
     
     case 'videoViewNum':
     Ycopy.push(dailyl[i].videoViewNum)
        break;
     case 'courseNum':
     Ycopy.push(dailyl[i].courseNum)
        break;
      } 
     this.xData=Xcopy
     this.yData=Ycopy
    }
     


    },

    // 设置图标参数
    setChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById('chart'))
  

      // 指定图表的配置项和数据
      var option = {
        // x轴是类目轴（离散数据）,必须通过data设置类目数据
       xAxis: {
    type: 'category',
    data: this.xData//-------绑定数据
},
// y轴是数据轴（连续数据）
yAxis: {
    type: 'value'
},
// 系列列表。每个系列通过 type 决定自己的图表类型
series: [{
    // 系列中的数据内容数组
    data: this.yData,//-------绑定数据
    // 折线图
    type: 'line'
}],
title: {
    text: this.title
},
tooltip: {
    trigger: 'axis'
},
dataZoom: [{
  show: true,
  height: 30,
  xAxisIndex: [
    0
  ],
  bottom: 30,
  start: 10,
  end: 80,
  handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
  handleSize: '110%',
  handleStyle: {
    color: '#d3dee5'

  },
  textStyle: {
    color: '#fff'
  },
  borderColor: '#90979c'
},
{
  type: 'inside',
  show: true,
  height: 15,
  start: 1,
  end: 35
}]
      }

      this.chart.setOption(option)
    }
  }
}
</script>