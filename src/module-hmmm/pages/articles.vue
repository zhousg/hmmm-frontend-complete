<template>
  <div class="articles-container">
    <el-card>
      <!-- 筛选 -->
      <el-row>
        <el-col :span="18">
          <el-form label-width="80px" size="small" :inline="true">
            <el-form-item label="关键字">
              <el-input style="200px" v-model="requestParams.keyword"></el-input>
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
          <el-button icon="el-icon-edit" @click="openDialog()" type="success" size="small">新增技巧</el-button>
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
      <el-table :data="articles">
        <el-table-column label="序号" type="index" width="80px"></el-table-column>
        <el-table-column label="文章标题" width="400px">
          <template slot-scope="scope">
            {{scope.row.title}}
            <a @click.prevent="openVideo(scope.row.videoURL)" v-if="scope.row.videoURL" href="#" class="el-icon-film"></a>
          </template>
        </el-table-column>
        <el-table-column label="阅读数" prop="visits"></el-table-column>
        <el-table-column label="录入人" prop="username"></el-table-column>
        <el-table-column label="录入时间">
          <template slot-scope="scope">{{scope.row.createTime|parseTimeByString}}</template>
        </el-table-column>
        <el-table-column label="状态" width="100px">
          <template slot-scope="scope">{{scope.row.state===1?'已启用':'已禁用'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="text" @click="previewArticle(scope.row)">预览</el-button>
            <el-button type="text" @click="toggleState(scope.row)">{{scope.row.state===1?'禁用':'启用'}}</el-button>
            <el-button type="text" @click="openDialog(scope.row)" :disabled="scope.row.state===1">修改</el-button>
            <el-button type="text" @click="delArticle(scope.row)" :disabled="scope.row.state===1||scope.row.totals > 0">删除</el-button>
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
    <articles-add ref="articlesAdd" :data="currArticle" @updateList="updateList()"></articles-add>
    <!-- 预览 -->
    <articles-preview ref="articlesPreview" :data="currArticle"></articles-preview>
    <!-- 视频 -->
    <div class="video-preview" v-if="videoURL">
      <div class="close" @click="closeVideo()"><span class="el-icon-close"></span></div>
      <div class="box">
        <video ref="video" :src="videoURL"></video>
      </div>
    </div>
  </div>
</template>

<script>
import { list, changeState, remove } from '@/api/hmmm/articles'
import ArticlesAdd from '../components/articles-add'
import ArticlesPreview from '../components/articles-preview'
export default {
  name: 'ArticlesList',
  components: { ArticlesAdd, ArticlesPreview },
  data () {
    return {
      requestParams: {
        keyword: null,
        state: null,
        page: 1,
        pagesize: 10
      },
      total: 0,
      articles: [],
      currArticle: {},
      videoURL: null
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 视频
    openVideo (url) {
      this.videoURL = url
      this.$nextTick(() => {
        this.$refs.video.play()
      })
    },
    closeVideo () {
      this.$refs.video.pause()
      this.videoURL = null
    },
    // 预览
    previewArticle (article) {
      this.currArticle = article
      this.$nextTick(() => {
        this.$refs.articlesPreview.open()
      })
    },
    // 添加 编辑
    openDialog (article = {}) {
      this.currArticle = article
      this.$nextTick(() => {
        this.$refs.articlesAdd.open()
      })
    },
    // 切换状态
    async toggleState (article) {
      await changeState({
        id: article.id,
        state: article.state === 1 ? 0 : 1
      })
      this.$message.success('操作成功')
      article.state = article.state === 1 ? 0 : 1
    },
    // 删除
    async delArticle (article) {
      await this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await remove(article)
      this.$message.success('删除成功')
      this.getList()
    },
    // 清除筛选条件
    clear () {
      this.requestParams = {
        keyword: null,
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
      const { data } = await list(this.requestParams)
      this.articles = data.items
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
      if (!this.currArticle.id) {
        this.requestParams.page = 1
      }
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.articles-container{
  padding: 10px;
  .el-icon-film{
    color: blue;
    font-size: 18px;
  }
}
.video-preview{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.3);
  overflow: hidden;
  z-index: 9999;
  .close{
    width: 50px;
    height: 50px;
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translate(-50%,0);
    background: rgba(0,0,0,0.4);
    box-shadow: 0 0 5px rgba(0,0,0,0.4);
    border-radius: 50%;
    text-align: center;
    line-height: 50px;
    color: #fff;
    font-size: 20px;
  }
  .box{
    width: 800px;
    height: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    video{
      width: 100%;
      height: 100%;
    }
  }
}
</style>
