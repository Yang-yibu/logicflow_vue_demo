import Vue from 'vue';
import EngNodeHtml from './engNode.vue';

// { checkedNode, onChecked }
export default function registerNode(lf) {
  lf.register('EngNode', ({ HtmlNode, HtmlNodeModel }) => {
    class NodeView extends HtmlNode {
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
    }
    class NodeModel extends HtmlNodeModel {
      setAttributes() {
        const width = 200;
        const height = 50;

        this.width = width;
        this.height = height;
        this.text.editable = false;

        // this.anchorsOffset = [
        //   [width / 2, 0],
        //   [0, height / 2],
        //   [-width / 2, 0],
        //   [0, -height / 2],
        // ];
        const yOffset = height / 2 - 15;
        this.anchorsOffset = [
          [width / 2, -yOffset],
          [-width / 2, yOffset],
          [-width / 2, -yOffset],
        ];
      }
    }
    return {
      view: NodeView,
      model: NodeModel,
    };
  });
}
