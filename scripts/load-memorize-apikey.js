import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, getMemorizePayload } from './utils-apikey.js';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // Falha HTTP deve ser menor que 1%
    http_req_duration: ['p(95)<1000'], // 95% das solicitações devem completar em menos de 1s
  },
};

export default function() {
  const url = `${API_BASE_URL}/memorize`;
  const payload = getMemorizePayload();
  
  const res = http.post(url, JSON.stringify(payload), { headers: getHeaders() });
  
  check(res, {
    'Status is 200': (r) => r.status === 200,
  });
  
  sleep(1);
}