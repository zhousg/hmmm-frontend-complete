<template>
  <div class="qustions-check">
    <el-dialog title="题目审核" :visible.sync="show" width="400px">
      <el-form size="small">
        <el-form-item>
          <el-radio :label="1" v-model="checkData.chkState">通过</el-radio>
          <el-radio :label="2" v-model="checkData.chkState">拒绝</el-radio>
        </el-form-item>
        <el-form-item>
          <el-input type="textarea" v-model="checkData.chkRemarks" placeholder="请输入审核意见"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="show=false">取消</el-button>
        <el-button @click="confirm()" type="primary">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { choiceCheck } from '@/api/hmmm/questions'
export default {
  name: 'QuestionsCheck',
  props: {
    data: {
      default: () => {},
      type: Object
    }
  },
  data () {
    return {
      show: false,
      checkData: {
        id: null,
        chkState: 1,
        chkRemarks: null
      }
    }
  },
  methods: {
    open () {
      this.show = true
    },
    async confirm () {
      if (!this.checkData.chkRemarks) return this.$message.warning('请输入审核意见')
      this.checkData.id = this.data.id
      await choiceCheck(this.checkData)
      this.$message.success('操作成功')
      this.show = false
      this.$emit('updateList')
    }
  }
}
</script>

<style scoped>
</style>
