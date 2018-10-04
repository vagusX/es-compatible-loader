const { getOptions } = require('loader-utils')
const validateOpts = require('schema-utils')
const esprima = require('esprima')

const { name: loaderName } = require('./package.json')
const schema = require('./schema.json')

const es2015Reserved = [
  // 'default', 'import', 'export',
  'class',
  'const',
  'extends',
  'static',
  'super'
]

const es2015ReservedRegex = es2015Reserved.map(
  keyword => new RegExp(`${keyword}\\s+`, 'g')
)

// const es2017Reserved = ['async', 'await']

/**
 * 正则检测 es6 keywords
 * esprima 检测语法树
 * 过滤掉注释(esprisma 自带过滤评论)
 * 获取包名和文件名
 * 缓存 webpack 默认自带缓存
 * 由于 webpack 可自行处理 import/export 因此可以忽略 import/export/default
 * 出错文件行数
 */
module.exports = function loader (source) {
  const options = getOptions(this)
  validateOpts(schema, options, loaderName)

  if (es2015ReservedRegex.some(regex => regex.test(source))) {
    const tree = esprima.tokenize(source, { loc: true })
    const keywordNodes = tree.filter(n => n.type === 'Keyword')
    const reversedKeywordNodes = keywordNodes.filter(
      n => es2015Reserved.indexOf(n.value) > -1
    )
    if (reversedKeywordNodes.length) {
      const unexpectedKeywords = reversedKeywordNodes
        .map(n => `${n.value} at line: ${n.loc.start.line} column: ${n.loc.start.column}`)
        .join('\n')

      const error = new Error(`Found these es6 keywords: ${unexpectedKeywords}`)
      if (options.hintLevel === 'error') {
        this.emitError(error)
        return ''
      }
      this.emitWarning(error)
    }
  }

  return source
}
