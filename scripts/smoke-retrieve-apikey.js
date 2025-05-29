import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, getRetrievePayload, checkStatus } from './utils-apikey.js';

export const options = {
  vus: 1,
  duration: '10s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // Falha HTTP deve ser menor que 1%
    http_req_duration: ['p(95)<500'], // 95% das solicitações devem completar em menos de 500ms
  },
};

export default function() {
  const url = `${API_BASE_URL}/retrieve`;
  const payload = getRetrievePayload();
  
  const res = http.post(url, JSON.stringify(payload), { headers: getHeaders() });
  
  checkStatus(res);
  
  if (res.status === 200) {
    const body = JSON.parse(res.body);
    check(body, {
      'has matches array': (r) => Array.isArray(r.matches),
      'has source': (r) => r.source !== undefined,
    });
    console.log(`Retrieved ${body.matches.length} matches`);
  }
  
  sleep(1);
}