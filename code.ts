// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many shapes and connectors on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// See: https://www.figma.com/plugin-docs/creating-ui/
figma.showUI(__html__)
figma.loadFontAsync({ family: 'Inter', style: 'Medium' })

function createShapesAndConnectors(count: number): void {
  const nodes: SceneNode[] = []

  for (let i = 0; i < count; i++) {
    const shape = createSquareShape(`Shape ${i.toString()}`)
    shape.x = i * (shape.width + 200)
    figma.currentPage.appendChild(shape)
    nodes.push(shape)
  }

  createConnectors(nodes)

  figma.currentPage.selection = nodes
  figma.viewport.scrollAndZoomIntoView(nodes)

  figma.closePlugin()
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

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (message) => {
  // Create shapes and connectors based on the user input
  if (message.type === 'create-shapes') {
    createShapesAndConnectors(message.count)
  }

  figma.closePlugin()
}
