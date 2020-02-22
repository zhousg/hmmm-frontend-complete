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
