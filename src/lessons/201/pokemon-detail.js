import React from "react";
import { DelaySpinner } from "./ui";

export default function PokemonDetail({ resource, isStale }) {
  // we need to give our component a function to call when the promise is resolved 
  // and we want to read this information
  // By convention, this function is called read and that's what we defined in suspensify function in api.js
  let pokemon = resource.read();

  return (
    <div>
      <div style={isStale ? { opacity: 0.5 } : null}>
        {pokemon.name}
        {isStale && <DelaySpinner />}
      </div>
    </div>
  );
}
