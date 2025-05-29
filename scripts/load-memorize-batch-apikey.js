import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, TEST_MEMORY_TEXTS, TENANT_ID, TEST_AGENT_ID } from './utils-apikey.js';

export const options = {
  vus: 5,
  duration: '20s',
  thresholds: {
    http_req_failed: ['rate<0.05'], // Falha HTTP deve ser menor que 5%
    http_req_duration: ['p(95)<2000'], // 95% das solicitações devem completar em menos de 2s
  },
};

export default function() {
  const url = `${API_BASE_URL}/memorize_batch`;
  
  // Criar um payload com até 5 textos aleatórios
  const batchSize = 1 + Math.floor(Math.random() * 4); // 1 a 5 itens
  const texts = [];
  const metadatas = [];
  
  for (let i = 0; i < batchSize; i++) {
    texts.push(TEST_MEMORY_TEXTS[Math.floor(Math.random() * TEST_MEMORY_TEXTS.length)]);
    metadatas.push({
      source: 'k6_test_batch_load',
      timestamp: new Date().toISOString(),
      batch_item: i
    });
  }
  
  const payload = {
    tenant_id: TENANT_ID,
    agent_id: TEST_AGENT_ID,
    texts: texts,
    metadatas: metadatas
  };
  
  const res = http.post(url, JSON.stringify(payload), { headers: getHeaders() });
  
  check(res, {
    'Status is 200': (r) => r.status === 200,
    'Response is array': (r) => Array.isArray(JSON.parse(r.body)),
  });
  
  sleep(1);
}