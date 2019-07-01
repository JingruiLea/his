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
            placeholder="药品查询"
            @focus="onFocus"
          ></el-input>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
</template>

<script>
  import {all} from '@/api/exam'

  export default {
    props:['templateHeight','type'],
    data(){
      return{
        allPres:[],
        examQuery:{
          name:''
        }
      }
    },
    watch:{
      type(){
        this.getList()
      }
    },
    computed:{
      exams(){
        let temp = this.allPres
        if(this.examQuery.name){
          temp = temp.filter(ele=>{return ele.name.includes(this.examQuery.name)})
        }
        return temp
      }
    },
    methods:{
      onExamClick(row){
        this.$emit('exam-click', row)
      },
      getList(){
        all({type:this.type}).then(res=>{
          this.allExams = res.data
        })
      },
      onFocus(){
        this.$emit('update:templateHeight', '5')
      }
    },
    created(){
      this.getList()
    }
  }
</script>
