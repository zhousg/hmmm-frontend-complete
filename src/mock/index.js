import Mock from 'mockjs'
import TableAPI from './table'
import QuestionsAPI from './questions'

Mock.setup({
  timeout: '500'
})
Mock.mock(/\/table\/list\.*/, 'get', TableAPI.list)
Mock.mock(/\/questions\/randoms\.*/, 'get', QuestionsAPI.list)
Mock.mock(/\/questions\/randoms\.*/, 'delete', QuestionsAPI.delete)
