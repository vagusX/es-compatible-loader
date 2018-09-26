const path = require('path')
const compiler = require('@webpack-contrib/test-utils')

describe('es-compatible-loader', () => {
  it('development mode output normal with warnings', async () => {
    let stats = await compiler(
      'example.js',
      getLoaderConfig({ mode: 'development' })
    )

    stats = stats.toJson({ errorDetails: false })
    expect(stats).toHaveProperty('warnings')
    expect(Array.isArray(stats.warnings)).toBe(true)

    const warnings = stats.warnings[0].split('\n')

    expect(warnings[1]).toMatch(
      /^Module Warning \(from .+\/es-compatible-loader\/index\.js\):$/
    )
    expect(warnings[2]).toMatch(/^Found these es6 keywords: const$/)

    const output = stats.modules[0].source
    expect(output.length).toBeGreaterThan(0)
  })

  it('production mode output empty and throws', async () => {
    let stats = await compiler(
      'example.js',
      getLoaderConfig({ mode: 'production' })
    )

    stats = stats.toJson({ errorDetails: false })
    expect(stats).toHaveProperty('errors')
    expect(Array.isArray(stats.errors)).toBe(true)

    const errors = stats.errors[0].split('\n')

    expect(errors[1]).toMatch(
      /^Module Error \(from .+\/es-compatible-loader\/index\.js\):$/
    )
    expect(errors[2]).toMatch(/^Found these es6 keywords: const$/)

    const output = stats.modules[0].source
    expect(output.length).toEqual(0)
  })
})

function getLoaderConfig(options) {
  return {
    rules: [
      {
        test: /\.js/,
        include: [/node_modules/, /test/],
        use: {
          loader: path.resolve(__dirname, '../index.js'),
          options
        }
      }
    ]
  }
}
