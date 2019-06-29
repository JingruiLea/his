<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
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
      <el-table-column label="ID" prop="id" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.uid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录名" prop="id" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="id" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.real_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" prop="id"  align="center" >
        <template slot-scope="{row}">
          <span>{{ row.role_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否排班" prop="id" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.participate_in_scheduling ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职位" prop="id" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="科室" prop="id" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.department }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="!canMultiDelete" size="mini" type="danger" @click="handleDelete">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

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
          <el-input v-model="temp.title" />
        </el-form-item>

<!--        <el-form-item label="Status">-->
<!--          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">-->
<!--            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="Imp">-->
<!--          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="Remark">-->
<!--          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />-->
<!--        </el-form-item>-->
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
  import {all, _delete, add} from '@/api/userMana'
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
        canMultiDelete: false,
        temp: {
          username: "admin2",
          password: "12345",
          real_name: "XUranus",
          department_id: 1,
          role_id: 1,
          participate_in_scheduling: true,
          title: "主任",
          role_name: "医院管理员",
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
      handleMultiDel(){

      },
      multiDelete(){
        let data = this.multiSelection.map(item=>{
          return item.uid
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
          const {users, departments, roles} = data
          bus.users = users
          bus.departments = departments
          bus.roles = roles
          this.list = users.map(user=>{
            user.department = departments.find(i => i.id == user.department_id).name
            return user
          })
          this.fullList = this.list
          this.total = users.length

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
            return item.username.includes(name)
          })
        }else{
          this.list = this.fullList
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
          real_name: "XUranus",
          department_id: 1,
          role_id: 1,
          participate_in_scheduling: true,
          title: "主任",
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
            updateArticle(tempData).then(() => {
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
      handleDelete(row) {
        console.log(`line 354: delete ${row}`)
        _delete([row.uid]).then(res =>{
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
        })
        this.getList()
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
