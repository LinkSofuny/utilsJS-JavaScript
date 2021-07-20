/**
 * @field 自动化生成element规则对象
 * @returns rules： object
 */
class RulesObject {
    constructor() {
        this.propsArr = []
    }
    findChildrenProps(DOM) {
        if (DOM.$children && DOM.$children.length > 0) {
            DOM.$children.forEach((item) => {
                this.findChildrenProps(item)
            })
        }
        if (DOM.required && DOM.prop && DOM.$children) {
            let element = DOM.$children[0].$el
            this.propsArr.push({
                prop: DOM.prop,
                ruleType: element
                    ? element.classList[0] + (DOM.$children[0].multiple ? '-multiple' : '')
                    : 'NO_REQUIRED',
            })
        }
    }
    formatKey(key) {
        let keyArr = key.split('-')
        if (keyArr[keyArr.length - 1] === 'multiple') {
            return [{ type: 'array', required: true, message: '请至少选择一个', trigger: 'change' }]
        }
        switch (keyArr[2]) {
            case 'select':
                return [{ required: true, message: '请选择一个选项', trigger: 'change' }]
            case 'date':
                return [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }]
            case 'input':
                return [{ required: true, message: '此处不可为空', trigger: 'blur' }]
            case 'checkbox':
                return [{ required: true, message: '请选择一个选项', trigger: 'change' }]
            case 'radio':
                return [{ required: true, message: '请选择活动资源', trigger: 'change' }]
            default:
                return [{ required: true, message: '此处不可为空', trigger: 'blur' }]
        }
    }
    addRules(typeArr) {
        let rules = {}
        typeArr.forEach((item) => {
            rules[item.prop] = this.formatKey(item.ruleType)
        })
        return rules
    }
    async initData(that, DomName) {
        let formDOM = null
        await that.$nextTick(() => {
            formDOM = that.$refs[DomName]
        })
        this.findChildrenProps(formDOM)
        return this.addRules(this.propsArr)
    }
}
export default function (that, DomName) {
    return new RulesObject().initData(that, DomName).then(res => {
        console.log(JSON.stringify(res))
    })
}
