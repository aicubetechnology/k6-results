import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, checkStatus } from './utils.js';

/**
 * Teste de carga para o endpoint /health
 * 
 * Este teste verifica o comportamento do endpoint /health sob carga normal,
 * simulando vários usuários acessando o serviço ao longo do tempo.
 * 
 * Perfil de carga:
 * - Rampa de subida: 0 a 10 usuários em 30 segundos
 * - Platô: 10 usuários por 1 minuto
 * - Rampa de descida: 10 a 0 usuários em 30 segundos
 */
export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Aumentar para 10 usuários em 30s
    { duration: '1m', target: 10 },  // Manter 10 usuários por 1 minuto
    { duration: '30s', target: 0 },  // Reduzir para 0 usuários
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],   // Falha HTTP deve ser menor que 1%
    http_req_duration: ['p(95)<200'], // 95% das solicitações devem completar em menos de 200ms
    http_req_duration: ['p(99)<500'], // 99% das solicitações devem completar em menos de 500ms
    http_req_duration: ['avg<100'],   // Tempo médio de resposta menor que 100ms
  },
};

export default function() {
  const url = `${API_BASE_URL}/health`;
  const startTime = new Date();
  const res = http.get(url);
  
  // Verificar status HTTP
  checkStatus(res);
  
  // Verificar a estrutura e conteúdo da resposta
  if (res.status === 200) {
    const body = JSON.parse(res.body);
    
    check(body, {
      'status é healthy': (b) => b.status === 'healthy',
      'versão está presente': (b) => b.version !== undefined,
      'informações de GPUs estão presentes': (b) => Array.isArray(b.gpus),
      'timestamp está presente': (b) => b.timestamp !== undefined,
    });
    
    // Log apenas para algumas solicitações (1 a cada 10) para evitar spam no console
    if (Math.random() < 0.1) {
      console.log(`Saúde do serviço: ${body.status}, Versão: ${body.version}, GPUs: ${body.gpus.length}`);
    }
  }
  
  // Tempo de espera variável para simular comportamento mais realista
  sleep(Math.random() * 2); // Entre 0 e 2 segundos
}