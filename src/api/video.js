import request from '@/utils/request'
export default{
    getVideo(id){
      return request({
          url:'edu/video/'+id,
          method:'get'
      })  
    },
  
    deleteVideo(id){
        return request({
            url:'/edu/video/'+id,
            method: 'delete'
        })
    },
    addVideo(video){
       return request({
           url:'edu/video/addVideo',
           method:'post',
           data:video
       })
    },
    updateVideo(video){
        return request({
            url:'edu/video/updateVideo',
            method:'put',
            data:video
        })
    },
  

}