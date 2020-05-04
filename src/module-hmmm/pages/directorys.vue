<template>
  <div class="directorys-container">
    <el-card>
      <!-- 面包屑 -->
      <div slot="header" v-if="subject.id && subject.name">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>学科管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{subject.name}}</el-breadcrumb-item>
          <el-breadcrumb-item>目录管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 筛选 -->
      <el-row>
        <el-col :span="18">
          <el-form label-width="80px" size="small" :inline="true">
            <el-form-item label="目录名称">
              <el-input style="200px" v-model="requestParams.directoryName"></el-input>
           </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="requestParams.state">
                <el-option :value="1" label="启用"></el-option>
                <el-option :value="0" label="禁用"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="text-align:right">
              <el-button @click="clear()">清除</el-button>
              <el-button @click="filter()" type="primary">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6" style="text-align:right">
          <el-button v-if="subject.id && subject.name" type="text" icon="el-icon-back" @click="$router.back()">返回学科</el-button>
          <el-button icon="el-icon-edit" @click="openDialog()" type="success" size="small">新增目录</el-button>
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
      <el-table :data="directorys">
        <el-table-column label="序号" type="index" width="80px"></el-table-column>
        <el-table-column label="所属学科" prop="subjectName"></el-table-column>
        <el-table-column label="目录名称" prop="directoryName"></el-table-column>
        <el-table-column label="创建者" prop="username"></el-table-column>
        <el-table-column label="创建日期">
          <template slot-scope="scope">{{scope.row.addDate|parseTimeByString}}</template>
        </el-table-column>
        <el-table-column label="面试题数量" prop="totals"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{scope.row.state===1?'已启用':'已禁用'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button type="text" @click="toggleState(scope.row)">{{scope.row.state===1?'禁用':'启用'}}</el-button>
            <el-button type="text" @click="openDialog(scope.row)" :disabled="scope.row.state===1">修改</el-button>
            <el-button type="text" @click="delDirectory(scope.row)" :disabled="scope.row.state===1||scope.row.totals > 0">删除</el-button>
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
        hide-on-single-page
      ></el-pagination>
    </el-card>
    <!-- 添加|修改 -->
    <directorys-add ref="directorysAdd" :data="currDirectory" @updateList="updateList()"></directorys-add>
  </div>
</template>

<script>
import { list, changeState, remove } from '@/api/hmmm/directorys'
import DirectorysAdd from '../components/directorys-add'
export default {
  name: 'DirectorysList',
  components: { DirectorysAdd },
  data () {
    return {
      requestParams: {
        directoryName: null,
        state: null,
        page: 1,
        pagesize: 10
      },
      total: 0,
      directorys: [],
      currDirectory: {}
    }
  },
  computed: {
    subject () {
      return this.$route.query || {}
    }
  },
  created () {
    this.getList()
  },
  watch: {
    '$route.query': function () {
      this.getList()
    }
  },
  methods: {
    openDialog (directory = {}) {
      this.currDirectory = directory
      this.$nextTick(() => {
        this.$refs.directorysAdd.open()
      })
    },
    // 切换状态
    async toggleState (directory) {
      await changeState({
        id: directory.id,
        state: directory.state === 1 ? 0 : 1
      })
      this.$message.success('操作成功')
      directory.state = directory.state === 1 ? 0 : 1
    },
    async delDirectory (directory) {
      await this.$confirm('此操作将永久删除该目录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await remove(directory)
      this.$message.success('删除成功')
      this.getList()
    },
    // 清除筛选条件
    clear () {
      this.requestParams = {
        directoryName: null,
        state: null,
        page: 1,
        pagesize: 10
      }
    },
    // 进行筛选
    filter () {
      this.requestParams.page = 1
      this.getList()
    },
    // 查询列表
    async getList () {
      this.requestParams.subjectID = this.subject.id || null
      const { data } = await list(this.requestParams)
      this.directorys = data.items
      this.total = data.counts
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
    // 新增|修改 后更新列表
    updateList () {
      if (!this.currDirectory.id) {
        this.requestParams.page = 1
      }
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.directorys-container{
  padding: 10px;
}
</style>
