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

let PREVIOUS_SCROLL_VALUE = 0;
let percentage = 0;
let textWasRead = false;

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

// event listeners
onload = () => {
    if(!localStorage.getItem('textWasReadValue')) {
        localStorage.setItem('textWasReadValue', textWasRead);
        localStorage.setItem('percentageValue', percentage);
    }


    if (JSON.parse(localStorage.getItem('textWasReadValue')) == true ) {
        console.log('succes')
        textSection.classList.add('display-none');
        buttonsSection.classList.add('display-flex');
        quizArrow.style.background = 'hsl(100, 70%, 50%)'
    }

    percentage = localStorage.getItem('percentageValue');
    percentageText.textContent = percentage;
    percentageText.style.color = `hsl(${percentage}, 70%, 50%)`
};

quizArrow.addEventListener('click', handleChestionarUI)

backdrop.addEventListener('click', handleChestionarUI)

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