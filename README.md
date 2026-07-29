# 📱 Minha Vida Organizada

Seu assistente pessoal de rotina, treinos, alimentação e progresso.

## 🚀 Como instalar no Android

### Opção 1: PWA (Mais Simples — Recomendado)

O app já é um **PWA** (Progressive Web App) — você instala direto pelo navegador!

1. Abra o arquivo `app/index.html` no **Google Chrome** do celular
2. Toque no menu ⋮ (três pontos)
3. Selecione **"Adicionar à tela inicial"**
4. Pronto! O app aparece como um ícone na sua área de trabalho

### Opção 2: APK via GitHub Actions (Automático)

> **Pré-requisito:** Ter uma conta no [GitHub](https://github.com) e o [Git](https://git-scm.com) instalado no PC.

#### Passo a passo:

1. **Crie um repositório no GitHub**
   ```bash
   # No terminal, dentro da pasta do projeto:
   git init
   git add .
   git commit -m "Meu app de rotina"
   
   # Crie um repositório no GitHub e depois:
   git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPO.git
   git branch -M main
   git push -u origin main
   ```

2. **Ative o GitHub Pages**
   - Vá em Settings → Pages → Source: GitHub Actions
   - O workflow já está configurado para deploy automático!

3. **Faça um push para a main** ou vá em Actions → "Build Android APK" → Run workflow

4. **Aguarde o build** (cerca de 5-10 minutos na primeira vez)

5. **Baixe o APK**
   - Vá em Actions → clique no workflow concluído
   - Role até "Artifacts" e baixe o APK
   - Transfira para o celular e instale

#### Instalação manual no Android:

1. Baixe o APK no celular
2. Toque no arquivo para instalar
3. Se pedir, vá em Configurações → Segurança → "Instalar apps de fontes desconhecidas" e permita
4. Pronto! App instalado 🎉

### Opção 3: PWABuilder (Manual — Mais Rápido)

1. Faça push do código para o GitHub
2. Ative o GitHub Pages (Settings → Pages → main → / (root))
3. Acesse: [https://pwabuilder.com](https://pwabuilder.com)
4. Digite a URL do seu GitHub Pages
5. Clique em "Package" → Android → Baixe o APK

---

## 🧭 Funcionalidades do App

| Tela | O que faz |
|------|-----------|
| 🏠 **Hoje** | Rotina do dia com checkboxes, refeições, água, progresso |
| 📋 **Tarefas** | Tarefas diárias, lista de compras com alertas, notas |
| 🏋️ **Treinos** | 22 semanas de calistenia + corrida, agenda semanal |
| 📊 **Progresso** | Metas de peso/BF, gráfico de evolução, calendário de treinos |
| ⚙️ **Mais** | Configurações, exportar dados, reset |


## 🔧 Personalização

- **Data de início:** Ajuste em ⚙️ Mais → Configurações
- **Peso inicial:** Ajuste em ⚙️ Mais → Configurações
- **Tarefas:** Adicione tarefas personalizadas em 📋 Tarefas
- **Compras:** Adicione itens na lista de compras
- **Notas:** Anote o que precisar

## 📊 Plan Summary

- **Peso:** 97 kg → **83,5 kg** 🎯
- **Gordura:** ~27% → **15%** 🎯
- **Corrida:** 0 → **5 km 3×/semana** 🎯
- **Calistenia:** Pistol Squat + Dragon Flag + Archer
- **Duração:** 22 semanas (Ago–Dez 2026)

---

Feito para Jhona 🧠
