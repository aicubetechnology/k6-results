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
  // Primeiro, criar uma memória para ter um ID válido para exclusão
  const memorizeUrl = `${API_BASE_URL}/memorize`;
  const payload = {
    tenant_id: 'gdias_tenant',
    agent_id: 'agent_gdias',
    text: 'Memória criada para teste de exclusão. Esta memória deve ser removida após o teste.',
    metadata: {
      source: 'k6_test_delete_memory',
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
  
  // Primeiro, verificar se a memória existe
  const getUrl = `${API_BASE_URL}/memory/${data.memoryId}`;
  const getRes = http.get(getUrl, { headers: getHeaders() });
  
  if (getRes.status !== 200) {
    console.error(`Erro ao verificar memória: ${getRes.status} - ${getRes.body}`);
    return;
  }
  
  console.log(`Memória ${data.memoryId} existe, procedendo com exclusão`);
  
  // Excluir a memória
  const deleteUrl = `${API_BASE_URL}/memory/${data.memoryId}`;
  const deleteRes = http.del(deleteUrl, null, { headers: getHeaders() });
  
  checkStatus(deleteRes);
  
  if (deleteRes.status === 200) {
    console.log(`Memória ${data.memoryId} excluída com sucesso`);
    
    // Verificar se a memória realmente foi excluída tentando obtê-la novamente
    sleep(1); // Esperar um pouco para garantir que a exclusão foi processada
    const checkRes = http.get(getUrl, { headers: getHeaders() });
    
    check(checkRes, {
      'memory was deleted': (r) => r.status === 404,
    });
    
    if (checkRes.status === 404) {
      console.log('Confirmado: Memória não existe mais');
    } else {
      console.error(`Inesperado: Memória ainda existe ou outro erro ocorreu: ${checkRes.status}`);
    }
  }
}