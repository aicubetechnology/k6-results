import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, getHeaders, getForgetPayload, checkStatus } from './utils-apikey.js';

export const options = {
  vus: 1,
  iterations: 1, // Apenas uma iteração para este teste
};

export default function() {
  const url = `${API_BASE_URL}/admin/forget`;
  const payload = getForgetPayload();
  
  console.log(`Executando forget gate para tenant ${payload.tenant_id}`);
  console.log(`Parâmetros: decay_factor=${payload.decay_factor}, threshold=${payload.threshold}`);
  
  const res = http.post(url, JSON.stringify(payload), { headers: getHeaders() });
  
  checkStatus(res);
  
  if (res.status === 200) {
    const body = JSON.parse(res.body);
    check(body, {
      'has tenant_id': (r) => r.tenant_id === payload.tenant_id,
      'has memories_removed': (r) => r.memories_removed !== undefined,
      'has decay_factor': (r) => r.decay_factor !== undefined,
      'has threshold': (r) => r.threshold !== undefined,
      'has elapsed_time': (r) => r.elapsed_time !== undefined,
    });
    console.log(`Forget gate executado: ${body.memories_removed} memórias removidas em ${body.elapsed_time}s`);
  } else {
    console.error(`Erro ao executar forget gate: ${res.status} - ${res.body}`);
  }
}