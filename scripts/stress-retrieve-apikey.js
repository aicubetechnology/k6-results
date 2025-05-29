import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, TENANT_ID, TEST_AGENT_ID } from './utils-apikey.js';

export const options = {
  stages: [
    { duration: '10s', target: 5 },   // Ramp up para 5 usuários
    { duration: '20s', target: 5 },   // Manter 5 usuários por 20 segundos
    { duration: '10s', target: 20 },  // Subir para 20 usuários
    { duration: '20s', target: 20 },  // Manter 20 usuários por 20 segundos
    { duration: '10s', target: 0 },   // Ramp down para 0 usuários
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'], // Falha HTTP deve ser menor que 5%
    http_req_duration: ['p(95)<2000'], // 95% das solicitações devem completar em menos de 2s
  },
};

// Lista de consultas para variar os testes
const queries = [
  'O que é o sistema solar?',
  'Fale sobre a Torre Eiffel',
  'Qual a temperatura de ebulição da água?',
  'Qual a cor do céu?',
  'Onde fica Paris?',
  'Planetas do sistema solar',
  'História da Torre Eiffel',
  'Ponto de ebulição da água',
  'Por que o céu é azul?',
  'Informações sobre Paris'
];

export default function() {
  const url = `${API_BASE_URL}/retrieve`;
  
  // Selecionar uma consulta aleatória
  const query = queries[Math.floor(Math.random() * queries.length)];
  
  const payload = {
    tenant_id: TENANT_ID,
    agent_id: TEST_AGENT_ID,
    query: query,
    top_k: 3 + Math.floor(Math.random() * 5) // Variar o top_k entre 3 e 7
  };
  
  const res = http.post(url, JSON.stringify(payload), { headers: getHeaders() });
  
  check(res, {
    'Status is 200': (r) => r.status === 200,
  });
  
  sleep(0.5);
}