<template>
  <div class="app-container">
        <el-row class="demo-input-suffix">
          <el-col :span="7">
            <el-input
              placeholder="输入病历号"
              v-model="medicalRecordInput">
            </el-input>
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
          <el-col :span="4" :offset="1">
            <el-button class="filter-item" style="margin-left: 10px;float: right;" type="primary" icon="el-icon-edit" @click="getList">
              查找
            </el-button>
          </el-col>
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
    >
      <el-table-column label="编码" prop="id" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="病历号" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.medical_record_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.item_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" prop="id"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.format }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总价" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.fee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行科室" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.execute_department }}</span>
        </template>
      </el-table-column>
      <el-table-column label="费用类别" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.expense_classification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.creat_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收费时间" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.collect_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退费时间" prop="id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.return_time }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
  import {search} from '@/api/expense-search'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import bus from '@/bus.js'
  import fuzzyQuery from '@/utils/utils'
  import ElInput from "../../../node_modules/element-ui/packages/input/src/input.vue";
  import ElInputNumber from "../../../node_modules/element-ui/packages/input-number/src/input-number.vue";
  import ElCol from "element-ui/packages/col/src/col";
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
    name: 'CopyComplexTable',
    components: {
      ElRow,
      ElCol,
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
        medicalRecordInput:20000017,
        currentRow: null,
        collectDate:[
          '2000-01-01 00:00:00',
          '2020-01-01 00:00:00'
        ],
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
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {},
        downloadLoading: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      //handleFilter() {
     //   if (this.medicalRecordInput) {
     //     this.list = this.fullList.filter(ele => {
      //      let medical_record_id = parseInt(this.medicalRecordInput)
       //     if (ele.medical_record_id == medical_record_id && ele.create_time >= this.collectDate[0] && ele.create_time <= this.collectDate[1])
       //       return true;
      //    })
      //  }
     // },
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
      getList() {
        this.listLoading = true
        console.log(this.collectDate)
        search({medical_record_id:parseInt(this.medicalRecordInput),start_time:this.collectDate[0],end_time:this.collectDate[1]}).then(response => {
          const {data} = response
          this.fullList = data
          this.total = data.length
          this.list = data
          //this.handleFilter()
          // Just to simulate the time of the request
          this.listLoading = false
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
