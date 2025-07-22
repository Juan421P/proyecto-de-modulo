const nav = document.querySelector('#nav');
const footer = document.querySelector('#footer');
const burger = document.querySelector('#burger');
const breakpoint = window.matchMedia('(min-width: 768px)');
const logo = document.querySelector('#logo');
const main = document.querySelector('#main');

let isMobile = !breakpoint.matches;

function initNav() {
    if (isMobile) {
        nav.classList.add('opacity-0', '-translate-y-full', 'pointer-events-none');
    } else {
        nav.classList.remove('opacity-0', '-translate-y-full', 'pointer-events-none');
        toggleNav();
    }
}

breakpoint.addEventListener('change', (e) => {
    isMobile = !e.matches;
    initNav();
});

if (burger) {
    burger.addEventListener('click', () => {
        navExpand();
    });
}

if (logo) {
    logo.addEventListener('click', () => {
        if (!isMobile) hideNav();
    });
}

window.addEventListener('scroll', () => {
    positionCheck();
});

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    positionCheck();
});

function positionCheck() {
    if (!footer) return;
    const scrollTop = window.scrollY;
    const scrollBottom = window.innerHeight + scrollTop >= document.body.scrollHeight - footer.offsetHeight;
    if (scrollBottom) {
        footer.classList.remove('translate-y-full');
    } else {
        footer.classList.add('translate-y-full');
    }
    if (!isMobile) {
        toggleNav(scrollTop);
    }
}

function navExpand() {
    if (!isMobile || !nav) return;
    nav.classList.toggle('opacity-0');
    nav.classList.toggle('-translate-y-full');
    nav.classList.toggle('pointer-events-none');
    const navVisible = !nav.classList.contains('opacity-0');
    main.style.paddingTop = navVisible ? `${nav.offsetHeight}px` : '0';
}

function toggleNav(scrollTop = window.scrollY) {
    if (!nav || !main || !footer) return;
    if (scrollTop === 0) {
        nav.classList.remove('-translate-y-full');
    } else {
        nav.classList.add('-translate-y-full');
    }
    const navVisible = !nav.classList.contains('-translate-y-full');
    const footerVisible = !footer.classList.contains('translate-y-full');
    main.style.paddingTop = navVisible ? `${nav.offsetHeight}px` : '0';
    main.style.paddingBottom = footerVisible ? `${footer.offsetHeight}px` : '0';
}

function hideNav() {
    if (!nav || isMobile) return;
    nav.classList.add('opacity-0', '-translate-y-full', 'pointer-events-none');
    main.style.paddingTop = '0';
}