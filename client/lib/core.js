const shell = require('shelljs')
const http = require("http");
const https = require("https");
const concat = require("concat-stream");
const path = require('path');

const { fs, vol } = require('memfs');

module.exports = async (projectDir, resources) => {
    const { dependencies, devDependencies, files } = resources;

    return new Promise((resolve) => {
        const deps = dependencies.join(" ")
        const devDeps = devDependencies.join(" ")

        shell.cd(projectDir)

        if (dependencies.length != 0 || devDependencies.length != 0) {
            shell.exec(`npm install ${deps}`, function (code, stdout, stderr) {
                console.log('Exit code:', code);
                console.log('Program output:', stdout);
                console.log('Program stderr:', stderr);

                if (!stderr) {
                    shell.exec(`npm install --save-dev ${devDeps}`, function (code_, stdout_, stderr_) {

                        console.log('Exit code:', code_);
                        console.log('Program output:', stdout_);
                        console.log('Program stderr:', stderr_);


                        if (stderr_) {
                            resolve()
                        }
                    });
                }
            });
        } else {
            resolve()
        }

    }).then(async (resolve, reject) => {
        let promises = [];
        for (let i = 0; i < files.length; i++) {

            const promise_ = new Promise((res, rej) => {
                const file = files[i];
                let node_http = file.url.includes('https') ? https : http;
                node_http.get(file.url, (req) => {
                    if (req.statusCode == 200) {

                        req.setEncoding("utf8");
                        req.pipe(concat({ encoding: "string" }, function (remoteSrc) { 
                            let to = path.join(process.cwd(), file.to);
                            vol.writeFileSync(file.to, remoteSrc)
                        }))
                        res( {file: file.to, type: file.type})
                    } else {
                        rej()
                    }
                })
            })

            promises.push(promise_)
        }

        return Promise.all(promises)
    })
}