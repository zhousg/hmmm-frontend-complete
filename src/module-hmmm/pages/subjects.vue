<template>
  <div class="question-container">
    <el-card>
      <!-- 筛选 -->
      <el-row>
        <el-col :span="18">
          <el-form label-width="80px" size="small" :inline="true">
            <el-form-item label="学科名称">
              <el-input style="200px" v-model="requestParams.subjectName"></el-input>
            </el-form-item>
            <el-form-item style="text-align:right">
              <el-button @click="clear()">清除</el-button>
              <el-button @click="filter()" type="primary">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6" style="text-align:right">
          <el-button icon="el-icon-edit" @click="openDialog()" type="success" size="small">新增学科</el-button>
        </el-col>
      </el-row>
      <!-- 数据记录 -->
      <el-alert
        :title="`数据一共 ${total} 条`"
        style="margin-bottom:15px"
        type="info"
        class="alert"
        :closable="false"
        show-icon
      ></el-alert>
      <!-- 表格 -->
      <el-table :data="subjects">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="学科名称" prop="subjectName"></el-table-column>
        <el-table-column label="创建者" prop="username"></el-table-column>
        <el-table-column label="创建日期" width="160px">
          <template slot-scope="scope">{{scope.row.addDate|parseTimeByString}}</template>
        </el-table-column>
        <el-table-column label="前台是否显示">
          <template slot-scope="scope">{{scope.row.isFrontDisplay===1?'是':'否'}}</template>
        </el-table-column>
        <el-table-column label="二级目录" prop="twoLevelDirectory"></el-table-column>
        <el-table-column label="标签" prop="tags"></el-table-column>
        <el-table-column label="题目数量" prop="totals"></el-table-column>
        <el-table-column label="操作" width="240px">
          <template slot-scope="scope">
            <el-button type="text" @click="$router.push(`directorys?id=${scope.row.id}&name=${encodeURIComponent(scope.row.subjectName)}`)">学科分类</el-button>
            <el-button type="text" @click="$router.push(`tags?id=${scope.row.id}&name=${encodeURIComponent(scope.row.subjectName)}`)">学科标签</el-button>
            <el-button type="text" @click="openDialog(scope.row)">修改</el-button>
            <el-button type="text" @click="delSubject(scope.row)">删除</el-button>
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
    <!-- 添加|修改 -->
    <subjects-add ref="subjectsadd" :data="currSubject" @updateList="updateList()"></subjects-add>
  </div>
</template>

<script>
import { list as getSubjects, remove } from '@/api/hmmm/subjects'
import SubjectsAdd from '../components/subjects-add'
export default {
  name: 'SubjectsList',
  components: { SubjectsAdd },
  data () {
    return {
      requestParams: {
        subjectName: '',
        page: 1,
        pagesize: 5
      },
      subjects: [],
      total: 0,
      currSubject: {}
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 删除学科
    async delSubject (subject) {
      await this.$confirm('此操作将永久删除该学科, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await remove(subject)
      this.$message.success('删除成功')
      this.getList()
    },
    // 新增|修改 后更新列表
    updateList () {
      if (!this.currSubject.id) {
        this.requestParams.page = 1
      }
      this.getList()
    },
    // 打开 新增|修改 对话框
    openDialog (subject) {
      this.currSubject = subject || {}
      this.$nextTick(() => {
        this.$refs.subjectsadd.open()
      })
    },
    // 清除筛选条件
    clear () {
      this.requestParams = {
        subjectName: '',
        page: 1,
        pagesize: 10
      }
    },
    // 进行筛选
    filter () {
      this.requestParams.page = 1
      this.getList()
    },
    // 切换条数
    handleSizeChange (size) {
      this.requestParams.page = 1
      this.requestParams.pagesize = size
      this.getList()
    },
    // 切换分页
    pager (np) {
      this.requestParams.page = np
      this.getList()
    },
    // 查询列表
    async getList () {
      const { data } = await getSubjects(this.requestParams)
      this.subjects = data.items
      this.total = data.counts
    }
  }
}
</script>

<style lang="scss" scoped>
.fs {
  font-size: 12px;
}
</style>
