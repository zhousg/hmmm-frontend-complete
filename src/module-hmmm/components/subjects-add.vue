<template>
  <div class="qustions-check">
    <el-dialog :title="`${data.id?'修改':'新增'}学科`" :visible.sync="show" width="400px">
      <el-form ref="form" size="small" label-width="80px" :model="formModel" :rules="formRules">
        <el-form-item label="学科名称" prop="subjectName">
          <el-input v-model="formModel.subjectName" placeholder="请输入学科名称"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="isFrontDisplay">
          <el-switch
            active-value="1"
            inactive-value="0"
            v-model="formModel.isFrontDisplay"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
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
import { add, update } from '@/api/hmmm/subjects'
export default {
  name: 'SubjectsAdd',
  props: {
    data: {
      default: () => {},
      type: Object
    }
  },
  data () {
    return {
      show: false,
      formModel: {
        id: null,
        subjectName: null,
        isFrontDisplay: '1'
      },
      formRules: {
        subjectName: [
          { required: true, message: '请输入学科名称', tirgger: 'blur' }
        ],
        isFrontDisplay: [
          { required: true, message: '请选择是否显示', tirgger: 'blur' }
        ]
      }
    }
  },
  methods: {
    open () {
      this.show = true
    },
    async confirm () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 提交
          if (!this.data.id) {
            // 新增
            await add(this.formModel)
          } else {
            // 修改
            this.formModel.id = this.data.id
            await update(this.formModel)
          }
          this.$message.success('操作成功')
          this.show = false
          this.$emit('updateList')
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
