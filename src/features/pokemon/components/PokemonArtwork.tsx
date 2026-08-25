"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

import { getFallbackSpriteUrl, getSpriteUrl } from "../sprites";

/** next/image's props are a union, so the omit has to distribute. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

/** `pokemonId`, not `id`, which would collide with the DOM attribute. */
export type PokemonArtworkProps = DistributiveOmit<ImageProps, "src"> & {
  pokemonId: number;
};

/** Client-side because a server component cannot know an image 404ed. */
export function PokemonArtwork({
  pokemonId,
  alt,
  onError,
  ...props
}: PokemonArtworkProps) {
  const [failed, setFailed] = useState(false);

  return (
    <Image
      {...props}
      alt={alt}
      src={failed ? getFallbackSpriteUrl(pokemonId) : getSpriteUrl(pokemonId)}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}
