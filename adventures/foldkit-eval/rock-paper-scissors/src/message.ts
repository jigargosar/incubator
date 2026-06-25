import { Schema as S } from 'effect'
import { m } from 'foldkit/message'

import { Move } from './model'

export const ClickedMove = m('ClickedMove', { move: Move })
export const GeneratedComputerMove = m('GeneratedComputerMove', { move: Move })
export const ClickedPlayAgain = m('ClickedPlayAgain')
export const ClickedReset = m('ClickedReset')

export const Message = S.Union([
  ClickedMove,
  GeneratedComputerMove,
  ClickedPlayAgain,
  ClickedReset,
])
export type Message = typeof Message.Type
