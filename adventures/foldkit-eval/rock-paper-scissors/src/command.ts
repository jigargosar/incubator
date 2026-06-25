import { Array, Effect, Option, Random, pipe } from 'effect'
import { Command } from 'foldkit'

import { GeneratedComputerMove } from './message'
import { Move, Paper, Rock, Scissors } from './model'

const moves: ReadonlyArray<Move> = [Rock(), Paper(), Scissors()]

export const GenerateComputerMove = Command.define(
  'GenerateComputerMove',
  GeneratedComputerMove,
)(
  Effect.gen(function* () {
    const index = yield* Random.nextIntBetween(0, moves.length - 1)
    const move = pipe(
      moves,
      Array.get(index),
      Option.getOrElse(() => Rock()),
    )
    return GeneratedComputerMove({ move })
  }),
)
