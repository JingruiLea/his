<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="ID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter(1)" />
      <el-input v-model="listQuery.name" placeholder="登录名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter(1)" />
      <el-input v-model="listQuery.real_name" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter(1)" />
      <el-input v-model="listQuery.department" placeholder="科室" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter(1)" />
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
      <el-checkbox v-model="canMultiDelete" class="filter-item" style="margin-left:15px;" >
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
      <el-table-column label="ID" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="科室" prop="id" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.department_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="职位" prop="id" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="限号" prop="id"  align="center" >
        <template slot-scope="{row}">
          <span>{{ row.scheduling_limit }}</span>
        </template>
      </el-table-column>

      <el-table-column label="截止日期" prop="id" width="70px" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.expiry_date }}</span>
        </template>
      </el-table-column>

      <el-table-column label="挂号等级" prop="id" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.registration_Level }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="!canMultiDelete" size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleFilter" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="登录名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="姓名" prop="username">
          <el-input v-model="temp.real_name" />
        </el-form-item>
        <el-form-item label="密码" prop="username">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="科室" prop="department_id">
          <el-select v-model="temp.department_id" class="filter-item" placeholder="Please select">
            <el-option v-for="item,index in departments" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="department_id">
          <el-select v-model="temp.role_id" class="filter-item" placeholder="Please select">
            <el-option v-for="item,index in roles" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="timestamp">
          <el-select v-model="temp.title" class="filter-item" placeholder="Please select">
            <el-option v-for="item,index in classes" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
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
  import {all, _delete, add, update,_import} from '@/api/paiban'
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
      roles(){
        return bus.roles
      },
      classes(){
        return ["主任医师", "副主任医师", "主治医师", "住院医师"]
      }
    },
    data() {
      return {
        multiSelection:[],
        tableKey: 0,
        list: null,
        fullList : null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          id: undefined,
          real_name: undefined,
          department: undefined,
          name: undefined,
          sort: '+id'
        },
        importanceOptions: [1, 2, 3],
        calendarTypeOptions,
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        canMultiDelete: false,
        temp: {
          username: "admin2",
          password: "12345",
          real_name: "admin",
          department_id: 1,
          role_id: 1,
          participate_in_scheduling: true,
          title: "主任医师",
          role_name: "医院管理员",
          department_name: "神经科"
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新建'
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
      handleMultiDel(){

      },
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
      getList() {
        this.listLoading = true
        all().then(response => {
          const {data} = response
          this.list = data
          this.fullList = this.list
          this.total = this.list.length
          this.listQuery = {
            page: 1,
            limit: 20,
            id: undefined,
            real_name: undefined,
            department: undefined,
            name: undefined,
            sort: '+id'
          }
          this.handleFilter();
          this.listLoading = false
          // Just to simulate the time of the request
        })
      },
      handleFilter(flag) {
        let name = this.listQuery.name
        let real_name = this.listQuery.real_name
        let id = this.listQuery.id
        let department = this.listQuery.department
        if(name){
          this.list = this.fullList.filter(item=>{
            return item.username.includes(name)
          })
        }else{
          this.list = this.fullList
        }
        if(real_name){
          this.list = this.list.filter(item=>{
            return item.real_name.includes(real_name)
          })
        }
        if(id){
          this.list = this.list.filter(item=>{
            return item.uid == id
          })
        }
        if(department){
          this.list = this.list.filter(item=>{
            return item.department.includes(department)
          })
        }
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
      handleSelectionChange(val){
        this.multiSelection = val
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
          username: "admin2",
          password: "12345",
          real_name: "admin",
          department_id: 1,
          role_id: 1,
          participate_in_scheduling: true,
          title: "主任医师",
          role_name: "医院管理员",
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
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
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
          const tHeader = ['ID', '登录名', '角色名', '姓名', '职位', '科室']
          const filterVal = ['uid', 'username', 'role_name', 'real_name', 'title', 'department']
          const data = this.formatJson(filterVal, this.list)
          console.log(data)
          // excel.export_json_to_excel({
          //   header: tHeader,
          //   data: data,
          //   filename: '用户信息'
          // })
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
