# 📱 Guia Completo — Gerar APK pelo GitHub Actions

> **Resultado final:** Um arquivo `.apk` que você instala no celular como qualquer app!

---

## 📋 Índice

1. [O que você precisa](#-o-que-você-precisa)
2. [Criar conta no GitHub](#1-criar-conta-no-github)
3. [Instalar o Git no PC](#2-instalar-o-git-no-pc)
4. [Criar o repositório no GitHub](#3-criar-o-repositório-no-github)
5. [Enviar o código para o GitHub](#4-enviar-o-código-para-o-github)
6. [Acompanhar o build do APK](#5-acompanhar-o-build-do-apk)
7. [Baixar e instalar o APK](#6-baixar-e-instalar-o-apk)
8. [Gerar nova versão do APK](#7-gerar-nova-versão-do-apk)
9. [Solução de problemas](#-solução-de-problemas)

---

## ✅ O que você precisa

| Item | Onde conseguir |
|------|---------------|
| 📧 **Conta no GitHub** (grátis) | [github.com/signup](https://github.com/signup) |
| 💻 **Git instalado no PC** | [git-scm.com](https://git-scm.com/downloads) |
| 📁 **Pasta do app** | `C:\Freebuff\Organizado\app\` (já existe!) |

---

## 1️⃣ Criar conta no GitHub

Se já tem conta, pule para o **passo 2**.

1. Acesse: **[github.com/signup](https://github.com/signup)**
2. Digite seu **e-mail**, crie uma **senha** e escolha um **nome de usuário**
3. Verifique o e-mail
4. Pronto! Conta criada ✅

---

## 2️⃣ Instalar o Git no PC

Se já tem o Git (versão 2.53.0 como vimos), pule para o **passo 3**.

1. Acesse: **[git-scm.com/downloads](https://git-scm.com/downloads)**
2. Baixe a versão para Windows
3. Instale com as opções padrão (next, next, next...)
4. Abra o **Prompt de Comando** (tecla Windows + R, digite `cmd`, Enter)
5. Digite `git --version` para confirmar que instalou

---

## 3️⃣ Criar o repositório no GitHub

1. Faça login em: **[github.com/login](https://github.com/login)**
2. Acesse: **[github.com/new](https://github.com/new)**
3. Configure assim:

| Campo | Valor |
|-------|-------|
| **Repository name** | `minha-vida-organizada` |
| **Description** | (opcional) Meu app de rotina pessoal |
| **Public / Private** | `Public` (plano grátis) |
| ✅ Add a README file | **NÃO** marque |
| ✅ Add .gitignore | **NÃO** marque |
| ✅ Choose a license | **NÃO** marque |

4. Clique em **"Create repository"**
5. ❗ **Não feche esta página!** Vamos usar os comandos dela no próximo passo

---

## 4️⃣ Enviar o código para o GitHub

### 4.1 — Abrir o terminal

1. Pressione **Windows + R**
2. Digite `cmd` e aperte **Enter**

### 4.2 — Navegar até a pasta do projeto

Digite no terminal:

```bash
cd C:\Freebuff\Organizado
```

### 4.3 — Iniciar o Git e fazer o primeiro commit

```bash
git init
git add .
git commit -m "Meu app de rotina completo"
```

### 4.4 — Conectar com o GitHub

Na página do GitHub que você não fechou, tem uma seção **"…or push an existing repository from the command line"** com 3 comandos. Copie e cole eles um por um no terminal:

```bash
git remote add origin https://github.com/SEU_USUARIO/minha-vida-organizada.git
```
> ⚠️ **Troque** `SEU_USUARIO` pelo seu nome de usuário do GitHub!

```bash
git branch -M main
```

```bash
git push -u origin main
```

### 4.5 — Autenticação (token)

Quando pedir **usuário**: digite seu nome de usuário do GitHub.

Quando pedir **senha**: **NÃO é a senha do GitHub!** Você precisa criar um **token de acesso**:

1. Acesse: **[github.com/settings/tokens/new](https://github.com/settings/tokens/new)**
2. Em **"Note"** digite: `meu-token`
3. Marque a opção **"repo"** (todas as sub-opções serão marcadas automaticamente)
4. Role até o fim e clique em **"Generate token"**
5. **Copie o token** (algo como `ghp_xxxxxxxxxxxxxxxxxxxx`)
6. Cole no terminal como senha (não aparece nada digitando, mas está colando!)
7. Aperte Enter

✅ **Pronto!** O código foi enviado para o GitHub.

---

## 5️⃣ Acompanhar o build do APK

1. Acesse: **[github.com/SEU_USUARIO/minha-vida-organizada/actions](https://github.com/SEU_USUARIO/minha-vida-organizada/actions)**
   > Troque `SEU_USUARIO` pelo seu nome
2. Você vai ver o workflow **"Build Android APK"** rodando ⏳ (ícone amarelo)
3. Clique nele para ver os detalhes
4. Espere o **ícone ficar verde** ✅ (cerca de **5–10 minutos** na primeira vez)

> 💡 **Dica:** O build é mais rápido nas próximas vezes porque o Gradle fica em cache.

---

## 6️⃣ Baixar e instalar o APK

1. No workflow concluído (verde ✅), role até **"Artifacts"**
2. Clique em **"MinhaVida-Organizada-APK"** para baixar o `.zip`
3. Extraia o arquivo — dentro tem o `app-release-unsigned.apk`
4. Transfira o `.apk` para o celular:
   - 📱 **WhatsApp:** Envie para você mesmo
   - ☁️ **Google Drive:** Faça upload e baixe no celular
   - 🔌 **Cabo USB:** Copie direto
5. No celular, toque no arquivo `.apk` para instalar
6. Se aparecer "instalação bloqueada":
   - Vá em **Configurações → Segurança → Instalar apps desconhecidas**
   - Permita para o app que está usando (WhatsApp, Drive, etc.)
7. Pronto! App instalado 🎉

---

## 7️⃣ Gerar nova versão do APK

Sempre que você quiser gerar um APK novo (após modificar o app):

```bash
cd C:\Freebuff\Organizado
git add .
git commit -m "Descrição das alterações"
git push
```

O **GitHub Actions** roda automaticamente e gera um novo APK! 🔄

Se quiser rodar manualmente sem fazer alterações:
1. Vá em **[github.com/SEU_USUARIO/minha-vida-organizada/actions](https://github.com/SEU_USUARIO/minha-vida-organizada/actions)**
2. Clique em **"Build Android APK"** na lista à esquerda
3. Clique em **"Run workflow"** → **"Run workflow"** novamente

---

## 🔧 Solução de problemas

### ❌ Build falhou com erro

Me mande o **log completo do erro** que eu ajudo a resolver!

Os logs estão em: **Actions → clique no build com ❌ → clique no passo vermelho**

### ❌ "Node.js 20 is deprecated" (aviso amarelo)

É só um **aviso**, não impede o build. Pode ignorar.

### ❌ Pediu senha no `git push` e não sei qual é

Use o **token** que você criou no passo 4.5. Se perdeu o token, crie outro:
- Acesse: [github.com/settings/tokens/new](https://github.com/settings/tokens/new)
- Marque "repo" → Generate → Copie o token

### ❌ "APK não encontrado" no artifact

O build pode ter falhado em algum passo. Verifique os logs:
- Vá em **Actions → clique no último build**
- Veja qual passo está com ❌
- Me mande o erro!

### ❌ O app não aparece no celular

- Confira se a **"Instalação de fontes desconhecidas"** está ativada
- Tente fechar e abrir o app de novo
- Alguns celulares (Xiaomi, Samsung) têm configuração extra de segurança

---

## 📁 Estrutura dos arquivos importantes

```
C:\Freebuff\Organizado\
├── app/                          ← Pasta com o código do app
│   ├── index.html                ← Página principal
│   ├── manifest.json             ← Configuração do PWA
│   ├── sw.js                     ← Service Worker (offline)
│   ├── css/styles.css            ← Estilos
│   ├── js/app.js                 ← Lógica do app
│   └── icons/                    ← Ícones do app
├── .github/workflows/            ← Configuração do GitHub Actions
│   └── build-apk.yml             ← Workflow que gera o APK
└── GUIA-GERAR-APK.md             ← Este guia
```

---

> 🧠 **Dúvidas?** Me pergunte! Estou aqui para ajudar.
