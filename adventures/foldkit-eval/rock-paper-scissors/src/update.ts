import { Match as M } from 'effect'
import { Command } from 'foldkit'
import { evo } from 'foldkit/struct'

import { GenerateComputerMove } from './command'
import { Message } from './message'
import {
  AwaitingPlayer,
  Deciding,
  Draw,
  Lose,
  Model,
  Move,
  Outcome,
  Resolved,
  Win,
} from './model'

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

// Does move `a` beat move `b`? Rock crushes Scissors, Scissors cut Paper, Paper covers Rock.
const beats = (a: Move, b: Move): boolean =>
  M.value(a).pipe(
    M.tagsExhaustive({
      Rock: () => b._tag === 'Scissors',
      Paper: () => b._tag === 'Rock',
      Scissors: () => b._tag === 'Paper',
    }),
  )

const outcomeOf = (playerMove: Move, computerMove: Move): Outcome => {
  if (beats(playerMove, computerMove)) {
    return Win()
  }
  if (beats(computerMove, playerMove)) {
    return Lose()
  }
  return Draw()
}

const scoreForOutcome = (model: Model, outcome: Outcome): Model =>
  M.value(outcome).pipe(
    M.withReturnType<Model>(),
    M.tagsExhaustive({
      Win: () => evo(model, { playerScore: score => score + 1 }),
      Lose: () => evo(model, { computerScore: score => score + 1 }),
      Draw: () => model,
    }),
  )

export const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    M.withReturnType<UpdateReturn>(),
    M.tagsExhaustive({
      ClickedMove: ({ move }) => [
        evo(model, { round: () => Deciding({ playerMove: move }) }),
        [GenerateComputerMove()],
      ],

      GeneratedComputerMove: ({ move }) =>
        M.value(model.round).pipe(
          M.withReturnType<UpdateReturn>(),
          M.tagsExhaustive({
            AwaitingPlayer: () => [model, []],
            Resolved: () => [model, []],
            Deciding: ({ playerMove }) => {
              const outcome = outcomeOf(playerMove, move)
              const scored = scoreForOutcome(model, outcome)
              return [
                evo(scored, {
                  round: () =>
                    Resolved({ playerMove, computerMove: move, outcome }),
                }),
                [],
              ]
            },
          }),
        ),

      ClickedPlayAgain: () => [
        evo(model, { round: () => AwaitingPlayer() }),
        [],
      ],

      ClickedReset: () => [
        evo(model, {
          playerScore: () => 0,
          computerScore: () => 0,
          round: () => AwaitingPlayer(),
        }),
        [],
      ],
    }),
  )
