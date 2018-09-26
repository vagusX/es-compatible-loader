# ES Compatible Loader

![NPM](https://img.shields.io/npm/v/es-compatible-loader.svg)
[![CircieCI Build](https://img.shields.io/circleci/project/github/vagusX/es-compatible-loader.svg)](https://circleci.com/gh/vagusX/es-compatible-loader)
[![Coverage](https://img.shields.io/codecov/c/github/vagusX/es-compatible-loader.svg)](https://codecov.io/gh/vagusX/es-compatible-loader)
[![NPM Downloads](https://img.shields.io/npm/dm/es-compatible-loader.svg)](https://www.npmjs.com/package/es-compatible-loader)
[![Greenkeeper badge](https://badges.greenkeeper.io/vagusX/es-compatible-loader.svg)](https://greenkeeper.io/)

## Installation

```bash
$ npm install es-compatible-loader --save-dev
```

## Usage

```js
  // ...webpack config
  rules: [
    {
      test: /\.js/,
      include: [/node_modules/, /test/],
      use: {
        loader: 'es-compatible-loader',
        options: {
          hintLevel: 'error' | 'warning'
        }
      }
    }
  ]
```

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
