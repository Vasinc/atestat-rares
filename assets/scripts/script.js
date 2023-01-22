// variables
const nav = document.querySelector('nav');
const navContainer = document.getElementById('nav-container')
const burgerMenu = document.querySelector('.burger-menu');

let PREVIOUS_SCROLL_VALUE = 0;

// functions


// event listeners
addEventListener('scroll', () => {
    const currentScrollValue = scrollY;
    if (scrollY > 64 && currentScrollValue > PREVIOUS_SCROLL_VALUE) {
        nav.classList.add('collapse')
        PREVIOUS_SCROLL_VALUE = currentScrollValue;
    } else {
        nav.classList.remove('collapse')
        PREVIOUS_SCROLL_VALUE = currentScrollValue;
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