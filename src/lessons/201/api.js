// sleep allows us to delay fetch promises from resolving
import sleep from "sleep-promise";

export function fetchPokemon(id) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(sleep(1000));
}

export function fetchPokemonCollection() {
  return fetch(`https://pokeapi.co/api/v2/pokemon`)
    .then(res => res.json())
    .then(sleep(2000));
}

// suspensify is our own promises wrappers to communicate 
// pending, error, and success statuses to Suspense and error boundaries components
export function suspensify(promise) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    response => {
      status = "success";
      result = response;
    },
    error => {
      status = "error";
      result = error;
    }
  );

  return {
    read() {
      if (status === "pending") {
        throw suspender;
      }
      if (status === "error") {
        throw result;
      }
      if (status === "success") {
        return result;
      }
    }
  };
}
