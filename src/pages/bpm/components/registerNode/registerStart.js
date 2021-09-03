export default function registerStart(lf) {
  lf.register('Start', ({ CircleNode, CircleNodeModel, h }) => {
    class NodeView extends CircleNode {
      getLabelShape() {
        const attributes = this.getAttributes();
        const { x, y } = attributes;
        return h(
          'text',
          {
            fill: '#52C41A',
            fontSize: 14,
            x: x,
            y: y,
            dy: 2,
            'alignment-baseline': 'middle',
            'text-anchor': 'middle',
          },
          '开始',
        );
      }
      getShape() {
        const attributes = this.getAttributes();
        const { x, y, fill, strokeWidth } = attributes;
        return h(
          'g',
          {
            className: 'cus-start',
          },
          [
            h('circle', {
              cx: x,
              cy: y,
              r: 22,
              fill,
              stroke: '#B3B3B3',
              strokeWidth,
            }),
            this.getLabelShape(),
          ],
        );
      }
    }
    class NodeModel extends CircleNodeModel {
      constructor(data, graphModel) {
        super(data, graphModel);
      }
      getConnectedTargetRules() {
        const rules = super.getConnectedTargetRules();
        const notAsTarget = {
          message: '起始节点不能作为连线的终点',
          validate: () => false,
        };
        rules.push(notAsTarget);
        return rules;
      }
      setAttributes() {
        this.text.editable = false;
        const { width } = this;

        this.anchorsOffset = [[width / 2, 0]];
      }
    }
    return {
      view: NodeView,
      model: NodeModel,
    };
  });
}
