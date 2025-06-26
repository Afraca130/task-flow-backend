const moduleAlias = require('module-alias');
const path = require('path');

// 경로 설정
const rootPath = path.resolve(__dirname, '..');

moduleAlias.addAliases({
    '@src': path.join(rootPath, 'dist'),
    '@': path.join(rootPath, 'dist'),
    '@libs': path.join(rootPath, 'dist/common'),
    '@common': path.join(rootPath, 'dist/common'),
});

module.exports = moduleAlias;
