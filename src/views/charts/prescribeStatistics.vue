<template>
  <el-container class="department-container">
    <el-aside width="400px" class="department-asider">
      <el-date-picker
        v-model="collectDate"
        type="daterange"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-table
        ref="singleTable"
        highlight-current-row
        @row-click="handleCurrentChange"
        :data="list"
        style="width: 100%">
        <el-table-column
          prop="department_id"
          label="科室ID">
        </el-table-column>
        <el-table-column
          prop="department_name"
          label="科室名称">
        </el-table-column>
        <el-table-column
          prop="total"
          label="总费用">
        </el-table-column>
      </el-table>
    </el-aside>
    <el-main>
      <el-container>
        <div ref="charts1" style="position:absolute; width: 900px; height: 600px;"/>
      </el-container>
    </el-main>
  </el-container>
</template>
import echarts from 'echarts'

<script>
  import echarts from "echarts";
  import ElContainer from "../../../node_modules/element-ui/packages/container/src/main.vue";
  import {getClassification,getTotal} from '@/api/prescribe-statistics'
  import bus from '@/bus'
  export default {
    components: {ElContainer},
    data(){
      return {
        list: null,
        fullList: null,
        total: null,
        listLoading: true,
        tempDepartment: {
          id:1,
          name:"心血管内科"
        },
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
            barWidth: 25,
            label: {
              normal: {
                show: true,
                position: 'inside'
              }
            }
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
      handleCurrentChange(val){
        this.department_id = parseInt(val.department_id)
        console.log(this.department_id)
        this.initChart()
      },
      getList(){
        getTotal({start_time:this.collectDate[0],end_time:this.collectDate[1]}).then(response =>{
          let data = response.data
          this.list = []
          for(let i in data){
            let temp = {}
            console.log('000',this.departments.find(o=>o.id==parseInt(1)))
            temp.department_name = this.departments.find(o=>o.id==parseInt(i)).name
            temp.department_id = i
            temp.total = data[i].toFixed(2)
            this.list.push(temp)
          }
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
            this.option.series[0].data.push(series[xAxis[i]] ? series[xAxis[i]].toFixed(2) : 0 )
          }

          this.chart.setOption(this.option)
        })
      }
    },
    mounted(){
      bus.$on('getDepartments',()=>this.getList())
      if(bus.departments.length == 0){
        bus.getDepartments()
      }else {
        this.getList()
      }
      this.initChart()
    },
    watch:{
      collectDate(val){
        console.log(val);
        this.initChart()
        this.getList()
      }
    },
    computed:{
      departments(){
        return bus.departments
      }
    }
  }
</script>

<style>
  .department-asider{
    background-color: white;
  }
</style>
