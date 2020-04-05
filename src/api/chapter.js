import request from '@/utils/request'
export default{
  //第四次提交
    getTree(id){
      return request({
          url:'edu/chapter/chapterTree/'+id,
          method:'get'
      })  
    },
    getChapter(id){
        return request({
            url:'/edu/chapter/'+id,
            method:'get'
        })
    },
    deleteChapter(id){
        return request({
            url:'/edu/chapter/deleteChapter/'+id,
            method: 'delete'
        })
    },
    addChapter(chapter){
       return request({
           url:'edu/chapter',
           method:'post',
           data:chapter
       })
    },
    updateChapter(chapter){
        return request({
            url:'edu/chapter',
            method:'put',
            data:chapter
        })
    }

}