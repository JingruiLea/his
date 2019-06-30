<template>
  <el-container class="medical-container">
    <el-aside width="230px" class="medical-asider">
      <div>
        <el-table
          stripe
          :data="patients"
          style="width: 100%"
          row-class-name="asider-item"
          @row-click="onPatientClick"
        >
          <el-table-column
            label="待诊患者">
            <template slot-scope="{row}" class="asider-item">
              <el-tag
                :type="row.status === '未看诊' ? 'primary' : 'success'"
                disable-transitions>{{row.status}}
              </el-tag>
              <span style="margin-left: 0.7em;">{{row.patient_name}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div></div>
    </el-aside>
    <el-main>
      <el-tabs v-model="activeIndex" @tab-click="handleClick">
        <el-tab-pane label="病历首页" name="0"></el-tab-pane>
        <el-tab-pane label="初步诊断" name="1"></el-tab-pane>
        <el-tab-pane label="检查检验" :disabled="medicalRecord.status != '已提交'" name="2"></el-tab-pane>
        <el-tab-pane label="处方开立" :disabled="medicalRecord.status != '已提交'" name="3"></el-tab-pane>
        <el-tab-pane label="门诊确诊" :disabled="medicalRecord.status != '已提交'" name="4"></el-tab-pane>
      </el-tabs>
      <div>
        <el-row>
          <el-col v-if="preview" :span="11">
            <medical-record-previewer
              :medical-record.sync="medicalRecordPreview"
              :template="previewIsTemplate"
              @apply="applyPreview"
              @back="preview = false"/>
          </el-col>
          <el-col v-else :span="11">
            <el-row @mouseenter.native="onTreeHover(0)">
              <el-input
                placeholder="模板搜索"
                v-model="templateName"
              >
              </el-input>
              <el-tree
                ref="tree"
                :filter-node-method="filterNode"
                :data="templateClasses"
                :props="defaultProps"
                default-expand-all
                @node-click="handleNodeClick"
                class="tree-class"
                :style="{
                  height: templateHeight + 'em',
                  }"
              ></el-tree>
            </el-row>
            <el-row v-if="activeIndex=='0'">
              <el-table
                v-if="activeIndex=='0'||activeIndex=='1'"
                stripe
                :data="historyMedicalRecord"
                style="width: 100%"
                row-class-name="asider-item"
                @row-click="onHistoryClick"
              >
                <el-table-column
                  :label="historyLabelArr[activeIndex]"
                  prop="name"
                >
                </el-table-column>
                <el-table-column

                  prop="diagnose"
                >
                </el-table-column>
                <el-table-column
                  prop="time"
                >
                </el-table-column>
              </el-table>
            </el-row>
            <el-row v-if="activeIndex=='1'" style="overflow-y: hidden;"
                    :style="{maxHeight:`calc(100vh - 180px - ${templateHeight}em`}">
              <el-col :span="12">
                <el-table
                  @row-click="onDiseaseClassClick"
                  @mouseup.native.stop="()=>{}"
                  class="disease-class"
                  :height="`calc(100vh - 180px - ${templateHeight}em`"
                  :data="filtedDiseaseClassifications"
                  :style="{maxHeight:`calc(100vh - 120px - ${templateHeight}em` }"
                >
                  <el-table-column
                    prop="name"
                    align="center"
                  >
                    <template slot="header" slot-scope="scope">
                      <el-input
                        v-model="diagnoseQuery.class"
                        size="mini"
                        placeholder="类别查询"
                        @focus="templateHeight = 5"
                      ></el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="12">
                <el-table
                  class="disease-class"
                  style="overflow-y: hidden;"
                  @mouseup.native.stop="()=>{}"
                  :height="`calc(100vh - 180px - ${templateHeight}em`"
                  :data="filtedDisease"
                  :style="{maxHeight:`calc(100vh - 120px - ${templateHeight}em` }"
                  @row-click="onDiseaseClick"
                >
                  <el-table-column
                    prop="name"
                  >
                    <template slot="header" slot-scope="scope">
                      <el-input
                        v-model="diagnoseQuery.name"
                        size="mini"
                        @focus="templateHeight = 5"
                        placeholder="名称查询"/>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <el-row v-if="activeIndex=='2'">
              <exam-table
                :template-height="templateHeight"
              ></exam-table>
            </el-row>
          </el-col>
          <el-col :span="12" :offset="1">
            <el-row v-if="activeIndex=='0'">
              <div v-if="!creatingTemplate">
                <el-button type="danger" size="mini" @click="resetMedicalRecord" :disabled="hasSubmit">清空</el-button>
                <el-button type="primary" size="mini" @click="saveMedicalRecordTemplate">生成模板</el-button>
                <el-button type="primary" size="mini" @click="tempSave" :disabled="hasSubmit">暂存</el-button>
                <el-button type="success" size="mini" @click="next" :disabled="hasSubmit">提交</el-button>
              </div>
              <div v-else>
                <el-button type="success" size="mini" @click="saveMedicalRecordTemplate">提交模板</el-button>
                <el-button type="primary" size="mini" @click="backFromCreatingTemplate">返回</el-button>
              </div>
              <el-form v-if="activeIndex=='0'" ref="medicalRecordForm" style="margin-top: 1.2em;" :rules="rules"
                       :model="medicalRecord">
                <div v-if="creatingTemplate">
                  <el-form-item label="模板类型" prop="title">
                    <el-select v-model="medicalRecord.type" placeholder="type"
                               class="filter-item">
                      <el-option v-for="item,index in [['个人',0],['科室',1],['全院',2]]" :key="index" :label="item[0]"
                                 :value="item[1]"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="模板名称" prop="title">
                    <el-input :readonly="hasSubmit" type="text" v-model="medicalRecord.title"></el-input>
                  </el-form-item>
                </div>
                <el-form-item label="主诉" prop="chief_complaint">
                  <el-input :readonly="hasSubmit" type="textarea" v-model="medicalRecord.chief_complaint"></el-input>
                </el-form-item>
                <el-form-item label="体格检查" prop="physical_examination">
                  <el-input :readonly="hasSubmit" type="textarea"
                            v-model="medicalRecord.physical_examination"></el-input>
                </el-form-item>
                <el-form-item label="过敏史" prop="allergy_history">
                  <el-input :readonly="hasSubmit" type="textarea" v-model="medicalRecord.allergy_history"></el-input>
                </el-form-item>
                <el-form-item label="既往史" prop="past_history">
                  <el-input :readonly="hasSubmit" type="textarea" v-model="medicalRecord.past_history"></el-input>
                </el-form-item>
                <el-form-item label="现病史" prop="current_medical_history">
                  <el-input :readonly="hasSubmit" type="textarea"
                            v-model="medicalRecord.current_medical_history"></el-input>
                </el-form-item>
                <el-form-item label="现病治疗情况" prop="current_treatment_situation">
                  <el-input :readonly="hasSubmit" type="textarea"
                            v-model="medicalRecord.current_treatment_situation"></el-input>
                </el-form-item>
              </el-form>
            </el-row>
          </el-col>
          <el-col v-if="activeIndex == '1'" :span="12" :offset="1">
            <diagnose-edit
              @tempSave="onDiagnoseTempSave"
              @next="onDiagnoseNext"
              @apply="applyDiagnoseTemplate"
              @back="isDiagnoseTemplate = false"
              :template.sync="isDiagnoseTemplate"
              :diagnose="isDiagnoseTemplate? diagnoseTemplate : diagnose"
              @update:diagnose="(e)=>{diagnose = e}"
              :has-submit="hasSubmit"
              @fresh="getDiagnoseTemplateList"
              @reset="resetDiagnose"
            ></diagnose-edit>
          </el-col>
        </el-row>

      </div>
    </el-main>
  </el-container>
</template>

<script>
  import bus from '@/bus'
  import {list as diagnoseTemplateList} from '@/api/diagnoseTemplate'
  import {
    getPatientList,
    getMedicalRecord,
    allHistoryMedicalRecord,
    updateMedicalRecord,
    saveMedicalRecord,
    confirmMedicalRecord
  } from '@/api/medicalRecord'
  import {getMedicalRecordTemplateList, create as createMedicalRecordTemplate} from '@/api/medicalRecordTemplate'
  import {list as getExamTemplateList} from '@/api/examTemplate'
  import {registrationByRecordId} from '@/api/outpationCharge'
  import MedicalRecordPreviewer from "./medical-record-previewer";
  import {getDisease} from '../../../src/api/disease-directorys'
  import DiagnoseEdit from "./components/diagnose-edit";
  import {update as updateDiagnose} from '@/api/diagnose'
  import ExamTable from "./components/ExamTable";


  //TODO 分多页
  export default {
    name: 'medicalRecordIndex',
    components: {ExamTable, DiagnoseEdit, MedicalRecordPreviewer},
    data() {
      return {
        diagnose: {
          western_diagnose: [],
          chinese_diagnose: [],
          title: '诊断模板',
          type: 0
        },
        inInput: false,
        diagnoseQuery: {
          class: '',
          name: ''
        },
        templateHeight: '15',
        historyLabelArr: {
          '0': '历史病历',
          '1': '历史诊断'
        },
        previewIsTemplate: false,
        medicalRecordPreview: {},
        preview: false,
        templateName: '王静怡修改滚动条',
        creatingTemplate: false,
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        templateClasses: [
          {
            id: 'personal',
            title: '个人模板',
            children: []
          },
          {
            id: 'department',
            title: '科室模板',
            children: []
          },
          {
            id: 'hospital',
            title: '全院模板',
            children: []
          }
        ],
        medicalTempClasses: [
          {
            id: 'personal',
            title: '个人模板',
            children: []
          },
          {
            id: 'department',
            title: '科室模板',
            children: []
          },
          {
            id: 'hospital',
            title: '全院模板',
            children: []
          }
        ],
        templateList: {
          personal: [],
          department: [],
          hospital: []
        },
        hasSubmit: false,
        rules: {
          title: [{required: true, message: '请填写', trigger: 'change'}],
          chief_complaint: [{required: true, message: '请填写', trigger: 'change'}],
          physical_examination: [{required: true, message: '请填写', trigger: 'change'}],
          allergy_history: [{required: true, message: '请填写', trigger: 'change'}],
          past_history: [{required: true, message: '请填写', trigger: 'change'}],
          current_medical_history: [{required: true, message: '请填写', trigger: 'change'}],
          current_treatment_situation: [{required: true, message: '请填写', trigger: 'change'}]
        },
        activeIndex: '2',
        tableRowClassName: "table-row",
        patients: [],
        medicalRecord: {
          type: 0,
          title: '默认模板',
          allergy_history: "过敏史",
          chief_complaint: "主诉",
          current_medical_history: "现在病",
          current_treatment_situation: "现在治疗",
          physical_examination: '检查身体',
          past_history: '过去历史',
          status: '已提交'
        },
        search: '',
        historyMedicalRecord: [],
        registrationInfo: {},
        diseases: [],
        diagnoseTemplate: {
          western_diagnose: [],
          chinese_diagnose: [],
          title: '诊断模板',
          type: 0
        },
        isDiagnoseTemplate: false,
        savedMedicalRecord:{}
      }
    },
    computed: {
      filtedDiseaseClassifications() {
        let tempList = bus.diseaseClassifications
        if (this.diagnoseQuery.class) {
          tempList = tempList.filter(ele => {
            return ele.name.includes(this.diagnoseQuery.class)
          })
        }
        return tempList
      },
      filtedDisease() {
        let tempList = this.diseases
        if (this.diagnoseQuery.name) {
          tempList = tempList.filter(ele => {
            return ele.name.includes(this.diagnoseQuery.name)
          })
        }
        return tempList
      }
    },
    watch: {
      templateName(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      onDiagnoseTempSave(diagnose){
        console.log(this.medicalRecord)
        updateDiagnose({medical_record_id:this.medicalRecord.id, diagnose:diagnose}).then(res=>{
          this.$notify({
            title: 'Success',
            message: '暂存成功!',
            type: 'success',
            duration: 2000
          })
        })
      },
      applyDiagnoseTemplate(){
        this.diagnoseTemplate.western_diagnose.forEach(ele=>{
          this.diagnose.western_diagnose.push(ele)
        })
        this.diagnoseTemplate.chinese_diagnose.forEach(ele=>{
          this.diagnose.chinese_diagnose.push(ele)
        })
      },
      onDiagnoseNext(diagnose){
        console.log(this.medicalRecord)
        updateDiagnose({medical_record_id:this.medicalRecord.id, diagnose:diagnose}).then(res=>{
          this.$notify({
            title: 'Success',
            message: '提交成功!',
            type: 'success',
            duration: 2000
          })
        })
        this.activeIndex = '2'
      },
      resetDiagnose(){
        this.diagnose = {
          western_diagnose: [],
          chinese_diagnose: [],
          title: '诊断模板',
          type: 0
        }
        this.isDiagnoseTemplate = false
      },
      onDiseaseClick(row) {
        console.log(row)
        let {code, name, id, classification_name} = row
        if (!this.diagnose.western_diagnose.find(ele => ele.disease_id == id)
          && !this.diagnose.chinese_diagnose.find(ele => ele.disease_id == id)
        ) {
          if(classification_name == '中医疾病'){
            this.diagnose.chinese_diagnose.unshift({
              disease_name: name,
              disease_code: code,
              disease_id: id,
              main_symptom: false,
              suspect: true
            })
          }else{
            this.diagnose.western_diagnose.unshift({
              disease_name: name,
              disease_code: code,
              disease_id: id,
              main_symptom: false,
              suspect: true
            })
          }
        }
      },
      onDiseaseClassClick(row) {
        getDisease({classification_id: row.id}).then(res => {
          this.diseases = res.data.diseases
        })
      },
      onTreeHover(type, input) {
        if (type == 0) {
          if (this.templateHeight == 25) {
            this.templateHeight = 15
          } else {
            this.templateHeight = 25
          }
        } else {
          if (this.templateHeight == 5)
            this.templateHeight = 15
          else
            this.templateHeight = 5
        }
      },
      tempSave() {
        updateMedicalRecord(this.medicalRecord).then(res => {
          this.$notify({
            title: 'Success',
            message: '暂存成功!',
            type: 'success',
            duration: 2000
          })
        })
      },
      applyPreview() {
        this.medicalRecordPreview.id = this.medicalRecord.id
        this.medicalRecord = Object.assign({}, this.medicalRecordPreview)
        this.$notify({
          title: 'Success',
          message: '应用成功!',
          type: 'success',
          duration: 2000
        })
        this.preview = false
      },
      onHistoryClick(row) {
        this.preview = true
        this.previewIsTemplate = false
        this.medicalRecordPreview = row.medicalRecord
        if(this.$refs['medicalRecordForm'])
          this.$refs['medicalRecordForm'].clearValidate()
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      backFromCreatingTemplate() {
        this.creatingTemplate = false
        if (this.medicalRecord.status == '已提交') {
          this.medicalRecord = JSON.parse(JSON.stringify(this.savedMedicalRecord))
          this.hasSubmit = true
        } else {
          this.hasSubmit = false
        }
      },
      saveMedicalRecordTemplate() {
        if (!this.creatingTemplate) {
          this.creatingTemplate = true
          if(this.hasSubmit){
            this.savedMedicalRecord = JSON.parse(JSON.stringify(this.medicalRecord))
          }
          this.hasSubmit = false
          return
        }
        createMedicalRecordTemplate(this.medicalRecord).then(res => {
          this.$notify({
            title: 'Success',
            message: 'Created Successfully',
            type: 'success',
            duration: 2000
          })
          if (this.medicalRecord.status == '已提交') {
            this.hasSubmit = true
            this.medicalRecord = JSON.parse(JSON.stringify(this.savedMedicalRecord))
          } else {
            this.hasSubmit = false
          }
          this.creatingTemplate = false
          this.getMedicalRecordTemplateList()
        })
      },
      resetMedicalRecord() {
        this.medicalRecord =
          {
            type: 0,
            title: '默认模板',
            allergy_history: "过敏史",
            chief_complaint: "主诉",
            current_medical_history: "现在病",
            current_treatment_situation: "现在治疗",
            physical_examination: '检查身体',
            past_history: '过去历史'
          }
      },
      onPatientClick(row) {
        this.registrationInfo = row
        getMedicalRecord({medical_record_id: row.medical_record_id}).then(res => {
          this.medicalRecord = res.data
          if (row.status = "未看诊") {
            row.status = '已看诊'
          }
          if (this.medicalRecord.status == '已提交') {
            this.hasSubmit = true
          } else {
            this.hasSubmit = false
          }
          this.getList()
          this.diagnose = this.medicalRecord.diagnose
          this.$nextTick(() => {
            if(this.$refs['medicalRecordForm'])
              this.$refs['medicalRecordForm'].clearValidate()
          })

        })
        this.getAllHistoryMedicalRecord(row)
      },
      goBack() {

      },
      handleClick() {
        console.log(`切换TAB${this.activeIndex}`)
        switch (this.activeIndex) {
          case "0": {
            this.getMedicalRecordTemplateList()
            this.preview = false
            this.creatingTemplate = false
            this.previewIsTemplate = false
            if (this.medicalRecord.status == '已提交') {
              this.hasSubmit = true
            } else {
              this.hasSubmit = false
            }
            break
          }
          case '1': {
            this.getDiagnoseTemplateList()
            this.preview = false
            this.creatingTemplate = false
            this.previewIsTemplate = false

            break
          }
          case '2': {
            this.getExamTemplateList()
            this.preview = false
            this.creatingTemplate = false
            this.previewIsTemplate = false
            break
          }
          case '3': {
            this.getDiagnoseTemplateList()
            this.preview = false
            this.creatingTemplate = false
            this.previewIsTemplate = false
            break
          }
        }
      },
      handleNodeClick(data, node) {
        console.log(node)
        if (data.id != 'personal' && data.id != 'department' && data.id != 'hospital') {
          if(this.activeIndex == '0'){
            const template = node.data
            this.medicalRecordPreview = template
            this.previewIsTemplate = true
            this.preview = true
          }else{
            this.diagnoseTemplate = data
            this.isDiagnoseTemplate = true
          }
        }
      },
      getList() {
        getPatientList().then(res => {
          this.patients = res.data.waiting
          for (const i of res.data.pending) {
            this.patients.unshift(i)
          }
        })
      },
      next() {
        this.$refs['medicalRecordForm'].validate((valid) => {
          if (valid) {
            saveMedicalRecord(this.medicalRecord).then(res => {
              this.hasSubmit = true
              this.$notify({
                title: 'Success',
                message: '提交成功!',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            this.$notify({
              title: 'Error',
              message: '填写有误!',
              type: 'error',
              duration: 2000
            })
          }
        })
      },
      getExamTemplateList() {
        getExamTemplateList({type: 0}).then(res => {
          this.templateClasses[0].children = []
          this.templateList = res.data
          for (const i of  this.templateList.personal) {
            this.templateClasses[0].children.push(i)
          }
        })
        getExamTemplateList({type: 1}).then(res => {
          this.templateClasses[1].children = []
          this.templateList = res.data
          for (const i of  this.templateList.personal) {
            this.templateClasses[1].children.push(i)
          }
        })
        getExamTemplateList({type: 2}).then(res => {
          this.templateClasses[2].children = []
          this.templateList = res.data
          for (const i of  this.templateList.personal) {
            this.templateClasses[2].children.push(i)
          }
        })
      },
      getDiagnoseTemplateList() {
        diagnoseTemplateList().then(res => {
          this.templateClasses[0].children = []
          this.templateClasses[1].children = []
          this.templateClasses[2].children = []
          this.templateList = res.data
          let personalClass = this.templateClasses[0].children
          let departmentClass = this.templateClasses[1].children
          let hospitalClass = this.templateClasses[2].children
          for (const i of  this.templateList.personal) {
            personalClass.push(i)
          }
          for (const i of  this.templateList.department) {
            departmentClass.push(i)
          }
          for (const i of  this.templateList.hospital) {
            hospitalClass.push(i)
          }
        })
      },
      getMedicalRecordTemplateList() {
        getMedicalRecordTemplateList().then(res => {
          this.templateClasses[0].children = []
          this.templateClasses[1].children = []
          this.templateClasses[2].children = []
          this.templateList = res.data
          let personalClass = this.templateClasses[0].children
          let departmentClass = this.templateClasses[1].children
          let hospitalClass = this.templateClasses[2].children
          for (const i of  this.templateList.personal) {
            personalClass.push(i)
          }
          for (const i of  this.templateList.department) {
            departmentClass.push(i)
          }
          for (const i of  this.templateList.hospital) {
            hospitalClass.push(i)
          }
        })
      },
      getAllHistoryMedicalRecord(registrationInfo) {
        let req = {}
        if (registrationInfo.id_number) {
          req.type = 'id'
          req.medical_certificate_number = registrationInfo.id_number
        } else {
          req.type = 'mid'
          req.medical_certificate_number = registrationInfo.medical_certificate_number
        }
        allHistoryMedicalRecord(req).then(res => {
          this.historyMedicalRecord = []
          const history = []
          res.data.forEach(ele => {
            registrationByRecordId({medical_record_id: ele.id}).then(res => {
              let registration = res.data
              history.push(
                {
                  name: registration.patient_name,
                  time: '日期:' + ele.create_time.substring(0, 10),
                  diagnose: '诊断为:' + bus.getMainDiagnose(ele),
                  medicalRecord: ele
                }
              )
              this.historyMedicalRecord = history
            })
          })

        })
      }
    },

    created() {
      this.getList()
      this.handleClick()
    },

  }
</script>

<style>
  .medical-container {
    padding: 0;
    height: 100%;
    min-height: 100%;
    position: relative;
    left: 0;
    top: 0;
    bottom: 0;
  }

  .medical-asider {
    background: inherit;
    border-right: 1px rgb(192, 192, 192) solid;
    height: calc(100vh - 70px);
    margin-bottom: 0;
    padding: 0 !important;
  }

  .asider-item {
    text-align: center;
    padding-top: 0.7em;
    /*border-bottom: 1px solid rgb(192, 192, 192);*/
    vertical-align: center;
  }

  .asider-item:hover {
    text-align: center;
    padding-top: 0.7em;
    /*border-bottom: 1px solid rgb(192, 192, 192);*/
    vertical-align: center;
    cursor: pointer;
  }

  .tree-class {
    overflow-y: scroll;
    transition: height ease .5s;
  }

  .asider-item .cell {
    text-align: center;
  }

  .disease-class .cell {
    cursor: pointer;
  }

  style-hr {
    border: 0;
    height: 1px;
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
  }
</style>
