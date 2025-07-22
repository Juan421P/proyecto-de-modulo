const API_URL = 'https://retoolapi.dev/n5Qbwt/destinations';
const IMG_API_URL = 'https://api.imgbb.com/1/upload?key=0bdb040c0c4a5cefdbb42d77ffacaa70';

const allowedKeys = [
    'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End', 'Enter'
];

const validationPatterns = {
    username: /^[A-Za-z0-9]$/,
    simpleText: /^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9\s]$/,
    normalText: /^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9.,\s]$/,
    password: /^[A-Za-z0-9#!@&]$/,
    number: /^\d$/,
    decimal: /^\d*\.?\d{0,3}$/,
    email: /^[A-Za-z0-9._%+-@]$/
}

function checkInput(element, kind = 'username') {
    if (!element) return;
    element.addEventListener('keydown', e => {
        if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;
        if (!validationPatterns[kind].test(e.key)) e.preventDefault();
    });
}

const form = document.querySelector('#destination-form');
const city = document.querySelector('#city-input');
checkInput(city, 'simpleText');
const country = document.querySelector('#country-input');
checkInput(country, 'simpleText');
const price = document.querySelector('#price-input');
checkInput(price, 'decimal');
const rating = document.querySelector('#rating-input');
checkInput(rating, 'decimal');
const reviews = document.querySelector('#reviews-input');
checkInput(reviews, 'number');
const destination = document.querySelector('#destination-input');
checkInput(destination, 'simpleText');
const category = document.querySelector('#category-input');
const image = document.querySelector('#image-input');
const description = document.querySelector('#description-input');
checkInput(description, 'normalText');
const id = document.querySelector('#id-input');
const submit = document.querySelector('#submit');
const submitSpan = document.querySelector('#submit span');
const clear = form.querySelector('#clear-form');
let existingImageURL = '';

document.addEventListener('DOMContentLoaded', () => {
    inputSetup();
    initializeSelect();
    populateTable();
    checkFormState();
    form.addEventListener('submit', async e => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        let imageURL = id.value ? existingImageURL : '';
        if (image.files.length > 0) imageURL = await uploadImage(image.files[0]);
        const payload = {
            city: city.value,
            image: imageURL,
            price: price.value,
            rating: rating.value,
            country: country.value,
            reviews: reviews.value,
            category: category.value,
            description: description.value,
            destination: destination.value,
        }

        if (id.value) {
            await fetch(`${API_URL}/${id.value}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            alert('Registro actualizado :)');
        } else {
            await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            alert('Registro agregado :)');
        }
        form.reset();
        submitSpan.textContent = 'Agregar destino'
        id.value = '';
        existingImageURL = '';
        resetCategoryDropdown();
        populateTable();
    });
});

function validateForm() {
    if (!destination.value || !city.value || !country.value || !category.value ||
        !price.value || !rating.value || !reviews.value || !description.value) {
        alert('Por favor complete todos los campos requeridos');
        return false;
    }

    const priceValue = parseFloat(price.value);
    if (isNaN(priceValue)) {
        alert('El precio debe ser un número válido');
        return false;
    }
    if (priceValue <= 0) {
        alert('El precio debe ser mayor que 0');
        return false;
    }

    const ratingValue = parseFloat(rating.value);
    if (isNaN(ratingValue)) {
        alert('La calificación debe ser un número válido');
        return false;
    }
    if (ratingValue < 0.1 || ratingValue > 5) {
        alert('La calificación debe estar entre 0.1 y 5');
        return false;
    }

    const reviewsValue = parseInt(reviews.value);
    if (isNaN(reviewsValue)) {
        alert('El número de reseñas debe ser un número válido');
        return false;
    }
    if (reviewsValue <= 0) {
        alert('El número de reseñas debe ser mayor que 0');
        return false;
    }

    if (!id.value && image.files.length === 0) {
        alert('Por favor seleccione una imagen para el destino');
        return false;
    }

    return true;
}

function inputSetup() {
    const inputs = form.querySelectorAll('input, textarea');
    console.log(
        '[destinations-admin.js] Found inputs:', inputs.length
    );
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            console.log(
                '[destinations-admin.js] Input event on:', input.id,
                'value', input.value
            );
            checkFormState();
        });
        input.addEventListener('change', () => {
            console.log(
                '[destinations-admin.js] Change event on:', input.id,
                'value', input.value
            );
            checkFormState();
        });
        input.addEventListener('copy', e => {
            e.preventDefault();
        });
        input.addEventListener('cut', e => {
            e.preventDefault();
        });
        input.addEventListener('paste', e => {
            e.preventDefault();
        });
    });
    clear.addEventListener('click', e => {
        e.preventDefault();
        form.reset();
        resetCategoryDropdown();
        submitSpan.textContent = 'Agregar destino';
        id.value = '';
        existingImageURL = '';
        checkFormState();
    });
}

function resetCategoryDropdown() {
    const dropdownText = document.querySelector('#category-dropdown-text');
    const chevron = document.querySelector('#category-dropdown-chevron');
    const input = document.querySelector('#category-input');
    const menu = document.querySelector('#category-dropdown-menu');
    input.value = '';
    dropdownText.textContent = 'Categoría';
    dropdownText.classList.add('italic', 'text-neutral-400');
    menu.classList.add('hidden');
    chevron.classList.remove('rotate-180');
}

async function populateTable() {
    const res = await fetch(API_URL);
    const destinations = await res.json();
    const tbody = document.querySelector('#tbody');
    const template = document.querySelector('#tr-template');
    tbody.innerHTML = '';
    destinations.forEach(destination => {
        const tr = template.content.cloneNode(true);
        tr.querySelector('#td-image img').src = destination.image;
        tr.querySelector('#td-destination').textContent = destination.destination;
        tr.querySelector('#td-city').textContent = destination.city;
        tr.querySelector('#td-country').textContent = destination.country;
        tr.querySelector('#td-category').textContent = destination.category === 'beach' ? 'Playa' : destination.category === 'mountain' ? 'Montaña' : destination.category === 'city' ? 'Ciudad' : 'N/A';
        tr.querySelector('#td-price').textContent = `$${parseFloat(destination.price).toFixed(2)}`;
        const rating = Math.round(destination.rating);
        tr.querySelector('#td-rating').innerHTML = '<span class="text-yellow-500 text-outline-black">★</span>'.repeat(rating) + '<span class="text-neutral-500">★</span>'.repeat(5 - rating);
        tr.querySelector('#td-reviews').textContent = destination.reviews;
        tr.querySelector('#td-description').textContent = destination.description;
        const edit = tr.querySelector('button:first-child');
        const elim = tr.querySelector('button:last-child');
        edit.addEventListener('click', () => {
            loadToEdit(destination.id);
        });
        elim.addEventListener('click', () => {
            erradicate(destination.id);
        });
        tbody.appendChild(tr);
    });
}

async function loadToEdit(editID) {
    const res = await fetch(`${API_URL}/${editID}`);
    const dest = await res.json();
    console.log(dest);
    city.value = dest.city;
    existingImageURL = dest.image;
    price.value = dest.price;
    rating.value = dest.rating;
    country.value = dest.country;
    reviews.value = dest.reviews;
    category.value = dest.category;
    const dropdownText = document.querySelector('#category-dropdown-text');
    dropdownText.textContent = dest.category === 'beach' ? 'Playa' : dest.category === 'mountain' ? 'Montaña' : dest.category === 'city' ? 'Ciudad' : 'Categoría';
    dropdownText.classList.remove('italic', 'text-neutral-400');
    description.value = dest.description;
    destination.value = dest.destination;
    id.value = dest.id;
    submitSpan.textContent = 'Actualizar destino'
    checkFormState();
}

async function erradicate(id) {
    const confirmation = confirm('¿Seguro que desea eliminar este destino 🤔?');
    if (confirmation) {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        populateTable();
        alert('El registro fue eliminado 🫡');
    } else {
        alert('Ok. Cobarde 🥺');
        return;
    }
}

function initializeSelect() {
    const btn = document.querySelector('#category-dropdown-btn');
    const menu = document.querySelector('#category-dropdown-menu');
    const dropdownText = document.querySelector('#category-dropdown-text');
    const chevron = document.querySelector('#category-dropdown-chevron');
    const input = document.querySelector('#category-input');
    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        chevron.classList.toggle('rotate-180');
    });
    menu.querySelectorAll('li').forEach(option => {
        option.addEventListener('click', () => {
            const value = option.dataset.value;
            const text = option.textContent;
            console.log(
                '[destinations-admin.js] Clicked option:', value
            );
            input.value = value;
            console.log(
                '[destinations-admin.js] Current hidden input content:', input.id,
                '=', input.value
            );
            checkFormState();
            dropdownText.textContent = text;
            dropdownText.classList.remove('italic', 'text-neutral-400');
            menu.classList.add('hidden');
            chevron.classList.remove('rotate-180');
        });
    });
    document.addEventListener('click', e => {
        if (!btn.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.add('hidden');
            chevron.classList.remove('rotate-180');
        }
    });
}

async function uploadImage(file) {
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(IMG_API_URL, {
        method: 'POST',
        body: fd
    });
    const obj = await res.json();
    return obj.data.url;
}

function checkFormState() {
    const inputs = form.querySelectorAll('input, textarea');
    let hasInput = false;
    inputs.forEach(input => {
        if (input.type === 'file') {
            if (input.files.length > 0) hasInput = true;
        } else if (input.value && input.value !== input.defaultValue) {
            hasInput = true;
        }
    });
    if (hasInput) {
        clear.classList.remove('hidden');
        requestAnimationFrame(() => {
            clear.classList.remove('opacity-0', 'scale-90');
            clear.classList.add('opacity-100', 'scale-100');
        });
    } else {
        clear.classList.remove('opacity-100', 'scale-100');
        clear.classList.add('opacity-0', 'scale-90');

        setTimeout(() => {
            clear.classList.add('hidden');
        }, 300);
    }
}