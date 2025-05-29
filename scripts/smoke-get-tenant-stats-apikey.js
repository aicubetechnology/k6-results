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
  vus: 1,
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
  
  if (res.status === 200) {
    const body = JSON.parse(res.body);
    check(body, {
      'total_memories exists': (r) => r.total_memories !== undefined,
      'agent_count exists': (r) => r.agent_count !== undefined,
      'agent_distribution exists': (r) => r.agent_distribution !== undefined,
    });
    console.log(`Tenant ${TENANT_ID} has ${body.total_memories} memories and ${body.agent_count} agents`);
  } else {
    console.log(`Error: Status ${res.status} - ${res.body}`);
  }
  
  sleep(1);
}