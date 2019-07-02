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
          prop="user_id"
          label="医生ID">
        </el-table-column>
        <el-table-column
          prop="user_name"
          label="医生姓名">
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
  import {getClassification,getTotal} from '@/api/personal-statistics'
  import bus from '@/bus'
  export default {
    components: {ElContainer},
    data(){
      return {
        list: null,
        fullList: null,
        total: null,
        listLoading: true,
        tempUser: {
          id:10000,
          name:"HospitalAdmin"
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
        user_id:1
      }
    },
    methods:{
      handleCurrentChange(val){
        this.user_id = parseInt(val.user_id)
        this.initChart()
      },
      getList(){
        getTotal({start_time:this.collectDate[0],end_time:this.collectDate[1]}).then(response =>{
          let data = response.data
          this.list = []
          for(let i in data){
            let temp = {}
            console.log('000',this.users.find(o=>o.uid==parseInt(1)))
            temp.user_name = this.users.find(o=>o.uid==parseInt(i)).username
            temp.user_id = i
            temp.total = data[i].toFixed(2)
            this.list.push(temp)
          }
        })

      },
      initChart(){
        this.chart = echarts.init(this.$refs['charts1'])
        this.chart.setOption(this.option)
        getClassification({start_time:this.collectDate[0],end_time:this.collectDate[1],user_id:this.user_id}).then(response =>{
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
      bus.$on('getUsers',()=>this.getList())
      if(bus.users.length == 0){
        bus.getUsers()
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
      users(){
        return bus.users
      }
    }
  }
</script>

<style>
  .user-asider{
    background-color: white;
  }
</style>
