import { Runtime } from 'foldkit'

import { Message } from './message'
import { AwaitingPlayer, Model } from './model'
import { update } from './update'
import { view } from './view'

export const init: Runtime.ApplicationInit<Model, Message> = () => [
  {
    playerScore: 0,
    computerScore: 0,
    round: AwaitingPlayer(),
  },
  [],
]

export { Message, Model, update, view }
