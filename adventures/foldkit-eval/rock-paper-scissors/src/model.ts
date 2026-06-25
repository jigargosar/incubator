import { Schema as S } from 'effect'
import { ts } from 'foldkit/schema'

// MOVE

export const Rock = ts('Rock')
export const Paper = ts('Paper')
export const Scissors = ts('Scissors')

export const Move = S.Union([Rock, Paper, Scissors])
export type Move = typeof Move.Type

// OUTCOME (from the player's perspective)

export const Win = ts('Win')
export const Lose = ts('Lose')
export const Draw = ts('Draw')

export const Outcome = S.Union([Win, Lose, Draw])
export type Outcome = typeof Outcome.Type

// ROUND STATE

export const AwaitingPlayer = ts('AwaitingPlayer')
export const Deciding = ts('Deciding', { playerMove: Move })
export const Resolved = ts('Resolved', {
  playerMove: Move,
  computerMove: Move,
  outcome: Outcome,
})

export const RoundState = S.Union([AwaitingPlayer, Deciding, Resolved])
export type RoundState = typeof RoundState.Type

// MODEL

export const Model = S.Struct({
  playerScore: S.Number,
  computerScore: S.Number,
  round: RoundState,
})
export type Model = typeof Model.Type
