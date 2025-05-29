import http from 'k6/http';
import { sleep, check } from 'k6';
import { getHeaders, API_BASE_URL, TENANT_ID, TEST_AGENT_ID } from './utils-apikey-bench008-b200.js';

// Configuração do teste
export const options = {
  vus: 1,
  iterations: 5,
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% das requisições devem completar em menos de 1s
    http_req_failed: ['rate<0.01'],    // Menos de 1% das requisições podem falhar
  },
};

// Primeiro vamos memorizar algo para ter um memory_id para deletar
export function setup() {
  const memorizeEndpoint = '/memorize';
  const payload = {
    tenant_id: TENANT_ID,
    agent_id: TEST_AGENT_ID,
    text: `Teste para deleção do agente ${TEST_AGENT_ID} em ${new Date().toISOString()}`,
    metadata: {
      source: 'k6_test_delete_memory',
      timestamp: new Date().toISOString()
    }
  };

  // Criar memórias para teste (uma para cada iteração)
  const memory_ids = [];
  for (let i = 0; i < options.iterations; i++) {
    const res = http.post(
      `${API_BASE_URL}${memorizeEndpoint}`,
      JSON.stringify(payload),
      { headers: getHeaders() }
    );

    if (res.status === 200) {
      const body = res.json();
      memory_ids.push(body.memory_id);
      console.log(`Criada memória para deleção com ID: ${body.memory_id}`);
    }
  }

  return { memory_ids };
}

export default function (data) {
  if (!data.memory_ids || data.memory_ids.length === 0) {
    console.error('Não há memory_ids disponíveis para teste');
    return;
  }

  // Usar um memory_id da lista e removê-lo para não usar duas vezes
  const memory_id = data.memory_ids.pop();
  
  // Construir a URL com query params
  const url = `${API_BASE_URL}/memory?tenant_id=${TENANT_ID}&agent_id=${TEST_AGENT_ID}&memory_id=${memory_id}`;
  
  // Fazer a requisição DELETE
  const res = http.del(url, null, { headers: getHeaders() });
  
  // Verificar se a resposta foi bem-sucedida
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  
  if (res.status === 200) {
    console.log(`Memory deleted successfully: ${memory_id}`);
    
    // Tentar obter a memória deletada para confirmar que foi removida
    const checkRes = http.get(url, { headers: getHeaders() });
    
    check(checkRes, {
      'memory is not found after deletion': (r) => r.status === 404 || r.status === 400,
    });
    
    if (checkRes.status === 404 || checkRes.status === 400) {
      console.log(`Confirmed memory ${memory_id} was deleted`);
    } else {
      console.error(`Memory ${memory_id} still exists after deletion with status ${checkRes.status}`);
    }
  } else {
    console.error(`Failed to delete memory: ${res.status} ${res.body}`);
  }
  
  sleep(1);
}