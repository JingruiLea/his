<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="编码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter(1)" />
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter(1)" />
      <el-input v-model="listQuery.classification_name" placeholder="分类" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter(1)" />
      <el-input v-model="listQuery.type" placeholder="类别" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter(1)" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter(1)">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导入
      </el-button>
      <el-button v-if="canMultiDelete" :loading="downloadLoading" class="filter-item" type="danger" icon="el-icon-delete" @click="multiDelete">
        删除
      </el-button>
      <el-checkbox v-model="canMultiDelete" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        批量删除
      </el-checkbox>
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="canMultiDelete"
        type="selection"
      >
      </el-table-column>
      <el-table-column label="编码" prop="id" sortable="custom" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="id" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拼音" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.pinyin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="id"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.classification_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类别" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type}}</span>
        </template>
      </el-table-column>


      <el-table-column label="Actions" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" v-if="!canMultiDelete" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleFilter" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="ID" type="number">
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item label="名称" prop="username">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="拼音" prop="username">
          <el-input v-model="temp.pinyin" />
        </el-form-item>
        <el-form-item label="类别" prop="username">
          <el-select v-model="temp.classification_id" class="filter-item" placeholder="Please select">
            <el-option v-for="item,index in departments" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="种类" prop="department_id">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item,index in classes" :key="index" :label="item" :value="item" />
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
  import {getAll, add, _delete,update,_import} from '@/api/departments'
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
      classes(){
        return ["临床科室", "医技科室", "财务科室", "行政科室"]
      },
    },
    data() {
      return {
        tableKey: 0,
        list: null,
        fullList : null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          classification_name: undefined,
          id: undefined,
          type: undefined,
          name: undefined,
          sort: '+id'
        },
        canMultiDelete: false,
        multiSelection:[],
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
      multiDelete(){
        let data = this.multiSelection.map(item=>{
          return item.id
        })
        _delete({data:data}).then(res =>{
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      },
      handleSelectionChange(val){
        this.multiSelection = val
      },
      getList() {
        this.listLoading = true
        getAll().then(response => {
          const {data} = response
          const {department, department_classification} = data
          bus.departments = department
          bus.department_classification = department_classification
          this.list = department
          this.fullList = this.list
          this.total = department.length
          this.listQuery = {
            page: 1,
            limit: 20,
            classification_name: undefined,
            id: undefined,
            type: undefined,
            name: undefined,
            sort: '+id'
          }
          this.handleFilter();

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handleFilter(flag) {
        let name = this.listQuery.name
        let type = this.listQuery.type
        let id = this.listQuery.id
        let classification_name = this.listQuery.classification_name
        if(name){
          this.list = this.fullList.filter(item=>{
            return item.name.includes(name)
          })
        }
        else{
          this.list = this.fullList
        }
        if(id){
          this.list = this.list.filter(item=>{
            return item.id == id
          })
        }
        if(type){
          this.list = this.list.filter(item=>{
            return item.type.includes(type)
          })
        }
        if(classification_name){
          this.list = this.list.filter(item=>{
            return item.classification_name.includes(classification_name)
          })
        }
        this.total = this.list.length
        if(flag == 1) {
          this.listQuery.page = 1
          this.total = this.list.length
        }
        let start = this.listQuery.limit*(this.listQuery.page-1)
        let end = this.listQuery.limit*this.listQuery.page
        this.list = this.list.slice(start,end)

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
              this.getList()
            })
          }
        })
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
