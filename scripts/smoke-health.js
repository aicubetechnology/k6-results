import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { API_BASE_URL, checkStatus } from './utils.js';

/**
 * Teste de fumaça para o endpoint /health
 * 
 * Este teste verifica o funcionamento básico do endpoint /health,
 * garantindo que ele responde corretamente e retorna os dados esperados.
 * 
 * Perfil de carga:
 * - Execução com 1 usuário virtual
 * - Duração de 10 segundos
 */
export const options = {
  vus: 1,
  duration: '10s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // Falha HTTP deve ser menor que 1%
    http_req_duration: ['p(95)<500'], // 95% das solicitações devem completar em menos de 500ms
    http_req_duration: ['max<1000'], // Tempo máximo de resposta deve ser menor que 1s
  },
};

export default function() {
  const url = `${API_BASE_URL}/health`;
  const startTime = new Date();
  const res = http.get(url);
  const duration = new Date() - startTime;
  
  // Verificar status HTTP
  checkStatus(res);
  
  // Verificação específica do endpoint health
  if (res.status === 200) {
    const body = JSON.parse(res.body);
    
    // Verificações detalhadas do conteúdo
    check(body, {
      'status está presente e é "healthy"': (b) => b.status === 'healthy',
      'versão está presente': (b) => b.version !== undefined && b.version.length > 0,
      'informações de GPUs estão presentes': (b) => Array.isArray(b.gpus) && b.gpus.length > 0,
      'timestamp está presente': (b) => b.timestamp !== undefined && b.timestamp.length > 0,
    });
    
    // Log de cada requisição (adequado para teste de fumaça que tem poucas requisições)
    console.log(`Service Status: ${body.status}, Version: ${body.version}, Response Time: ${duration}ms`);
  }
  
  sleep(1);
}