<template>
  <div class="directorys-add">
    <el-dialog :title="`${data.id?'修改':'新增'}目录`" :visible.sync="show" width="400px">
      <el-form ref="form" size="small" label-width="80px" :model="formModel" :rules="formRules">
        <el-form-item label="所属学科" v-if="!$route.query.id" prop="subjectID">
          <el-select v-model="formModel.subjectID" style="width:100%">
            <el-option
              v-for="item in subjectOptions"
              :value="item.value"
              :label="item.label"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目录名称" prop="directoryName">
          <el-input v-model="formModel.directoryName" placeholder="请输入目录名称"></el-input>
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
import { add, update } from '@/api/hmmm/directorys'
import { simple as subjectList } from '@/api/hmmm/subjects'
export default {
  name: 'DirectorysAdd',
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
        subjectID: null,
        directoryName: null
      },
      formRules: {
        subjectID: [
          { type: 'number', message: '请选择所属学科', tirgger: 'blur' }
        ],
        directoryName: [
          { required: true, message: '请输入目录名称', tirgger: 'blur' }
        ]
      },
      subjectOptions: []
    }
  },
  async created () {
    // 学科下拉选项
    const { data: subjectArr } = await subjectList()
    this.subjectOptions = subjectArr
  },
  methods: {
    open () {
      this.show = true
      if (this.data.id) {
        const { id, subjectID, directoryName } = this.data
        this.formModel = { id, subjectID, directoryName }
      } else {
        this.formModel = {
          id: null,
          subjectID: +this.$route.query.id || null,
          directoryName: null
        }
      }
      // 清除校验效果
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
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
