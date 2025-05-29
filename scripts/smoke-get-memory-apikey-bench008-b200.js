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

// Primeiro vamos memorizar algo para ter um memory_id para recuperar
let memory_ids = [];

export function setup() {
  const memorizeEndpoint = '/memorize';
  const payload = {
    tenant_id: TENANT_ID,
    agent_id: TEST_AGENT_ID,
    text: `Teste de memory detail para o agente ${TEST_AGENT_ID} em ${new Date().toISOString()}`,
    metadata: {
      source: 'k6_test_get_memory',
      timestamp: new Date().toISOString()
    }
  };

  // Criar algumas memórias para teste
  for (let i = 0; i < 3; i++) {
    const res = http.post(
      `${API_BASE_URL}${memorizeEndpoint}`,
      JSON.stringify(payload),
      { headers: getHeaders() }
    );

    if (res.status === 200) {
      const body = res.json();
      memory_ids.push(body.memory_id);
      console.log(`Criada memória de teste com ID: ${body.memory_id}`);
    }
  }

  return { memory_ids };
}

export default function (data) {
  if (!data.memory_ids || data.memory_ids.length === 0) {
    console.error('Não há memory_ids disponíveis para teste');
    return;
  }

  // Usar um memory_id aleatório das memórias criadas no setup
  const memory_id = data.memory_ids[Math.floor(Math.random() * data.memory_ids.length)];
  
  // Construir a URL com query params
  const url = `${API_BASE_URL}/memory?tenant_id=${TENANT_ID}&agent_id=${TEST_AGENT_ID}&memory_id=${memory_id}`;
  
  // Fazer a requisição GET
  const res = http.get(url, { headers: getHeaders() });
  
  // Verificar se a resposta foi bem-sucedida
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response has memory_id': (r) => {
      const body = r.json();
      return body.memory_id === memory_id;
    },
    'response has content': (r) => {
      const body = r.json();
      return typeof body.content === 'string' && body.content.length > 0;
    }
  });
  
  // Verificar detalhes adicionais
  if (res.status === 200) {
    const body = r.json();
    
    check(res, {
      'tenant_id is correct': (r) => body.tenant_id === TENANT_ID,
      'agent_id is correct': (r) => body.agent_id === TEST_AGENT_ID,
      'importance is a number': (r) => typeof body.importance === 'number',
      'created_at is present': (r) => typeof body.created_at === 'string',
      'last_access is present': (r) => typeof body.last_access === 'string',
      'metadata is an object': (r) => typeof body.metadata === 'object',
    });
    
    console.log(`Get memory successful for memory_id: ${memory_id}`);
  } else {
    console.error(`Failed to get memory: ${res.status} ${res.body}`);
  }
  
  sleep(1);
}