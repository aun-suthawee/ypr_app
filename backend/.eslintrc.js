module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'script', // Use 'script' for CommonJS
  },
  rules: {
    // Allow require() in Node.js
    '@typescript-eslint/no-var-requires': 'off',
    'no-undef': 'off',
    
    // Common Node.js patterns
    'no-unused-vars': ['warn', { 
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_'
    }],
    
    // Allow console in backend
    'no-console': 'off',
    
    // Allow process.exit
    'no-process-exit': 'off'
  },
  globals: {
    process: 'readonly',
    __dirname: 'readonly',
    __filename: 'readonly',
    module: 'readonly',
    require: 'readonly',
    exports: 'readonly',
    global: 'readonly',
    Buffer: 'readonly'
  }
};
