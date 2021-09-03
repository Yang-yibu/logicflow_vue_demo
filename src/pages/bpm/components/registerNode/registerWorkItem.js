// { checkedNode, onChecked }
export default function registerNode(lf) {
  lf.register('WorkItem', ({ HtmlNode, HtmlNodeModel }) => {
    class NodeView extends HtmlNode {}
    class NodeModel extends HtmlNodeModel {}
    return {
      view: NodeView,
      model: NodeModel,
    };
  });
}
