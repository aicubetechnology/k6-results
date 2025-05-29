import http from 'k6/http';
import { sleep } from 'k6';
import { API_BASE_URL, getHeaders, TEST_TENANT_ID, TEST_AGENT_ID, checkStatus } from './utils.js';

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

const queryTemplates = [
  "O que é o sistema solar?",
  "Como funciona a água a 100 graus?",
  "Quais são as capitais da Europa?",
  "O que podemos encontrar em Paris?",
  "Quais são as características do céu?",
  "Como medir a temperatura da água?",
  "Quantos planetas existem?",
  "Quais são as maiores cidades do mundo?",
  "Quando foi construída a Torre Eiffel?",
  "O que é astronomia?",
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
  
  sleep(0.5);
}