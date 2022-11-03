//Objeto para representar toda a pokeapi
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    //fetch retorna uma promise
    return fetch(url)
        .then((response) => response.json())
        //jsonBody é o resultado do then anterior, e assim por diante
        .then((jsonBody) => jsonBody.results) 
        //pokeApi.getPokemonDetail - mesma coisa de:
        //  pokemons.map((pokemon) => pokeApi.getPokemonDetail(pokemon))
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        //Promise.all(detailRequests) - semelhante a:
        //  Promise.all([
        //     fetch(...),
        //     fetch(...),
        //     fetch(...)
        //  ])
        .then((detailRequests) => Promise.all(detailRequests))
        //(pokemonsDetails) => pokemonsDetails - Apesar de o retorno ser o mesmo do citado acima
        // por ser uma promise, o then abaixo pode ser considerado para tratar, assim só tera
        // o retorno quando a requisição anterior terminar
        .then((pokemonsDetails) => pokemonsDetails)
        .catch((error) => console.error(error))
}
