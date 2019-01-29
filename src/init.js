import { join } from 'path'
import vfs from 'vinyl-fs'
import { existsSync } from 'fs'
import through from 'through2'
import emptyDir from 'empty-dir'

import { info, successStart, log, templateExistTip, existTip } from './prompt'

const init = program => {
    const { target = 'vue', install } = program

    const dest = process.cwd()

    const cwd = join(__dirname, '../boilerplates', target)

    // 当前选中额模板是否存在
    if (!existsSync(cwd)) {
        templateExistTip()
    }

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
}

function template(dest, cwd) {
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

export default init
