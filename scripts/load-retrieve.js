import http from 'k6/http';
import { sleep } from 'k6';
import { API_BASE_URL, getHeaders, TEST_TENANT_ID, TEST_AGENT_ID, checkStatus } from './utils.js';

export const options = {
  stages: [
    { duration: '30s', target: 5 },  // Aumentar para 5 usuários em 30s
    { duration: '1m', target: 5 },   // Manter 5 usuários por 1 minuto
    { duration: '30s', target: 0 },  // Reduzir para 0 usuários
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // Falha HTTP deve ser menor que 1%
    http_req_duration: ['p(95)<500'], // 95% das solicitações devem completar em menos de 500ms
  },
};

const queryTemplates = [
  "O que é o sistema solar?",
  "Como funciona a água a 100 graus?",
  "Quais são as capitais da Europa?",
  "O que podemos encontrar em Paris?",
  "Quais são as características do céu?",
];

export default function() {
  const url = `${API_BASE_URL}/retrieve`;
  
  // Usar uma consulta aleatória para variar as solicitações
  const query = queryTemplates[Math.floor(Math.random() * queryTemplates.length)];
  
  const payload = {
    tenant_id: TEST_TENANT_ID,
    agent_id: TEST_AGENT_ID,
    query: query,
    top_k: 3
  };
  
  const res = http.post(url, JSON.stringify(payload), { headers: getHeaders() });
  
  checkStatus(res);
  
  sleep(1);
}