import http from 'k6/http';
import { sleep, check } from 'k6';
import { getHeaders, getRetrievePayload, API_BASE_URL } from './utils-apikey-bench008-b200.js';

// Configuração do teste
export const options = {
  vus: 1,
  iterations: 5,
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% das requisições devem completar em menos de 1s
    http_req_failed: ['rate<0.01'],    // Menos de 1% das requisições podem falhar
  },
};

const API_ENDPOINT = '/retrieve';

export default function () {
  // Criar payload para retrieve
  const payload = getRetrievePayload();
  
  // Enviar requisição para retrieve
  const res = http.post(
    `${API_BASE_URL}${API_ENDPOINT}`,
    JSON.stringify(payload),
    { headers: getHeaders() }
  );
  
  // Verificar se a resposta foi bem-sucedida
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response has matches array': (r) => {
      try {
        const body = r.json();
        return Array.isArray(body.matches);
      } catch (e) {
        console.error(`Error parsing response: ${e.message}`);
        return false;
      }
    },
    'response has source field': (r) => {
      try {
        const body = r.json();
        return typeof body.source === 'string';
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
      
      console.log(`Retrieved ${body.matches.length} memories from source: ${body.source}`);
      
      if (body.matches.length > 0) {
        check(res, {
          'matches have memory_id': (r) => body.matches.every(match => typeof match.memory_id === 'string'),
          'matches have text': (r) => body.matches.every(match => typeof match.text === 'string'),
          'matches have score': (r) => body.matches.every(match => typeof match.score === 'number'),
        });
      }
    } catch (e) {
      console.error(`Error validating response: ${e.message}`);
    }
  } else {
    console.error(`Failed to retrieve: ${res.status} ${res.body}`);
  }
  
  sleep(1);
}