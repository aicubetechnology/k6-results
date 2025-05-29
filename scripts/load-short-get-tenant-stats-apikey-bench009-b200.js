import http from 'k6/http';
import { sleep, check } from 'k6';
import { getHeaders, API_BASE_URL, TENANT_ID } from './utils-apikey-bench009-b200.js';

// Configuração do teste de carga com duração reduzida
export const options = {
  stages: [
    { duration: '10s', target: 5 },   // Rampa de subida para 5 VUs em 10s
    { duration: '20s', target: 5 },   // Manter 5 VUs por 20s
    { duration: '10s', target: 0 },   // Rampa de descida para 0 VUs em 10s
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% das requisições devem completar em menos de 2s
    http_req_failed: ['rate<0.05'],    // Menos de 5% das requisições podem falhar
  },
};

export default function () {
  // Construir a URL
  const url = `${API_BASE_URL}/admin/tenant/${TENANT_ID}/stats`;
  
  // Fazer a requisição GET
  const res = http.get(url, { headers: getHeaders() });
  
  // Verificar se a resposta foi bem-sucedida
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response has total_memories': (r) => {
      try {
        const body = r.json();
        return typeof body.total_memories === 'number';
      } catch (e) {
        console.error(`Error parsing response: ${e.message}`);
        return false;
      }
    },
    'response has agent_count': (r) => {
      try {
        const body = r.json();
        return typeof body.agent_count === 'number';
      } catch (e) {
        console.error(`Error parsing response: ${e.message}`);
        return false;
      }
    },
    'response has agent_distribution': (r) => {
      try {
        const body = r.json();
        return typeof body.agent_distribution === 'object';
      } catch (e) {
        console.error(`Error parsing response: ${e.message}`);
        return false;
      }
    }
  });
  
  // Pausa curta entre requisições
  sleep(0.5);
}