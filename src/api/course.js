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
    //获取最终课时细节
    getCourseDetails(courseId){
        return request({
            url:'/edu/course/details/'+courseId,
            method:'get'
        })
    },
    //发布课程
    publishCourse(courseId){
        return request({
            url:'/edu/course/publish/'+courseId,
            method:'put'
        })
    },
    //取消发布课程
    cancelCourse(courseId){
return request({
    url:'edu/course/cancel/'+courseId,
    method:'put'
})
    }
}