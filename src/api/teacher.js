import request from '@/utils/request'

// export function getTeacherPageList(page,limit,objectJson) {
//   return request({
//     url: '/edu/teacher/'+page+'/'+limit,
//     method: 'post',
//     data:Object
//   })
// }
export default{
    getTeacherPageList(page,limit,objectJson){
        return request({
            url: '/edu/teacher/query/'+page+'/'+limit,
            method: 'post',
            data: objectJson 
        })
    },
    deleteTeacherById(id){
        return request({
            url:'/edu/teacher/'+id,
            method: 'delete'
        })
    },
    addTeacher(teacher){
        return request({
            url:'/edu/teacher/addTeacher',
            method:'post',
            data:teacher
        })
    },
    getTeacherById(id){
        return request({
            url:'/edu/teacher/'+id,
            method:'get'
        })
    },
    updateTeacherById(teacher){
        return request({
            url:'/edu/teacher/'+teacher.id,
            method:'put',
            data:teacher
        })
    },
    getAllTeacher(){
        return request({
            url:'/edu/teacher/all',
            method:'get'
        })
    }
}
