document.addEventListener('DOMContentLoaded', () => {
    const hexNumberElement = document.getElementById('hexNumber');
    const userInput = document.getElementById('userInput');
    const checkAnswerBtn = document.getElementById('checkAnswer');
    const showExplanationBtn = document.getElementById('showExplanation');
    const feedbackElement = document.getElementById('feedback');
    const explanationElement = document.getElementById('explanation');

    let currentHex = generateRandomHex();

    // Zobrazí náhodné HEX číslo
    hexNumberElement.textContent = `0x${currentHex.toUpperCase()}`;

    // Kontrola odpovědi
    checkAnswerBtn.addEventListener('click', () => {
        const userAnswer = parseInt(userInput.value, 10);
        const correctAnswer = parseInt(currentHex, 16);

        if (userAnswer === correctAnswer) {
            feedbackElement.innerHTML = `<p class="success">Správně! ${currentHex} v dekadickém je ${correctAnswer}.</p>`;
        } else {
            feedbackElement.innerHTML = `<p class="error">Špatně. Správná odpověď je ${correctAnswer}.</p>`;
        }

        userInput.value = ''; // Vymaže pole po kontrole
    });

    // Zobrazí vysvětlení s podrobným postupem výpočtu
    showExplanationBtn.addEventListener('click', () => {
        const correctAnswer = parseInt(currentHex, 16);

        explanationElement.innerHTML = `
        <div class="explanation-box">
            <h3>Vysvětlení převodu z HEX na dekadickou hodnotu:</h3>
            <p><strong>HEX číslo:</strong> ${currentHex.toUpperCase()}</p>
            <p>Převádíme HEX na dekadickou hodnotu pomocí následujícího vzorce:</p>
            <p><strong>Vzorec:</strong></p>
            <pre>
(HEX číslo) = (Hodnota prvního znaku × 16<sup>1</sup>) + (Hodnota druhého znaku × 16<sup>0</sup>)
            </pre>
            <p>Každý znak HEX čísla má hodnotu podle tabulky:</p>
            <ul>
                <li>0-9: odpovídá dekadickým hodnotám 0-9</li>
                <li>A-F: odpovídá dekadickým hodnotám 10-15</li>
            </ul>
            <p>Pokud máme HEX číslo <strong>${currentHex.toUpperCase()}</strong>, postupujeme takto:</p>
            <pre>
${currentHex.toUpperCase().charAt(0)} × 16<sup>1</sup> + ${currentHex.toUpperCase().charAt(1)} × 16<sup>0</sup>
            </pre>
            <p>Například pro ${currentHex.toUpperCase()} (${currentHex.toUpperCase().charAt(0)} = ${parseInt(currentHex.charAt(0), 16)} a ${currentHex.toUpperCase().charAt(1)} = ${parseInt(currentHex.charAt(1), 16)}):</p>
            <pre>
${parseInt(currentHex.charAt(0), 16)} × 16 + ${parseInt(currentHex.charAt(1), 16)} × 1 = ${correctAnswer}
            </pre>
            <p>Výsledná dekadická hodnota je tedy <strong>${correctAnswer}</strong>.</p>
        </div>`;
    });

    // Generování náhodného HEX čísla
    function generateRandomHex() {
        const randomValue = Math.floor(Math.random() * 256);
        return randomValue.toString(16).padStart(2, '0');
    }
});
