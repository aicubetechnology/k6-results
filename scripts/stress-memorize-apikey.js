import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, getMemorizePayload } from './utils-apikey.js';

export const options = {
  stages: [
    { duration: '10s', target: 10 }, // Ramp up para 10 usuários
    { duration: '30s', target: 10 }, // Manter 10 usuários por 30 segundos
    { duration: '10s', target: 0 },  // Ramp down para 0 usuários
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'], // Falha HTTP deve ser menor que 5%
    http_req_duration: ['p(95)<2000'], // 95% das solicitações devem completar em menos de 2s
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