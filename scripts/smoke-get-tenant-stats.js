import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, TEST_TENANT_ID, checkStatus } from './utils.js';

export const options = {
  vus: 1,
  duration: '10s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // Falha HTTP deve ser menor que 1%
    http_req_duration: ['p(95)<500'], // 95% das solicitações devem completar em menos de 500ms
  },
};

export default function() {
  const url = `${API_BASE_URL}/admin/tenant/${TEST_TENANT_ID}/stats`;
  
  const res = http.get(url, { headers: getHeaders() });
  
  checkStatus(res);
  
  if (res.status === 200) {
    const body = JSON.parse(res.body);
    check(body, {
      'total_memories exists': (r) => r.total_memories !== undefined,
      'agent_count exists': (r) => r.agent_count !== undefined,
      'agent_distribution exists': (r) => r.agent_distribution !== undefined,
    });
    console.log(`Tenant ${TEST_TENANT_ID} has ${body.total_memories} memories and ${body.agent_count} agents`);
  }
  
  sleep(1);
}