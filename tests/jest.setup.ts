import 'reflect-metadata'; // Necesario si usas TypeDI o similar

beforeAll(async () => {
  // Configuración global antes de todos los tests
  // Por ejemplo, conexión a base de datos de test
});

afterAll(async () => {
  // Limpieza después de todos los tests
  // Por ejemplo, cerrar conexiones de DB
});

beforeEach(async () => {
  // Configuración antes de cada test
  // Por ejemplo, limpiar la base de datos
});

afterEach(async () => {
  // Limpieza después de cada test
  jest.clearAllMocks();
});

// Configuración global de timeouts
jest.setTimeout(10000); 