import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, getMemorizePayload, checkStatus } from './utils.js';

export const options = {
  vus: 1,
  duration: '10s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // Falha HTTP deve ser menor que 1%
    http_req_duration: ['p(95)<500'], // 95% das solicitações devem completar em menos de 500ms
  },
};

// Variável para armazenar o ID de memória criado
let memoryId = null;

export function setup() {
  // Primeiro criar uma memória para obter um ID válido
  const url = `${API_BASE_URL}/memorize`;
  const payload = getMemorizePayload("Memória de teste para o endpoint GET");
  
  const res = http.post(url, JSON.stringify(payload), { headers: getHeaders() });
  
  if (res.status === 200) {
    const body = JSON.parse(res.body);
    if (body.memory_id) {
      memoryId = body.memory_id;
      console.log(`Created memory ID for testing: ${memoryId}`);
      return { memoryId };
    }
  }
  
  console.error("Failed to create test memory");
  return { memoryId: "invalid_id" };
}

export default function(data) {
  // Usar o ID de memória criado na fase de setup
  const memoryIdToUse = data.memoryId || "invalid_id";
  const url = `${API_BASE_URL}/memory/${memoryIdToUse}`;
  
  const res = http.get(url, { headers: getHeaders() });
  
  if (memoryIdToUse !== "invalid_id") {
    checkStatus(res);
    
    if (res.status === 200) {
      const body = JSON.parse(res.body);
      check(body, {
        'memory_id is correct': (r) => r.memory_id === memoryIdToUse,
        'content exists': (r) => r.content !== undefined,
      });
      console.log(`Retrieved memory details for ID: ${body.memory_id}`);
    }
  } else {
    check(res, {
      'Non-existent memory returns 404': (r) => r.status === 404,
    });
  }
  
  sleep(1);
}