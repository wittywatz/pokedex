import { pokemonRoutes } from "@/features/pokemon/routes";

export const routes = {
  home: () => "/",
  pokemon: pokemonRoutes,
};
