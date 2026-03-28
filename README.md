# MicroLab - TIC-Hub 12 - Programação Fullstack


<div align="center" style="background: #000; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
   <img src="./src/assets/logo.png" alt="Banner do Projeto" width="200"/>
</div>

Bem-vindo ao projeto de e-commerce de produtos eletrônicos, de prototipagem e tecnologia! Este projeto foi desenvolvido utilizando [Vite](https://vitejs.dev/), [Vue 3](https://vuejs.org/) e [Supabase](https://supabase.com/) para proporcionar uma experiência moderna, rápida e escalável.

## ✨ Funcionalidades

- Autenticação de usuários (login, cadastro, perfil)
- Gerenciamento de produtos e categorias (admin)
- Carrinho de compras e favoritos
- Checkout com seleção de endereço e método de pagamento
- Histórico de pedidos
- Interface responsiva e moderna

## 🚀 Tecnologias Utilizadas

- **Frontend:** [Vue 3](https://vuejs.org/), [Vite](https://vitejs.dev/)
- **Backend as a Service:** [Supabase](https://supabase.com/)
- **Gerenciamento de estado:** Pinia
- **Estilização:** CSS3

## 📁 Estrutura de Pastas

```
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── lib/
│   ├── model/
│   ├── pages/
│   ├── router/
│   ├── services/
│   ├── stores/
│   └── style.css
├── supabase/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🛠️ Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repo>
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Configure o Supabase:**
   - Crie um projeto no [Supabase](https://supabase.com/)
   - Copie as variáveis de ambiente necessárias para o projeto
   - Execute as migrações SQL em `supabase/migrations/`
4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## 📦 Scripts Disponíveis

- `npm run dev` — Inicia o servidor de desenvolvimento
- `npm run build` — Gera a build de produção
- `npm run preview` — Visualiza a build de produção localmente
