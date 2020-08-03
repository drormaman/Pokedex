const searchInput = document.querySelector("#search");
const searchBtn = document.querySelector("#searchButon");
const viewDiv = document.querySelector("#results");
const pokeImg = document.querySelector("#pokemonImg");
const pokeName = document.querySelector("#pokemonName");
const pokeHeight = document.querySelector("#heightSpan");
const pokeWeight = document.querySelector("#weightSpan");
const typesUl = document.querySelector("#typesUl");

const API_URL = 'https://pokeapi.co/api/v2';
axios.defaults.baseURL = API_URL;

function getPokemon(pokeIdentifier) {
    return axios.get(`/pokemon/${pokeIdentifier}`)
        .then(response => response.data)
        .catch((error) => { alert("Pokemon not found\n" + error.message); })
}

function addImageToDocument(pokemonData) {
    pokeImg.src = pokemonData.sprites.front_default;
    pokeImg.addEventListener('mouseenter', () => {
        pokeImg.src = pokemonData.sprites.back_default;
    })
    pokeImg.addEventListener('mouseleave', () => {
        pokeImg.src = pokemonData.sprites.front_default;
    })
}

function addNameToDocument(pokemonData) {
    pokeName.innerText = pokemonData.name;
}

function addHeightToDocument(pokemonData) {
    pokeHeight.innerText = `${pokemonData.height * 10}`;
}

function addWeightToDocument(pokemonData) {
    pokeWeight.innerText = `${pokemonData.weight * 0.1}`;
}

function addTypesListToDocument(pokemonData) {
    for (const type of pokemonData.types) {
        const typeLi = document.createElement('li');
        typeLi.innerText = type.type.name;
        typeLi.addEventListener('click', showRelatedTypePokemons)
        typesUl.appendChild(typeLi);
    }
    viewDiv.appendChild(typesUl);
}

async function showRelatedTypePokemons(event) {
    const parentLi = event.target;
    const relatedUl = document.createElement('ul');
    parentLi.appendChild(relatedUl);
    const relatedTypeList = await fetch(`${API_URL}/type/${parentLi.innerText}`)
        .then(response => response.json())
        .then((data) => data.pokemon)
        .catch((error) => { alert("Pokemon not found\n" + error.message); })
    for (const pokemon of relatedTypeList) {
        const pokemonLi = document.createElement('li');
        pokemonLi.innerText = pokemon.pokemon.name;
        pokemonLi.addEventListener('click', showPokemon)
        relatedUl.appendChild(pokemonLi);
    }
}

async function showPokemon(event) {
    event.stopPropagation();
    const identifier = (event.target.id === "searchButon") ? searchInput.value : event.target.innerText;
    const pokemonObj = await getPokemon(123);

    addImageToDocument(pokemonObj);
    addNameToDocument(pokemonObj);
    addHeightToDocument(pokemonObj);
    addWeightToDocument(pokemonObj);
    addTypesListToDocument(pokemonObj);
}


searchBtn.addEventListener('click', showPokemon)
window.addEventListener('load', showPokemon);