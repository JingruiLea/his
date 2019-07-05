<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="编码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter(1)" />
      <el-input v-model="listQuery.code" placeholder="国际标准码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter(1)" />
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter(1)" />
      <el-input v-model="listQuery.custom_name" placeholder="自定义名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter(1)" />
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

    <el-row>
        诊断目录分类：
      <el-select @change="handleChange" filterable v-model="tempClassification.id" placeholder="选择类型" class="filter-item" style="width: 10em">
        <el-option v-for="item,index in diseaseClassifications" :key="index" :label="item.name" :value="item.id" />
      </el-select>
    </el-row>

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
      <el-table-column label="编码" prop="id" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="国际标准码" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="id" align="center">
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
      <el-table-column label="自定义名称" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.custom_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="自定义助记符" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.custom_pinyin}}</span>
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 400px; margin-left:50px;">
        <el-form-item label="编码" type="number">
          <el-input
            v-model="temp.id"
            :disabled="dialogStatus==='create' ? false:true">
          </el-input>
        </el-form-item>
        <el-form-item label="名称" prop="username">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="国际标准码" prop="username">
          <el-input v-model="temp.code" />
        </el-form-item>
        <el-form-item label="拼音" prop="username">
          <el-input v-model="temp.pinyin" />
        </el-form-item>
        <el-form-item label="分类" prop="username">
          <el-select v-model="temp.classification_id" filterable class="filter-item" placeholder="请选择">
            <el-option v-for="item,index in diseaseClassifications" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="自定义名称" prop="department_id">
          <el-input v-model="temp.custom_name" />
        </el-form-item>
        <el-form-item label="自定义助记符" prop="department_id">
          <el-input v-model="temp.custom_pinyin" />
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
  import {getAll, add, _delete, _import, getDisease, update} from '@/api/disease-directorys'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import bus from '@/bus.js'
  import fuzzyQuery from '@/utils/utils'
  import ElRow from "element-ui/packages/row/src/row";

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
    name: 'DiseaseDirectory',
    components: {
      ElRow,
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
      diseaseClassifications(){
        return bus.diseaseClassifications
      }
    },
    data() {
      return {
        diseases:null,
        tableKey: 0,
        list: null,
        fullList : null,
        total: 0,
        listLoading: true,
        canMultiDelete: false,
        multiSelection:[],
        listQuery: {
          page: 1,
          limit: 20,
          id: undefined,
          custom_name: undefined,
          code: undefined,
          name: undefined,
          sort: '+id'
        },
        importanceOptions: [1, 2, 3],
        calendarTypeOptions,
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        tempClassification: {},
        temp: {
          id: null,
          code: "",
          classification_name: "",
          name: "",
          pinyin: "",
          custom_name: "",
          custom_pinyin: ""
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新建'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {},
        downloadLoading: false
      }
    },
    created() {
      this.getDiseaseClassificationsList()
    },
    methods: {
      multiDelete(){
        let data = this.multiSelection.map(item=>{
          return item.id
        })
        _delete({data:data}).then(res =>{
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getDiseaseList(this.tempClassification.id)
        })
      },
      handleSelectionChange(val){
        this.multiSelection = val
      },
      getDiseaseClassificationsList() {
        this.listLoading = true
        getAll().then(response => {
          const {data} = response
          bus.diseaseClassifications = data
          this.list = data
          this.fullList = this.list
          this.total = data.length
          this.tempClassification = {id:1,name:'阿米巴病'}
          this.getDiseaseList(this.tempClassification.id)
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      getDiseaseList(id) {
        this.listLoading = true
        getDisease({classification_id:id}).then(response => {
          const {data} = response
          const {diseases} = data
          bus.diseases = diseases
          this.list = diseases
          this.fullList = this.list
          this.total = diseases.length
          this.listQuery = {
            page: 1,
            limit: 20,
            id: undefined,
            custom_name: undefined,
            code: undefined,
            name: undefined,
            sort: '+id'
          }
          this.handleFilter();

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 800)
        })
      },
      handleFilter(flag) {
        let name = this.listQuery.name
        let id = this.listQuery.id
        let code = this.listQuery.code
        let custom_name = this.listQuery.custom_name
        if(id){
          this.list = this.fullList.filter(item=>{
            return item.id==id
          })
        }else{
          this.list = this.fullList
        }
        if(code){
          this.list = this.list.filter(item=>{
            return item.code.includes(code)
          })
        }
        if(name) {
          this.list = this.list.filter(item => {
            return item.name.includes(name)
          })
        }
        if(custom_name){
          this.list = this.list.filter(item=>{
            if(item.custom_name)
              return item.custom_name.includes(custom_name)
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
          message: '操作成功',
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
      resetTemp(){
        this.temp = {
          id: null,
            code: "",
            classification_name: "",
            name: "",
            pinyin: "",
            custom_name: "",
            custom_pinyin: ""
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
      handleChange(){
        console.log(this.tempClassification)
        this.getDiseaseList(this.tempClassification.id)
      },
      createData() {
        this.temp.id = parseInt(this.temp.id)
        add(this.temp).then(res=>{
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
          this.getDiseaseList(this.tempClassification.id)
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
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.getDiseaseList(this.tempClassification.id)
            })
          }
        })
      },
      handleDelete(row) {
        console.log(`line 354: delete ${row}`)
        _delete({data:[row.id]}).then(res =>{
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
          this.getDiseaseList(this.tempClassification.id)
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
      },
      getList(){}
    }
  }
</script>
