const path = require('path')
const compiler = require('@webpack-contrib/test-utils')

describe('es-compatible-loader', () => {
  it('hintLevel#warning output normal with warnings', async () => {
    let stats = await compiler(
      'example.js',
      getLoaderConfig({ hintLevel: 'warning' })
    )

    stats = stats.toJson({ errorDetails: false })
    expect(stats).toHaveProperty('warnings')
    expect(Array.isArray(stats.warnings)).toBe(true)
    expect(stats.warnings.length).toBe(1)

    const warnContent = stats.warnings[0].split('\n')

    expect(warnContent[1]).toMatch(
      /^Module Warning \(from .+\/es-compatible-loader\/index\.js\):$/
    )
    expect(warnContent[2]).toMatch(
      /^Found these es6 keywords: const at line:.+column:.+$/
    )

    const emptyModules = stats.modules.filter(n => !n.source)
    expect(emptyModules.length).toBe(0)
  })

  it('hintLevel#error output empty and throws', async () => {
    let stats = await compiler(
      'example.js',
      getLoaderConfig({ hintLevel: 'error' })
    )

    stats = stats.toJson({ errorDetails: false })
    expect(stats).toHaveProperty('errors')
    expect(Array.isArray(stats.errors)).toBe(true)
    expect(stats.errors.length).toBe(1)

    const errorContent = stats.errors[0].split('\n')

    expect(errorContent[1]).toMatch(
      /^Module Error \(from .+\/es-compatible-loader\/index\.js\):$/
    )
    expect(errorContent[2]).toMatch(
      /^Found these es6 keywords: const at line:.+column:.+$/
    )

    const emptyModules = stats.modules.filter(n => !n.source)
    expect(emptyModules.length).toBe(1)
    expect(emptyModules[0].name).toMatch(/query-string/)
  })
})

function getLoaderConfig (options) {
  return {
    rules: [
      {
        test: /\.js/,
        include: [/node_modules/],
        use: {
          loader: path.resolve(__dirname, '../index.js'),
          options
        }
      }
    ]
  }
}
