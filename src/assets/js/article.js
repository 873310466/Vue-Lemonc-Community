/* 因为要跨组件传值，这边直接把文章数据独立出来，方便管理 */
import { request } from '../../api/request'
export let articleData = []
export let articleTitle = ''
export let articleType = 'hottest'
export const pageConfig = {
  curPage: 1,
  total: 0,
  isPage: true
}
const http = request()
export default {
  // 获取最新文章数据
  async getNewestArticles () {
    const { data: res } = await http.get('/public/article/list', {
      params: {
        curPage: pageConfig.curPage,
        title: articleTitle
      }
    })
    if (res.code !== 200) return
    articleData = res.data.records
    pageConfig.total = res.data.total
  },
  // 获取热门文章数据
  async getHottestArticles () {
    const { data: res } = await http.get('/public/article/list/hottest', {
      params: {
        curPage: pageConfig.curPage,
        title: articleTitle
      }
    })
    if (res.code !== 200) return
    articleData = res.data
    pageConfig.total = res.additionalMsg
  },

  // 设置要搜索的文章标题
  setArticleTitle (target) {
    articleTitle = target
  },
  // 设置要展示的文章类型（热门、最新）
  setArticleType (target) {
    articleType = target
  },
  setCurPage (newPage) {
    pageConfig.curPage = newPage
  }

}
