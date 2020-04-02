<template>
  <div style="height:100vh;background:#E1E6ED;padding:20px">
    <div
      class="calc_container"
      :style="{'background':bgColor,'color':txtColor,'width':width,'height':height}"
    >
      <div class="calc">
        <div class="calcIpt">
          <input type="text" v-model="result" v-strFilter id="calc_ipt" />
        </div>
        <div>
          <table>
            <tr>
              <td>
                <button @click="reset">C</button>
              </td>
              <td>
                <button @click="back">&lt;</button>
              </td>
              <td>
                <button @click="insert('/')">/</button>
              </td>
              <td>
                <button @click="insert('×')">×</button>
              </td>
            </tr>
            <tr>
              <td>
                <button @click="insert(7)">7</button>
              </td>
              <td>
                <button @click="insert(8)">8</button>
              </td>
              <td>
                <button @click="insert(9)">9</button>
              </td>
              <td>
                <button @click="insert('-')">-</button>
              </td>
            </tr>
            <tr>
              <td>
                <button @click="insert(4)">4</button>
              </td>
              <td>
                <button @click="insert(5)">5</button>
              </td>
              <td>
                <button @click="insert(6)">6</button>
              </td>
              <td>
                <button @click="insert('+')">+</button>
              </td>
            </tr>
            <tr>
              <td>
                <button @click="insert(1)">1</button>
              </td>
              <td>
                <button @click="insert(2)">2</button>
              </td>
              <td>
                <button @click="insert(3)">3</button>
              </td>
              <td rowspan="2">
                <button style="height:106px" @click="calc">=</button>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <button style="width:106px" @click="insert(0)">0</button>
              </td>
              <td>
                <button @click="insert('.')">.</button>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Calculator",
  props: {
    bgColor: {
      type: String,
      default: "#E1E6ED"
    },
    txtColor: {
      type: String,
      default: "lightcoral"
    },
    width: {
      type: String,
      default: "280px"
    },
    height: {
      type: String,
      default: "380px"
    }
  },
  data() {
    return {
      result: "",
      focusEle: "",
      ipt: null,
      flag: false
    };
  },
  mounted() {
    this.ipt = document.getElementById("calc_ipt");
  },
  computed: {
    curPos() {
      return this.getCursortPosition(this.ipt);
    }
  },
  methods: {
    reset() {
      this.result = "";
      this.ipt.focus();
    },
    back() {
      let str = String(this.result)
      this.result =str .substring(0, str.length - 1);
    },
    insert(num) {
      this.result = String(this.result) + num;
    },
    calc() {
      this.result = eval(this.result.replace('×','*'));
    },

    // 设置光标位置
    setCaretPosition(textDom, pos) {
      if (textDom.setSelectionRange) {
        // IE Support
        textDom.focus();
        textDom.setSelectionRange(pos, pos);
      } else if (textDom.createTextRange) {
        // Firefox support
        var range = textDom.createTextRange();
        range.collapse(true);
        range.moveEnd("character", pos);
        range.moveStart("character", pos);
        range.select();
      }
    },

    // 获取光标位置
    getCursortPosition(textDom) {
      var cursorPos = 0;
      if (document.selection) {
        // IE Support
        textDom.focus();
        var selectRange = document.selection.createRange();
        selectRange.moveStart("character", -textDom.value.length);
        cursorPos = selectRange.text.length;
      } else if (textDom.selectionStart || textDom.selectionStart == "0") {
        // Firefox support
        cursorPos = textDom.selectionStart;
      }
      return cursorPos;
    },
    /**
     * 在光标后插入文本
     * 参数：
     *     textDom  [JavaScript DOM String] 当前对象
     *     value  [String]  要插入的文本
     */
    insertAfterText(textDom, value) {
      var selectRange;
      if (document.selection) {
        // IE Support
        textDom.focus();
        selectRange = document.selection.createRange();
        selectRange.text = value;
        textDom.focus();
      } else if (textDom.selectionStart || textDom.selectionStart == "0") {
        // Firefox support
        var startPos = textDom.selectionStart;
        var endPos = textDom.selectionEnd;
        var scrollTop = textDom.scrollTop;
        textDom.value =
          textDom.value.substring(0, startPos) +
          value +
          textDom.value.substring(endPos, textDom.value.length);
        textDom.focus();
        textDom.selectionStart = startPos + value.length;
        textDom.selectionEnd = startPos + value.length;
        textDom.scrollTop = scrollTop;
      } else {
        textDom.value += value;
        textDom.focus();
      }
    },

    /**
     * 选中特定范围的文本
     * 参数：
     *     textDom  [JavaScript DOM String] 当前对象
     *     startPos  [Int]  起始位置
     *     endPos  [Int]  终点位置
     */
    setSelectText(textDom, startPos, endPos) {
      var startPos = parseInt(startPos),
        endPos = parseInt(endPos),
        textLength = textDom.value.length;
      if (textLength) {
        if (!startPos) {
          startPos = 0;
        }
        if (!endPos) {
          endPos = textLength;
        }
        if (startPos > textLength) {
          startPos = textLength;
        }
        if (endPos > textLength) {
          endPos = textLength;
        }
        if (startPos < 0) {
          startPos = textLength + startPos;
        }
        if (endPos < 0) {
          endPos = textLength + endPos;
        }
        if (textDom.createTextRange) {
          // IE Support
          var range = textDom.createTextRange();
          range.moveStart("character", -textLength);
          range.moveEnd("character", -textLength);
          range.moveStart("character", startPos);
          range.moveEnd("character", endPos);
          range.select();
        } else {
          // Firefox support
          textDom.setSelectionRange(startPos, endPos);
          textDom.focus();
        }
      }
    },

    // 获取选中文字
    getSelectText() {
      var userSelection, text;
      if (window.getSelection) {
        // Firefox support
        userSelection = window.getSelection();
      } else if (document.selection) {
        // IE Support
        userSelection = document.selection.createRange();
      }
      if (!(text = userSelection.text)) {
        text = userSelection;
      }
      return text;
    }
  },
  directives: {
    strFilter: {
      inserted: function(el) {
        el.addEventListener("keypress", function(e) {
          e = e || window.event;
          let charcode = typeof e.charCode == "number" ? e.charCode : e.keyCode;
          let re = /\d/;
          if (
            !re.test(String.fromCharCode(charcode)) &&
            charcode > 9 &&
            !e.ctrlKey
          ) {
            if (e.preventDefault) {
              e.preventDefault();
            } else {
              e.returnValue = false;
            }
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.calc_container {
  margin: 0 auto;
  position: relative;
  box-shadow: 9px 9px 16px rgb(163, 177, 198, 0.6),
    -9px -9px 16px rgba(255, 255, 255, 0.5);
}

.calc {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.calc .calcIpt {
  height: 36px;
  margin-bottom: 8px;
  padding: 0 4px;
  background-color: #e1e6ed;
}

.calc table td {
  margin: 5px;
}

.calc .calcIpt input[type="text"] {
  width: 100%;
  height: 100%;
  padding-left: 5px;
  border-radius: 8px;
  border: none;
  outline: none;
  color: crimson;
  font-size: 20px;
  background-color: #e1e6ed;
  box-shadow: inset 2px 2px 8px rgb(163, 177, 198, 0.6),
    -2px -2px 8px rgba(255, 255, 255, 0.5);
}

.calc_container .calc button {
  width: 50px;
  height: 50px;
  border-radius: 50px;
  outline: none;
  border: none;
  cursor: pointer;
  font-size: 25px;
  color: lightcoral;
  box-shadow: 9px 9px 16px rgb(163, 177, 198, 0.6),
    -9px -9px 16px rgba(255, 255, 255, 0.5);
}

.calc_container .calc button:active {
  box-shadow: inset 9px 9px 16px rgb(163, 177, 198, 0.6),
    inset -9px -9px 16px rgba(255, 255, 255, 0.5);
}
</style>
