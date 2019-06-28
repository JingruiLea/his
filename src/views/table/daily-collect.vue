<template>
  <div class="app-container">
    <el-row>
      <el-col :offset="1">
        <el-date-picker
          v-model="collectDate"
          type="daterange"
          unlink-panels
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="7" :offset="1">
        <el-table
          :data="historyList"
          header-row-class-name="daily-detail-header"
          style="width: 100%">
          <el-table-column
            prop="start_time"
            label="开始日期"
            :formatter="formatter">
          </el-table-column>
          <el-table-column
            prop="end_time"
            label="结束日期"
            :formatter="formatter">
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="14" :offset="1">
        <el-table
          :data="detailsList"
          style="width: 100%"
          :default-sort = "{prop: 'id', order: 'descending'}"
          header-row-class-name="daily-detail-header"
        >
          <el-table-column
            prop="id"
            label="收费编号"
            sortable
            width="150">
          </el-table-column>
          <el-table-column
            prop="type"
            label="类型"
            :formatter="formatter">
          </el-table-column>
          <el-table-column
            prop="medical_record_id"
            label="病历号"
            :formatter="formatter">
          </el-table-column>
          <el-table-column
            prop="quantity"
            label="数量"
            :formatter="formatter">
          </el-table-column>
          <el-table-column
            prop="should_pay"
            label="应收"
            :formatter="formatter">
          </el-table-column>
          <el-table-column
            prop="truely_pay"
            label="实收"
            :formatter="formatter">
          </el-table-column>
          <el-table-column
            prop="retail_fee"
            label="找零"
            :formatter="formatter">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="创建日期"
            :formatter="formatter">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="ID" type="number">
          <el-input-number v-model="temp.id" />
        </el-form-item>
        <el-form-item label="编码" type="number">
          <el-input-number v-model="temp.code" />
        </el-form-item>
        <el-form-item label="名称" >
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="拼音" >
          <el-input v-model="temp.pinyin" />
        </el-form-item>
        <el-form-item label="规格" >
          <el-input v-model="temp.format" />
        </el-form-item>
        <el-form-item label="费用" >
          <el-input v-model="temp.fee" />
        </el-form-item>
        <el-form-item label="收费类别" >
          <el-select v-model="temp.expense_classification_id" class="filter-item" placeholder="Please select">
            <el-option v-for="item,index in expenseClassifications" :key="index" :label="item.fee_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="科室" >
          <el-select v-model="temp.department_name" class="filter-item" placeholder="Please select">
            <el-option v-for="item,index in departments" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
  import {getAll, add, _delete,_import,update} from '@/api/nondrugs'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import bus from '@/bus.js'
  import fuzzyQuery from '@/utils/utils'
  import ElInput from "../../../node_modules/element-ui/packages/input/src/input.vue";
  import ElInputNumber from "../../../node_modules/element-ui/packages/input-number/src/input-number.vue";

  const calendarTypeOptions = [
    { key: 'CN', display_name: 'China' },
    { key: 'US', display_name: 'USA' },
    { key: 'JP', display_name: 'Japan' },
    { key: 'EU', display_name: 'Eurozone' }
  ]

  // arr to obj, such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'CopyComplexTable',
    components: {
      ElInputNumber,
      ElInput,
      Pagination },
    directives: { waves },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    computed:{
      departments(){
        return bus.departments
      },
      expenseClassifications(){
        return bus.expenseClassifications
      }
    },
    data() {
      return {
        pickerOptions:{},
        collectDate:"",
        tableKey: 0,
        list: null,
        fullList : null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          name: undefined,
          sort: '+id'
        },
        importanceOptions: [1, 2, 3],
        calendarTypeOptions,
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          id: 1,
          code: "120200001",
          pinyin: "DQJ",
          format: "次",
          name: "大抢救",
          fee: 100,
          expense_classification_id: 20,
          department_id: 1,
          expense_classification_name: "门诊手术费",
          department_name: "神经科"
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          // type: [{ required: true, message: 'type is required', trigger: 'change' }],
          // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        downloadLoading: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      formatter(row, column) {
        return row.address;
      },
      getList() {
        this.listLoading = true
        getAll().then(response => {
          const {data} = response
          const {expense_classification,department,non_drug_charge} = data
          bus.nondrugs = non_drug_charge
          bus.departments = department
          bus.expenseClassifications = expense_classification
          this.list = non_drug_charge
          this.fullList = this.list
          this.total = non_drug_charge.length

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        let name = this.listQuery.name
        console.log(name)
        if(name){
          this.list = this.fullList.filter(item=>{
            return item.name.includes(name)
          })
        }
        console.log(this.list)
      },
      searchByName(){
        let name = this.listQuery.name
        this.list.filter(item=>{
          return item.name.includes(name)
        })
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作Success',
          type: 'success'
        })
        row.status = status
      },
      sortChange(data) {
        const { prop, order } = data
        if (prop === 'id') {
          this.sortByID(order)
        }
      },
      sortByID(order) {
        if (order === 'ascending') {
          this.listQuery.sort = '+id'
        } else {
          this.listQuery.sort = '-id'
        }
        this.handleFilter()
      },
      resetTemp() {
        this.temp = {
          id: 1,
          code: "120200001",
          pinyin: "DQJ",
          format: "次",
          name: "大抢救",
          fee: 100,
          expense_classification_id: 20,
          department_id: 1,
          expense_classification_name: "门诊手术费",
          department_name: "神经科"
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        //this.$refs['dataForm'].validate((valid) => {
        // if (valid) {
        //   this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
        //   this.temp.author = 'vue-element-admin'
        //   createArticle(this.temp).then(() => {

        //   })
        // }
        //console.log(`post data${JSON.stringify(this.temp)}`)
        this.temp.id = parseInt(this.temp.id)
        add(this.temp).then(res=>{
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: 'Created Successfully',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
        //})

      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            update(tempData).then(() => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        //this.$refs['dataForm'].validate((valid) => {
        // if (valid) {
        //   this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
        //   this.temp.author = 'vue-element-admin'
        //   createArticle(this.temp).then(() => {

        //   })
        // }
        //console.log(`post data${JSON.stringify(this.temp)}`)
        add(this.temp).then(res=>{
          this.list.unshift(this.temp)
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: 'Created Successfully',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
        //})

      },
      handleDelete(row) {
        console.log(`line 354: delete ${row}`)
        _delete({data:[row.id]}).then(res =>{
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      },
      handleFetchPv(pv) {
        fetchPv(pv).then(response => {
          this.pvData = response.data.pvData
          this.dialogPvVisible = true
        })
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>

<style>
  .daily-detail-header .caret-wrapper{
    height:22px !important;
  }
  .daily-detail-header .ascending{
    top:0 !important;
  }
  .daily-detail-header .descending{
    bottom:0 !important;
  }
  .daily-detail-header .cell{
    text-align: center;
  }
</style>
