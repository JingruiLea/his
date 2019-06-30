import Vue from 'vue'
import {
  getDepartments,
  getSettlementCategorys,
  getRegistrationLevel,
  getUsers,
  getDiseaseClassifications
} from '@/api/bus'


let bus = new Vue({
  data:{
    users:[],
    departments:[],
    roles:[],
    outpatientDoctors:[],
    settlementCategorys:[],
    departmentClassifications:[],
    registrationLevels:[],
    diseaseClassifications:[],
    expenseClassifications:[]
  },
  methods:{
    getUsers(){
      getUsers().then(res=>{
        this.roles = res.data.roles
        this.users = res.data.users
        this.departments = res.data.departments
      })
    },
    getDepartments(){
      getDepartments().then(res=>{
        this.departmentClassifications = res.data.department_classification
        this.departments = res.data.department
      })
    },
    getMainDiagnose(medicalRecord){
      let res = "无诊断"
      for(let i of medicalRecord.diagnose.chinese_diagnose){
        if(i.main_symptom){
          return i.disease_name
        }
      }
      for(let i of medicalRecord.diagnose.western_diagnose){
        if(i.main_symptom){
          return i.disease_name
        }
      }
      return res
    },
    getSettlementCategorys(){
      getSettlementCategorys().then(res=>{
        this.settlementCategorys = res.data
      })
    },
    getRegistrationLevel(){
      getRegistrationLevel().then(res=>{
        this.registrationLevels = res.data
      })
    },
    getDiseaseClassifications() {
      getDiseaseClassifications().then(res => {
        this.diseaseClassifications = res.data
      })
    }
  },
  created(){
    this.getDiseaseClassifications()
  }
})

window.bus = bus

export default bus
