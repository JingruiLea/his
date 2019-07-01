<template>
  <div>
    <el-row>
      <div v-if="!creatingTemplate && !template">
        <el-button type="danger" size="mini" @click="reset" >清空</el-button>
        <el-button type="primary" size="mini" @click="saveAsTemplate" >生成模板</el-button>
        <el-button type="primary" size="mini" @click="tempSave" >暂存</el-button>
        <el-button type="success" size="mini" @click="next" >提交</el-button>
      </div>
      <div v-if="template">
        <el-button type="danger" size="mini" @click="back">返回</el-button>
        <el-button type="success" size="mini" @click="applyTemplate" >应用模板</el-button>
        <el-button type="primary" size="mini" @click="updateTemplate">更新</el-button>
        <el-button type="danger" size="mini" @click="deleteTemplate">删除</el-button>
      </div>
      <div v-if="creatingTemplate">
        <el-button type="success" size="mini" @click="submitTemplate">提交模板</el-button>
        <el-button type="primary" size="mini" @click="backFromCreatingTemplate">返回</el-button>
      </div>
    </el-row>
    <el-row>
      <el-form>
        <div v-if="creatingTemplate || template" style="margin-top: 1em;">
          <el-form-item label="模板类型" prop="title">
            <el-select v-model="exam.display_type" placeholder="type"
                       class="filter-item">
              <el-option v-for="item,index in [['个人',0],['科室',1],['全院',2]]" :key="index" :label="item[0]"
                         :value="item[1]"/>
            </el-select>
          </el-form-item>
          <el-form-item label="模板名称" prop="title">
            <el-input type="text" v-model="exam.template_name"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <el-table
        :data="exam.nonDrugs"
        row-class-name="diagnose-class"
      >
        <el-table-column
          label="编码"
          prop="code"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="名称"
        >
          <template slot-scope="{row}">
            <el-tooltip effect="dark" popper-class="popper-class" :content="row.name" placement="top-start">
              <span>{{row.name}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="fee"
          label="费用"
        >
        </el-table-column>
        <el-table-column
          prop="Actions"
          label="操作"
        >
          <template slot-scope="{row}">
            <el-button type="danger" @click="removeExam(row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
  import {list as listExam,create as createExam, update as updateExam, _delete as deleteExam} from '@/api/exam'
  import {create as createTemplate} from '@/api/examTemplate'

  export default {
    name:'ExamEdit',
    props:['exam', 'hasSubmit', 'template','medical_record_id'],
    data(){
      return {
        creatingTemplate: false,
        savedDiagnose: {}
      }
    },
    methods:{
      checkMainSymptom(row) {
        for (let i = 0; i < this.diagnose.western_diagnose.length; i++) {
          if (this.diagnose.western_diagnose[i] == row) {
            let temp = Object.assign({}, this.diagnose.western_diagnose[i])
            temp.main_symptom = true
            this.$set(this.diagnose.western_diagnose, i, temp)
          } else {
            let temp = Object.assign({}, this.diagnose.western_diagnose[i])
            temp.main_symptom = false
            this.$set(this.diagnose.western_diagnose, i, temp)
          }
        }
        for (let i = 0; i < this.diagnose.chinese_diagnose.length; i++) {
          if (this.diagnose.chinese_diagnose[i] == row) {
            let temp = Object.assign({}, this.diagnose.chinese_diagnose[i])
            temp.main_symptom = true
            this.$set(this.diagnose.chinese_diagnose, i, temp)
          } else {
            let temp = Object.assign({}, this.diagnose.chinese_diagnose[i])
            temp.main_symptom = false
            this.$set(this.diagnose.chinese_diagnose, i, temp)
          }
        }
      },
      removeExam(row) {
        this.exam.nonDrugs = this.exam.nonDrugs.filter(i=>i.id!=row.id)
      },
      reset(){
        this.$emit('update:exam', {
          medical_record_id:this.medical_record_id,
          nonDrugs:[]
        })
      },
      saveAsTemplate(){
        this.creatingTemplate = true
        this.saved = JSON.parse(JSON.stringify(this.exam))
      },
      tempSave(){

      },
      next(){
        this.$emit('next',JSON.parse(JSON.stringify(this.exam)))
      },
      back(){
        this.$emit('back')
      },
      examToSubmit(){
        let res = {
          medical_record_id:this.exam.medical_record_id,
          non_drug_id_list: [],
          id:this.exam.id,
          template_name:this.exam.template_name,
          display_type:this.exam.display_type,
          type:0
        }
        for(let i of this.exam.nonDrugs){
          res.non_drug_id_list.push(i.id)
        }
        return res
      },
      submitTemplate(){
        createTemplate(this.examToSubmit()).then(res=>{
          this.$notify({
            title: 'Success',
            message: '存为模板成功!',
            type: 'success',
            duration: 2000
          })
          this.creatingTemplate = false
          this.$emit('fresh')
        })
      },
      backFromCreatingTemplate(){
        if(this.hasSubmit){
          this.$emit('update:diagnose', JSON.parse(JSON.stringify(this.savedDiagnose)))
        }
        this.creatingTemplate = false
      },
      applyTemplate(){
        this.$emit('apply')
        this.$notify({
          title: 'Success',
          message: '应用模板成功!',
          type: 'success',
          duration: 2000
        })
        this.$emit('back')
      },
      updateTemplate(){
        updateTemplate(this.examToSubmit()).then(res=>{
          this.$notify({
            title: 'Success',
            message: '更新模板成功!',
            type: 'success',
            duration: 2000
          })
          this.$emit('fresh')
        })
      },
      deleteTemplate(){
        deleteTemplate({idArr:[this.diagnose.id]}).then(res=>{
          this.$notify({
            title: 'Success',
            message: '删除模板成功!',
            type: 'success',
            duration: 2000
          })
          this.$emit('fresh')
          this.$emit('back')
        })
      },
      templateToExam(res){
        let temp = {
          nonDrugs:[],
          medical_record_id:res.medical_record_id
        }
        for(let i of res.exam_item){
          temp.nonDrugs.push(i.non_drug_item)
        }
        return temp
      },
      getExam(){
        listExam({medical_record_id:this.medical_record_id,type:0}).then(res=>{
          if(res.data.length > 0){
            let temp = {
              nonDrugs:[],
              medical_record_id:res.data[0].medical_record_id
            }
            for(let i of res.data[0].exam_item){
              temp.nonDrugs.push(i.non_drug_item)
            }
            this.$emit('update:exam', temp)
          }else{
            createExam({
              non_drug_id_list:[],
              medical_record_id:this.medical_record_id,
              type:0
            }).then(res=>{
              let temp = JSON.parse(JSON.stringify(this.exam))
              temp.id = res.id
              this.$emit('update:exam', temp)
            })
          }
        })
      }
    },
    created() {
      if(this.medical_record_id){
        this.getExam()
      }
    },

  }
</script>

<style>
  .diagnose-class .cell{
    max-height: 3em;
    overflow-y: hidden;
  }
  .popper-class{
    width: 6em;
    max-width: 6em;
  }
</style>
