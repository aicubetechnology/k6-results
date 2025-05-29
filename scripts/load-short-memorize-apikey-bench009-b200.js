import http from 'k6/http';
import { sleep, check } from 'k6';
import { getHeaders, getMemorizePayload, API_BASE_URL, TENANT_ID, TEST_AGENT_ID } from './utils-apikey-bench009-b200.js';

// Configuração do teste de carga com duração reduzida
export const options = {
  stages: [
    { duration: '10s', target: 5 },   // Rampa de subida para 5 VUs em 10s
    { duration: '20s', target: 5 },   // Manter 5 VUs por 20s
    { duration: '10s', target: 0 },   // Rampa de descida para 0 VUs em 10s
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% das requisições devem completar em menos de 1s
    http_req_failed: ['rate<0.01'],    // Menos de 1% das requisições podem falhar
  },
};

const API_ENDPOINT = '/memorize';

export default function () {
  // Criar payload com texto único para cada iteração
  const uniqueText = `Teste de carga curto ${new Date().toISOString()} - ${Math.random().toString(36).substring(2, 15)}`;
  const payload = getMemorizePayload(uniqueText);
  
  // Enviar requisição para memorizar
  const res = http.post(
    `${API_BASE_URL}${API_ENDPOINT}`,
    JSON.stringify(payload),
    { headers: getHeaders() }
  );
  
  // Verificar se a resposta foi bem-sucedida
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response has memory_id': (r) => {
      const body = r.json();
      return typeof body.memory_id === 'string';
    },
    'response has status success': (r) => {
      const body = r.json();
      return body.status === 'success';
    }
  });
  
  // Pausa curta entre requisições
  sleep(0.3);
}