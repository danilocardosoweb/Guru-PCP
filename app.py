from flask import Flask, request, jsonify, send_from_directory
import requests
import os
import json
import ssl

# Importar as personalidades dos agentes do arquivo separado
from agent_personalities import AGENT_PERSONALITIES

# Desabilitar verificação de SSL para facilitar o desenvolvimento
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

app = Flask(__name__, static_folder='static')

# Configuração da API OpenRouter
# Chave atualizada para garantir que estamos usando a mais recente
OPENROUTER_API_KEY = "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"
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Configuração de fallback para quando a API não responder
FALLBACK_RESPONSES = {
    "pcp": "Desculpe, estou com dificuldades para me conectar ao serviço neste momento. Como especialista em PCP, posso ajudar com questões sobre planejamento de produção, gestão de capacidade e otimização de processos quando o serviço for restaurado.",
    "logistica": "Desculpe, estou com dificuldades para me conectar ao serviço neste momento. Como especialista em Logística, posso ajudar com questões sobre gestão de estoque, transporte e distribuição quando o serviço for restaurado.",
    "vendas": "Desculpe, estou com dificuldades para me conectar ao serviço neste momento. Como especialista em Vendas e Trade Marketing, posso ajudar com estratégias de vendas, gestão de clientes e marketing quando o serviço for restaurado.",
    "financeiro": "Desculpe, estou com dificuldades para me conectar ao serviço neste momento. Como especialista em Financeiro e Controladoria, posso ajudar com análise financeira, contabilidade e gestão de custos quando o serviço for restaurado."
}

# Desabilitar avisos de SSL para debug
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Configuração HTTP para debug
os.environ['PYTHONHTTPSVERIFY'] = '0'  # Desabilita verificação SSL para debug

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    agent_type = data.get('agent', 'pcp')
    model_type = data.get('model', 'openai/gpt-3.5-turbo')
    
    # Obter a personalidade do agente
    personality = AGENT_PERSONALITIES.get(agent_type, AGENT_PERSONALITIES['pcp'])
    
    # Usar o modelo selecionado pelo usuário em vez do modelo padrão do agente
    print(f"Usando modelo: {model_type}")
    # Verificar se o modelo é válido
    if model_type not in ["openai/gpt-3.5-turbo", "openai/gpt-4o", "anthropic/claude-3-haiku", "anthropic/claude-3-sonnet", "google/gemini-pro"]:
        model_type = "openai/gpt-3.5-turbo"  # Modelo padrão se o selecionado não for válido
    
    # Construir o sistema de mensagens com a personalidade do agente
    system_message = f"""
    {personality['description']}
    
    Importante:
    1. Responda sempre em Português Brasileiro (PT-BR).
    2. Use formato de números brasileiro: 1.000,50 (milhar com ponto, decimal com vírgula).
    3. Use formato de data brasileiro: DD/MM/AAAA.
    4. Seja cordial, mas não excessivamente formal.
    5. Use técnicas de PNL para criar rapport e empatia.
    6. Forneça informações precisas e atualizadas.
    7. Quando não souber a resposta, seja honesto e ofereça alternativas.
    8. Mantenha suas respostas concisas e diretas ao ponto.
    """
    
    # Preparar a requisição para o OpenRouter
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5000",  # Opcional: identificar a origem da requisição
        "X-Title": "Guru PCP - Assistente Especializado"  # Opcional: identificar o aplicativo
    }
    
    payload = {
        "model": model_type,  # Usar o modelo selecionado pelo usuário
        "messages": [
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message}
        ],
        "temperature": 0.7,
        "max_tokens": 1000
    }
    
    try:
        print(f"\n\n===== INICIANDO REQUISIÇÃO PARA OPENROUTER =====")
        print(f"URL: {OPENROUTER_API_URL}")
        print(f"API Key: {OPENROUTER_API_KEY[:10]}...")
        print(f"Headers: {headers}")
        print(f"Payload: {json.dumps(payload, indent=2)}")
        
        # Definir um timeout para evitar que a requisição fique pendente por muito tempo
        timeout_seconds = 30
        
        # Fazer a requisição para o OpenRouter com verificação SSL desativada para debug
        response = requests.post(OPENROUTER_API_URL, headers=headers, json=payload, verify=False, timeout=timeout_seconds)
        
        print(f"\n===== RESPOSTA RECEBIDA =====")
        print(f"Status code: {response.status_code}")
        print(f"Resposta bruta: {response.text}")
        print(f"===== FIM DA RESPOSTA =====\n")
        
        # Verificar se a resposta é válida
        if response.status_code != 200:
            error_message = f"Erro na API (Status {response.status_code}): "
            try:
                error_data = response.json()
                error_detail = error_data.get('error', {}).get('message', 'Detalhes não disponíveis')
                error_message += error_detail
            except:
                error_message += "Não foi possível obter detalhes do erro."
                
            print(f"ERRO: {error_message}")
            return jsonify({"response": f"Desculpe, estou com dificuldades para me conectar ao serviço. Erro: {error_message}"})
        
        # Tentar processar a resposta JSON
        try:
            response_data = response.json()
            print(f"Resposta JSON: {json.dumps(response_data, indent=2)}")
            
            # Extrair a resposta do modelo
            if 'choices' in response_data and len(response_data['choices']) > 0:
                agent_response = response_data['choices'][0]['message']['content']
            else:
                error_message = response_data.get('error', {}).get('message', 'Erro desconhecido')
                agent_response = f"Desculpe, não consegui processar sua solicitação. Erro: {error_message}"
        except ValueError as json_error:
            print(f"Erro ao processar JSON: {str(json_error)}")
            agent_response = "Desculpe, recebi uma resposta inválida do serviço. Por favor, tente novamente mais tarde."
        
        return jsonify({"response": agent_response})
    
    except requests.exceptions.Timeout:
        print("ERRO: Timeout ao conectar com a API do OpenRouter")
        fallback_message = FALLBACK_RESPONSES.get(agent_type, FALLBACK_RESPONSES['pcp'])
        return jsonify({"response": f"{fallback_message} (Erro: Timeout na conexão)"})
        
    except requests.exceptions.ConnectionError:
        print("ERRO: Falha de conexão com a API do OpenRouter")
        fallback_message = FALLBACK_RESPONSES.get(agent_type, FALLBACK_RESPONSES['pcp'])
        return jsonify({"response": f"{fallback_message} (Erro: Falha na conexão)"})
        
    except requests.exceptions.RequestException as req_err:
        print(f"ERRO na requisição: {str(req_err)}")
        fallback_message = FALLBACK_RESPONSES.get(agent_type, FALLBACK_RESPONSES['pcp'])
        return jsonify({"response": f"{fallback_message} (Erro: Problema na requisição)"})
        
    except Exception as e:
        print(f"ERRO geral ao processar a solicitação: {str(e)}")
        fallback_message = FALLBACK_RESPONSES.get(agent_type, FALLBACK_RESPONSES['pcp'])
        return jsonify({"response": f"{fallback_message} (Erro interno no servidor)"}), 500

# Rota para servir arquivos estáticos (necessário para o Vercel)
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# Rota para a raiz
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
