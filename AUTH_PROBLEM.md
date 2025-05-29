# Análise do Problema de Autenticação

Este documento apresenta uma análise do erro encontrado ao testar os endpoints autenticados da API Qube Neural Memory.

## Erro Encontrado

```
AttributeError: module 'jwt' has no attribute 'ExpiredSignatureError'
```

Este erro ocorre quando se tenta acessar qualquer endpoint autenticado, incluindo o endpoint de estatísticas de tenant (`/admin/tenant/{tenant_id}/stats`).

## Causa Raiz

Após analisar o código fonte e os logs de erro, identifiquei a causa provável do problema:

1. **Incompatibilidade de Biblioteca JWT**:
   - O código utiliza `import jwt` na linha 9 do arquivo `authentication.py`
   - Na linha 276, tenta capturar a exceção `jwt.ExpiredSignatureError`
   - O log de erro indica que esse atributo não existe no módulo jwt instalado

2. **Explicação Técnica**:
   - Existem pelo menos dois pacotes Python diferentes para JWT:
     - `PyJWT`: Que possui as exceções como `ExpiredSignatureError`
     - `python-jwt`: Que tem uma API diferente e não possui essas exceções
   - O código está escrito para usar `PyJWT`, mas provavelmente está instalado um pacote diferente ou incompatível

3. **Impacto**:
   - Todos os endpoints que exigem autenticação falham com erro 500
   - Apenas o endpoint `/health`, que não requer autenticação, funciona corretamente

## Solução Recomendada

1. **Instalar o pacote correto**:
   ```bash
   pip install PyJWT
   ```

2. **Ou modificar o código para ser compatível com o pacote instalado**:
   ```python
   try:
       payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
       # Resto do código...
   except Exception as e:
       # Verificar se é um erro de expiração de token
       if "expired" in str(e).lower():
           raise HTTPException(
               status_code=status.HTTP_401_UNAUTHORIZED,
               detail="Token expirado",
               headers={"WWW-Authenticate": "Bearer"},
           )
       # Outros erros de token
       raise HTTPException(
           status_code=status.HTTP_401_UNAUTHORIZED,
           detail="Token inválido",
           headers={"WWW-Authenticate": "Bearer"},
       )
   ```

## Testes Realizados

1. **Endpoint de Estatísticas de Tenant**:
   - Testado com token JWT válido
   - Resultado: Erro 500 (Internal Server Error)
   - Confirmação via curl e script k6 específico

2. **Outros Endpoints Autenticados**:
   - Todos retornam o mesmo erro 500
   - Logs do servidor mostram o mesmo erro de AttributeError

## Conclusão

Os testes de performance com k6 estão implementados corretamente, mas só podem ser executados completamente após a correção do problema de autenticação no servidor. Por enquanto, apenas os testes do endpoint `/health` funcionam conforme esperado.