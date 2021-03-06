import chalk from 'chalk'
import pkg from '../package.json'

export const logo = () => {
    console.log()
    console.log(
        chalk.green(
            `
 
             _______  ______  
            (  ____ )(  ___ \ 
            | (    )|| (   ) )
            | (____)|| (__/ / 
            |  _____)|  __ (  
            | (      | (  \ \ 
            | )      | )___) )
            |/       |/ \___/ 
                              
            
            
            `,
        ),
    )
    console.log(chalk.green(`project-boilerplates ${chalk.bgGreen(chalk.white(` v${pkg.version} `))}`))
    console.log()
}

/**
 * 当前文件夹存在提示
 *
 * @param {*} message
 */
export const error = message => {
    console.error(chalk.red(message))
}

export const success = message => {
    console.error(chalk.green(message))
}

export const log = message => {
    console.log(message)
}

/**
 *
 * 工程初始化成功启动提示
 *
 * @param {*} projectName
 * @param {*} dest
 */
export const successStart = (projectName, dest) => {
    success(`
    Success! Created ${projectName} at ${dest}.

    Inside that directory, you can run several commands:
    * npm run start: Starts the development server.
    * npm run build: Bundles the app into dist for production.
    * npm run test: Run test.

    We suggest that you begin by typing:
    cd ${dest}
    npm start

    Happy hacking!
    `)
}

/**
 * 文件夹存在 提示
 * */
export const existTip = () => {
    error('Existing files here, please run init command in an empty folder!')
    process.exit(1)
}

/**
 * 样板git path不存在 提示
 */
export const gitPathExistTip = () => {
    error('git path not exists!')
    process.exit(1)
}
