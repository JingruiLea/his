<template>
  <el-row>
    <el-table
      @row-click="onExamClick"
      @mouseup.native.stop="()=>{}"
      class="disease-class"
      :height="`calc(100vh - 180px - ${templateHeight}em`"
      :data="exams"
      :style="{maxHeight:`calc(100vh - 120px - ${templateHeight}em` }"
    >
      <el-table-column
        prop="name"
        align="center"
      >
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="examQuery.name"
            size="mini"
            placeholder="查询检查"
          ></el-input>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
</template>

<script>
  import {all} from '@/api/exam'

  export default {
    props:{
      templateHeight: String,
    },
    data(){
      return{
        exams:[],
        examQuery:{
          name:''
        }
      }
    },
    methods:{
      onExamClick(){},
      getList(){
        all({type:0}).then(res=>{
          this.exams = res.data
        })
      }
    },
    created(){
      this.getList()
    }
  }
</script>
