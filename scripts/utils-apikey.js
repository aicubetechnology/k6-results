import { check } from 'k6';

// Constantes da API
export const API_BASE_URL = 'http://130.61.226.26:8000';

// Dados de autenticação API key
export const API_KEY = 'qube_02eee6c231d44324950be28823f9c26e';
export const TENANT_ID = 'gdias_tenant_2';

// Funções utilitárias
export function checkStatus(res, statusCode = 200) {
  return check(res, {
    'Status is correct': (r) => r.status === statusCode
  });
}

export function randomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Dados de teste para o tenant_id usando a API key
export const TEST_AGENT_ID = 'agent_gdias'; // Agent ID já usado no tenant
export const TEST_MEMORY_TEXTS = [
  'O céu é azul quando não há nuvens.',
  'A água ferve a 100 graus Celsius ao nível do mar.',
  'Paris é a capital da França e conhecida como a cidade luz.',
  'O sistema solar tem oito planetas principais orbitando o sol.',
  'A Torre Eiffel foi construída para a Exposição Universal de 1889.'
];

export const TEST_QUERY = 'Quais são os planetas do sistema solar?';

// Headers padrão com API key
export function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  };
}

// Payload padrão para memorize
export function getMemorizePayload(text = null) {
  return {
    tenant_id: TENANT_ID,
    agent_id: TEST_AGENT_ID,
    text: text || TEST_MEMORY_TEXTS[Math.floor(Math.random() * TEST_MEMORY_TEXTS.length)],
    metadata: {
      source: 'k6_test',
      timestamp: new Date().toISOString()
    }
  };
}

// Payload padrão para retrieve
export function getRetrievePayload(query = TEST_QUERY) {
  return {
    tenant_id: TENANT_ID,
    agent_id: TEST_AGENT_ID,
    query: query,
    top_k: 3
  };
}

// Payload padrão para forget
export function getForgetPayload() {
  return {
    tenant_id: TENANT_ID,
    decay_factor: 0.1,
    threshold: 0.5
  };
}