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
const evolutionDiv = document.querySelector("#evolutionDiv");

const API_URL = "https://pokeapi.co/api/v2";
axios.defaults.baseURL = API_URL;

async function getEvolvesTo(pokemonData) {
    const speciesUrl = pokemonData.species.url;
    const speciesRes = await fetch(speciesUrl).then((res) => res.json());
    const evolutionChainUrl = speciesRes["evolution_chain"].url;
    const evolutionRes = await fetch(evolutionChainUrl).then((res) =>
        res.json()
    );
    let evolution = evolutionRes.chain;
    let isFinal = false;
    const evolutionArr = [];
    while (!isFinal) {
        if (evolution["evolves_to"].length === 0) {
            isFinal = true;
        }
        evolutionArr.push(evolution.species.name);
        evolution = evolution["evolves_to"][0];
    }
    return evolutionArr;
}

async function createEvolutionButtons(pokemonData) {
	evolutionDiv.innerHTML = "";
    const evolutionArr = await getEvolvesTo(pokemonData);
    console.log(evolutionArr.indexOf(pokemonData.name));
    const pokemonIndex = evolutionArr.indexOf(pokemonData.name);
    if (pokemonIndex > 0) {
		const prevButton = document.createElement("button");
		prevButton.id = "prevButton";
		prevButton.innerText = `${evolutionArr[pokemonIndex - 1]}`;
		prevButton.addEventListener('click', () => {showPokemon(prevButton.innerText);});
        evolutionDiv.appendChild(prevButton);
	}
	if (pokemonIndex < evolutionArr.length - 1) {
		const nextButton = document.createElement("button");
		nextButton.id = "nextButton";
		nextButton.innerText = `${evolutionArr[pokemonIndex + 1]}`;
		nextButton.addEventListener('click', () => {showPokemon(nextButton.innerText);});
        evolutionDiv.appendChild(nextButton);
    }
}

function addImageToDocument(pokemonData) {
    pokeImg.src = pokemonData.sprites.front_default;
    let showingFrontImg = true;
    pokeImg.addEventListener("mouseenter", () => {
        if (showingFrontImg) {
            pokeImg.src =
                pokemonData.sprites.back_default ||
                pokemonData.sprites.front_default;
            showingFrontImg = false;
        }
    });
    pokeImg.addEventListener("mouseleave", () => {
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
        const typeLi = document.createElement("li");
        const typeName = type.type.name;
        typeLi.innerText = typeName;
        typeLi.addEventListener("click", showRelatedTypePokemons);
        typesUl.appendChild(typeLi);
    }
}

async function showRelatedTypePokemons(event) {
    try {
        const typeLi = event.target;
        typeLi.removeEventListener("click", showRelatedTypePokemons);
        typeLi.addEventListener("click", () => {
            typesDiv.style.right = "0";
            typeLi.addEventListener("click", showRelatedTypePokemons);
        });
        const responseData = await getListOfSameType(typeLi.innerText);
        const relatedTypePokemon = responseData.pokemon;
        typesDiv.style.right = "-150px";
        relatedTypeList.innerText = "";
        for (const pokemon of relatedTypePokemon) {
            const pokemonLi = document.createElement("li");
            pokemonLi.classList.add("relatedPokemon");
            pokemonLi.innerText = pokemon.pokemon.name;
            pokemonLi.addEventListener("click", () => {
                typesDiv.style.right = "0";
                showPokemon(pokemonLi.innerText);
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
    return (responseData = axios
        .get(`/type/${type.toLowerCase()}`)
        .then((r) => r.data)
        .catch((error) => error));
}

async function showPokemon(name) {
    try {
        const pokemonData = await fetch(`${API_URL}/pokemon/${name.toLowerCase()}`)
            .then((res) => res.json())
            .catch((error) => error);
        addImageToDocument(pokemonData);
        addPropertiesToDocument(pokemonData);
        addTypesListToDocument(pokemonData);
        createEvolutionButtons(pokemonData);
        searchInput.value = "";
    } catch (error) {
        alert("Pokemon not found\n" + error.message);
    }
}

searchBtn.addEventListener("click",() =>{ showPokemon(searchInput.value)});
// window.addEventListener('load', showPokemon)
