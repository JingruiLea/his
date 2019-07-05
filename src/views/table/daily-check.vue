<template>
  <div class="app-container">
    <el-row>
      <el-col :span="11">
        <el-row class="demo-input-suffix">
          <el-col :span="10">
            <el-select @change="handleFilter" v-model="tempCollector.uid" placeholder="请选择收费员" class="filter-item" style="width: 10em">
              <el-option v-for="item,index in collectors" :key="index" :label="item.real_name" :value="item.uid" />
            </el-select>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-date-picker
              v-model="collectDate"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-col>
        </el-row>
        <el-table
          ref="singleTable"
          highlight-current-row
          @row-click="handleCurrentChange"
          :data="historyList"
          header-row-class-name="daily-detail-header"
          cell-class-name="align-center-cell"
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
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <el-button
                size="mini"
                type="primary"
                :disabled="row.checked"
                @click="handleEdit(row)">核对</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12" :offset="1">
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
            label="类型">
          </el-table-column>
          <el-table-column
            prop="medical_record_id"
            label="病历号">
          </el-table-column>
          <el-table-column
            prop="should_pay"
            label="应收">
          </el-table-column>
          <el-table-column
            prop="truely_pay"
            label="实收">
          </el-table-column>
          <el-table-column
            prop="retail_fee"
            label="找零">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="创建日期">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
  import {getAll, detail, collect, update, init, check} from '@/api/daily-check'
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
      collectors(){
        return bus.collectors
      }
    },
    watch:{
      collectDate(val){
        console.log(val);
        this.handleFilter()
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
        tempCollector:{
          uid:10001,
          real_name:'挂号收费员(测试'
        },
        dateInput:"",
        currentRow: null,
        collectDate:[
          '2000-01-01 00:00:00',
          '2020-01-01 00:00:00'
        ],
        historyList:null,
        detailsList:null,
        collectorList:null,
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
        rules: {},
        downloadLoading: false
      }
    },
    created() {
      this.getHistoryList()
      this.getCollectors()
    },
    methods: {
      handleEdit(row){
        row.checked=true
        check(row)
      },
      handleFilter(){
        console.log(this.tempCollector.uid)
        this.historyList = this.fullList.filter(ele=>{
          if(ele.user_id == this.tempCollector.uid)
            return true;
        })
        console.log(this.historyList)
        this.historyList = this.historyList.filter(ele=>{
          if(ele.start_time >= this.collectDate[0] && ele.end_time <= this.collectDate[1])
            return true;
        })

      },
      getCollectors() {
        this.listLoading = true
        init().then(response => {
          const {data} = response
          bus.collectors = data
          console.log(data)
          this.collectorList = data
          this.tempCollector = {uid:10001,real_name:'挂号收费员(测试'}
          console.log(this.tempCollector)
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      filterTag(value, row) {
        return row.checked === value;
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
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
          this.handleFilter()
          // Just to simulate the time of the request
          this.listLoading = false
        })
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
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
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
      handleFetchPv(pv) {
        fetchPv(pv).then(response => {
          this.pvData = response.data.pvData
          this.dialogPvVisible = true
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
  .align-center-cell .cell{
    text-align: center;
  }
</style>
