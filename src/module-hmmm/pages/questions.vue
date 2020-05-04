<template>
  <div class="question-container">
    <el-card>
      <!-- 按钮 -->
      <div class="btn_wrapper">
        <el-button icon="el-icon-edit" @click="$router.push('new')" type="success" size="small">新增试题</el-button>
      </div>
      <!-- 筛选 -->
      <el-form label-width="80px" size="small">
        <el-row>
          <el-col :span="6">
            <el-form-item label="学科">
              <el-select @change="changeSubject" v-model="requestParams.subjectID" style="width:100%">
                <el-option
                  v-for="item in subjectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="二级目录">
              <el-select v-model="requestParams.catalogID" style="width:100%">
                <el-option
                  v-for="item in directoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标签">
              <el-select v-model="requestParams.tags" style="width:100%">
                <el-option
                  v-for="item in tagOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关键字">
              <el-input v-model="requestParams.keyword"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="试题类型">
              <el-select v-model="requestParams.questionType" style="width:100%">
                <el-option
                  v-for="item in questionTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="难度">
              <el-select v-model="requestParams.difficulty" style="width:100%">
                <el-option
                  v-for="item in diffOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="方向">
              <el-select v-model="requestParams.direction" style="width:100%">
                <el-option
                  v-for="item in directionOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="录入人">
              <el-select v-model="requestParams.creatorID" style="width:100%">
                <el-option
                  v-for="item in userOptions"
                  :key="item.id"
                  :label="item.username"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="题目备注">
              <el-input v-model="requestParams.remarks"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业简称">
              <el-input v-model="requestParams.shortName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="城市">
              <!-- 城市 -->
              <el-select @change="handleCity" v-model="requestParams.province" style="width:48%;margin-right:2%">
                <el-option
                  v-for="item in cityOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
              <!-- 地区 -->
              <el-select v-model="requestParams.city" style="width:50%">
                <el-option
                  v-for="item in areaOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item style="text-align:right">
              <el-button @click="clear()">清除</el-button>
              <el-button @click="filter()" type="primary">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 数据记录 -->
      <el-alert
        :title="`数据一共 ${total} 条`"
        style="margin-bottom:15px"
        type="info"
        class="alert"
        :closable="false"
        show-icon
      ></el-alert>
      <!-- 列表 -->
      <el-table :data="questions">
        <el-table-column label="试题编号" prop="number" width="120px"></el-table-column>
        <el-table-column label="学科" prop="subject"></el-table-column>
        <el-table-column label="目录" prop="catalog"></el-table-column>
        <el-table-column label="题型">
          <template slot-scope="scope">
            {{questionType.find(item=>item.value===+scope.row.questionType).label}}
          </template>
        </el-table-column>
        <el-table-column label="题干" width="280px">
          <template slot-scope="scope">
            <div v-html="scope.row.question"></div>
          </template>
        </el-table-column>
        <el-table-column label="录入时间" width="180">
          <template slot-scope="scope">
            {{scope.row.addDate|parseTimeByString}}
          </template>
        </el-table-column>
        <el-table-column label="难度">
          <template slot-scope="scope">
            {{difficulty.find(item=>item.value===+scope.row.difficulty).label}}
          </template>
        </el-table-column>
        <el-table-column label="录入人" prop="creator"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button plain type="primary" size="small" circle icon="el-icon-view" title="预览" @click="openPreviewDialog(scope.row)"></el-button>
            <el-button plain type="success" size="small" circle icon="el-icon-edit" title="修改" @click="$router.push(`new?id=${scope.row.id}`)"></el-button>
            <el-button plain type="danger" size="small" circle icon="el-icon-delete" title="删除" @click="delQuestion(scope.row)"></el-button>
            <el-button plain type="warning" size="small" circle icon="el-icon-check" @click="addChoice(scope.row)" title="加入精选"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="margin-top:20px;text-align:right"
        background
        layout="prev, pager, next, sizes, jumper"
        :total="total"
        :page-size="requestParams.pagesize"
        :current-page="requestParams.page"
        @current-change="pager"
        :page-sizes="[5,10,20,50]"
        @size-change="handleSizeChange"
      ></el-pagination>
    </el-card>
    <!-- 预览 -->
    <questions-preview ref="questionPreview" :data="questionInfo"></questions-preview>
  </div>
</template>

<script>
import { simple as subjectList } from '@/api/hmmm/subjects'
import { simple as directoryList } from '@/api/hmmm/directorys'
import { simple as userList } from '@/api/base/users'
import { difficulty, questionType, direction } from '@/api/hmmm/constants'
import { simple as tagList } from '@/api/hmmm/tags'
import { provinces as getCity, citys as getArea } from '@/api/hmmm/citys'
import { list as questionList, remove as questionDel, choiceAdd } from '@/api/hmmm/questions'
import QuestionsPreview from '../components/questions-preview'
export default {
  components: {
    QuestionsPreview
  },
  data () {
    return {
      questionInfo: {},
      questionType,
      difficulty,
      total: 0,
      // 注意：如果响应响应式数据 先声明
      questions: [],
      requestParams: {
        subjectID: null,
        difficulty: null,
        questionType: null,
        tags: null,
        province: null,
        city: null,
        keyword: null,
        remarks: null,
        shortName: null,
        direction: null,
        creatorID: null,
        catalogID: null,
        page: 1,
        pagesize: 5
      },
      // 学科选项
      subjectOptions: [],
      // 难度选项
      diffOptions: difficulty,
      // 试题类型选项
      questionTypeOptions: questionType,
      // 标签选项
      tagOptions: [],
      // 城市
      cityOptions: getCity(),
      // 地区 当选择了城市的时候赋值
      areaOptions: [],
      // 方向选项
      directionOptions: direction,
      // 录入人
      userOptions: [],
      // 目录
      directoryOptions: []
    }
  },
  async created () {
    // 学科下拉选项
    const { data: subjectArr } = await subjectList()
    this.subjectOptions = subjectArr
    // 用户
    const { data: userArr } = await userList()
    this.userOptions = userArr
    this.getList()
  },
  methods: {
    // 选择学科查询目录和标签的下拉选项数据
    async changeSubject (subjectID) {
      this.requestParams.catalogID = null
      this.requestParams.tags = null
      if (subjectID) {
        // 获取目录
        const { data: directoryArr } = await directoryList({ subjectID })
        this.directoryOptions = directoryArr
        // 标签下拉选项
        const { data: tagArr } = await tagList({ subjectID })
        this.tagOptions = tagArr
      } else {
        this.directoryOptions = []
        this.tagOptions = []
      }
    },
    openPreviewDialog (questionInfo) {
      this.questionInfo = questionInfo
      this.$nextTick(() => {
        this.$refs.questionPreview.open()
      })
    },
    async delQuestion (question) {
      await this.$confirm('此操作将永久删除该题目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await questionDel(question)
      this.$message.success('删除成功')
      this.getList()
    },
    async addChoice (question) {
      await this.$confirm('此操作将该题目加入精选, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
      await choiceAdd({ id: question.id, choiceState: 1 })
      this.$message.success('加入精选成功')
      this.getList()
    },
    clear () {
      for (const key in this.requestParams) {
        if (key !== 'page' && key !== 'pagesize') this.requestParams[key] = null
      }
    },
    filter () {
      this.requestParams.page = 1
      this.getList()
    },
    async getList () {
      const { data: questionsData } = await questionList(this.requestParams)
      this.questions = questionsData.items
      this.total = questionsData.counts
    },
    handleSizeChange (size) {
      this.requestParams.page = 1
      this.requestParams.pagesize = size
      this.getList()
    },
    pager (np) {
      this.requestParams.page = np
      this.getList()
    },
    handleCity (cityName) {
      // 地区选中的数据清空
      this.requestParams.city = null
      // 获取城市下的地区赋值给areaOptions
      this.areaOptions = getArea(cityName)
    }
  }
}
</script>

<style lang="scss" scoped>
.question-container {
  padding: 0 10px;
  margin: 10px 0;
}
.btn_wrapper {
  margin-bottom: 15px;
}
</style>
