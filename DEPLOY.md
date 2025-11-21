# Guia de Deploy - Vendo Ideias Imóveis

Este projeto foi otimizado para deploy em VPS Oracle Cloud (ARM64) utilizando **Coolify**.

## Pré-requisitos

- VPS Oracle Cloud (Ampere A1) configurada.
- Coolify instalado e rodando.
- Domínio configurado (ex: `imoveis.vendoideias.com`).

## Passo a Passo no Coolify

1. **Criar Novo Recurso**
   - No painel do Coolify, clique em `+ New Resource`.
   - Selecione `Git Repository` (ou `Public Repository` se for público).
   - Conecte este repositório.

2. **Configuração do Build**
   - **Build Pack**: Selecione `Docker Compose` ou `Docker Image`. O Coolify deve detectar automaticamente o `Dockerfile` na raiz.
   - **Architecture**: O Dockerfile é multi-stage e compatível com ARM64 (`node:20-alpine` e `nginx:alpine` suportam multi-arch). Não é necessário configuração extra.

3. **Configuração de Domínio**
   - No campo `Domains`, insira: `https://imoveis.vendoideias.com`.
   - O Coolify gerenciará o certificado SSL automaticamente via Let's Encrypt.

4. **Portas**
   - O `Dockerfile` expõe a porta `80`.
   - O `docker-compose.yml` mapeia `80:80`.
   - Certifique-se de que o Coolify está roteando o tráfego externo para a porta interna do container (geralmente automático).

5. **Variáveis de Ambiente**
   - Este projeto é um SPA estático (frontend only) com dados mockados.
   - Não são necessárias variáveis de ambiente de backend (como `DATABASE_URL`) neste estágio.
   - Se necessário, adicione variáveis no painel do Coolify (ex: `VITE_API_URL` se integrar com backend futuro).

## Verificação

Após o deploy, acesse `https://imoveis.vendoideias.com`.
- O login administrativo é: `vendoideias` / `vendo1010`.
- Verifique se os ícones carregam e se a navegação funciona (SPA Routing gerenciado pelo Nginx).

## Solução de Problemas

- **Erro 404 ao recarregar página**: Verifique se o `nginx.conf` está sendo usado corretamente. Ele contém a regra `try_files $uri $uri/ /index.html;` essencial para SPAs.
- **Erro de Permissão**: Se houver problemas de build, verifique se o usuário do Docker tem permissão. O Dockerfile usa usuário `root` por padrão no Nginx, o que é aceitável para este contêiner isolado.
