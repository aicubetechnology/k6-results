import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, TEST_TENANT_ID, TEST_AGENT_ID, TEST_MEMORY_TEXTS, checkStatus } from './utils.js';

export const options = {
  vus: 1,
  duration: '10s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // Falha HTTP deve ser menor que 1%
    http_req_duration: ['p(95)<1000'], // 95% das solicitações devem completar em menos de 1000ms
  },
};

export default function() {
  const url = `${API_BASE_URL}/memorize_batch`;
  
  const payload = {
    tenant_id: TEST_TENANT_ID,
    agent_id: TEST_AGENT_ID,
    texts: TEST_MEMORY_TEXTS,
    metadatas: TEST_MEMORY_TEXTS.map(() => ({
      source: 'k6_test',
      timestamp: new Date().toISOString()
    }))
  };
  
  const res = http.post(url, JSON.stringify(payload), { headers: getHeaders() });
  
  checkStatus(res);
  
  if (res.status === 200) {
    const body = JSON.parse(res.body);
    check(body, {
      'response is array': (r) => Array.isArray(r),
      'all items have memory_id': (r) => r.every(item => item.memory_id !== undefined),
      'correct number of responses': (r) => r.length === TEST_MEMORY_TEXTS.length,
    });
    console.log(`Batch memorized ${body.length} items`);
  }
  
  sleep(1);
}