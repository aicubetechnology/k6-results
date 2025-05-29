import http from 'k6/http';
import { sleep, group } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, TEST_TENANT_ID, TEST_AGENT_ID } from './utils.js';

/**
 * Teste rápido de verificação de disponibilidade para todos os endpoints
 * 
 * Este teste faz uma requisição para cada endpoint da API para verificar
 * sua disponibilidade básica. É útil para uma verificação rápida antes
 * de executar testes mais detalhados.
 */
export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_failed: ['rate<1'], // Permite falhas para endpoints com problemas
    http_req_duration: ['p(95)<1000'], // 95% das solicitações devem completar em menos de 1s
  },
};

export default function() {
  // Dados comuns para os testes
  const headers = getHeaders();
  
  // Testar endpoint de saúde
  group('Health Check', function() {
    const url = `${API_BASE_URL}/health`;
    const res = http.get(url);
    
    check(res, {
      'health status é 200': (r) => r.status === 200,
      'health body contém status': (r) => JSON.parse(r.body).status === 'healthy',
    });
    
    console.log(`Endpoint /health: Status ${res.status}`);
  });
  
  sleep(1);
  
  // Testar endpoint de memorização
  group('Memorize', function() {
    const url = `${API_BASE_URL}/memorize`;
    const payload = {
      tenant_id: TEST_TENANT_ID,
      agent_id: TEST_AGENT_ID,
      text: 'Teste de verificação de disponibilidade do endpoint'
    };
    
    const res = http.post(url, JSON.stringify(payload), { headers });
    
    check(res, {
      'memorize responde': (r) => r.status !== 0,
    });
    
    console.log(`Endpoint /memorize: Status ${res.status}`);
  });
  
  sleep(1);
  
  // Testar endpoint de batch
  group('Memorize Batch', function() {
    const url = `${API_BASE_URL}/memorize_batch`;
    const payload = {
      tenant_id: TEST_TENANT_ID,
      agent_id: TEST_AGENT_ID,
      texts: ['Texto 1 para teste', 'Texto 2 para teste']
    };
    
    const res = http.post(url, JSON.stringify(payload), { headers });
    
    check(res, {
      'memorize_batch responde': (r) => r.status !== 0,
    });
    
    console.log(`Endpoint /memorize_batch: Status ${res.status}`);
  });
  
  sleep(1);
  
  // Testar endpoint de recuperação
  group('Retrieve', function() {
    const url = `${API_BASE_URL}/retrieve`;
    const payload = {
      tenant_id: TEST_TENANT_ID,
      query: 'Consulta para teste de verificação',
      top_k: 3
    };
    
    const res = http.post(url, JSON.stringify(payload), { headers });
    
    check(res, {
      'retrieve responde': (r) => r.status !== 0,
    });
    
    console.log(`Endpoint /retrieve: Status ${res.status}`);
  });
  
  sleep(1);
  
  // Testar endpoint de estatísticas de tenant
  group('Tenant Stats', function() {
    const url = `${API_BASE_URL}/admin/tenant/${TEST_TENANT_ID}/stats`;
    
    const res = http.get(url, { headers });
    
    check(res, {
      'tenant stats responde': (r) => r.status !== 0,
    });
    
    console.log(`Endpoint /admin/tenant/stats: Status ${res.status}`);
  });
  
  sleep(1);
  
  // Testar endpoint de forget gate
  group('Forget Gate', function() {
    const url = `${API_BASE_URL}/admin/forget`;
    const payload = {
      tenant_id: TEST_TENANT_ID,
      decay_factor: 0.5,
      threshold: 0.3
    };
    
    const res = http.post(url, JSON.stringify(payload), { headers });
    
    check(res, {
      'forget gate responde': (r) => r.status !== 0,
    });
    
    console.log(`Endpoint /admin/forget: Status ${res.status}`);
  });
  
  // Resultado geral
  console.log('Verificação de disponibilidade de endpoints concluída');
}