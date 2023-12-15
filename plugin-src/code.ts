import { PluginMessageType } from '../types'

figma.showUI(__html__, { themeColors: true, height: 260 })
figma.loadFontAsync({ family: 'Inter', style: 'Medium' })

function createShapesAndConnectors(count: number): void {
  const nodes: SceneNode[] = []

  for (let i = 0; i < count; i++) {
    const shape = createSquareShape(`Shape ${i}`)
    shape.x = i * (shape.width + 200)
    figma.currentPage.appendChild(shape)
    nodes.push(shape)
  }

  createConnectors(nodes)

  figma.currentPage.selection = nodes
  figma.viewport.scrollAndZoomIntoView(nodes)
}

function createSquareShape(characters: string): ShapeWithTextNode {
  const shape = figma.createShapeWithText()
  shape.shapeType = 'SQUARE'
  shape.text.characters = characters
  shape.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }]
  return shape
}

function createConnectors(nodes: SceneNode[]): void {
  for (let i = 0; i < nodes.length - 1; i++) {
    const connector = figma.createConnector()
    connector.strokeWeight = 2

    connector.connectorStart = {
      endpointNodeId: nodes[i].id,
      magnet: 'AUTO',
    }

    connector.connectorEnd = {
      endpointNodeId: nodes[i + 1].id,
      magnet: 'AUTO',
    }
  }
}

function createStickies(prompt: string): void {
  const dissectedSections = prompt.split('\n\n')

  const stickies: StickyNode[] = []

  dissectedSections.forEach((section, index) => {
    const sticky = figma.createSticky()
    sticky.x = index * (sticky.width + 200)
    sticky.isWideWidth = true
    sticky.text.characters = section.trim()
    figma.currentPage.appendChild(sticky)
    stickies.push(sticky)
  })

  figma.currentPage.selection = stickies
  figma.viewport.scrollAndZoomIntoView(stickies)
}

figma.ui.onmessage = (msg) => {
  const { type, count, prompt, message } = msg

  switch (type) {
    case PluginMessageType.CreateShapes:
      createShapesAndConnectors(count)
      break
    case PluginMessageType.SubmitPrompt:
      createStickies(prompt)
      break
    case PluginMessageType.Notify:
      figma.notify(message)
      break
    default:
      break
  }

  figma.closePlugin()
}
