<template>
  <div class="app-container">
    <el-row class="title">
      执行科室工作量统计
    </el-row>
    <el-row class="demo-input-suffix" :offset="1">
      <el-col :span="3"  :offset="2">
        <el-select @change="handleFilter" v-model="tempDepartment.id" placeholder="请选择科室" class="filter-item" style="width: 10em">
          <el-option v-for="item,index in departments" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </el-col>
      <el-col :span="11" :offset="1">
        <el-date-picker
          v-model="collectDate"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-container>
      <div ref="charts1"  style="position:absolute; width: 100%; height: 400px;"/>
    </el-container>
  </div>
</template>
import echarts from 'echarts'

<script>
  import echarts from "echarts";
  import ElContainer from "../../../node_modules/element-ui/packages/container/src/main.vue";
  import {getClassification,getAll} from '@/api/department-statistics'

  export default {
    components: {ElContainer},
    data(){
      return {
        listLoading: true,
        tempDepartment: {
          id:1,
          name:"心血管内科"
        },
        departments: null,
         option:{
          xAxis: {
            data: ["中药费","西药费"],
            axisLabel:{rotate:-60}
         },
          yAxis: {
            type: 'value',
            data:[50,100,150]
          },
          series: [{
            data: [1,200,223],
            type: 'bar',
            barWidth: 15
          }]
        },
        chart:{},
        collectDate:[
          '2019-06-26 00:00:00',
          '2019-06-27 00:00:00'
        ],
        department_id:1
      }
    },
    methods:{
      handleFilter(){},
      getDepartments(){
        this.listLoading = true
        getAll().then(response => {
          const {data} = response
          const {department, department_classification} = data
          bus.departments = department
          this.list = department
          this.fullList = this.list
          this.total = department.length
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      initChart(){
        this.chart = echarts.init(this.$refs['charts1'])
        this.chart.setOption(this.option)
        getClassification({start_time:this.collectDate[0],end_time:this.collectDate[1],department_id:this.department_id}).then(response =>{
          const {data} = response
          const {xAxis,series} = data
          this.option.xAxis.data = []
          this.option.series[0].data = []
          console.log(series)
          for(let i=0; i<xAxis.length; i++){
            this.option.xAxis.data.push(xAxis[i])
            this.option.series[0].data.push(series[xAxis[i]] ? series[xAxis[i]] : 0 )
          }

          this.chart.setOption(this.option)
        })
      }
    },
    mounted(){
      this.initChart()
    },
    watch:{
      collectDate(val){
        console.log(val);
        this.initChart()
      }
    },
    computed:{
      departments(){
        return bus.departments
      }
    },
    created(){
      this.getDepartments()
    }
  }
</script>

<style>
  .app-container{
    margin-top: 5px;
  }
  .title{
    font-size: 20px;
    text-align: center;
    margin-bottom: 15px;
  }
</style>
