<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px"
             >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="temp.username"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别" prop="username">
            <el-select v-model="temp.gender" class="filter-item" placeholder="Please select">
              <el-option v-for="item,index in ['男', '女']" :key="index" :label="item" :value="item"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出生日期" prop="username">
            <el-date-picker
              type="dates"
              v-model="temp.birthday"
              placeholder="选择一个或多个日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="医疗类别" prop="department_id">
            <el-select v-model="temp.department_id" class="filter-item" placeholder="Please select">
              <el-option v-for="item,index in departments" :key="index" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="医保证号" prop="department_id">
            <el-select v-model="temp.role_id" class="filter-item" placeholder="Please select">
              <el-option v-for="item,index in roles" :key="index" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="挂号来源" prop="timestamp">
            <el-input v-model="temp.title"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="家庭住址" prop="department_id">
            <el-select v-model="temp.department_id" class="filter-item" placeholder="Please select">
              <el-option v-for="item,index in departments" :key="index" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="挂号科室" prop="department_id">
            <el-select v-model="temp.role_id" class="filter-item" placeholder="Please select">
              <el-option v-for="item,index in roles" :key="index" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="挂号级别" prop="timestamp">
            <el-input v-model="temp.title"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="门诊医生" prop="department_id">
            <el-select v-model="temp.department_id" class="filter-item" placeholder="Please select">
              <el-option v-for="item,index in departments" :key="index" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结算类别" prop="department_id">
            <el-select v-model="temp.role_id" class="filter-item" placeholder="Please select">
              <el-option v-for="item,index in roles" :key="index" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="医保诊断" prop="timestamp">
            <el-input v-model="temp.title"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

  import bus from '@/bus'
  import {init} from '@/api/outpatientRegistration'

  export default {
    name: 'Registration',
    data() {
      return {
        driver: null,
        temp: {
          gender:'男',
          birthday:'1998-01-01'
        }
      }
    },
    mounted() {
      if(!bus.departments){
        this.getList()
      }
    },
    methods: {
      getList(){
        init().then(res=>{
          bus.departments = res.data.departments
        })
      }
    }
  }
</script>
