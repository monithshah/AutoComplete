$( document ).ready(function() {

var bkExtend = function () {
  var A = arguments;
  if (A.length == 1) {
    A = [this, A[0]]
  }
  for (var B in A[1]) {
    A[0][B] = A[1][B]
  }
  return A[0]
};

function bkClass() {}
bkClass.prototype.construct = function () {};
bkClass.extend = function (C) {
  var A = function () {
    if (arguments[0] !== bkClass) {
      return this.construct.apply(this, arguments)
    }
  };
  var B = new this(bkClass);
  bkExtend(B, C);
  A.prototype = B;
  A.extend = this.extend;
  return A
};
var bkElement = bkClass.extend({
  construct: function (B, A) {
    if (typeof (B) == "string") {
      B = (A || document).createElement(B)
    }
    B = $BK(B);
    return B
  },
  appendTo: function (A) {
    A.appendChild(this);
    return this
  },
  appendBefore: function (A) {
    A.parentNode.insertBefore(this, A);
    return this
  },
  addEvent: function (B, A) {
    bkLib.addEvent(this, B, A);
    return this
  },
  setContent: function (A) {
    this.innerHTML = A;
    return this
  },
  pos: function () {
    var C = curtop = 0;
    var B = obj = this;
    if (obj.offsetParent) {
      do {
        C += obj.offsetLeft;
        curtop += obj.offsetTop
      } while (obj = obj.offsetParent)
    }
    var A = (!window.opera) ? parseInt(this.getStyle("border-width") || this.style.border) || 0 : 0;
    return [C + A, curtop + A + this.offsetHeight]
  },
  noSelect: function () {
    bkLib.noSelect(this);
    return this
  },
  parentTag: function (A) {
    var B = this;
    do {
      if (B && B.nodeName && B.nodeName.toUpperCase() == A) {
        return B
      }
      B = B.parentNode
    } while (B);
    return false
  },
  hasClass: function (A) {
    return this.className.match(new RegExp("(\\s|^)Edit-" + A + "(\\s|$)"))
  },
  addClass: function (A) {
    if (!this.hasClass(A)) {
      this.className += " Edit-" + A
    }
    return this
  },
  removeClass: function (A) {
    if (this.hasClass(A)) {
      this.className = this.className.replace(new RegExp("(\\s|^)Edit-" + A + "(\\s|$)"), " ")
    }
    return this
  },
  setStyle: function (A) {
    var B = this.style;
    for (var C in A) {
      switch (C) {
        case "float":
          B.cssFloat = B.styleFloat = A[C];
          break;
        case "opacity":
          B.opacity = A[C];
          B.filter = "alpha(opacity=" + Math.round(A[C] * 100) + ")";
          break;
        case "className":
          this.className = A[C];
          break;
        default:
          B[C] = A[C]
      }
    }
    return this
  },
  getStyle: function (A, C) {
    var B = (!C) ? document.defaultView : C;
    if (this.nodeType == 1) {
      return (B && B.getComputedStyle) ? B.getComputedStyle(this, null).getPropertyValue(A) : this.currentStyle[bkLib.camelize(A)]
    }
  },
  remove: function () {
    this.parentNode.removeChild(this);
    return this
  },
  setAttributes: function (A) {
    for (var B in A) {
      this[B] = A[B]
    }
    return this
  }
});
var bkLib = {
  isMSIE: (navigator.appVersion.indexOf("MSIE") != -1),
  addEvent: function (C, B, A) {
    (C.addEventListener) ? C.addEventListener(B, A, false): C.attachEvent("on" + B, A)
  },
  toArray: function (C) {
    var B = C.length,
      A = new Array(B);
    while (B--) {
      A[B] = C[B]
    }
    return A
  },
  noSelect: function (B) {
    if (B.setAttribute && B.nodeName.toLowerCase() != "input" && B.nodeName.toLowerCase() != "textarea") {
      B.setAttribute("unselectable", "on")
    }
    for (var A = 0; A < B.childNodes.length; A++) {
      bkLib.noSelect(B.childNodes[A])
    }
  },
  camelize: function (A) {
    return A.replace(/\-(.)/g, function (B, C) {
      return C.toUpperCase()
    })
  },
  inArray: function (A, B) {
    return (bkLib.search(A, B) != null)
  },
  search: function (A, C) {
    for (var B = 0; B < A.length; B++) {
      if (A[B] == C) {
        return B
      }
    }
    return null
  },
  cancelEvent: function (A) {
    A = A || window.event;
    if (A.preventDefault && A.stopPropagation) {
      A.preventDefault();
      A.stopPropagation()
    }
    return false
  },
  domLoad: [],
  domLoaded: function () {
    if (arguments.callee.done) {
      return
    }
    arguments.callee.done = true;
    for (i = 0; i < bkLib.domLoad.length; i++) {
      bkLib.domLoad[i]()
    }
  },
  onDomLoaded: function (A) {
    this.domLoad.push(A);
    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", bkLib.domLoaded, null)
    } else {
      if (bkLib.isMSIE) {
        document.write("<style>.Edit-main p { margin: 0; }</style><script id=__ie_onload defer " + ((location.protocol == "https:") ? "src='javascript:void(0)'" : "src=//0") + "><\/script>");
        $BK("__ie_onload").onreadystatechange = function () {
          if (this.readyState == "complete") {
            bkLib.domLoaded()
          }
        }
      }
    }
    window.onload = bkLib.domLoaded
  }
};

function $BK(A) {
  if (typeof (A) == "string") {
    A = document.getElementById(A)
  }
  return (A && !A.appendTo) ? bkExtend(A, bkElement.prototype) : A
}
var bkEvent = {
  addEvent: function (A, B) {
    if (B) {
      this.eventList = this.eventList || {};
      this.eventList[A] = this.eventList[A] || [];
      this.eventList[A].push(B)
    }
    return this
  },
  fireEvent: function () {
    var A = bkLib.toArray(arguments),
      C = A.shift();
    if (this.eventList && this.eventList[C]) {
      for (var B = 0; B < this.eventList[C].length; B++) {
        this.eventList[C][B].apply(this, A)
      }
    }
  }
};

function __(A) {
  return A
}
Function.prototype.closure = function () {
  var A = this,
    B = bkLib.toArray(arguments),
    C = B.shift();
  return function () {
    if (typeof (bkLib) != "undefined") {
      return A.apply(C, B.concat(bkLib.toArray(arguments)))
    }
  }
};
Function.prototype.closureListener = function () {
  var A = this,
    C = bkLib.toArray(arguments),
    B = C.shift();
  return function (E) {
    E = E || window.event;
    if (E.target) {
      var D = E.target
    } else {
      var D = E.srcElement
    }
    return A.apply(B, [E, D].concat(C))
  }
};


var EditorConfig = bkClass.extend({
  buttons: {
    'bold': {
      name: __('Click to Bold'),
      command: 'Bold',
      tags: ['B', 'STRONG'],
      css: {
        'font-weight': 'bold'
      },
      key: 'b'
    },
    'italic': {
      name: __('Click to Italic'),
      command: 'Italic',
      tags: ['EM', 'I'],
      css: {
        'font-style': 'italic'
      },
      key: 'i'
    },
    'underline': {
      name: __('Click to Underline'),
      command: 'Underline',
      tags: ['U'],
      css: {
        'text-decoration': 'underline'
      },
      key: 'u'
    },
    'left': {
      name: __('Left Align'),
      command: 'justifyleft',
      noActive: true
    },
    'center': {
      name: __('Center Align'),
      command: 'justifycenter',
      noActive: true
    },
    'right': {
      name: __('Right Align'),
      command: 'justifyright',
      noActive: true
    },
    'justify': {
      name: __('Justify Align'),
      command: 'justifyfull',
      noActive: true
    },
    'ol': {
      name: __('Insert Ordered List'),
      command: 'insertorderedlist',
      tags: ['OL']
    },
    'ul': {
      name: __('Insert Unordered List'),
      command: 'insertunorderedlist',
      tags: ['UL']
    },
    'subscript': {
      name: __('Click to Subscript'),
      command: 'subscript',
      tags: ['SUB']
    },
    'superscript': {
      name: __('Click to Superscript'),
      command: 'superscript',
      tags: ['SUP']
    },
    'strikethrough': {
      name: __('Click to Strike Through'),
      command: 'strikeThrough',
      css: {
        'text-decoration': 'line-through'
      }
    },
    'removeformat': {
      name: __('Remove Formatting'),
      command: 'removeformat',
      noActive: true
    },
    'indent': {
      name: __('Indent Text'),
      command: 'indent',
      noActive: true
    },
    'outdent': {
      name: __('Remove Indent'),
      command: 'outdent',
      noActive: true
    },
    'hr': {
      name: __('Horizontal Rule'),
      command: 'insertHorizontalRule',
      noActive: true
    }
  },
  iconsPath: 'https://1.bp.blogspot.com/-wECN7ZWVPhc/W6Szrfdt7_I/AAAAAAAAAAw/DWPfx01aOX02CANQensyoe1pDBvFKqKDQCLcBGAs/s1600/EditorIcons.gif',
  buttonList: ['save', 'bold', 'italic', 'underline', 'left', 'center', 'right', 'justify', 'ol', 'ul', 'fontSize', 'fontFamily', 'fontFormat', 'indent', 'outdent', 'image', 'upload', 'link', 'unlink', 'forecolor', 'bgcolor'],
  iconList: {
    "bgcolor": 1,
    "forecolor": 2,
    "bold": 3,
    "center": 4,
    "hr": 5,
    "indent": 6,
    "italic": 7,
    "justify": 8,
    "left": 9,
    "ol": 10,
    "outdent": 11,
    "removeformat": 12,
    "right": 13,
    "save": 24,
    "strikethrough": 15,
    "subscript": 16,
    "superscript": 17,
    "ul": 18,
    "underline": 19,
    "image": 20,
    "link": 21,
    "unlink": 22,
    "close": 23,
    "arrow": 25
  }

});;
var Editors = {
  Plugins: [],
  editors: [],
  registerPlugin: function (B, A) {
    this.Plugins.push({
      p: B,
      o: A
    })
  },
  allTextAreas: function (C) {
    var A = document.getElementsByTagName("textarea");
    for (var B = 0; B < A.length; B++) {
      Editors.editors.push(new Editor(C).panelInstance(A[B]))
    }
    return Editors.editors
  },
  findEditor: function (C) {
    var B = Editors.editors;
    for (var A = 0; A < B.length; A++) {
      if (B[A].instanceById(C)) {
        return B[A].instanceById(C)
      }
    }
  }
};
var Editor = bkClass.extend({
  construct: function (C) {
    this.options = new EditorConfig();
    bkExtend(this.options, C);
    this.Instances = new Array();
    this.loadedPlugins = new Array();
    var A = Editors.Plugins;
    for (var B = 0; B < A.length; B++) {
      this.loadedPlugins.push(new A[B].p(this, A[B].o))
    }
    Editors.editors.push(this);
    bkLib.addEvent(document.body, "mousedown", this.selectCheck.closureListener(this))
  },
  panelInstance: function (B, C) {
    B = this.checkReplace($BK(B));
    var A = new bkElement("DIV").setStyle({
      width: (parseInt(B.getStyle("width")) || B.clientWidth) + "px"
    }).appendBefore(B);
    this.setPanel(A);
    return this.addInstance(B, C)
  },
  checkReplace: function (B) {
    var A = Editors.findEditor(B);
    if (A) {
      A.removeInstance(B);
      A.removePanel()
    }
    return B
  },
  addInstance: function (B, C) {
    B = this.checkReplace($BK(B));
    if (B.contentEditable || !!window.opera) {
      var A = new EditorInstance(B, C, this)
    } else {
      var A = new EditorIFrameInstance(B, C, this)
    }
    this.Instances.push(A);
    return this
  },
  removeInstance: function (C) {
    C = $BK(C);
    var B = this.Instances;
    for (var A = 0; A < B.length; A++) {
      if (B[A].e == C) {
        B[A].remove();
        this.Instances.splice(A, 1)
      }
    }
  },
  removePanel: function (A) {
    if (this.Panel) {
      this.Panel.remove();
      this.Panel = null
    }
  },
  instanceById: function (C) {
    C = $BK(C);
    var B = this.Instances;
    for (var A = 0; A < B.length; A++) {
      if (B[A].e == C) {
        return B[A]
      }
    }
  },
  setPanel: function (A) {
    this.Panel = new EditorPanel($BK(A), this.options, this);
    this.fireEvent("panel", this.Panel);
    return this
  },
  Command: function (B, A) {
    if (this.selectedInstance) {
      this.selectedInstance.Command(B, A)
    }
  },
  getIcon: function (D, A) {
    var C = this.options.iconList[D];
    var B = (A.iconFiles) ? A.iconFiles[D] : "";
    return {
      backgroundImage: "url('" + ((C) ? this.options.iconsPath : B) + "')",
      backgroundPosition: ((C) ? ((C - 1) * -18) : 0) + "px 0px"
    }
  },
  selectCheck: function (C, A) {
    var B = false;
    do {
      if (A.className && A.className.indexOf("Edit") != -1) {
        return false
      }
    } while (A = A.parentNode);
    this.fireEvent("blur", this.selectedInstance, A);
    this.lastSelectedInstance = this.selectedInstance;
    this.selectedInstance = null;
    return false
  }
});
Editor = Editor.extend(bkEvent);
var EditorInstance = bkClass.extend({
  isSelected: false,
  construct: function (G, D, C) {
    this.ne = C;
    this.elm = this.e = G;
    this.options = D || {};
    newX = parseInt(G.getStyle("width")) || G.clientWidth;
    newY = parseInt(G.getStyle("height")) || G.clientHeight;
    this.initialHeight = newY - 8;
    var H = (G.nodeName.toLowerCase() == "textarea");
    if (H || this.options.hasPanel) {
      var B = (bkLib.isMSIE && !((typeof document.body.style.maxHeight != "undefined") && document.compatMode == "CSS1Compat"));
      var E = {
        width: newX + "px",
        border: "1px solid rgba(44,141,167,1)",
        borderTop: 0,
        overflowY: "auto",
        overflowX: "hidden"
      };
      E[(B) ? "height" : "maxHeight"] = (this.ne.options.maxHeight) ? this.ne.options.maxHeight + "px" : null;
      this.editorContain = new bkElement("DIV").setStyle(E).appendBefore(G);
      var A = new bkElement("DIV").setStyle({
        width: (newX - 8) + "px",
        margin: "4px",
        minHeight: newY + "px"
      }).addClass("main").appendTo(this.editorContain);
      G.setStyle({
        display: "none"
      });
      A.innerHTML = G.innerHTML;
      if (H) {
        A.setContent(G.value);
        this.copyElm = G;
        var F = G.parentTag("FORM");
        if (F) {
          bkLib.addEvent(F, "submit", this.saveContent.closure(this))
        }
      }
      A.setStyle((B) ? {
        height: newY + "px"
      } : {
        overflow: "hidden"
      });
      this.elm = A
    }
    this.ne.addEvent("blur", this.blur.closure(this));
    this.init();
    this.blur()
  },
  init: function () {
    this.elm.setAttribute("contentEditable", "true");
    if (this.getContent() == "") {
      this.setContent("<br />")
    }
    this.instanceDoc = document.defaultView;
    this.elm.addEvent("mousedown", this.selected.closureListener(this)).addEvent("keypress", this.keyDown.closureListener(this)).addEvent("focus", this.selected.closure(this)).addEvent("blur", this.blur.closure(this)).addEvent("keyup", this.selected.closure(this));
    this.ne.fireEvent("add", this)
  },
  remove: function () {
    this.saveContent();
    if (this.copyElm || this.options.hasPanel) {
      this.editorContain.remove();
      this.e.setStyle({
        display: "block"
      });
      this.ne.removePanel()
    }
    this.disable();
    this.ne.fireEvent("remove", this)
  },
  disable: function () {
    this.elm.setAttribute("contentEditable", "false")
  },
  getSel: function () {
    return (window.getSelection) ? window.getSelection() : document.selection
  },
  getRng: function () {
    var A = this.getSel();
    if (!A || A.rangeCount === 0) {
      return
    }
    return (A.rangeCount > 0) ? A.getRangeAt(0) : A.createRange()
  },
  selRng: function (A, B) {
    if (window.getSelection) {
      B.removeAllRanges();
      B.addRange(A)
    } else {
      A.select()
    }
  },
  selElm: function () {
    var C = this.getRng();
    if (!C) {
      return
    }
    if (C.startContainer) {
      var D = C.startContainer;
      if (C.cloneContents().childNodes.length == 1) {
        for (var B = 0; B < D.childNodes.length; B++) {
          var A = D.childNodes[B].ownerDocument.createRange();
          A.selectNode(D.childNodes[B]);
          if (C.compareBoundaryPoints(Range.START_TO_START, A) != 1 && C.compareBoundaryPoints(Range.END_TO_END, A) != -1) {
            return $BK(D.childNodes[B])
          }
        }
      }
      return $BK(D)
    } else {
      return $BK((this.getSel().type == "Control") ? C.item(0) : C.parentElement())
    }
  },
  saveRng: function () {
    this.savedRange = this.getRng();
    this.savedSel = this.getSel()
  },
  restoreRng: function () {
    if (this.savedRange) {
      this.selRng(this.savedRange, this.savedSel)
    }
  },
  keyDown: function (B, A) {
    if (B.ctrlKey) {
      this.ne.fireEvent("key", this, B)
    }
  },
  selected: function (C, A) {
    if (!A && !(A = this.selElm)) {
      A = this.selElm()
    }
    if (!C.ctrlKey) {
      var B = this.ne.selectedInstance;
      if (B != this) {
        if (B) {
          this.ne.fireEvent("blur", B, A)
        }
        this.ne.selectedInstance = this;
        this.ne.fireEvent("focus", B, A)
      }
      this.ne.fireEvent("selected", B, A);
      this.isFocused = true;
      this.elm.addClass("selected")
    }
    return false
  },
  blur: function () {
    this.isFocused = false;
    this.elm.removeClass("selected")
  },
  saveContent: function () {
    if (this.copyElm || this.options.hasPanel) {
      this.ne.fireEvent("save", this);
      (this.copyElm) ? this.copyElm.value = this.getContent(): this.e.innerHTML = this.getContent()
    }
  },
  getElm: function () {
    return this.elm
  },
  getContent: function () {
    this.content = this.getElm().innerHTML;
    this.ne.fireEvent("get", this);
    return this.content
  },
  setContent: function (A) {
    this.content = A;
    this.ne.fireEvent("set", this);
    this.elm.innerHTML = this.content
  },
  Command: function (B, A) {
    document.execCommand(B, false, A)
  }
});
var EditorIFrameInstance = EditorInstance.extend({
  savedStyles: [],
  init: function () {
    var B = this.elm.innerHTML.replace(/^\s+|\s+$/g, "");
    this.elm.innerHTML = "";
    (!B) ? B = "<br />": B;
    this.initialContent = B;
    this.elmFrame = new bkElement("iframe").setAttributes({
      src: "javascript:;",
      frameBorder: 0,
      allowTransparency: "true",
      scrolling: "no"
    }).setStyle({
      height: "100px",
      width: "100%"
    }).addClass("frame").appendTo(this.elm);
    if (this.copyElm) {
      this.elmFrame.setStyle({
        width: (this.elm.offsetWidth - 4) + "px"
      })
    }
    var A = ["font-size", "font-family", "font-weight", "color"];
    for (itm in A) {
      this.savedStyles[bkLib.camelize(itm)] = this.elm.getStyle(itm)
    }
    setTimeout(this.initFrame.closure(this), 50)
  },
  disable: function () {
    this.elm.innerHTML = this.getContent()
  },
  initFrame: function () {
    var B = $BK(this.elmFrame.contentWindow.document);
    B.designMode = "on";
    B.open();
    var A = this.ne.options.externalCSS;
    B.write("<html><head>" + ((A) ? '<link href="' + A + '" rel="stylesheet" type="text/css" />' : "") + '</head><body id="EditContent" style="margin: 0 !important; background-color: transparent !important;">' + this.initialContent + "</body></html>");
    B.close();
    this.frameDoc = B;
    this.frameWin = $BK(this.elmFrame.contentWindow);
    this.frameContent = $BK(this.frameWin.document.body).setStyle(this.savedStyles);
    this.instanceDoc = this.frameWin.document.defaultView;
    this.heightUpdate();
    this.frameDoc.addEvent("mousedown", this.selected.closureListener(this)).addEvent("keyup", this.heightUpdate.closureListener(this)).addEvent("keydown", this.keyDown.closureListener(this)).addEvent("keyup", this.selected.closure(this));
    this.ne.fireEvent("add", this)
  },
  getElm: function () {
    return this.frameContent
  },
  setContent: function (A) {
    this.content = A;
    this.ne.fireEvent("set", this);
    this.frameContent.innerHTML = this.content;
    this.heightUpdate()
  },
  getSel: function () {
    return (this.frameWin) ? this.frameWin.getSelection() : this.frameDoc.selection
  },
  heightUpdate: function () {
    this.elmFrame.style.height = Math.max(this.frameContent.offsetHeight, this.initialHeight) + "px"
  },
  Command: function (B, A) {
    this.frameDoc.execCommand(B, false, A);
    setTimeout(this.heightUpdate.closure(this), 100)
  }
});
var EditorPanel = bkClass.extend({
  construct: function (E, B, A) {
    this.elm = E;
    this.options = B;
    this.ne = A;
    this.panelButtons = new Array();
    this.buttonList = bkExtend([], this.ne.options.buttonList);
    this.panelContain = new bkElement("DIV").setStyle({
      overflow: "hidden",
      width: "100%",
      border: "1px solid rgba(44,141,167,1)",
      backgroundColor: "#efefef"
    }).addClass("panelContain");
    this.panelElm = new bkElement("DIV").setStyle({
      margin: "2px",
      marginTop: "0px",
      zoom: 1,
      overflow: "hidden"
    }).addClass("panel").appendTo(this.panelContain);
    this.panelContain.appendTo(E);
    var C = this.ne.options;
    var D = C.buttons;
    for (button in D) {
      this.addButton(button, C, true)
    }
    this.reorder();
    E.noSelect()
  },
  addButton: function (buttonName, options, noOrder) {
    var button = options.buttons[buttonName];
    var type = (button.type) ? eval("(typeof(" + button.type + ') == "undefined") ? null : ' + button.type + ";") : EditorButton;
    var hasButton = bkLib.inArray(this.buttonList, buttonName);
    if (type && (hasButton || this.ne.options.fullPanel)) {
      this.panelButtons.push(new type(this.panelElm, buttonName, options, this.ne));
      if (!hasButton) {
        this.buttonList.push(buttonName)
      }
    }
  },
  findButton: function (B) {
    for (var A = 0; A < this.panelButtons.length; A++) {
      if (this.panelButtons[A].name == B) {
        return this.panelButtons[A]
      }
    }
  },
  reorder: function () {
    var C = this.buttonList;
    for (var B = 0; B < C.length; B++) {
      var A = this.findButton(C[B]);
      if (A) {
        this.panelElm.appendChild(A.margin)
      }
    }
  },
  remove: function () {
    this.elm.remove()
  }
});
var EditorButton = bkClass.extend({
  construct: function (D, A, C, B) {
    this.options = C.buttons[A];
    this.name = A;
    this.ne = B;
    this.elm = D;
    this.margin = new bkElement("DIV").setStyle({
      "float": "left",
      marginTop: "2px"
    }).appendTo(D);
    this.contain = new bkElement("DIV").setStyle({
      width: "20px",
      height: "20px"
    }).addClass("buttonContain").appendTo(this.margin);
    this.border = new bkElement("DIV").setStyle({
      backgroundColor: "#efefef",
      border: "1px solid #efefef"
    }).appendTo(this.contain);
    this.button = new bkElement("DIV").setStyle({
      width: "18px",
      height: "18px",
      overflow: "hidden",
      zoom: 1,
      cursor: "pointer"
    }).addClass("button").setStyle(this.ne.getIcon(A, C)).appendTo(this.border);
    this.button.addEvent("mouseover", this.hoverOn.closure(this)).addEvent("mouseout", this.hoverOff.closure(this)).addEvent("mousedown", this.mouseClick.closure(this)).noSelect();
    if (!window.opera) {
      this.button.onmousedown = this.button.onclick = bkLib.cancelEvent
    }
    B.addEvent("selected", this.enable.closure(this)).addEvent("blur", this.disable.closure(this)).addEvent("key", this.key.closure(this));
    this.disable();
    this.init()
  },
  init: function () {},
  hide: function () {
    this.contain.setStyle({
      display: "none"
    })
  },
  updateState: function () {
    if (this.isDisabled) {
      this.setBg()
    } else {
      if (this.isHover) {
        this.setBg("hover")
      } else {
        if (this.isActive) {
          this.setBg("active")
        } else {
          this.setBg()
        }
      }
    }
  },
  setBg: function (A) {
    switch (A) {
      case "hover":
        var B = {
          border: "1px solid rgba(236,121,80,1)",
          backgroundColor: "#ddd"
        };
        break;
      case "active":
        var B = {
          border: "1px solid #666",
          backgroundColor: "#ccc"
        };
        break;
      default:
        var B = {
          border: "1px solid #efefef",
          backgroundColor: "#efefef"
        }
    }
    this.border.setStyle(B).addClass("button-" + A)
  },
  checkNodes: function (A) {
    var B = A;
    do {
      if (this.options.tags && bkLib.inArray(this.options.tags, B.nodeName)) {
        this.activate();
        return true
      }
    } while (B = B.parentNode && B.className != "Edit");
    B = $BK(A);
    while (B.nodeType == 3) {
      B = $BK(B.parentNode)
    }
    if (this.options.css) {
      for (itm in this.options.css) {
        if (B.getStyle(itm, this.ne.selectedInstance.instanceDoc) == this.options.css[itm]) {
          this.activate();
          return true
        }
      }
    }
    this.deactivate();
    return false
  },
  activate: function () {
    if (!this.isDisabled) {
      this.isActive = true;
      this.updateState();
      this.ne.fireEvent("buttonActivate", this)
    }
  },
  deactivate: function () {
    this.isActive = false;
    this.updateState();
    if (!this.isDisabled) {
      this.ne.fireEvent("buttonDeactivate", this)
    }
  },
  enable: function (A, B) {
    this.isDisabled = false;
    this.contain.setStyle({
      opacity: 1
    }).addClass("buttonEnabled");
    this.updateState();
    this.checkNodes(B)
  },
  disable: function (A, B) {
    this.isDisabled = true;
    this.contain.setStyle({
      opacity: 0.6
    }).removeClass("buttonEnabled");
    this.updateState()
  },
  toggleActive: function () {
    (this.isActive) ? this.deactivate(): this.activate()
  },
  hoverOn: function () {
    if (!this.isDisabled) {
      this.isHover = true;
      this.updateState();
      this.ne.fireEvent("buttonOver", this)
    }
  },
  hoverOff: function () {
    this.isHover = false;
    this.updateState();
    this.ne.fireEvent("buttonOut", this)
  },
  mouseClick: function () {
    if (this.options.command) {
      this.ne.Command(this.options.command, this.options.commandArgs);
      if (!this.options.noActive) {
        this.toggleActive()
      }
    }
    this.ne.fireEvent("buttonClick", this)
  },
  key: function (A, B) {
    if (this.options.key && B.ctrlKey && String.fromCharCode(B.keyCode || B.charCode).toLowerCase() == this.options.key) {
      this.mouseClick();
      if (B.preventDefault) {
        B.preventDefault()
      }
    }
  }
});
var Plugin = bkClass.extend({
  construct: function (B, A) {
    this.options = A;
    this.ne = B;
    this.ne.addEvent("panel", this.loadPanel.closure(this));
    this.init()
  },
  loadPanel: function (C) {
    var B = this.options.buttons;
    for (var A in B) {
      C.addButton(A, this.options)
    }
    C.reorder()
  },
  init: function () {}
});


var PaneOptions = {};

var EditorPane = bkClass.extend({
  construct: function (D, C, B, A) {
    this.ne = C;
    this.elm = D;
    this.pos = D.pos();
    this.contain = new bkElement("div").setStyle({
      boxShadow: " 3px 4px 6px rgba(0,0,0,0.2)",
      zIndex: "99999",
      overflow: "hidden",
      position: "absolute",
      left: this.pos[0] + "px",
      top: this.pos[1] + "px"
    });
    this.pane = new bkElement("div").setStyle({
      fontSize: "12px",
      border: "1px solid #ccc",
      overflow: "hidden",
      padding: "4px",
      textAlign: "left",
      backgroundColor: "#ffffc9"
    }).addClass("pane").setStyle(B).appendTo(this.contain);
    if (A && !A.options.noClose) {
      this.close = new bkElement("div").setStyle({
        "float": "right",
        height: "16px",
        width: "16px",
        cursor: "pointer"
      }).setStyle(this.ne.getIcon("close", PaneOptions)).addEvent("mousedown", A.removePane.closure(this)).appendTo(this.pane)
    }
    this.contain.noSelect().appendTo(document.body);
    this.position();
    this.init()
  },
  init: function () {},
  position: function () {
    if (this.ne.Panel) {
      var B = this.ne.Panel.elm;
      var A = B.pos();
      var C = A[0] + parseInt(B.getStyle("width")) - (parseInt(this.pane.getStyle("width")) + 8);
      if (C < this.pos[0]) {
        this.contain.setStyle({
          left: C + "px"
        })
      }
    }
  },
  toggle: function () {
    this.isVisible = !this.isVisible;
    this.contain.setStyle({
      display: ((this.isVisible) ? "block" : "none")
    })
  },
  remove: function () {
    if (this.contain) {
      this.contain.remove();
      this.contain = null
    }
  },
  append: function (A) {
    A.appendTo(this.pane)
  },
  setContent: function (A) {
    this.pane.setContent(A)
  }
});

var EditorAdvancedButton = EditorButton.extend({
  init: function () {
    this.ne.addEvent("selected", this.removePane.closure(this)).addEvent("blur", this.removePane.closure(this))
  },
  mouseClick: function () {
    if (!this.isDisabled) {
      if (this.pane && this.pane.pane) {
        this.removePane()
      } else {
        this.pane = new EditorPane(this.contain, this.ne, {
          width: (this.width || "270px"),
          backgroundColor: "#fff"
        }, this);
        this.addPane();
        this.ne.selectedInstance.saveRng()
      }
    }
  },
  addForm: function (C, G) {
    this.form = new bkElement("form").addEvent("submit", this.submit.closureListener(this));
    this.pane.append(this.form);
    this.inputs = {};
    for (itm in C) {
      var D = C[itm];
      var F = "";
      if (G) {
        F = G.getAttribute(itm)
      }
      if (!F) {
        F = D.value || ""
      }
      var A = C[itm].type;
      if (A == "title") {
        new bkElement("div").setContent(D.txt).setStyle({
          fontSize: "14px",
          fontWeight: "bold",
          padding: "0px",
          margin: "2px 0"
        }).appendTo(this.form)
      } else {
        var B = new bkElement("div").setStyle({
          overflow: "hidden",
          clear: "both"
        }).appendTo(this.form);
        if (D.txt) {
          new bkElement("label").setAttributes({
            "for": itm
          }).setContent(D.txt).setStyle({
            margin: "2px 4px",
            fontSize: "13px",
            width: "50px",
            lineHeight: "20px",
            textAlign: "right",
            "float": "left"
          }).appendTo(B)
        }
        switch (A) {
          case "text":
            this.inputs[itm] = new bkElement("input").setAttributes({
              id: itm,
              value: F,
              type: "text"
            }).setStyle({
              margin: "2px 0",
              fontSize: "13px",
              "float": "left",
              height: "20px",
              border: "1px solid #ccc",
              overflow: "hidden"
            }).setStyle(D.style).appendTo(B);
            break;
          case "select":
            this.inputs[itm] = new bkElement("select").setAttributes({
              id: itm
            }).setStyle({
              border: "1px solid #ccc",
              "float": "left",
              margin: "2px 0"
            }).appendTo(B);
            for (opt in D.options) {
              var E = new bkElement("option").setAttributes({
                value: opt,
                selected: (opt == F) ? "selected" : ""
              }).setContent(D.options[opt]).appendTo(this.inputs[itm])
            }
            break;
          case "content":
            this.inputs[itm] = new bkElement("textarea").setAttributes({
              id: itm
            }).setStyle({
              border: "1px solid #ccc",
              "float": "left"
            }).setStyle(D.style).appendTo(B);
            this.inputs[itm].value = F
        }
      }
    }
    new bkElement("input").setAttributes({
      type: "submit"
    }).setStyle({
      backgroundColor: "#efefef",
      border: "1px solid #ccc",
      margin: "3px 0",
      "float": "left",
      clear: "both"
    }).appendTo(this.form);
    this.form.onsubmit = bkLib.cancelEvent
  },
  submit: function () {},
  findElm: function (B, A, E) {
    var D = this.ne.selectedInstance.getElm().getElementsByTagName(B);
    for (var C = 0; C < D.length; C++) {
      if (D[C].getAttribute(A) == E) {
        return $BK(D[C])
      }
    }
  },
  removePane: function () {
    if (this.pane) {
      this.pane.remove();
      this.pane = null;
      this.ne.selectedInstance.restoreRng()
    }
  }
});

var ButtonTips = bkClass.extend({
  construct: function (A) {
    this.ne = A;
    A.addEvent("buttonOver", this.show.closure(this)).addEvent("buttonOut", this.hide.closure(this))
  },
  show: function (A) {
    this.timer = setTimeout(this.create.closure(this, A), 400)
  },
  create: function (A) {
    this.timer = null;
    if (!this.pane) {
      this.pane = new EditorPane(A.button, this.ne, {
        fontSize: "12px",
        marginTop: "5px"
      });
      this.pane.setContent(A.options.name)
    }
  },
  hide: function (A) {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    if (this.pane) {
      this.pane = this.pane.remove()
    }
  }
});
Editors.registerPlugin(ButtonTips);


var SelectOptions = {
  buttons: {
    'fontSize': {
      name: __('Select Font Size'),
      type: 'EditorFontSizeSelect',
      command: 'fontsize'
    },
    'fontFamily': {
      name: __('Select Font Family'),
      type: 'EditorFontFamilySelect',
      command: 'fontname'
    },
    'fontFormat': {
      name: __('Select Font Format'),
      type: 'EditorFontFormatSelect',
      command: 'formatBlock'
    }
  }
};

var EditorSelect = bkClass.extend({
  construct: function (D, A, C, B) {
    this.options = C.buttons[A];
    this.elm = D;
    this.ne = B;
    this.name = A;
    this.selOptions = new Array();
    this.margin = new bkElement("div").setStyle({
      "float": "left",
      margin: "2px 1px 0 1px"
    }).appendTo(this.elm);
    this.contain = new bkElement("div").setStyle({
      width: "90px",
      height: "20px",
      cursor: "pointer",
      overflow: "hidden"
    }).addClass("selectContain").addEvent("click", this.toggle.closure(this)).appendTo(this.margin);
    this.items = new bkElement("div").setStyle({
      overflow: "hidden",
      zoom: 1,
      border: "1px solid #ccc",
      paddingLeft: "3px",
      backgroundColor: "#fff"
    }).appendTo(this.contain);
    this.control = new bkElement("div").setStyle({
      overflow: "hidden",
      "float": "right",
      height: "18px",
      width: "16px"
    }).addClass("selectControl ").setStyle(this.ne.getIcon("arrow", C)).appendTo(this.items);
    this.txt = new bkElement("div").setStyle({
      overflow: "hidden",
      "float": "left",
      width: "66px",
      height: "14px",
      marginTop: "1px",
      fontFamily: "Times",
      textAlign: "center",
      fontSize: "12px"
    }).addClass("selectTxt").appendTo(this.items);
    if (!window.opera) {
      this.contain.onmousedown = this.control.onmousedown = this.txt.onmousedown = bkLib.cancelEvent
    }
    this.margin.noSelect();
    this.ne.addEvent("selected", this.enable.closure(this)).addEvent("blur", this.disable.closure(this));
    this.disable();
    this.init()
  },
  disable: function () {
    this.isDisabled = true;
    this.close();
    this.contain.setStyle({
      opacity: 0.6
    })
  },
  enable: function (A) {
    this.isDisabled = false;
    this.close();
    this.contain.setStyle({
      opacity: 1
    })
  },
  setDisplay: function (A) {
    this.txt.setContent(A)
  },
  toggle: function () {
    if (!this.isDisabled) {
      (this.pane) ? this.close(): this.open()
    }
  },
  open: function () {
    this.pane = new EditorPane(this.items, this.ne, {
      fontFamily: "monospace",
      textAlign: "center",
      width: "110px",
      padding: "0px",
      borderTop: 0,
      borderLeft: "1px solid #ccc",
      borderRight: "1px solid #5D5D5D",
      borderBottom: "1px solid #5D5D5D",
      backgroundColor: "#fff"
    });
    for (var C = 0; C < this.selOptions.length; C++) {
      var B = this.selOptions[C];
      var A = new bkElement("div").setStyle({
        overflow: "hidden",
        width: "110px",
        textAlign: "left",
        overflow: "hidden",
        cursor: "pointer"
      });
      var D = new bkElement("div").setStyle({
        padding: "0px 4px"
      }).setContent(B[1]).appendTo(A).noSelect();
      D.addEvent("click", this.update.closure(this, B[0])).addEvent("mouseover", this.over.closure(this, D)).addEvent("mouseout", this.out.closure(this, D)).setAttributes("id", B[0]);
      this.pane.append(A);
      if (!window.opera) {
        D.onmousedown = bkLib.cancelEvent
      }
    }
  },
  close: function () {
    if (this.pane) {
      this.pane = this.pane.remove()
    }
  },
  over: function (A) {
    A.setStyle({
      backgroundColor: "#2E76DB",
      color: "white"
    })
  },
  out: function (A) {
    A.setStyle({
      backgroundColor: "#fff",
      color: "#000"
    })
  },
  add: function (B, A) {
    this.selOptions.push(new Array(B, A))
  },
  update: function (A) {
    this.ne.Command(this.options.command, A);
    this.close()
  }
});
var EditorFontSizeSelect = EditorSelect.extend({
  sel: {
    1: "1(8pt)",
    2: "2(10pt)",
    3: "3(12pt)",
    4: "4(14pt)",
    5: "5(18pt)",
    6: "6(24pt)"
  },
  init: function () {
    this.setDisplay("Font&nbsp;Size");
    for (itm in this.sel) {
      this.add(itm, '<font size="' + itm + '">' + this.sel[itm] + "</font>")
    }
  }
});
var EditorFontFamilySelect = EditorSelect.extend({
  sel: {
    arial: "Arial",
    "comic sans ms": "Comic Sans",
    "courier new": "Courier New",
    georgia: "Georgia",
    helvetica: "Helvetica",
    impact: "Impact",
    "times new roman": "Times",
    "trebuchet ms": "Trebuchet",
    verdana: "Verdana"
  },
  init: function () {
    this.setDisplay("Font&nbsp;Family");
    for (itm in this.sel) {
      this.add(itm, '<font face="' + itm + '">' + this.sel[itm] + "</font>")
    }
  }
});
var EditorFontFormatSelect = EditorSelect.extend({
  sel: {
    pre: "Pre",
    p: "Paragraph",
    h6: "H6",
    h5: "H5",
    h4: "H4",
    h3: "H3",
    h2: "H2",
    h1: "H1"
  },
  init: function () {
    this.setDisplay("Font&nbsp;Format");
    for (itm in this.sel) {
      var A = itm.toUpperCase();
      this.add("<" + A + ">", "<" + itm + ' style="padding: 0px; font-family:monospace;  margin: 0px;">' + this.sel[itm] + "</" + A + ">")
    }
  }
});
Editors.registerPlugin(Plugin, SelectOptions);


var LinkOptions = {
  buttons: {
    'link': {
      name: 'Add Link',
      type: 'LinkButton',
      tags: ['A']
    },
    'unlink': {
      name: 'Remove Link',
      command: 'unlink',
      noActive: true
    }
  }
};

var LinkButton = EditorAdvancedButton.extend({
  addPane: function () {
    this.ln = this.ne.selectedInstance.selElm().parentTag("A");
    this.addForm({
      "": {
        type: "title",
        txt: "Add/Edit Link"
      },
      href: {
        type: "text",
        txt: "URL",
        value: "http://",
        style: {
          width: "150px"
        }
      },
      title: {
        type: "text",
        txt: "Title"
      },
      target: {
        type: "select",
        txt: "Open In",
        options: {
          "": "Current Window",
          _blank: "New Window"
        },
        style: {
          width: "100px"
        }
      }
    }, this.ln)
  },
  submit: function (C) {
    var A = this.inputs.href.value;
    if (A == "http://" || A == "") {
      alert("You must enter a URL to Create a Link");
      return false
    }
    this.removePane();
    if (!this.ln) {
      var B = "javascript:Temp();";
      this.ne.Command("createlink", B);
      this.ln = this.findElm("A", "href", B)
    }
    if (this.ln) {
      this.ln.setAttributes({
        href: this.inputs.href.value,
        title: this.inputs.title.value,
        target: this.inputs.target.options[this.inputs.target.selectedIndex].value
      })
    }
  }
});
Editors.registerPlugin(Plugin, LinkOptions);


var ColorOptions = {
  buttons: {
    'forecolor': {
      name: __('Change Text Color'),
      type: 'EditorColorButton',
      noClose: true
    },
    'bgcolor': {
      name: __('Change Background Color'),
      type: 'EditorBgColorButton',
      noClose: true
    }
  }
};

var EditorColorButton = EditorAdvancedButton.extend({
  addPane: function () {
    var D = {
      0: "00",
      1: "33",
      2: "66",
      3: "99",
      4: "CC",
      5: "FF"
    };
    var H = new bkElement("DIV").setStyle({
      width: "270px"
    });
    for (var A in D) {
      for (var F in D) {
        for (var E in D) {
          var I = "#" + D[A] + D[E] + D[F];
          var C = new bkElement("DIV").setStyle({
            cursor: "pointer",
            height: "15px",
            "float": "left"
          }).appendTo(H);
          var G = new bkElement("DIV").setStyle({
            border: "2px solid " + I
          }).appendTo(C);
          var B = new bkElement("DIV").setStyle({
            backgroundColor: I,
            overflow: "hidden",
            width: "11px",
            height: "11px"
          }).addEvent("click", this.colorSelect.closure(this, I)).addEvent("mouseover", this.on.closure(this, G)).addEvent("mouseout", this.off.closure(this, G, I)).appendTo(G);
          if (!window.opera) {
            C.onmousedown = B.onmousedown = bkLib.cancelEvent
          }
        }
      }
    }
    this.pane.append(H.noSelect())
  },
  colorSelect: function (A) {
    this.ne.Command("foreColor", A);
    this.removePane()
  },
  on: function (A) {
    A.setStyle({
      border: "2px solid #000"
    })
  },
  off: function (A, B) {
    A.setStyle({
      border: "2px solid " + B
    })
  }
});
var EditorBgColorButton = EditorColorButton.extend({
  colorSelect: function (A) {
    this.ne.Command("hiliteColor", A);
    this.removePane()
  }
});
Editors.registerPlugin(Plugin, ColorOptions);


var ImageOptions = {
  buttons: {
    'image': {
      name: 'Add Image',
      type: 'ImageButton',
      tags: ['IMG']
    }
  }

};

var ImageButton = EditorAdvancedButton.extend({
  addPane: function () {
    this.im = this.ne.selectedInstance.selElm().parentTag("IMG");
    this.addForm({
      "": {
        type: "title",
        txt: "Add/Edit Image"
      },
      src: {
        type: "text",
        txt: "URL",
        value: "http://",
        style: {
          width: "150px"
        }
      },
      alt: {
        type: "text",
        txt: "Alt Text",
        style: {
          width: "100px"
        }
      },
      align: {
        type: "select",
        txt: "Align",
        options: {
          none: "Default",
          left: "Left",
          right: "Right"
        }
      }
    }, this.im)
  },
  submit: function (B) {
    var C = this.inputs.src.value;
    if (C == "" || C == "http://") {
      alert("You must enter a Image URL to insert");
      return false
    }
    this.removePane();
    if (!this.im) {
      var A = "javascript:ImTemp();";
      this.ne.Command("insertImage", A);
      this.im = this.findElm("IMG", "src", A)
    }
    if (this.im) {
      this.im.setAttributes({
        src: this.inputs.src.value,
        alt: this.inputs.alt.value,
        align: this.inputs.align.value
      })
    }
  }
});
Editors.registerPlugin(Plugin, ImageOptions);


var SaveOptions = {
  buttons: {
    'save': {
      name: __('Save this content'),
      type: 'EditorSaveButton'
    }
  }
};

var EditorSaveButton = EditorButton.extend({
  init: function () {
    if (!this.ne.options.onSave) {
      this.margin.setStyle({
        display: "none"
      })
    }
  },
  mouseClick: function () {
    var B = this.ne.options.onSave;
    var A = this.ne.selectedInstance;
    B(A.getContent(), A.elm.id, A)
  }
});
Editors.registerPlugin(Plugin, SaveOptions);


// 11,13,9,7,5,3,1
var charData = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
var numbers = "0123456789"
var ff = "\\";
var currentSelection = 0;
var words = "";
var hindiWords = [];
var textEditor;
var mt = setInterval(displayWords, 100);
var isMenuShowing = false;
var idNo = 0;
var inputWord = document.getElementById('englishWord');
var menuList = document.getElementById('menu');
var cursorPosition = {
  x: 0,
  y: 0
}
menuList.addEventListener('mousedown', function (e) {
  e.preventDefault();

});

for (var i = 0; i < 10; i++) {
  document.getElementsByClassName('word-list')[i].addEventListener('mousedown', function (e) {
    e.preventDefault();
    insertData(this.textContent + " ");
  });

}

function displayWords() {
  var Wlist = document.getElementsByClassName('word-list');
  var wordslength = hindiWords.length;
  var listLength = Wlist.length;
  for (var i = 0; i<wordslength; i++) {
    Wlist[i].textContent = hindiWords[i];
    if(i!=currentSelection)
    Wlist[i].style.backgroundColor = "#EEEEEE"
    else Wlist[i].style.backgroundColor = " #3498db"
    Wlist[i].style.color = "#000000"
    Wlist[i].style.padding = "0px 5px";
  }
  while(listLength - wordslength > 0){
    Wlist[wordslength].textContent = "";
    wordslength++;
  }
}

bkLib.onDomLoaded(function () {
  new Editor({
    fullPanel: true
  }).panelInstance('area2');


  document.getElementsByClassName(' Edit-main')[0].setAttribute("id", "text1");
  textEditor = document.getElementById('text1');
  textEditor.style.padding = "0.5em";
  textEditor.style.fontFamily = "'Hind', sans-serif";

  textEditor.style.outline = "0";
  textEditor.addEventListener('keydown', function (e) {

    if (e.which == 40) {
      currentSelection++;
      currentSelection = (currentSelection > hindiWords.length-1)? hindiWords.length-1 : currentSelection;
      e.preventDefault();
    } else if (e.which == 38) {
      currentSelection--;
      if (currentSelection<0) currentSelection = 0;
      e.preventDefault();
    }


  });
  textEditor.addEventListener('keypress', function (e) {
    // displayWords();
    printData(e);
    updateList();
  });
});


function updateList() {
  if (words.length < 1) hideMenuList();
  inputWord.textContent = words;


}

function addCursorClass() {

  if (!isMenuShowing) {
    pasteHtmlAtCaret("<span id='_cursor_" + idNo + "'></span>");
    cursorPosition.y = document.getElementById('_cursor_' + idNo).offsetTop;
    cursorPosition.x = document.getElementById('_cursor_' + idNo).offsetLeft;
    menuList.style.left = cursorPosition.x + "px";
    menuList.style.top = cursorPosition.y + "px";
    menuList.style.display = "block";
    isMenuShowing = true;
    idNo++;

  }
}

function insertData(data){
  document.execCommand('inserttext', false, data);
  hideMenuList();
}

function printData(e) {


  if (e.which == 8) {

    if (words.length > 0) words = words.substring(0, words.length - 1);


    if (isMenuShowing) e.preventDefault();

  }
  else if (e.which == 13) {
        if (isMenuShowing) e.preventDefault();
        insertData(hindiWords[currentSelection])
      }

    else if(letters.indexOf(String.fromCharCode(e.which)) > -1) {
        e.preventDefault();
        updateWords(e);
        addCursorClass();
        currentSelection = 0;
      } else if(numbers.indexOf(String.fromCharCode(e.which)) > -1) {
        e.preventDefault();
        insertData(hindiWords[currentSelection]);
        words=String.fromCharCode(e.which);
        addCursorClass();
        currentSelection = 0;
      } else {
        if (hindiWords[currentSelection] != "" && hindiWords[currentSelection] != " " && hindiWords[currentSelection])
          insertData(hindiWords[currentSelection]);
        words = ""
        currentSelection = 0;
      }

 if (words == "" || words == " ")
  return;

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {

      getList(this);

    }
  };

  xhttp.open("GET", "http://localhost:8090/processWordJSON?inString=" + words + "&lang=hindi", true);
  xhttp.send();


  if (e.which == 32 && isMenuShowing) {
    insertData(hindiWords[currentSelection]);
    words = "";
  }
}

function getList(obj) {
    var hw = [];
    var inputJson = JSON.parse(obj.responseText);
    hw[0] = inputJson['itrans'];
    options = inputJson['twords'][0]['options'];
    var j = options.length <  8? options.length : 8;
    for (var i=0; i<j; i++)
        hw[i+1] = options[i];
    hw[j + 1] = inputJson['inString'];
    console.log(hw);
    hindiWords = Array.from(new Set(hw));
}


function hideMenuList() {
  for (var i = 0; i < hindiWords.length; i++) hindiWords[i] = " ";
  words = "";
  menuList.style.display = "none";
  isMenuShowing = false;

}


function updateWords(e) {
  console.log(e.key);
  words = words + String.fromCharCode(e.which);
  console.log(words);
}


function pasteHtmlAtCaret(html) {
  var sel, range;
  if (window.getSelection) {
    // IE9 and non-IE
    sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();

      // Range.createContextualFragment() would be useful here but is
      // non-standard and not supported in all browsers (IE9, for one)
      var el = document.createElement("div");
      el.innerHTML = html;
      var frag = document.createDocumentFragment(),
        node, lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);

      // Preserve the selection
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  } else if (document.selection && document.selection.type != "Control") {
    // IE < 9
    document.selection.createRange().pasteHTML(html);
  }
}

});