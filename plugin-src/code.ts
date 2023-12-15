figma.showUI(__html__, { themeColors: true, height: 300 });
figma.loadFontAsync({ family: "Inter", style: "Medium" });

function createShapesAndConnectors(count: number): void {
  const nodes: SceneNode[] = [];

  for (let i = 0; i < count; i++) {
    const shape = createSquareShape(`Shape ${i}`);
    shape.x = i * (shape.width + 200);
    figma.currentPage.appendChild(shape);
    nodes.push(shape);
  }

  createConnectors(nodes);

  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);

  figma.closePlugin();
}

function createSquareShape(characters: string): ShapeWithTextNode {
  const shape = figma.createShapeWithText();
  shape.shapeType = "SQUARE";
  shape.text.characters = characters;
  shape.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
  return shape;
}

function createConnectors(nodes: SceneNode[]): void {
  for (let i = 0; i < nodes.length - 1; i++) {
    const connector = figma.createConnector();
    connector.strokeWeight = 2;

    connector.connectorStart = {
      endpointNodeId: nodes[i].id,
      magnet: "AUTO",
    };

    connector.connectorEnd = {
      endpointNodeId: nodes[i + 1].id,
      magnet: "AUTO",
    };
  }
}

figma.ui.onmessage = (msg) => {
  if (msg.type === "create-shapes") {
    // const nodes = [];

    // for (let i = 0; i < msg.count; i++) {
    //   const rect = figma.createRectangle();
    //   rect.x = i * 150;
    //   rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
    //   figma.currentPage.appendChild(rect);
    //   nodes.push(rect);
    // }

    // figma.currentPage.selection = nodes;
    // figma.viewport.scrollAndZoomIntoView(nodes);
    createShapesAndConnectors(msg.count);
  }

  figma.closePlugin();
};
