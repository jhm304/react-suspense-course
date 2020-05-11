import React from "react";
import ErrorBoundary from "./error-boundary";
import { fetchPokemon, fetchPokemonCollection, suspensify } from "./api";

// dynamic import() introduces code-splitting into your app.
// dynamic import() creates a promise with 3 statuses: pending, error, success.
// React.lazy function lets you render a dynamic import as a regular component.
// The lazy component should be rendered inside a Suspense component, which allows 
// us to show some fallback content(i.e., loading indicator) while we're waiting for
// the lazy component to load 
const PokemonDetail = React.lazy(() => import("./pokemon-detail"));

let initialPokemon = suspensify(fetchPokemon(1));
let initialCollection = suspensify(fetchPokemonCollection());

function PokemonCollection() {
  return (
    <div>
      {initialCollection.read().results.map(pokemon => (
        <li key={pokemon.name}>{pokemon.name}</li>
      ))}
    </div>
  );
}

export default function App() {
  let [pokemon, setPokemon] = React.useState(initialPokemon);

  // holding onto a previous resource value while waiting for a new one
  let deferredPokemon = React.useDeferredValue(pokemon, {
    timeoutMs: 3000
  });

  // deferredPokemon = previous value
  // pokemon = pending or latest value
  // deferredPokemonIsStale = isPending
  let deferredPokemonIsStale = deferredPokemon !== pokemon;
  let [startTransition] = React.useTransition();

  return (
    <div>
      <h1>Pokedex</h1>

      <React.SuspenseList revealOrder="forwards" tail="collapsed">
        <React.Suspense fallback={<div>Fetching Pokemon...</div>}>
          <ErrorBoundary fallback={"Couldn't catch 'em all."}>
            <PokemonDetail
              resource={deferredPokemon}
              isStale={deferredPokemonIsStale}
            />

            <button
              type="button"
              disabled={deferredPokemonIsStale}
              onClick={() =>
                // Deferring state update by using startTransition from useTransition hook.
                // Without using startTransition, when we onClick, this fetch request gets
                // queued up and it has the potential to block user interaction.
                // If someone's typing on an input or clicks another things, 
                // those things could be delayed because of this longer fetch request
                // useTransition is saying we're OK with running this update slightly deprioritized
                startTransition(() =>
                  setPokemon(
                    suspensify(fetchPokemon(deferredPokemon.read().id + 1))
                  )
                )
              }
            >
              Next
            </button>
          </ErrorBoundary>
        </React.Suspense>

        <React.Suspense fallback={<div>Fetching the Database...</div>}>
          <ErrorBoundary fallback={"Couldn't catch 'em all."}>
            <PokemonCollection />
          </ErrorBoundary>
        </React.Suspense>
      </React.SuspenseList>
    </div>
  );
}
