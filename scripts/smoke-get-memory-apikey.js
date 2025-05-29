import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, checkStatus } from './utils-apikey.js';

export const options = {
  vus: 1,
  iterations: 1, // Apenas uma iteração para este teste
};

// Será preenchido na inicialização
let memoryId = '';

export function setup() {
  // Primeiro, criar uma memória para ter um ID válido
  const memorizeUrl = `${API_BASE_URL}/memorize`;
  const payload = {
    tenant_id: 'gdias_tenant',
    agent_id: 'agent_gdias',
    text: 'Memória criada para teste de obtenção e exclusão.',
    metadata: {
      source: 'k6_test_get_memory',
      timestamp: new Date().toISOString()
    }
  };
  
  const res = http.post(memorizeUrl, JSON.stringify(payload), { headers: getHeaders() });
  
  if (res.status === 200) {
    const body = JSON.parse(res.body);
    memoryId = body.memory_id;
    console.log(`Setup: Memória criada com ID ${memoryId}`);
    return { memoryId: memoryId };
  } else {
    console.error('Erro ao criar memória:', res.body);
    return { memoryId: null };
  }
}

export default function(data) {
  if (!data.memoryId) {
    console.error('Teste não pode continuar: nenhuma memória foi criada no setup');
    return;
  }
  
  const url = `${API_BASE_URL}/memory/${data.memoryId}`;
  
  // Obter detalhes da memória
  const res = http.get(url, { headers: getHeaders() });
  
  checkStatus(res);
  
  if (res.status === 200) {
    const body = JSON.parse(res.body);
    check(body, {
      'has memory_id': (r) => r.memory_id === data.memoryId,
      'has content': (r) => r.content !== undefined,
      'has metadata': (r) => r.metadata !== undefined,
      'has importance': (r) => r.importance !== undefined,
    });
    console.log(`Memória ${data.memoryId} recuperada com sucesso`);
  }
  
  sleep(1);
}