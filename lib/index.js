'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Menu = _interopDefault(require('antd/es/menu'));
require('antd/es/menu/style/index.css');
require('antd/es/dropdown/style/index.css');
var tslib_1 = require('tslib');
var React = require('react');
var React__default = _interopDefault(React);
var TextArea = _interopDefault(require('antd/es/input/TextArea'));
require('antd/es/input/style/index.css');
var G6 = _interopDefault(require('@antv/g6/src/index'));
var Hierarchy = _interopDefault(require('@antv/hierarchy'));
require('core-js/modules/es6.array.some');
require('core-js/modules/es6.object.assign');
require('core-js/modules/es6.regexp.to-string');
require('core-js/modules/es6.date.to-string');
require('core-js/modules/es6.regexp.replace');
require('core-js/modules/es6.array.reduce');
require('core-js/modules/es6.array.map');
require('core-js/modules/es6.string.trim');
require('core-js/modules/es6.array.iterator');
require('core-js/modules/es6.object.keys');
require('core-js/modules/es6.regexp.split');
require('core-js/modules/es6.function.name');
var g6 = require('@antv/g6');
require('core-js/modules/es6.array.index-of');
require('core-js/modules/es6.array.is-array');
require('core-js/modules/web.dom.iterable');
require('core-js/modules/es6.array.for-each');
require('core-js/modules/es6.array.find');
require('core-js/modules/es6.array.find-index');

var EditorContext = React__default.createContext({});

function Overlay(_a, ref) {
    var children = _a.children, visible = _a.visible, style = _a.style, rest = tslib_1.__rest(_a, ["children", "visible", "style"]);
    var display = visible ? 'block' : 'none';
    var styleObj = tslib_1.__assign({ position: 'absolute', display: display }, style);
    return (React__default.createElement("div", tslib_1.__assign({ style: styleObj }, rest, { ref: ref }), children));
}
var Overlay$1 = React__default.forwardRef(Overlay);

function OverlayMenu(props) {
    var _a = props.placement, placement = _a === void 0 ? 'bottomLeft' : _a, visible = props.visible, style = props.style, items = props.items, onClose = props.onClose, onSelect = props.onSelect;
    var placementStyle = {
        bottomLeft: {},
        bottomRight: {
            transform: 'translate(-100%)'
        }
    };
    var innerStyle = tslib_1.__assign({}, style, placementStyle[placement]);
    var ref = React.useRef(null);
    var handleClick = function (evt) {
        var key = evt.key;
        onSelect(key);
        onClose();
    };
    React.useEffect(function () {
        var handleClickOutside = function (evt) {
            if (ref.current && !ref.current.contains(evt.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);
    var menu = (React__default.createElement(Overlay$1, { style: innerStyle, visible: visible, ref: ref },
        React__default.createElement(Menu, { prefixCls: "ant-dropdown-menu", onClick: handleClick, selectable: false }, items.map(function (item) {
            if (item.type === 'Divider') {
                return React__default.createElement(Menu.Divider, { key: item.key });
            }
            return React__default.createElement(Menu.Item, { key: item.key }, item.name);
        }))));
    return menu;
}
var OverlayMenu$1 = React__default.memo(OverlayMenu);

var contextMenuItems = [
    {
        name: '标记为通过',
        key: 'success',
        handler: function (editor) { return editor.updateNode({ status: 1 }); }
    },
    {
        name: '标记为不通过',
        key: 'fail',
        handler: function (editor) { return editor.updateNode({ status: 2 }); }
    },
    {
        name: '标记为受阻',
        key: 'block',
        handler: function (editor) { return editor.updateNode({ status: 3 }); }
    },
    {
        name: '标记为重测',
        key: 'retest',
        handler: function (editor) { return editor.updateNode({ status: 4 }); }
    },
    { type: 'Divider', key: 'divider' },
    {
        name: '新增条件',
        key: 'add-node',
        handler: function (editor) { return editor.addNode(); }
    },
    {
        name: '删除节点',
        key: 'delete-node',
        handler: function (editor) { return editor.deleteNode(); }
    }
];

function ContextMenu(_a) {
    var _b = _a.placement, placement = _b === void 0 ? 'bottomLeft' : _b, _c = _a.event, event = _c === void 0 ? 'ed-node-contextmenu' : _c, _d = _a.items, items = _d === void 0 ? contextMenuItems : _d;
    var editor = React.useContext(EditorContext);
    var _e = React.useState(false), visible = _e[0], setVisible = _e[1];
    var _f = React.useState({}), style = _f[0], setStyle = _f[1];
    var handleMenuSelect = function (key) {
        var item = items.find(function (v) { return String(v.key) === key; });
        if (item && typeof item.handler === 'function') {
            item.handler(editor);
        }
    };
    React.useEffect(function () {
        editor.on(event, function (evt) {
            setVisible(true);
            setStyle({ top: evt.y, left: evt.x });
        });
    }, [editor, event]);
    return (React__default.createElement(OverlayMenu$1, { style: style, visible: visible, placement: placement, items: items, onSelect: handleMenuSelect, onClose: function () { return setVisible(false); } }));
}

function OverlayInput(props) {
    var visible = props.visible, style = props.style, value = props.value;
    var textareaRef = React.useRef(null);
    var cancelledRef = React.useRef(false);
    var _a = React.useState(value), innerValue = _a[0], setInnerValue = _a[1];
    var handleKeyDown = function (evt) {
        // Esc
        if (evt.keyCode === 27) {
            setInnerValue(value);
            cancelledRef.current = true;
            textareaRef.current.blur();
        }
        else if (evt.keyCode === 13) {
            if (evt.ctrlKey) {
                setInnerValue(function (v) { return v + "\n"; });
            }
            if (!evt.ctrlKey && !evt.shiftKey) {
                evt.preventDefault();
                textareaRef.current.blur();
            }
        }
    };
    var handleBlur = function () {
        if (!cancelledRef.current && innerValue !== value) {
            props.onConfirm(innerValue);
        }
        props.onCancel();
        cancelledRef.current = false;
    };
    React.useEffect(function () {
        if (visible) {
            setInnerValue(value);
            textareaRef.current.focus();
        }
    }, [value, visible]);
    var content = (React__default.createElement(Overlay$1, { style: style, visible: visible },
        React__default.createElement(TextArea, { style: {
                fontSize: '12px',
                lineHeight: 1.5,
                overflow: 'hidden'
            }, ref: textareaRef, autosize: true, value: innerValue, onChange: function (evt) { return setInnerValue(evt.currentTarget.value); }, onKeyDown: handleKeyDown, onBlur: handleBlur })));
    return content;
}
var OverlayInput$1 = React__default.memo(OverlayInput);

var inputKey;
function EditorInput() {
    var editor = React.useContext(EditorContext);
    var _a = React.useState(false), visible = _a[0], setVisible = _a[1];
    var _b = React.useState(''), value = _b[0], setValue = _b[1];
    var _c = React.useState({}), style = _c[0], setStyle = _c[1];
    var handleInputConfirm = function (val) {
        var _a;
        editor.updateNode((_a = {}, _a[inputKey] = val, _a));
    };
    React.useEffect(function () {
        editor.setMode(visible ? 'lock' : 'default');
    }, [editor, visible]);
    React.useEffect(function () {
        editor.on('ed-text-edit', function (evt) {
            var width = evt.width, height = evt.height, zoom = evt.zoom, x = evt.x, y = evt.y;
            inputKey = evt.key;
            setVisible(true);
            setValue(evt.value);
            setStyle({
                width: width,
                height: height,
                left: x,
                top: y,
                transform: "scale(" + zoom + ")",
                transformOrigin: 'top left'
            });
        });
    }, [editor]);
    return (React__default.createElement(OverlayInput$1, { visible: visible, value: value, style: style, onConfirm: handleInputConfirm, onCancel: function () { return setVisible(false); } }));
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var activeColor = '#1890ff'; // 边的样式

var edgeStyle = {
  default: {
    stroke: '#a3b1bf'
  }
}; // 节点的样式

var nodeStyle = {
  default: {
    stroke: '#a3b1bf',
    fill: '#fff'
  },
  active: {
    stroke: activeColor
  }
}; // 文字的样式

var textStyle = {
  default: {
    fontSize: 12,
    fontFamily: 'sans-serif',
    textAlign: 'left',
    textBaseline: 'top',
    lineHeight: 12 * 1.5,
    fill: '#666'
  },
  active: {
    fill: activeColor
  }
}; // 普通节点的模型

var expandNodeBox = {
  padding: [5, 12, 5, 12]
}; // 结果节点的模型

var resultNodeBox = {
  width: 300,
  padding: [5, 12, 5, 12],
  itemMargin: 10,
  labelWidth: 72
}; // 占位节点样式 (拖动)

var placeholderNodeStyle = {
  fill: '#91D5FF'
}; // 拖拽节点样式

var delegateStyle = {
  fill: '#F3F9FF',
  fillOpacity: 0.5,
  stroke: '#1890FF',
  strokeOpacity: 0.9,
  lineDash: [4, 4],
  radius: 4
};
var statusStyleOptions = [nodeStyle.default, {
  fill: '#dcf3d0',
  stroke: '#53c400'
}, {
  fill: 'rgba(220,104,83,0.2)',
  stroke: 'rgba(246,155,155,1)'
}, {
  fill: 'rgba(172,172,172,0.2)',
  stroke: 'rgba(185,185,185,1)'
}, {
  fill: 'rgba(255,182,77,0.2)',
  stroke: 'rgba(255,182,77,1)'
}];

/* eslint-disable no-bitwise */
function guid() {
  return 'xxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
function traverseTree(fn, data, parent, i) {
  if (fn(data, parent, i) === false) {
    return;
  }

  if (Array.isArray(data.children)) {
    data.children.forEach(function (child, index) {
      traverseTree(fn, child, data, index);
    });
  }
}

var baseNodeModule = {
  name: 'default',
  // child
  shouldBeAppend: function shouldBeAppend() {
    return true;
  },
  // parent
  shouldAddChild: function shouldAddChild() {
    return true;
  },
  getChangeSizeKeys: function getChangeSizeKeys() {
    return [];
  },
  calNodeSize: function calNodeSize() {
    return {};
  },
  getDefaultData: function getDefaultData() {
    return {};
  },
  create: function create() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var defaultData = _objectSpread({
      id: guid()
    }, this.getDefaultData(), data);

    return Object.assign(defaultData, this.calNodeSize(defaultData));
  },
  update: function update(oldValue, value) {
    var needCalNode = this.getChangeSizeKeys().some(function (key) {
      return value[key] !== undefined && value[key] !== oldValue[key];
    });
    Object.assign(oldValue, value);
    var size = needCalNode ? this.calNodeSize(oldValue) : {};
    return Object.assign(oldValue, size);
  }
};

var context = document.createElement('canvas').getContext('2d');

function getSliceLength(text, maxWidth) {
  var width = context.measureText(text).width;

  if (width <= maxWidth) {
    return {
      text: text,
      width: width
    };
  } // 基本可能的分割长度


  var len = Math.floor(maxWidth / width * text.length);
  var result = text.slice(0, len);
  width = context.measureText(result).width;

  while (width <= maxWidth && len < text.length) {
    result = text.slice(0, ++len);
    width = context.measureText(result).width;
  }

  while (width > maxWidth && len > 0) {
    result = text.slice(0, --len);
    width = context.measureText(result).width;
  }

  return {
    text: text.slice(0, len),
    width: width
  };
}

function sliceText(_ref) {
  var text = _ref.text,
      _ref$maxWidth = _ref.maxWidth,
      maxWidth = _ref$maxWidth === void 0 ? 240 : _ref$maxWidth,
      _ref$font = _ref.font,
      font = _ref$font === void 0 ? '12px sans-serif' : _ref$font;

  if (!text) {
    return [];
  }

  context.font = font;
  return text.split('\n').reduce(function (acc, cur) {
    var lines = [];
    var str = cur;

    do {
      var obj = getSliceLength(str, maxWidth, context);
      lines.push(obj);
      str = str.slice(obj.text.length);
    } while (str.length);

    return acc.concat(lines);
  }, []);
}
function getTextBox(_ref2) {
  var text = _ref2.text,
      _ref2$maxWidth = _ref2.maxWidth,
      maxWidth = _ref2$maxWidth === void 0 ? 240 : _ref2$maxWidth,
      _ref2$font = _ref2.font,
      font = _ref2$font === void 0 ? '12px sans-serif' : _ref2$font,
      _ref2$lineHeight = _ref2.lineHeight,
      lineHeight = _ref2$lineHeight === void 0 ? 18 : _ref2$lineHeight;
  var result = sliceText({
    text: text,
    maxWidth: maxWidth,
    font: font
  });
  var width = Math.max.apply(Math, _toConsumableArray(result.map(function (v) {
    return v.width;
  })));
  var height = result.length * lineHeight;
  var value = result.map(function (v) {
    return v.text;
  }).join('\n');
  return {
    width: width,
    height: height,
    value: value
  };
}

var getRectStyle = function getRectStyle() {
  var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return statusStyleOptions[status] || nodeStyle.default;
};

var expandNodeName = 'expand-node';
var registerExpandNode = {
  name: expandNodeName,
  // TODO: 开启动画的时候父节点没有重新draw
  draw: function draw(cfg, group) {
    var padding = expandNodeBox.padding;
    var paddingTop = padding[0];
    var paddingLeft = padding[3];
    var collapsed = cfg.collapsed,
        children = cfg.children,
        width = cfg.width,
        height = cfg.height,
        _label = cfg._label,
        status = cfg.status;

    var textAttrs = _objectSpread({
      x: paddingLeft,
      y: paddingTop + (textStyle.default.lineHeight - textStyle.default.fontSize) / 2,
      text: _label
    }, textStyle.default);

    var labelObj = group.addShape('text', {
      attrs: textAttrs
    });
    var rectStyle = getRectStyle(status);
    group.addShape('rect', {
      attrs: _objectSpread({
        width: width,
        height: height,
        x: 0,
        y: 0,
        radius: 4
      }, rectStyle)
    });

    if (children && children.length) {
      var cr = 7;
      var crPadding = 3;
      var collapseIcon = [['M', width + crPadding, height / 2], ['h', (cr - crPadding) * 2]];
      var expandIcon = [].concat(collapseIcon, [['M', width + cr, crPadding - cr + height / 2], ['v', (cr - crPadding) * 2]]);
      group.addShape('circle', {
        attrs: _objectSpread({
          x: width + cr,
          y: height / 2,
          r: cr
        }, nodeStyle.default),
        className: 'collapse-icon'
      });
      group.addShape('path', {
        attrs: {
          lineWidth: 2,
          path: collapsed ? collapseIcon : expandIcon,
          stroke: nodeStyle.default.stroke
        },
        className: 'collapse-icon'
      });
    }

    labelObj.toFront();
    return group;
  },
  setState: function setState(name, value, item) {
    var group = item.getContainer();
    var model = item.getModel();
    var shapes = group.get('children');
    var rectShape = shapes[0]; // const textShape = shapes[shapes.length - 1];

    if (name === 'selected') {
      if (value) {
        rectShape.attr(nodeStyle.active);
      } else {
        rectShape.attr(getRectStyle(model.status));
      }
    }
  },
  getAnchorPoints: function getAnchorPoints() {
    return [[0, 0.5], // 左侧中间
    [1, 0.5] // 右侧中间
    ];
  }
};

var expandNodeModule = {
  name: expandNodeName,
  getDefaultData: function getDefaultData() {
    return {
      shape: this.name,
      label: '条件分支'
    };
  },
  getChangeSizeKeys: function getChangeSizeKeys() {
    return ['label'];
  },
  calNodeSize: function calNodeSize(_ref) {
    var _ref$label = _ref.label,
        label = _ref$label === void 0 ? '' : _ref$label;
    var text = String(label).trim() || '空';
    var textBox = getTextBox({
      text: text,
      lineHeight: textStyle.default.lineHeight
    });
    var padding = expandNodeBox.padding;
    var width = textBox.width + padding[1] + padding[3];
    var height = textBox.height + padding[0] + padding[2];
    return {
      width: width,
      height: height,
      _label: textBox.value
    };
  }
};

var levelOptions = ['无', '低', '中', '高'];
var resultNodeName = 'result-node';
var registerResultNode = {
  name: resultNodeName,
  draw: function draw(cfg, group) {
    var _description = cfg._description,
        _label = cfg._label,
        forAutoTest = cfg.forAutoTest,
        level = cfg.level,
        width = cfg.width,
        height = cfg.height;
    var _textStyle$default = textStyle.default,
        lineHeight = _textStyle$default.lineHeight,
        fontSize = _textStyle$default.fontSize;
    var labelWidth = resultNodeBox.labelWidth;
    var padding = resultNodeBox.padding;
    var paddingTop = padding[0];
    var paddingLeft = padding[3];
    var marginBottom = resultNodeBox.itemMargin;
    var descTop = paddingTop + (lineHeight - fontSize) / 2;
    var labelTop = _description.split('\n').length * lineHeight + marginBottom + descTop;
    var autoTestTop = _label.split('\n').length * lineHeight + marginBottom + labelTop;
    var textShape = {
      descriptionLabel: {
        attrs: {
          x: paddingLeft,
          y: descTop,
          text: '描述：'
        }
      },
      descriptionValue: {
        attrs: {
          x: labelWidth + paddingLeft,
          y: descTop,
          text: _description
        },
        cfg: {
          className: 'description'
        }
      },
      expectedResultLabel: {
        attrs: {
          x: paddingLeft,
          y: labelTop,
          text: '预期结果：'
        }
      },
      expectedResultValue: {
        attrs: {
          x: labelWidth + paddingLeft,
          y: labelTop,
          text: _label
        },
        cfg: {
          className: 'label'
        }
      },
      autoTestValue: {
        attrs: {
          x: paddingLeft,
          y: autoTestTop,
          text: "\u81EA\u52A8\u5316\u6D4B\u8BD5\uFF1A".concat(forAutoTest ? '是' : '否')
        },
        cfg: {
          className: 'forAutoTest'
        }
      },
      levelValue: {
        attrs: {
          x: labelWidth + paddingLeft + 16 + 20,
          y: autoTestTop,
          text: "\u4F18\u5148\u7EA7: ".concat(levelOptions[level])
        },
        cfg: {
          className: 'level'
        }
      }
    };
    var rect = group.addShape('rect', {
      attrs: _objectSpread({
        width: width,
        height: height,
        x: 0,
        y: 0,
        radius: 4
      }, nodeStyle.default)
    });
    Object.keys(textShape).forEach(function (key) {
      var _textShape$key = textShape[key],
          attrs = _textShape$key.attrs,
          cfgData = _textShape$key.cfg;
      group.addShape('text', _objectSpread({
        attrs: _objectSpread({}, textStyle.default, attrs)
      }, cfgData));
    });
    return rect;
  },
  setState: function setState(name, value, item) {
    var group = item.getContainer();
    var shapes = group.get('children');
    var rectShape = shapes[0];

    if (name === 'selected') {
      if (value) {
        rectShape.attr(nodeStyle.active);
      } else {
        rectShape.attr(nodeStyle.default);
      }
    }
  },
  getAnchorPoints: function getAnchorPoints() {
    return [[0, 0.5], // 左侧中间
    [1, 0.5] // 右侧中间
    ];
  }
};

var resultNodeModule = {
  name: resultNodeName,
  shouldBeAppend: function shouldBeAppend(parent) {
    var _this = this;

    if (parent && parent.children && parent.children.find(function (v) {
      return v.shape === _this.name;
    })) {
      return false;
    }

    return true;
  },
  // parent
  shouldAddChild: function shouldAddChild() {
    return false;
  },
  getDefaultData: function getDefaultData() {
    return {
      shape: this.name,
      label: '',
      description: '',
      forAutoTest: false,
      level: 0
    };
  },
  getChangeSizeKeys: function getChangeSizeKeys() {
    return ['label', 'description'];
  },
  calNodeSize: function calNodeSize(_ref) {
    var _ref$label = _ref.label,
        label = _ref$label === void 0 ? '' : _ref$label,
        _ref$description = _ref.description,
        description = _ref$description === void 0 ? '' : _ref$description;
    var labelText = String(label).trim();
    var descriptionText = String(description).trim();
    var lineHeight = textStyle.default.lineHeight;
    var width = resultNodeBox.width,
        labelWidth = resultNodeBox.labelWidth,
        padding = resultNodeBox.padding,
        itemMargin = resultNodeBox.itemMargin;
    var maxTextWidth = width - labelWidth - padding[1] - padding[3];
    var textBoxs = [labelText, descriptionText].map(function (v) {
      return getTextBox({
        lineHeight: lineHeight,
        maxWidth: maxTextWidth,
        text: v || '空'
      });
    });
    var textHeight = textBoxs.reduce(function (acc, cur) {
      return acc + cur.height;
    }, 0);
    var height = textHeight + textBoxs.length * itemMargin + lineHeight + padding[0] + padding[2];
    return {
      width: width,
      height: height,
      _label: textBoxs[0].value,
      _description: textBoxs[1].value
    };
  }
};

var nodeModules = {}; // 注册节点操作

var addNodeModule = function addNodeModule(obj) {
  if (!obj.name) {
    // eslint-disable-next-line no-console
    console.warn('nodeModule need a name');
    return;
  }

  nodeModules[obj.name] = _objectSpread({}, baseNodeModule, obj);
}; // 获取节点的操作

var getNodeModule = function getNodeModule(name) {
  return nodeModules[name] || baseNodeModule;
};
addNodeModule(expandNodeModule);
addNodeModule(resultNodeModule);

var placeholderNodeName = 'placeholder-node';
var registerPlaceholderNode = {
  name: placeholderNodeName,
  // TODO: 开启动画的时候父节点没有重新draw
  draw: function draw(cfg, group) {
    var width = cfg.width,
        height = cfg.height;
    group.addShape('rect', {
      attrs: _objectSpread({
        width: width,
        height: height,
        x: 0,
        y: 0,
        radius: 4
      }, placeholderNodeStyle)
    });
    return group;
  },
  getAnchorPoints: function getAnchorPoints() {
    return [[0, 0.5], // 左侧中间
    [1, 0.5] // 右侧中间
    ];
  }
};

function registerCustomNode(G6$$1) {
  G6$$1.registerNode(registerExpandNode.name, registerExpandNode);
  G6$$1.registerNode(registerResultNode.name, registerResultNode);
  G6$$1.registerNode(registerPlaceholderNode.name, registerPlaceholderNode);
}

var edContextmenu = {
  getEvents: function getEvents() {
    return {
      'node:contextmenu': 'onContextmenu'
    };
  },
  onContextmenu: function onContextmenu(e) {
    var self = this;
    var item = e.item;
    var graph = self.graph;
    graph.setCurrent(item.get('id'));
    graph.emit('ed-node-contextmenu', {
      target: item,
      x: e.canvasX,
      y: e.canvasY
    });
  }
};

var edClickSelect = {
  getEvents: function getEvents() {
    return {
      'node:click': 'onClick',
      'canvas:click': 'onCanvasClick'
    };
  },
  onClick: function onClick(e) {
    var self = this;
    var item = e.item;
    var graph = self.graph;
    graph.setCurrent(item.get('id'));
  },
  onCanvasClick: function onCanvasClick() {
    var graph = this.graph;
    graph.setCurrent(null);
  }
};

var edEdit = {
  getEvents: function getEvents() {
    return {
      'node:dblclick': 'onDblclick'
    };
  },
  // 普通节点编辑
  onDblclick: function onDblclick(e) {
    var item = e.item;

    if (item.get('currentShape') !== 'expand-node') {
      return;
    }

    var graph = this.graph;
    graph.editNode(item);
  }
};

var edResultEdit = {
  getEvents: function getEvents() {
    return {
      'node:click': 'onClick'
    };
  },
  onClick: function onClick(evt) {
    var item = evt.item;

    if (item.get('currentShape') !== 'result-node') {
      return;
    }

    var shape = evt.target;
    var model = item.getModel();
    var className = shape.get('className');

    if (className === 'label' || className === 'description') {
      this.editText(shape, className, model[className]);
    } else if (className === 'level') {
      this.editSelect(shape, className, model[className]);
    } else if (className === 'forAutoTest') {
      this.graph.updateNode(_defineProperty({}, className, !model.forAutoTest));
    }
  },
  editSelect: function editSelect(shape, key, value) {
    var graph = this.graph;
    var bbox = g6.Util.getBBox(shape, shape.getParent());

    var _graph$getCanvasByPoi = graph.getCanvasByPoint(bbox.maxX, bbox.maxY),
        x = _graph$getCanvasByPoi.x,
        y = _graph$getCanvasByPoi.y;

    graph.emit('ed-select-edit', {
      key: key,
      value: value,
      x: x,
      y: y
    });
  },
  editText: function editText(shape, key, value) {
    var graph = this.graph;
    var padding = resultNodeBox.padding,
        labelWidth = resultNodeBox.labelWidth;
    var textWidth = resultNodeBox.width - labelWidth - padding[1] - padding[3];
    var bbox = g6.Util.getBBox(shape, shape.getParent());
    var width = textWidth + padding[1] + padding[3];
    var height = bbox.maxY - bbox.minY + padding[0] + padding[2];

    var _graph$getCanvasByPoi2 = graph.getCanvasByPoint(bbox.minX, bbox.minY),
        x = _graph$getCanvasByPoi2.x,
        y = _graph$getCanvasByPoi2.y;

    x -= padding[1];
    y -= padding[0];
    graph.emit('ed-text-edit', {
      key: key,
      value: value,
      x: x,
      y: y,
      width: width,
      height: height
    });
  }
};

var edShortcut = {
  getDefaultCfg: function getDefaultCfg() {
    return {
      //  { keyCode: [45, 9], handler: 'addNode' }
      shortcuts: []
    };
  },
  getEvents: function getEvents() {
    return {
      keydown: 'onKeydown'
    };
  },
  onKeydown: function onKeydown(evt) {
    var code = evt.keyCode;
    var graph = this.graph;
    var item = this.shortcuts.find(function (v) {
      var matchKey = Array.isArray(v.keyCode) ? v.keyCode.indexOf(code) !== -1 : v.keyCode === code;
      return matchKey && (typeof v.ctrlKey !== 'boolean' || v.ctrlKey === evt.ctrlKey);
    });

    if (item && item.handler) {
      if (typeof item.handler === 'string' && graph[item.handler]) {
        evt.preventDefault();
        var args = [].concat(item.arguments);
        graph[item.handler].apply(graph, _toConsumableArray(args));
      } else if (typeof item.handler === 'function') {
        evt.preventDefault();
        item.handler.call(graph);
      }
    }
  }
};

var edDragNode = {
  getDefaultCfg: function getDefaultCfg() {
    return {
      delegateStyle: delegateStyle
    };
  },
  getEvents: function getEvents() {
    return {
      'node:dragstart': 'onDragStart',
      mousemove: 'onDrag',
      drop: 'onDragEnd',
      'canvas:mouseleave': 'onDragEnd'
    };
  },
  onDragStart: function onDragStart(evt) {
    if (!this.shouldBegin.call(this, evt)) {
      return;
    }

    var graph = this.graph;
    var model = evt.item.get('model');

    if (!model.parent) {
      return;
    }

    this.pointDiff = {
      x: evt.x - model.x,
      y: evt.y - model.y
    };
    var siblings = graph.findDataById(model.parent).children;
    var index = siblings.findIndex(function (v) {
      return v.id === model.id;
    });
    siblings.splice(index, 1);
    graph.changeData();

    this._createHotAreas2(model);

    this.target = _objectSpread({}, model, {
      index: index
    });
  },
  onDrag: function onDrag(evt) {
    if (!this.target) {
      return;
    }

    if (!this.get('shouldUpdate').call(this, evt)) {
      return;
    }

    this._update(this.target, evt.x, evt.y);
  },
  onDragEnd: function onDragEnd(e) {
    if (!this.shouldEnd.call(this, e)) {
      return;
    }

    if (!this.target) {
      return;
    }

    var model = this.target;
    this.target = null;
    this.hotAreas = null;

    if (this.delegateShape) {
      this.delegateShape.remove();
      this.delegateShape = null;
    }

    var graph = this.graph;

    if (this.placeholder) {
      var _this$placeholder = this.placeholder,
          index = _this$placeholder.index,
          parent = _this$placeholder.parent;

      var _this$_removePlacehol = this._removePlaceholder(),
          siblings = _this$_removePlacehol.siblings;

      model.parent = parent;
      siblings.splice(index, 0, model);
    } else {
      var _siblings = graph.findDataById(model.parent).children;

      _siblings.splice(model.index, 0, model);
    }

    graph.changeData();
  },
  _findHotArea: function _findHotArea(x, y) {
    return (this.hotAreas || []).find(function (item) {
      return x >= item.minX && x <= item.maxX && y >= item.minY && y <= item.maxY;
    });
  },
  _createHotAreas2: function _createHotAreas2(model) {
    var graph = this.graph;
    var root = graph.save();
    var hotAreas = [];
    var hotWidth = 100;
    traverseTree(function (current) {
      if (!graph.shouldAddChild(model, current)) {
        return;
      }

      var children = current.children || [];
      var x = current.x,
          y = current.y,
          width = current.width,
          height = current.height;
      var parent = current.id;

      if (children.length === 0) {
        var minX = x + width;
        var maxX = minX + hotWidth;
        var minY = y;
        var maxY = y + height;
        hotAreas.push({
          minX: minX,
          maxX: maxX,
          minY: minY,
          maxY: maxY,
          parent: parent,
          index: 0
        });
      } else {
        var lastY = children[0].y - 20;
        children.forEach(function (child, index) {
          var minX = child.x - 20;
          var maxX = child.x + hotWidth;
          var minY = lastY;
          var maxY = child.y + child.height / 2;
          lastY = maxY;
          hotAreas.push({
            minX: minX,
            maxX: maxX,
            minY: minY,
            maxY: maxY,
            parent: parent,
            index: index
          });
        });
        var lastChild = children[children.length - 1];

        var _minX = lastChild.x - 20;

        var _maxX = lastChild.x + hotWidth;

        var _minY = lastY;

        var _maxY = lastY + lastChild.height / 2 + 20;

        hotAreas.push({
          minX: _minX,
          maxX: _maxX,
          minY: _minY,
          maxY: _maxY,
          parent: parent,
          index: children.length
        });
      }
    }, root);
    this.hotAreas = hotAreas;
  },
  _update: function _update(item, x, y) {
    var graph = this.graph;

    this._updateDelegate(item, x, y);

    var hotArea = this._findHotArea(x, y);

    if (hotArea) {
      this._updatePlaceholder(item, hotArea.parent, hotArea.index);

      graph.changeData();
    } else if (this.placeholder) {
      this._removePlaceholder();

      graph.changeData();
    }
  },
  _updatePlaceholder: function _updatePlaceholder(item, parent, index) {
    if (this.placeholder) {
      var oldParent = this.placeholder.parent;
      var oldIndex = this.placeholder.index;

      if (oldParent === parent && oldIndex === index) {
        return;
      }

      var _this$_removePlacehol2 = this._removePlaceholder(),
          placeholder = _this$_removePlacehol2.placeholder;

      this._createPlaceholder(item, parent, index, placeholder);
    } else {
      this._createPlaceholder(item, parent, index);
    }
  },
  _removePlaceholder: function _removePlaceholder() {
    var graph = this.graph;
    var _this$placeholder2 = this.placeholder,
        parent = _this$placeholder2.parent,
        index = _this$placeholder2.index;
    var siblings = graph.findDataById(parent).children;
    var placeholder = siblings.splice(index, 1)[0];
    this.placeholder = null;
    return {
      placeholder: placeholder,
      siblings: siblings
    };
  },
  _createPlaceholder: function _createPlaceholder(item, parent, index, placeholder) {
    var graph = this.graph;

    if (!placeholder) {
      var width = item.width,
          height = item.height;
      placeholder = {
        shape: placeholderNodeName,
        id: guid(),
        parent: parent,
        width: width,
        height: height
      };
    }

    this.placeholder = {
      parent: parent,
      index: index
    };
    var parentData = graph.findDataById(parent);

    if (!parentData.children) {
      parentData.children = [];
    }

    parentData.children.splice(index, 0, placeholder);
  },
  _updateDelegate: function _updateDelegate(item, x, y) {
    x -= this.pointDiff.x;
    y -= this.pointDiff.y;

    if (!this.delegateShape) {
      this.delegateShape = this._createDelegate(item, x, y);
    }

    this.delegateShape.attr({
      x: x,
      y: y
    });
    this.graph.paint();
  },
  _createDelegate: function _createDelegate(item, x, y) {
    var width = item.width,
        height = item.height;
    var parent = this.graph.get('group');
    var attrs = this.delegateStyle;
    var delegateShape = parent.addShape('rect', {
      attrs: _objectSpread({
        width: width,
        height: height,
        x: x,
        y: y
      }, attrs)
    });
    delegateShape.set('capture', false);
    this.delegateShape = delegateShape;
    return delegateShape;
  }
};

function registerCustomBehavior(G6$$1) {
  G6$$1.registerBehavior('ed-contextmenu', edContextmenu);
  G6$$1.registerBehavior('ed-click-select', edClickSelect);
  G6$$1.registerBehavior('ed-edit', edEdit);
  G6$$1.registerBehavior('ed-result-edit', edResultEdit);
  G6$$1.registerBehavior('ed-shortcut', edShortcut);
  G6$$1.registerBehavior('ed-drag-node', edDragNode);
}

registerCustomNode(G6);
registerCustomBehavior(G6);
var defaultData = {
  label: '我是根节点'
};

var Editor =
/*#__PURE__*/
function (_G6$TreeGraph) {
  _inherits(Editor, _G6$TreeGraph);

  function Editor(_ref) {
    var _this;

    var container = _ref.container,
        data = _ref.data;

    _classCallCheck(this, Editor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Editor).call(this, {
      container: container,
      width: container.offsetWidth,
      height: container.offsetHeight,
      animate: false,
      layout: function layout(val) {
        return Hierarchy.compactBox(val, {
          direction: 'LR',
          getId: function getId(d) {
            return d.id;
          },
          getWidth: function getWidth(cfg) {
            return cfg.width;
          },
          getHeight: function getHeight(cfg) {
            return cfg.height;
          },
          getVGap: function getVGap() {
            return 5;
          },
          getHGap: function getHGap() {
            return 40;
          }
        });
      },
      defaultNode: {
        shape: 'expand-node'
      },
      defaultEdge: {
        shape: 'cubic-horizontal'
      },
      edgeStyle: edgeStyle,
      modes: {
        default: [{
          type: 'collapse-expand',
          shouldBegin: function shouldBegin(evt) {
            var target = evt.target;
            return target.get('className') === 'collapse-icon';
          }
        }, {
          type: 'ed-click-select',
          shouldUpdate: function shouldUpdate(evt) {
            var target = evt.target;
            return target.get('className') !== 'collapse-icon';
          }
        }, {
          type: 'ed-shortcut',
          shortcuts: [{
            keyCode: [45, 9],
            handler: 'addNode'
          }, // insert tab
          {
            keyCode: 46,
            handler: 'deleteNode'
          }, // delete
          // {
          //   keyCode: 35,
          //   handler: 'addNode',
          //   arguments: 'result-node'
          // }, // end
          {
            keyCode: 32,
            handler: 'moveToCenter'
          }, // space
          {
            keyCode: 67,
            ctrlKey: true,
            handler: 'cloneNode'
          }, // ctrl + c
          {
            keyCode: 86,
            ctrlKey: true,
            handler: 'pasteNode' // ctrl + v

          }]
        }, {
          type: 'ed-drag-node'
        }, 'ed-contextmenu', 'ed-edit', 'ed-result-edit', 'drag-canvas', 'zoom-canvas'],
        lock: []
      }
    }));
    _this.currentId = null;
    _this.clipboardId = null;

    _this.read(_this.parseData(data || defaultData));

    _this.moveToCenter(); // 加入到extendEvents, destroy 的时候 就会 remove


    _this.get('eventController').extendEvents.push(_this._bindForceEvent());

    if (process.env.NODE_ENV === 'development') {
      window.treeEditor = _assertThisInitialized(_this);
    }

    return _this;
  } // 初始化数据


  _createClass(Editor, [{
    key: "parseData",
    value: function parseData(node, parent) {
      var _this2 = this;

      node.parent = parent;

      if (!node.shape) {
        node.shape = 'expand-node';
      }

      var result = getNodeModule(node.shape).create(node);

      if (result.children) {
        result.children.forEach(function (v) {
          return _this2.parseData(v, result.id);
        });
      }

      return result;
    }
  }, {
    key: "setCurrent",
    value: function setCurrent(id) {
      if (this.currentId === id) {
        return;
      }

      var autoPaint = this.get('autoPaint');
      this.setAutoPaint(false);

      if (this.currentId) {
        var oldItem = this.findById(this.currentId);

        if (oldItem) {
          this.setItemState(oldItem, 'selected', false);
        }
      }

      if (id) {
        var item = this.findById(id);

        if (item) {
          this.setItemState(item, 'selected', true);
        }
      }

      this.currentId = id;
      this.setAutoPaint(autoPaint);
      this.paint();
    }
  }, {
    key: "shouldAddChild",
    value: function shouldAddChild(data, parentData) {
      var parentModule = getNodeModule(parentData.shape);
      var dataModule = getNodeModule(data.shape);
      return parentModule.shouldAddChild(data) && dataModule.shouldBeAppend(parentData);
    }
  }, {
    key: "addChildWithValidate",
    value: function addChildWithValidate(data, parent) {
      var parentData = this.findDataById(parent);

      if (!this.shouldAddChild(data, parentData)) {
        return false;
      }

      if (!parentData.children) {
        parentData.children = [];
      }

      parentData.children.push(data);
      this.changeData();
      return true;
    }
  }, {
    key: "addNode",
    value: function addNode() {
      var shape = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'expand-node';

      if (this.currentId) {
        var data = getNodeModule(shape).create({
          parent: this.currentId
        });
        var success = this.addChildWithValidate(data, this.currentId);

        if (success) {
          this.setCurrent(data.id);
          this.editNode();
        }
      }
    }
  }, {
    key: "deleteNode",
    value: function deleteNode() {
      if (this.currentId) {
        var id = this.currentId;
        this.setCurrent(null);
        this.removeChild(id);
      }
    }
  }, {
    key: "updateNode",
    value: function updateNode(obj) {
      if (this.currentId) {
        var currentModel = this.findDataById(this.currentId);

        if (currentModel) {
          var oldWidth = currentModel.width;
          var oldHeight = currentModel.height;
          var newModel = getNodeModule(currentModel.shape).update(currentModel, obj);
          var width = newModel.width,
              height = newModel.height;

          if (width !== oldWidth || height !== oldHeight) {
            this.changeData();
          } else {
            this.update(this.currentId, newModel);
          }
        }
      }
    }
  }, {
    key: "editNode",
    value: function editNode(item) {
      item = item || this.findById(this.currentId);
      var model = item.getModel();

      var _this$getCanvasByPoin = this.getCanvasByPoint(model.x, model.y),
          x = _this$getCanvasByPoin.x,
          y = _this$getCanvasByPoin.y;

      var zoom = this.getZoom();
      this.emit('ed-text-edit', {
        x: x,
        y: y,
        zoom: zoom,
        width: model.width,
        height: model.height,
        key: 'label',
        value: model.label
      });
    }
  }, {
    key: "cloneNode",
    value: function cloneNode() {
      if (this.currentId) {
        this.clipboardId = this.currentId;
      }
    }
  }, {
    key: "pasteNode",
    value: function pasteNode() {
      if (this.currentId && this.clipboardId) {
        var currentModel = this.findDataById(this.clipboardId);

        if (currentModel) {
          var data = this._cloneNode(currentModel, this.currentId);

          this.addChildWithValidate(data, this.currentId);
        }
      }
    }
  }, {
    key: "_cloneNode",
    value: function _cloneNode(node, parent) {
      var _this3 = this;

      var result = _objectSpread({}, node, {
        id: guid(),
        parent: parent
      });

      if (Array.isArray(result.children)) {
        result.children = result.children.map(function (v) {
          return _this3._cloneNode(v, result.id);
        });
      }

      return result;
    }
  }, {
    key: "_bindForceEvent",
    value: function _bindForceEvent() {
      var _this4 = this;

      var timer;

      var windowForceResizeEvent = function windowForceResizeEvent() {
        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(function () {
          _this4.forceFit();
        }, 200);
      };

      return G6.Util.addEventListener(window, 'resize', windowForceResizeEvent);
    }
  }, {
    key: "forceFit",
    value: function forceFit() {
      var container = this.get('container');
      var width = container.offsetWidth;
      var height = container.offsetHeight;
      this.changeSize(width, height);
    }
  }, {
    key: "moveToCenter",
    value: function moveToCenter() {
      var tree = this;
      var width = tree.get('width');
      var height = tree.get('height');
      var viewCenter = {
        x: width / 2,
        y: height / 2
      };
      var group = tree.get('group');
      group.resetMatrix();
      var bbox = group.getBBox();
      var groupCenter = {
        x: bbox.x + bbox.width / 2,
        y: bbox.y + bbox.height / 2
      };
      tree.translate(viewCenter.x - groupCenter.x, viewCenter.y - groupCenter.y);
    }
  }]);

  return Editor;
}(G6.TreeGraph);

var Provider = EditorContext.Provider;
function TreeEditor() {
    var containerRef = React.useRef(null);
    var _a = React.useState(null), editor = _a[0], setEditor = _a[1];
    React.useEffect(function () {
        var ed = new Editor({ container: containerRef.current });
        setEditor(ed);
        return function () {
            ed.destroy();
        };
    }, []);
    return (React__default.createElement("div", { ref: containerRef, style: {
            position: 'relative',
            height: '100%',
            width: '100%',
            overflow: 'hidden'
        } },
        React__default.createElement(Provider, { value: editor }, editor && (React__default.createElement(React__default.Fragment, null,
            React__default.createElement(ContextMenu, null),
            React__default.createElement(EditorInput, null))))));
}

exports.EditorContext = EditorContext;
exports.ContextMenu = ContextMenu;
exports.EditorInput = EditorInput;
exports.Editor = Editor;
exports.default = TreeEditor;
//# sourceMappingURL=index.js.map
