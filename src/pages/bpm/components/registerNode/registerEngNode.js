import Vue from 'vue';
import EngNodeHtml from './engNode.vue';

const TypeMap = {
  workItem_1: {
    width: 180,
    height: 40,
    font: { color: '#333333', 'font-size': '18px', 'font-weight': 500 },
    border: '2px solid #B3B3B3',
    color: '#3991E9',
  },
  workItem_2: {
    width: 180,
    height: 32,
    font: { color: '#333333', 'font-size': '14px', 'font-weight': 500 },
    border: '2px solid #CCCCCC',
    color: '#30B542',
  },
  workItem_3: {
    width: 160,
    height: 24,
    font: { color: '#666666', 'font-size': '14px', 'font-weight': 400 },
    border: '1px solid #E6E6E6',
    color: '#ECBE24',
  },
};
function EngNode_view(HtmlNode, type) {
  const conf = TypeMap[type];
  return class NodeView extends HtmlNode {
    constructor(props) {
      super(props);
      this.checked = false;
    }
    showUpdate() {
      const { properties } = this.getAttributes();
      let newProp = this.renderProp(properties);
      // console.log('diff', newProp);
      if (this.currentProp && this.currentProp === JSON.stringify(newProp))
        return false;

      this.currentProp = JSON.stringify(newProp);
      return true;
    }
    renderProp(prop) {
      return {
        label: prop.label,
        // checked: checkedNode.indexOf(prop.node.id) > -1,
        checked: this.checked,
      };
    }
    setHtml(rootEl) {
      const that = this;
      // console.log('set', this);
      if (!this.showUpdate()) return;
      // console.log('setRender');

      const attr = this.getAttributes();
      const { properties } = attr;
      const newProp = this.renderProp(properties);

      const el = document.createElement('div');
      rootEl.innerHTML = '';
      rootEl.appendChild(el);

      // 属性选择器 foreignObject[data-flag="cusEngNode"] 获取不到
      // rootEl.dataset.flag = 'cusEngNode';
      rootEl.parentElement.setAttribute('cus-flag', 'cusEngNode');
      // rootEl.style.overflow = 'visible';

      // 只作为模板渲染为 HTML
      const TplDOM = Vue.extend({
        render: function(h) {
          return h(EngNodeHtml, {
            props: {
              // 拖拽初始化的时候 properties 为空，没数据
              label: newProp.label || attr.text.value,
              checked: newProp.checked,
              conf: conf,
            },
            on: {
              'change-checkbox': ev => {
                that.checked = ev;
                that.setHtml(that.rootEl);
                // that.render();
              },
            },
          });
        },
      });
      new TplDOM().$mount(el);
    }
  };
}
function EngNode_model(HtmlNodeModel, type) {
  let conf = TypeMap[type];
  return class NodeModel extends HtmlNodeModel {
    constructor(data, graphModel) {
      super(data, graphModel);
    }
    setAttributes() {
      const width = conf.width;
      const height = conf.height;

      this.width = width;
      this.height = height;
      this.text.editable = false;

      this.anchorsOffset = [
        [width / 2, 0],
        [0, height / 2],
        [-width / 2, 0],
        [0, -height / 2],
      ];
      // const yOffset = height / 2 - 15;
      // this.anchorsOffset = [
      //   [width / 2, -yOffset],
      //   [-width / 2, yOffset],
      //   [-width / 2, -yOffset],
      // ];
    }
  };
}
// { checkedNode, onChecked }
export default function registerNode(lf) {
  lf.register('EngNode_1', ({ HtmlNode, HtmlNodeModel }) => {
    return {
      view: EngNode_view(HtmlNode, 'workItem_1'),
      model: EngNode_model(HtmlNodeModel, 'workItem_1'),
    };
  });
  lf.register('EngNode_2', ({ HtmlNode, HtmlNodeModel }) => {
    return {
      view: EngNode_view(HtmlNode, 'workItem_2'),
      model: EngNode_model(HtmlNodeModel, 'workItem_2'),
    };
  });
  lf.register('EngNode_3', ({ HtmlNode, HtmlNodeModel }) => {
    return {
      view: EngNode_view(HtmlNode, 'workItem_3'),
      model: EngNode_model(HtmlNodeModel, 'workItem_3'),
    };
  });
}
