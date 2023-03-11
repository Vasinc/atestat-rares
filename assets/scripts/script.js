// variables
const nav = document.querySelector('nav');
const navContainer = document.getElementById('nav-container')
const burgerMenu = document.querySelector('.burger-menu');
const h1 = document.querySelectorAll('h1');
const quizArrow = document.getElementById('quiz-arrow');
const chestionarUI = document.getElementById('chestionar-UI');
const percentageText = document.getElementById('percentage');
const backdrop = document.getElementById('backdrop');
const footer = document.querySelector('footer');
const textSection = document.querySelector('.chestionar-UI__text-section');
const buttonsSection = document.querySelector('.chestionar-UI__buttons-section');
const questionsSection = document.querySelector('.chestionar-UI__questions-section');
const resultSection = document.querySelector('.chestionar-UI__result-section');
const startQuizButton = document.getElementById('start-quiz__button');
const questionsCounter = questionsSection.querySelector('#questions-counter');
const questionText = questionsSection.querySelector('#question-text');
const answersContainer = document.querySelector('.answers-container');
const answers = questionsSection.querySelectorAll('.answer')
const submitButton = document.getElementById('submit-button');
const resultText = document.querySelector('.resultText');
const historySection = document.querySelector('.chestionar-UI__history-section')
const historyContainer = document.querySelector('.history-container');
const historyButton = document.getElementById('history__button');
const historyBackButton = document.getElementById('history-back__button');

let PREVIOUS_SCROLL_VALUE = 0;
let percentage = 0;
let textWasRead = false;
let rndNum;
let valueOfAnswer;
let result = 0;
let indexOfAnswer;
let leftQuestions;
let questionAnswersValues;
let previousResults = [];

const questions = [
    {
        question: "Când a început al doilea război mondial?",
        answers: {
            '1935': false,
            '1941': false,
            '1940': false,
            '1939': true
        }
    },
    {
        question: "Când s-a terminat al doilea război mondial?",
        answers: {
            '1944': false,
            '1960': false,
            '1945': true,
            '1989': false
        }
    },
    {
        question: "Care dintre următoarele țări au format o alianță?",
        answers: {
            'Japonia, Germania, Italia': true,
            'Japonia, S.U.A, USSR': false,
            'Italia, Spania, Franța': false,
            'Germania, Regatul Unit, USSR': false
        }
    },
    {
        question: "Câte persoane au murit în al doilea război mondial?",
        answers: {
            'Între o sută și două sute de mii': false,
            'Între un milion și două milioane': false,
            'Între 80 și 100 de milioane': false,
            'Între 60 și 80 de milioane': true
        }
    },
    {
        question: "Care a fost conducătorul URSS în al doilea război mondial?",
        answers: {
            'Vladimir Lenin': false,
            'Iosif Stalin': true,
            'Vladimir Putin': false,
            'Adolf Hitler': false
        }
    },
    {
        question: "Care a fost conducătorul Germaniei în al doilea război mondial?",
        answers: {
            'Heinrich Himmler': false,
            'Adolf Hitler': true,
            'Winston Churchill': false,
            'Benito Mussolini': false
        }
    },
    {
        question: "Când a fost lansată de către SUA bomba atomică care a lovit orașul Nagasaki?",
        answers: {
            '11 Septembrie': false,
            '9 August': true,
            '4 August': false,
            '6 August': false
        }
    },
    {
        question: "Când a fost lansată de către SUA bomba atomică care a lovit orașul Hiroshima?",
        answers: {
            '9 August': false,
            '6 August': true,
            '11 Septembrie': false,
            '4 August': false
        }
    },
    {
        question: "Câți oameni au murit în Holocaust?",
        answers: {
            'O sută de mii': false,
            '1 milion': true,
            '8 milioane': false,
            '3 milioane': false
        }
    },
    {
        question: "Care dintre următoarele state au ieșit învingătoare?",
        answers: {
            'Italia, Franța, Rusia': false,
            'SUA, USSR, Marea Britanie': true,
            'Germania, Japonia, Italia': false,
            'SUA, Italia, Japonia': false
        }
    }
];

// IntersectionObserver
const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            entry.target.classList.toggle("opacity", entry.isIntersecting)
            if (entry.isIntersecting) observer.unobserve(entry.target);
        })
    },
    {
        threshold: 1
    }
)

h1.forEach(text => {
    observer.observe(text);
})
// functions
function shuffleObject(obj) { // ia un object ca si parametru
    const entries = Object.entries(obj); // metoda .entries, transforma un obiect intr un sir
    for (let i = entries.length - 1; i > 0; i--) { // methoda fisher-yates de a amesteca un array
      const j = Math.floor(Math.random() * (i + 1)); // ia un element diferit din sir
      [entries[i], entries[j]] = [entries[j], entries[i]]; // inverseaza doua elemente din sir, folosind array destructuring
    }
    return Object.fromEntries(entries) // transforma array ul inapoi in object
  }

function updateHistorySection() {
    historyContainer.innerHTML = '';
    for (let i = 0; i < previousResults.length; i++) {
        const previousResult = previousResults[i];
        const p = document.createElement('p');
        p.className = 'history-element'
        p.innerHTML = `${i+1}. <span class="history-result">${previousResult}</span> / 10`
        historyContainer.append(p);
    }
}

function handleChestionarUI () {
    backdrop.classList.toggle('display-block')
    chestionarUI.classList.toggle('display-block')
    backdrop.scrollIntoView()
    if (backdrop.classList.contains('display-block')) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = 'visible'
    }
}

function updateQuestion() {
    rndNum = Math.trunc(Math.random() * ( leftQuestions.length - 1))
    const randomizedAnswers = shuffleObject(leftQuestions[rndNum].answers)
    const questionAnswers = Object.keys(randomizedAnswers);
    questionAnswersValues = Object.values(randomizedAnswers);

    questionText.textContent = leftQuestions[rndNum].question
    for (let i = 0; i < questionAnswers.length; i++) {
        const answerText = questionAnswers[i];
        answers[i].textContent = answerText
    }

}

function disableSubmitButton () {
    submitButton.style.background = 'red';
    submitButton.style.color = 'black'
    submitButton.style.cursor = 'not-allowed'
    submitButton.disabled = true;
}

function activateSubmitButton () {
    submitButton.style.background = 'lightgreen'
    submitButton.style.color = 'black'
    submitButton.style.cursor = 'pointer'
    submitButton.disabled = false;
}

// event listeners
onload = () => {
    if(!localStorage.getItem('textWasReadValue')) {
        localStorage.setItem('textWasReadValue', textWasRead);
        localStorage.setItem('percentageValue', percentage);
    }


    if (JSON.parse(localStorage.getItem('textWasReadValue')) == true ) {
        textSection.classList.add('display-none');
        buttonsSection.classList.add('display-flex');
        quizArrow.style.background = 'hsl(100, 70%, 50%)'
    }

    percentage = localStorage.getItem('percentageValue');
    percentageText.textContent = percentage;
    percentageText.style.color = `hsl(${percentage}, 70%, 50%)`

    if(localStorage.getItem('previousResultsData')) {
        previousResults = JSON.parse(localStorage.getItem('previousResultsData'))
        updateHistorySection()
    }
};

quizArrow.addEventListener('click', handleChestionarUI)

backdrop.addEventListener('click', handleChestionarUI)

startQuizButton.addEventListener('click', () => {
    buttonsSection.classList.remove('display-flex')
    questionsSection.classList.add('display-flex')
    leftQuestions = questions.slice()
    disableSubmitButton()
    updateQuestion()
})

answersContainer.addEventListener('click', event => {
    if (!event.target.className == 'answer') return;
    const selected = event.target

    for(const answer of answers ) {
        if ( answer === selected) {
            answer.classList.add('selected')
            indexOfAnswer = Array.prototype.indexOf.call(answers, answer)

            valueOfAnswer = questionAnswersValues[indexOfAnswer];
        } else {
            answer.classList.remove('selected')
        }
    }

    for(const answer of answers) {
        if (answer.classList.contains('selected')) {
            activateSubmitButton()
            return;
        } else {
            disableSubmitButton()
        }
    }
})

submitButton.addEventListener('click', () => {
    if (valueOfAnswer) {
        result++;
    }


    updateQuestion();

    questionsCounter.textContent = parseInt(questionsCounter.textContent) + 1;

    leftQuestions.splice(rndNum, 1);

    disableSubmitButton()

    answers[indexOfAnswer].classList.remove('selected')

    if (submitButton.textContent == 'Termină chestionarul'){
        questionsSection.classList.remove('display-flex')
        resultText.textContent = result;
        previousResults.push(result);
        localStorage.setItem('previousResultsData', JSON.stringify(previousResults))
        resultSection.classList.add('display-grid')
        setTimeout(() => {
            resultSection.classList.remove('display-grid')
            buttonsSection.classList.add('display-flex')
            questionsCounter.textContent = '1';
            result = 0;
            submitButton.textContent = 'Răspunde'
            updateHistorySection()
        }, 3000);
        return;
    }

    if (  parseInt(questionsCounter.textContent) == 10 ){
        submitButton.textContent = 'Termină chestionarul'
    }
})

historyButton.addEventListener('click', () => {
    historySection.classList.add('display-block')
    buttonsSection.classList.remove('display-flex')
})

historyBackButton.addEventListener('click', () => {
    historySection.classList.remove('display-block')
    buttonsSection.classList.add('display-flex')
})

addEventListener('scroll', () => {
    const currentScrollValue = scrollY;
    if (scrollY > 64 && currentScrollValue > PREVIOUS_SCROLL_VALUE) {
        nav.classList.add('collapse')
        PREVIOUS_SCROLL_VALUE = currentScrollValue;
    } else {
        nav.classList.remove('collapse')
        PREVIOUS_SCROLL_VALUE = currentScrollValue;
    }

    const scrollableHeight = document.body.scrollHeight - window.innerHeight - footer.clientHeight;
    let localPercentage =  Math.trunc((scrollY / scrollableHeight) * 100)
    if (localPercentage > percentage && !textWasRead) {
        percentage = localPercentage;
        percentageText.textContent = percentage
        percentageText.style.color = `hsl(${percentage}, 70%, 50%)`
        localStorage.setItem('percentageValue', percentage);
        if (percentage >= 100) {
            textWasRead = true;
            quizArrow.style.background = 'hsl(100, 70%, 50%)'
            textSection.classList.add('display-none');
            buttonsSection.classList.add('display-flex');
            localStorage.setItem('textWasReadValue', textWasRead);
        }
    }

})

addEventListener('resize', () => {
    if(navContainer.classList.contains('display-flex') && innerWidth >= 1200 ) {
        document.body.style.overflow = 'visible'
        navContainer.classList.toggle('display-flex')
        burgerMenu.classList.toggle('collapse-burger')
    }
})

burgerMenu.addEventListener('click', () => {
    navContainer.classList.toggle('display-flex')
    if(navContainer.classList.contains('display-flex')) {
        document.body.style.overflow = 'hidden'
        burgerMenu.classList.toggle('collapse-burger')
    } else {
        document.body.style.overflow = 'visible'
        burgerMenu.classList.toggle('collapse-burger')
    }
})

navContainer.addEventListener('click', event => {
    if (event.target.tagName != 'A') return;

    navContainer.classList.toggle('display-flex')
    burgerMenu.classList.toggle('collapse-burger')
    document.body.style.overflow = 'visible'
    setTimeout(() => {
        nav.classList.add('collapse')
        PREVIOUS_SCROLL_VALUE = scrollY;
    }, 10)
})