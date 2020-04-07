import request from '@/utils/request'

const api_name = '/statistics/daily'
export default {

  createStatistics(day) {
    return request({
      url: `${api_name}/${day}`,
      method: 'post'
    })
  },
  showChart(begin,end) {
    return request({
        url: `${api_name}/showChart/${begin}/${end}`,
        method: 'get'
    })
}
}