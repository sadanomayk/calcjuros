// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const tipoCobrancaSelect = document.getElementById('tipoCobranca');
    const parcelasInputGroup = document.getElementById('parcelasInputGroup');
    const taxaJuroLabel = document.getElementById('taxaJuroLabel');
    const valorVendaInput = document.getElementById('valorVenda');
    const quantidadeParcelasInput = document.getElementById('quantidadeParcelas');
    const taxaParcelaInput = document.getElementById('taxaParcela');
    const calcularBtn = document.getElementById('calcularBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultadoDiv = document.getElementById('resultado');

    // Elementos de erro
    const valorVendaError = document.getElementById('valorVendaError');
    const parcelasError = document.getElementById('parcelasError');
    const taxaError = document.getElementById('taxaError');

    // Ajusta a visibilidade do campo de parcelas baseado no tipo de cobrança
    function mostrarEsconderParcelas() {
      if (tipoCobrancaSelect.value === 'unica') {
        parcelasInputGroup.style.display = 'none';
        taxaJuroLabel.textContent = 'Taxa de Juro (%)';
      } else {
        parcelasInputGroup.style.display = 'block';
        taxaJuroLabel.textContent = 'Taxa de Juro por Parcela (%)';
      }
    }

    // Formatação de entrada para valores monetários (MODIFICADO para formatação em tempo real)
    function formatarInputMoeda(input) {
      let valor = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito

      if (valor === '') {
        input.value = ''; // Se não houver dígitos, limpa o campo
        return;
      }

      valor = parseInt(valor, 10); // Converte para número inteiro (centavos)

      let valorFormatado = (valor / 100).toLocaleString('pt-BR', { // Divide por 100 e formata
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      input.value = valorFormatado;
    }

    // Formatação de entrada para porcentagens
    function formatarInputPorcentagem(input) {
      let valor = input.value.replace(/[^\d,]/g, '');
      valor = valor.replace(',', '.');
      if (valor !== '' && !isNaN(parseFloat(valor))) {
        input.value = parseFloat(valor).toFixed(2).replace('.', ',');
      }
    }

    // Validação do formulário
    function validarFormulario() {
      let isValid = true;

      // Validar valor da venda
      const valorVenda = valorVendaInput.value.replace(',', '.');
      if (valorVenda === '' || isNaN(parseFloat(valorVenda)) || parseFloat(valorVenda) <= 0) {
        valorVendaError.textContent = 'Digite um valor de venda válido';
        valorVendaInput.classList.add('error');
        isValid = false;
      } else {
        valorVendaError.textContent = '';
        valorVendaInput.classList.remove('error');
      }

      // Validar quantidade de parcelas (se necessário)
      if (tipoCobrancaSelect.value === 'parcela') {
        const parcelas = parseInt(quantidadeParcelasInput.value);
        if (isNaN(parcelas) || parcelas < 1 || parcelas > 24) {
          parcelasError.textContent = 'Digite um número de parcelas entre 1 e 24';
          quantidadeParcelasInput.classList.add('error');
          isValid = false;
        } else {
          parcelasError.textContent = '';
          quantidadeParcelasInput.classList.remove('error');
        }
      }

      // Validar taxa de juros
      const taxa = taxaParcelaInput.value.replace(',', '.');
      if (taxa === '' || isNaN(parseFloat(taxa))) {
        taxaError.textContent = 'Digite uma taxa de juros válida';
        taxaParcelaInput.classList.add('error');
        isValid = false;
      } else if (parseFloat(taxa) < 0 || parseFloat(taxa) >= 100) {
        taxaError.textContent = 'A taxa deve estar entre 0% e 100%';
        taxaParcelaInput.classList.add('error');
        isValid = false;
      } else {
        taxaError.textContent = '';
        taxaParcelaInput.classList.remove('error');
      }

      return isValid;
    }

    // Formata valor para exibição monetária
    function formatarMoeda(valor) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valor);
    }

    // Cálculo detalhado para exibição
    function gerarDetalhesCalculo(valorOriginal, valorFinal, parcelas, taxa, tipoCobranca, tipoParcelamento) {
      const diferenca = Math.abs(valorFinal - valorOriginal);
      const taxaEfetiva = (diferenca / valorOriginal * 100).toFixed(2);

      let detalhes = '';

      if (tipoParcelamento === 'vendedor') {
        detalhes = `<p>Valor original: ${formatarMoeda(valorOriginal)}</p>
                    <p>Desconto total: ${formatarMoeda(diferenca)} (${taxaEfetiva}%)</p>`;

        if (parcelas > 1) {
          const valorParcela = valorOriginal / parcelas;
          detalhes += `<p>Valor por parcela para o cliente: ${formatarMoeda(valorParcela)}</p>`;
        }
      } else {
        detalhes = `<p>Valor original: ${formatarMoeda(valorOriginal)}</p>
                    <p>Acréscimo total: ${formatarMoeda(diferenca)} (${taxaEfetiva}%)</p>`;

        if (parcelas > 1) {
          const valorParcela = valorFinal / parcelas;
          detalhes += `<p>Valor por parcela para o cliente: ${formatarMoeda(valorParcela)}</p>`;
        }
      }

      return detalhes;
    }

    // Função principal de cálculo
    function calcular() {
      // Validar formulário antes de calcular
      if (!validarFormulario()) {
        return;
      }

      // Mostrar indicador de carregamento
      loadingIndicator.classList.add('active');
      resultadoDiv.classList.remove('active');

      // Simular processamento (opcional, para melhor experiência do usuário)
      setTimeout(function() {
        // MODIFICAÇÃO IMPORTANTE AQUI: LIMPAR O VALOR ANTES DE CONVERTER PARA NÚMERO
        let valorVendaInputValue = valorVendaInput.value.replace(/\./g, '').replace(',', '.'); // Remove pontos e substitui vírgula por ponto
        let valorVenda = parseFloat(valorVendaInputValue);

        const tipoParcelamento = document.getElementById('tipoParcelamento').value;
        const tipoCobranca = tipoCobrancaSelect.value;

        let parcelas = 1;
        if (tipoCobranca === 'parcela') {
          parcelas = parseInt(quantidadeParcelasInput.value, 10);
        }

        const taxaParcela = parseFloat(taxaParcelaInput.value.replace(',', '.')) / 100;

        console.log("Valores de entrada:");
        console.log("Valor da Venda:", valorVenda);
        console.log("Tipo de Parcelamento:", tipoParcelamento);
        console.log("Tipo de Cobrança:", tipoCobranca);
        console.log("Parcelas:", parcelas);
        console.log("Taxa por Parcela:", taxaParcela);


        let valorFinal, valorCobrar, valorReceber;

        if (tipoCobranca === 'unica') {
          if (tipoParcelamento === 'vendedor') {
            valorFinal = valorVenda * (1 - taxaParcela);
            valorCobrar = valorVenda;
            valorReceber = valorFinal;
          } else { // cliente
            valorFinal = valorVenda / (1 - taxaParcela);
            valorCobrar = valorFinal;
            valorReceber = valorVenda;
          }
        } else { // parcela
          if (tipoParcelamento === 'vendedor') {
            valorFinal = valorVenda * (1 - (taxaParcela * parcelas));
            valorCobrar = valorVenda;
            valorReceber = valorFinal;
          } else { // cliente
            valorFinal = valorVenda / (1 - (taxaParcela * parcelas));
            valorCobrar = valorFinal;
            valorReceber = valorVenda;
          }
        }

        console.log("\nValores calculados ANTES da formatação:");
        console.log("Valor Final:", valorFinal);
        console.log("Valor a Cobrar:", valorCobrar);
        console.log("Valor a Receber:", valorReceber);


        // Atualizar a interface com os resultados
        document.getElementById('valorCobrar').textContent = formatarMoeda(valorCobrar);
        document.getElementById('valorReceber').textContent = formatarMoeda(valorReceber);

        // Gerar detalhes do cálculo
        const detalhes = gerarDetalhesCalculo(
          valorVenda,
          tipoParcelamento === 'vendedor' ? valorReceber : valorCobrar,
          parcelas,
          taxaParcela,
          tipoCobranca,
          tipoParcelamento
        );

        document.getElementById('resultadoDetalhes').innerHTML = detalhes;

        // Esconder indicador de carregamento e mostrar resultados
        loadingIndicator.classList.remove('active');
        resultadoDiv.classList.add('active');

        // Rolar até os resultados
        resultadoDiv.scrollIntoView({ behavior: 'smooth' });

      }, 500); // Tempo de simulação do processamento
    }

    // Inicialização e event listeners
    mostrarEsconderParcelas();

    // Evento para mostrar/esconder campo de parcelas
    tipoCobrancaSelect.addEventListener('change', mostrarEsconderParcelas);

    // Formatação dos inputs monetários (MODIFICADO - evento 'input')
    valorVendaInput.addEventListener('input', function() {
      formatarInputMoeda(this);
    });

    // Formatação dos inputs de porcentagem
    taxaParcelaInput.addEventListener('blur', function() {
      formatarInputPorcentagem(this);
    });

    // Evento de clique no botão calcular
    calcularBtn.addEventListener('click', calcular);

    // Evento de envio do formulário (prevenir comportamento padrão)
    document.getElementById('calculadoraForm').addEventListener('submit', function(e) {
      e.preventDefault();
      calcular();
    });

    // Permitir pressionar Enter para calcular
    document.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        calcular();
      }
    });
  });