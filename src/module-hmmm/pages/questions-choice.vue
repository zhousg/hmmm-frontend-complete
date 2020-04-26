<template>
  <div class="question-container">
    <el-card>
      <!-- 筛选 -->
      <el-form label-width="80px" size="small">
        <el-row>
          <el-col :span="6">
            <el-form-item label="关键字">
              <el-input style="200px" v-model="requestParams.keyword"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="12">
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
            <el-button plain type="success" size="small" circle icon="el-icon-edit" title="修改" @click="$router.push('new')"></el-button>
            <el-button plain type="danger" size="small" circle icon="el-icon-delete" title="删除" @click="delQuestion(scope.row)"></el-button>
            <el-button plain type="warning" size="small" circle icon="el-icon-close" @click="delChoice(scope.row)" title="移出精选"></el-button>
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
import { difficulty, questionType } from '@/api/hmmm/constants'
import { choice as questionList, remove as questionDel, choiceAdd } from '@/api/hmmm/questions'
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
        keyword: null,
        page: 1,
        pagesize: 5
      }
    }
  },
  async created () {
    this.getList()
  },
  methods: {
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
    async delChoice (question) {
      await this.$confirm('此操作将该题目移出精选, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
      await choiceAdd({ id: question.id, choiceState: 0 })
      this.$message.success('移出精选成功')
      this.getList()
    },
    clear () {
      this.requestParams.keyword = null
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
