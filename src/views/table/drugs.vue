<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.idToShow" placeholder="ID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter(1)" />
      <el-input v-model="listQuery.code" placeholder="编码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter(1)" />
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter(1)" />
      <el-input v-model="listQuery.type" placeholder="类型" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter(1)" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter(1)">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate()">
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
      <el-table-column label="ID" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编码" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="包装单位" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" prop="id"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.format }}</span>
        </template>
      </el-table-column>
      <el-table-column label="厂家" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.manufacturer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="剂型" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.dosage_form }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拼音码" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.pinyin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stock }}</span>
        </template>
      </el-table-column>


      <el-table-column label="Actions" align="center" width="200" class-name="small-padding fixed-width">
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
          <el-input
            v-model="temp.id"
            :disabled="dialogStatus==='create' ? false:true">
          </el-input>
        </el-form-item>
        <el-form-item label="编码" type="number">
          <el-input v-model="temp.code" />
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
        <el-form-item label="包装单位" >
          <el-input v-model="temp.unit" />
        </el-form-item>
        <el-form-item label="厂家" >
          <el-input v-model="temp.manufacturer" />
        </el-form-item>
        <el-form-item label="剂型" >
          <el-input v-model="temp.dosage_form" />
        </el-form-item>
        <el-form-item label="药品类型" >
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item,index in classes" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="单价" >
          <el-input v-model="temp.price" />
        </el-form-item>
        <el-form-item label="库存" >
          <el-input v-model="temp.stock" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
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
  import {getAll, add, _delete,_import,update,getDrugByPage,getDrugSize,search} from '@/api/drugs'
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
      classes(){
        return [{id:101, name:"西药"}, {id:102, name:"中成药"}, {id:103, name:"中草药"}]
      }
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
          id: null,
          code: '',
          type: '',
          name: '',
          sort: '+id',
          idToShow:null
        },
        canMultiDelete: false,
        multiSelection:[],
        importanceOptions: [1, 2, 3],
        calendarTypeOptions,
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          id:null,
          code:"",
          name:"",
          format:"",
          unit:"",
          manufacturer:"",
          dosage_form:null,
          type:"",
          price:null,
          pinyin:"",
          stock:null
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
      this.getPageList()
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
          this.listQuery.page=1
          this.getPageList()
        })
      },
      handleSelectionChange(val){
        this.multiSelection = val
      },
      getPageList(){
        this.listLoading = true
        getDrugByPage(this.listQuery).then(res=>{
          this.list = res.data
        })
        getDrugSize().then(res=>{
          this.total = res.data
        })
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 600)
      },
      getList() {
        this.listLoading = true
        getAll().then(response => {
          const {data} = response
          bus.drugs = data
          this.fullList = data
          this.total = data.length

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handleFilter(flag) {
        this.listQuery.id = parseInt(this.listQuery.idToShow)
        search(this.listQuery).then(res=>{
          if(flag == 1) {
            this.listQuery.page = 1
          }
          const {data} = res
          const {list,total} = data
          this.list = list
          this.total = total
          console.log(this.list)
        })
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
          id:null,
          code:"",
          name:"",
          format:"",
          unit:"",
          manufacturer:"",
          dosage_form:null,
          type:"",
          price:null,
          pinyin:"",
          stock:null
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
          this.getPageList()
        })

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
              this.getPageList()
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
          this.getPageList()
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
