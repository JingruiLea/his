<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="编码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.code" placeholder="国际标准码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.custom_name" placeholder="自定义名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox>
    </div>

    <el-select @change="handleChange" v-model="tempClassification.id" placeholder="选择类型" class="filter-item" style="width: 10em">
      <el-option v-for="item,index in diseaseClassifications" :key="index" :label="item.name" :value="item.id" />
    </el-select>

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
      <el-table-column label="国际标准码" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="id" sortable="custom" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拼音" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.pinyin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="id"  align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.classification_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="自定义名称" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.custom_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="自定义助记符" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.custom_pinyin}}</span>
        </template>
      </el-table-column>


      <el-table-column label="Actions" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="编码" type="number">
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item label="名称" prop="username">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="拼音" prop="username">
          <el-input v-model="temp.pinyin" />
        </el-form-item>
        <el-form-item label="分类" prop="username">
          <el-select v-model="temp.classification_id" class="filter-item" placeholder="Please select">
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
  import {getAll, add, _delete, _import, getDisease, update} from '@/api/disease-directorys'
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
          id: 115,
          code: "A06.051",
          classification_name: "阿米巴病",
          name: "急性阿米巴病",
          pinyin: "JXAMBB",
          custom_name: "",
          custom_pinyin: ""
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
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

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
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
      resetTempDisease() {
        this.tempDisease = {
          id: 115,
            code: "A06.051",
            classification_name: "阿米巴病",
            name: "急性阿米巴病",
            pinyin: "JXAMBB",
            custom_name: "",
            custom_pinyin: "",
            classification_id: 1
        }
      },
      handleCreate() {
        this.resetTempDisease()
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
      handleDelete(row) {
        console.log(`line 354: delete ${row}`)
        _delete({data:[row.id]}).then(res =>{
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
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
