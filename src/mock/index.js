import Mock from 'mockjs'
import QuestionsAPI from './questions'

Mock.setup({
  timeout: '500'
})

Mock.mock(/\/questions\/randoms\.*/, 'get', QuestionsAPI.list)
Mock.mock(/\/questions\/randoms\.*/, 'delete', QuestionsAPI.delete)
