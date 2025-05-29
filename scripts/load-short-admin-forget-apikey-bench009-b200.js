import http from 'k6/http';
import { sleep, check } from 'k6';
import { getHeaders, getForgetPayload, API_BASE_URL, TENANT_ID } from './utils-apikey-bench009-b200.js';

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

const API_ENDPOINT = '/admin/forget';

export default function () {
  // Criar payload com parâmetros ligeiramente variados para cada iteração
  const decay = Math.random() * 0.2 + 0.1;  // Entre 0.1 e 0.3
  const threshold = Math.random() * 0.3 + 0.4;  // Entre 0.4 e 0.7
  
  const payload = {
    tenant_id: TENANT_ID,
    decay_factor: decay,
    threshold: threshold
  };
  
  // Enviar requisição para o endpoint forget
  const res = http.post(
    `${API_BASE_URL}${API_ENDPOINT}`,
    JSON.stringify(payload),
    { headers: getHeaders() }
  );
  
  // Verificar se a resposta foi bem-sucedida
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response has tenant_id': (r) => {
      try {
        const body = r.json();
        return body.tenant_id === TENANT_ID;
      } catch (e) {
        console.error(`Error parsing response: ${e.message}`);
        return false;
      }
    },
    'response has memories_removed': (r) => {
      try {
        const body = r.json();
        return typeof body.memories_removed === 'number';
      } catch (e) {
        console.error(`Error parsing response: ${e.message}`);
        return false;
      }
    }
  });
  
  // Pausa curta entre requisições
  sleep(0.5);
}