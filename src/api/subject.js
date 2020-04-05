import request from '@/utils/request'
export default{
    subjects(){
        return request({
            url:'/edu/subject/getSubjects',
            methods:'get'
        })
    },
    deleteSubject(id){
        return request({
            url:'/edu/subject/'+id,
            method: 'delete'
        })
    },
    addSubject(sub){
       return request({
           url:'edu/subject/addSubject',
           method:'post',
           data:sub
       })
    }

}