import { Match as M } from 'effect'
import { Document, Html, html } from 'foldkit/html'

import {
  ClickedMove,
  ClickedPlayAgain,
  ClickedReset,
  Message,
} from './message'
import { Model, Move, Outcome, Paper, Rock, RoundState, Scissors } from './model'

const moveEmoji = (move: Move): string =>
  M.value(move).pipe(
    M.tagsExhaustive({
      Rock: () => '✊',
      Paper: () => '✋',
      Scissors: () => '✌️',
    }),
  )

const outcomeBanner = (
  outcome: Outcome,
): { readonly text: string; readonly className: string } =>
  M.value(outcome).pipe(
    M.tagsExhaustive({
      Win: () => ({ text: 'You win', className: 'text-emerald-400' }),
      Lose: () => ({ text: 'You lose', className: 'text-rose-400' }),
      Draw: () => ({ text: 'Draw', className: 'text-amber-300' }),
    }),
  )

const cardClass =
  'flex flex-col items-center gap-1 rounded-2xl border border-white/10 ' +
  'bg-white/5 px-8 py-5 backdrop-blur'

const scoreboard = (model: Model): Html => {
  const h = html<Message>()

  const column = (label: string, score: number, accent: string): Html =>
    h.div(
      [h.Class('flex flex-col items-center gap-1')],
      [
        h.span(
          [h.Class('text-xs uppercase tracking-widest text-white/50')],
          [label],
        ),
        h.span(
          [h.Class(`text-4xl font-semibold tabular-nums ${accent}`)],
          [`${score}`],
        ),
      ],
    )

  return h.div(
    [h.Class(`${cardClass} flex-row gap-10`)],
    [
      column('You', model.playerScore, 'text-emerald-300'),
      h.span([h.Class('text-2xl text-white/30')], ['vs']),
      column('CPU', model.computerScore, 'text-rose-300'),
    ],
  )
}

const handEmoji = (move: Move, accent: string): Html => {
  const h = html<Message>()
  return h.span(
    [h.Class(`text-6xl ${accent}`), h.AriaHidden(true)],
    [moveEmoji(move)],
  )
}

const resultPanel = (round: RoundState): Html => {
  const h = html<Message>()

  return M.value(round).pipe(
    M.withReturnType<Html>(),
    M.tagsExhaustive({
      AwaitingPlayer: () =>
        h.p(
          [h.Class('text-lg text-white/60')],
          ['Pick a move to start the round'],
        ),

      Deciding: () =>
        h.p([h.Class('text-lg text-white/60 animate-pulse')], ['Rolling…']),

      Resolved: ({ playerMove, computerMove, outcome }) => {
        const banner = outcomeBanner(outcome)
        return h.div(
          [h.Class('flex flex-col items-center gap-4')],
          [
            h.div(
              [h.Class('flex items-center gap-8')],
              [
                handEmoji(playerMove, 'text-emerald-300'),
                h.span([h.Class('text-xl text-white/30')], ['vs']),
                handEmoji(computerMove, 'text-rose-300'),
              ],
            ),
            h.p(
              [
                h.Class(
                  `text-2xl font-semibold uppercase tracking-wide ${banner.className}`,
                ),
              ],
              [banner.text],
            ),
            h.button(
              [
                h.OnClick(ClickedPlayAgain()),
                h.Class(
                  'rounded-lg border border-white/15 px-5 py-2 text-sm ' +
                    'font-medium uppercase tracking-wide text-white/80 ' +
                    'hover:border-white/30 hover:bg-white/10 transition-colors',
                ),
              ],
              ['Play again'],
            ),
          ],
        )
      },
    }),
  )
}

const moveButton = (move: Move): Html => {
  const h = html<Message>()
  return h.button(
    [
      h.OnClick(ClickedMove({ move })),
      h.AriaLabel(move._tag),
      h.Class(
        'flex h-28 w-28 flex-col items-center justify-center gap-1 ' +
          'rounded-2xl border border-white/10 bg-white/5 ' +
          'hover:border-emerald-300/50 hover:bg-white/10 ' +
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ' +
          'transition-colors active:scale-95',
      ),
    ],
    [
      h.span([h.Class('text-4xl'), h.AriaHidden(true)], [moveEmoji(move)]),
      h.span(
        [h.Class('text-xs uppercase tracking-widest text-white/60')],
        [move._tag],
      ),
    ],
  )
}

export const view = (model: Model): Document => {
  const h = html<Message>()

  return {
    title: `Rock Paper Scissors · ${model.playerScore}–${model.computerScore}`,
    body: h.div(
      [
        h.Class(
          'flex min-h-screen flex-col items-center justify-center gap-8 p-8 ' +
            'bg-[radial-gradient(ellipse_at_top,_#0d1b2a_0%,_#04080f_60%,_#000_100%)] ' +
            'text-white font-sans select-none',
        ),
      ],
      [
        h.h1(
          [
            h.Class(
              'text-3xl font-light uppercase tracking-[0.3em] text-white/90',
            ),
          ],
          ['Rock · Paper · Scissors'],
        ),
        scoreboard(model),
        h.div(
          [h.Class(`${cardClass} min-h-44 w-full max-w-md justify-center`)],
          [resultPanel(model.round)],
        ),
        h.div(
          [h.Class('flex gap-5')],
          [moveButton(Rock()), moveButton(Paper()), moveButton(Scissors())],
        ),
        h.button(
          [
            h.OnClick(ClickedReset()),
            h.Class(
              'text-xs uppercase tracking-widest text-white/40 ' +
                'hover:text-white/70 transition-colors',
            ),
          ],
          ['Reset scores'],
        ),
      ],
    ),
  }
}
