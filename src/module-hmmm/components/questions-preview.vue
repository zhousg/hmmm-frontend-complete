<template>
  <div class="questions-preview">
    <el-dialog title="题目预览" :visible.sync="show" width="900px" @close="close()">
      <el-row>
        <el-col :span="6">【题型】：{{myData.questionType|tx}}</el-col>
        <el-col :span="6">【编号】：{{myData.id}}</el-col>
        <el-col :span="6">【难度】：{{myData.difficulty|nd}}</el-col>
        <el-col :span="6">【标签】：{{myData.tags}}</el-col>
        <el-col :span="6">【学科】：{{myData.subjectName}}</el-col>
        <el-col :span="6">【目录】：{{myData.directoryName}}</el-col>
        <el-col :span="6">【方向】：{{myData.direction}}</el-col>
      </el-row>
      <hr>
      【题干】：<div v-html="myData.question" style="color:blue"></div>
      <div v-if="myData.questionType!=='3'">
        <div style="padding-bottom:5px">{{myData.questionType|tx}} 选项：（以下选中的选项为正确答案）</div>
        <div v-for="item in myData.options" :key="item.code" style="padding:8px 0">
          <el-radio :value="item.isRight" :label="1">{{item.title}}</el-radio>
        </div>
      </div>
      <hr>
      【参考答案】：<el-button type="danger" size="small" @click="preivewVideo()">视频答案预览</el-button>
      <div class="video" v-show="play">
        <video ref="video" :src="myData.videoURL" controls></video>
      </div>
      <hr>
      【答案解析】：<div style="display:inline-block" v-html="myData.answer"></div>
      <hr>
      【题目备注】：{{myData.remarks}}
      <div slot="footer">
        <el-button type="primary">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { difficulty, questionType } from '@/api/hmmm/constants'
import { detail } from '@/api/hmmm/questions'
export default {
  name: 'questions-preview',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  filters: {
    nd (value) {
      if (value) return difficulty.find(item => item.value === +value).label
    },
    tx (value) {
      if (value) return questionType.find(item => item.value === +value).label + '题'
    }
  },
  data () {
    return {
      show: false,
      myData: {},
      play: false
    }
  },
  methods: {
    async open () {
      this.show = true
      const res = await detail({ id: this.data.id })
      this.myData = res.data
    },
    preivewVideo () {
      this.play = true
      this.$refs.video.play()
    },
    close () {
      this.play = false
      this.$refs.video.pause()
    }
  }
}
</script>

<style scoped lang="scss">
.questions-preview{
  .el-col{
    padding: 10px 0;
  }
}
.video{
  width: 400px;
  height: 300px;
  video {
    width: 100%;
    height: 100%;
  }
}
</style>
