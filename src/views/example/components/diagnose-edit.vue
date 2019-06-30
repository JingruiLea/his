<template>
  <div>
  <el-row>
    <div v-if="!creatingTemplate && !template">
      <el-button type="danger" size="mini" @click="reset" :disabled="hasSubmit">清空</el-button>
      <el-button type="primary" size="mini" @click="saveAsTemplate">生成模板</el-button>
      <el-button type="primary" size="mini" @click="tempSave">暂存</el-button>
      <el-button type="success" size="mini" @click="next">提交</el-button>
    </div>
    <div v-if="template">
      <el-button type="danger" size="mini" @click="back">返回</el-button>
      <el-button type="success" size="mini" @click="applyTemplate" :disabled="hasSubmit">应用模板</el-button>
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
        <el-select v-model="diagnose.type" placeholder="type"
                   class="filter-item">
          <el-option v-for="item,index in [['个人',0],['科室',1],['全院',2]]" :key="index" :label="item[0]"
                     :value="item[1]"/>
        </el-select>
      </el-form-item>
      <el-form-item label="模板名称" prop="title">
        <el-input :readonly="hasSubmit" type="text" v-model="diagnose.title"></el-input>
      </el-form-item>
    </div>
    </el-form>
    <el-table
      :data="diagnose.western_diagnose"
      height="25em"
      row-class-name="diagnose-class"
    >
      <el-table-column
        label="西医诊断"
        prop="disease_code"
      ></el-table-column>
      <el-table-column
        prop="disease_name"
      >
        <template slot-scope="{row}">
          <el-tooltip effect="dark" :content="row.disease_name" placement="top-start">
            <span>{{row.disease_name}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="main_symptom"
      >
        <template slot-scope="{row}">
          <el-radio v-model="row.main_symptom" @change="checkMainSymptom(row)" :label="true">主诊</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="suspect">
        <template slot-scope="{row}">
          <el-checkbox v-model="row.suspect">疑似</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        prop="Actions"
      >
        <template slot-scope="{row}">
          <el-button type="danger" @click="removeDiagnose(row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      :data="diagnose.chinese_diagnose"
      row-class-name="diagnose-class"
      height="25em"
    >
      <el-table-column
        label="中医诊断"
        height="25em"
        prop="disease_code"
      ></el-table-column>
      <el-table-column
        prop="disease_name"
      >
        <template slot-scope="{row}">
          <el-tooltip :open-delay="500" popper-class="popper-class" effect="dark" :content="row.disease_name" placement="top-start">
            <span>{{row.disease_name}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="mainmain_symptom"
      >
        <template slot-scope="{row}">
          <el-radio v-model="row.main_symptom" @change="checkMainSymptom(row)" :label="true">主诊</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="suspect">
        <template slot-scope="{row}">
          <el-checkbox v-model="row.suspect">疑似</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        prop="Actions"
      >
        <template slot-scope="{row}">
          <el-button type="danger" @click="removeDiagnose(row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
  </div>
</template>

<script>
  import {create as createTemplate, update as updateTemplate} from '@/api/diagnoseTemplate'

  export default {
    name:'DiagnoseEdit',
    props:['diagnose', 'hasSubmit', 'template'],
    data(){
      return {
        creatingTemplate: false,
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
      removeDiagnose(row) {
        let index = this.diagnose.western_diagnose.indexOf(row)
        if (index != -1) this.diagnose.western_diagnose.splice(index, 1)
        index = this.diagnose.chinese_diagnose.indexOf(row)
        if (index != -1) this.diagnose.chinese_diagnose.splice(index, 1)
      },
      reset(){
        this.$emit('reset')
      },
      saveAsTemplate(){
        this.creatingTemplate = true
      },
      tempSave(){
        this.emit('暂存')
      },
      next(){
        this.$emit('next')
      },
      back(){
        this.template = false
      },
      submitTemplate(){
        createTemplate(this.diagnose).then(res=>{
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
        this.creatingTemplate = false
      },
    },
    render() {
      console.log('aaa')
    }
  }
</script>

<style>
  .diagnose-class .cell{
    max-height: 3em;
    overflow-y: hidden;
  }
  .popper-class{
    width: 3em;
    max-width: 3em;
  }
</style>
