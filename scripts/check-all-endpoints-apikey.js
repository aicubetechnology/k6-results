import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, TENANT_ID } from './utils-apikey.js';

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_failed: ['rate<0.1'], // Permitimos algumas falhas neste teste abrangente
  },
};

// Variáveis para armazenar IDs criados durante o teste
let createdMemoryId;
let batchMemoryIds = [];

export default function() {
  // 1. Testar o endpoint de estatísticas do tenant
  console.log('Testando endpoint /admin/tenant/stats');
  let res = http.get(`${API_BASE_URL}/admin/tenant/${TENANT_ID}/stats`, { headers: getHeaders() });
  check(res, {
    'Endpoint /admin/tenant/stats: Status 200': (r) => r.status === 200,
  });
  console.log(`Endpoint /admin/tenant/stats: Status ${res.status}`);
  
  // 2. Testar o endpoint de memorize
  console.log('Testando endpoint /memorize');
  const memorizePayload = {
    tenant_id: TENANT_ID,
    agent_id: 'agent_test_all',
    text: 'Esta é uma memória de teste para o script check-all-endpoints-apikey.',
    metadata: {
      source: 'k6_test_all_endpoints',
      timestamp: new Date().toISOString()
    }
  };
  
  res = http.post(`${API_BASE_URL}/memorize`, JSON.stringify(memorizePayload), { headers: getHeaders() });
  check(res, {
    'Endpoint /memorize: Status 200': (r) => r.status === 200,
  });
  console.log(`Endpoint /memorize: Status ${res.status}`);
  
  if (res.status === 200) {
    createdMemoryId = JSON.parse(res.body).memory_id;
    console.log(`Memória criada com ID: ${createdMemoryId}`);
  }
  
  // 3. Testar o endpoint de memorize_batch
  console.log('Testando endpoint /memorize_batch');
  const batchPayload = {
    tenant_id: TENANT_ID,
    agent_id: 'agent_test_all',
    texts: [
      'Memória batch 1 para teste de todos os endpoints.',
      'Memória batch 2 para teste de todos os endpoints.'
    ],
    metadatas: [
      { source: 'k6_test_all_batch', index: 0 },
      { source: 'k6_test_all_batch', index: 1 }
    ]
  };
  
  res = http.post(`${API_BASE_URL}/memorize_batch`, JSON.stringify(batchPayload), { headers: getHeaders() });
  check(res, {
    'Endpoint /memorize_batch: Status 200': (r) => r.status === 200,
  });
  console.log(`Endpoint /memorize_batch: Status ${res.status}`);
  
  if (res.status === 200) {
    const body = JSON.parse(res.body);
    batchMemoryIds = body.map(item => item.memory_id);
    console.log(`Memórias batch criadas: ${batchMemoryIds.join(', ')}`);
  }
  
  // 4. Testar o endpoint de retrieve
  console.log('Testando endpoint /retrieve');
  const retrievePayload = {
    tenant_id: TENANT_ID,
    agent_id: 'agent_test_all',
    query: 'teste de todos os endpoints',
    top_k: 5
  };
  
  res = http.post(`${API_BASE_URL}/retrieve`, JSON.stringify(retrievePayload), { headers: getHeaders() });
  check(res, {
    'Endpoint /retrieve: Status 200': (r) => r.status === 200,
  });
  console.log(`Endpoint /retrieve: Status ${res.status}`);
  
  // 5. Testar o endpoint de get memory
  if (createdMemoryId) {
    console.log(`Testando endpoint /memory/${createdMemoryId}`);
    res = http.get(`${API_BASE_URL}/memory/${createdMemoryId}`, { headers: getHeaders() });
    check(res, {
      'Endpoint /memory/{id}: Status 200': (r) => r.status === 200,
    });
    console.log(`Endpoint /memory/{id}: Status ${res.status}`);
  }
  
  // 6. Testar o endpoint de forget
  console.log('Testando endpoint /admin/forget');
  const forgetPayload = {
    tenant_id: TENANT_ID,
    decay_factor: 0.1,
    threshold: 0.9 // Threshold alto para não remover as memórias que acabamos de criar
  };
  
  res = http.post(`${API_BASE_URL}/admin/forget`, JSON.stringify(forgetPayload), { headers: getHeaders() });
  check(res, {
    'Endpoint /admin/forget: Status 200': (r) => r.status === 200,
  });
  console.log(`Endpoint /admin/forget: Status ${res.status}`);
  
  // 7. Testar o endpoint de delete memory
  if (batchMemoryIds.length > 0) {
    const deleteId = batchMemoryIds[0];
    console.log(`Testando endpoint /memory/${deleteId} (DELETE)`);
    res = http.del(`${API_BASE_URL}/memory/${deleteId}`, null, { headers: getHeaders() });
    check(res, {
      'Endpoint /memory/{id} (DELETE): Status 200': (r) => r.status === 200,
    });
    console.log(`Endpoint /memory/{id} (DELETE): Status ${res.status}`);
  }
  
  // Verificar novamente as estatísticas após todas as operações
  console.log('Verificando novamente endpoint /admin/tenant/stats após operações');
  res = http.get(`${API_BASE_URL}/admin/tenant/${TENANT_ID}/stats`, { headers: getHeaders() });
  if (res.status === 200) {
    const stats = JSON.parse(res.body);
    console.log(`Estatísticas finais: ${stats.total_memories} memórias, ${stats.agent_count} agentes`);
  }
}