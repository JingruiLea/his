import Vue from 'vue'
import {getDepartments, getSettlementCategorys, getRegistrationLevel} from '@/api/bus'


let bus = new Vue({
  data:{
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
    getDepartments(){
      getDepartments().then(res=>{
        this.departmentClassifications = res.data.department_classification
        this.departments = res.data.department
      })
    },
    getUsers(){

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
