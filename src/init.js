import { join } from 'path'
import { get } from 'https'
import { existsSync } from 'fs'
import inquirer from 'inquirer'
import ora from 'ora'

import { successStart, log, gitPathExistTip, existTip } from './prompt'

/**
 * 初始化样板
 * */
const init = () => {
    const spinner = ora('Config Loading...').start()
    get('https://zhouzuchuan.github.io/project-boilerplates/config.json', res => {
        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', chunk => {
            rawData += chunk
        })
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData)
                const configBoilerplateMap = parsedData.reduce((r, v) => ({ ...r, [v.name]: v }), {})
                spinner.stop()
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

                                const projectConfig = configBoilerplateMap[boilerplateName]

                                if (projectConfig) {
                                    log(`Creating a new ${boilerplateName} app in ${dest}.`)
                                    log('')

                                    require('./install').default({ projectName, install, projectConfig }, () =>
                                        successStart(boilerplateName, dest),
                                    )
                                } else {
                                    gitPathExistTip()
                                }
                            })
                    })
            } catch (e) {
                console.error(e.message)
            }
        })
    }).on('error', e => {
        console.error(`Got error: ${e.message}`)
    })
}

export default init
