<template>
  <div>
    <div>
      {{JSON.stringify(username)}}
    </div>
    <el-button v-waves class="filter-item" type="primary" icon="el-icon-download" @click="getUserInfo">
      Export
    </el-button>
    <input v-model="username" type="text" />
  </div>
</template>

<script>
  import {all, _delete, add} from '@/api/userMana'

  export default {
    name:"zujian",
    components:{
    },
    computed:{

    },
    data(){
      return{
        msg:"",
        username:""
      }
    },
    methods:{
      getUserInfo(){
        all().then(res=>{
          this.msg = res
        })
      }
    },
    created(){

    }
  }
</script>

<style>
</style>
