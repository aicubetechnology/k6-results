import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, TEST_TENANT_ID } from './utils.js';

/**
 * Teste específico para o endpoint de estatísticas de tenant
 * 
 * Este teste foca exclusivamente no endpoint /admin/tenant/{tenant_id}/stats
 * para facilitar a depuração de problemas de autenticação.
 */
export const options = {
  vus: 1,
  iterations: 3,
  thresholds: {
    http_req_failed: ['rate<1'], // Permite falhas enquanto debugamos
  },
};

export default function() {
  const url = `${API_BASE_URL}/admin/tenant/${TEST_TENANT_ID}/stats`;
  const headers = getHeaders();
  
  console.log(`Testando endpoint: ${url}`);
  console.log(`Usando tenant ID: ${TEST_TENANT_ID}`);
  console.log(`Token de autorização: ${headers.Authorization.substring(0, 30)}...`);
  
  const res = http.get(url, { headers });
  
  console.log(`Resposta: Status ${res.status}`);
  console.log(`Corpo da resposta: ${res.body}`);
  
  check(res, {
    'resposta recebida': (r) => r.status !== 0,
  });
  
  // Adicionando sleep para facilitar leitura dos logs
  sleep(2);
}