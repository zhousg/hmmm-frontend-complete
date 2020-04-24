<template>
  <div class="app-container question-new">
    <el-card>
      <el-form ref="form" :model="qsForm" :rules="qsRules" label-width="120px">
        <!-- 学科 选择器-->
        <el-form-item label="学科：" prop="subjectID">
          <el-select v-model="qsForm.subjectID" style="width:400px">
            <el-option v-for="item in subjectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- 目录 选择器-->
        <el-form-item label="目录：" prop="catalogID">
          <el-select v-model="qsForm.catalogID"  style="width:400px">
            <el-option v-for="item in catalogOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- 企业 选择器-->
        <el-form-item label="企业：" prop="enterpriseID">
          <el-select v-model="qsForm.enterpriseID"  style="width:400px">
            <el-option v-for="item in enterpriseOptions" :key="item.id" :label="item.company" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- 城市 （市，地区）选择器  级联（选项与选项之间有从属关系）-->
        <el-form-item label="城市：" prop="city">
          <el-select v-model="qsForm.province" @change="getAreaOptions" style="width:198px">
            <el-option v-for="item in cityOptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-select v-model="qsForm.city" style="width:198px;margin-left:4px">
            <el-option v-for="item in areaOptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <!-- 方向 常量（不会改变值得变量） 选择器-->
        <el-form-item label="方向：" prop="direction">
          <el-select v-model="qsForm.direction" style="width:400px">
            <el-option v-for="item in directionOptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <!-- 题型 单选框-->
         <el-form-item label="题型：" prop="questionType">
            <el-radio-group @change="changeRadio({})" v-model="qsForm.questionType">
              <el-radio v-for="item in questionType" :key="item.value" :label="item.value+''">{{item.label}}</el-radio>
            </el-radio-group>
         </el-form-item>
        <!-- 难度 单选框-->
        <el-form-item label="难度：" prop="difficulty">
            <el-radio-group v-model="qsForm.difficulty">
              <el-radio v-for="item in difficulty" :key="item.value" :label="item.value+''">{{item.label}}</el-radio>
            </el-radio-group>
         </el-form-item>
        <!-- 题干  富文本 -->
        <el-form-item label="题干：" prop="question">
           <quill-editor @blur="checkQustion" v-model="qsForm.question" :options="editorOptions"></quill-editor>
        </el-form-item>
        <!-- 选项 需要分情况和试题类型关联-->
        <el-form-item label="选项：" prop="options" v-if="qsForm.questionType!=='3'">
          <div class="option_item" v-for="item in qsForm.options" :key="item.code">
            <el-radio v-if="qsForm.questionType==='1'" @change="changeRadio(item)" v-model="item.isRight" style="margin-right:0" :label="true">{{item.code}}：</el-radio>
            <el-checkbox v-if="qsForm.questionType==='2'" v-model="item.isRight" style="margin-right:0" :label="true">{{item.code}}：</el-checkbox>
            <el-input v-model="item.title" style="width:240px"></el-input>
            <!-- action="http://127.0.0.1:7001/frame/file" -->
            <el-upload
              style="margin-left:4px"
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :headers="{'Authorization':'Bearer '+ token}"
              :on-success="(res,file)=>{uploadSuccess(item,res,file)}"
              :show-file-list="false">
              <img v-if="item.img" :src="item.img" class="avatar">
              <span v-else>上传图片</span>
              <i class="el-icon-circle-close"></i>
            </el-upload>
          </div>
          <!-- 添加按钮 -->
          <el-button type="danger" @click="addOption" size="small">+增加选项与答案</el-button>
        </el-form-item>
        <!-- 解析视频 输入框-->
        <el-form-item label="解析视频：">
          <el-input v-model="qsForm.videoURL" style="width:400px"></el-input>
        </el-form-item>
        <!-- 答案解析  富文本 -->
        <el-form-item label="答案解析：" prop="question">
           <quill-editor v-model="qsForm.answer" :options="editorOptions"></quill-editor>
        </el-form-item>
        <!-- 题目备注 文本域-->
        <el-form-item label="题目备注：">
          <el-input type="textarea" :rows="4" v-model="qsForm.remarks" style="width:400px"></el-input>
        </el-form-item>
        <!-- 试题标签 输入框-->
        <el-form-item label="试题标签：">
          <el-input v-model="qsForm.tags" style="width:400px"></el-input>
        </el-form-item>
        <!-- 提交按钮-->
        <el-form-item>
          <el-button @click="submit()" type="primary">提交</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { simple as getSubjectOptions } from '@/api/hmmm/subjects'
import { simple as getCatalogOptions } from '@/api/hmmm/directorys'
import { list as getCompanyOptions } from '@/api/hmmm/companys'
import { provinces as getCityOptions, citys as getAreaOptions } from '@/api/hmmm/citys'
import { direction, questionType, difficulty } from '@/api/hmmm/constants'
import { add } from '@/api/hmmm/questions'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'

import { getToken } from '@/utils/auth'

export default {
  components: {
    quillEditor
  },
  data () {
    return {
      token: getToken(),
      // 富文本配置
      // 1. 使用 highlight.js 插件处理高亮
      // 2. 安装  npm i highlight.js
      // 3. 导入  代码语法风格的样式   转换文本插件
      // 4. 配置 富文本  实时输入的时候高亮效果
      editorOptions: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote'],
            ['code-block', 'image', 'link']
          ],
          // 语法高亮
          syntax: {
            highlight: text => hljs.highlightAuto(text).value
          }
        }
      },
      // 试题对象
      qsForm: {
        subjectID: null,
        catalogID: null,
        enterpriseID: null,
        // 城市
        province: null,
        // 地区
        city: null,
        // 方向
        direction: null,
        // 题型
        questionType: '1',
        // 难度
        difficulty: '1',
        // 题干
        question: null,
        // 选项
        options: [
          { isRight: false, code: 'A', title: '', img: '' },
          { isRight: false, code: 'B', title: '', img: '' },
          { isRight: false, code: 'C', title: '', img: '' },
          { isRight: false, code: 'D', title: '', img: '' }
        ]
      },
      // 校验规则
      qsRules: {
        subjectID: [
          { required: true, message: '请选择学科', trigger: 'change' }
        ],
        catalogID: [
          { required: true, message: '请选择目录', trigger: 'change' }
        ],
        enterpriseID: [
          { required: true, message: '请选择企业', trigger: 'change' }
        ],
        city: [
          { required: true, message: '请选择地区', trigger: 'change' }
        ],
        direction: [
          { required: true, message: '请选择方向', trigger: 'change' }
        ],
        questionType: [
          { required: true, message: '请选择题型', trigger: 'change' }
        ],
        difficulty: [
          { required: true, message: '请选择难度', trigger: 'change' }
        ],
        question: [
          // quill不是element-ui的组件，失去焦点后监听不到，无法触发校验行为。
          // 自己去监听  富文本 失去焦点事件  自己去调用校验逻辑。
          { required: true, message: '请输入题干', trigger: 'blur' }
        ],
        options: [
          { required: true, message: '请输入选项', trigger: 'blur' }
        ]
      },
      // 学科选项
      subjectOptions: [],
      // 目录选项
      catalogOptions: [],
      // 企业选项
      enterpriseOptions: [],
      // 城市选项
      cityOptions: getCityOptions(),
      // 地区选项
      areaOptions: [],
      // 方向选项
      directionOptions: direction,
      // 题型
      questionType,
      // 难度
      difficulty
    }
  },
  created () {
    this.getSubjectOptions()
    this.getCatalogOptions()
    this.getCompanyOptions()
  },
  methods: {
    // 提交
    submit () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await add(this.qsForm)
          this.$message.success('添加成功')
          this.$router.push('/questions/list')
        }
      })
    },
    // 上传成功
    // uploadSuccess 不带括号  接收默认参数
    // uploadSuccess 带了括号  接收自己传入参数
    uploadSuccess (item, res, file) {
      // res 是相应对象
      // file 选择后的文件对象   file.raw 原始文件对象
      // URL.createObjectURL(file.raw)  本地预览地址
      // item 就是当前的选项对象
      item.img = URL.createObjectURL(file.raw)
    },
    // 添加选项
    addOption () {
      // 规律：
      // 索引 0 ---> A  ascii  65
      // 索引 1 ---> B  ascii  66
      // 索引 2 ---> C  ascii  67
      // 索引 3 ---> D  ascii  68
      // 索引 4 ---> E  ascii  69
      // ...
      // 总结 code = String.fromCharCode(index + 65)
      this.qsForm.options.push({
        isRight: false,
        code: String.fromCharCode(65 + this.qsForm.options.length),
        title: '',
        img: ''
      })
    },
    // 选择了题型
    // 选择单选框
    changeRadio (item) {
      // 1. 清除所有的选中
      this.qsForm.options.forEach(item => {
        item.isRight = false
      })
      // 2. 自己选中
      item.isRight = true
    },
    // 校验题干
    checkQustion () {
      // 调用el-form组件的 validateField 校验  question  字段
      this.$refs.form.validateField('question')
    },
    async getSubjectOptions () {
      const res = await getSubjectOptions()
      this.subjectOptions = res.data
    },
    async getCatalogOptions () {
      const res = await getCatalogOptions()
      this.catalogOptions = res.data
    },
    async getCompanyOptions () {
      const res = await getCompanyOptions({ pagesize: 10000 })
      // res.data.items 下拉选项数据  id 选项值  company 选项文字
      this.enterpriseOptions = res.data.items
    },
    getAreaOptions (cityName) {
      // 清空  地区选中的值
      this.qsForm.city = null
      // cityName 是你选中城市后的值
      this.areaOptions = getAreaOptions(cityName)
    }
  }
}

</script>

<style scoped lang='scss'>
// 现在仅在当前组件下生效，让样式的作用更深
.question-new ::v-deep .ql-editor{
  height: 200px;
}
.question-new ::v-deep .ql-toolbar.ql-snow{
  padding: 0 8px;
}
.option_item{
  padding-bottom: 20px;
}
.avatar-uploader{
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
}
.question-new ::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  width: 100px;
  height: 60px;
  line-height: 60px;
}
.question-new ::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.question-new ::v-deep .avatar-uploader i{
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(50%,-50%);
  background: #fff;
  font-size: 18px;
  color: #999;
}
.avatar {
  width: 100px;
  height: 60px;
  display: block;
  overflow: hidden;
}
</style>
