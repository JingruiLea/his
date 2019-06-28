<template>
  <el-container class="medical-container">
    <el-aside width="200px" class="medical-asider">
      <div>
        <el-table
          stripe
          :data="patients"
          style="width: 100%"
          row-class-name="asider-item">
          <el-table-column
            label="待诊患者">
            <template slot-scope="{row}" class="asider-item">
              <el-tag
                :type="row.status === '未看诊' ? 'primary' : 'success'"
                disable-transitions>{{row.status}}</el-tag>
              <span style="margin-left: 0.7em;">{{row.name}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div></div>
    </el-aside>
    <el-main>
      <el-page-header @back="goBack" content="详情页面">
      </el-page-header>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="病历首页" name="first">用户管理</el-tab-pane>
        <el-tab-pane label="检查检验" name="second">配置管理</el-tab-pane>
        <el-tab-pane label="处方开立" name="third">角色管理</el-tab-pane>
        <el-tab-pane label="门诊确诊" name="fourth">定时任务补偿</el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
  import bus from '@/bus'
  export default {
    name:'medicalRecordIndex',
    data(){
      return {
        tableRowClassName:"table-row",
        patients:[
          {
          medical_record_id:100,
          name:'李金凤',
          status:'未看诊'
          },
          {
            medical_record_id:100,
            name:'刘金凤',
            status:'未看诊'
          },
          {
            medical_record_id:100,
            name:'柳金凤',
            status:'未看诊'
          },
          {
            medical_record_id:100,
            name:'王金凤',
            status:'未看诊'
          }
        ]
      }
    },
    computed:{

    },
    methods:{
      goBack(){

      }
    },

  }
</script>

<style>
  .medical-container{
    padding: 0;
    height: 100%;
    min-height: 100%;
    position: relative;
    left:0;
    top:0;
    bottom:0;
  }
  .medical-asider{
    background: inherit;
    border-right: 1px rgb(192, 192, 192) solid;
    min-height: calc(100vh - 50px);
    padding: 0 !important;
  }
  .asider-item{
    text-align: center;
    padding-top: 0.7em;
    /*border-bottom: 1px solid rgb(192, 192, 192);*/
    vertical-align: center;
  }
  .asider-item .cell{
    text-align: center;
  }
  style-hr {
    border: 0;
    height: 1px;
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
  }
</style>
