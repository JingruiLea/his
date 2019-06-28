<template>
  <div class="app-container">
    <el-card>
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="姓名" prop="username">
              <el-input v-model="temp.patient_name"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="性别" prop="username">
              <el-select v-model="temp.gender" class="filter-item" placeholder="Please select">
                <el-option v-for="item,index in ['男', '女']" :key="index" :label="item" :value="item"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="出生日期" prop="username">
              <el-date-picker
                editable
                type="date"
                v-model="temp.birthday"
                placeholder="选择出生日期"
                value-format="yyyy-MM-dd"
                @change="computeAge"
                @blur="computeAge"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="年龄" prop="username" readonly label-width="auto" style="margin-left: 1em;">
              <el-input style="max-width: 120px;" v-model="temp.age" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="医疗类别" prop="department_id">
              <el-select v-model="temp.medical_category" placeholder="请选择">
                <el-option v-for="item,index in ['就诊']" :key="index" :label="item" :value="item"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="医疗证类别" label-width="auto" >
              <el-select v-model="temp.medical_certificate_number_type" style="max-width: 120px;" class="filter-item" placeholder="Please select">
                <el-option v-for="item,index in [{a:'身份证', b:'id'}, {a:'医保卡', b:'mid'}]" :key="index" :label="item.a" :value="item.b"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item :label="temp.medical_certificate_number_type == 'id'?'身份证号':'医保卡号'" prop="department_id">
              <el-input v-model="temp.medical_certificate_number" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="挂号来源" prop="timestamp">
              <el-select v-model="temp.registration_source" class="filter-item" placeholder="Please select">
                <el-option v-for="item,index in ['窗口挂号', 'APP挂号']" :key="index" :label="item" :value="item"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="家庭住址" prop="department_id">
                <el-input v-model="temp.address"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="挂号科室" prop="department_id">
              <el-select v-model="temp.department_id" class="filter-item" placeholder="Please select" @change="getDoctorList">
                <el-option v-for="item,index in departments" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="挂号级别" prop="timestamp">
              <el-select v-model="temp.registration_level_id" class="filter-item" placeholder="Please select" @change="getDoctorList">
                <el-option v-for="item,index in registrationLevels" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="门诊医生" prop="department_id">
              <el-select v-model="temp.outpatient_doctor_id" class="filter-item" placeholder="Please select" @change="computeCost">
                <el-option v-for="item,index in outpatientDoctors" :key="index" :label="item.real_name" :value="item.uid"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结算类别" prop="department_id">
              <el-select v-model="temp.settlement_category_id" class="filter-item" placeholder="Please select">
                <el-option v-for="item,index in settlementCategorys" :key="index" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="医保诊断" prop="timestamp">
              <el-input v-model="temp.medical_insurance_diagnosis"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="是否要病历本" label-width="7em" style="margin-left: 1em;">
              <el-select v-model="temp.has_record_book" style="max-width: 120px;" class="filter-item" placeholder="Please select" @change="computeCost">
                <el-option v-for="item,index in [{a:'需要', b:1}, {a:'不要', b:0}]" :key="index" :label="item.a" :value="item.b"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="vertical-align: center">
          <el-col :span="8"></el-col>
          <el-col :span="4">应付:{{this.should_pay}}</el-col>
          <el-col :span="4">实付:<el-input style="max-width: 6em;" v-model="truely_pay" size="mini"/></el-col>
          <el-col :span="4">找零:{{this.retail_fee}}</el-col>
          <el-col :span="4">
            <el-button @click="submit" type="primary">提交</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>

    </el-card>
  </div>
</template>

<script>

  import bus from '@/bus'
  import {init, syncDoctorList, calculateFee, confirm} from '@/api/outpatientRegistration'

  export default {
    name: 'Registration',
    computed:{
      departments(){
        return bus.departments
      },
      settlementCategorys(){
        return bus.settlementCategorys
      },
      registrationLevels(){
        return bus.registrationLevels
      },
      retail_fee(){
        let temp = this.truely_pay - this.should_pay
        return temp < 0 ? "金额无效" : temp
      }
    },
    data() {
      return {
        driver: null,
        temp: {
          address : "沈阳市东北大学",
          age : 17,
          birthday : "1998.03.23",
          consultation_date: "2019.10.2",
          department_id: 1,
          gender: "男",
          has_record_book: 1,
          medical_category: "就诊",
          medical_certificate_number: "371625223284621134",
          medical_certificate_number_type: "id",
          medical_insurance_diagnosis: "不知道什么意思",
          patient_name: "王蓓蕾",
          outpatient_doctor_id  : undefined,
          settlement_category_id: 1,
          registration_source: "app挂号",
          registration_level_id: 1,
          should_pay : 28.24,
          truely_pay : 100,
          retail_fee : 71.76
        },
        should_pay : 0,
        truely_pay : 0,
        rules:{
          address: [
            { required: true, message: '此为必填项', trigger: 'blur' },
          ],
          address : [
            { required: true, message: '此为必填项', trigger: 'blur' },
          ],
          age : [
            { required: true, message: '此为必填项', trigger: 'blur' },
          ],
          birthday : [
            { required: true, message: '此为必填项', trigger: 'blur' },
          ],
          department_id: [
            { required: true, message: '此为必填项', trigger: 'blur' },
          ],
          gender: [
            { required: true, message: '此为必填项', trigger: 'blur' },
          ],
          has_record_book: [
            { required: true, message: '此为必填项', trigger: 'blur' },
          ],
          medical_category: [
            { required: true, message: '此为必填项', trigger: 'blur' },
          ],
          medical_certificate_number: [
            { required: true, message: '此为必填项', trigger: 'blur' },
          ],
          medical_certificate_number_type: [
            { required: true, message: '此为必填项', trigger: 'blur' },
          ],
          medical_insurance_diagnosis: [
            { required: true, message: '此为必填项', trigger: 'blur' },
          ],
          patient_name: [
            { required: true, message: '此为必填项', trigger: 'blur' },
          ],
          outpatient_doctor_id  : [
            { required: true, message: '此为必填项', trigger: 'blur' },
          ],
          settlement_category_id: [
            { required: true, message: '此为必填项', trigger: 'blur' },
          ],
          registration_source: [
            { required: true, message: '此为必填项', trigger: 'blur' },
          ],
          registration_level_id: [
            { required: true, message: '此为必填项', trigger: 'blur' },
          ],
          truely_pay : [
            { required: true, message: '此为必填项', trigger: 'blur' },
          ],
        },
        outpatientDoctors:undefined
      }
    },
    created() {
      if(bus.departments.length == 0){
        bus.getDepartments()
      }
      if(bus.settlementCategorys.length == 0){
        bus.getSettlementCategorys()
      }
      if(bus.registrationLevels.length ==0){
        bus.getRegistrationLevel()
      }
      this.getDoctorList()
    },
    methods: {
      resetTemp(){
        this.temp = {
          address : "",
          age : 17,
          birthday : "1998.03.23",
          consultation_date: "2019.10.2",
          department_id: 1,
          gender: "男",
          has_record_book: 1,
          medical_category: "就诊",
          medical_certificate_number: "",
          medical_certificate_number_type: "id",
          medical_insurance_diagnosis: "",
          patient_name: "",
          outpatient_doctor_id  : null,
          settlement_category_id: 1,
          registration_source: "app挂号",
          registration_level_id: 1,
          should_pay : 28.24,
          truely_pay : 100,
          retail_fee : 71.76
        }
      },
      computeAge(date){
        this.temp.age = new Date().getFullYear() - parseInt(date.substr(0, 4))
      },
      getList(){
        init().then(res=>{
          bus.departments = res.data.departments
        })
      },
      getDoctorList(){
        syncDoctorList(this.temp).then(res=>{
          this.outpatientDoctors = res.data
          if(this.outpatientDoctors.length == 0){
            this.temp.outpatient_doctor_id = undefined
            this.should_pay = 0
          }else{
            this.temp.outpatient_doctor_id = res.data[0].uid
          }
        })
      },
      computeCost(){
        calculateFee(this.temp).then(res=>{
          this.should_pay = res.data.fee
        })
      },
      submit(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.truely_pay = this.truely_pay
            this.temp.retail_fee = this.retail_fee
            this.temp.should_pay = this.should_pay
            confirm(this.temp).then(res => {
              if(this.retail_fee == "金额无效"){
                this.$message.error('数据填写错误!')
              }
            })
          }
        })

      }
    }
  }
</script>
