import Vue from 'vue'
import {
  getDepartments,
  getSettlementCategorys,
  getRegistrationLevel,
  getUsers
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
    getSettlementCategorys(){
      getSettlementCategorys().then(res=>{
        this.settlementCategorys = res.data
      })
    },
    getRegistrationLevel(){
      getRegistrationLevel().then(res=>{
        this.registrationLevels = res.data
      })
    }
  }
})

window.bus = bus

export default bus
