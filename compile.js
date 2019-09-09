const fs = require('fs')
const os = require('os')
const path = require('path')
const child_process = require('child_process')
const util = require('util')
// const npm = require('npm')
// import os from 'os'

let ENV = function () { }
ENV.prototype.Dev = 'dev'
ENV.prototype.Test = 'test'
ENV.prototype.Prod = 'prod'


// const _compileWin32 = () => {
// child_process.spawnSync("./node_modules/.bin/tsc")
// npm.commands["run-script"]("_compile", (err) => {
//     if (err) console.log("could not compile: ", err.message); else console.log("compile done");
// })
// }

// const _compileUnix = () => {
// child_process.spawnSync("./node_modules/.bin/tsc")
// npm.commands["run-script"]("_compile", (err) => {
//     if (err) console.log("could not compile: ", err.message); else console.log("compile done");
// })
// }

const _rm_rf_async = (dir) => {
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach(fd => {
            let _cur = path.join(dir, fd)
            if (fs.lstatSync(_cur).isDirectory()) { // recurse
                _rm_rf_async(_cur);
            } else {
                // delete fd
                fs.unlinkSync(_cur);
            }
        });
        fs.rmdirSync(dir);
    }
}

const _clear = () => {
    try {
        _rm_rf_async("./dist")
        console.log("clear done");
    } catch (err) {
        console.log("could not rmdir: ", err);
    }
}

const _compile = async () => {

    const exec = util.promisify(child_process.exec)
    try {
        console.log("compiling");
        let cmd = path.resolve(".", "node_modules", ".bin", "tsc")
        let { stdout, stderr } = await exec(cmd)
        if (stderr) console.log(`could not compile: ${stderr}`)
        if (stdout) console.log(`compile output: ${stdout}`)

        // const child = child_process.spawn("./node_modules/.bin/tsc")
        // child.on("exit", () => {
        //     console.log("child process exit")
        // })
        // child.on("error", (err) => {
        //     console.log("compile encounter an err: ", err)
        // })
        // process.stdin.pipe(child.stdin)
        // for (const data of child) {
        //     console.log(`compile output: ${data}`)
        // }
        // console.log("compile done")
    } catch (err) {
        console.log("could not compiled: ", err)
        return
    }
}

/**
 * compile command called './node_modules/.bin/tsc'
 */
const compile = () => {
    let { NODE_ENV } = process.env

    if (NODE_ENV === undefined || NODE_ENV === '') {
        // true: empty value or not set
        process.env.NODE_ENV = ENV.Dev
    }

    // get os, call specified _compile
    let _os = os.platform()
    console.log("current os:", _os)

    // rm ./dist folder
    _clear()
    // fork a process and compile *.ts file
    _compile()
    // switch (_os) {
    //     case 'win32':
    //         // win32 os
    //         _compileWin32()
    //         break
    //     default:
    //         // unix os
    //         _compileUnix()
    //         break
    // }
    // console.log("command done");
}

compile()