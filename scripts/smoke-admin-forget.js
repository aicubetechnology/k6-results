import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, TEST_TENANT_ID, checkStatus } from './utils.js';

export const options = {
  vus: 1,
  duration: '10s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // Falha HTTP deve ser menor que 1%
    http_req_duration: ['p(95)<1000'], // 95% das solicitações devem completar em menos de 1000ms
  },
};

export default function() {
  const url = `${API_BASE_URL}/admin/forget`;
  
  const payload = {
    tenant_id: TEST_TENANT_ID,
    decay_factor: 0.7,
    threshold: 0.3
  };
  
  const res = http.post(url, JSON.stringify(payload), { headers: getHeaders() });
  
  checkStatus(res);
  
  if (res.status === 200) {
    const body = JSON.parse(res.body);
    check(body, {
      'status is ok': (r) => r.status === 'ok',
      'tenant_id is correct': (r) => r.tenant_id === TEST_TENANT_ID,
      'memories_removed exists': (r) => r.memories_removed !== undefined,
    });
    console.log(`Forget gate removed ${body.memories_removed} memories`);
  }
  
  sleep(1);
}