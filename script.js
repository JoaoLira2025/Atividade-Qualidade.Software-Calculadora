document.addEventListener('DOMContentLoaded', () => {
    const result = document.getElementById('result');
    let currentMode = 'DEG'; // DEG ou RAD

    // parser matemático mais seguro - SUBSTITUI eval()
    function safeEvaluate(expression) {
        
        const allowedChars = /^[0-9+\-*/().\sπesincostanlog√!]+$/;
        if (!allowedChars.test(expression)) {
            throw new Error('Caracteres inválidos na expressão');
        }
        
       
        const parentheses = expression.split('').filter(char => char === '(' || char === ')');
        let balance = 0;
        for (const char of parentheses) {
            balance += char === '(' ? 1 : -1;
            if (balance < 0) break;
        }
        if (balance !== 0) {
            throw new Error('Parênteses desbalanceados');
        }
        
    
        try {
            // Usa Function constructor que é mais seguro que eval
            return new Function('return ' + expression)();
        } catch (error) {
            throw new Error('Expressão matemática inválida');
        }
    }

    // Função para atualizar a tela
    const updateDisplay = (value) => {
        if (result.value === '0' && !isNaN(value)) {
            result.value = value;
        } else {
            result.value += value;
        }
    };

    // Função para calcular o resultado mais segura
    const calculate = () => {
        try {
            let expression = result.value
                .replace('×', '*')
                .replace('π', Math.PI)
                .replace('e', Math.E);
            
            // Manipular funções trigonométricas
            expression = expression.replace(/sin\((.*?)\)/g, (match, p1) => {
                const val = parseFloat(p1);
                return currentMode === 'DEG' ? Math.sin(val * Math.PI / 180) : Math.sin(val);
            }).replace(/cos\((.*?)\)/g, (match, p1) => {
                const val = parseFloat(p1);
                return currentMode === 'DEG' ? Math.cos(val * Math.PI / 180) : Math.cos(val);
            }).replace(/tan\((.*?)\)/g, (match, p1) => {
                const val = parseFloat(p1);
                return currentMode === 'DEG' ? Math.tan(val * Math.PI / 180) : Math.tan(val);
            });

            // Manipular outras funções matemáticas
            expression = expression.replace(/log\((.*?)\)/g, (match, p1) => Math.log10(parseFloat(p1)))
                .replace(/ln\((.*?)\)/g, (match, p1) => Math.log(parseFloat(p1)))
                .replace(/√\((.*?)\)/g, (match, p1) => Math.sqrt(parseFloat(p1)))
                .replace(/(\d+)!/g, (match, p1) => {
                    let num = parseInt(p1);
                    let result = 1;
                    for(let i = 2; i <= num; i++) result *= i;
                    return result;
                });

            // SUBSTITUIR eval() POR PARSER SEGURO
            result.value = safeEvaluate(expression);
        } catch (error) {
            result.value = 'Error';
        }
    };

    // Event listeners para os botões
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            switch(value) {
                case 'C':
                    result.value = '0';
                    break;
                case '=':
                    calculate();
                    break;
                case 'Rad':
                case 'Deg':
                    currentMode = value.toUpperCase();
                    break;
                case 'sin':
                case 'cos':
                case 'tan':
                case 'log':
                case 'ln':
                case '√':
                    updateDisplay(value + '(');
                    break;
                default:
                    updateDisplay(value);
            }
        });
    });
});