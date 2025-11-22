# Guia de Deploy - Oracle Cloud (ARM64)

Este guia detalha como fazer o deploy do **Vendo Ideias Imóveis** em uma VPS Oracle Cloud (Ampere A1/ARM64).

## 1. Acesso ao Servidor

Acesse sua VPS via SSH:

```bash
ssh opc@seu-ip-publico -i sua-chave-privada.key
```

## 2. Instalação do Docker (Oracle Linux 8/9)

Se ainda não tiver o Docker instalado:

```bash
# Atualizar sistema
sudo dnf update -y

# Adicionar repositório Docker
sudo dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo

# Instalar Docker
sudo dnf install -y docker-ce docker-ce-cli containerd.io

# Iniciar e habilitar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Adicionar usuário ao grupo docker (para não usar sudo sempre)
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# IMPORTANTE: Saia e entre novamente no SSH para aplicar as permissões de grupo
exit
```

## 3. Preparação do Projeto

No servidor, clone seu repositório ou copie os arquivos. Se estiver usando Git:

```bash
# Instalar Git se necessário
sudo dnf install -y git

# Clonar (substitua pela URL do seu repo)
git clone https://github.com/seu-usuario/novo-crm.git
cd novo-crm
```

## 4. Build e Execução (Método Recomendado)

Como a arquitetura é ARM64, o ideal é construir a imagem **diretamente no servidor** para garantir compatibilidade total.

### Opção A: Usando Docker Compose (Mais fácil)

Certifique-se de que o arquivo `docker-compose.yml` está na pasta.

```bash
# Construir e subir em background
docker-compose up -d --build
```

### Opção B: Usando Docker Manualmente

```bash
# Construir a imagem
docker build -t novo-crm .

# Rodar o container na porta 80
docker run -d -p 80:80 --name crm-app novo-crm
```

## 5. Verificação

1.  Acesse `http://seu-ip-publico` no navegador.
2.  Você deve ver a tela de login.
3.  Se vir "Carregando sistema..." por muito tempo, abra o Console do Desenvolvedor (F12) para ver se há erros de JavaScript.

## Solução de Problemas Comuns

### Tela Branca (White Screen)
- **Causa**: Caminhos de arquivos incorretos.
- **Solução**: Verifique se `vite.config.ts` tem `base: './'`.
- **Debug**: O texto "Carregando sistema..." que adicionamos no `index.html` deve aparecer. Se ele não aparecer, o Nginx não está servindo o HTML. Se ele aparecer e não sumir, o React travou (verifique o console F12).

### Erro de Permissão no Build
- Se o build falhar, tente rodar com `sudo` ou verifique se adicionou o usuário ao grupo `docker`.

### Porta 80 Fechada
- Na Oracle Cloud, você precisa liberar a porta 80 no firewall da VPS **E** na Security List do painel da Oracle.

**Firewall da VPS (Oracle Linux):**
```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```
