<template>
  <el-container class="user-container">
    <el-aside width="400px" class="user-asider">
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
          prop="medical_record_id"
          label="病历号">
        </el-table-column>
        <el-table-column
          prop="patient_name"
          label="患者姓名">
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
  import {getClassification,getTotal,getPatientName} from '@/api/tech-statistics'

  export default {
    components: {ElContainer},
    data(){
      return {
        list: null,
        fullList: null,
        total: null,
        listLoading: true,
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
        medical_record_id:20000017,
        doctor_id:10000
      }
    },
    methods:{
      handleCurrentChange(val){
        this.medical_record_id = parseInt(val.medical_record_id)
        this.initChart()
      },
      getList(){
        getTotal({start_time:this.collectDate[0],end_time:this.collectDate[1]}).then(response =>{
          let data = response.data
          this.list = []

          for(let i in data){
            getPatientName({medical_record_id:parseInt(i)}).then(res =>{
              let temp={}
              temp.medical_record_id = parseInt(i)
              temp.total = data[i].toFixed(2)
              temp.patient_name = res.data.patient_name
              this.list.push(temp)
            })
          }
        })

      },
      initChart(){
        this.chart = echarts.init(this.$refs['charts1'])
        this.chart.setOption(this.option)
        getClassification({start_time:this.collectDate[0],end_time:this.collectDate[1],medical_record_id:this.medical_record_id}).then(response =>{
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
      this.getList()
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

    },
    created(){

    }
  }
</script>

<style>
  .user-asider{
    background-color: white;
  }
</style>
