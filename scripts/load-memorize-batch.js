import http from 'k6/http';
import { sleep } from 'k6';
import { API_BASE_URL, getHeaders, TEST_TENANT_ID, TEST_AGENT_ID, checkStatus } from './utils.js';

export const options = {
  stages: [
    { duration: '30s', target: 3 },  // Aumentar para 3 usuários em 30s
    { duration: '1m', target: 3 },   // Manter 3 usuários por 1 minuto
    { duration: '30s', target: 0 },  // Reduzir para 0 usuários
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // Falha HTTP deve ser menor que 1%
    http_req_duration: ['p(95)<1000'], // 95% das solicitações devem completar em menos de 1000ms
  },
};

export default function() {
  const url = `${API_BASE_URL}/memorize_batch`;
  
  // Gerar textos únicos para cada chamada
  const timestamp = new Date().toISOString();
  const randomFactor = Math.random();
  
  const texts = [
    `Teste de carga batch 1 - ${timestamp} - ${randomFactor}`,
    `Teste de carga batch 2 - ${timestamp} - ${randomFactor}`,
    `Teste de carga batch 3 - ${timestamp} - ${randomFactor}`
  ];
  
  const payload = {
    tenant_id: TEST_TENANT_ID,
    agent_id: TEST_AGENT_ID,
    texts: texts,
    metadatas: texts.map(() => ({
      source: 'k6_load_test',
      timestamp: timestamp
    }))
  };
  
  const res = http.post(url, JSON.stringify(payload), { headers: getHeaders() });
  
  checkStatus(res);
  
  sleep(2);
}