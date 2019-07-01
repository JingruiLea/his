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
            <el-select v-model="pres.display_type" placeholder="type"
                       class="filter-item">
              <el-option v-for="item,index in [['个人',0],['科室',1],['全院',2]]" :key="index" :label="item[0]"
                         :value="item[1]"/>
            </el-select>
          </el-form-item>
          <el-form-item label="模板名称" prop="title">
            <el-input type="text" v-model="pres.template_name"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <el-table
        :data="pres.items"
        row-class-name="diagnose-class"
      >
        <el-table-column
          label="编码"
          prop="code"
        >
          <template slot-scope="{row}">
            <span>{{row.drug.code}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
        >
          <template slot-scope="{row}">
            <el-tooltip effect="dark" popper-class="popper-class" :content="row.drug.name" placement="top-start">
              <span>{{row.drug.name}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="费用"
          prop="price"
        >
          <template slot-scope="{row}">
            <span>{{row.drug.price}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          prop="price"
        >
          <template slot-scope="{row}">
            <el-input v-model="row.amount"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="Actions"
          label="操作"
        >
          <template slot-scope="{row}">
            <el-button type="danger" @click="remove(row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>

  import {all as allPres, create as createPres, detail as detailPres, update, submit} from '../../../api/prescription'
  import {create as createTemplate , update as updateTemplate} from '@/api/prescriptionTemplate'
  export default {
    name:'PresEdit',
    props:['pres', 'type', 'hasSubmit', 'template','medical_record_id'],
    data(){
      return {
        creatingTemplate: false,
        savedExam: {},
        initItem :{
          drug:{},
          id:'',
          note:'',
          usage:'',
          dosage:'',
          frequency:0,
          day_count:0,
          times:0,
          amount:'',
          prescription_id:'',
          drug_id:'',
          status:'',
        },
        initPres :{
          medical_record_id:this.medical_record_id,
          items: [
          ],
          id:this.pres.id,
          template_name:this.pres.template_name?this.pres.template_name:'未命名',
          display_type:this.pres.display_type?this.pres.template_name:0,
          type:this.type
        }
      }
    },
    watch:{
      type(){
        this.getPres()
      }
    },
    methods:{
      remove(row) {
        this.pres.items = this.pres.items.filter(i=>i.drug.id!=row.drug.id)
      },
      reset(){
        let temp = JSON.parse(JSON.stringify(this.pres))
        temp.items = []
        this.$emit('update:pres', temp)
      },
      saveAsTemplate(){
        this.creatingTemplate = true
        this.savedExam = JSON.parse(JSON.stringify(this.pres))
      },
      tempSave(){
        update(this.examToSubmit()).then(res=>{
          this.$notify({
            title: 'Success',
            message: '暂存成功!',
            type: 'success',
            duration: 2000
          })
        })
      },
      next(){
        update(this.examToSubmit()).then(res=>{
          submit({id:[this.pres.id]}).then(res=>{
            this.$notify({
              title: 'Success',
              message: '提交成功!',
              type: 'success',
              duration: 2000
            })
          })
        })
      },
      back(){
        this.$emit('back')
      },
      examToSubmit(){
        let res = JSON.parse(JSON.stringify(this.pres))
        res.drug_id_list  = res.items
        for(let i of res.items){
          i.drug_id = i.drug.id
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
        this.creatingTemplate = false
      },
      applyTemplate(){
        this.$notify({
          title: 'Success',
          message: '应用模板成功!',
          type: 'success',
          duration: 2000
        })
        this.$emit('apply')
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
      templateToExam(data){
        let temp = JSON.parse(JSON.stringify(data))
        temp.nonDrugs = []
        for(let i of data.exam_item){
          temp.nonDrugs.push(i.drug_id_list)
        }
        return temp
      },
      getPres(){
        allPres({
          medical_record_id:this.medical_record_id,
          type:this.type
        }).then(res0=>{
          if(res0.data.length > 0){
            detailPres({
              prescription_id: res0.data[0].id
            }).then(res1=>{
              this.$emit('update:pres', res1.data)
            })
          }else{
            createPres({
              drug_id_list:[],
              medical_record_id:this.medical_record_id,
              type:this.type
            }).then(res2=>{
              let temp = JSON.parse(JSON.stringify(this.pres))
              temp.id = res2.id
              detailPres({
                prescription_id:res2.data.id
              }).then(res3=>{
                this.$emit('update:pres', res3.data)
              })
            })
          }
        })
      }
    },
    created() {
      if(this.medical_record_id){
        this.getPres()
      }
    },

  }
</script>
