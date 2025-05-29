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

// Criar uma memória em cada iteração e depois excluí-la
export default function() {
  // Passo 1: Criar uma memória
  const createUrl = `${API_BASE_URL}/memorize`;
  const payload = getMemorizePayload("Memória para ser excluída");
  
  const createRes = http.post(createUrl, JSON.stringify(payload), { headers: getHeaders() });
  
  if (createRes.status === 200) {
    const body = JSON.parse(createRes.body);
    const memoryId = body.memory_id;
    
    if (memoryId) {
      console.log(`Created memory ID for deletion: ${memoryId}`);
      
      // Passo 2: Excluir a memória
      const deleteUrl = `${API_BASE_URL}/memory/${memoryId}`;
      const deleteRes = http.del(deleteUrl, null, { headers: getHeaders() });
      
      checkStatus(deleteRes);
      
      check(deleteRes, {
        'Memory successfully deleted': (r) => r.status === 200,
      });
      
      // Passo 3: Verificar se a memória foi realmente excluída
      const verifyUrl = `${API_BASE_URL}/memory/${memoryId}`;
      const verifyRes = http.get(verifyUrl, { headers: getHeaders() });
      
      check(verifyRes, {
        'Deleted memory returns 404': (r) => r.status === 404,
      });
    }
  }
  
  sleep(1);
}