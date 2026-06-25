import { Match as M, Schema as S } from 'effect'
import { Canvas, Command, Runtime } from 'foldkit'
import { Document, Html, html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'

// CONSTANTS

const CANVAS_WIDTH = 720
const CANVAS_HEIGHT = 480
const STROKE_WIDTH = 6

type Crayon = { readonly name: string; readonly color: string }

const CRAYONS: ReadonlyArray<Crayon> = [
  { name: 'Black', color: '#1f2937' },
  { name: 'Red', color: '#ef4444' },
  { name: 'Orange', color: '#f97316' },
  { name: 'Yellow', color: '#facc15' },
  { name: 'Green', color: '#22c55e' },
  { name: 'Blue', color: '#3b82f6' },
  { name: 'Purple', color: '#a855f7' },
  { name: 'Brown', color: '#92400e' },
  { name: 'Pink', color: '#ec4899' },
]

const DEFAULT_COLOR = '#1f2937'

// MODEL

const Point = S.Struct({ x: S.Number, y: S.Number })
type Point = typeof Point.Type

const Stroke = S.Struct({ color: S.String, points: S.Array(Point) })
type Stroke = typeof Stroke.Type

export const Model = S.Struct({
  strokes: S.Array(Stroke),
  current: S.Array(Point),
  color: S.String,
  drawing: S.Boolean,
})
export type Model = typeof Model.Type

// MESSAGE

export const PickedColor = m('PickedColor', { color: S.String })
export const PressedCanvas = m('PressedCanvas', { x: S.Number, y: S.Number })
export const MovedCanvas = m('MovedCanvas', { x: S.Number, y: S.Number })
export const ReleasedCanvas = m('ReleasedCanvas')
export const ClickedReset = m('ClickedReset')

export const Message = S.Union([
  PickedColor,
  PressedCanvas,
  MovedCanvas,
  ReleasedCanvas,
  ClickedReset,
])
export type Message = typeof Message.Type

// INIT

export const init: Runtime.ApplicationInit<Model, Message> = () => [
  { strokes: [], current: [], color: DEFAULT_COLOR, drawing: false },
  [],
]

// UPDATE

export const update = (
  model: Model,
  message: Message,
): readonly [Model, ReadonlyArray<Command.Command<Message>>] =>
  M.value(message).pipe(
    M.withReturnType<
      readonly [Model, ReadonlyArray<Command.Command<Message>>]
    >(),
    M.tagsExhaustive({
      PickedColor: ({ color }) => [evo(model, { color: () => color }), []],

      PressedCanvas: ({ x, y }) => [
        evo(model, { drawing: () => true, current: () => [{ x, y }] }),
        [],
      ],

      MovedCanvas: ({ x, y }) =>
        model.drawing
          ? [evo(model, { current: points => [...points, { x, y }] }), []]
          : [model, []],

      ReleasedCanvas: () =>
        model.drawing && model.current.length > 0
          ? [
              evo(model, {
                strokes: strokes => [
                  ...strokes,
                  { color: model.color, points: model.current },
                ],
                current: () => [],
                drawing: () => false,
              }),
              [],
            ]
          : [evo(model, { drawing: () => false, current: () => [] }), []],

      ClickedReset: () => [
        evo(model, { strokes: () => [], current: () => [] }),
        [],
      ],
    }),
  )

// VIEW — scene

const background = Canvas.Rect({
  x: 0,
  y: 0,
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  fill: '#ffffff',
})

const strokeShape = (stroke: Stroke): Canvas.Shape => {
  const points = stroke.points
  const [first] = points

  if (first === undefined) {
    return Canvas.Group({ shapes: [] })
  }

  if (points.length === 1) {
    return Canvas.Circle({
      x: first.x,
      y: first.y,
      radius: STROKE_WIDTH / 2,
      fill: stroke.color,
    })
  }

  const instructions = points.map((point, index) =>
    index === 0
      ? Canvas.MoveTo({ x: point.x, y: point.y })
      : Canvas.LineTo({ x: point.x, y: point.y }),
  )

  return Canvas.Path({
    instructions,
    stroke: stroke.color,
    lineWidth: STROKE_WIDTH,
    lineCap: 'Round',
    lineJoin: 'Round',
  })
}

const sceneShapes = (model: Model): ReadonlyArray<Canvas.Shape> => {
  const committed = model.strokes.map(strokeShape)
  const live =
    model.current.length > 0
      ? [strokeShape({ color: model.color, points: model.current })]
      : []
  return [background, ...committed, ...live]
}

// VIEW — controls

const crayonButton = (model: Model, crayon: Crayon): Html => {
  const h = html<Message>()
  const selected = model.color === crayon.color

  return h.button(
    [
      h.Type('button'),
      h.OnClick(PickedColor({ color: crayon.color })),
      h.Style({ backgroundColor: crayon.color }),
      h.AriaLabel(crayon.name),
      h.Class(
        `w-10 h-10 rounded-full shadow-sm transition hover:scale-110 ${
          selected
            ? 'border-2 border-gray-900 ring-2 ring-offset-2 ring-gray-900 scale-110'
            : 'border-2 border-white'
        }`,
      ),
    ],
    [],
  )
}

const resetButton = (): Html => {
  const h = html<Message>()

  return h.button(
    [
      h.Type('button'),
      h.OnClick(ClickedReset()),
      h.Class(
        'ml-2 px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition',
      ),
    ],
    ['Reset'],
  )
}

export const view = (model: Model): Document => {
  const h = html<Message>()

  return {
    title: 'Crayon Draw',
    body: h.div(
      [
        h.Class(
          'min-h-screen bg-gray-100 flex flex-col items-center gap-6 p-8',
        ),
      ],
      [
        h.h1(
          [h.Class('text-3xl font-bold text-gray-800')],
          ['🖍️ Crayon Draw'],
        ),
        h.p(
          [h.Class('text-gray-500 text-sm')],
          ['Pick a crayon and drag on the white canvas to draw.'],
        ),
        h.div(
          [h.Class('flex flex-wrap items-center justify-center gap-3')],
          [...CRAYONS.map(crayon => crayonButton(model, crayon)), resetButton()],
        ),
        Canvas.view<Message>({
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          shapes: sceneShapes(model),
          className:
            'rounded-lg shadow-xl bg-white cursor-crosshair touch-none',
          onPointerDown: ({ x, y }) => PressedCanvas({ x, y }),
          onPointerMove: ({ x, y }) => MovedCanvas({ x, y }),
          onPointerUp: () => ReleasedCanvas(),
        }),
      ],
    ),
  }
}
