import request from '@/utils/request'
export default{
    removeById(videoId){
        return request({
            url:'vod/video/'+videoId,
            method :'delete'
        })
      
    }
}
