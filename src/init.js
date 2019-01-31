import { join } from 'path'
import vfs from 'vinyl-fs'
import { mkdirpSync } from 'fs-extra'
import { existsSync } from 'fs'
import through from 'through2'
import emptyDir from 'empty-dir'
import inquirer from 'inquirer'

import { info, successStart, log, templateExistTip, existTip } from './prompt'
import data from './data'

const mapData = data.reduce((r, v) => ({ ...r, [v.name]: v }), {})

const template = (dest, cwd) => {
    log('')
    return through.obj(function(file, enc, cb) {
        if (!file.stat.isFile()) {
            return cb()
        }

        info('create', file.path.replace(cwd + '/', ''))
        this.push(file)
        cb()
    })
}

const init = () => {
    console.log('sssss')

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'name',
                message: 'choose boilerplate?',
                choices: Object.keys(mapData),
            },
        ])
        .then(({ name }) => {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'appName',
                        message: 'input project name?',
                        default: name,
                        validate: val => (val === '' ? 'not empty!' : true),
                    },
                    {
                        type: 'confirm',
                        name: 'install',
                        message: 'download dependency?',
                        default: true,
                    },
                ])
                .then(({ appName, install }) => {
                    const dest = join(process.cwd(), appName)

                    if (existsSync(dest)) {
                        existTip()
                    }

                    const target = mapData[name].alias
                    const cwd = join(__dirname, '../boilerplates', target)

                    // 当前选中额模板是否存在
                    if (!existsSync(cwd)) {
                        templateExistTip()
                    }

                    mkdirpSync(dest)
                    process.chdir(dest)

                    if (!emptyDir.sync(dest)) {
                        existTip()
                    }

                    log(`Creating a new ${target} app in ${dest}.`)
                    log()

                    vfs.src(['**/*', '!node_modules/**/*'], { cwd: cwd, cwdbase: true, dot: true })
                        .pipe(template(dest, cwd))
                        .pipe(vfs.dest(dest))
                        .on('end', function() {
                            if (install) {
                                info('run', 'npm install')
                                require('./install').default(() => successStart(target, dest))
                            } else {
                                successStart(target, dest)
                            }
                        })
                        .resume()
                })
        })
}

export default init
