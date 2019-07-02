<template>
    <el-row>
      <el-col :span="10">
        <el-table
          :data="list"
          height="calc(100vh - 70px)"
          @row-click="detailPres"
        >
          <el-table-column
            label="病历号"
            prop="name"
            align="center"
          >
            <template slot-scope="{row}">
              {{row.registration.medical_record_id}}
            </template>
          </el-table-column>
          <el-table-column
            label="患者姓名"
            prop="name"
            align="center"
          >
            <template slot-scope="{row}">
              {{row.registration.patient_name}}
            </template>
          </el-table-column>
          <el-table-column
            label="开药时间"
            prop="create_time"
            align="center"
          >
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="14">
        <el-table
          :data="presList"
          height="calc(100vh - 70px)"

        >
          <el-table-column
            label="药品名称"
            prop="name"
            align="center"
          >
            <template slot-scope="{row}">
              {{row.drug.name}}
            </template>
          </el-table-column>
          <el-table-column
            label="数量"
            prop="amount"
            align="center"
          >
            <template slot-scope="{row}">
              {{row.amount}}
            </template>
          </el-table-column>
          <el-table-column
            label="药品单价"
            prop="name"
            align="center"
          >
            <template slot-scope="{row}">
              {{row.drug.price}}
            </template>
          </el-table-column>
          <el-table-column
            label="总价"
            prop="create_time"
            align="center"
          >
            <template slot-scope="{row}">
              {{row.drug.price * row.amount}}
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            prop="create_time"
            align="center"
          >
            <template slot-scope="{row}">
              {{row.status}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            prop="create_time"
            align="center"
          >
            <template slot-scope="{row}">
              <el-button
                size="mini"
                :disabled="row.status == '已退药'"
                :type="row.status == '已取药' ? `danger` : `primary`"
                @click="row.status == '已取药'? withdraw(row): dispense(row)"
              >{{row.status == '已取药' ? `退药` : `发药`}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
</template>
<script>
  import {list, all} from '@/api/drugSend'
  import {selectById} from '@/api/outpatientRegistration'
  import {withdraw, submit} from '@/api/drugs'
  export default {
    name:'SendDrug',
    data(){
      return{
        list:[],
        presList:[]
      }
    },
    methods:{
      withdraw(row){
        let temp = JSON.parse(JSON.stringify(row))
        temp.drug = undefined
        withdraw({prescription_items:[row]}).then(res=>{
          this.$notify({
            title: 'Success',
            message: '退药成功!',
            type: 'success',
            duration: 2000
          })
          row.status = '已退药'
        })
      },
      dispense(row){
        submit({prescription_item_id:[row.id]}).then(res=>{
          this.$notify({
            title: 'Success',
            message: '可发药!',
            type: 'success',
            duration: 2000
          })
          row.status = '已取药'
        })
      },
      getList(){
        this.list = []
        all().then(res=>{
          res.data.forEach(pres=>{
            selectById({id:pres.medical_record_id}).then(res=>{
                pres.registration = res.data
                if(res.data == null) return
                if(!this.list.find(o => o.medical_record_id == pres.medical_record_id)){
                  this.list.push(pres)
                }
              })
          })
        })
      },
      detailPres(row){
        this.presList = []
        list({medical_record_id:row.medical_record_id}).then(res=>{
          res.data.forEach(ele=>{
            ele.items.forEach(pres_item=>{
              this.presList.push(pres_item)
            })
          })
        })
      }
    },
    created() {
      this.getList()
    }
  }
</script>
