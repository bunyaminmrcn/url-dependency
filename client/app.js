const vm = require("vm");

const downloader = require('./lib/core');
const resources = require('./resources');
const { fs } = require('memfs');
const file_types = require('./types')

downloader(__dirname, resources).then(res => {
    
    for (let i = 0; i < res.length; i++) {
        const mod = res[i];
        const context = fs.readFileSync(mod.file, 'utf8');
        
        if(mod.type == file_types.REGULAR) {
            vm.runInThisContext(context);
        }
    }

}).catch(err => err)