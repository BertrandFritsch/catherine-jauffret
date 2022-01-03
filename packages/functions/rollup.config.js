import cleaner from 'rollup-plugin-cleaner';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: './src/submission-created.ts',
    plugins: [
      cleaner({
        targets: [
          './dist/'
        ]
      }),
      typescript(),
    ],
    output: {
      file: './dist/submission-created.mjs',
      format: 'es'
    },
    external: [
      'node-fetch'
    ]
  }
];
