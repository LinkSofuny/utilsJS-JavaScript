/**
 * format过滤器, 要求格式
 * {
        name: '限时任务',
        value: 'TIME_LIMITED_TASK',
    },
*/
headerMapping() {
    return {
        taskType: {
            label: '任务类型',
            format: (val) => {
                return taskType.filter(item =>  item.value === val)[0].name
            }
        },
    }
}