document.addEventListener('DOMContentLoaded', () => {
    const hexNumberElement = document.getElementById('hexNumber');
    const userInput = document.getElementById('userInput');
    const checkAnswerBtn = document.getElementById('checkAnswer');
    const showExplanationBtn = document.getElementById('showExplanation');
    const feedbackElement = document.getElementById('feedback');
    const explanationElement = document.getElementById('explanation');
    const regenerateElement = document.getElementById('regenerate');

    let currentHex = generateRandomHex();

    // Zobrazí náhodné HEX číslo
    hexNumberElement.textContent = `0x${currentHex.toUpperCase()}`;

    // Kontrola odpovědi
    checkAnswerBtn.addEventListener('click', () => {
        const userAnswer = parseInt(userInput.value, 10);
        const correctAnswer = parseInt(currentHex, 16);

        if (userAnswer === correctAnswer) {
            feedbackElement.innerHTML = `Správně! ${currentHex} v dekadickém je ${correctAnswer}.`;
        } else {
            feedbackElement.innerHTML = `Špatně. Správná odpověď je ${correctAnswer}.`;
        }

        userInput.value = ''; // Vymaže pole po kontrole
    });

    // Zobrazí vysvětlení s podrobným postupem výpočtu
    showExplanationBtn.addEventListener('click', () => {
        const correctAnswer = parseInt(currentHex, 16);

        explanationElement.innerHTML = `
            Vysvětlení převodu z HEX na dekadickou hodnotu:
            HEX číslo: ${currentHex.toUpperCase()}
            Převádíme HEX na dekadickou hodnotu pomocí následujícího vzorce:
            Vzorec:
            (HEX číslo) = (Hodnota prvního znaku × 16^1) + (Hodnota druhého znaku × 16^0)
            
            Každý znak HEX čísla má hodnotu podle tabulky:
            
                0-9: odpovídá dekadickým hodnotám 0-9
                A-F: odpovídá dekadickým hodnotám 10-15
            
            Pokud máme HEX číslo ${currentHex.toUpperCase()}, postupujeme takto:
            ${currentHex.toUpperCase().charAt(0)} × 16^1 + ${currentHex.toUpperCase().charAt(1)} × 16^0
            
            Například pro ${currentHex.toUpperCase()} (${currentHex.toUpperCase().charAt(0)} = ${parseInt(currentHex.charAt(0), 16)} a ${currentHex.toUpperCase().charAt(1)} = ${parseInt(currentHex.charAt(1), 16)}):
            ${parseInt(currentHex.charAt(0), 16)} × 16 + ${parseInt(currentHex.charAt(1), 16)} × 1 = ${correctAnswer}
            
            Výsledná dekadická hodnota je tedy ${correctAnswer}.
        `;
    });

    // Generování náhodného HEX čísla
    function generateRandomHex() {
        const randomValue = Math.floor(Math.random() * 256);
        return randomValue.toString(16).padStart(2, '0');
    }

    // Přegenerovat tlačítko
    regenerateElement.addEventListener('click', () => {
        currentHex = generateRandomHex();
        hexNumberElement.textContent = `0x${currentHex.toUpperCase()}`;
        feedbackElement.innerHTML = ''; // Vymaže zpětnou vazbu
        explanationElement.innerHTML = ''; // Vymaže vysvětlení
    });
});
