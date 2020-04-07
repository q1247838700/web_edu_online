import request from '@/utils/request'

const api_name = '/statistics/daily'
export default {

  createStatistics(day) {
    return request({
      url: `/statistics/daily/${day}`,
      method: 'post'
    })
  }
}