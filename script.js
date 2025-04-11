import confetti from 'canvas-confetti';

const letterDisplay = document.getElementById('letter-display');
const optionsContainer = document.getElementById('options-container');
const feedback = document.getElementById('feedback');
const nextButton = document.getElementById('next-button');

// Simple alphabet - using uppercase letters for clarity
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
let currentLetter = '';
let correctAnswers = 0;
let totalAttempts = 0;
const numberOfOptions = 4; // How many choices to display

function getRandomLetter(excludeArray = []) {
    let availableLetters = alphabet.filter(letter => !excludeArray.includes(letter));
    if (availableLetters.length === 0) return null; // Should not happen with enough letters
    const randomIndex = Math.floor(Math.random() * availableLetters.length);
    return availableLetters[randomIndex];
}

function displayNewLetter() {
    currentLetter = getRandomLetter();
    if (!currentLetter) {
        letterDisplay.textContent = 'Fim!';
        optionsContainer.innerHTML = '';
        feedback.textContent = `Pontuação final: ${correctAnswers} de ${totalAttempts}`;
        nextButton.style.display = 'none';
        return;
    }

    letterDisplay.textContent = currentLetter;
    feedback.textContent = '';
    nextButton.style.display = 'none'; // Hide until answer is given

    // Prepare options
    let options = [currentLetter];
    let excluded = [currentLetter];
    while (options.length < numberOfOptions) {
        const randomOption = getRandomLetter(excluded);
        if(randomOption) {
            options.push(randomOption);
            excluded.push(randomOption);
        } else {
            // Fallback if not enough unique letters (unlikely with full alphabet)
            break;
        }
    }

    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    // Create buttons
    optionsContainer.innerHTML = ''; // Clear previous options
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-button');
        button.addEventListener('click', handleAnswer);
        optionsContainer.appendChild(button);
    });
}

function handleAnswer(event) {
    const selectedButton = event.target;
    const selectedLetter = selectedButton.textContent;
    totalAttempts++;

    // Disable all buttons after selection
    const buttons = optionsContainer.querySelectorAll('.option-button');
    buttons.forEach(button => button.disabled = true);

    if (selectedLetter === currentLetter) {
        selectedButton.classList.add('correct');
        feedback.textContent = 'Correto! 🎉';
        feedback.style.color = '#28a745';
        correctAnswers++;
        // Launch confetti!
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    } else {
        selectedButton.classList.add('incorrect');
        feedback.textContent = `Incorreto. A letra era ${currentLetter}.`;
        feedback.style.color = '#dc3545';
        // Highlight the correct one
        buttons.forEach(button => {
            if (button.textContent === currentLetter) {
                button.classList.add('correct'); // Show the right answer
            }
        });
    }

    nextButton.style.display = 'inline-block'; // Show next button
}

// Event listener for the next button
nextButton.addEventListener('click', displayNewLetter);

// Initial setup
displayNewLetter();

