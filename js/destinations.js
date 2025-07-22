const API_URL = 'https://retoolapi.dev/n5Qbwt/destinations';
const IMG_API_URL = 'https://api.imgbb.com/1/upload?key=0bdb040c0c4a5cefdbb42d77ffacaa70';

document.addEventListener('DOMContentLoaded', () => {
    loadDestinations();
});

async function loadDestinations(){
    const res = await fetch(API_URL);
    const destinations = await res.json();
    const container = document.querySelector('#card-container');
    const template = document.querySelector('#card-template');
    destinations.forEach(destination => {
        const card = template.content.cloneNode(true);
        card.querySelector('#card-price').textContent = `$${destination.price}`;
        card.querySelector('#card-image').src = destination.image;
        card.querySelector('#card-city').textContent = destination.city;
        card.querySelector('#card-destination').textContent = destination.destination;
        container.appendChild(card);
    });
}