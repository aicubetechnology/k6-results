import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, TENANT_ID, TEST_AGENT_ID } from './utils-apikey.js';

export const options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // Falha HTTP deve ser menor que 1%
    http_req_duration: ['p(95)<1000'], // 95% das solicitações devem completar em menos de 1s
  },
};

// Lista de consultas para variar os testes
const queries = [
  'O que é o sistema solar?',
  'Fale sobre a Torre Eiffel',
  'Qual a temperatura de ebulição da água?',
  'Qual a cor do céu?',
  'Onde fica Paris?'
];

export default function() {
  const url = `${API_BASE_URL}/retrieve`;
  
  // Selecionar uma consulta aleatória
  const query = queries[Math.floor(Math.random() * queries.length)];
  
  const payload = {
    tenant_id: TENANT_ID,
    agent_id: TEST_AGENT_ID,
    query: query,
    top_k: 3
  };
  
  const res = http.post(url, JSON.stringify(payload), { headers: getHeaders() });
  
  check(res, {
    'Status is 200': (r) => r.status === 200,
    'Has matches': (r) => JSON.parse(r.body).matches !== undefined,
  });
  
  sleep(1);
}