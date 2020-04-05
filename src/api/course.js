import request from '@/utils/request'
const api_name = '/admin/edu/course'
export default{
    getCourseById(id){
        return request({
            url:'/edu/course/'+id,
            methods:'get'
            
        })
    },
    saveCourseInfo(data){
        return request({
            url:'/edu/course/save',
            method: 'post',
            data:data
        })
    },
    deleteCourse(id){
        return request({
            url:'/edu/course/'+id,
            method:'delete'
            
        })
    },
    updateCourse(data){
        return request({
            url:'/edu/course',
            method: 'put',
            data:data
        })
    },
    getPageList(page,limit,searchObj){
        return request({
            url:'/edu/course/'+page+'/'+limit,
            method:'post',
            data:searchObj
        })
    },
    getCourseDetails(courseId){
        return request({
            url:'/'
        })
    }
}