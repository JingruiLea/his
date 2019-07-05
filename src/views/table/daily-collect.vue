<template>
  <div class="app-container">
    <el-row>
     <el-col :span="8">
       <el-row class="demo-input-suffix">
         <el-col :span="18">
         <el-input
           placeholder="输入日期以筛选"
           suffix-icon="el-icon-date"
           v-model="dateInput">
         </el-input>
         </el-col>
         <el-col :span="6">
         <el-button class="filter-item" style="margin-left: 10px;float: right;" type="primary" icon="el-icon-edit" @click="handleCreate()">
           新日结
         </el-button>
         </el-col>
       </el-row>
        <el-table
          ref="singleTable"
          highlight-current-row
          @row-click="handleCurrentChange"
          :data="historyList"
          header-row-class-name="daily-detail-header"
          style="width: 100%">
          <el-table-column
            prop="start_time"
            label="开始日期">
          </el-table-column>
          <el-table-column
            prop="end_time"
            label="结束日期">
          </el-table-column>
          <el-table-column
            prop="checked"
            label="是否核对"
            size="mini"
            :filters="[{ text: '未核对', value: false }, { text: '已核对', value: true }]"
            :filter-method="filterTag"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.checked ? 'success' : 'danger'"
                disable-transitions>{{scope.row.checked?'已核对':'未核对'}}</el-tag>
            </template>
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
            align="center"
            width="150">
          </el-table-column>
          <el-table-column
            prop="type"
            align="center"
            label="类型">
          </el-table-column>
          <el-table-column
            prop="medical_record_id"
            align="center"
            label="病历号">
          </el-table-column>
          <el-table-column
            prop="cost"
            align="center"
            label="金额">
          </el-table-column>
          <el-table-column
            prop="create_time"
            align="center"
            label="创建日期">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog style="text-align: center;" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-date-picker
        v-model="collectDate.end_time"
        type="date"
        @change="changeDate"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择日结结束日期">
      </el-date-picker>
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
  import {getAll, detail, collect} from '@/api/daily-collect'
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

    },
    watch:{
      dateInput(val){
        this.historyList = this.fullList.filter(ele=>{
          if(ele.start_time.includes(val) || ele.end_time.includes(val))
            return true;
        })
      }
    },
    data() {
      return {
        pickerOptions:{shortcuts: [{
            text: '最近一天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        dateInput:"",
        currentRow: null,
        collectDate:{
          start_time:'',
          end_time:'2019-06-29 00:00:00'
        },
        historyList:null,
        detailsList:null,
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
        temp: {},
        importanceOptions: [1, 2, 3],
        calendarTypeOptions,
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: '新日结'
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
      this.getHistoryList()
    },
    methods: {
      filterTag(value, row) {
        return row.checked === value;
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      changeDate(){
        console.log(this.collectDate)
        let max = '1999-01-01 00:00:00'
        for(let item of this.fullList){
          if(max < item.end_time){
            max = item.end_time
          }
        }
        this.collectDate.start_time = max
      },
      formatter(row, column) {
        return row.address;
      },
      getHistoryList() {
        this.listLoading = true
        getAll().then(response => {
          const {data} = response
          this.historyList = data
          this.fullList = data
          this.total = data.length
          this.changeDate()

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
      setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row);
      },
      handleCurrentChange(val) {
        this.currentRow = val;
        console.log(val)
        detail({
          daily_collect_id: val.id
        }).then(response=>{
          const {data} = response
          this.detailsList = data
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
        //this.$nextTick(() => {
        //  this.$refs['dataForm'].clearValidate()
        //})
      },
      createData() {
        collect(this.collectDate).then(res=>{
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: 'Created Successfully',
            type: 'success',
            duration: 2000
          })
          this.getHistoryList()
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
