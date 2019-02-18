import which from 'which'

import { log } from './prompt'

/**
 * 启动命令
 */
function runCmd(cmd, args, fn) {
    args = args || []
    let runner = require('child_process').spawn(cmd, args, {
        // keep color
        stdio: 'inherit',
    })
    runner.on('close', function(code) {
        if (fn) {
            fn(code)
        }
    })
}

/**
 * 是否安装npm
 * */
const findNpm = () => {
    let npms = process.platform === 'win32' ? ['yarn.cmd', 'npm.cmd', 'cnpm.cmd'] : ['yarn', 'cnpm', 'npm']
    for (let i = 0; i < npms.length; i++) {
        try {
            which.sync(npms[i])
            log('use npm: ' + npms[i])
            return npms[i]
        } catch (e) {
            log(e)
        }
    }
    throw new Error('please install npm')
}

/**
 * 是否安装git
 * */
const findGit = () => {
    let git = `git${process.platform === 'win32' ? '.cmd' : ''}`
    try {
        which.sync(git)
        return git
    } catch (e) {
        log(e)
    }
    throw new Error('please install git')
}

/**
 * 下载样板以及依赖
 * */
const install = ({ projectName, install, gitPath }, done) => {
    const git = findGit()

    // 克隆样板
    runCmd(which.sync(git), ['clone', gitPath, projectName], function() {
        log('git clone end!')
        log()

        // 是否下载
        if (install) {
            const npm = findNpm()
            runCmd(which.sync(npm), ['install'], function() {
                log(`${npm} install end!`)
                log()
                done()
            })
        } else {
            done()
        }
    })
}

export default install
