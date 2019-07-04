<template>
  <el-row>
<!--    <pagination v-show="total > -1" style="width: auto;" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" />-->
    <el-table
      @row-click="onExamClick"
      @mouseup.native.stop="()=>{}"
      class="disease-class"
      :height="`calc(100vh - 180px - ${templateHeight}em`"
      :data="allDrugs"
      :style="{maxHeight:`calc(100vh - 120px - ${templateHeight}em` }"
    >
      <el-table-column
        prop="name"
        align="center"
      >
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="query.name"
            @change="getList"
            size="mini"
            placeholder="药品查询"
            @focus="onFocus"
          ></el-input>
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="name"-->
<!--        align="center"-->
<!--      >-->
<!--        <template slot="header" slot-scope="scope">-->
<!--          <el-input-->
<!--            v-model="query.name"-->
<!--            size="mini"-->
<!--            placeholder="药品查询"-->
<!--            @focus="onFocus"-->
<!--          ></el-input>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
  </el-row>
</template>

<script>
  import {search as searchPres} from '@/api/drugs'
  import Pagination from "./page";

  export default {
    components: {Pagination},
    props:['templateHeight','type'],
    data(){
      return{
        total: 0,
        allDrugs:[],
        query:{
          name: '',
          page: 1,
          limit: 10,
          id: null,
          code:'',
          name:''
        }
      }
    },
    watch:{
      type(){
        this.getList()
      }
    },
    methods:{
      onExamClick(row){
        let data = {
          drug:row,
          id:'',
          note:'',
          usage:'',
          dosage:'',
          frequency:0,
          day_count:0,
          times: 0,
          amount: 1,
        }
        this.$emit('exam-click', data)
      },
      getList(){
        if(this.type == 0){
          this.query.type = '中成药'
          let tempTotal = 0
          this.allDrugs = []
          searchPres(this.query).then(res=>{
            res.data.list.forEach(e=>this.allDrugs.push(e))
            tempTotal += res.data.total
            this.query.type = '西药'
            searchPres(this.query).then(res=>{
              res.data.list.forEach(e=>this.allDrugs.push(e))
              tempTotal += res.data.total
              this.total = tempTotal
            })
          })
        }else{
          this.query.type = '中草药'
          this.allDrugs = []
          searchPres(this.query).then(res=>{
            res.data.list.forEach(e=>this.allDrugs.push(e))
            this.total = res.data.total
          })
        }
      },
      onFocus(){
        this.$emit('update:templateHeight', '5')
      }
    },
    mounted(){
      this.getList()
    }
  }
</script>
