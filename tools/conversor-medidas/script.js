document.addEventListener('DOMContentLoaded', function() {
    // Unidades de conversão para cada categoria
    const units = {
        length: {
            metro: { label: 'Metro (m)', toBase: 1 },
            centimetro: { label: 'Centímetro (cm)', toBase: 0.01 },
            milimetro: { label: 'Milímetro (mm)', toBase: 0.001 },
            quilometro: { label: 'Quilômetro (km)', toBase: 1000 },
            polegada: { label: 'Polegada (in)', toBase: 0.0254 },
            pe: { label: 'Pé (ft)', toBase: 0.3048 },
            jarda: { label: 'Jarda (yd)', toBase: 0.9144 },
            milha: { label: 'Milha (mi)', toBase: 1609.34 }
        },
        weight: {
            quilograma: { label: 'Quilograma (kg)', toBase: 1 },
            grama: { label: 'Grama (g)', toBase: 0.001 },
            miligrama: { label: 'Miligrama (mg)', toBase: 0.000001 },
            tonelada: { label: 'Tonelada (t)', toBase: 1000 },
            libra: { label: 'Libra (lb)', toBase: 0.453592 },
            onca: { label: 'Onça (oz)', toBase: 0.0283495 },
            stone: { label: 'Stone (st)', toBase: 6.35029 }
        },
        volume: {
            litro: { label: 'Litro (L)', toBase: 1 },
            mililitro: { label: 'Mililitro (mL)', toBase: 0.001 },
            metrocubico: { label: 'Metro cúbico (m³)', toBase: 1000 },
            centimetrocubico: { label: 'Centímetro cúbico (cm³)', toBase: 0.001 },
            galao: { label: 'Galão (EUA)', toBase: 3.78541 },
            galao_imp: { label: 'Galão (Imperial)', toBase: 4.54609 },
            onca_fluida: { label: 'Onça fluida (fl oz)', toBase: 0.0295735 },
            xicara: { label: 'Xícara', toBase: 0.24 }
        },
        temperature: {
            celsius: {
                label: 'Celsius (°C)',
                toBase: value => value,
                fromBase: value => value
            },
            fahrenheit: {
                label: 'Fahrenheit (°F)',
                toBase: value => (value - 32) * 5/9,
                fromBase: value => value * 9/5 + 32
            },
            kelvin: {
                label: 'Kelvin (K)',
                toBase: value => value - 273.15,
                fromBase: value => value + 273.15
            }
        },
        area: {
            metroquadrado: { label: 'Metro quadrado (m²)', toBase: 1 },
            centimetroquadrado: { label: 'Centímetro quadrado (cm²)', toBase: 0.0001 },
            quilometroquadrado: { label: 'Quilômetro quadrado (km²)', toBase: 1000000 },
            hectare: { label: 'Hectare (ha)', toBase: 10000 },
            acre: { label: 'Acre', toBase: 4046.86 },
            pe_quadrado: { label: 'Pé quadrado (ft²)', toBase: 0.092903 },
            polegada_quadrada: { label: 'Polegada quadrada (in²)', toBase: 0.00064516 }
        },
        speed: {
            mps: { label: 'Metro por segundo (m/s)', toBase: 1 },
            kmph: { label: 'Quilômetro por hora (km/h)', toBase: 0.277778 },
            mph: { label: 'Milha por hora (mph)', toBase: 0.44704 },
            no: { label: 'Nó (kn)', toBase: 0.514444 },
            ftps: { label: 'Pé por segundo (ft/s)', toBase: 0.3048 }
        },
        time: {
            segundo: { label: 'Segundo (s)', toBase: 1 },
            minuto: { label: 'Minuto (min)', toBase: 60 },
            hora: { label: 'Hora (h)', toBase: 3600 },
            dia: { label: 'Dia (d)', toBase: 86400 },
            semana: { label: 'Semana', toBase: 604800 },
            mes: { label: 'Mês (30 dias)', toBase: 2592000 },
            ano: { label: 'Ano (365 dias)', toBase: 31536000 }
        }
    };

    const fromUnitSelect = document.getElementById('fromUnit');
    const toUnitSelect = document.getElementById('toUnit');
    const fromValueInput = document.getElementById('fromValue');
    const resultContainer = document.getElementById('result-container');
    const resultValue = document.getElementById('result-value');
    const resultFormula = document.getElementById('result-formula');
    const historyList = document.getElementById('history-list');
    const noHistory = document.getElementById('no-history');

    let currentCategory = 'length';
    let conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];

    // Inicializar botões de categoria
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            populateUnitDropdowns();
            resetForm();
        });
    });

    // Preencher os dropdowns com as unidades
    function populateUnitDropdowns() {
        fromUnitSelect.innerHTML = '';
        toUnitSelect.innerHTML = '';

        const categoryUnits = units[currentCategory];

        for (const unitKey in categoryUnits) {
            const unitInfo = categoryUnits[unitKey];

            const fromOption = document.createElement('option');
            fromOption.value = unitKey;
            fromOption.textContent = unitInfo.label;
            fromUnitSelect.appendChild(fromOption);

            const toOption = document.createElement('option');
            toOption.value = unitKey;
            toOption.textContent = unitInfo.label;
            toUnitSelect.appendChild(toOption);
        }

        // Definir valores padrão diferentes para evitar a mesma unidade
        if (fromUnitSelect.options.length > 1) {
            toUnitSelect.selectedIndex = 1;
        }
    }

    // Converter unidades
    function convert() {
        const fromValue = parseFloat(fromValueInput.value);
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;

        if (isNaN(fromValue)) {
            alert('Por favor, digite um valor válido.');
            return;
        }

        let result;
        let formula;

        if (currentCategory === 'temperature') {
            // Conversão especial para temperatura
            const toCelsius = units[currentCategory][fromUnit].toBase(fromValue);
            result = units[currentCategory][toUnit].fromBase(toCelsius);

            if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
                formula = `${fromValue}°C × 9/5 + 32 = ${result.toFixed(2)}°F`;
            } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
                formula = `(${fromValue}°F - 32) × 5/9 = ${result.toFixed(2)}°C`;
            } else if (fromUnit === 'celsius' && toUnit === 'kelvin') {
                formula = `${fromValue}°C + 273.15 = ${result.toFixed(2)}K`;
            } else if (fromUnit === 'kelvin' && toUnit === 'celsius') {
                formula = `${fromValue}K - 273.15 = ${result.toFixed(2)}°C`;
            } else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') {
                formula = `(${fromValue}°F - 32) × 5/9 + 273.15 = ${result.toFixed(2)}K`;
            } else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') {
                formula = `(${fromValue}K - 273.15) × 9/5 + 32 = ${result.toFixed(2)}°F`;
            } else {
                formula = `${fromValue} = ${result.toFixed(2)}`;
            }
        } else {
            // Conversão normal para outras unidades
            const baseValue = fromValue * units[currentCategory][fromUnit].toBase;
            result = baseValue / units[currentCategory][toUnit].toBase;

            const fromLabel = units[currentCategory][fromUnit].label.split(' ')[0];
            const toLabel = units[currentCategory][toUnit].label.split(' ')[0];

            formula = `${fromValue} ${fromLabel} = ${result.toFixed(6)} ${toLabel}`;
        }

        // Exibir o resultado
        resultValue.textContent = formatNumber(result);
        resultFormula.textContent = formula;
        resultContainer.style.display = 'block';

        // Adicionar ao histórico
        addToHistory(fromValue, fromUnit, toUnit, result);
    }

    // Formatar números
    function formatNumber(num) {
        if (num === 0) return '0';

        const absNum = Math.abs(num);
        if (absNum < 0.000001 || absNum > 999999999) {
            return num.toExponential(6);
        }

        if (Number.isInteger(num)) {
            return num.toString();
        }

        // Ajustar casas decimais dependendo do tamanho do número
        if (absNum < 0.001) {
            return num.toFixed(6);
        } else if (absNum < 1) {
            return num.toFixed(4);
        } else if (absNum < 100) {
            return num.toFixed(2);
        } else {
            return num.toFixed(1);
        }
    }

    // Adicionar conversão ao histórico
    function addToHistory(fromValue, fromUnit, toUnit, result) {
        const fromLabel = units[currentCategory][fromUnit].label.split(' ')[0];
        const toLabel = units[currentCategory][toUnit].label.split(' ')[0];

        const historyItem = {
            text: `${fromValue} ${fromLabel} = ${formatNumber(result)} ${toLabel}`,
            category: currentCategory,
            time: new Date().toLocaleTimeString()
        };

        conversionHistory.unshift(historyItem);
        if (conversionHistory.length > 10) {
            conversionHistory.pop();
        }

        localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
        updateHistoryDisplay();
    }

    // Atualizar exibição do histórico
    function updateHistoryDisplay() {
        if (conversionHistory.length === 0) {
            noHistory.style.display = 'block';
            return;
        }

        noHistory.style.display = 'none';
        historyList.innerHTML = '';

        conversionHistory.forEach(item => {
            const historyItemElement = document.createElement('div');
            historyItemElement.className = 'history-item';

            const historyText = document.createElement('div');
            historyText.className = 'history-text';
            historyText.textContent = item.text;

            const historyTime = document.createElement('div');
            historyTime.className = 'history-time';
            historyTime.textContent = item.time;

            historyItemElement.appendChild(historyText);
            historyItemElement.appendChild(historyTime);
            historyList.appendChild(historyItemElement);
        });
    }

    // Limpar histórico
    document.getElementById('clear-history-btn').addEventListener('click', function() {
        conversionHistory = [];
        localStorage.removeItem('conversionHistory');
        updateHistoryDisplay();
    });

    // Trocar unidades
    document.getElementById('swap-btn').addEventListener('click', function() {
        const tempIndex = fromUnitSelect.selectedIndex;
        fromUnitSelect.selectedIndex = toUnitSelect.selectedIndex;
        toUnitSelect.selectedIndex = tempIndex;

        if (resultContainer.style.display !== 'none') {
            convert();
        }
    });

    // Resetar formulário
    function resetForm() {
        fromValueInput.value = '';
        resultContainer.style.display = 'none';
    }

    document.getElementById('reset-btn').addEventListener('click', resetForm);

    // Evento de conversão
    document.getElementById('convert-btn').addEventListener('click', convert);

    document.getElementById('converter-form').addEventListener('submit', function(e) {
        e.preventDefault();
        convert();
    });

    // Inicialização
    populateUnitDropdowns();
    updateHistoryDisplay();
});