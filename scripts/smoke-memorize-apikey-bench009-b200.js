import http from 'k6/http';
import { sleep, check } from 'k6';
import { getHeaders, getMemorizePayload, API_BASE_URL, TENANT_ID, TEST_AGENT_ID } from './utils-apikey-bench009-b200.js';

// Configuração do teste
export const options = {
  vus: 1,
  iterations: 5,
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% das requisições devem completar em menos de 1s
    http_req_failed: ['rate<0.01'],    // Menos de 1% das requisições podem falhar
  },
};

const API_ENDPOINT = '/memorize';

export default function () {
  // Criar payload para memorização
  const payload = getMemorizePayload();
  
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
  
  // Verificar campos esperados na resposta
  if (res.status === 200) {
    const body = r.json();
    
    check(res, {
      'memory_id is valid': (r) => typeof body.memory_id === 'string' && body.memory_id.length > 0,
      'surprise_score is present': (r) => typeof body.surprise_score === 'number',
      'stored_at is present': (r) => typeof body.stored_at === 'string',
    });
    
    console.log(`Memorize successful with memory_id: ${body.memory_id}`);
  } else {
    console.error(`Failed to memorize: ${res.status} ${res.body}`);
  }
  
  sleep(1);
}