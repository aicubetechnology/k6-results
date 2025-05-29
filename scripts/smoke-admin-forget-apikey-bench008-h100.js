import http from 'k6/http';
import { sleep, check } from 'k6';
import { getHeaders, getForgetPayload, API_BASE_URL, TENANT_ID } from './utils-apikey-bench008-h100.js';

// Configuração do teste
export const options = {
  vus: 1,
  iterations: 3,
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% das requisições devem completar em menos de 1s
    http_req_failed: ['rate<0.01'],    // Menos de 1% das requisições podem falhar
  },
};

const API_ENDPOINT = '/admin/forget';

export default function () {
  // Criar payload para forget
  const payload = getForgetPayload();
  
  // Enviar requisição para forget
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
  
  // Verificar campos esperados na resposta
  if (res.status === 200) {
    try {
      const body = r.json();
      
      check(res, {
        'status is success': (r) => body.status === 'success',
        'decay_factor is present': (r) => typeof body.decay_factor === 'number',
        'threshold is present': (r) => typeof body.threshold === 'number',
        'elapsed_time is present': (r) => typeof body.elapsed_time === 'number',
      });
      
      console.log(`Forget gate triggered successfully for tenant ${TENANT_ID}, removed ${body.memories_removed} memories`);
    } catch (e) {
      console.error(`Error validating response: ${e.message}`);
    }
  } else {
    console.error(`Failed to trigger forget gate: ${res.status} ${res.body}`);
  }
  
  sleep(1);
}