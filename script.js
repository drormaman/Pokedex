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




function addImageToDocument(pokemonData) {
    pokeImg.src = pokemonData.sprites.front_default;
    pokeImg.addEventListener('mouseenter', () => {
        pokeImg.src = pokemonData.sprites.back_default || pokemonData.sprites.front_default;
    });
    pokeImg.addEventListener('mouseleave', () => {
        pokeImg.src = pokemonData.sprites.front_default;
    });
}

function addPropertiesToDocument(pokemonData) {
    pokeName.innerText = pokemonData.name;
    pokeHeight.innerText = `${pokemonData.height * 10}`;
    pokeWeight.innerText = `${pokemonData.weight * 0.1}`;

}

function addTypesListToDocument(pokemonData) {
    typesUl.innerHTML = "";
    for (const type of pokemonData.types) {
        const typeLi = document.createElement('li');
        const typeName = type.type.name;
        typeLi.innerText = typeName;
        typeLi.addEventListener('click', showRelatedTypePokemons)
        typesUl.appendChild(typeLi);
    }
    viewDiv.appendChild(typesUl);
}

async function showRelatedTypePokemons(event) {
    const parentLi = event.target;
    const relatedUl = document.createElement('ul');
    parentLi.appendChild(relatedUl);
    const obj = await getListOfSameType(parentLi.innerText)

    console.log(obj.pokemon)
    const relatedTypeList = await fetch(`${API_URL}/type/${parentLi.innerText.toLowerCase()}`)
        .then(response => response.json())
        .then((data) => data.pokemon)
        .catch((error) => { alert("Pokemon not found\n" + error.message); })
    for (const pokemon of relatedTypeList) {
        const pokemonLi = document.createElement('li');
        pokemonLi.innerText = pokemon.pokemon.name;
        pokemonLi.addEventListener('click', showPokemon);
        relatedUl.appendChild(pokemonLi);
    }
}

// function getPokemon(pokeIdentifier) {
//     return axios.get(`/pokemon/${pokeIdentifier.toLowerCase()}`)
//         .then(response => response.data)
//         .catch(error => error)
// }

function getListOfSameType(type) {
    return responseData = axios.get(`/type/${type.toLowerCase()}`).then(r => r.data);

}

async function showPokemon(event) {
    try {
        event.stopPropagation();
        const identifier = (event.target.id === "searchButon") ? searchInput.value : event.target.innerText;
        const response = await fetch(`${API_URL}/pokemon/${identifier.toLowerCase()}`);
        const pokemonData = await response.json()
        addImageToDocument(pokemonData);
        addPropertiesToDocument(pokemonData);
        addTypesListToDocument(pokemonData);
    } catch (error) {
        alert("Pokemon not found helllllooo\n" + error.message);
    }

}



searchBtn.addEventListener('click', showPokemon)