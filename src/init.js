import { join } from 'path'
import { existsSync } from 'fs'
import inquirer from 'inquirer'

import { successStart, log, gitPathExistTip, existTip } from './prompt'
import config from '../config.json'

const configBoilerplateMap = config.reduce((r, v) => ({ ...r, [v.name]: v }), {})

/**
 * 初始化样板
 * */
const init = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'boilerplateName',
                message: 'choose boilerplate[选择工程模板]?',
                choices: Object.keys(configBoilerplateMap),
            },
        ])
        .then(({ boilerplateName }) => {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'projectName',
                        message: 'input project name[输入项目名称]?',
                        default: boilerplateName,
                        validate: val => (val === '' ? 'not empty!' : true),
                    },
                    {
                        type: 'confirm',
                        name: 'install',
                        message: 'download dependency[下载依赖]?',
                        default: true,
                    },
                ])
                .then(({ projectName, install }) => {
                    const dest = join(process.cwd(), projectName)

                    // 当前目录路径是否存在（避免覆盖）
                    if (existsSync(dest)) {
                        existTip()
                    }

                    const gitPath = configBoilerplateMap[boilerplateName].git

                    if (gitPath) {
                        log(`Creating a new ${boilerplateName} app in ${dest}.`)
                        log('')

                        require('./install').default({ projectName, install, gitPath }, () =>
                            successStart(boilerplateName, dest),
                        )
                    } else {
                        gitPathExistTip()
                    }
                })
        })
}

export default init
