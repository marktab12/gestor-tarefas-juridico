# ⚖️ Gestor de Tarefas Jurídico

Sistema de controle de tarefas para escritórios de advocacia.

---

## 📦 Arquivos deste projeto

```
gestor-tarefas/
├── server.js          ← backend (motor do sistema)
├── package.json       ← lista de dependências
├── .gitignore         ← arquivos ignorados pelo Git
└── public/
    └── index.html     ← tela do sistema (login + tabela de tarefas)
```

---

## 🚀 PASSO A PASSO: Publicar no ar (sem programar)

### PARTE 1 — Criar repositório no GitHub

1. Acesse **github.com** e faça login
2. Clique em **"New"** (botão verde no canto superior esquerdo)
3. Dê o nome: `gestor-tarefas-juridico`
4. Deixe como **Public** (ou Private se preferir)
5. Clique em **"Create repository"**
6. Na próxima tela, clique em **"uploading an existing file"**
7. Arraste os arquivos para o GitHub:
   - `server.js`
   - `package.json`
   - `.gitignore`
   - A **pasta** `public/` com o `index.html` dentro
   
   > ⚠️ **Importante:** ao arrastar, arraste a pasta `public` inteira — não apenas o arquivo `index.html`

8. Escreva uma mensagem no campo "Commit changes" (ex: *"Primeiro envio"*)
9. Clique em **"Commit changes"**

---

### PARTE 2 — Publicar no Render (gratuito)

1. Acesse **render.com** e faça login (pode entrar com sua conta do GitHub)
2. Clique em **"New +"** → **"Web Service"**
3. Clique em **"Connect a repository"** e escolha `gestor-tarefas-juridico`
4. Preencha os campos:
   - **Name:** `gestor-tarefas-juridico` (qualquer nome)
   - **Region:** escolha o mais próximo (ex: *Oregon* ou *Frankfurt*)
   - **Branch:** `main`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free ✅
5. Antes de criar, role a página até **"Environment Variables"** e adicione:
   - **Key:** `JWT_SECRET`
   - **Value:** `escritorio2024seguro` (pode ser qualquer frase, anote em algum lugar)
6. Clique em **"Create Web Service"**
7. Aguarde ~3 minutos. O Render vai mostrar uma URL do tipo `https://gestor-tarefas-juridico.onrender.com`

✅ **Pronto! O sistema já está no ar.**

---

### PARTE 3 — (Opcional) Domínio bonito na Hostinger

Se quiser um endereço como `tarefas.escritoriofirma.com.br`:

1. No Render, vá em **Settings** → **Custom Domains** → **Add Custom Domain**
2. Digite o subdomínio que quer usar (ex: `tarefas.escritoriofirma.com.br`)
3. O Render vai mostrar um valor CNAME — copie-o
4. Na Hostinger, vá em **DNS / Nameservers** do seu domínio
5. Adicione um registro **CNAME**:
   - **Nome:** `tarefas`
   - **Valor:** cole o que o Render mostrou
6. Aguarde até 30 min para propagar

---

## 👤 Como usar o sistema

1. Acesse a URL do sistema
2. Clique em **"Criar conta"** e cadastre cada advogado (nome + e-mail + senha)
3. Cada um faz login com seu e-mail e senha
4. Clique em **"Nova tarefa"** para adicionar uma tarefa
5. Todos os advogados veem a mesma lista e podem editar qualquer tarefa
6. A tela atualiza automaticamente a cada 30 segundos

### Campos disponíveis:
| Campo | Descrição |
|-------|-----------|
| **Data** | Data da tarefa |
| **Tarefa** | Descrição do que deve ser feito |
| **Responsável** | Nome do advogado responsável |
| **Observações** | Informações adicionais |
| **Devolutiva** | Resultado/retorno da tarefa |
| **Status** | Pendente / Em andamento / Aguardando / Concluído |

---

## ⚠️ Aviso importante sobre o plano gratuito do Render

- **Banco de dados:** no plano Free, o banco pode ser **apagado** quando o servidor reinicia ou dorme (após 15 min sem uso). Para uso real em escritório, recomenda-se o plano **Starter (US$ 7/mês)** com um **Disk** persistente.
- **Latência inicial:** na primeira visita após inatividade, o site pode demorar ~30 segundos para "acordar".

Para o plano Starter com disco persistente, adicione também:
- **Environment Variable:** `DATA_DIR` = `/var/data`
- Monte um **Disk** em `/var/data` nas configurações do Render
