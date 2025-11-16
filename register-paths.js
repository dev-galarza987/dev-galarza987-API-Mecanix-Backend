const tsNode = require('ts-node');

const options = {
  transpileOnly: true,
  compilerOptions: {
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    module: 'commonjs',
    target: 'es2020',
    skipLibCheck: true,
    strictPropertyInitialization: false,
    baseUrl: '.',
    paths: {
      'src/*': ['./src/*']
    },
    esModuleInterop: true,
    allowSyntheticDefaultImports: true
  }
};

tsNode.register(options);