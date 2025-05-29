import http from 'k6/http';
import { sleep } from 'k6';
import { API_BASE_URL, getHeaders, getMemorizePayload, checkStatus } from './utils.js';

export const options = {
  stages: [
    { duration: '20s', target: 5 },    // Aumentar para 5 usuários em 20s
    { duration: '20s', target: 10 },   // Aumentar para 10 usuários em 20s
    { duration: '20s', target: 15 },   // Aumentar para 15 usuários em 20s
    { duration: '30s', target: 0 },    // Reduzir para 0 usuários
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // Falha HTTP deve ser menor que 1%
    http_req_duration: ['p(95)<800'], // 95% das solicitações devem completar em menos de 800ms
  },
};

export default function() {
  const url = `${API_BASE_URL}/memorize`;
  
  // Gerar textos únicos para evitar duplicação
  const uniqueText = `Teste de stress ${new Date().toISOString()} - ${Math.random()}`;
  const payload = getMemorizePayload(uniqueText);
  
  const res = http.post(url, JSON.stringify(payload), { headers: getHeaders() });
  
  checkStatus(res);
  
  sleep(0.5);
}