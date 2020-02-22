<template>
  <div class="app-container question-new">
    <el-card>
      <el-form ref="form" :model="qsForm" :rules="qsRules" label-width="120px">
        <!-- 学科 选择器-->
        <el-form-item label="学科：" prop="subjectID">
          <el-select v-model="qsForm.subjectID" style="width:400px">
            <el-option v-for="item in subjectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- 目录 选择器-->
        <el-form-item label="目录：" prop="catalogID">
          <el-select v-model="qsForm.catalogID"  style="width:400px">
            <el-option v-for="item in catalogOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- 企业 选择器-->
        <el-form-item label="企业：" prop="enterpriseID">
          <el-select v-model="qsForm.enterpriseID"  style="width:400px">
            <el-option v-for="item in enterpriseOptions" :key="item.id" :label="item.company" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- 城市 （市，地区）选择器  级联（选项与选项之间有从属关系）-->
        <el-form-item label="城市：" prop="city">
          <el-select v-model="qsForm.province" @change="getAreaOptions" style="width:198px">
            <el-option v-for="item in cityOptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-select v-model="qsForm.city" style="width:198px">
            <el-option v-for="item in areaOptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <!-- 方向 常量（不会改变值得变量） 选择器-->
        <el-form-item label="方向：" prop="direction">
          <el-select v-model="qsForm.direction" style="width:400px">
            <el-option v-for="item in directionOptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <!-- 题型 单选框-->
         <el-form-item label="题型：" prop="questionType">
            <el-radio-group @change="changeRadio({})" v-model="qsForm.questionType">
              <el-radio v-for="item in questionType" :key="item.value" :label="item.value+''">{{item.label}}</el-radio>
            </el-radio-group>
         </el-form-item>
        <!-- 难度 单选框-->
        <el-form-item label="难度：" prop="difficulty">
            <el-radio-group v-model="qsForm.difficulty">
              <el-radio v-for="item in difficulty" :key="item.value" :label="item.value+''">{{item.label}}</el-radio>
            </el-radio-group>
         </el-form-item>
        <!-- 题干  富文本 -->
        <el-form-item label="题干：" prop="question">
           <quill-editor @blur="checkQustion" v-model="qsForm.question" :options="editorOptions"></quill-editor>
        </el-form-item>
        <!-- 选项 需要分情况和试题类型关联-->
        <el-form-item label="选项：" prop="options" v-if="qsForm.questionType!=='3'">
          <div class="option_item" v-for="item in qsForm.options" :key="item.code">
            <el-radio v-if="qsForm.questionType==='1'" @change="changeRadio(item)" v-model="item.isRight" style="margin-right:0" :label="true">{{item.code}}：</el-radio>
            <el-checkbox v-if="qsForm.questionType==='2'" v-model="item.isRight" style="margin-right:0" :label="true">{{item.code}}：</el-checkbox>
            <el-input v-model="item.title" style="width:240px"></el-input>
            <!-- action="http://127.0.0.1:7001/frame/file" -->
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :headers="{'Authorization':'Bearer '+ token}"
              :on-success="(res,file)=>{uploadSuccess(item,res,file)}"
              :show-file-list="false">
              <img v-if="item.img" :src="item.img" class="avatar">
              <span v-else>上传图片</span>
              <i class="el-icon-circle-close"></i>
            </el-upload>
          </div>
          <!-- 添加按钮 -->
          <el-button type="danger" @click="addOption" size="small">+增加选项与答案</el-button>
        </el-form-item>
        <!-- 解析视频 输入框-->
        <el-form-item label="解析视频：">
          <el-input v-model="qsForm.videoURL" style="width:400px"></el-input>
        </el-form-item>
        <!-- 答案解析  富文本 -->
        <el-form-item label="答案解析：" prop="question">
           <quill-editor v-model="qsForm.answer" :options="editorOptions"></quill-editor>
        </el-form-item>
        <!-- 题目备注 文本域-->
        <el-form-item label="题目备注：">
          <el-input type="textarea" :rows="4" v-model="qsForm.remarks" style="width:400px"></el-input>
        </el-form-item>
        <!-- 试题标签 输入框-->
        <el-form-item label="试题标签：">
          <el-input v-model="qsForm.tags" style="width:400px"></el-input>
        </el-form-item>
        <!-- 提交按钮-->
        <el-form-item>
          <el-button @click="submit()" type="primary">提交</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 把额外模块声明组件配置对象 混入到 当前组件的配置对象中
import mixin from './questions-new-mixin'
export default {
  mixins: [mixin]
}
</script>

<style scoped lang='scss'>
// 现在仅在当前组件下生效，让样式的作用更深
.question-new ::v-deep .ql-editor{
  height: 200px;
}
.question-new ::v-deep .ql-toolbar.ql-snow{
  padding: 0 8px;
}
.option_item{
  padding-bottom: 20px;
}
.avatar-uploader{
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
}
.question-new ::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  width: 100px;
  height: 60px;
  line-height: 60px;
}
.question-new ::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.question-new ::v-deep .avatar-uploader i{
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(50%,-50%);
  background: #fff;
  font-size: 18px;
  color: #999;
}
.avatar {
  width: 100px;
  height: 60px;
  display: block;
  overflow: hidden;
}
</style>
