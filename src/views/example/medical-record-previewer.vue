<template>
  <div >
    <div v-if="template">
      <el-button type="danger" size="mini" @click="goBack">返回</el-button>
      <el-button type="success" size="mini" @click="onApply">应用模板</el-button>
      <el-button type="primary" size="mini" @click="onUpdate">更新</el-button>
      <el-button type="danger" size="mini" @click="onDelete">删除</el-button>
    </div>
    <div v-else >
      <el-button type="danger" size="mini" @click="goBack">返回</el-button>
    </div>
    <el-form style="margin-top: 1.2em;" :rules="rules" :model="medicalRecord">
      <el-form-item label="主诉" prop="chief_complaint">
        <el-input :readonly="!template" type="textarea" v-model="medicalRecord.chief_complaint"></el-input>
      </el-form-item>
      <el-form-item label="体格检查" prop="physical_examination">
        <el-input :readonly="!template" type="textarea" v-model="medicalRecord.physical_examination"></el-input>
      </el-form-item>
      <el-form-item label="过敏史" prop="allergy_history">
        <el-input :readonly="!template" type="textarea" v-model="medicalRecord.allergy_history"></el-input>
      </el-form-item>
      <el-form-item label="既往史" prop="past_history">
        <el-input :readonly="!template" type="textarea" v-model="medicalRecord.past_history"></el-input>
      </el-form-item>
      <el-form-item label="现病史" prop="current_medical_history">
        <el-input :readonly="!template" type="textarea" v-model="medicalRecord.current_medical_history"></el-input>
      </el-form-item>
      <el-form-item label="现病治疗情况" prop="current_treatment_situation">
        <el-input :readonly="!template" type="textarea" v-model="medicalRecord.current_treatment_situation"></el-input>
      </el-form-item>
      <el-form-item v-show="template" label="模板类型" prop="title">
        <el-select v-model="medicalRecord.type" placeholder="type" clearable style="width: 90px" class="filter-item">
          <el-option v-for="item,index in [['个人',0],['科室',1],['全院',2]]" :key="index" :label="item[0]" :value="item[1]" />
        </el-select>
      </el-form-item>
      <el-form-item v-show="template" label="模板名称" prop="title">
        <el-input type="text" v-model="medicalRecord.title"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  import {update,_delete} from '@/api/medicalRecordTemplate'

  export default {
    name:'MedicalRecordPreviewer',
    props:['medicalRecord','template'],
    data(){
      return {
        // template:false,
        // medicalRecord:{
        //   id:0,
        //   type:0,
        //   title:'默认企鹅模板',
        //   allergy_history: "过56于88不v敏史",
        //   chief_complaint: "主爱的人去玩诉",
        //   current_medical_history: "现在秦委屈玩病",
        //   current_treatment_situation: "现在企鹅治疗",
        //   physical_examination: '检查请问身体',
        //   past_history: '过去历企鹅史'
        // }
        rules:{
          title:[{required: true, message: '请填写', trigger: 'change'}],
          chief_complaint: [{required: true, message: '请填写', trigger: 'change'}],
          physical_examination: [{required: true, message: '请填写', trigger: 'change'}],
          allergy_history: [{required: true, message: '请填写', trigger: 'change'}],
          past_history: [{required: true, message: '请填写', trigger: 'change'}],
          current_medical_history: [{required: true, message: '请填写', trigger: 'change'}],
          current_treatment_situation: [{required: true, message: '请填写', trigger: 'change'}]
        }
      }
    },
    methods:{
      goBack(){
        this.$emit('back')
      },
      onApply(){
        this.$emit('apply')
        this.$emit('fresh')
      },
      onDelete(){
        _delete({idArr:[this.medicalRecord.id]}).then(res=>{
          this.$notify({
            title: 'Success',
            message: '删除成功!',
            type: 'success',
            duration: 2000
          })
          this.$emit('fresh')
          this.goBack()
        })
      },
      onUpdate(){
        update(this.medicalRecord).then(res=>{
          this.$notify({
            title: 'Success',
            message: '更新成功!',
            type: 'success',
            duration: 2000
          })
        })
      }
    }
  }
</script>

<style></style>
