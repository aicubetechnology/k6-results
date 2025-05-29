import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL } from './utils.js';

/**
 * Teste específico para o endpoint de estatísticas de tenant usando API key
 * 
 * Este teste foca exclusivamente no endpoint /admin/tenant/{tenant_id}/stats
 * usando uma API key que sabemos que funciona.
 */
export const options = {
  vus: 1,
  iterations: 3,
  thresholds: {
    http_req_failed: ['rate<1'], // Permite falhas enquanto debugamos
  },
};

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

export default function() {
  const url = `${API_BASE_URL}/admin/tenant/${TENANT_ID}/stats`;
  const headers = getApiKeyHeaders();
  
  console.log(`Testando endpoint: ${url}`);
  console.log(`Usando tenant ID: ${TENANT_ID}`);
  console.log(`API key: ${API_KEY}`);
  
  const res = http.get(url, { headers });
  
  console.log(`Resposta: Status ${res.status}`);
  console.log(`Corpo da resposta: ${res.body}`);
  
  check(res, {
    'resposta recebida': (r) => r.status !== 0,
    'status é 200': (r) => r.status === 200,
  });
  
  if (res.status === 200) {
    const body = JSON.parse(res.body);
    check(body, {
      'total_memories existe': (r) => r.total_memories !== undefined,
      'agent_count existe': (r) => r.agent_count !== undefined,
      'agent_distribution existe': (r) => r.agent_distribution !== undefined,
    });
    console.log(`Tenant ${TENANT_ID} tem ${body.total_memories} memórias e ${body.agent_count} agentes`);
  }
  
  // Adicionando sleep para facilitar leitura dos logs
  sleep(2);
}