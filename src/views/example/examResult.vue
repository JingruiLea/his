<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="medicalRecordId" placeholder="病历号" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="type" placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item,index in [[`检查`,0],[`检验`,1],[`处置`,2]]" :key="index" :label="item[0]" :value="item[1]" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        Search
      </el-button>
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
          <span>{{ row.non_drug_item.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="id" sortable="custom" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.non_drug_item.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价" prop="id" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.non_drug_item.fee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" prop="id"  align="center" >
        <template slot-scope="{row}">
          <span>{{ 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" prop="id" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.non_drug_item.fee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="id" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.status}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.status=='已完成'" type="primary" :disabled="row.status=='已取消'" size="mini" @click="handleCreate(row)">
            查看结果
          </el-button>
          <el-button v-else type="danger" size="mini" :disabled="row.status == '已完成'" @click="handleUpdate(row)">
            录入结果
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="结果所见" type="number">
          <el-input :readonly="dialogStatus =='create'" @keyup.enter.native="dialogStatus==='create'?createData():updateData()" v-model="someInfo.result" />
        </el-form-item>
        <el-form-item label="处理意见" type="number">
          <el-input :readonly="dialogStatus =='create'" @keyup.enter.native="dialogStatus==='create'?createData():updateData()" v-model="someInfo.advice" />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'">
          <span>结果图</span>
          <a target="_blank" v-for="item,index in picLink" :href="item"><img :src="item" width="50px" height="50px" /></a>
        </el-form-item>
        <el-form-item v-if="dialogStatus !='create'" label="上传文件" prop="username">
          <el-upload
            :limit="1"
            :data="someInfo"
            class="upload-demo"
            ref="upload"
            :on-success="onSuccess"
            :action="`http://${location}:8080/exam/submitResult`"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          返回
        </el-button>
        <el-button type="primary" v-if="dialogStatus==='update'" @click="dialogStatus==='create'?createData():updateData()">
          提交
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
  import {listPaid as listByType, getResult} from '@/api/exam'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import bus from '@/bus.js'
  import fuzzyQuery from '@/utils/utils'
  import { getToken } from '@/utils/auth'

  const calendarTypeOptions = [
    { key: 'CN', display_name: 'China' },
    { key: 'US', display_name: 'USA' },
    { key: 'JP', display_name: 'Japan' },
    { key: 'EU', display_name: 'Eurozone' }
  ]

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
      location(){
        return window.location.hostname
      },
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
        let temp = this.truely_pay - this.should_pay
        return temp < 0 ? '无效金额' : temp
      }
    },
    data() {
      return {
        picLink:[],
        someInfo:{
          exam_item_id:0,
          result:'',
          advice:''
        },
        type:0,
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
          update: '检查结果录入',
          create: '检查检验结果查看'
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
        fileList:[]
      }
    },
    created() {
      if(bus.users.length==0){
        bus.getUsers()
      }
      this.getList()
    },
    methods: {
      onSuccess(){
        this.getList()
        this.$message({
          message: '提交成功！',
          type: 'success'
        })
      },
      submitUpload() {
        this.$refs.upload.submit();
        this.dialogFormVisible = false
      },
      handlePreview(){},
      handleRemove(){},
      getList() {
        this.list = []
        this.fullList = []
        this.total = 0
        let medical_record_id = parseInt(this.medicalRecordId)
        listByType({medical_record_id,type:this.type}).then(res=>{
          this.list = res.data[0].exam_item.filter(ele=>ele.status=='已登记' || ele.status =='已完成')
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
      handleCreate(row) {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        this.createData(row)
      },
      createData(row) {
        getResult({exam_item_id:row.id}).then(res=>{
          this.someInfo = res.data
          this.picLink = []
          res.data.file.forEach(ele=>{
            this.picLink.push(window.location.protocol + '//' + window.location.hostname + ':8080' + `/${ele.saveName}`)
          })
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.someInfo.exam_item_id = row.id
        this.someInfo._uid = parseInt(getToken())
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.should_pay = row.fee * row.quantity
        this.truely_pay = 0
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData(row) {
        this.submitUpload()
        row.status = '已完成'
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
