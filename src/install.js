import which from 'which'
import { existsSync } from 'fs'
import { log, error } from './prompt'

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
    let npms = process.platform === 'win32' ? ['cnpm.cmd', 'yarn.cmd', 'npm.cmd'] : ['cnpm', 'yarn1', 'npm1']
    for (let i = 0; i < npms.length; i++) {
        try {
            which.sync(npms[i])
            log('use npm: ' + npms[i])
            return npms[i]
        } catch (e) {
            log('')
        }
    }
}

/**
 * 是否安装git
 * */
const findGit = () => {
    let git = 'git'

    try {
        which.sync(git)
        return git
    } catch (e) {
        log(e)
        log('')
        error('   please install git')
    }
}

/**
 * 下载样板以及依赖
 * */
const install = ({ projectName, install, projectConfig }, done) => {
    const git = findGit()

    // 克隆样板
    runCmd(which.sync(git), ['clone', '--depth=1', projectConfig.git, projectName], function() {
        if (!existsSync(projectName)) {
            log('')
            error('   git clone failed! please check... ')
            log('')
            log(`   project url: ${projectConfig.home}`)
            log('')
            process.exit(1)
        } else {
            log('')
            log('git clone end!')
            log('')
        }

        // 是否下载
        if (install) {
            process.chdir(projectName)
            const npm = findNpm()

            if (npm) {
                runCmd(which.sync(npm), ['install'], function() {
                    log(`${npm} install end!`)
                    log()
                    done()
                })
            } else {
                error('  please install npm')
                log('')
                log('')
                log('')
                log('')
            }
        } else {
            done()
        }
    })
}

export default install
