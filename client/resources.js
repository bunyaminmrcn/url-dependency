const file_types = require('./types')

module.exports = {
    dependencies: [],
    devDependencies: [],
    files: [
        {
            url: 'http://localhost:4000/files?download_path=storage&file=index.js',
            type: file_types.REGULAR,
            to: '/index.js'
        }
    ]
}