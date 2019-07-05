<template>
  <el-container class="medical-container">
    <el-aside width="230px" class="medical-asider">
      <div>
        <el-table
          highlight-current-row
          :data="patients"
          style="width: 100%"
          @row-click="onPatientClick"
        >
          <el-table-column
            label="待诊患者">
            <template slot-scope="{row}">
              <el-tag
                :type="row.status === '未看诊' ? 'primary' : 'success'"
                disable-transitions>{{row.status}}
              </el-tag>
              <el-tag
                type="primary" v-if="row.medicalRecord && row.medicalRecord.status == '已提交' "
                disable-transitions>已提交
              </el-tag>
              <el-tag
                type="danger" v-else
                disable-transitions>未提交
              </el-tag>
              <span style="margin-left: 0.7em;">{{row.patient_name}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div></div>
    </el-aside>
    <el-main v-if="medicalRecord && medicalRecord.id && medicalRecord.id != null">
      {{`正在看诊:${registrationInfo.patient_name}, 病历号${this.medicalRecord.id}`}}
      <el-button style="display: inline-block;" type="danger" size="mini" @click="endMedicalRecord">诊毕</el-button>
      <el-tabs v-model="activeIndex" @tab-click="handleClick">
        <el-tab-pane label="病历首页" name="0"></el-tab-pane>
        <el-tab-pane label="初步诊断" name="1"></el-tab-pane>
        <el-tab-pane label="检查" :disabled="medicalRecord.status != '已提交'" name="2"></el-tab-pane>
        <el-tab-pane label="检验" :disabled="medicalRecord.status != '已提交'" name="3"></el-tab-pane>
        <el-tab-pane label="门诊确诊" :disabled="medicalRecord.status != '已提交'" name="7"></el-tab-pane>
        <el-tab-pane label="处置" :disabled="medicalRecord.status != '已提交'" name="4"></el-tab-pane>
        <el-tab-pane label="成药处方" :disabled="medicalRecord.status != '已提交'" name="5"></el-tab-pane>
        <el-tab-pane label="草药处方" :disabled="medicalRecord.status != '已提交'" name="6"></el-tab-pane>
      </el-tabs>
      <div>
        <el-row>
          <el-col v-if="preview" :span="11">
            <medical-record-previewer
              @fresh="getMedicalRecordTemplateList"
              :medical-record.sync="medicalRecordPreview"
              :template="previewIsTemplate"
              @apply="applyPreview"
              @back="preview = false"/>
          </el-col>
          <el-col v-else :span="activeIndex > '4'? activeIndex == '7'? 11 : 6 : 11">
            <el-row @mouseenter.native="onTreeHover(0)">
              <el-input
                placeholder="模板搜索"
                v-model="templateName"
                v-if="activeIndex <= '7'"
              >
              </el-input>
              <div v-if="activeIndex=='0' || activeIndex == '1' || activeIndex == '7'">
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
              </div>
              <el-tree
                v-if="activeIndex > '1' && activeIndex < '7'"
                ref="tree2"
                :filter-node-method="filterNode"
                :data="templateClasses2"
                :props="defaultProps2"
                default-expand-all
                @node-click="handleNodeClick2"
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
                @row-click="onHistoryClick"
              >
                <el-table-column
                  :label="historyLabelArr[activeIndex]"
                  prop="name"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="diagnose"
                >
                </el-table-column>
                <el-table-column
                  prop="time"
                  align="center"
                >
                </el-table-column>
              </el-table>
            </el-row>
            <el-row v-if="activeIndex == '1' || activeIndex == '7'" style="overflow-y: hidden;"
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
            <el-row v-if="activeIndex > '1' && activeIndex < '5'">
              <exam-table
                :template-height.sync="templateHeight"
                @exam-click="onAddExam"
                :type="activeIndex - 2"
              ></exam-table>
            </el-row>
            <el-row v-if="activeIndex > '4' && activeIndex < '7'">
              <pres-table
                :template-height.sync="templateHeight"
                @exam-click="onAddPres"
                :type="activeIndex - 5"
              ></pres-table>
            </el-row>
          </el-col>
          <el-col :span="12" :offset="1">
            <el-row v-if="activeIndex=='0'">
              <div v-if="!creatingTemplate">
                <el-button type="danger" size="mini" @click="resetMedicalRecord" :disabled="hasSubmit">清空</el-button>
                <el-button type="primary" size="mini" @click="saveMedicalRecordTemplate">生成模板</el-button>
                <el-button type="primary" size="mini" @click="tempSave" :disabled="hasSubmit">暂存</el-button>
                <el-button type="success" size="mini" @click="onDiagnoseNext" :disabled="hasSubmit">提交</el-button>
              </div>
              <div v-else>
                <el-button type="success" size="mini" @click="saveMedicalRecordTemplate">提交模板</el-button>
                <el-button type="primary" size="mini" @click="backFromCreatingTemplate">返回</el-button>
              </div>
              <el-form v-if="activeIndex=='0'" ref="medicalRecordForm" style="margin-top: 1.2em;" :rules="rules"
                       :model="medicalRecord">
                <div v-if="creatingTemplate">
                  <el-form-item label="模板类型" prop="type">
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
          <el-col v-if="activeIndex == '1' || activeIndex=='7'" :span="12" :offset="1">
            <diagnose-edit
              :active-index="activeIndex"
              @tempSave="onDiagnoseTempSave"
              @next="next"
              @apply="applyDiagnoseTemplate"
              @back="isDiagnoseTemplate = false"
              :template.sync="isDiagnoseTemplate"
              :diagnose="isDiagnoseTemplate? diagnoseTemplate : diagnose"
              @update:diagnose="(e)=>{isDiagnoseTemplate? diagnoseTemplate = e : diagnose = e}"
              :has-submit="hasSubmit"
              @fresh="getDiagnoseTemplateList"
              @reset="resetDiagnose"
            ></diagnose-edit>
          </el-col>
          <el-col v-if="activeIndex>'1' && activeIndex<'5'" :span="12" :offset="1">
            <exam-edit
              :medical_record_id="medicalRecord.id"
              @apply="applyExamTemplate"
              @back="backFromExamPreview"
              :template.sync="isExamTemplate"
              :exam.sync="exam"
              :has-submit="hasSubmit"
              @fresh="getExamTemplateList(activeIndex - 2)"
              :type="activeIndex - 2"
            ></exam-edit>
          </el-col>
          <el-col v-if="activeIndex > '4' && activeIndex < '7'" :span="17" :offset="1">
            <pres-edit
              :medical_record_id="medicalRecord.id"
              @apply="applyPresTemplate"
              @back="backFromPresPreview"
              :template.sync="isPresTemplate"
              :pres.sync="pres"
              :has-submit="hasSubmit"
              @fresh="getPrescriptionTemplateList"
              :type="activeIndex - 5"
            ></pres-edit>
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
    confirmMedicalRecord,
    end
  } from '@/api/medicalRecord'
  import {getMedicalRecordTemplateList, create as createMedicalRecordTemplate} from '@/api/medicalRecordTemplate'
  import {list as getExamTemplateList} from '@/api/examTemplate'
  import {registrationByRecordId} from '@/api/outpationCharge'
  import MedicalRecordPreviewer from "./medical-record-previewer";
  import {getDisease} from '../../../src/api/disease-directorys'
  import DiagnoseEdit from "./components/diagnose-edit";
  import {update as updateDiagnose, submitEnd, getEndDiagnose} from '../../api/diagnose'
  import ExamTable from "./components/ExamTable";
  import ExamEdit from "./components/ExamEdit";
  import {create as createExam, update as updateExam, detail as detailExam} from '@/api/exam'
  import {list as listPresTemplateList, detail as detailPresTemplate} from '@/api/prescriptionTemplate'
  import PresTable from "./components/PresTable";
  import PresEdit from "./components/PresEdit";

  //TODO 分多页
  export default {
    name: 'medicalRecordIndex',
    components: {PresEdit, PresTable, ExamEdit, ExamTable, DiagnoseEdit, MedicalRecordPreviewer},
    data() {
      return {
        pres:{
          template_name:'处方模板',
          display_type:0,
          type: this.activeIndex - 5,
          medical_record_id:0,
          items:[]
        },
        savedPres:{},
        exam:{
          template_name:'检查模板',
          display_type:0,
          type:this.activeIndex - 2,
          medical_record_id:0,
          non_drug_id_list:[],
          nonDrugs:[]
        },
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
        prescriptionType: 0,
        previewIsTemplate: false,
        medicalRecordPreview: {},
        preview: false,
        templateName: '',
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
        templateClasses2:[
          {
            id: 'personal',
            template_name: '个人模板',
            children: []
          },
          {
            id: 'department',
            template_name: '科室模板',
            children: []
          },
          {
            id: 'hospital',
            template_name: '全院模板',
            children: []
          }
        ],
        defaultProps2:{
          children: 'children',
          label: 'template_name'
        },
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
        activeIndex: '0',
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
        isExamTemplate:false,
        savedExam:{},
        savedMedicalRecord:{},
        isPresTemplate:false
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
      onAddExam(exam){
        for(let i of this.exam.nonDrugs){
          if(i.id == exam.id){
            return
          }
        }
        this.exam.nonDrugs.unshift(exam)
      },
      onAddPres(data){
        for(let i of this.pres.items){
          if(i.drug.id == data.drug.id){
            return
          }
        }
        this.pres.items.push(data)
      },
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
      onDiagnoseNext(){
        console.log(this.medicalRecord)

        updateMedicalRecord(this.medicalRecord).then(res => {
           getMedicalRecord({medical_record_id: this.medicalRecord.id}).then(res=>{
             this.medicalRecord = res.data
             this.$notify({
               title: 'Success',
               message: '提交成功!',
               type: 'success',
               duration: 2000
             })
           })
        })
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
        let temp
        if(this.isDiagnoseTemplate){
          temp = this.diagnoseTemplate
        }else{
          temp = this.diagnose
        }
        if (!temp.western_diagnose.find(ele => ele.disease_id == id)
          && !temp.chinese_diagnose.find(ele => ele.disease_id == id)
        ) {
          if(classification_name == '中医疾病'){
            temp.chinese_diagnose.unshift({
              disease_name: name,
              disease_code: code,
              disease_id: id,
              main_symptom: false,
              suspect: true
            })
          }else{
            temp.western_diagnose.unshift({
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
          } else if(this.templateHeight == 5){
            this.templateHeight = 15
          }else{
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
      backFromExamPreview(){
        this.isExamTemplate = false
        let temp = JSON.parse(JSON.stringify(this.exam))
        this.exam = JSON.parse(JSON.stringify(this.savedExam))
        this.savedExam = temp
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
      applyExamTemplate(){
        this.isExamTemplate = false
        console.log("savedExam", this.savedExam)
        this.exam.id = this.savedExam.id
      },
      applyPresTemplate(){
        this.isPresTemplate = false
        this.pres.id = this.savedPres.id
      },
      onPatientClick(row) {
        this.activeIndex = '0'
        this.registrationInfo = row
        if(row.medicalRecord){
          this.medicalRecord = row.medicalRecord
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
        }else{
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
        }
        this.getAllHistoryMedicalRecord(row)
        this.getMedicalRecordTemplateList()
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
            this.diagnose = this.medicalRecord.diagnose
            this.creatingTemplate = false
            this.previewIsTemplate = false
            if (this.medicalRecord.status == '已提交') {
              this.hasSubmit = true
            } else {
              this.hasSubmit = false
            }
            break
          }
          case '2': {
            this.getExamTemplateList(0)
            this.preview = false
            this.creatingTemplate = false
            this.previewIsTemplate = false
            this.isExamTemplate = false
            break
          }
          case '3': {
            this.getExamTemplateList(1)
            this.preview = false
            this.creatingTemplate = false
            this.previewIsTemplate = false
            this.isExamTemplate = false
            break
          }
          case '4': {
            this.getExamTemplateList(2)
            this.preview = false
            this.creatingTemplate = false
            this.previewIsTemplate = false
            this.isExamTemplate = false
            break
          }
          case '5': {
            this.getPrescriptionTemplateList(0)
            this.preview = false
            this.creatingTemplate = false
            this.previewIsTemplate = false
            this.isExamTemplate = false
            break
          }
          case '6': {
            this.getPrescriptionTemplateList(1)
            this.preview = false
            this.creatingTemplate = false
            this.previewIsTemplate = false
            this.isExamTemplate = false
            break
          }
          case '7': {
            this.getDiagnoseTemplateList()
            this.preview = false
            this.creatingTemplate = false
            this.previewIsTemplate = false
            this.hasSubmit = false
            getEndDiagnose({medical_record_id:this.medicalRecord.id}).then(res=>this.diagnose = res.data)
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
      handleNodeClick2(data, node){
        if (data.id != 'personal' && data.id != 'department' && data.id != 'hospital') {
          if(this.activeIndex < 5){
            detailExam({exam_template_id:data.id}).then(res=>{
              console.log(this.exam)
              this.savedExam = JSON.parse(JSON.stringify(this.exam))
              this.isExamTemplate = true
              this.exam = this.templateToExam(res.data)
            })
          } else {
            detailPresTemplate({id:data.id}).then(res=>{
              this.isPresTemplate = true
              this.savedPres = JSON.parse(JSON.stringify(this.pres))
              this.pres = JSON.parse(JSON.stringify(res.data))
            })
          }
        }
      },
      backFromPresPreview(){
        this.isPresTemplate = false
        let temp = JSON.parse(JSON.stringify(this.pres))
        this.pres = JSON.parse(JSON.stringify(this.savedPres))
        this.savedPres = temp
      },
      async getList() {
        let {data} = await getPatientList()
        this.patients = data.waiting
        for (const i of data.pending) {
          if(i.status == '已看诊'){
            let res = await getMedicalRecord({medical_record_id: i.medical_record_id})
            i.medicalRecord = res.data
            this.patients.push(i)
          }else{
            this.patients.push(i)
          }
        }
      },
      next() {
        if(this.activeIndex == '1'){
            saveMedicalRecord(this.medicalRecord).then(res => {
              updateDiagnose({medical_record_id:this.medicalRecord.id, diagnose:this.diagnose}).then(res=>{
                this.hasSubmit = true
                this.$notify({
                  title: 'Success',
                  message: '提交成功!',
                  type: 'success',
                  duration: 2000
                })
                this.medicalRecord.status = '已提交'
                this.getList()
              })
            })
        } else{
          submitEnd({medical_record_id:this.medicalRecord.id, diagnose:this.diagnose}).then(res=>{
            // confirmMedicalRecord({id:this.medicalRecord.id}).then(res=>{
              this.$notify({
                title: 'Success',
                message: '提交成功!',
                type: 'success',
                duration: 2000
              })
            //   this.medicalRecord.status = '已诊毕'
            //   this.getList()
            //   this.medicalRecord = null
            //   this.activeIndex = '0'
            // })
          })
        }
      },
      endMedicalRecord(){
        confirmMedicalRecord({id:this.medicalRecord.id}).then(res=>{
          this.$notify({
            title: 'Success',
            message: '已诊毕!',
            type: 'success',
            duration: 2000
          })
          this.medicalRecord.status = '已诊毕'
          this.getList()
          this.medicalRecord = null
          this.activeIndex = '0'
        })
      },
      getExamTemplateList(type) {
        getExamTemplateList({type: type}).then(res => {
          this.templateClasses2[0].children = []
          this.templateClasses2[1].children = []
          this.templateClasses2[2].children = []
          for (const i of  res.data) {
            this.templateClasses2[i.display_type].children.push(i)
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
      templateToExam(res){
        let temp = {
          id : res.id,
          nonDrugs:[],
          medical_record_id:res.medical_record_id,
          template_name:res.template_name,
          display_type:res.display_type,
          type:res.type,
        }
        for(let i of res.exam_item){
          temp.nonDrugs.push(i.non_drug_item)
        }
        return temp
      },
      getPrescriptionTemplateList(type){
        listPresTemplateList({type:type?type:this.activeIndex - 5}).then(res=>{
          this.templateClasses2[0].children = []
          this.templateClasses2[1].children = []
          this.templateClasses2[2].children = []
          for (const i of  res.data) {
            this.templateClasses2[i.display_type].children.push(i)
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
    vertical-align: center;
  }

  .asider-item .cell:hover {
    padding-top: 0.7em;
    cursor: pointer;
  }

  .tree-class {
    overflow-y: scroll;
    transition: height ease .5s;
  }

  .asider-item .cell {
    padding-left: 4em;
    padding-top: 0.7em;
    /*border-bottom: 1px solid rgb(192, 192, 192);*/
    vertical-align: center;
    cursor: pointer;
  }

  .tree-class {
    overflow-y: scroll;
    transition: height ease .5s;
  }

  .disease-class .cell {
    cursor: pointer;
  }

  style-hr {
    border: 0;
    height: 1px;
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
  }

  .medical-container ::-webkit-scrollbar
  {
    width:8px;
    height:8px;
    background-color:#F5F5F5;
  }
  .medical-container ::-webkit-scrollbar-thumb{
    background-color:#D3D3D3;
    border-radius:4px;
  }
</style>
