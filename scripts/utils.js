import { check } from 'k6';

// Constantes da API
export const API_BASE_URL = 'http://130.61.226.26:8000';

/*
 * Token de autenticação:
 * - Token JWT válido obtido da API de autenticação
 * - Usuário: gdias@aicube.ca (ADMIN)
 * - Company ID: cm9c059xt0004waqe2r3gqg39
 * - User ID: cm9c0fp4y000awaqefdsobnwn
 * - Atualizado em: 2025-05-25
 * - Expira em: 2030-05-24 (Token de longa duração para testes)
 */

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

// Dados de teste - usando informações reais do token JWT
export const TEST_TENANT_ID = 'cm9c059xt0004waqe2r3gqg39'; // Company ID do token
export const TEST_AGENT_ID = 'cm9c0fp4y000awaqefdsobnwn'; // User ID do token como agent ID
export const TEST_MEMORY_TEXTS = [
  'O céu é azul quando não há nuvens.',
  'A água ferve a 100 graus Celsius ao nível do mar.',
  'Paris é a capital da França e conhecida como a cidade luz.',
  'O sistema solar tem oito planetas principais orbitando o sol.',
  'A Torre Eiffel foi construída para a Exposição Universal de 1889.'
];

export const TEST_QUERY = 'Quais são os planetas do sistema solar?';

// Headers padrão com token de autenticação
export function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdkaWFzQGFpY3ViZS5jYSIsInJvbGUiOiJBRE1JTiIsImNvbXBhbnlJZCI6ImNtOWMwNTl4dDAwMDR3YXFlMnIzZ3FnMzkiLCJzdWIiOiJjbTljMGZwNHkwMDBhd2FxZWZkc29ibnduIiwiZXhwIjoxNzQ4MTg4MTQ1fQ.z0diwP4b0E5bUicJ9vSTC1lWjnSB-Ny9N-tLZyPWsa8' // Token JWT válido atualizado
  };
}

// Payload padrão para memorize
export function getMemorizePayload(text = null) {
  return {
    tenant_id: TEST_TENANT_ID,
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
    tenant_id: TEST_TENANT_ID,
    agent_id: TEST_AGENT_ID,
    query: query,
    top_k: 3
  };
}