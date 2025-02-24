document.addEventListener('DOMContentLoaded', function() {
    // Lista de ferramentas disponíveis
    const tools = [
        {
            id: 'calculadora-juros-cartao',
            name: 'Calculadora de Juros de Cartão',
            description: 'Calcule os juros do seu cartão de crédito e veja quanto você pagará no total.',
            category: 'financas',
            icon: 'fa-credit-card',
            featured: true
        },
        {
            id: 'Conversor-Medidas',
            name: 'Conversor de Medidas',
            description: 'Transforme qualquer unidade de medida com facilidade usando nosso Conversor de Medidas!',
            category: 'conversores',
            icon: 'fa-exchange-alt',
            featured: true
        },
        {
            id: 'outra-ferramenta',
            name: 'Outra Ferramenta',
            description: 'Descrição da nova ferramenta.',
            category: 'utilidades',
            icon: 'fa-tools',
            featured: true
        },
    ];

    // Categorias disponíveis
    const categories = [
        { id: 'financas', name: 'Finanças', icon: 'fa-calculator' },
        { id: 'conversores', name: 'Conversores', icon: 'fa-exchange-alt' },
        { id: 'utilidades', name: 'Utilidades', icon: 'fa-tools' }
        // Adicione mais categorias conforme necessário
    ];

    // Função para carregar as ferramentas
    function loadTools(filter = 'all') {
        const toolsGrid = document.getElementById('tools-grid');
        toolsGrid.innerHTML = ''; // Limpa o conteúdo atual

        // Filtra as ferramentas se necessário
        const filteredTools = filter === 'all' 
            ? tools 
            : tools.filter(tool => tool.category === filter);

        // Verifica se há ferramentas para exibir
        if (filteredTools.length === 0) {
            toolsGrid.innerHTML = '<p class="no-tools">Nenhuma ferramenta encontrada nesta categoria.</p>';
            return;
        }

        // Adiciona cada ferramenta ao grid
        filteredTools.forEach(tool => {
            const toolCard = document.createElement('div');
            toolCard.className = 'tool-card';
            if (tool.featured) {
                toolCard.classList.add('featured');
            }
            toolCard.setAttribute('data-category', tool.category);

            toolCard.innerHTML = `
                <div class="tool-icon">
                    <i class="fas ${tool.icon}"></i>
                </div>
                <div class="tool-info">
                    <h3>${tool.name}</h3>
                    <p>${tool.description}</p>
                </div>
                <a href="tools/${tool.id}/index.html" class="tool-link">Abrir ferramenta</a>
            `;

            toolsGrid.appendChild(toolCard);
        });
    }

    // Função para buscar ferramentas
    function searchTools(query) {
        const toolsGrid = document.getElementById('tools-grid');
        toolsGrid.innerHTML = ''; // Limpa o conteúdo atual

        if (!query) {
            loadTools(); // Se a busca estiver vazia, carrega todas as ferramentas
            return;
        }

        // Filtra as ferramentas pelo termo de busca
        const filteredTools = tools.filter(tool => 
            tool.name.toLowerCase().includes(query.toLowerCase()) || 
            tool.description.toLowerCase().includes(query.toLowerCase())
        );

        // Verifica se há ferramentas para exibir
        if (filteredTools.length === 0) {
            toolsGrid.innerHTML = '<p class="no-tools">Nenhuma ferramenta encontrada para a busca.</p>';
            return;
        }

        // Adiciona cada ferramenta ao grid
        filteredTools.forEach(tool => {
            const toolCard = document.createElement('div');
            toolCard.className = 'tool-card';
            if (tool.featured) {
                toolCard.classList.add('featured');
            }
            toolCard.setAttribute('data-category', tool.category);

            toolCard.innerHTML = `
                <div class="tool-icon">
                    <i class="fas ${tool.icon}"></i>
                </div>
                <div class="tool-info">
                    <h3>${tool.name}</h3>
                    <p>${tool.description}</p>
                </div>
                <a href="tools/${tool.id}/index.html" class="tool-link">Abrir ferramenta</a>
            `;

            toolsGrid.appendChild(toolCard);
        });
    }

    // Função para carregar as categorias dinamicamente
    function loadCategories() {
        const categoryGrid = document.getElementById('category-grid');
        categoryGrid.innerHTML = ''; // Limpa o conteúdo atual

        // Adiciona cada categoria ao grid
        categories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.setAttribute('data-category', category.id);

            categoryCard.innerHTML = `
                <i class="fas ${category.icon}"></i>
                <h3>${category.name}</h3>
            `;

            // Adiciona evento de clique para filtrar as ferramentas
            categoryCard.addEventListener('click', function() {
                // Atualiza a tag ativa
                const tags = document.querySelectorAll('#filter-tags .tag');
                tags.forEach(tag => tag.classList.remove('active'));
                const targetTag = document.querySelector(`#filter-tags .tag[data-filter="${category.id}"]`);
                if (targetTag) {
                    targetTag.classList.add('active');
                }

                // Carrega as ferramentas filtradas
                loadTools(category.id);
                
                // Scroll para a seção de ferramentas
                document.getElementById('ferramentas').scrollIntoView({ behavior: 'smooth' });
            });

            categoryGrid.appendChild(categoryCard);
        });
    }

    // Inicialização
    loadTools(); // Carrega todas as ferramentas inicialmente
    loadCategories(); // Carrega as categorias

    // Configurar filtros de tag
    const filterTags = document.querySelectorAll('#filter-tags .tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Remove a classe 'active' de todas as tags
            filterTags.forEach(t => t.classList.remove('active'));
            
            // Adiciona a classe 'active' à tag clicada
            this.classList.add('active');
            
            // Filtra as ferramentas
            const filter = this.getAttribute('data-filter');
            loadTools(filter);
        });
    });

    // Configurar busca
    const searchInput = document.getElementById('search-tools');
    const searchBtn = document.getElementById('search-btn');

    searchBtn.addEventListener('click', function() {
        searchTools(searchInput.value);
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchTools(searchInput.value);
        }
    });

    // Configurar formulário de solicitação
    const requestForm = document.getElementById('request-form');
    requestForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Aqui você pode adicionar o código para enviar os dados do formulário
        // para um backend ou serviço de email
        
        // Exemplo simples de validação e feedback
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const toolName = document.getElementById('tool-name').value;
        const description = document.getElementById('description').value;
        
        if (name && email && toolName && description) {
            // Simulação de envio bem-sucedido
            alert(`Obrigado, ${name}! Sua solicitação para a ferramenta "${toolName}" foi enviada com sucesso. Entraremos em contato pelo email: ${email}`);
            requestForm.reset();
        } else {
            alert('Por favor, preencha todos os campos do formulário.');
        }
    });
});