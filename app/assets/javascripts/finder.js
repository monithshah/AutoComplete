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


var EditorConfig = bkClass.extend({});
var Editors = {
  editors: [],
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
    var A = [];
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
  Command: function (B, A) {
    if (this.selectedInstance) {
      this.selectedInstance.Command(B, A)
    }
  },
  getIcon: function (D, A) {
    var C = [];
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
        border: "1px solid black",
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
    fullPanel: false
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

  xhttp.open("GET", "http://localhost:8090/processWordJSON?inString=" + words + "&lang=eng", true);
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
    hw[j] = inputJson['inString'];
    hindiWords = Array.from(new Set(hw));
}


function hideMenuList() {
  for (var i = 0; i < hindiWords.length; i++) hindiWords[i] = " ";
  words = "";
  menuList.style.display = "none";
  isMenuShowing = false;

}


function updateWords(e) {
  words = words + String.fromCharCode(e.which);
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