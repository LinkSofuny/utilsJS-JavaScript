const { parseComponent } = require('vue-template-compiler')
const fs = require('fs')
const fse = require('fs-extra') // 更好的语法
const path = require('path')

const aimFile = []

function validateHtmlTag(str) {
    const reg = /<(?:(?:\/?[A-Za-z]\w*\b(?:[=\s](['"]?)[\s\S]*?\1)*)|(?:!--[\s\S]*?--))\/?>/g //验证规则
    return reg.test(str)
}

function transformCode(code) {
    const { script } = parseComponent(code)
    if (script && script.content) {
        // 如果当前script 存在标签 不做更改
        return validateHtmlTag(script.content)
    }
}

function isInclude(path) {
    const include = ['components', 'views']
    return include.some((item) => path.indexOf(item) > -1)
}

function getRootFloderArr(basePath) {
    if (fse.existsSync(basePath)) {
        const folderArr = fse.readdirSync(basePath)
        return folderArr
            .map((item) => {
                const status = fs.statSync(basePath + '/' + item)
                return status.isDirectory() && isInclude(item) ? item : null
            })
            .filter(Boolean)
    }
}
function getFile(rootFolderArr, basePath) {
    let i = 0
    while (i < rootFolderArr.length) {
        const currentPath = basePath + '/' + rootFolderArr[i]
        fse.existsSync()
        const status = fs.statSync(currentPath)

        if (status.isDirectory(currentPath)) {
            const folders = fse.readdirSync(currentPath)
            getFile(folders, currentPath)
        } else if (status.isFile(currentPath)) {
            // 证明是一个 vue 组件文件
            const isVue = currentPath.indexOf('.vue') > -1
            if (isVue) {
                aimFile.push(currentPath)
            }
        }
        i++
    }
}
function checkFileType() {
    aimFile.forEach((filePath) => {
        let code = fse.readFileSync(filePath, 'utf-8')
        // 证明文件内存在 jsx
        if (transformCode(code)) {
            code = code.replace('<script>', `<script lang="jsx">`)
            try {
                fse.removeSync(filePath)
                fse.writeFileSync(filePath, code)
            } catch (e) {
                console.log(e)
            }
        }
    })
}

function main() {
    const basePath = path.resolve(__dirname)
    // 待处理的总文件夹
    const rootFolderArr = getRootFloderArr(basePath)
    // 拿到总文件数组
    getFile(rootFolderArr, basePath)
    checkFileType()
}

main()
