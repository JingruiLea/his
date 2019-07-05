<template>
  <el-row class="medical-container">
    <el-col :span="8">
      <el-tree
        @mouseenter.native="onTreeHover(0)"
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
      <pres-table
        :template-height.sync="templateHeight"
        @exam-click="onAddPres"
        :type="0"
      >
      </pres-table>
    </el-col>
    <el-col :span="16">
      <pres-edit
        :medical_record_id="medical_record_id"
        @apply="applyPresTemplate"
        @back="backFromPresPreview"
        :template.sync="isPresTemplate"
        :pres.sync="pres"
        :has-submit="hasSubmit"
        @fresh="getPrescriptionTemplateList"
        :type="2"
      ></pres-edit>
    </el-col>
  </el-row>
</template>
<script>
  import PresTable from "./PresTable";
  import PresEdit from "./PresEdit";
  import {list as listPresTemplateList, detail as detailPresTemplate} from '@/api/prescriptionTemplate'

  export default {
    name:'ExamRegEdit',
    components: {PresEdit, PresTable},
    props:{
      medical_record_id:{}
    },
    data(){
      return{
        isPresTemplate:false,
        savedPres:{},
        pres:{},
        hasSubmit:false,
        templateHeight: 12,
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
      }
    },
    methods: {
      getPrescriptionTemplateList(type) {
        listPresTemplateList({type: type}).then(res => {
          this.templateClasses2[0].children = []
          this.templateClasses2[1].children = []
          this.templateClasses2[2].children = []
          for (const i of  res.data) {
            this.templateClasses2[i.display_type].children.push(i)
          }
        })
      },
      onAddPres(data){
        for(let i of this.pres.items){
          if(i.drug.id == data.drug.id){
            return
          }
        }
        this.pres.items.push(data)
      },
      backFromPresPreview(){
        this.isPresTemplate = false
        let temp = JSON.parse(JSON.stringify(this.pres))
        this.pres = JSON.parse(JSON.stringify(this.savedPres))
        this.savedPres = temp
      },
      applyPresTemplate(){
        this.isPresTemplate = false
        this.pres.id = this.savedPres.id
      },
      handleNodeClick2(data, node) {
        if (data.id != 'personal' && data.id != 'department' && data.id != 'hospital') {
          detailPresTemplate({id: data.id}).then(res => {
            this.isPresTemplate = true
            this.savedPres = JSON.parse(JSON.stringify(this.pres))
            this.pres = JSON.parse(JSON.stringify(res.data))
          })
        }
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
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
    },
    created() {
      this.getPrescriptionTemplateList(2)
    }
  }
</script>


<style>
  .tree-class {
    overflow-y: scroll;
    transition: height ease .5s;
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
