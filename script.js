document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const agentType = document.getElementById('agent-type');
    const clearChatButton = document.getElementById('clear-chat');
    const printChatButton = document.getElementById('print-chat');
    
    // Elementos do modal e logo
    const infoButton = document.getElementById('info-button');
    const infoModal = document.getElementById('info-modal');
    const closeButton = document.querySelector('.close-button');
    const guruLogo = document.getElementById('guru-logo');
    
    // Personalidades dos agentes
    const agentPersonalities = {
        pcp: {
            name: "Especialista em PCP",
            greeting: "Olá! Sou o especialista em Planejamento e Controle da Produção. Posso ajudar com questões sobre programação de produção, gestão de capacidade e otimização de processos. Como posso ajudar você hoje?",
            style: "agent-pcp"
        },
        logistica: {
            name: "Especialista em Logística",
            greeting: "Olá! Sou o especialista em Logística. Estou aqui para ajudar com questões sobre gestão de estoque, transporte, armazenagem e distribuição. Como posso ajudar você hoje?",
            style: "agent-logistica"
        },
        vendas: {
            name: "Especialista em Vendas e Trade Marketing",
            greeting: "Olá! Sou o especialista em Vendas e Trade Marketing. Posso ajudar com estratégias de vendas, gestão de clientes, promoções e marketing no ponto de venda. Como posso ajudar você hoje?",
            style: "agent-vendas"
        },
        financeiro: {
            name: "Especialista em Financeiro e Controladoria",
            greeting: "Olá! Sou o especialista em Financeiro e Controladoria. Estou aqui para ajudar com questões sobre análise financeira, contabilidade, custos e orçamentos. Como posso ajudar você hoje?",
            style: "agent-financeiro"
        }
    };
    
    // Atualizar a mensagem de boas-vindas quando o agente é alterado
    agentType.addEventListener('change', function() {
        const selectedAgent = agentType.value;
        const personality = agentPersonalities[selectedAgent];
        
        // Limpar o chat
        chatMessages.innerHTML = '';
        
        // Adicionar mensagem de boas-vindas do novo agente
        addMessage(personality.greeting, 'system');
    });
    
    // Enviar mensagem quando o botão for clicado
    sendButton.addEventListener('click', sendMessage);
    
    // Enviar mensagem quando Enter for pressionado (sem Shift)
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Função para enviar mensagem
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Adicionar mensagem do usuário ao chat
        addMessage(message, 'user');
        
        // Limpar o campo de entrada
        userInput.value = '';
        
        // Simular "digitando..."
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message agent';
        typingIndicator.innerHTML = `
            <div class="message-content">
                <p>Digitando...</p>
            </div>
        `;
        chatMessages.appendChild(typingIndicator);
        
        // Rolar para o final do chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Enviar a mensagem para o servidor e obter resposta
        const selectedAgent = agentType.value;
        
        // Obter o modelo selecionado
        const selectedModel = document.getElementById('model-type').value;
        
        // Fazer a requisição para o backend
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                agent: selectedAgent,
                model: selectedModel
            })
        })
        .then(response => response.json())
        .then(data => {
            // Remover o indicador de digitação
            chatMessages.removeChild(typingIndicator);
            
            // Adicionar a resposta do agente
            addMessage(data.response, 'agent');
        })
        .catch(error => {
            // Remover o indicador de digitação
            chatMessages.removeChild(typingIndicator);
            
            // Adicionar mensagem de erro
            addMessage("Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.", 'system');
            console.error('Erro:', error);
        });
    }
    
    // Função para adicionar mensagem ao chat
    function addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${formatMessage(message)}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageElement);
        
        // Rolar para o final do chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Função para formatar a mensagem (converter quebras de linha, etc.)
    function formatMessage(message) {
        return message
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }
    
    // Função para limpar a conversa
    clearChatButton.addEventListener('click', function() {
        // Limpar todas as mensagens
        chatMessages.innerHTML = '';
        
        // Adicionar mensagem de boas-vindas do agente atual
        const currentAgent = agentType.value;
        const personality = agentPersonalities[currentAgent];
        addMessage(personality.greeting, 'system');
    });
    
    // Função para imprimir a conversa
    printChatButton.addEventListener('click', function() {
        // Criar uma nova janela para impressão
        const printWindow = window.open('', '_blank');
        
        // Obter todas as mensagens da conversa
        const messages = chatMessages.innerHTML;
        
        // Preparar o conteúdo HTML para impressão
        const currentAgent = agentType.value;
        const agentName = agentPersonalities[currentAgent].name;
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Conversa com ${agentName}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        margin: 20px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid #ddd;
                    }
                    .header h1 {
                        margin-bottom: 5px;
                    }
                    .header p {
                        color: #666;
                        margin-top: 0;
                    }
                    .message {
                        margin-bottom: 15px;
                    }
                    .message-content {
                        padding: 10px;
                        border-radius: 8px;
                        display: inline-block;
                        max-width: 80%;
                    }
                    .user {
                        text-align: right;
                    }
                    .user .message-content {
                        background-color: #e6f7ff;
                        border: 1px solid #91d5ff;
                    }
                    .agent .message-content, .system .message-content {
                        background-color: #f1f1f1;
                        border: 1px solid #d9d9d9;
                    }
                    .footer {
                        margin-top: 30px;
                        text-align: center;
                        font-size: 12px;
                        color: #999;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Conversa com ${agentName}</h1>
                    <p>Data: ${new Date().toLocaleDateString('pt-BR')} - ${new Date().toLocaleTimeString('pt-BR')}</p>
                </div>
                <div class="chat-content">
                    ${messages}
                </div>
                <div class="footer">
                    <p>Guru PCP - Assistente Especializado</p>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `;
        
        // Escrever o conteúdo na nova janela e imprimir
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();
    });
    
    // Funções para o modal e animação do logo
    function openModal() {
        infoModal.style.display = 'block';
    }
    
    function closeModal() {
        infoModal.style.display = 'none';
    }
    
    // Alternar entre imagens do Guru para criar uma animação simples
    function animateGuru() {
        const images = [
            'static/images/Guru_olhos_aberto.png',
            'static/images/Guru_Olhos_fechado.png',
            'static/images/Guru_boca_aberta.png'
        ];
        
        let currentIndex = 0;
        
        // Mudar a imagem a cada 2 segundos
        setInterval(() => {
            guruLogo.src = images[currentIndex];
            currentIndex = (currentIndex + 1) % images.length;
        }, 2000);
    }
    
    // Event listeners para o modal
    infoButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    guruLogo.addEventListener('click', openModal);
    
    // Fechar o modal quando clicar fora dele
    window.addEventListener('click', function(event) {
        if (event.target === infoModal) {
            closeModal();
        }
    });
    
    // Iniciar a animação do Guru
    animateGuru();
    
    // Inicializar com a mensagem de boas-vindas do agente padrão
    const defaultAgent = agentType.value;
    const personality = agentPersonalities[defaultAgent];
    addMessage(personality.greeting, 'system');
});
