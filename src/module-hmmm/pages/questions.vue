<template>
  <div class="question-container">
    <el-card>
      <!-- 按钮 -->
      <div class="btn_wrapper">
        <el-button @click="$router.push('new')" type="primary" size="small">新增试题</el-button>
        <el-button type="success" size="small">批量导入</el-button>
      </div>
      <!-- 筛选 -->
      <el-form label-width="80px" size="small">
        <el-row>
          <el-col :span="6">
            <el-form-item label="学科">
              <el-select v-model="requestParams.subjectID" style="width:100%">
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
            <el-form-item label="关键字">
              <el-input v-model="requestParams.keyword"></el-input>
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
            <el-form-item style="text-align:right">
              <el-button @click="clear()">清除</el-button>
              <el-button @onclick="filter()" type="primary">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 列表 -->
      <el-table :data="questions">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="试题编号" prop="number"></el-table-column>
        <el-table-column label="学科" prop="subject"></el-table-column>
        <el-table-column label="题型">
          <template slot-scope="scope">
            {{questionType.find(item=>item.value===+scope.row.questionType).label}}
          </template>
        </el-table-column>
        <el-table-column label="题干" prop="question"></el-table-column>
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
        <el-table-column label="使用次数" prop="id"></el-table-column>
        <el-table-column label="录入人" prop="creator"></el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="text" @click="openPreviewDialog(scope.row)">预览</el-button>
            <el-button type="text">修改</el-button>
            <el-button type="text">删除</el-button>
            <el-button type="text">加入精选</el-button>
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
import { list as questionList } from '@/api/hmmm/questions'
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
      diffOptions: [],
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
    // 难度下拉选项
    this.diffOptions = difficulty
    // 标签下拉选项
    const { data: tagArr } = await tagList()
    this.tagOptions = tagArr
    // 用户
    const { data: userArr } = await userList()
    this.userOptions = userArr
    // 获取目录
    const { data: directoryArr } = await directoryList()
    this.directoryOptions = directoryArr
    this.getList()
  },
  methods: {
    openPreviewDialog (questionInfo) {
      this.questionInfo = questionInfo
      this.$nextTick(() => {
        this.$refs.questionPreview.open()
      })
    },
    clear () {
      for (const key in this.requestParams) {
        if (key !== 'page' || key !== 'pagesize') this.requestParams[key] = null
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

<style lang="scss">
.question-container {
  padding: 0 10px;
  margin: 10px 0;
}
.btn_wrapper {
  margin-bottom: 15px;
}
</style>
