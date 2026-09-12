// app.js

// Importa o banco de dados e as funções do motor 3D
import bancoDeDadosOlho from './bancoDeDados.js';
import { 
    inicializarRenderizacao, 
    alternarEstratificacao, 
    verificarClique, 
    destacarEstrutura 
} from './renderizacao.js';

// Aguarda o HTML carregar completamente antes de rodar os scripts
document.addEventListener('DOMContentLoaded', () => {
    
    // Captura os elementos da interface (que criaremos no HTML)
    const conteiner3D = document.getElementById('conteiner-3d');
    const btnEstratificar = document.getElementById('btn-estratificar');
    
    // 1. Inicializa o cenário 3D dentro da div escolhida
    inicializarRenderizacao('conteiner-3d');

    // 2. Escuta os cliques do mouse apenas dentro da área do 3D
    conteiner3D.addEventListener('click', (evento) => {
        // Usa a função do motor 3D para saber se bateu em alguma estrutura
        const idClicado = verificarClique(evento, conteiner3D);

        if (idClicado) {
            // Faz a estrutura brilhar no 3D
            destacarEstrutura(idClicado);
            
            // Atualiza o painel lateral de texto
            exibirInformacoesPainel(idClicado);
        }
    });

    // 3. Botão de Estratificação (Explodir o modelo em camadas)
    btnEstratificar.addEventListener('click', () => {
        alternarEstratificacao();
        
        // Alterna o texto do botão para o usuário saber a próxima ação
        if (btnEstratificar.innerText.includes("Separar")) {
            btnEstratificar.innerText = "Juntar Camadas do Olho";
            btnEstratificar.classList.add("ativo");
        } else {
            btnEstratificar.innerText = "Separar em Camadas (Estratificar)";
            btnEstratificar.classList.remove("ativo");
        }
    });
});

// Função para buscar os dados e montar o texto no painel
function exibirInformacoesPainel(idClicado) {
    // Busca no array do bancoDeDados.js o objeto que tem o mesmo ID
    const estrutura = bancoDeDadosOlho.find(item => item.id === idClicado);

    // Se por acaso clicar em algo sem ID cadastrado, ignora
    if (!estrutura) return;

    // Pega a área de conteúdo onde o texto vai entrar
    const painelConteudo = document.getElementById('painel-conteudo');

    // Monta o cabeçalho e informações principais
    let html = `
        <span class="categoria">${estrutura.categoria}</span>
        <h2>${estrutura.nome}</h2>
        <p class="descricao"><strong>Descrição:</strong> ${estrutura.descricao}</p>
        <p class="funcao"><strong>Função:</strong> ${estrutura.funcao}</p>
    `;

    // Monta a lista de Detalhes Anatômicos
    if (estrutura.detalhesAnatomicos.length > 0) {
        html += `
            <div class="secao-detalhes">
                <h3>Estrutura e Anatomia</h3>
                <ul>
        `;
        estrutura.detalhesAnatomicos.forEach(detalhe => {
            html += `<li>${detalhe}</li>`;
        });
        html += `</ul></div>`;
    }

    // Monta a seção de Patologias / Notas Clínicas (se houver alguma)
    if (estrutura.notasClinicas.length > 0) {
        html += `
            <div class="secao-clinica">
                <h3>🏥 Correlação Clínica / Patologia</h3>
                <ul>
        `;
        estrutura.notasClinicas.forEach(nota => {
            html += `<li>${nota}</li>`;
        });
        html += `</ul></div>`;
    }

    // Aplica o HTML gerado na tela com uma animação suave
    painelConteudo.style.opacity = 0;
    setTimeout(() => {
        painelConteudo.innerHTML = html;
        painelConteudo.style.opacity = 1;
    }, 150); // 150ms de transição para não trocar o texto de forma "seca"
}
