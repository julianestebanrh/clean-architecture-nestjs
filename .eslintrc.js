module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // Reglas de TypeScript desactivadas
    '@typescript-eslint/interface-name-prefix': 'off',      // Permite nombres de interfaces sin el prefijo 'I' (ej: permite 'User' en vez de forzar 'IUser')
    '@typescript-eslint/explicit-function-return-type': 'off', // No requiere tipo de retorno explícito en funciones (lo infiere automáticamente)
    '@typescript-eslint/explicit-module-boundary-types': 'off', // No requiere tipos explícitos en métodos públicos de clases/módulos
    '@typescript-eslint/no-explicit-any': 'off',           // Permite el uso de 'any' cuando sea necesario
    '@typescript-eslint/no-unused-vars': 'off',            // No se queja por variables declaradas pero no usadas
    '@typescript-eslint/no-empty-function': 'off',         // Permite funciones vacías (útil para implementaciones por defecto)
    '@typescript-eslint/no-empty-interface': 'off',        // Permite interfaces vacías (útil para tipos marcador o futura extensión)
    '@typescript-eslint/no-unsafe-function-type': 'off',   // Permite el uso del tipo 'Function' (aunque es mejor especificar tipos)

    // Desactivar todas las reglas de estilo
    'prettier/prettier': 'off',          // Desactiva todas las reglas de formato de Prettier
    'import/order': 'off',              // No fuerza un orden específico en las declaraciones de import
    // 'import/first': 'off',              // No requiere que los imports estén primero en el archivo
    'import/newline-after-import': 'off', // No requiere línea en blanco después de imports
    'no-multiple-empty-lines': 'off',    // Permite múltiples líneas en blanco seguidas
    'no-trailing-spaces': 'off',         // Permite espacios al final de las líneas
    'comma-dangle': 'off',              // Permite o no comas al final de listas/objetos
    'semi': 'off',                      // No fuerza el uso de punto y coma
    'quotes': 'off',                    // Permite usar comillas simples o dobles
    'indent': 'off',                    // No fuerza un estilo específico de indentación

    // Solo mantener reglas críticas
    'no-unreachable': 'error',        // Código inalcanzable
    'no-unreachable-loop': 'error',   // Bucles que nunca se ejecutan
    'no-return-await': 'error',       // Return await innecesario

    // Reglas de Clean Architecture - Las más importantes
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          // Domain Layer: No puede importar de ninguna otra capa
          {
            target: './src/domain',
            from: './src/(application|infrastructure|web-api)',
            message: 'Domain Layer no puede importar de otras capas'
          },
          // Application Layer: Solo puede importar de Domain
          {
            target: './src/application',
            from: './src/(infrastructure|web-api)',
            message: 'Application Layer solo puede importar de Domain Layer'
          },
          // Infrastructure Layer: No puede importar de Web API
          {
            target: './src/infrastructure',
            from: './src/web-api',
            message: 'Infrastructure Layer no puede importar de Web API Layer'
          },
          // Web API Layer: Solo puede importar de Application
          {
            target: './src/web-api',
            from: './src/(domain|infrastructure)',
            message: 'Web API Layer solo puede importar de Application Layer'
          }
        ]
      }
    ]
  }
};
