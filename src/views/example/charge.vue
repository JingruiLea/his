<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="medicalRecordId" placeholder="病历号" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
<!--      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
<!--      <el-select v-model="listQuery.importance" placeholder="请选择排班科室" clearable style="width: 90px" class="filter-item">-->
<!--        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />-->
<!--      </el-select>-->
<!--      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">-->
<!--        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />-->
<!--      </el-select>-->
<!--      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">-->
<!--        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />-->
<!--      </el-select>-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        搜索
      </el-button>
<!--      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">-->
<!--        新增-->
<!--      </el-button>-->
<!--      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
<!--        Export-->
<!--      </el-button>-->
<!--      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">-->
<!--        reviewer-->
<!--      </el-checkbox>-->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="编码" prop="id" sortable="custom" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="id" sortable="custom" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价" prop="id" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.fee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" prop="id"  align="center" >
        <template slot-scope="{row}">
          <span>{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" prop="id" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.fee * row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开立医生" prop="id" align="center" >
        <template slot-scope="{row}">
          <span>{{ users.find(i=>i.uid == row.create_user_id).real_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开立时间" prop="id" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.create_time}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="id" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.status}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.status=='未缴费'" type="primary" :disabled="row.status=='已退费'" size="mini" @click="handleUpdate(row)">
            缴费
          </el-button>
          <el-button v-else type="danger" :disabled="row.status=='已退费'" size="mini" @click="handleDelete(row)">
            退费
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="实付" type="number">
          <el-input @keyup.enter.native="dialogStatus==='create'?createData():updateData()" v-model="truely_pay" />
        </el-form-item>
        <el-form-item label="应付" prop="username">
          <span>{{should_pay}}</span>
        </el-form-item>
        <el-form-item label="找零" prop="username">
          <span>{{retail_fee}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" :disabled="retail_fee=='无效金额'"  @click="dialogStatus==='create'?createData():updateData()">
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
  import {withdraw, charge, getChargeItems, getHistoryChargeItems } from '@/api/outpationCharge'
  import {getAll, add, _delete} from '@/api/departments'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import bus from '@/bus.js'
  import fuzzyQuery from '@/utils/utils'

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
    components: { Pagination },
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
      users(){
        return bus.users
      },
      classes(){
        return ["临床科室", "医技科室", "财务科室", "行政科室"]
      },
      retail_fee(){
        let temp = new Number(this.truely_pay - this.should_pay).toFixed(2)
        return temp < 0 ? '无效金额' : temp
      }
    },
    data() {
      return {
        tableKey: 0,
        medicalRecordId: 20000017,
        list: null,
        fullList : null,
        total: 0,
        listLoading: false,
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
          classification_id: 12,
          id: 4,
          name: "测试科室",
          pinyin: "123",
          type: "财务科室"
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '缴费',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          // type: [{ required: true, message: 'type is required', trigger: 'change' }],
          // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        downloadLoading: false,
        truely_pay:0,
        should_pay:0,
      }
    },
    created() {
      if(bus.users.length==0){
        bus.getUsers()
      }
      this.getList()
    },
    methods: {
      getList() {
        let medical_record_id = parseInt(this.medicalRecordId)
        getHistoryChargeItems({medical_record_id}).then(response => {
          const {data} = response
          this.list = data.filter(ele=>{
            return ele.item_status != '已完成' && ele.item_status != '已取药'
          })
          this.fullList = this.list
          this.total = this.list.length
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        let name = this.listQuery.name

        this.listLoading = true
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
        console.log(name)
        if(name){
          this.list = this.fullList.filter(item=>{
            return item.username.includes(name)
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
          classification_id: 12,
          id: 4,
          name: "测试科室",
          pinyin: "123",
          type: "财务科室"
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
        this.should_pay = row.fee * row.quantity
        this.truely_pay = 0
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        charge(
          {
            medical_record_id: this.temp.medical_record_id,
            charges_id_list: [this.temp.charge_id],
            should_pay: parseFloat(this.should_pay),
            truely_pay: parseFloat(this.truely_pay),
            retail_fee: parseFloat(this.retail_fee)
          }
        ).then(() => {
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
            message: '缴费成功!',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      },
      handleDelete(row) {
        console.log(`line 354: delete ${row}`)
        withdraw({
          medical_record_id:row.medical_record_id,
          charges_id_list:[row.charge_id]
        }).then(res =>{
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          row.status = '已退费'
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
