/**
 * Tests para validar las reglas de la Arquitectura Limpia
 * 
 * Estas pruebas verifican que se cumplan las reglas de dependencia entre capas:
 * 1. Domain Layer: No puede importar de ninguna otra capa
 * 2. Application Layer: Solo puede importar de Domain
 * 3. Infrastructure Layer: Puede importar de Domain y Application
 * 4. Web API Layer: Solo puede importar de Application
 */

import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';

describe('Clean Architecture Rules', () => {
  // Configuración de rutas base
  const ROOT_DIR = path.resolve(__dirname, '..');  // Directorio raíz del proyecto
  const SRC_DIR = path.join(ROOT_DIR, 'src');     // Directorio donde está el código fuente

  /**
   * Obtiene todos los archivos TypeScript de una capa específica
   * @param layer - Nombre de la capa (domain, application, infrastructure, web-api)
   * @returns Lista de rutas absolutas a los archivos
   * 
   * Excluye:
   * - Archivos de test (*.spec.ts, *.test.ts)
   * - Archivos index.ts
   */
  const getLayerFiles = (layer: string): string[] => {
    const pattern = path.join(SRC_DIR, layer, '**/*.ts');
    return glob.sync(pattern, {
      ignore: ['**/*.spec.ts', '**/*.test.ts', '**/index.ts']
    });
  };

  /**
   * Lee el contenido de un archivo
   * @param file - Ruta absoluta al archivo
   * @returns Contenido del archivo como string
   */
  const readFileContent = (file: string): string => {
    return fs.readFileSync(file, 'utf-8');
  };

  /**
   * Extrae todas las declaraciones de importación de un archivo
   * @param content - Contenido del archivo
   * @returns Array con las rutas de los imports encontrados
   * 
   * Ejemplo:
   * Para el código: import { Something } from '@domain/something'
   * Retorna: ['@domain/something']
   */
  const extractImports = (content: string): string[] => {
    const importRegex = /from\s+['"]([^'"]+)['"]/g;
    const imports: string[] = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  };

  /**
   * Determina a qué capa pertenece un import
   * @param importPath - Ruta del import a analizar
   * @returns Nombre de la capa o null si no pertenece a ninguna
   * 
   * Maneja tres tipos de imports:
   * 1. Imports con alias: @domain/entity -> 'domain'
   * 2. Imports relativos: '../something' -> null (se asume que es de la misma capa)
   * 3. Imports absolutos: 'src/domain/entity' -> 'domain'
   */
  const getImportLayer = (importPath: string): string | null => {
    if (importPath.startsWith('@')) {
      // Imports con alias (@domain, @application, etc)
      const parts = importPath.split('/');
      return parts[0].replace('@', '');
    } else if (importPath.startsWith('.')) {
      // Imports relativos, los ignoramos ya que son dentro de la misma capa
      return null;
    } else if (!importPath.includes('node_modules')) {
      // Si no es un import de node_modules y no es relativo, podría ser un import absoluto
      const parts = importPath.split('/');
      if (parts[0] === 'src') {
        return parts[1];
      }
    }
    return null;
  };

  /**
   * Valida que los imports de un archivo cumplan con las reglas de arquitectura
   * @param file - Ruta del archivo a validar
   * @param allowedLayers - Lista de capas desde las que se permite importar
   * 
   * Si encuentra imports no permitidos, lanza un error con el detalle de las violaciones
   */
  const validateImports = (file: string, allowedLayers: string[]) => {
    const content = readFileContent(file);
    const imports = extractImports(content);
    
    // Encuentra imports que vienen de capas no permitidas
    const invalidImports = imports
      .map(imp => ({ import: imp, layer: getImportLayer(imp) }))
      .filter(({ layer }) => layer && !allowedLayers.includes(layer));

    // Si hay violaciones, muestra un error detallado
    const relativePath = path.relative(ROOT_DIR, file);
    if (invalidImports.length > 0) {
      fail(`${relativePath} tiene imports no permitidos: ${invalidImports.map(i => i.import).join(', ')}`);
    }
  };

  // Tests para Domain Layer
  describe('Domain Layer', () => {
    const domainFiles = getLayerFiles('domain');

    it('no debe importar de ninguna otra capa', () => {
      // Domain es la capa más interna, no puede importar de ninguna otra
      domainFiles.forEach(file => {
        validateImports(file, ['domain']);
      });
    });
  });

  // Tests para Application Layer
  describe('Application Layer', () => {
    const applicationFiles = getLayerFiles('application');

    it('solo debe importar del Domain Layer', () => {
      // Application solo puede importar de Domain y de sí misma
      applicationFiles.forEach(file => {
        validateImports(file, ['domain', 'application']);
      });
    });
  });

  // Tests para Infrastructure Layer
  describe('Infrastructure Layer', () => {
    const infrastructureFiles = getLayerFiles('infrastructure');

    it('puede importar de Domain y Application, pero no de Web API', () => {
      // Infrastructure puede importar de Domain, Application y de sí misma
      infrastructureFiles.forEach(file => {
        validateImports(file, ['domain', 'application', 'infrastructure']);
      });
    });
  });

  // Tests para Web API Layer
  describe('Web API Layer', () => {
    const webApiFiles = getLayerFiles('web-api');

    it('solo debe importar de Application', () => {
      // Web API solo puede importar de Application y de sí misma
      // No debe importar directamente de Domain para mantener la separación de capas
      webApiFiles.forEach(file => {
        validateImports(file, ['application', 'web-api']);
      });
    });
  });
});