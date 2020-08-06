const searchInput = document.querySelector("#search");
const searchBtn = document.querySelector("#searchButton");
const viewDiv = document.querySelector("#results");
const pokeImg = document.querySelector("#pokemonImg");
const pokeName = document.querySelector("#pokemonName");
const pokeHeight = document.querySelector("#heightSpan");
const pokeWeight = document.querySelector("#weightSpan");
const typesUl = document.querySelector("#typesUl");
const typesDiv = document.querySelector("#typesDiv");
const relatedTypeList = document.querySelector("#relatedTypeList");



const API_URL = 'https://pokeapi.co/api/v2';
axios.defaults.baseURL = API_URL;




function addImageToDocument(pokemonData) {
    pokeImg.src = pokemonData.sprites.front_default;
    let showingFrontImg = true;
    pokeImg.addEventListener('mouseenter', () => {
        if (showingFrontImg) {
            pokeImg.src = pokemonData.sprites.back_default || pokemonData.sprites.front_default;
            showingFrontImg = false;
        }
    });
    pokeImg.addEventListener('mouseleave', () => {
        if (!showingFrontImg) {
            pokeImg.src = pokemonData.sprites.front_default;
            showingFrontImg = true;
        }
    });
}

function addPropertiesToDocument(pokemonData) {
    pokeName.innerText = pokemonData.name;
    pokeHeight.innerText = `${pokemonData.height * 10}`;
    pokeWeight.innerText = `${Math.round(pokemonData.weight * 0.1)}`;
}

function addTypesListToDocument(pokemonData) {
    typesUl.innerHTML = "";
    for (const type of pokemonData.types) {
        const typeLi = document.createElement('li');
        const typeName = type.type.name;
        typeLi.innerText = typeName;
        typeLi.addEventListener('click', showRelatedTypePokemons);
        typesUl.appendChild(typeLi);
    }
    viewDiv.appendChild(typesUl);
}

async function showRelatedTypePokemons(event) {
    try {
        const typeLi = event.target;
        typeLi.removeEventListener('click', showRelatedTypePokemons)
        typeLi.addEventListener("click", () => {
            typesDiv.style.right = "0";
            typeLi.addEventListener('click', showRelatedTypePokemons);
        });
        const responseData = await getListOfSameType(typeLi.innerText);
        const relatedTypePokemon = responseData.pokemon;
        typesDiv.style.right = "-150px";
        relatedTypeList.innerText = "";
        for (const pokemon of relatedTypePokemon) {
            const pokemonLi = document.createElement('li');
            pokemonLi.classList.add("relatedPokemon");
            pokemonLi.innerText = pokemon.pokemon.name;
            pokemonLi.addEventListener('click', (event) => {
                typesDiv.style.right = "0";
                showPokemon(event);
            });
            relatedTypeList.appendChild(pokemonLi);
        }
    } catch (error) {
        alert("Related pokemons weren't found\n" + error.message);
    }
}

// function getPokemon(pokeIdentifier) {
//     return axios.get(`/pokemon/${pokeIdentifier.toLowerCase()}`)
//         .then(response => response.data)
//         .catch(error => error)
// }

function getListOfSameType(type) {
    return responseData = axios.get(`/type/${type.toLowerCase()}`)
        .then(r => r.data)
        .catch(error => error)

}

async function showPokemon(event) {
    try {
        event.stopPropagation();
        // console.log(event.target);
        const identifier = (event.target.id === "searchButton") ? searchInput.value : event.target.innerText;
        const pokemonData = await fetch(`${API_URL}/pokemon/${identifier.toLowerCase()}`)
            .then(res => res.json())
            .catch(error => error)
            // const response = await fetch(`${API_URL}/pokemon/${identifier.toLowerCase()}`);
        addImageToDocument(pokemonData);
        addPropertiesToDocument(pokemonData);
        addTypesListToDocument(pokemonData);
        searchInput.value = "";
    } catch (error) {
        alert("Pokemon not found helllllooo\n" + error.message);
    }

}



searchBtn.addEventListener('click', showPokemon)
    // window.addEventListener('load', showPokemon)