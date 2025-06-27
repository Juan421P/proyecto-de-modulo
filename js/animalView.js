const API_URL = 'https://retoolapi.dev/HgSQ1l/GestionAnimal';
const container = document.querySelector("#cards-container");
async function CargarAnimales(){
    try{
        const res = await fetch(API_URL);
        const data = await res.json();
        CargarTarjetas(data);
    }catch(error){
        console.error(`Error al cargar los datos: ${error}`);
        container.innerHTML = '<p>Error al cargar las animales :(</p>';
    }
}
function CargarTarjetas(animales){
    container.innerHTML = '';
    if(animales.length == 0){
        container.innerHTML = '<p>No hay animales registrados :(</p>';
        return;
    }
    animales.forEach(animal => {
        container.innerHTML += `
            <div class="card">
                <img src="${animal.imagen}" alt="Foto del animal">
            </div>
        `;
    });
}
window.addEventListener('DOMContentLoaded', CargarAnimales);