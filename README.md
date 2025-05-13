# Guru PCP - Assistente Especializado

<div align="center">
  <img src="static/images/Guru_olhos_aberto.png" alt="Guru PCP Logo" width="120" height="120">
</div>

## Sobre o Projeto

O Guru PCP é uma aplicação web que oferece assistência especializada em diversas áreas empresariais através de uma interface de chat intuitiva. O sistema utiliza modelos de linguagem avançados para fornecer respostas personalizadas e contextualmente relevantes.

## Especialistas Disponíveis

O Guru PCP conta com quatro especialistas diferentes:

- **Especialista em PCP**: Auxilia com questões sobre planejamento e controle da produção, MRP, gestão de capacidade e otimização de processos produtivos.

- **Especialista em Logística**: Oferece suporte em gestão de estoque, transporte, logística de distribuição e gestão de fornecedores.

- **Especialista em Vendas e Trade Marketing**: Ajuda com estratégias de vendas, gestão de equipes comerciais, marketing no ponto de venda e experiência do cliente.

- **Especialista em Financeiro e Controladoria**: Auxilia em análise financeira, contabilidade gerencial, gestão de custos e planejamento financeiro.

## Funcionalidades

- Interface de chat simples e intuitiva
- Seleção de diferentes especialistas conforme a necessidade
- Escolha entre diversos modelos de IA (GPT-3.5, GPT-4o, Claude, etc.)
- Botão para limpar a conversa
- Botão para imprimir a conversa com formatação adequada
- Animação interativa do Guru

## Tecnologias Utilizadas

- **Frontend**: HTML, CSS e JavaScript puro
- **Backend**: Python com Flask
- **API**: OpenRouter.ai (com suporte a múltiplos modelos de IA)
- **Bibliotecas**: Font Awesome para ícones

## Como Executar

1. Clone este repositório
2. Instale as dependências:
   ```
   pip install -r requirements.txt
   ```
3. Execute o servidor:
   ```
   python app.py
   ```
4. Acesse a aplicação em seu navegador: `http://localhost:5000`

## Estrutura do Projeto

```
├── app.py                 # Servidor backend
├── agent_personalities.py # Personalidades dos agentes
├── index.html            # Interface do usuário
├── script.js             # Lógica do cliente
├── styles.css            # Estilos da aplicação
├── requirements.txt      # Dependências do projeto
└── static/               # Arquivos estáticos
    └── images/           # Imagens e vídeo do Guru
```

## Personalização

Você pode personalizar as personalidades dos agentes editando o arquivo `agent_personalities.py`. Cada agente possui uma descrição detalhada que define seu comportamento e estilo de comunicação.

## Tratamento de Erros

O sistema possui mecanismos robustos de tratamento de erros e fallback para garantir uma experiência contínua mesmo quando há problemas de conexão com a API.

## Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

<p align="center">Desenvolvido com ❤️ para o departamento de PCP</p>
