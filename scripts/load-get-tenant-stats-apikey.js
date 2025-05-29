import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL } from './utils.js';

// Configurações específicas para este teste
const TENANT_ID = 'gdias_tenant';
const API_KEY = process.env.API_KEY || 'API_KEY_PLACEHOLDER';

// Função para obter headers com API key
function getApiKeyHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  };
}

export const options = {
  vus: 10, // 10 usuários virtuais
  duration: '10s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // Falha HTTP deve ser menor que 1%
    http_req_duration: ['p(95)<500'], // 95% das solicitações devem completar em menos de 500ms
  },
};

export default function() {
  const url = `${API_BASE_URL}/admin/tenant/${TENANT_ID}/stats`;
  
  const res = http.get(url, { headers: getApiKeyHeaders() });
  
  check(res, {
    'Status is 200': (r) => r.status === 200
  });
  
  // Adicionando um sleep curto para não sobrecarregar
  sleep(0.5);
}