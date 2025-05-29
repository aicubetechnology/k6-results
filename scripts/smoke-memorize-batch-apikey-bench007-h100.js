import http from 'k6/http';
import { sleep, check } from 'k6';
import { getHeaders, getMemorizePayload, API_BASE_URL, TENANT_ID, TEST_AGENT_ID, TEST_MEMORY_TEXTS } from './utils-apikey-bench007-h100.js';

// Configuração do teste
export const options = {
  vus: 1,
  iterations: 5,
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% das requisições devem ser concluídas em menos de 1s
    http_req_failed: ['rate<0.01'],    // Menos de 1% das requisições podem falhar
  },
};

const API_ENDPOINT = '/memorize_batch';

export default function () {
  // Gerar lista de textos para o lote
  const textBatch = Array.from({ length: 3 }, (_, i) => 
    TEST_MEMORY_TEXTS[i % TEST_MEMORY_TEXTS.length] + ` (Batch ${i + 1})` 
  );
  
  // Payload para memorização em lote
  const payload = {
    tenant_id: TENANT_ID,
    agent_id: TEST_AGENT_ID,
    texts: textBatch,
    // Usando metadatas (plural) em vez de metadata (singular)
    metadatas: textBatch.map(() => ({
      source: 'k6_batch_test',
      timestamp: new Date().toISOString()
    }))
  };
  
  // Enviar requisição para memorizar lote
  const res = http.post(
    `${API_BASE_URL}${API_ENDPOINT}`,
    JSON.stringify(payload),
    { headers: getHeaders() }
  );
  
  // Verificar se a resposta foi bem-sucedida
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response is an array': (r) => {
      try {
        const body = r.json();
        return Array.isArray(body) && body.length === textBatch.length;
      } catch (e) {
        console.error(`Error parsing JSON: ${e.message}`);
        return false;
      }
    }
  });
  
  // Verificar campos esperados na resposta
  if (res.status === 200) {
    try {
      const responses = res.json();
      
      if (Array.isArray(responses)) {
        // Verificar cada item da resposta
        const allValid = responses.every((item, index) => {
          return check(res, {
            [`response[${index}] has valid memory_id`]: () => typeof item.memory_id === 'string',
            [`response[${index}] has valid status`]: () => item.status === 'success',
            [`response[${index}] has valid tenant_id`]: () => item.tenant_id === TENANT_ID,
          });
        });
        
        if (allValid) {
          console.log(`Memorize batch successful with ${responses.length} memories`);
        }
      } else {
        console.error(`Response is not an array: ${res.body}`);
      }
    } catch (e) {
      console.error(`Error validating response: ${e.message}`);
    }
  } else {
    console.error(`Failed to memorize batch: ${res.status} ${res.body}`);
  }
  
  sleep(1);
}