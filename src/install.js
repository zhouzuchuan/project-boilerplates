import which from 'which'

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

const findNpm = () => {
    let npms = process.platform === 'win32' ? ['tnpm.cmd', 'cnpm.cmd', 'npm.cmd'] : ['tnpm', 'cnpm', 'npm']
    for (let i = 0; i < npms.length; i++) {
        try {
            which.sync(npms[i])
            console.log('use npm: ' + npms[i])
            return npms[i]
        } catch (e) {
            console.log(e)
        }
    }
    throw new Error('please install npm')
}

const install = done => {
    const npm = findNpm()
    runCmd(which.sync(npm), ['install'], function() {
        console.log(npm + ' install end')
        done()
    })

    // runCmd(which.sync(npm), ['install'], function() {
    //     runCmd(which.sync(npm), ['install', 'react-enhanced', '--save'], function() {
    //         console.log(npm + ' install end');
    //         done();
    //     });
    // });
}

export default install