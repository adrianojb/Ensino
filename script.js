import confetti from 'canvas-confetti';

const letterDisplay = document.getElementById('letter-display');
const optionsContainer = document.getElementById('options-container');
const feedback = document.getElementById('feedback');
const nextButton = document.getElementById('next-button');


const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
let currentLetter = '';
let correctAnswers = 0;
let totalAttempts = 0;
const numberOfOptions = 4; 

function getRandomLetter(excludeArray = []) {
    let availableLetters = alphabet.filter(letter => !excludeArray.includes(letter));
    if (availableLetters.length === 0) return null; 
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
    nextButton.style.display = 'none'; 

    
    let options = [currentLetter];
    let excluded = [currentLetter];
    while (options.length < numberOfOptions) {
        const randomOption = getRandomLetter(excluded);
        if(randomOption) {
            options.push(randomOption);
            excluded.push(randomOption);
        } else {
            
            break;
        }
    }

   
    options.sort(() => Math.random() - 0.5);

   
    optionsContainer.innerHTML = ''; 
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

    
    const buttons = optionsContainer.querySelectorAll('.option-button');
    buttons.forEach(button => button.disabled = true);

    if (selectedLetter === currentLetter) {
        selectedButton.classList.add('correct');
        feedback.textContent = 'Correto! 🎉';
        feedback.style.color = '#28a745';
        correctAnswers++;
        
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    } else {
        selectedButton.classList.add('incorrect');
        feedback.textContent = `Incorreto. A letra era ${currentLetter}.`;
        feedback.style.color = '#dc3545';
        
        buttons.forEach(button => {
            if (button.textContent === currentLetter) {
                button.classList.add('correct'); 
            }
        });
    }

    nextButton.style.display = 'inline-block'; 


nextButton.addEventListener('click', displayNewLetter);


displayNewLetter();

