<<<<<<< HEAD
/*

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

// lib/handlebars/base.js

/*jshint eqnull:true*/
this.Handlebars = {};

(function(Handlebars) {

Handlebars.VERSION = "1.0.0-rc.3";
Handlebars.COMPILER_REVISION = 2;

Handlebars.REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '>= 1.0.0-rc.3'
};

Handlebars.helpers  = {};
Handlebars.partials = {};

Handlebars.registerHelper = function(name, fn, inverse) {
  if(inverse) { fn.not = inverse; }
  this.helpers[name] = fn;
};

Handlebars.registerPartial = function(name, str) {
  this.partials[name] = str;
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Could not find property '" + arg + "'");
  }
});

var toString = Object.prototype.toString, functionType = "[object Function]";

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;


  var ret = "";
  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      return Handlebars.helpers.each(context, options);
    } else {
      return inverse(this);
    }
  } else {
    return fn(context);
  }
});

Handlebars.K = function() {};

Handlebars.createFrame = Object.create || function(object) {
  Handlebars.K.prototype = object;
  var obj = new Handlebars.K();
  Handlebars.K.prototype = null;
  return obj;
};

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  methodMap: {0: 'debug', 1: 'info', 2: 'warn', 3: 'error'},

  // can be overridden in the host environment
  log: function(level, obj) {
    if (Handlebars.logger.level <= level) {
      var method = Handlebars.logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};

Handlebars.log = function(level, obj) { Handlebars.logger.log(level, obj); };

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var i = 0, ret = "", data;

  if (options.data) {
    data = Handlebars.createFrame(options.data);
  }

  if(context && typeof context === 'object') {
    if(context instanceof Array){
      for(var j = context.length; i<j; i++) {
        if (data) { data.index = i; }
        ret = ret + fn(context[i], { data: data });
      }
    } else {
      for(var key in context) {
        if(context.hasOwnProperty(key)) {
          if(data) { data.key = key; }
          ret = ret + fn(context[key], {data: data});
          i++;
        }
      }
    }
  }

  if(i === 0){
    ret = inverse(this);
  }

  return ret;
});

Handlebars.registerHelper('if', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if(!context || Handlebars.Utils.isEmpty(context)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  options.fn = inverse;
  options.inverse = fn;

  return Handlebars.helpers['if'].call(this, context, options);
});

Handlebars.registerHelper('with', function(context, options) {
  return options.fn(context);
});

Handlebars.registerHelper('log', function(context, options) {
  var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
  Handlebars.log(level, context);
});

}(this.Handlebars));
;
// lib/handlebars/compiler/parser.js
/* Jison generated parser */
var handlebars = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"program":4,"EOF":5,"simpleInverse":6,"statements":7,"statement":8,"openInverse":9,"closeBlock":10,"openBlock":11,"mustache":12,"partial":13,"CONTENT":14,"COMMENT":15,"OPEN_BLOCK":16,"inMustache":17,"CLOSE":18,"OPEN_INVERSE":19,"OPEN_ENDBLOCK":20,"path":21,"OPEN":22,"OPEN_UNESCAPED":23,"OPEN_PARTIAL":24,"partialName":25,"params":26,"hash":27,"DATA":28,"param":29,"STRING":30,"INTEGER":31,"BOOLEAN":32,"hashSegments":33,"hashSegment":34,"ID":35,"EQUALS":36,"PARTIAL_NAME":37,"pathSegments":38,"SEP":39,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"OPEN_PARTIAL",28:"DATA",30:"STRING",31:"INTEGER",32:"BOOLEAN",35:"ID",36:"EQUALS",37:"PARTIAL_NAME",39:"SEP"},
productions_: [0,[3,2],[4,2],[4,3],[4,2],[4,1],[4,1],[4,0],[7,1],[7,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,3],[13,4],[6,2],[17,3],[17,2],[17,2],[17,1],[17,1],[26,2],[26,1],[29,1],[29,1],[29,1],[29,1],[29,1],[27,1],[33,2],[33,1],[34,3],[34,3],[34,3],[34,3],[34,3],[25,1],[21,1],[38,3],[38,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return $$[$0-1]; 
break;
case 2: this.$ = new yy.ProgramNode([], $$[$0]); 
break;
case 3: this.$ = new yy.ProgramNode($$[$0-2], $$[$0]); 
break;
case 4: this.$ = new yy.ProgramNode($$[$0-1], []); 
break;
case 5: this.$ = new yy.ProgramNode($$[$0]); 
break;
case 6: this.$ = new yy.ProgramNode([], []); 
break;
case 7: this.$ = new yy.ProgramNode([]); 
break;
case 8: this.$ = [$$[$0]]; 
break;
case 9: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 10: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1].inverse, $$[$0-1], $$[$0]); 
break;
case 11: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1], $$[$0-1].inverse, $$[$0]); 
break;
case 12: this.$ = $$[$0]; 
break;
case 13: this.$ = $$[$0]; 
break;
case 14: this.$ = new yy.ContentNode($$[$0]); 
break;
case 15: this.$ = new yy.CommentNode($$[$0]); 
break;
case 16: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]); 
break;
case 17: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]); 
break;
case 18: this.$ = $$[$0-1]; 
break;
case 19: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]); 
break;
case 20: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1], true); 
break;
case 21: this.$ = new yy.PartialNode($$[$0-1]); 
break;
case 22: this.$ = new yy.PartialNode($$[$0-2], $$[$0-1]); 
break;
case 23: 
break;
case 24: this.$ = [[$$[$0-2]].concat($$[$0-1]), $$[$0]]; 
break;
case 25: this.$ = [[$$[$0-1]].concat($$[$0]), null]; 
break;
case 26: this.$ = [[$$[$0-1]], $$[$0]]; 
break;
case 27: this.$ = [[$$[$0]], null]; 
break;
case 28: this.$ = [[new yy.DataNode($$[$0])], null]; 
break;
case 29: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 30: this.$ = [$$[$0]]; 
break;
case 31: this.$ = $$[$0]; 
break;
case 32: this.$ = new yy.StringNode($$[$0]); 
break;
case 33: this.$ = new yy.IntegerNode($$[$0]); 
break;
case 34: this.$ = new yy.BooleanNode($$[$0]); 
break;
case 35: this.$ = new yy.DataNode($$[$0]); 
break;
case 36: this.$ = new yy.HashNode($$[$0]); 
break;
case 37: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 38: this.$ = [$$[$0]]; 
break;
case 39: this.$ = [$$[$0-2], $$[$0]]; 
break;
case 40: this.$ = [$$[$0-2], new yy.StringNode($$[$0])]; 
break;
case 41: this.$ = [$$[$0-2], new yy.IntegerNode($$[$0])]; 
break;
case 42: this.$ = [$$[$0-2], new yy.BooleanNode($$[$0])]; 
break;
case 43: this.$ = [$$[$0-2], new yy.DataNode($$[$0])]; 
break;
case 44: this.$ = new yy.PartialNameNode($$[$0]); 
break;
case 45: this.$ = new yy.IdNode($$[$0]); 
break;
case 46: $$[$0-2].push($$[$0]); this.$ = $$[$0-2]; 
break;
case 47: this.$ = [$$[$0]]; 
break;
}
},
table: [{3:1,4:2,5:[2,7],6:3,7:4,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,5],22:[1,14],23:[1,15],24:[1,16]},{1:[3]},{5:[1,17]},{5:[2,6],7:18,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,19],20:[2,6],22:[1,14],23:[1,15],24:[1,16]},{5:[2,5],6:20,8:21,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,5],20:[2,5],22:[1,14],23:[1,15],24:[1,16]},{17:23,18:[1,22],21:24,28:[1,25],35:[1,27],38:26},{5:[2,8],14:[2,8],15:[2,8],16:[2,8],19:[2,8],20:[2,8],22:[2,8],23:[2,8],24:[2,8]},{4:28,6:3,7:4,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,5],20:[2,7],22:[1,14],23:[1,15],24:[1,16]},{4:29,6:3,7:4,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,5],20:[2,7],22:[1,14],23:[1,15],24:[1,16]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],24:[2,12]},{5:[2,13],14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],24:[2,13]},{5:[2,14],14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],24:[2,14]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],24:[2,15]},{17:30,21:24,28:[1,25],35:[1,27],38:26},{17:31,21:24,28:[1,25],35:[1,27],38:26},{17:32,21:24,28:[1,25],35:[1,27],38:26},{25:33,37:[1,34]},{1:[2,1]},{5:[2,2],8:21,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,19],20:[2,2],22:[1,14],23:[1,15],24:[1,16]},{17:23,21:24,28:[1,25],35:[1,27],38:26},{5:[2,4],7:35,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,19],20:[2,4],22:[1,14],23:[1,15],24:[1,16]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],24:[2,9]},{5:[2,23],14:[2,23],15:[2,23],16:[2,23],19:[2,23],20:[2,23],22:[2,23],23:[2,23],24:[2,23]},{18:[1,36]},{18:[2,27],21:41,26:37,27:38,28:[1,45],29:39,30:[1,42],31:[1,43],32:[1,44],33:40,34:46,35:[1,47],38:26},{18:[2,28]},{18:[2,45],28:[2,45],30:[2,45],31:[2,45],32:[2,45],35:[2,45],39:[1,48]},{18:[2,47],28:[2,47],30:[2,47],31:[2,47],32:[2,47],35:[2,47],39:[2,47]},{10:49,20:[1,50]},{10:51,20:[1,50]},{18:[1,52]},{18:[1,53]},{18:[1,54]},{18:[1,55],21:56,35:[1,27],38:26},{18:[2,44],35:[2,44]},{5:[2,3],8:21,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,19],20:[2,3],22:[1,14],23:[1,15],24:[1,16]},{14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],24:[2,17]},{18:[2,25],21:41,27:57,28:[1,45],29:58,30:[1,42],31:[1,43],32:[1,44],33:40,34:46,35:[1,47],38:26},{18:[2,26]},{18:[2,30],28:[2,30],30:[2,30],31:[2,30],32:[2,30],35:[2,30]},{18:[2,36],34:59,35:[1,60]},{18:[2,31],28:[2,31],30:[2,31],31:[2,31],32:[2,31],35:[2,31]},{18:[2,32],28:[2,32],30:[2,32],31:[2,32],32:[2,32],35:[2,32]},{18:[2,33],28:[2,33],30:[2,33],31:[2,33],32:[2,33],35:[2,33]},{18:[2,34],28:[2,34],30:[2,34],31:[2,34],32:[2,34],35:[2,34]},{18:[2,35],28:[2,35],30:[2,35],31:[2,35],32:[2,35],35:[2,35]},{18:[2,38],35:[2,38]},{18:[2,47],28:[2,47],30:[2,47],31:[2,47],32:[2,47],35:[2,47],36:[1,61],39:[2,47]},{35:[1,62]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],24:[2,10]},{21:63,35:[1,27],38:26},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],24:[2,11]},{14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],24:[2,16]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],24:[2,19]},{5:[2,20],14:[2,20],15:[2,20],16:[2,20],19:[2,20],20:[2,20],22:[2,20],23:[2,20],24:[2,20]},{5:[2,21],14:[2,21],15:[2,21],16:[2,21],19:[2,21],20:[2,21],22:[2,21],23:[2,21],24:[2,21]},{18:[1,64]},{18:[2,24]},{18:[2,29],28:[2,29],30:[2,29],31:[2,29],32:[2,29],35:[2,29]},{18:[2,37],35:[2,37]},{36:[1,61]},{21:65,28:[1,69],30:[1,66],31:[1,67],32:[1,68],35:[1,27],38:26},{18:[2,46],28:[2,46],30:[2,46],31:[2,46],32:[2,46],35:[2,46],39:[2,46]},{18:[1,70]},{5:[2,22],14:[2,22],15:[2,22],16:[2,22],19:[2,22],20:[2,22],22:[2,22],23:[2,22],24:[2,22]},{18:[2,39],35:[2,39]},{18:[2,40],35:[2,40]},{18:[2,41],35:[2,41]},{18:[2,42],35:[2,42]},{18:[2,43],35:[2,43]},{5:[2,18],14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],24:[2,18]}],
defaultActions: {17:[2,1],25:[2,28],38:[2,26],57:[2,24]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == "undefined")
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === "function")
        this.parseError = this.yy.parseError;
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || 1;
        if (typeof token !== "number") {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == "undefined") {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
            var errStr = "";
            if (!recovering) {
                expected = [];
                for (p in table[state])
                    if (this.terminals_[p] && p > 2) {
                        expected.push("'" + this.terminals_[p] + "'");
                    }
                if (this.lexer.showPosition) {
                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                } else {
                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                }
                this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }
        }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                    recovering--;
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
            if (ranges) {
                yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== "undefined") {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}
};
/* Jison generated lexer */
var lexer = (function(){
var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        if (this.options.ranges) this.yylloc.range = [0,0];
        this.offset = 0;
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) this.yylloc.range[1]++;

        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length-1);
        this.matched = this.matched.substr(0, this.matched.length-1);

        if (lines.length-1) this.yylineno -= lines.length-1;
        var r = this.yylloc.range;

        this.yylloc = {first_line: this.yylloc.first_line,
          last_line: this.yylineno+1,
          first_column: this.yylloc.first_column,
          last_column: lines ?
              (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
              this.yylloc.first_column - len
          };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
less:function (n) {
        this.unput(this.match.slice(n));
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            tempMatch,
            index,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (!this.options.flex) break;
            }
        }
        if (match) {
            lines = match[0].match(/(?:\r\n?|\n).*/g);
            if (lines) this.yylineno += lines.length;
            this.yylloc = {first_line: this.yylloc.last_line,
                           last_line: this.yylineno+1,
                           first_column: this.yylloc.last_column,
                           last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
            this.yytext += match[0];
            this.match += match[0];
            this.matches = match;
            this.yyleng = this.yytext.length;
            if (this.options.ranges) {
                this.yylloc.range = [this.offset, this.offset += this.yyleng];
            }
            this._more = false;
            this._input = this._input.slice(match[0].length);
            this.matched += match[0];
            token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
            if (this.done && this._input) this.done = false;
            if (token) return token;
            else return;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.options = {};
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:
                                   if(yy_.yytext.slice(-1) !== "\\") this.begin("mu");
                                   if(yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1), this.begin("emu");
                                   if(yy_.yytext) return 14;
                                 
break;
case 1: return 14; 
break;
case 2:
                                   if(yy_.yytext.slice(-1) !== "\\") this.popState();
                                   if(yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1);
                                   return 14;
                                 
break;
case 3: yy_.yytext = yy_.yytext.substr(0, yy_.yyleng-4); this.popState(); return 15; 
break;
case 4: this.begin("par"); return 24; 
break;
case 5: return 16; 
break;
case 6: return 20; 
break;
case 7: return 19; 
break;
case 8: return 19; 
break;
case 9: return 23; 
break;
case 10: return 23; 
break;
case 11: this.popState(); this.begin('com'); 
break;
case 12: yy_.yytext = yy_.yytext.substr(3,yy_.yyleng-5); this.popState(); return 15; 
break;
case 13: return 22; 
break;
case 14: return 36; 
break;
case 15: return 35; 
break;
case 16: return 35; 
break;
case 17: return 39; 
break;
case 18: /*ignore whitespace*/ 
break;
case 19: this.popState(); return 18; 
break;
case 20: this.popState(); return 18; 
break;
case 21: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\"/g,'"'); return 30; 
break;
case 22: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\'/g,"'"); return 30; 
break;
case 23: yy_.yytext = yy_.yytext.substr(1); return 28; 
break;
case 24: return 32; 
break;
case 25: return 32; 
break;
case 26: return 31; 
break;
case 27: return 35; 
break;
case 28: yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2); return 35; 
break;
case 29: return 'INVALID'; 
break;
case 30: /*ignore whitespace*/ 
break;
case 31: this.popState(); return 37; 
break;
case 32: return 5; 
break;
}
};
lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|$)))/,/^(?:[\s\S]*?--\}\})/,/^(?:\{\{>)/,/^(?:\{\{#)/,/^(?:\{\{\/)/,/^(?:\{\{\^)/,/^(?:\{\{\s*else\b)/,/^(?:\{\{\{)/,/^(?:\{\{&)/,/^(?:\{\{!--)/,/^(?:\{\{![\s\S]*?\}\})/,/^(?:\{\{)/,/^(?:=)/,/^(?:\.(?=[} ]))/,/^(?:\.\.)/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}\}\})/,/^(?:\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@[a-zA-Z]+)/,/^(?:true(?=[}\s]))/,/^(?:false(?=[}\s]))/,/^(?:[0-9]+(?=[}\s]))/,/^(?:[a-zA-Z0-9_$-]+(?=[=}\s\/.]))/,/^(?:\[[^\]]*\])/,/^(?:.)/,/^(?:\s+)/,/^(?:[a-zA-Z0-9_$-/]+)/,/^(?:$)/];
lexer.conditions = {"mu":{"rules":[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,32],"inclusive":false},"emu":{"rules":[2],"inclusive":false},"com":{"rules":[3],"inclusive":false},"par":{"rules":[30,31],"inclusive":false},"INITIAL":{"rules":[0,1,32],"inclusive":true}};
return lexer;})()
parser.lexer = lexer;
function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();;
// lib/handlebars/compiler/base.js
Handlebars.Parser = handlebars;

Handlebars.parse = function(input) {

  // Just return if an already-compile AST was passed in.
  if(input.constructor === Handlebars.AST.ProgramNode) { return input; }

  Handlebars.Parser.yy = Handlebars.AST;
  return Handlebars.Parser.parse(input);
};

Handlebars.print = function(ast) {
  return new Handlebars.PrintVisitor().accept(ast);
};;
// lib/handlebars/compiler/ast.js
(function() {

  Handlebars.AST = {};

  Handlebars.AST.ProgramNode = function(statements, inverse) {
    this.type = "program";
    this.statements = statements;
    if(inverse) { this.inverse = new Handlebars.AST.ProgramNode(inverse); }
  };

  Handlebars.AST.MustacheNode = function(rawParams, hash, unescaped) {
    this.type = "mustache";
    this.escaped = !unescaped;
    this.hash = hash;

    var id = this.id = rawParams[0];
    var params = this.params = rawParams.slice(1);

    // a mustache is an eligible helper if:
    // * its id is simple (a single part, not `this` or `..`)
    var eligibleHelper = this.eligibleHelper = id.isSimple;

    // a mustache is definitely a helper if:
    // * it is an eligible helper, and
    // * it has at least one parameter or hash segment
    this.isHelper = eligibleHelper && (params.length || hash);

    // if a mustache is an eligible helper but not a definite
    // helper, it is ambiguous, and will be resolved in a later
    // pass or at runtime.
  };

  Handlebars.AST.PartialNode = function(partialName, context) {
    this.type         = "partial";
    this.partialName  = partialName;
    this.context      = context;
  };

  var verifyMatch = function(open, close) {
    if(open.original !== close.original) {
      throw new Handlebars.Exception(open.original + " doesn't match " + close.original);
    }
  };

  Handlebars.AST.BlockNode = function(mustache, program, inverse, close) {
    verifyMatch(mustache.id, close);
    this.type = "block";
    this.mustache = mustache;
    this.program  = program;
    this.inverse  = inverse;

    if (this.inverse && !this.program) {
      this.isInverse = true;
    }
  };

  Handlebars.AST.ContentNode = function(string) {
    this.type = "content";
    this.string = string;
  };

  Handlebars.AST.HashNode = function(pairs) {
    this.type = "hash";
    this.pairs = pairs;
  };

  Handlebars.AST.IdNode = function(parts) {
    this.type = "ID";
    this.original = parts.join(".");

    var dig = [], depth = 0;

    for(var i=0,l=parts.length; i<l; i++) {
      var part = parts[i];

      if (part === ".." || part === "." || part === "this") {
        if (dig.length > 0) { throw new Handlebars.Exception("Invalid path: " + this.original); }
        else if (part === "..") { depth++; }
        else { this.isScoped = true; }
      }
      else { dig.push(part); }
    }

    this.parts    = dig;
    this.string   = dig.join('.');
    this.depth    = depth;

    // an ID is simple if it only has one part, and that part is not
    // `..` or `this`.
    this.isSimple = parts.length === 1 && !this.isScoped && depth === 0;

    this.stringModeValue = this.string;
  };

  Handlebars.AST.PartialNameNode = function(name) {
    this.type = "PARTIAL_NAME";
    this.name = name;
  };

  Handlebars.AST.DataNode = function(id) {
    this.type = "DATA";
    this.id = id;
  };

  Handlebars.AST.StringNode = function(string) {
    this.type = "STRING";
    this.string = string;
    this.stringModeValue = string;
  };

  Handlebars.AST.IntegerNode = function(integer) {
    this.type = "INTEGER";
    this.integer = integer;
    this.stringModeValue = Number(integer);
  };

  Handlebars.AST.BooleanNode = function(bool) {
    this.type = "BOOLEAN";
    this.bool = bool;
    this.stringModeValue = bool === "true";
  };

  Handlebars.AST.CommentNode = function(comment) {
    this.type = "comment";
    this.comment = comment;
  };

})();;
// lib/handlebars/utils.js

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }
};
Handlebars.Exception.prototype = new Error();

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

(function() {
  var escape = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /[&<>"'`]/g;
  var possible = /[&<>"'`]/;

  var escapeChar = function(chr) {
    return escape[chr] || "&amp;";
  };

  Handlebars.Utils = {
    escapeExpression: function(string) {
      // don't escape SafeStrings, since they're already safe
      if (string instanceof Handlebars.SafeString) {
        return string.toString();
      } else if (string == null || string === false) {
        return "";
      }

      if(!possible.test(string)) { return string; }
      return string.replace(badChars, escapeChar);
    },

    isEmpty: function(value) {
      if (!value && value !== 0) {
        return true;
      } else if(Object.prototype.toString.call(value) === "[object Array]" && value.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  };
})();;
// lib/handlebars/compiler/compiler.js

/*jshint eqnull:true*/
Handlebars.Compiler = function() {};
Handlebars.JavaScriptCompiler = function() {};

(function(Compiler, JavaScriptCompiler) {
  // the foundHelper register will disambiguate helper lookup from finding a
  // function in a context. This is necessary for mustache compatibility, which
  // requires that context functions in blocks are evaluated by blockHelperMissing,
  // and then proceed as if the resulting value was provided to blockHelperMissing.

  Compiler.prototype = {
    compiler: Compiler,

    disassemble: function() {
      var opcodes = this.opcodes, opcode, out = [], params, param;

      for (var i=0, l=opcodes.length; i<l; i++) {
        opcode = opcodes[i];

        if (opcode.opcode === 'DECLARE') {
          out.push("DECLARE " + opcode.name + "=" + opcode.value);
        } else {
          params = [];
          for (var j=0; j<opcode.args.length; j++) {
            param = opcode.args[j];
            if (typeof param === "string") {
              param = "\"" + param.replace("\n", "\\n") + "\"";
            }
            params.push(param);
          }
          out.push(opcode.opcode + " " + params.join(" "));
        }
      }

      return out.join("\n");
    },
    equals: function(other) {
      var len = this.opcodes.length;
      if (other.opcodes.length !== len) {
        return false;
      }

      for (var i = 0; i < len; i++) {
        var opcode = this.opcodes[i],
            otherOpcode = other.opcodes[i];
        if (opcode.opcode !== otherOpcode.opcode || opcode.args.length !== otherOpcode.args.length) {
          return false;
        }
        for (var j = 0; j < opcode.args.length; j++) {
          if (opcode.args[j] !== otherOpcode.args[j]) {
            return false;
          }
        }
      }
      return true;
    },

    guid: 0,

    compile: function(program, options) {
      this.children = [];
      this.depths = {list: []};
      this.options = options;

      // These changes will propagate to the other compiler components
      var knownHelpers = this.options.knownHelpers;
      this.options.knownHelpers = {
        'helperMissing': true,
        'blockHelperMissing': true,
        'each': true,
        'if': true,
        'unless': true,
        'with': true,
        'log': true
      };
      if (knownHelpers) {
        for (var name in knownHelpers) {
          this.options.knownHelpers[name] = knownHelpers[name];
        }
      }

      return this.program(program);
    },

    accept: function(node) {
      return this[node.type](node);
    },

    program: function(program) {
      var statements = program.statements, statement;
      this.opcodes = [];

      for(var i=0, l=statements.length; i<l; i++) {
        statement = statements[i];
        this[statement.type](statement);
      }
      this.isSimple = l === 1;

      this.depths.list = this.depths.list.sort(function(a, b) {
        return a - b;
      });

      return this;
    },

    compileProgram: function(program) {
      var result = new this.compiler().compile(program, this.options);
      var guid = this.guid++, depth;

      this.usePartial = this.usePartial || result.usePartial;

      this.children[guid] = result;

      for(var i=0, l=result.depths.list.length; i<l; i++) {
        depth = result.depths.list[i];

        if(depth < 2) { continue; }
        else { this.addDepth(depth - 1); }
      }

      return guid;
    },

    block: function(block) {
      var mustache = block.mustache,
          program = block.program,
          inverse = block.inverse;

      if (program) {
        program = this.compileProgram(program);
      }

      if (inverse) {
        inverse = this.compileProgram(inverse);
      }

      var type = this.classifyMustache(mustache);

      if (type === "helper") {
        this.helperMustache(mustache, program, inverse);
      } else if (type === "simple") {
        this.simpleMustache(mustache);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('emptyHash');
        this.opcode('blockValue');
      } else {
        this.ambiguousMustache(mustache, program, inverse);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('emptyHash');
        this.opcode('ambiguousBlockValue');
      }

      this.opcode('append');
    },

    hash: function(hash) {
      var pairs = hash.pairs, pair, val;

      this.opcode('pushHash');

      for(var i=0, l=pairs.length; i<l; i++) {
        pair = pairs[i];
        val  = pair[1];

        if (this.options.stringParams) {
          this.opcode('pushStringParam', val.stringModeValue, val.type);
        } else {
          this.accept(val);
        }

        this.opcode('assignToHash', pair[0]);
      }
      this.opcode('popHash');
    },

    partial: function(partial) {
      var partialName = partial.partialName;
      this.usePartial = true;

      if(partial.context) {
        this.ID(partial.context);
      } else {
        this.opcode('push', 'depth0');
      }

      this.opcode('invokePartial', partialName.name);
      this.opcode('append');
    },

    content: function(content) {
      this.opcode('appendContent', content.string);
    },

    mustache: function(mustache) {
      var options = this.options;
      var type = this.classifyMustache(mustache);

      if (type === "simple") {
        this.simpleMustache(mustache);
      } else if (type === "helper") {
        this.helperMustache(mustache);
      } else {
        this.ambiguousMustache(mustache);
      }

      if(mustache.escaped && !options.noEscape) {
        this.opcode('appendEscaped');
      } else {
        this.opcode('append');
      }
    },

    ambiguousMustache: function(mustache, program, inverse) {
      var id = mustache.id,
          name = id.parts[0],
          isBlock = program != null || inverse != null;

      this.opcode('getContext', id.depth);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      this.opcode('invokeAmbiguous', name, isBlock);
    },

    simpleMustache: function(mustache) {
      var id = mustache.id;

      if (id.type === 'DATA') {
        this.DATA(id);
      } else if (id.parts.length) {
        this.ID(id);
      } else {
        // Simplified ID for `this`
        this.addDepth(id.depth);
        this.opcode('getContext', id.depth);
        this.opcode('pushContext');
      }

      this.opcode('resolvePossibleLambda');
    },

    helperMustache: function(mustache, program, inverse) {
      var params = this.setupFullMustacheParams(mustache, program, inverse),
          name = mustache.id.parts[0];

      if (this.options.knownHelpers[name]) {
        this.opcode('invokeKnownHelper', params.length, name);
      } else if (this.knownHelpersOnly) {
        throw new Error("You specified knownHelpersOnly, but used the unknown helper " + name);
      } else {
        this.opcode('invokeHelper', params.length, name);
      }
    },

    ID: function(id) {
      this.addDepth(id.depth);
      this.opcode('getContext', id.depth);

      var name = id.parts[0];
      if (!name) {
        this.opcode('pushContext');
      } else {
        this.opcode('lookupOnContext', id.parts[0]);
      }

      for(var i=1, l=id.parts.length; i<l; i++) {
        this.opcode('lookup', id.parts[i]);
      }
    },

    DATA: function(data) {
      this.options.data = true;
      this.opcode('lookupData', data.id);
    },

    STRING: function(string) {
      this.opcode('pushString', string.string);
    },

    INTEGER: function(integer) {
      this.opcode('pushLiteral', integer.integer);
    },

    BOOLEAN: function(bool) {
      this.opcode('pushLiteral', bool.bool);
    },

    comment: function() {},

    // HELPERS
    opcode: function(name) {
      this.opcodes.push({ opcode: name, args: [].slice.call(arguments, 1) });
    },

    declare: function(name, value) {
      this.opcodes.push({ opcode: 'DECLARE', name: name, value: value });
    },

    addDepth: function(depth) {
      if(isNaN(depth)) { throw new Error("EWOT"); }
      if(depth === 0) { return; }

      if(!this.depths[depth]) {
        this.depths[depth] = true;
        this.depths.list.push(depth);
      }
    },

    classifyMustache: function(mustache) {
      var isHelper   = mustache.isHelper;
      var isEligible = mustache.eligibleHelper;
      var options    = this.options;

      // if ambiguous, we can possibly resolve the ambiguity now
      if (isEligible && !isHelper) {
        var name = mustache.id.parts[0];

        if (options.knownHelpers[name]) {
          isHelper = true;
        } else if (options.knownHelpersOnly) {
          isEligible = false;
        }
      }

      if (isHelper) { return "helper"; }
      else if (isEligible) { return "ambiguous"; }
      else { return "simple"; }
    },

    pushParams: function(params) {
      var i = params.length, param;

      while(i--) {
        param = params[i];

        if(this.options.stringParams) {
          if(param.depth) {
            this.addDepth(param.depth);
          }

          this.opcode('getContext', param.depth || 0);
          this.opcode('pushStringParam', param.stringModeValue, param.type);
        } else {
          this[param.type](param);
        }
      }
    },

    setupMustacheParams: function(mustache) {
      var params = mustache.params;
      this.pushParams(params);

      if(mustache.hash) {
        this.hash(mustache.hash);
      } else {
        this.opcode('emptyHash');
      }

      return params;
    },

    // this will replace setupMustacheParams when we're done
    setupFullMustacheParams: function(mustache, program, inverse) {
      var params = mustache.params;
      this.pushParams(params);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      if(mustache.hash) {
        this.hash(mustache.hash);
      } else {
        this.opcode('emptyHash');
      }

      return params;
    }
  };

  var Literal = function(value) {
    this.value = value;
  };

  JavaScriptCompiler.prototype = {
    // PUBLIC API: You can override these methods in a subclass to provide
    // alternative compiled forms for name lookup and buffering semantics
    nameLookup: function(parent, name /* , type*/) {
      if (/^[0-9]+$/.test(name)) {
        return parent + "[" + name + "]";
      } else if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
        return parent + "." + name;
      }
      else {
        return parent + "['" + name + "']";
      }
    },

    appendToBuffer: function(string) {
      if (this.environment.isSimple) {
        return "return " + string + ";";
      } else {
        return {
          appendToBuffer: true,
          content: string,
          toString: function() { return "buffer += " + string + ";"; }
        };
      }
    },

    initializeBuffer: function() {
      return this.quotedString("");
    },

    namespace: "Handlebars",
    // END PUBLIC API

    compile: function(environment, options, context, asObject) {
      this.environment = environment;
      this.options = options || {};

      Handlebars.log(Handlebars.logger.DEBUG, this.environment.disassemble() + "\n\n");

      this.name = this.environment.name;
      this.isChild = !!context;
      this.context = context || {
        programs: [],
        environments: [],
        aliases: { }
      };

      this.preamble();

      this.stackSlot = 0;
      this.stackVars = [];
      this.registers = { list: [] };
      this.compileStack = [];
      this.inlineStack = [];

      this.compileChildren(environment, options);

      var opcodes = environment.opcodes, opcode;

      this.i = 0;

      for(l=opcodes.length; this.i<l; this.i++) {
        opcode = opcodes[this.i];

        if(opcode.opcode === 'DECLARE') {
          this[opcode.name] = opcode.value;
        } else {
          this[opcode.opcode].apply(this, opcode.args);
        }
      }

      return this.createFunctionContext(asObject);
    },

    nextOpcode: function() {
      var opcodes = this.environment.opcodes;
      return opcodes[this.i + 1];
    },

    eat: function() {
      this.i = this.i + 1;
    },

    preamble: function() {
      var out = [];

      if (!this.isChild) {
        var namespace = this.namespace;
        var copies = "helpers = helpers || " + namespace + ".helpers;";
        if (this.environment.usePartial) { copies = copies + " partials = partials || " + namespace + ".partials;"; }
        if (this.options.data) { copies = copies + " data = data || {};"; }
        out.push(copies);
      } else {
        out.push('');
      }

      if (!this.environment.isSimple) {
        out.push(", buffer = " + this.initializeBuffer());
      } else {
        out.push("");
      }

      // track the last context pushed into place to allow skipping the
      // getContext opcode when it would be a noop
      this.lastContext = 0;
      this.source = out;
    },

    createFunctionContext: function(asObject) {
      var locals = this.stackVars.concat(this.registers.list);

      if(locals.length > 0) {
        this.source[1] = this.source[1] + ", " + locals.join(", ");
      }

      // Generate minimizer alias mappings
      if (!this.isChild) {
        for (var alias in this.context.aliases) {
          this.source[1] = this.source[1] + ', ' + alias + '=' + this.context.aliases[alias];
        }
      }

      if (this.source[1]) {
        this.source[1] = "var " + this.source[1].substring(2) + ";";
      }

      // Merge children
      if (!this.isChild) {
        this.source[1] += '\n' + this.context.programs.join('\n') + '\n';
      }

      if (!this.environment.isSimple) {
        this.source.push("return buffer;");
      }

      var params = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"];

      for(var i=0, l=this.environment.depths.list.length; i<l; i++) {
        params.push("depth" + this.environment.depths.list[i]);
      }

      // Perform a second pass over the output to merge content when possible
      var source = this.mergeSource();

      if (!this.isChild) {
        var revision = Handlebars.COMPILER_REVISION,
            versions = Handlebars.REVISION_CHANGES[revision];
        source = "this.compilerInfo = ["+revision+",'"+versions+"'];\n"+source;
      }

      if (asObject) {
        params.push(source);

        return Function.apply(this, params);
      } else {
        var functionSource = 'function ' + (this.name || '') + '(' + params.join(',') + ') {\n  ' + source + '}';
        Handlebars.log(Handlebars.logger.DEBUG, functionSource + "\n\n");
        return functionSource;
      }
    },
    mergeSource: function() {
      // WARN: We are not handling the case where buffer is still populated as the source should
      // not have buffer append operations as their final action.
      var source = '',
          buffer;
      for (var i = 0, len = this.source.length; i < len; i++) {
        var line = this.source[i];
        if (line.appendToBuffer) {
          if (buffer) {
            buffer = buffer + '\n    + ' + line.content;
          } else {
            buffer = line.content;
          }
        } else {
          if (buffer) {
            source += 'buffer += ' + buffer + ';\n  ';
            buffer = undefined;
          }
          source += line + '\n  ';
        }
      }
      return source;
    },

    // [blockValue]
    //
    // On stack, before: hash, inverse, program, value
    // On stack, after: return value of blockHelperMissing
    //
    // The purpose of this opcode is to take a block of the form
    // `{{#foo}}...{{/foo}}`, resolve the value of `foo`, and
    // replace it on the stack with the result of properly
    // invoking blockHelperMissing.
    blockValue: function() {
      this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      var params = ["depth0"];
      this.setupParams(0, params);

      this.replaceStack(function(current) {
        params.splice(1, 0, current);
        return "blockHelperMissing.call(" + params.join(", ") + ")";
      });
    },

    // [ambiguousBlockValue]
    //
    // On stack, before: hash, inverse, program, value
    // Compiler value, before: lastHelper=value of last found helper, if any
    // On stack, after, if no lastHelper: same as [blockValue]
    // On stack, after, if lastHelper: value
    ambiguousBlockValue: function() {
      this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      var params = ["depth0"];
      this.setupParams(0, params);

      var current = this.topStack();
      params.splice(1, 0, current);

      // Use the options value generated from the invocation
      params[params.length-1] = 'options';

      this.source.push("if (!" + this.lastHelper + ") { " + current + " = blockHelperMissing.call(" + params.join(", ") + "); }");
    },

    // [appendContent]
    //
    // On stack, before: ...
    // On stack, after: ...
    //
    // Appends the string value of `content` to the current buffer
    appendContent: function(content) {
      this.source.push(this.appendToBuffer(this.quotedString(content)));
    },

    // [append]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Coerces `value` to a String and appends it to the current buffer.
    //
    // If `value` is truthy, or 0, it is coerced into a string and appended
    // Otherwise, the empty string is appended
    append: function() {
      // Force anything that is inlined onto the stack so we don't have duplication
      // when we examine local
      this.flushInline();
      var local = this.popStack();
      this.source.push("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
      if (this.environment.isSimple) {
        this.source.push("else { " + this.appendToBuffer("''") + " }");
      }
    },

    // [appendEscaped]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Escape `value` and append it to the buffer
    appendEscaped: function() {
      this.context.aliases.escapeExpression = 'this.escapeExpression';

      this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")"));
    },

    // [getContext]
    //
    // On stack, before: ...
    // On stack, after: ...
    // Compiler value, after: lastContext=depth
    //
    // Set the value of the `lastContext` compiler value to the depth
    getContext: function(depth) {
      if(this.lastContext !== depth) {
        this.lastContext = depth;
      }
    },

    // [lookupOnContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext[name], ...
    //
    // Looks up the value of `name` on the current context and pushes
    // it onto the stack.
    lookupOnContext: function(name) {
      this.push(this.nameLookup('depth' + this.lastContext, name, 'context'));
    },

    // [pushContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext, ...
    //
    // Pushes the value of the current context onto the stack.
    pushContext: function() {
      this.pushStackLiteral('depth' + this.lastContext);
    },

    // [resolvePossibleLambda]
    //
    // On stack, before: value, ...
    // On stack, after: resolved value, ...
    //
    // If the `value` is a lambda, replace it on the stack by
    // the return value of the lambda
    resolvePossibleLambda: function() {
      this.context.aliases.functionType = '"function"';

      this.replaceStack(function(current) {
        return "typeof " + current + " === functionType ? " + current + ".apply(depth0) : " + current;
      });
    },

    // [lookup]
    //
    // On stack, before: value, ...
    // On stack, after: value[name], ...
    //
    // Replace the value on the stack with the result of looking
    // up `name` on `value`
    lookup: function(name) {
      this.replaceStack(function(current) {
        return current + " == null || " + current + " === false ? " + current + " : " + this.nameLookup(current, name, 'context');
      });
    },

    // [lookupData]
    //
    // On stack, before: ...
    // On stack, after: data[id], ...
    //
    // Push the result of looking up `id` on the current data
    lookupData: function(id) {
      this.push(this.nameLookup('data', id, 'data'));
    },

    // [pushStringParam]
    //
    // On stack, before: ...
    // On stack, after: string, currentContext, ...
    //
    // This opcode is designed for use in string mode, which
    // provides the string value of a parameter along with its
    // depth rather than resolving it immediately.
    pushStringParam: function(string, type) {
      this.pushStackLiteral('depth' + this.lastContext);

      this.pushString(type);

      if (typeof string === 'string') {
        this.pushString(string);
      } else {
        this.pushStackLiteral(string);
      }
    },

    emptyHash: function() {
      this.pushStackLiteral('{}');

      if (this.options.stringParams) {
        this.register('hashTypes', '{}');
      }
    },
    pushHash: function() {
      this.hash = {values: [], types: []};
    },
    popHash: function() {
      var hash = this.hash;
      this.hash = undefined;

      if (this.options.stringParams) {
        this.register('hashTypes', '{' + hash.types.join(',') + '}');
      }
      this.push('{\n    ' + hash.values.join(',\n    ') + '\n  }');
    },

    // [pushString]
    //
    // On stack, before: ...
    // On stack, after: quotedString(string), ...
    //
    // Push a quoted version of `string` onto the stack
    pushString: function(string) {
      this.pushStackLiteral(this.quotedString(string));
    },

    // [push]
    //
    // On stack, before: ...
    // On stack, after: expr, ...
    //
    // Push an expression onto the stack
    push: function(expr) {
      this.inlineStack.push(expr);
      return expr;
    },

    // [pushLiteral]
    //
    // On stack, before: ...
    // On stack, after: value, ...
    //
    // Pushes a value onto the stack. This operation prevents
    // the compiler from creating a temporary variable to hold
    // it.
    pushLiteral: function(value) {
      this.pushStackLiteral(value);
    },

    // [pushProgram]
    //
    // On stack, before: ...
    // On stack, after: program(guid), ...
    //
    // Push a program expression onto the stack. This takes
    // a compile-time guid and converts it into a runtime-accessible
    // expression.
    pushProgram: function(guid) {
      if (guid != null) {
        this.pushStackLiteral(this.programExpression(guid));
      } else {
        this.pushStackLiteral(null);
      }
    },

    // [invokeHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // Pops off the helper's parameters, invokes the helper,
    // and pushes the helper's return value onto the stack.
    //
    // If the helper is not found, `helperMissing` is called.
    invokeHelper: function(paramSize, name) {
      this.context.aliases.helperMissing = 'helpers.helperMissing';

      var helper = this.lastHelper = this.setupHelper(paramSize, name, true);

      this.push(helper.name);
      this.replaceStack(function(name) {
        return name + ' ? ' + name + '.call(' +
            helper.callParams + ") " + ": helperMissing.call(" +
            helper.helperMissingParams + ")";
      });
    },

    // [invokeKnownHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // This operation is used when the helper is known to exist,
    // so a `helperMissing` fallback is not required.
    invokeKnownHelper: function(paramSize, name) {
      var helper = this.setupHelper(paramSize, name);
      this.push(helper.name + ".call(" + helper.callParams + ")");
    },

    // [invokeAmbiguous]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of disambiguation
    //
    // This operation is used when an expression like `{{foo}}`
    // is provided, but we don't know at compile-time whether it
    // is a helper or a path.
    //
    // This operation emits more code than the other options,
    // and can be avoided by passing the `knownHelpers` and
    // `knownHelpersOnly` flags at compile-time.
    invokeAmbiguous: function(name, helperCall) {
      this.context.aliases.functionType = '"function"';

      this.pushStackLiteral('{}');    // Hash value
      var helper = this.setupHelper(0, name, helperCall);

      var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');

      var nonHelper = this.nameLookup('depth' + this.lastContext, name, 'context');
      var nextStack = this.nextStack();

      this.source.push('if (' + nextStack + ' = ' + helperName + ') { ' + nextStack + ' = ' + nextStack + '.call(' + helper.callParams + '); }');
      this.source.push('else { ' + nextStack + ' = ' + nonHelper + '; ' + nextStack + ' = typeof ' + nextStack + ' === functionType ? ' + nextStack + '.apply(depth0) : ' + nextStack + '; }');
    },

    // [invokePartial]
    //
    // On stack, before: context, ...
    // On stack after: result of partial invocation
    //
    // This operation pops off a context, invokes a partial with that context,
    // and pushes the result of the invocation back.
    invokePartial: function(name) {
      var params = [this.nameLookup('partials', name, 'partial'), "'" + name + "'", this.popStack(), "helpers", "partials"];

      if (this.options.data) {
        params.push("data");
      }

      this.context.aliases.self = "this";
      this.push("self.invokePartial(" + params.join(", ") + ")");
    },

    // [assignToHash]
    //
    // On stack, before: value, hash, ...
    // On stack, after: hash, ...
    //
    // Pops a value and hash off the stack, assigns `hash[key] = value`
    // and pushes the hash back onto the stack.
    assignToHash: function(key) {
      var value = this.popStack(),
          type;

      if (this.options.stringParams) {
        type = this.popStack();
        this.popStack();
      }

      var hash = this.hash;
      if (type) {
        hash.types.push("'" + key + "': " + type);
      }
      hash.values.push("'" + key + "': (" + value + ")");
    },

    // HELPERS

    compiler: JavaScriptCompiler,

    compileChildren: function(environment, options) {
      var children = environment.children, child, compiler;

      for(var i=0, l=children.length; i<l; i++) {
        child = children[i];
        compiler = new this.compiler();

        var index = this.matchExistingProgram(child);

        if (index == null) {
          this.context.programs.push('');     // Placeholder to prevent name conflicts for nested children
          index = this.context.programs.length;
          child.index = index;
          child.name = 'program' + index;
          this.context.programs[index] = compiler.compile(child, options, this.context);
          this.context.environments[index] = child;
        } else {
          child.index = index;
          child.name = 'program' + index;
        }
      }
    },
    matchExistingProgram: function(child) {
      for (var i = 0, len = this.context.environments.length; i < len; i++) {
        var environment = this.context.environments[i];
        if (environment && environment.equals(child)) {
          return i;
        }
      }
    },

    programExpression: function(guid) {
      this.context.aliases.self = "this";

      if(guid == null) {
        return "self.noop";
      }

      var child = this.environment.children[guid],
          depths = child.depths.list, depth;

      var programParams = [child.index, child.name, "data"];

      for(var i=0, l = depths.length; i<l; i++) {
        depth = depths[i];

        if(depth === 1) { programParams.push("depth0"); }
        else { programParams.push("depth" + (depth - 1)); }
      }

      if(depths.length === 0) {
        return "self.program(" + programParams.join(", ") + ")";
      } else {
        programParams.shift();
        return "self.programWithDepth(" + programParams.join(", ") + ")";
      }
    },

    register: function(name, val) {
      this.useRegister(name);
      this.source.push(name + " = " + val + ";");
    },

    useRegister: function(name) {
      if(!this.registers[name]) {
        this.registers[name] = true;
        this.registers.list.push(name);
      }
    },

    pushStackLiteral: function(item) {
      return this.push(new Literal(item));
    },

    pushStack: function(item) {
      this.flushInline();

      var stack = this.incrStack();
      if (item) {
        this.source.push(stack + " = " + item + ";");
      }
      this.compileStack.push(stack);
      return stack;
    },

    replaceStack: function(callback) {
      var prefix = '',
          inline = this.isInline(),
          stack;

      // If we are currently inline then we want to merge the inline statement into the
      // replacement statement via ','
      if (inline) {
        var top = this.popStack(true);

        if (top instanceof Literal) {
          // Literals do not need to be inlined
          stack = top.value;
        } else {
          // Get or create the current stack name for use by the inline
          var name = this.stackSlot ? this.topStackName() : this.incrStack();

          prefix = '(' + this.push(name) + ' = ' + top + '),';
          stack = this.topStack();
        }
      } else {
        stack = this.topStack();
      }

      var item = callback.call(this, stack);

      if (inline) {
        if (this.inlineStack.length || this.compileStack.length) {
          this.popStack();
        }
        this.push('(' + prefix + item + ')');
      } else {
        // Prevent modification of the context depth variable. Through replaceStack
        if (!/^stack/.test(stack)) {
          stack = this.nextStack();
        }

        this.source.push(stack + " = (" + prefix + item + ");");
      }
      return stack;
    },

    nextStack: function() {
      return this.pushStack();
    },

    incrStack: function() {
      this.stackSlot++;
      if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
      return this.topStackName();
    },
    topStackName: function() {
      return "stack" + this.stackSlot;
    },
    flushInline: function() {
      var inlineStack = this.inlineStack;
      if (inlineStack.length) {
        this.inlineStack = [];
        for (var i = 0, len = inlineStack.length; i < len; i++) {
          var entry = inlineStack[i];
          if (entry instanceof Literal) {
            this.compileStack.push(entry);
          } else {
            this.pushStack(entry);
          }
        }
      }
    },
    isInline: function() {
      return this.inlineStack.length;
    },

    popStack: function(wrapped) {
      var inline = this.isInline(),
          item = (inline ? this.inlineStack : this.compileStack).pop();

      if (!wrapped && (item instanceof Literal)) {
        return item.value;
      } else {
        if (!inline) {
          this.stackSlot--;
        }
        return item;
      }
    },

    topStack: function(wrapped) {
      var stack = (this.isInline() ? this.inlineStack : this.compileStack),
          item = stack[stack.length - 1];

      if (!wrapped && (item instanceof Literal)) {
        return item.value;
      } else {
        return item;
      }
    },

    quotedString: function(str) {
      return '"' + str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r') + '"';
    },

    setupHelper: function(paramSize, name, missingParams) {
      var params = [];
      this.setupParams(paramSize, params, missingParams);
      var foundHelper = this.nameLookup('helpers', name, 'helper');

      return {
        params: params,
        name: foundHelper,
        callParams: ["depth0"].concat(params).join(", "),
        helperMissingParams: missingParams && ["depth0", this.quotedString(name)].concat(params).join(", ")
      };
    },

    // the params and contexts arguments are passed in arrays
    // to fill in
    setupParams: function(paramSize, params, useRegister) {
      var options = [], contexts = [], types = [], param, inverse, program;

      options.push("hash:" + this.popStack());

      inverse = this.popStack();
      program = this.popStack();

      // Avoid setting fn and inverse if neither are set. This allows
      // helpers to do a check for `if (options.fn)`
      if (program || inverse) {
        if (!program) {
          this.context.aliases.self = "this";
          program = "self.noop";
        }

        if (!inverse) {
         this.context.aliases.self = "this";
          inverse = "self.noop";
        }

        options.push("inverse:" + inverse);
        options.push("fn:" + program);
      }

      for(var i=0; i<paramSize; i++) {
        param = this.popStack();
        params.push(param);

        if(this.options.stringParams) {
          types.push(this.popStack());
          contexts.push(this.popStack());
        }
      }

      if (this.options.stringParams) {
        options.push("contexts:[" + contexts.join(",") + "]");
        options.push("types:[" + types.join(",") + "]");
        options.push("hashTypes:hashTypes");
      }

      if(this.options.data) {
        options.push("data:data");
      }

      options = "{" + options.join(",") + "}";
      if (useRegister) {
        this.register('options', options);
        params.push('options');
      } else {
        params.push(options);
      }
      return params.join(", ");
    }
  };

  var reservedWords = (
    "break else new var" +
    " case finally return void" +
    " catch for switch while" +
    " continue function this with" +
    " default if throw" +
    " delete in try" +
    " do instanceof typeof" +
    " abstract enum int short" +
    " boolean export interface static" +
    " byte extends long super" +
    " char final native synchronized" +
    " class float package throws" +
    " const goto private transient" +
    " debugger implements protected volatile" +
    " double import public let yield"
  ).split(" ");

  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

  for(var i=0, l=reservedWords.length; i<l; i++) {
    compilerWords[reservedWords[i]] = true;
  }

  JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
    if(!JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(name)) {
      return true;
    }
    return false;
  };

})(Handlebars.Compiler, Handlebars.JavaScriptCompiler);

Handlebars.precompile = function(input, options) {
  if (!input || (typeof input !== 'string' && input.constructor !== Handlebars.AST.ProgramNode)) {
    throw new Handlebars.Exception("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + input);
  }

  options = options || {};
  if (!('data' in options)) {
    options.data = true;
  }
  var ast = Handlebars.parse(input);
  var environment = new Handlebars.Compiler().compile(ast, options);
  return new Handlebars.JavaScriptCompiler().compile(environment, options);
};

Handlebars.compile = function(input, options) {
  if (!input || (typeof input !== 'string' && input.constructor !== Handlebars.AST.ProgramNode)) {
    throw new Handlebars.Exception("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + input);
  }

  options = options || {};
  if (!('data' in options)) {
    options.data = true;
  }
  var compiled;
  function compile() {
    var ast = Handlebars.parse(input);
    var environment = new Handlebars.Compiler().compile(ast, options);
    var templateSpec = new Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true);
    return Handlebars.template(templateSpec);
  }

  // Template is only compiled on first use and cached after that point.
  return function(context, options) {
    if (!compiled) {
      compiled = compile();
    }
    return compiled.call(this, context, options);
  };
};
;
// lib/handlebars/runtime.js
Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          return Handlebars.VM.program(fn, data);
        } else if(programWrapper) {
          return programWrapper;
        } else {
          programWrapper = this.programs[i] = Handlebars.VM.program(fn);
          return programWrapper;
        }
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop,
      compilerInfo: null
    };

    return function(context, options) {
      options = options || {};
      var result = templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);

      var compilerInfo = container.compilerInfo || [],
          compilerRevision = compilerInfo[0] || 1,
          currentRevision = Handlebars.COMPILER_REVISION;

      if (compilerRevision !== currentRevision) {
        if (compilerRevision < currentRevision) {
          var runtimeVersions = Handlebars.REVISION_CHANGES[currentRevision],
              compilerVersions = Handlebars.REVISION_CHANGES[compilerRevision];
          throw "Template was precompiled with an older version of Handlebars than the current runtime. "+
                "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").";
        } else {
          // Use the embedded version info since the runtime doesn't know about this revision yet
          throw "Template was precompiled with a newer version of Handlebars than the current runtime. "+
                "Please update your runtime to a newer version ("+compilerInfo[1]+").";
        }
      }

      return result;
    };
  },

  programWithDepth: function(fn, data, $depth) {
    var args = Array.prototype.slice.call(arguments, 2);

    return function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
  },
  program: function(fn, data) {
    return function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    var options = { helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      partials[name] = Handlebars.compile(partial, {data: data !== undefined});
      return partials[name](context, options);
    }
  }
};

Handlebars.template = Handlebars.VM.template;
;
=======
  


<!DOCTYPE html>
<html>
  <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# githubog: http://ogp.me/ns/fb/githubog#">
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>prodigy-mobile/js/handlebars.js at master · sgross2130/prodigy-mobile</title>
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GitHub" />
    <link rel="fluid-icon" href="https://github.com/fluidicon.png" title="GitHub" />
    <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-114.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-144.png" />
    <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144.png" />
    <link rel="logo" type="image/svg" href="http://github-media-downloads.s3.amazonaws.com/github-logo.svg" />
    <meta name="msapplication-TileImage" content="/windows-tile.png">
    <meta name="msapplication-TileColor" content="#ffffff">

    
    
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />

    <meta content="authenticity_token" name="csrf-param" />
<meta content="FuDqtal7jm+/QQi2SXoiTncRf0juo1vFLtfDqsJa/60=" name="csrf-token" />

    <link href="https://a248.e.akamai.net/assets.github.com/assets/github-f70e4783e00fd4884a9e5e651a43933c9881caa8.css" media="all" rel="stylesheet" type="text/css" />
    <link href="https://a248.e.akamai.net/assets.github.com/assets/github2-9882d2e517445a75f8ac994bda4df6096e695266.css" media="all" rel="stylesheet" type="text/css" />
    


      <script src="https://a248.e.akamai.net/assets.github.com/assets/frameworks-d76b58e749b52bc47a4c46620bf2c320fabe5248.js" type="text/javascript"></script>
      <script src="https://a248.e.akamai.net/assets.github.com/assets/github-67b55380cff8d6766b298e6935a3c1db7d5c6d5d.js" type="text/javascript"></script>
      
      <meta http-equiv="x-pjax-version" content="1212ad79754350a805cefbcd08a3dadf">

        <link data-pjax-transient rel='permalink' href='/sgross2130/prodigy-mobile/blob/1e2da12f935146c27d608cf387bee67ba72b78e0/js/handlebars.js'>
    <meta property="og:title" content="prodigy-mobile"/>
    <meta property="og:type" content="githubog:gitrepository"/>
    <meta property="og:url" content="https://github.com/sgross2130/prodigy-mobile"/>
    <meta property="og:image" content="https://secure.gravatar.com/avatar/3cd3e3cbb59380b3154247335b014961?s=420&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png"/>
    <meta property="og:site_name" content="GitHub"/>
    <meta property="og:description" content="Contribute to prodigy-mobile development by creating an account on GitHub."/>
    <meta property="twitter:card" content="summary"/>
    <meta property="twitter:site" content="@GitHub">
    <meta property="twitter:title" content="sgross2130/prodigy-mobile"/>

    <meta name="description" content="Contribute to prodigy-mobile development by creating an account on GitHub." />

  <link href="https://github.com/sgross2130/prodigy-mobile/commits/master.atom" rel="alternate" title="Recent Commits to prodigy-mobile:master" type="application/atom+xml" />

  </head>


  <body class="logged_in page-blob windows vis-public env-production  ">
    <div id="wrapper">

      

      
      
      

      <div class="header header-logged-in true">
  <div class="container clearfix">

    <a class="header-logo-blacktocat" href="https://github.com/">
  <span class="mega-icon mega-icon-blacktocat"></span>
</a>

    <div class="divider-vertical"></div>

      <a href="/notifications" class="notification-indicator tooltipped downwards" title="You have no unread notifications">
    <span class="mail-status all-read"></span>
  </a>
  <div class="divider-vertical"></div>


      <div class="command-bar js-command-bar  ">
            <form accept-charset="UTF-8" action="/search" class="command-bar-form" id="top_search_form" method="get">
  <a href="/search/advanced" class="advanced-search-icon tooltipped downwards command-bar-search" id="advanced_search" title="Advanced search"><span class="mini-icon mini-icon-advanced-search "></span></a>

  <input type="text" name="q" id="js-command-bar-field" placeholder="Search or type a command" tabindex="1" data-username="sgross2130" autocapitalize="off">

  <span class="mini-icon help tooltipped downwards" title="Show command bar help">
    <span class="mini-icon mini-icon-help"></span>
  </span>

  <input type="hidden" name="ref" value="commandbar">

  <div class="divider-vertical"></div>
</form>
        <ul class="top-nav">
            <li class="explore"><a href="https://github.com/explore">Explore</a></li>
            <li><a href="https://gist.github.com">Gist</a></li>
            <li><a href="/blog">Blog</a></li>
          <li><a href="http://help.github.com">Help</a></li>
        </ul>
      </div>

    

  
    <ul id="user-links">
      <li>
        <a href="https://github.com/sgross2130" class="name">
          <img height="20" src="https://secure.gravatar.com/avatar/3cd3e3cbb59380b3154247335b014961?s=140&amp;d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png" width="20" /> sgross2130
        </a>
      </li>
      <li>
        <a href="/new" id="new_repo" class="tooltipped downwards" title="Create a new repo">
          <span class="mini-icon mini-icon-create"></span>
        </a>
      </li>
      <li>
        <a href="/settings/profile" id="account_settings"
          class="tooltipped downwards"
          title="Account settings (You have no verified emails)">
          <span class="mini-icon mini-icon-account-settings"></span>
            <span class="setting_warning">!</span>
        </a>
      </li>
      <li>
        <a href="/logout" data-method="post" id="logout" class="tooltipped downwards" title="Sign out">
          <span class="mini-icon mini-icon-logout"></span>
        </a>
      </li>
    </ul>



    
  </div>
</div>

      

      <div class="global-notice warn"><div class="global-notice-inner"><h2>You don't have any verified emails.  We recommend <a href="https://github.com/settings/emails">verifying</a> at least one email.</h2><p>Email verification will help our support team help you in case you have any email issues or lose your password.</p></div></div>

      


            <div class="site hfeed" itemscope itemtype="http://schema.org/WebPage">
      <div class="hentry">
        
        <div class="pagehead repohead instapaper_ignore readability-menu ">
          <div class="container">
            <div class="title-actions-bar">
              


<ul class="pagehead-actions">

    <li class="nspr">
      <a href="/sgross2130/prodigy-mobile/pull/new/master" class="button minibutton btn-pull-request" icon_class="mini-icon-pull-request"><span class="mini-icon mini-icon-pull-request"></span>Pull Request</a>
    </li>

    <li class="subscription">
      <form accept-charset="UTF-8" action="/notifications/subscribe" data-autosubmit="true" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="authenticity_token" type="hidden" value="FuDqtal7jm+/QQi2SXoiTncRf0juo1vFLtfDqsJa/60=" /></div>  <input id="repository_id" name="repository_id" type="hidden" value="8954643" />

    <div class="select-menu js-menu-container js-select-menu">
      <span class="minibutton select-menu-button js-menu-target">
        <span class="js-select-button">
          <span class="mini-icon mini-icon-unwatch"></span>
          Unwatch
        </span>
      </span>

      <div class="select-menu-modal-holder js-menu-content">
        <div class="select-menu-modal">
          <div class="select-menu-header">
            <span class="select-menu-title">Notification status</span>
            <span class="mini-icon mini-icon-remove-close js-menu-close"></span>
          </div> <!-- /.select-menu-header -->

          <div class="select-menu-list js-navigation-container">

            <div class="select-menu-item js-navigation-item js-navigation-target ">
              <span class="select-menu-item-icon mini-icon mini-icon-confirm"></span>
              <div class="select-menu-item-text">
                <input id="do_included" name="do" type="radio" value="included" />
                <h4>Not watching</h4>
                <span class="description">You only receive notifications for discussions in which you participate or are @mentioned.</span>
                <span class="js-select-button-text hidden-select-button-text">
                  <span class="mini-icon mini-icon-watching"></span>
                  Watch
                </span>
              </div>
            </div> <!-- /.select-menu-item -->

            <div class="select-menu-item js-navigation-item js-navigation-target selected">
              <span class="select-menu-item-icon mini-icon mini-icon-confirm"></span>
              <div class="select-menu-item-text">
                <input checked="checked" id="do_subscribed" name="do" type="radio" value="subscribed" />
                <h4>Watching</h4>
                <span class="description">You receive notifications for all discussions in this repository.</span>
                <span class="js-select-button-text hidden-select-button-text">
                  <span class="mini-icon mini-icon-unwatch"></span>
                  Unwatch
                </span>
              </div>
            </div> <!-- /.select-menu-item -->

            <div class="select-menu-item js-navigation-item js-navigation-target ">
              <span class="select-menu-item-icon mini-icon mini-icon-confirm"></span>
              <div class="select-menu-item-text">
                <input id="do_ignore" name="do" type="radio" value="ignore" />
                <h4>Ignoring</h4>
                <span class="description">You do not receive any notifications for discussions in this repository.</span>
                <span class="js-select-button-text hidden-select-button-text">
                  <span class="mini-icon mini-icon-mute"></span>
                  Stop ignoring
                </span>
              </div>
            </div> <!-- /.select-menu-item -->

          </div> <!-- /.select-menu-list -->

        </div> <!-- /.select-menu-modal -->
      </div> <!-- /.select-menu-modal-holder -->
    </div> <!-- /.select-menu -->

</form>
    </li>

    <li class="js-toggler-container js-social-container starring-container ">
      <a href="/sgross2130/prodigy-mobile/unstar" class="minibutton js-toggler-target star-button starred upwards" title="Unstar this repo" data-remote="true" data-method="post" rel="nofollow">
        <span class="mini-icon mini-icon-remove-star"></span>
        <span class="text">Unstar</span>
      </a>
      <a href="/sgross2130/prodigy-mobile/star" class="minibutton js-toggler-target star-button unstarred upwards" title="Star this repo" data-remote="true" data-method="post" rel="nofollow">
        <span class="mini-icon mini-icon-star"></span>
        <span class="text">Star</span>
      </a>
      <a class="social-count js-social-count" href="/sgross2130/prodigy-mobile/stargazers">0</a>
    </li>

        <li>
          <a href="/sgross2130/prodigy-mobile/fork" class="minibutton js-toggler-target fork-button lighter upwards" title="Fork this repo" rel="nofollow" data-method="post">
            <span class="mini-icon mini-icon-branch-create"></span>
            <span class="text">Fork</span>
          </a>
          <a href="/sgross2130/prodigy-mobile/network" class="social-count">0</a>
        </li>


</ul>

              <h1 itemscope itemtype="http://data-vocabulary.org/Breadcrumb" class="entry-title public">
                <span class="repo-label"><span>public</span></span>
                <span class="mega-icon mega-icon-public-repo"></span>
                <span class="author vcard">
                  <a href="/sgross2130" class="url fn" itemprop="url" rel="author">
                  <span itemprop="title">sgross2130</span>
                  </a></span> /
                <strong><a href="/sgross2130/prodigy-mobile" class="js-current-repository">prodigy-mobile</a></strong>
              </h1>
            </div>

            
  <ul class="tabs">
    <li><a href="/sgross2130/prodigy-mobile" class="selected" highlight="repo_source repo_downloads repo_commits repo_tags repo_branches">Code</a></li>
    <li><a href="/sgross2130/prodigy-mobile/network" highlight="repo_network">Network</a></li>
    <li><a href="/sgross2130/prodigy-mobile/pulls" highlight="repo_pulls">Pull Requests <span class='counter'>0</span></a></li>

      <li><a href="/sgross2130/prodigy-mobile/issues" highlight="repo_issues">Issues <span class='counter'>0</span></a></li>

      <li><a href="/sgross2130/prodigy-mobile/wiki" highlight="repo_wiki">Wiki</a></li>


    <li><a href="/sgross2130/prodigy-mobile/graphs" highlight="repo_graphs repo_contributors">Graphs</a></li>

      <li>
        <a href="/sgross2130/prodigy-mobile/settings">Settings</a>
      </li>

  </ul>
  
<div class="tabnav">

  <span class="tabnav-right">
    <ul class="tabnav-tabs">
          <li><a href="/sgross2130/prodigy-mobile/tags" class="tabnav-tab" highlight="repo_tags">Tags <span class="counter blank">0</span></a></li>
    </ul>
    
  </span>

  <div class="tabnav-widget scope">


    <div class="select-menu js-menu-container js-select-menu js-branch-menu">
      <a class="minibutton select-menu-button js-menu-target" data-hotkey="w" data-ref="master">
        <span class="mini-icon mini-icon-branch"></span>
        <i>branch:</i>
        <span class="js-select-button">master</span>
      </a>

      <div class="select-menu-modal-holder js-menu-content js-navigation-container">

        <div class="select-menu-modal">
          <div class="select-menu-header">
            <span class="select-menu-title">Switch branches/tags</span>
            <span class="mini-icon mini-icon-remove-close js-menu-close"></span>
          </div> <!-- /.select-menu-header -->

          <div class="select-menu-filters">
            <div class="select-menu-text-filter">
              <input type="text" id="commitish-filter-field" class="js-filterable-field js-navigation-enable" placeholder="Find or create a branch…">
            </div>
            <div class="select-menu-tabs">
              <ul>
                <li class="select-menu-tab">
                  <a href="#" data-tab-filter="branches" class="js-select-menu-tab">Branches</a>
                </li>
                <li class="select-menu-tab">
                  <a href="#" data-tab-filter="tags" class="js-select-menu-tab">Tags</a>
                </li>
              </ul>
            </div><!-- /.select-menu-tabs -->
          </div><!-- /.select-menu-filters -->

          <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket css-truncate" data-tab-filter="branches">

            <div data-filterable-for="commitish-filter-field" data-filterable-type="substring">

                <div class="select-menu-item js-navigation-item js-navigation-target selected">
                  <span class="select-menu-item-icon mini-icon mini-icon-confirm"></span>
                  <a href="/sgross2130/prodigy-mobile/blob/master/js/handlebars.js" class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target" data-name="master" rel="nofollow" title="master">master</a>
                </div> <!-- /.select-menu-item -->
            </div>

              <form accept-charset="UTF-8" action="/sgross2130/prodigy-mobile/branches" class="js-create-branch select-menu-item select-menu-new-item-form js-navigation-item js-navigation-target js-new-item-form" method="post"><div style="margin:0;padding:0;display:inline"><input name="authenticity_token" type="hidden" value="FuDqtal7jm+/QQi2SXoiTncRf0juo1vFLtfDqsJa/60=" /></div>

                <span class="mini-icon mini-icon-branch-create select-menu-item-icon"></span>
                <div class="select-menu-item-text">
                  <h4>Create branch: <span class="js-new-item-name"></span></h4>
                  <span class="description">from ‘master’</span>
                </div>
                <input type="hidden" name="name" id="name" class="js-new-item-submit" />
                <input type="hidden" name="branch" id="branch" value="master" />
                <input type="hidden" name="path" id="branch" value="js/handlebars.js" />
              </form> <!-- /.select-menu-item -->

          </div> <!-- /.select-menu-list -->


          <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket css-truncate" data-tab-filter="tags">
            <div data-filterable-for="commitish-filter-field" data-filterable-type="substring">

            </div>

            <div class="select-menu-no-results">Nothing to show</div>

          </div> <!-- /.select-menu-list -->

        </div> <!-- /.select-menu-modal -->
      </div> <!-- /.select-menu-modal-holder -->
    </div> <!-- /.select-menu -->

  </div> <!-- /.scope -->

  <ul class="tabnav-tabs">
    <li><a href="/sgross2130/prodigy-mobile" class="selected tabnav-tab" highlight="repo_source">Files</a></li>
    <li><a href="/sgross2130/prodigy-mobile/commits/master" class="tabnav-tab" highlight="repo_commits">Commits</a></li>
    <li><a href="/sgross2130/prodigy-mobile/branches" class="tabnav-tab" highlight="repo_branches" rel="nofollow">Branches <span class="counter ">1</span></a></li>
  </ul>

</div>

  
  
  


            
          </div>
        </div><!-- /.repohead -->

        <div id="js-repo-pjax-container" class="container context-loader-container" data-pjax-container>
          


<!-- blob contrib key: blob_contributors:v21:512a8901e649cf48597541102354000b -->
<!-- blob contrib frag key: views10/v8/blob_contributors:v21:512a8901e649cf48597541102354000b -->


<div id="slider">
    <div class="frame-meta">

      <p title="This is a placeholder element" class="js-history-link-replace hidden"></p>

        <div class="breadcrumb">
          <span class='bold'><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/sgross2130/prodigy-mobile" class="js-slide-to" data-branch="master" data-direction="back" itemscope="url"><span itemprop="title">prodigy-mobile</span></a></span></span><span class="separator"> / </span><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/sgross2130/prodigy-mobile/tree/master/js" class="js-slide-to" data-branch="master" data-direction="back" itemscope="url"><span itemprop="title">js</span></a></span><span class="separator"> / </span><strong class="final-path">handlebars.js</strong> <span class="js-zeroclipboard zeroclipboard-button" data-clipboard-text="js/handlebars.js" data-copied-hint="copied!" title="copy to clipboard"><span class="mini-icon mini-icon-clipboard"></span></span>
        </div>

      <a href="/sgross2130/prodigy-mobile/find/master" class="js-slide-to" data-hotkey="t" style="display:none">Show File Finder</a>


        <div class="commit commit-loader file-history-tease js-deferred-content" data-url="/sgross2130/prodigy-mobile/contributors/master/js/handlebars.js">
          Fetching contributors…

          <div class="participation">
            <p class="loader-loading"><img alt="Octocat-spinner-32-eaf2f5" height="16" src="https://a248.e.akamai.net/assets.github.com/images/spinners/octocat-spinner-32-EAF2F5.gif?1340659530" width="16" /></p>
            <p class="loader-error">Cannot retrieve contributors at this time</p>
          </div>
        </div>

    </div><!-- ./.frame-meta -->

    <div class="frames">
      <div class="frame" data-permalink-url="/sgross2130/prodigy-mobile/blob/1e2da12f935146c27d608cf387bee67ba72b78e0/js/handlebars.js" data-title="prodigy-mobile/js/handlebars.js at master · sgross2130/prodigy-mobile · GitHub" data-type="blob">

        <div id="files" class="bubble">
          <div class="file">
            <div class="meta">
              <div class="info">
                <span class="icon"><b class="mini-icon mini-icon-text-file"></b></span>
                <span class="mode" title="File Mode">file</span>
                  <span>2202 lines (1890 sloc)</span>
                <span>71.956 kb</span>
              </div>
              <div class="actions">
                <div class="button-group">
                        <a class="minibutton"
                           href="/sgross2130/prodigy-mobile/edit/master/js/handlebars.js"
                           data-method="post" rel="nofollow" data-hotkey="e">Edit</a>
                  <a href="/sgross2130/prodigy-mobile/raw/master/js/handlebars.js" class="button minibutton " id="raw-url">Raw</a>
                    <a href="/sgross2130/prodigy-mobile/blame/master/js/handlebars.js" class="button minibutton ">Blame</a>
                  <a href="/sgross2130/prodigy-mobile/commits/master/js/handlebars.js" class="button minibutton " rel="nofollow">History</a>
                </div><!-- /.button-group -->
              </div><!-- /.actions -->

            </div>
                <div class="data type-javascript js-blob-data">
      <table cellpadding="0" cellspacing="0" class="lines">
        <tr>
          <td>
            <pre class="line_numbers"><span id="L1" rel="#L1">1</span>
<span id="L2" rel="#L2">2</span>
<span id="L3" rel="#L3">3</span>
<span id="L4" rel="#L4">4</span>
<span id="L5" rel="#L5">5</span>
<span id="L6" rel="#L6">6</span>
<span id="L7" rel="#L7">7</span>
<span id="L8" rel="#L8">8</span>
<span id="L9" rel="#L9">9</span>
<span id="L10" rel="#L10">10</span>
<span id="L11" rel="#L11">11</span>
<span id="L12" rel="#L12">12</span>
<span id="L13" rel="#L13">13</span>
<span id="L14" rel="#L14">14</span>
<span id="L15" rel="#L15">15</span>
<span id="L16" rel="#L16">16</span>
<span id="L17" rel="#L17">17</span>
<span id="L18" rel="#L18">18</span>
<span id="L19" rel="#L19">19</span>
<span id="L20" rel="#L20">20</span>
<span id="L21" rel="#L21">21</span>
<span id="L22" rel="#L22">22</span>
<span id="L23" rel="#L23">23</span>
<span id="L24" rel="#L24">24</span>
<span id="L25" rel="#L25">25</span>
<span id="L26" rel="#L26">26</span>
<span id="L27" rel="#L27">27</span>
<span id="L28" rel="#L28">28</span>
<span id="L29" rel="#L29">29</span>
<span id="L30" rel="#L30">30</span>
<span id="L31" rel="#L31">31</span>
<span id="L32" rel="#L32">32</span>
<span id="L33" rel="#L33">33</span>
<span id="L34" rel="#L34">34</span>
<span id="L35" rel="#L35">35</span>
<span id="L36" rel="#L36">36</span>
<span id="L37" rel="#L37">37</span>
<span id="L38" rel="#L38">38</span>
<span id="L39" rel="#L39">39</span>
<span id="L40" rel="#L40">40</span>
<span id="L41" rel="#L41">41</span>
<span id="L42" rel="#L42">42</span>
<span id="L43" rel="#L43">43</span>
<span id="L44" rel="#L44">44</span>
<span id="L45" rel="#L45">45</span>
<span id="L46" rel="#L46">46</span>
<span id="L47" rel="#L47">47</span>
<span id="L48" rel="#L48">48</span>
<span id="L49" rel="#L49">49</span>
<span id="L50" rel="#L50">50</span>
<span id="L51" rel="#L51">51</span>
<span id="L52" rel="#L52">52</span>
<span id="L53" rel="#L53">53</span>
<span id="L54" rel="#L54">54</span>
<span id="L55" rel="#L55">55</span>
<span id="L56" rel="#L56">56</span>
<span id="L57" rel="#L57">57</span>
<span id="L58" rel="#L58">58</span>
<span id="L59" rel="#L59">59</span>
<span id="L60" rel="#L60">60</span>
<span id="L61" rel="#L61">61</span>
<span id="L62" rel="#L62">62</span>
<span id="L63" rel="#L63">63</span>
<span id="L64" rel="#L64">64</span>
<span id="L65" rel="#L65">65</span>
<span id="L66" rel="#L66">66</span>
<span id="L67" rel="#L67">67</span>
<span id="L68" rel="#L68">68</span>
<span id="L69" rel="#L69">69</span>
<span id="L70" rel="#L70">70</span>
<span id="L71" rel="#L71">71</span>
<span id="L72" rel="#L72">72</span>
<span id="L73" rel="#L73">73</span>
<span id="L74" rel="#L74">74</span>
<span id="L75" rel="#L75">75</span>
<span id="L76" rel="#L76">76</span>
<span id="L77" rel="#L77">77</span>
<span id="L78" rel="#L78">78</span>
<span id="L79" rel="#L79">79</span>
<span id="L80" rel="#L80">80</span>
<span id="L81" rel="#L81">81</span>
<span id="L82" rel="#L82">82</span>
<span id="L83" rel="#L83">83</span>
<span id="L84" rel="#L84">84</span>
<span id="L85" rel="#L85">85</span>
<span id="L86" rel="#L86">86</span>
<span id="L87" rel="#L87">87</span>
<span id="L88" rel="#L88">88</span>
<span id="L89" rel="#L89">89</span>
<span id="L90" rel="#L90">90</span>
<span id="L91" rel="#L91">91</span>
<span id="L92" rel="#L92">92</span>
<span id="L93" rel="#L93">93</span>
<span id="L94" rel="#L94">94</span>
<span id="L95" rel="#L95">95</span>
<span id="L96" rel="#L96">96</span>
<span id="L97" rel="#L97">97</span>
<span id="L98" rel="#L98">98</span>
<span id="L99" rel="#L99">99</span>
<span id="L100" rel="#L100">100</span>
<span id="L101" rel="#L101">101</span>
<span id="L102" rel="#L102">102</span>
<span id="L103" rel="#L103">103</span>
<span id="L104" rel="#L104">104</span>
<span id="L105" rel="#L105">105</span>
<span id="L106" rel="#L106">106</span>
<span id="L107" rel="#L107">107</span>
<span id="L108" rel="#L108">108</span>
<span id="L109" rel="#L109">109</span>
<span id="L110" rel="#L110">110</span>
<span id="L111" rel="#L111">111</span>
<span id="L112" rel="#L112">112</span>
<span id="L113" rel="#L113">113</span>
<span id="L114" rel="#L114">114</span>
<span id="L115" rel="#L115">115</span>
<span id="L116" rel="#L116">116</span>
<span id="L117" rel="#L117">117</span>
<span id="L118" rel="#L118">118</span>
<span id="L119" rel="#L119">119</span>
<span id="L120" rel="#L120">120</span>
<span id="L121" rel="#L121">121</span>
<span id="L122" rel="#L122">122</span>
<span id="L123" rel="#L123">123</span>
<span id="L124" rel="#L124">124</span>
<span id="L125" rel="#L125">125</span>
<span id="L126" rel="#L126">126</span>
<span id="L127" rel="#L127">127</span>
<span id="L128" rel="#L128">128</span>
<span id="L129" rel="#L129">129</span>
<span id="L130" rel="#L130">130</span>
<span id="L131" rel="#L131">131</span>
<span id="L132" rel="#L132">132</span>
<span id="L133" rel="#L133">133</span>
<span id="L134" rel="#L134">134</span>
<span id="L135" rel="#L135">135</span>
<span id="L136" rel="#L136">136</span>
<span id="L137" rel="#L137">137</span>
<span id="L138" rel="#L138">138</span>
<span id="L139" rel="#L139">139</span>
<span id="L140" rel="#L140">140</span>
<span id="L141" rel="#L141">141</span>
<span id="L142" rel="#L142">142</span>
<span id="L143" rel="#L143">143</span>
<span id="L144" rel="#L144">144</span>
<span id="L145" rel="#L145">145</span>
<span id="L146" rel="#L146">146</span>
<span id="L147" rel="#L147">147</span>
<span id="L148" rel="#L148">148</span>
<span id="L149" rel="#L149">149</span>
<span id="L150" rel="#L150">150</span>
<span id="L151" rel="#L151">151</span>
<span id="L152" rel="#L152">152</span>
<span id="L153" rel="#L153">153</span>
<span id="L154" rel="#L154">154</span>
<span id="L155" rel="#L155">155</span>
<span id="L156" rel="#L156">156</span>
<span id="L157" rel="#L157">157</span>
<span id="L158" rel="#L158">158</span>
<span id="L159" rel="#L159">159</span>
<span id="L160" rel="#L160">160</span>
<span id="L161" rel="#L161">161</span>
<span id="L162" rel="#L162">162</span>
<span id="L163" rel="#L163">163</span>
<span id="L164" rel="#L164">164</span>
<span id="L165" rel="#L165">165</span>
<span id="L166" rel="#L166">166</span>
<span id="L167" rel="#L167">167</span>
<span id="L168" rel="#L168">168</span>
<span id="L169" rel="#L169">169</span>
<span id="L170" rel="#L170">170</span>
<span id="L171" rel="#L171">171</span>
<span id="L172" rel="#L172">172</span>
<span id="L173" rel="#L173">173</span>
<span id="L174" rel="#L174">174</span>
<span id="L175" rel="#L175">175</span>
<span id="L176" rel="#L176">176</span>
<span id="L177" rel="#L177">177</span>
<span id="L178" rel="#L178">178</span>
<span id="L179" rel="#L179">179</span>
<span id="L180" rel="#L180">180</span>
<span id="L181" rel="#L181">181</span>
<span id="L182" rel="#L182">182</span>
<span id="L183" rel="#L183">183</span>
<span id="L184" rel="#L184">184</span>
<span id="L185" rel="#L185">185</span>
<span id="L186" rel="#L186">186</span>
<span id="L187" rel="#L187">187</span>
<span id="L188" rel="#L188">188</span>
<span id="L189" rel="#L189">189</span>
<span id="L190" rel="#L190">190</span>
<span id="L191" rel="#L191">191</span>
<span id="L192" rel="#L192">192</span>
<span id="L193" rel="#L193">193</span>
<span id="L194" rel="#L194">194</span>
<span id="L195" rel="#L195">195</span>
<span id="L196" rel="#L196">196</span>
<span id="L197" rel="#L197">197</span>
<span id="L198" rel="#L198">198</span>
<span id="L199" rel="#L199">199</span>
<span id="L200" rel="#L200">200</span>
<span id="L201" rel="#L201">201</span>
<span id="L202" rel="#L202">202</span>
<span id="L203" rel="#L203">203</span>
<span id="L204" rel="#L204">204</span>
<span id="L205" rel="#L205">205</span>
<span id="L206" rel="#L206">206</span>
<span id="L207" rel="#L207">207</span>
<span id="L208" rel="#L208">208</span>
<span id="L209" rel="#L209">209</span>
<span id="L210" rel="#L210">210</span>
<span id="L211" rel="#L211">211</span>
<span id="L212" rel="#L212">212</span>
<span id="L213" rel="#L213">213</span>
<span id="L214" rel="#L214">214</span>
<span id="L215" rel="#L215">215</span>
<span id="L216" rel="#L216">216</span>
<span id="L217" rel="#L217">217</span>
<span id="L218" rel="#L218">218</span>
<span id="L219" rel="#L219">219</span>
<span id="L220" rel="#L220">220</span>
<span id="L221" rel="#L221">221</span>
<span id="L222" rel="#L222">222</span>
<span id="L223" rel="#L223">223</span>
<span id="L224" rel="#L224">224</span>
<span id="L225" rel="#L225">225</span>
<span id="L226" rel="#L226">226</span>
<span id="L227" rel="#L227">227</span>
<span id="L228" rel="#L228">228</span>
<span id="L229" rel="#L229">229</span>
<span id="L230" rel="#L230">230</span>
<span id="L231" rel="#L231">231</span>
<span id="L232" rel="#L232">232</span>
<span id="L233" rel="#L233">233</span>
<span id="L234" rel="#L234">234</span>
<span id="L235" rel="#L235">235</span>
<span id="L236" rel="#L236">236</span>
<span id="L237" rel="#L237">237</span>
<span id="L238" rel="#L238">238</span>
<span id="L239" rel="#L239">239</span>
<span id="L240" rel="#L240">240</span>
<span id="L241" rel="#L241">241</span>
<span id="L242" rel="#L242">242</span>
<span id="L243" rel="#L243">243</span>
<span id="L244" rel="#L244">244</span>
<span id="L245" rel="#L245">245</span>
<span id="L246" rel="#L246">246</span>
<span id="L247" rel="#L247">247</span>
<span id="L248" rel="#L248">248</span>
<span id="L249" rel="#L249">249</span>
<span id="L250" rel="#L250">250</span>
<span id="L251" rel="#L251">251</span>
<span id="L252" rel="#L252">252</span>
<span id="L253" rel="#L253">253</span>
<span id="L254" rel="#L254">254</span>
<span id="L255" rel="#L255">255</span>
<span id="L256" rel="#L256">256</span>
<span id="L257" rel="#L257">257</span>
<span id="L258" rel="#L258">258</span>
<span id="L259" rel="#L259">259</span>
<span id="L260" rel="#L260">260</span>
<span id="L261" rel="#L261">261</span>
<span id="L262" rel="#L262">262</span>
<span id="L263" rel="#L263">263</span>
<span id="L264" rel="#L264">264</span>
<span id="L265" rel="#L265">265</span>
<span id="L266" rel="#L266">266</span>
<span id="L267" rel="#L267">267</span>
<span id="L268" rel="#L268">268</span>
<span id="L269" rel="#L269">269</span>
<span id="L270" rel="#L270">270</span>
<span id="L271" rel="#L271">271</span>
<span id="L272" rel="#L272">272</span>
<span id="L273" rel="#L273">273</span>
<span id="L274" rel="#L274">274</span>
<span id="L275" rel="#L275">275</span>
<span id="L276" rel="#L276">276</span>
<span id="L277" rel="#L277">277</span>
<span id="L278" rel="#L278">278</span>
<span id="L279" rel="#L279">279</span>
<span id="L280" rel="#L280">280</span>
<span id="L281" rel="#L281">281</span>
<span id="L282" rel="#L282">282</span>
<span id="L283" rel="#L283">283</span>
<span id="L284" rel="#L284">284</span>
<span id="L285" rel="#L285">285</span>
<span id="L286" rel="#L286">286</span>
<span id="L287" rel="#L287">287</span>
<span id="L288" rel="#L288">288</span>
<span id="L289" rel="#L289">289</span>
<span id="L290" rel="#L290">290</span>
<span id="L291" rel="#L291">291</span>
<span id="L292" rel="#L292">292</span>
<span id="L293" rel="#L293">293</span>
<span id="L294" rel="#L294">294</span>
<span id="L295" rel="#L295">295</span>
<span id="L296" rel="#L296">296</span>
<span id="L297" rel="#L297">297</span>
<span id="L298" rel="#L298">298</span>
<span id="L299" rel="#L299">299</span>
<span id="L300" rel="#L300">300</span>
<span id="L301" rel="#L301">301</span>
<span id="L302" rel="#L302">302</span>
<span id="L303" rel="#L303">303</span>
<span id="L304" rel="#L304">304</span>
<span id="L305" rel="#L305">305</span>
<span id="L306" rel="#L306">306</span>
<span id="L307" rel="#L307">307</span>
<span id="L308" rel="#L308">308</span>
<span id="L309" rel="#L309">309</span>
<span id="L310" rel="#L310">310</span>
<span id="L311" rel="#L311">311</span>
<span id="L312" rel="#L312">312</span>
<span id="L313" rel="#L313">313</span>
<span id="L314" rel="#L314">314</span>
<span id="L315" rel="#L315">315</span>
<span id="L316" rel="#L316">316</span>
<span id="L317" rel="#L317">317</span>
<span id="L318" rel="#L318">318</span>
<span id="L319" rel="#L319">319</span>
<span id="L320" rel="#L320">320</span>
<span id="L321" rel="#L321">321</span>
<span id="L322" rel="#L322">322</span>
<span id="L323" rel="#L323">323</span>
<span id="L324" rel="#L324">324</span>
<span id="L325" rel="#L325">325</span>
<span id="L326" rel="#L326">326</span>
<span id="L327" rel="#L327">327</span>
<span id="L328" rel="#L328">328</span>
<span id="L329" rel="#L329">329</span>
<span id="L330" rel="#L330">330</span>
<span id="L331" rel="#L331">331</span>
<span id="L332" rel="#L332">332</span>
<span id="L333" rel="#L333">333</span>
<span id="L334" rel="#L334">334</span>
<span id="L335" rel="#L335">335</span>
<span id="L336" rel="#L336">336</span>
<span id="L337" rel="#L337">337</span>
<span id="L338" rel="#L338">338</span>
<span id="L339" rel="#L339">339</span>
<span id="L340" rel="#L340">340</span>
<span id="L341" rel="#L341">341</span>
<span id="L342" rel="#L342">342</span>
<span id="L343" rel="#L343">343</span>
<span id="L344" rel="#L344">344</span>
<span id="L345" rel="#L345">345</span>
<span id="L346" rel="#L346">346</span>
<span id="L347" rel="#L347">347</span>
<span id="L348" rel="#L348">348</span>
<span id="L349" rel="#L349">349</span>
<span id="L350" rel="#L350">350</span>
<span id="L351" rel="#L351">351</span>
<span id="L352" rel="#L352">352</span>
<span id="L353" rel="#L353">353</span>
<span id="L354" rel="#L354">354</span>
<span id="L355" rel="#L355">355</span>
<span id="L356" rel="#L356">356</span>
<span id="L357" rel="#L357">357</span>
<span id="L358" rel="#L358">358</span>
<span id="L359" rel="#L359">359</span>
<span id="L360" rel="#L360">360</span>
<span id="L361" rel="#L361">361</span>
<span id="L362" rel="#L362">362</span>
<span id="L363" rel="#L363">363</span>
<span id="L364" rel="#L364">364</span>
<span id="L365" rel="#L365">365</span>
<span id="L366" rel="#L366">366</span>
<span id="L367" rel="#L367">367</span>
<span id="L368" rel="#L368">368</span>
<span id="L369" rel="#L369">369</span>
<span id="L370" rel="#L370">370</span>
<span id="L371" rel="#L371">371</span>
<span id="L372" rel="#L372">372</span>
<span id="L373" rel="#L373">373</span>
<span id="L374" rel="#L374">374</span>
<span id="L375" rel="#L375">375</span>
<span id="L376" rel="#L376">376</span>
<span id="L377" rel="#L377">377</span>
<span id="L378" rel="#L378">378</span>
<span id="L379" rel="#L379">379</span>
<span id="L380" rel="#L380">380</span>
<span id="L381" rel="#L381">381</span>
<span id="L382" rel="#L382">382</span>
<span id="L383" rel="#L383">383</span>
<span id="L384" rel="#L384">384</span>
<span id="L385" rel="#L385">385</span>
<span id="L386" rel="#L386">386</span>
<span id="L387" rel="#L387">387</span>
<span id="L388" rel="#L388">388</span>
<span id="L389" rel="#L389">389</span>
<span id="L390" rel="#L390">390</span>
<span id="L391" rel="#L391">391</span>
<span id="L392" rel="#L392">392</span>
<span id="L393" rel="#L393">393</span>
<span id="L394" rel="#L394">394</span>
<span id="L395" rel="#L395">395</span>
<span id="L396" rel="#L396">396</span>
<span id="L397" rel="#L397">397</span>
<span id="L398" rel="#L398">398</span>
<span id="L399" rel="#L399">399</span>
<span id="L400" rel="#L400">400</span>
<span id="L401" rel="#L401">401</span>
<span id="L402" rel="#L402">402</span>
<span id="L403" rel="#L403">403</span>
<span id="L404" rel="#L404">404</span>
<span id="L405" rel="#L405">405</span>
<span id="L406" rel="#L406">406</span>
<span id="L407" rel="#L407">407</span>
<span id="L408" rel="#L408">408</span>
<span id="L409" rel="#L409">409</span>
<span id="L410" rel="#L410">410</span>
<span id="L411" rel="#L411">411</span>
<span id="L412" rel="#L412">412</span>
<span id="L413" rel="#L413">413</span>
<span id="L414" rel="#L414">414</span>
<span id="L415" rel="#L415">415</span>
<span id="L416" rel="#L416">416</span>
<span id="L417" rel="#L417">417</span>
<span id="L418" rel="#L418">418</span>
<span id="L419" rel="#L419">419</span>
<span id="L420" rel="#L420">420</span>
<span id="L421" rel="#L421">421</span>
<span id="L422" rel="#L422">422</span>
<span id="L423" rel="#L423">423</span>
<span id="L424" rel="#L424">424</span>
<span id="L425" rel="#L425">425</span>
<span id="L426" rel="#L426">426</span>
<span id="L427" rel="#L427">427</span>
<span id="L428" rel="#L428">428</span>
<span id="L429" rel="#L429">429</span>
<span id="L430" rel="#L430">430</span>
<span id="L431" rel="#L431">431</span>
<span id="L432" rel="#L432">432</span>
<span id="L433" rel="#L433">433</span>
<span id="L434" rel="#L434">434</span>
<span id="L435" rel="#L435">435</span>
<span id="L436" rel="#L436">436</span>
<span id="L437" rel="#L437">437</span>
<span id="L438" rel="#L438">438</span>
<span id="L439" rel="#L439">439</span>
<span id="L440" rel="#L440">440</span>
<span id="L441" rel="#L441">441</span>
<span id="L442" rel="#L442">442</span>
<span id="L443" rel="#L443">443</span>
<span id="L444" rel="#L444">444</span>
<span id="L445" rel="#L445">445</span>
<span id="L446" rel="#L446">446</span>
<span id="L447" rel="#L447">447</span>
<span id="L448" rel="#L448">448</span>
<span id="L449" rel="#L449">449</span>
<span id="L450" rel="#L450">450</span>
<span id="L451" rel="#L451">451</span>
<span id="L452" rel="#L452">452</span>
<span id="L453" rel="#L453">453</span>
<span id="L454" rel="#L454">454</span>
<span id="L455" rel="#L455">455</span>
<span id="L456" rel="#L456">456</span>
<span id="L457" rel="#L457">457</span>
<span id="L458" rel="#L458">458</span>
<span id="L459" rel="#L459">459</span>
<span id="L460" rel="#L460">460</span>
<span id="L461" rel="#L461">461</span>
<span id="L462" rel="#L462">462</span>
<span id="L463" rel="#L463">463</span>
<span id="L464" rel="#L464">464</span>
<span id="L465" rel="#L465">465</span>
<span id="L466" rel="#L466">466</span>
<span id="L467" rel="#L467">467</span>
<span id="L468" rel="#L468">468</span>
<span id="L469" rel="#L469">469</span>
<span id="L470" rel="#L470">470</span>
<span id="L471" rel="#L471">471</span>
<span id="L472" rel="#L472">472</span>
<span id="L473" rel="#L473">473</span>
<span id="L474" rel="#L474">474</span>
<span id="L475" rel="#L475">475</span>
<span id="L476" rel="#L476">476</span>
<span id="L477" rel="#L477">477</span>
<span id="L478" rel="#L478">478</span>
<span id="L479" rel="#L479">479</span>
<span id="L480" rel="#L480">480</span>
<span id="L481" rel="#L481">481</span>
<span id="L482" rel="#L482">482</span>
<span id="L483" rel="#L483">483</span>
<span id="L484" rel="#L484">484</span>
<span id="L485" rel="#L485">485</span>
<span id="L486" rel="#L486">486</span>
<span id="L487" rel="#L487">487</span>
<span id="L488" rel="#L488">488</span>
<span id="L489" rel="#L489">489</span>
<span id="L490" rel="#L490">490</span>
<span id="L491" rel="#L491">491</span>
<span id="L492" rel="#L492">492</span>
<span id="L493" rel="#L493">493</span>
<span id="L494" rel="#L494">494</span>
<span id="L495" rel="#L495">495</span>
<span id="L496" rel="#L496">496</span>
<span id="L497" rel="#L497">497</span>
<span id="L498" rel="#L498">498</span>
<span id="L499" rel="#L499">499</span>
<span id="L500" rel="#L500">500</span>
<span id="L501" rel="#L501">501</span>
<span id="L502" rel="#L502">502</span>
<span id="L503" rel="#L503">503</span>
<span id="L504" rel="#L504">504</span>
<span id="L505" rel="#L505">505</span>
<span id="L506" rel="#L506">506</span>
<span id="L507" rel="#L507">507</span>
<span id="L508" rel="#L508">508</span>
<span id="L509" rel="#L509">509</span>
<span id="L510" rel="#L510">510</span>
<span id="L511" rel="#L511">511</span>
<span id="L512" rel="#L512">512</span>
<span id="L513" rel="#L513">513</span>
<span id="L514" rel="#L514">514</span>
<span id="L515" rel="#L515">515</span>
<span id="L516" rel="#L516">516</span>
<span id="L517" rel="#L517">517</span>
<span id="L518" rel="#L518">518</span>
<span id="L519" rel="#L519">519</span>
<span id="L520" rel="#L520">520</span>
<span id="L521" rel="#L521">521</span>
<span id="L522" rel="#L522">522</span>
<span id="L523" rel="#L523">523</span>
<span id="L524" rel="#L524">524</span>
<span id="L525" rel="#L525">525</span>
<span id="L526" rel="#L526">526</span>
<span id="L527" rel="#L527">527</span>
<span id="L528" rel="#L528">528</span>
<span id="L529" rel="#L529">529</span>
<span id="L530" rel="#L530">530</span>
<span id="L531" rel="#L531">531</span>
<span id="L532" rel="#L532">532</span>
<span id="L533" rel="#L533">533</span>
<span id="L534" rel="#L534">534</span>
<span id="L535" rel="#L535">535</span>
<span id="L536" rel="#L536">536</span>
<span id="L537" rel="#L537">537</span>
<span id="L538" rel="#L538">538</span>
<span id="L539" rel="#L539">539</span>
<span id="L540" rel="#L540">540</span>
<span id="L541" rel="#L541">541</span>
<span id="L542" rel="#L542">542</span>
<span id="L543" rel="#L543">543</span>
<span id="L544" rel="#L544">544</span>
<span id="L545" rel="#L545">545</span>
<span id="L546" rel="#L546">546</span>
<span id="L547" rel="#L547">547</span>
<span id="L548" rel="#L548">548</span>
<span id="L549" rel="#L549">549</span>
<span id="L550" rel="#L550">550</span>
<span id="L551" rel="#L551">551</span>
<span id="L552" rel="#L552">552</span>
<span id="L553" rel="#L553">553</span>
<span id="L554" rel="#L554">554</span>
<span id="L555" rel="#L555">555</span>
<span id="L556" rel="#L556">556</span>
<span id="L557" rel="#L557">557</span>
<span id="L558" rel="#L558">558</span>
<span id="L559" rel="#L559">559</span>
<span id="L560" rel="#L560">560</span>
<span id="L561" rel="#L561">561</span>
<span id="L562" rel="#L562">562</span>
<span id="L563" rel="#L563">563</span>
<span id="L564" rel="#L564">564</span>
<span id="L565" rel="#L565">565</span>
<span id="L566" rel="#L566">566</span>
<span id="L567" rel="#L567">567</span>
<span id="L568" rel="#L568">568</span>
<span id="L569" rel="#L569">569</span>
<span id="L570" rel="#L570">570</span>
<span id="L571" rel="#L571">571</span>
<span id="L572" rel="#L572">572</span>
<span id="L573" rel="#L573">573</span>
<span id="L574" rel="#L574">574</span>
<span id="L575" rel="#L575">575</span>
<span id="L576" rel="#L576">576</span>
<span id="L577" rel="#L577">577</span>
<span id="L578" rel="#L578">578</span>
<span id="L579" rel="#L579">579</span>
<span id="L580" rel="#L580">580</span>
<span id="L581" rel="#L581">581</span>
<span id="L582" rel="#L582">582</span>
<span id="L583" rel="#L583">583</span>
<span id="L584" rel="#L584">584</span>
<span id="L585" rel="#L585">585</span>
<span id="L586" rel="#L586">586</span>
<span id="L587" rel="#L587">587</span>
<span id="L588" rel="#L588">588</span>
<span id="L589" rel="#L589">589</span>
<span id="L590" rel="#L590">590</span>
<span id="L591" rel="#L591">591</span>
<span id="L592" rel="#L592">592</span>
<span id="L593" rel="#L593">593</span>
<span id="L594" rel="#L594">594</span>
<span id="L595" rel="#L595">595</span>
<span id="L596" rel="#L596">596</span>
<span id="L597" rel="#L597">597</span>
<span id="L598" rel="#L598">598</span>
<span id="L599" rel="#L599">599</span>
<span id="L600" rel="#L600">600</span>
<span id="L601" rel="#L601">601</span>
<span id="L602" rel="#L602">602</span>
<span id="L603" rel="#L603">603</span>
<span id="L604" rel="#L604">604</span>
<span id="L605" rel="#L605">605</span>
<span id="L606" rel="#L606">606</span>
<span id="L607" rel="#L607">607</span>
<span id="L608" rel="#L608">608</span>
<span id="L609" rel="#L609">609</span>
<span id="L610" rel="#L610">610</span>
<span id="L611" rel="#L611">611</span>
<span id="L612" rel="#L612">612</span>
<span id="L613" rel="#L613">613</span>
<span id="L614" rel="#L614">614</span>
<span id="L615" rel="#L615">615</span>
<span id="L616" rel="#L616">616</span>
<span id="L617" rel="#L617">617</span>
<span id="L618" rel="#L618">618</span>
<span id="L619" rel="#L619">619</span>
<span id="L620" rel="#L620">620</span>
<span id="L621" rel="#L621">621</span>
<span id="L622" rel="#L622">622</span>
<span id="L623" rel="#L623">623</span>
<span id="L624" rel="#L624">624</span>
<span id="L625" rel="#L625">625</span>
<span id="L626" rel="#L626">626</span>
<span id="L627" rel="#L627">627</span>
<span id="L628" rel="#L628">628</span>
<span id="L629" rel="#L629">629</span>
<span id="L630" rel="#L630">630</span>
<span id="L631" rel="#L631">631</span>
<span id="L632" rel="#L632">632</span>
<span id="L633" rel="#L633">633</span>
<span id="L634" rel="#L634">634</span>
<span id="L635" rel="#L635">635</span>
<span id="L636" rel="#L636">636</span>
<span id="L637" rel="#L637">637</span>
<span id="L638" rel="#L638">638</span>
<span id="L639" rel="#L639">639</span>
<span id="L640" rel="#L640">640</span>
<span id="L641" rel="#L641">641</span>
<span id="L642" rel="#L642">642</span>
<span id="L643" rel="#L643">643</span>
<span id="L644" rel="#L644">644</span>
<span id="L645" rel="#L645">645</span>
<span id="L646" rel="#L646">646</span>
<span id="L647" rel="#L647">647</span>
<span id="L648" rel="#L648">648</span>
<span id="L649" rel="#L649">649</span>
<span id="L650" rel="#L650">650</span>
<span id="L651" rel="#L651">651</span>
<span id="L652" rel="#L652">652</span>
<span id="L653" rel="#L653">653</span>
<span id="L654" rel="#L654">654</span>
<span id="L655" rel="#L655">655</span>
<span id="L656" rel="#L656">656</span>
<span id="L657" rel="#L657">657</span>
<span id="L658" rel="#L658">658</span>
<span id="L659" rel="#L659">659</span>
<span id="L660" rel="#L660">660</span>
<span id="L661" rel="#L661">661</span>
<span id="L662" rel="#L662">662</span>
<span id="L663" rel="#L663">663</span>
<span id="L664" rel="#L664">664</span>
<span id="L665" rel="#L665">665</span>
<span id="L666" rel="#L666">666</span>
<span id="L667" rel="#L667">667</span>
<span id="L668" rel="#L668">668</span>
<span id="L669" rel="#L669">669</span>
<span id="L670" rel="#L670">670</span>
<span id="L671" rel="#L671">671</span>
<span id="L672" rel="#L672">672</span>
<span id="L673" rel="#L673">673</span>
<span id="L674" rel="#L674">674</span>
<span id="L675" rel="#L675">675</span>
<span id="L676" rel="#L676">676</span>
<span id="L677" rel="#L677">677</span>
<span id="L678" rel="#L678">678</span>
<span id="L679" rel="#L679">679</span>
<span id="L680" rel="#L680">680</span>
<span id="L681" rel="#L681">681</span>
<span id="L682" rel="#L682">682</span>
<span id="L683" rel="#L683">683</span>
<span id="L684" rel="#L684">684</span>
<span id="L685" rel="#L685">685</span>
<span id="L686" rel="#L686">686</span>
<span id="L687" rel="#L687">687</span>
<span id="L688" rel="#L688">688</span>
<span id="L689" rel="#L689">689</span>
<span id="L690" rel="#L690">690</span>
<span id="L691" rel="#L691">691</span>
<span id="L692" rel="#L692">692</span>
<span id="L693" rel="#L693">693</span>
<span id="L694" rel="#L694">694</span>
<span id="L695" rel="#L695">695</span>
<span id="L696" rel="#L696">696</span>
<span id="L697" rel="#L697">697</span>
<span id="L698" rel="#L698">698</span>
<span id="L699" rel="#L699">699</span>
<span id="L700" rel="#L700">700</span>
<span id="L701" rel="#L701">701</span>
<span id="L702" rel="#L702">702</span>
<span id="L703" rel="#L703">703</span>
<span id="L704" rel="#L704">704</span>
<span id="L705" rel="#L705">705</span>
<span id="L706" rel="#L706">706</span>
<span id="L707" rel="#L707">707</span>
<span id="L708" rel="#L708">708</span>
<span id="L709" rel="#L709">709</span>
<span id="L710" rel="#L710">710</span>
<span id="L711" rel="#L711">711</span>
<span id="L712" rel="#L712">712</span>
<span id="L713" rel="#L713">713</span>
<span id="L714" rel="#L714">714</span>
<span id="L715" rel="#L715">715</span>
<span id="L716" rel="#L716">716</span>
<span id="L717" rel="#L717">717</span>
<span id="L718" rel="#L718">718</span>
<span id="L719" rel="#L719">719</span>
<span id="L720" rel="#L720">720</span>
<span id="L721" rel="#L721">721</span>
<span id="L722" rel="#L722">722</span>
<span id="L723" rel="#L723">723</span>
<span id="L724" rel="#L724">724</span>
<span id="L725" rel="#L725">725</span>
<span id="L726" rel="#L726">726</span>
<span id="L727" rel="#L727">727</span>
<span id="L728" rel="#L728">728</span>
<span id="L729" rel="#L729">729</span>
<span id="L730" rel="#L730">730</span>
<span id="L731" rel="#L731">731</span>
<span id="L732" rel="#L732">732</span>
<span id="L733" rel="#L733">733</span>
<span id="L734" rel="#L734">734</span>
<span id="L735" rel="#L735">735</span>
<span id="L736" rel="#L736">736</span>
<span id="L737" rel="#L737">737</span>
<span id="L738" rel="#L738">738</span>
<span id="L739" rel="#L739">739</span>
<span id="L740" rel="#L740">740</span>
<span id="L741" rel="#L741">741</span>
<span id="L742" rel="#L742">742</span>
<span id="L743" rel="#L743">743</span>
<span id="L744" rel="#L744">744</span>
<span id="L745" rel="#L745">745</span>
<span id="L746" rel="#L746">746</span>
<span id="L747" rel="#L747">747</span>
<span id="L748" rel="#L748">748</span>
<span id="L749" rel="#L749">749</span>
<span id="L750" rel="#L750">750</span>
<span id="L751" rel="#L751">751</span>
<span id="L752" rel="#L752">752</span>
<span id="L753" rel="#L753">753</span>
<span id="L754" rel="#L754">754</span>
<span id="L755" rel="#L755">755</span>
<span id="L756" rel="#L756">756</span>
<span id="L757" rel="#L757">757</span>
<span id="L758" rel="#L758">758</span>
<span id="L759" rel="#L759">759</span>
<span id="L760" rel="#L760">760</span>
<span id="L761" rel="#L761">761</span>
<span id="L762" rel="#L762">762</span>
<span id="L763" rel="#L763">763</span>
<span id="L764" rel="#L764">764</span>
<span id="L765" rel="#L765">765</span>
<span id="L766" rel="#L766">766</span>
<span id="L767" rel="#L767">767</span>
<span id="L768" rel="#L768">768</span>
<span id="L769" rel="#L769">769</span>
<span id="L770" rel="#L770">770</span>
<span id="L771" rel="#L771">771</span>
<span id="L772" rel="#L772">772</span>
<span id="L773" rel="#L773">773</span>
<span id="L774" rel="#L774">774</span>
<span id="L775" rel="#L775">775</span>
<span id="L776" rel="#L776">776</span>
<span id="L777" rel="#L777">777</span>
<span id="L778" rel="#L778">778</span>
<span id="L779" rel="#L779">779</span>
<span id="L780" rel="#L780">780</span>
<span id="L781" rel="#L781">781</span>
<span id="L782" rel="#L782">782</span>
<span id="L783" rel="#L783">783</span>
<span id="L784" rel="#L784">784</span>
<span id="L785" rel="#L785">785</span>
<span id="L786" rel="#L786">786</span>
<span id="L787" rel="#L787">787</span>
<span id="L788" rel="#L788">788</span>
<span id="L789" rel="#L789">789</span>
<span id="L790" rel="#L790">790</span>
<span id="L791" rel="#L791">791</span>
<span id="L792" rel="#L792">792</span>
<span id="L793" rel="#L793">793</span>
<span id="L794" rel="#L794">794</span>
<span id="L795" rel="#L795">795</span>
<span id="L796" rel="#L796">796</span>
<span id="L797" rel="#L797">797</span>
<span id="L798" rel="#L798">798</span>
<span id="L799" rel="#L799">799</span>
<span id="L800" rel="#L800">800</span>
<span id="L801" rel="#L801">801</span>
<span id="L802" rel="#L802">802</span>
<span id="L803" rel="#L803">803</span>
<span id="L804" rel="#L804">804</span>
<span id="L805" rel="#L805">805</span>
<span id="L806" rel="#L806">806</span>
<span id="L807" rel="#L807">807</span>
<span id="L808" rel="#L808">808</span>
<span id="L809" rel="#L809">809</span>
<span id="L810" rel="#L810">810</span>
<span id="L811" rel="#L811">811</span>
<span id="L812" rel="#L812">812</span>
<span id="L813" rel="#L813">813</span>
<span id="L814" rel="#L814">814</span>
<span id="L815" rel="#L815">815</span>
<span id="L816" rel="#L816">816</span>
<span id="L817" rel="#L817">817</span>
<span id="L818" rel="#L818">818</span>
<span id="L819" rel="#L819">819</span>
<span id="L820" rel="#L820">820</span>
<span id="L821" rel="#L821">821</span>
<span id="L822" rel="#L822">822</span>
<span id="L823" rel="#L823">823</span>
<span id="L824" rel="#L824">824</span>
<span id="L825" rel="#L825">825</span>
<span id="L826" rel="#L826">826</span>
<span id="L827" rel="#L827">827</span>
<span id="L828" rel="#L828">828</span>
<span id="L829" rel="#L829">829</span>
<span id="L830" rel="#L830">830</span>
<span id="L831" rel="#L831">831</span>
<span id="L832" rel="#L832">832</span>
<span id="L833" rel="#L833">833</span>
<span id="L834" rel="#L834">834</span>
<span id="L835" rel="#L835">835</span>
<span id="L836" rel="#L836">836</span>
<span id="L837" rel="#L837">837</span>
<span id="L838" rel="#L838">838</span>
<span id="L839" rel="#L839">839</span>
<span id="L840" rel="#L840">840</span>
<span id="L841" rel="#L841">841</span>
<span id="L842" rel="#L842">842</span>
<span id="L843" rel="#L843">843</span>
<span id="L844" rel="#L844">844</span>
<span id="L845" rel="#L845">845</span>
<span id="L846" rel="#L846">846</span>
<span id="L847" rel="#L847">847</span>
<span id="L848" rel="#L848">848</span>
<span id="L849" rel="#L849">849</span>
<span id="L850" rel="#L850">850</span>
<span id="L851" rel="#L851">851</span>
<span id="L852" rel="#L852">852</span>
<span id="L853" rel="#L853">853</span>
<span id="L854" rel="#L854">854</span>
<span id="L855" rel="#L855">855</span>
<span id="L856" rel="#L856">856</span>
<span id="L857" rel="#L857">857</span>
<span id="L858" rel="#L858">858</span>
<span id="L859" rel="#L859">859</span>
<span id="L860" rel="#L860">860</span>
<span id="L861" rel="#L861">861</span>
<span id="L862" rel="#L862">862</span>
<span id="L863" rel="#L863">863</span>
<span id="L864" rel="#L864">864</span>
<span id="L865" rel="#L865">865</span>
<span id="L866" rel="#L866">866</span>
<span id="L867" rel="#L867">867</span>
<span id="L868" rel="#L868">868</span>
<span id="L869" rel="#L869">869</span>
<span id="L870" rel="#L870">870</span>
<span id="L871" rel="#L871">871</span>
<span id="L872" rel="#L872">872</span>
<span id="L873" rel="#L873">873</span>
<span id="L874" rel="#L874">874</span>
<span id="L875" rel="#L875">875</span>
<span id="L876" rel="#L876">876</span>
<span id="L877" rel="#L877">877</span>
<span id="L878" rel="#L878">878</span>
<span id="L879" rel="#L879">879</span>
<span id="L880" rel="#L880">880</span>
<span id="L881" rel="#L881">881</span>
<span id="L882" rel="#L882">882</span>
<span id="L883" rel="#L883">883</span>
<span id="L884" rel="#L884">884</span>
<span id="L885" rel="#L885">885</span>
<span id="L886" rel="#L886">886</span>
<span id="L887" rel="#L887">887</span>
<span id="L888" rel="#L888">888</span>
<span id="L889" rel="#L889">889</span>
<span id="L890" rel="#L890">890</span>
<span id="L891" rel="#L891">891</span>
<span id="L892" rel="#L892">892</span>
<span id="L893" rel="#L893">893</span>
<span id="L894" rel="#L894">894</span>
<span id="L895" rel="#L895">895</span>
<span id="L896" rel="#L896">896</span>
<span id="L897" rel="#L897">897</span>
<span id="L898" rel="#L898">898</span>
<span id="L899" rel="#L899">899</span>
<span id="L900" rel="#L900">900</span>
<span id="L901" rel="#L901">901</span>
<span id="L902" rel="#L902">902</span>
<span id="L903" rel="#L903">903</span>
<span id="L904" rel="#L904">904</span>
<span id="L905" rel="#L905">905</span>
<span id="L906" rel="#L906">906</span>
<span id="L907" rel="#L907">907</span>
<span id="L908" rel="#L908">908</span>
<span id="L909" rel="#L909">909</span>
<span id="L910" rel="#L910">910</span>
<span id="L911" rel="#L911">911</span>
<span id="L912" rel="#L912">912</span>
<span id="L913" rel="#L913">913</span>
<span id="L914" rel="#L914">914</span>
<span id="L915" rel="#L915">915</span>
<span id="L916" rel="#L916">916</span>
<span id="L917" rel="#L917">917</span>
<span id="L918" rel="#L918">918</span>
<span id="L919" rel="#L919">919</span>
<span id="L920" rel="#L920">920</span>
<span id="L921" rel="#L921">921</span>
<span id="L922" rel="#L922">922</span>
<span id="L923" rel="#L923">923</span>
<span id="L924" rel="#L924">924</span>
<span id="L925" rel="#L925">925</span>
<span id="L926" rel="#L926">926</span>
<span id="L927" rel="#L927">927</span>
<span id="L928" rel="#L928">928</span>
<span id="L929" rel="#L929">929</span>
<span id="L930" rel="#L930">930</span>
<span id="L931" rel="#L931">931</span>
<span id="L932" rel="#L932">932</span>
<span id="L933" rel="#L933">933</span>
<span id="L934" rel="#L934">934</span>
<span id="L935" rel="#L935">935</span>
<span id="L936" rel="#L936">936</span>
<span id="L937" rel="#L937">937</span>
<span id="L938" rel="#L938">938</span>
<span id="L939" rel="#L939">939</span>
<span id="L940" rel="#L940">940</span>
<span id="L941" rel="#L941">941</span>
<span id="L942" rel="#L942">942</span>
<span id="L943" rel="#L943">943</span>
<span id="L944" rel="#L944">944</span>
<span id="L945" rel="#L945">945</span>
<span id="L946" rel="#L946">946</span>
<span id="L947" rel="#L947">947</span>
<span id="L948" rel="#L948">948</span>
<span id="L949" rel="#L949">949</span>
<span id="L950" rel="#L950">950</span>
<span id="L951" rel="#L951">951</span>
<span id="L952" rel="#L952">952</span>
<span id="L953" rel="#L953">953</span>
<span id="L954" rel="#L954">954</span>
<span id="L955" rel="#L955">955</span>
<span id="L956" rel="#L956">956</span>
<span id="L957" rel="#L957">957</span>
<span id="L958" rel="#L958">958</span>
<span id="L959" rel="#L959">959</span>
<span id="L960" rel="#L960">960</span>
<span id="L961" rel="#L961">961</span>
<span id="L962" rel="#L962">962</span>
<span id="L963" rel="#L963">963</span>
<span id="L964" rel="#L964">964</span>
<span id="L965" rel="#L965">965</span>
<span id="L966" rel="#L966">966</span>
<span id="L967" rel="#L967">967</span>
<span id="L968" rel="#L968">968</span>
<span id="L969" rel="#L969">969</span>
<span id="L970" rel="#L970">970</span>
<span id="L971" rel="#L971">971</span>
<span id="L972" rel="#L972">972</span>
<span id="L973" rel="#L973">973</span>
<span id="L974" rel="#L974">974</span>
<span id="L975" rel="#L975">975</span>
<span id="L976" rel="#L976">976</span>
<span id="L977" rel="#L977">977</span>
<span id="L978" rel="#L978">978</span>
<span id="L979" rel="#L979">979</span>
<span id="L980" rel="#L980">980</span>
<span id="L981" rel="#L981">981</span>
<span id="L982" rel="#L982">982</span>
<span id="L983" rel="#L983">983</span>
<span id="L984" rel="#L984">984</span>
<span id="L985" rel="#L985">985</span>
<span id="L986" rel="#L986">986</span>
<span id="L987" rel="#L987">987</span>
<span id="L988" rel="#L988">988</span>
<span id="L989" rel="#L989">989</span>
<span id="L990" rel="#L990">990</span>
<span id="L991" rel="#L991">991</span>
<span id="L992" rel="#L992">992</span>
<span id="L993" rel="#L993">993</span>
<span id="L994" rel="#L994">994</span>
<span id="L995" rel="#L995">995</span>
<span id="L996" rel="#L996">996</span>
<span id="L997" rel="#L997">997</span>
<span id="L998" rel="#L998">998</span>
<span id="L999" rel="#L999">999</span>
<span id="L1000" rel="#L1000">1000</span>
<span id="L1001" rel="#L1001">1001</span>
<span id="L1002" rel="#L1002">1002</span>
<span id="L1003" rel="#L1003">1003</span>
<span id="L1004" rel="#L1004">1004</span>
<span id="L1005" rel="#L1005">1005</span>
<span id="L1006" rel="#L1006">1006</span>
<span id="L1007" rel="#L1007">1007</span>
<span id="L1008" rel="#L1008">1008</span>
<span id="L1009" rel="#L1009">1009</span>
<span id="L1010" rel="#L1010">1010</span>
<span id="L1011" rel="#L1011">1011</span>
<span id="L1012" rel="#L1012">1012</span>
<span id="L1013" rel="#L1013">1013</span>
<span id="L1014" rel="#L1014">1014</span>
<span id="L1015" rel="#L1015">1015</span>
<span id="L1016" rel="#L1016">1016</span>
<span id="L1017" rel="#L1017">1017</span>
<span id="L1018" rel="#L1018">1018</span>
<span id="L1019" rel="#L1019">1019</span>
<span id="L1020" rel="#L1020">1020</span>
<span id="L1021" rel="#L1021">1021</span>
<span id="L1022" rel="#L1022">1022</span>
<span id="L1023" rel="#L1023">1023</span>
<span id="L1024" rel="#L1024">1024</span>
<span id="L1025" rel="#L1025">1025</span>
<span id="L1026" rel="#L1026">1026</span>
<span id="L1027" rel="#L1027">1027</span>
<span id="L1028" rel="#L1028">1028</span>
<span id="L1029" rel="#L1029">1029</span>
<span id="L1030" rel="#L1030">1030</span>
<span id="L1031" rel="#L1031">1031</span>
<span id="L1032" rel="#L1032">1032</span>
<span id="L1033" rel="#L1033">1033</span>
<span id="L1034" rel="#L1034">1034</span>
<span id="L1035" rel="#L1035">1035</span>
<span id="L1036" rel="#L1036">1036</span>
<span id="L1037" rel="#L1037">1037</span>
<span id="L1038" rel="#L1038">1038</span>
<span id="L1039" rel="#L1039">1039</span>
<span id="L1040" rel="#L1040">1040</span>
<span id="L1041" rel="#L1041">1041</span>
<span id="L1042" rel="#L1042">1042</span>
<span id="L1043" rel="#L1043">1043</span>
<span id="L1044" rel="#L1044">1044</span>
<span id="L1045" rel="#L1045">1045</span>
<span id="L1046" rel="#L1046">1046</span>
<span id="L1047" rel="#L1047">1047</span>
<span id="L1048" rel="#L1048">1048</span>
<span id="L1049" rel="#L1049">1049</span>
<span id="L1050" rel="#L1050">1050</span>
<span id="L1051" rel="#L1051">1051</span>
<span id="L1052" rel="#L1052">1052</span>
<span id="L1053" rel="#L1053">1053</span>
<span id="L1054" rel="#L1054">1054</span>
<span id="L1055" rel="#L1055">1055</span>
<span id="L1056" rel="#L1056">1056</span>
<span id="L1057" rel="#L1057">1057</span>
<span id="L1058" rel="#L1058">1058</span>
<span id="L1059" rel="#L1059">1059</span>
<span id="L1060" rel="#L1060">1060</span>
<span id="L1061" rel="#L1061">1061</span>
<span id="L1062" rel="#L1062">1062</span>
<span id="L1063" rel="#L1063">1063</span>
<span id="L1064" rel="#L1064">1064</span>
<span id="L1065" rel="#L1065">1065</span>
<span id="L1066" rel="#L1066">1066</span>
<span id="L1067" rel="#L1067">1067</span>
<span id="L1068" rel="#L1068">1068</span>
<span id="L1069" rel="#L1069">1069</span>
<span id="L1070" rel="#L1070">1070</span>
<span id="L1071" rel="#L1071">1071</span>
<span id="L1072" rel="#L1072">1072</span>
<span id="L1073" rel="#L1073">1073</span>
<span id="L1074" rel="#L1074">1074</span>
<span id="L1075" rel="#L1075">1075</span>
<span id="L1076" rel="#L1076">1076</span>
<span id="L1077" rel="#L1077">1077</span>
<span id="L1078" rel="#L1078">1078</span>
<span id="L1079" rel="#L1079">1079</span>
<span id="L1080" rel="#L1080">1080</span>
<span id="L1081" rel="#L1081">1081</span>
<span id="L1082" rel="#L1082">1082</span>
<span id="L1083" rel="#L1083">1083</span>
<span id="L1084" rel="#L1084">1084</span>
<span id="L1085" rel="#L1085">1085</span>
<span id="L1086" rel="#L1086">1086</span>
<span id="L1087" rel="#L1087">1087</span>
<span id="L1088" rel="#L1088">1088</span>
<span id="L1089" rel="#L1089">1089</span>
<span id="L1090" rel="#L1090">1090</span>
<span id="L1091" rel="#L1091">1091</span>
<span id="L1092" rel="#L1092">1092</span>
<span id="L1093" rel="#L1093">1093</span>
<span id="L1094" rel="#L1094">1094</span>
<span id="L1095" rel="#L1095">1095</span>
<span id="L1096" rel="#L1096">1096</span>
<span id="L1097" rel="#L1097">1097</span>
<span id="L1098" rel="#L1098">1098</span>
<span id="L1099" rel="#L1099">1099</span>
<span id="L1100" rel="#L1100">1100</span>
<span id="L1101" rel="#L1101">1101</span>
<span id="L1102" rel="#L1102">1102</span>
<span id="L1103" rel="#L1103">1103</span>
<span id="L1104" rel="#L1104">1104</span>
<span id="L1105" rel="#L1105">1105</span>
<span id="L1106" rel="#L1106">1106</span>
<span id="L1107" rel="#L1107">1107</span>
<span id="L1108" rel="#L1108">1108</span>
<span id="L1109" rel="#L1109">1109</span>
<span id="L1110" rel="#L1110">1110</span>
<span id="L1111" rel="#L1111">1111</span>
<span id="L1112" rel="#L1112">1112</span>
<span id="L1113" rel="#L1113">1113</span>
<span id="L1114" rel="#L1114">1114</span>
<span id="L1115" rel="#L1115">1115</span>
<span id="L1116" rel="#L1116">1116</span>
<span id="L1117" rel="#L1117">1117</span>
<span id="L1118" rel="#L1118">1118</span>
<span id="L1119" rel="#L1119">1119</span>
<span id="L1120" rel="#L1120">1120</span>
<span id="L1121" rel="#L1121">1121</span>
<span id="L1122" rel="#L1122">1122</span>
<span id="L1123" rel="#L1123">1123</span>
<span id="L1124" rel="#L1124">1124</span>
<span id="L1125" rel="#L1125">1125</span>
<span id="L1126" rel="#L1126">1126</span>
<span id="L1127" rel="#L1127">1127</span>
<span id="L1128" rel="#L1128">1128</span>
<span id="L1129" rel="#L1129">1129</span>
<span id="L1130" rel="#L1130">1130</span>
<span id="L1131" rel="#L1131">1131</span>
<span id="L1132" rel="#L1132">1132</span>
<span id="L1133" rel="#L1133">1133</span>
<span id="L1134" rel="#L1134">1134</span>
<span id="L1135" rel="#L1135">1135</span>
<span id="L1136" rel="#L1136">1136</span>
<span id="L1137" rel="#L1137">1137</span>
<span id="L1138" rel="#L1138">1138</span>
<span id="L1139" rel="#L1139">1139</span>
<span id="L1140" rel="#L1140">1140</span>
<span id="L1141" rel="#L1141">1141</span>
<span id="L1142" rel="#L1142">1142</span>
<span id="L1143" rel="#L1143">1143</span>
<span id="L1144" rel="#L1144">1144</span>
<span id="L1145" rel="#L1145">1145</span>
<span id="L1146" rel="#L1146">1146</span>
<span id="L1147" rel="#L1147">1147</span>
<span id="L1148" rel="#L1148">1148</span>
<span id="L1149" rel="#L1149">1149</span>
<span id="L1150" rel="#L1150">1150</span>
<span id="L1151" rel="#L1151">1151</span>
<span id="L1152" rel="#L1152">1152</span>
<span id="L1153" rel="#L1153">1153</span>
<span id="L1154" rel="#L1154">1154</span>
<span id="L1155" rel="#L1155">1155</span>
<span id="L1156" rel="#L1156">1156</span>
<span id="L1157" rel="#L1157">1157</span>
<span id="L1158" rel="#L1158">1158</span>
<span id="L1159" rel="#L1159">1159</span>
<span id="L1160" rel="#L1160">1160</span>
<span id="L1161" rel="#L1161">1161</span>
<span id="L1162" rel="#L1162">1162</span>
<span id="L1163" rel="#L1163">1163</span>
<span id="L1164" rel="#L1164">1164</span>
<span id="L1165" rel="#L1165">1165</span>
<span id="L1166" rel="#L1166">1166</span>
<span id="L1167" rel="#L1167">1167</span>
<span id="L1168" rel="#L1168">1168</span>
<span id="L1169" rel="#L1169">1169</span>
<span id="L1170" rel="#L1170">1170</span>
<span id="L1171" rel="#L1171">1171</span>
<span id="L1172" rel="#L1172">1172</span>
<span id="L1173" rel="#L1173">1173</span>
<span id="L1174" rel="#L1174">1174</span>
<span id="L1175" rel="#L1175">1175</span>
<span id="L1176" rel="#L1176">1176</span>
<span id="L1177" rel="#L1177">1177</span>
<span id="L1178" rel="#L1178">1178</span>
<span id="L1179" rel="#L1179">1179</span>
<span id="L1180" rel="#L1180">1180</span>
<span id="L1181" rel="#L1181">1181</span>
<span id="L1182" rel="#L1182">1182</span>
<span id="L1183" rel="#L1183">1183</span>
<span id="L1184" rel="#L1184">1184</span>
<span id="L1185" rel="#L1185">1185</span>
<span id="L1186" rel="#L1186">1186</span>
<span id="L1187" rel="#L1187">1187</span>
<span id="L1188" rel="#L1188">1188</span>
<span id="L1189" rel="#L1189">1189</span>
<span id="L1190" rel="#L1190">1190</span>
<span id="L1191" rel="#L1191">1191</span>
<span id="L1192" rel="#L1192">1192</span>
<span id="L1193" rel="#L1193">1193</span>
<span id="L1194" rel="#L1194">1194</span>
<span id="L1195" rel="#L1195">1195</span>
<span id="L1196" rel="#L1196">1196</span>
<span id="L1197" rel="#L1197">1197</span>
<span id="L1198" rel="#L1198">1198</span>
<span id="L1199" rel="#L1199">1199</span>
<span id="L1200" rel="#L1200">1200</span>
<span id="L1201" rel="#L1201">1201</span>
<span id="L1202" rel="#L1202">1202</span>
<span id="L1203" rel="#L1203">1203</span>
<span id="L1204" rel="#L1204">1204</span>
<span id="L1205" rel="#L1205">1205</span>
<span id="L1206" rel="#L1206">1206</span>
<span id="L1207" rel="#L1207">1207</span>
<span id="L1208" rel="#L1208">1208</span>
<span id="L1209" rel="#L1209">1209</span>
<span id="L1210" rel="#L1210">1210</span>
<span id="L1211" rel="#L1211">1211</span>
<span id="L1212" rel="#L1212">1212</span>
<span id="L1213" rel="#L1213">1213</span>
<span id="L1214" rel="#L1214">1214</span>
<span id="L1215" rel="#L1215">1215</span>
<span id="L1216" rel="#L1216">1216</span>
<span id="L1217" rel="#L1217">1217</span>
<span id="L1218" rel="#L1218">1218</span>
<span id="L1219" rel="#L1219">1219</span>
<span id="L1220" rel="#L1220">1220</span>
<span id="L1221" rel="#L1221">1221</span>
<span id="L1222" rel="#L1222">1222</span>
<span id="L1223" rel="#L1223">1223</span>
<span id="L1224" rel="#L1224">1224</span>
<span id="L1225" rel="#L1225">1225</span>
<span id="L1226" rel="#L1226">1226</span>
<span id="L1227" rel="#L1227">1227</span>
<span id="L1228" rel="#L1228">1228</span>
<span id="L1229" rel="#L1229">1229</span>
<span id="L1230" rel="#L1230">1230</span>
<span id="L1231" rel="#L1231">1231</span>
<span id="L1232" rel="#L1232">1232</span>
<span id="L1233" rel="#L1233">1233</span>
<span id="L1234" rel="#L1234">1234</span>
<span id="L1235" rel="#L1235">1235</span>
<span id="L1236" rel="#L1236">1236</span>
<span id="L1237" rel="#L1237">1237</span>
<span id="L1238" rel="#L1238">1238</span>
<span id="L1239" rel="#L1239">1239</span>
<span id="L1240" rel="#L1240">1240</span>
<span id="L1241" rel="#L1241">1241</span>
<span id="L1242" rel="#L1242">1242</span>
<span id="L1243" rel="#L1243">1243</span>
<span id="L1244" rel="#L1244">1244</span>
<span id="L1245" rel="#L1245">1245</span>
<span id="L1246" rel="#L1246">1246</span>
<span id="L1247" rel="#L1247">1247</span>
<span id="L1248" rel="#L1248">1248</span>
<span id="L1249" rel="#L1249">1249</span>
<span id="L1250" rel="#L1250">1250</span>
<span id="L1251" rel="#L1251">1251</span>
<span id="L1252" rel="#L1252">1252</span>
<span id="L1253" rel="#L1253">1253</span>
<span id="L1254" rel="#L1254">1254</span>
<span id="L1255" rel="#L1255">1255</span>
<span id="L1256" rel="#L1256">1256</span>
<span id="L1257" rel="#L1257">1257</span>
<span id="L1258" rel="#L1258">1258</span>
<span id="L1259" rel="#L1259">1259</span>
<span id="L1260" rel="#L1260">1260</span>
<span id="L1261" rel="#L1261">1261</span>
<span id="L1262" rel="#L1262">1262</span>
<span id="L1263" rel="#L1263">1263</span>
<span id="L1264" rel="#L1264">1264</span>
<span id="L1265" rel="#L1265">1265</span>
<span id="L1266" rel="#L1266">1266</span>
<span id="L1267" rel="#L1267">1267</span>
<span id="L1268" rel="#L1268">1268</span>
<span id="L1269" rel="#L1269">1269</span>
<span id="L1270" rel="#L1270">1270</span>
<span id="L1271" rel="#L1271">1271</span>
<span id="L1272" rel="#L1272">1272</span>
<span id="L1273" rel="#L1273">1273</span>
<span id="L1274" rel="#L1274">1274</span>
<span id="L1275" rel="#L1275">1275</span>
<span id="L1276" rel="#L1276">1276</span>
<span id="L1277" rel="#L1277">1277</span>
<span id="L1278" rel="#L1278">1278</span>
<span id="L1279" rel="#L1279">1279</span>
<span id="L1280" rel="#L1280">1280</span>
<span id="L1281" rel="#L1281">1281</span>
<span id="L1282" rel="#L1282">1282</span>
<span id="L1283" rel="#L1283">1283</span>
<span id="L1284" rel="#L1284">1284</span>
<span id="L1285" rel="#L1285">1285</span>
<span id="L1286" rel="#L1286">1286</span>
<span id="L1287" rel="#L1287">1287</span>
<span id="L1288" rel="#L1288">1288</span>
<span id="L1289" rel="#L1289">1289</span>
<span id="L1290" rel="#L1290">1290</span>
<span id="L1291" rel="#L1291">1291</span>
<span id="L1292" rel="#L1292">1292</span>
<span id="L1293" rel="#L1293">1293</span>
<span id="L1294" rel="#L1294">1294</span>
<span id="L1295" rel="#L1295">1295</span>
<span id="L1296" rel="#L1296">1296</span>
<span id="L1297" rel="#L1297">1297</span>
<span id="L1298" rel="#L1298">1298</span>
<span id="L1299" rel="#L1299">1299</span>
<span id="L1300" rel="#L1300">1300</span>
<span id="L1301" rel="#L1301">1301</span>
<span id="L1302" rel="#L1302">1302</span>
<span id="L1303" rel="#L1303">1303</span>
<span id="L1304" rel="#L1304">1304</span>
<span id="L1305" rel="#L1305">1305</span>
<span id="L1306" rel="#L1306">1306</span>
<span id="L1307" rel="#L1307">1307</span>
<span id="L1308" rel="#L1308">1308</span>
<span id="L1309" rel="#L1309">1309</span>
<span id="L1310" rel="#L1310">1310</span>
<span id="L1311" rel="#L1311">1311</span>
<span id="L1312" rel="#L1312">1312</span>
<span id="L1313" rel="#L1313">1313</span>
<span id="L1314" rel="#L1314">1314</span>
<span id="L1315" rel="#L1315">1315</span>
<span id="L1316" rel="#L1316">1316</span>
<span id="L1317" rel="#L1317">1317</span>
<span id="L1318" rel="#L1318">1318</span>
<span id="L1319" rel="#L1319">1319</span>
<span id="L1320" rel="#L1320">1320</span>
<span id="L1321" rel="#L1321">1321</span>
<span id="L1322" rel="#L1322">1322</span>
<span id="L1323" rel="#L1323">1323</span>
<span id="L1324" rel="#L1324">1324</span>
<span id="L1325" rel="#L1325">1325</span>
<span id="L1326" rel="#L1326">1326</span>
<span id="L1327" rel="#L1327">1327</span>
<span id="L1328" rel="#L1328">1328</span>
<span id="L1329" rel="#L1329">1329</span>
<span id="L1330" rel="#L1330">1330</span>
<span id="L1331" rel="#L1331">1331</span>
<span id="L1332" rel="#L1332">1332</span>
<span id="L1333" rel="#L1333">1333</span>
<span id="L1334" rel="#L1334">1334</span>
<span id="L1335" rel="#L1335">1335</span>
<span id="L1336" rel="#L1336">1336</span>
<span id="L1337" rel="#L1337">1337</span>
<span id="L1338" rel="#L1338">1338</span>
<span id="L1339" rel="#L1339">1339</span>
<span id="L1340" rel="#L1340">1340</span>
<span id="L1341" rel="#L1341">1341</span>
<span id="L1342" rel="#L1342">1342</span>
<span id="L1343" rel="#L1343">1343</span>
<span id="L1344" rel="#L1344">1344</span>
<span id="L1345" rel="#L1345">1345</span>
<span id="L1346" rel="#L1346">1346</span>
<span id="L1347" rel="#L1347">1347</span>
<span id="L1348" rel="#L1348">1348</span>
<span id="L1349" rel="#L1349">1349</span>
<span id="L1350" rel="#L1350">1350</span>
<span id="L1351" rel="#L1351">1351</span>
<span id="L1352" rel="#L1352">1352</span>
<span id="L1353" rel="#L1353">1353</span>
<span id="L1354" rel="#L1354">1354</span>
<span id="L1355" rel="#L1355">1355</span>
<span id="L1356" rel="#L1356">1356</span>
<span id="L1357" rel="#L1357">1357</span>
<span id="L1358" rel="#L1358">1358</span>
<span id="L1359" rel="#L1359">1359</span>
<span id="L1360" rel="#L1360">1360</span>
<span id="L1361" rel="#L1361">1361</span>
<span id="L1362" rel="#L1362">1362</span>
<span id="L1363" rel="#L1363">1363</span>
<span id="L1364" rel="#L1364">1364</span>
<span id="L1365" rel="#L1365">1365</span>
<span id="L1366" rel="#L1366">1366</span>
<span id="L1367" rel="#L1367">1367</span>
<span id="L1368" rel="#L1368">1368</span>
<span id="L1369" rel="#L1369">1369</span>
<span id="L1370" rel="#L1370">1370</span>
<span id="L1371" rel="#L1371">1371</span>
<span id="L1372" rel="#L1372">1372</span>
<span id="L1373" rel="#L1373">1373</span>
<span id="L1374" rel="#L1374">1374</span>
<span id="L1375" rel="#L1375">1375</span>
<span id="L1376" rel="#L1376">1376</span>
<span id="L1377" rel="#L1377">1377</span>
<span id="L1378" rel="#L1378">1378</span>
<span id="L1379" rel="#L1379">1379</span>
<span id="L1380" rel="#L1380">1380</span>
<span id="L1381" rel="#L1381">1381</span>
<span id="L1382" rel="#L1382">1382</span>
<span id="L1383" rel="#L1383">1383</span>
<span id="L1384" rel="#L1384">1384</span>
<span id="L1385" rel="#L1385">1385</span>
<span id="L1386" rel="#L1386">1386</span>
<span id="L1387" rel="#L1387">1387</span>
<span id="L1388" rel="#L1388">1388</span>
<span id="L1389" rel="#L1389">1389</span>
<span id="L1390" rel="#L1390">1390</span>
<span id="L1391" rel="#L1391">1391</span>
<span id="L1392" rel="#L1392">1392</span>
<span id="L1393" rel="#L1393">1393</span>
<span id="L1394" rel="#L1394">1394</span>
<span id="L1395" rel="#L1395">1395</span>
<span id="L1396" rel="#L1396">1396</span>
<span id="L1397" rel="#L1397">1397</span>
<span id="L1398" rel="#L1398">1398</span>
<span id="L1399" rel="#L1399">1399</span>
<span id="L1400" rel="#L1400">1400</span>
<span id="L1401" rel="#L1401">1401</span>
<span id="L1402" rel="#L1402">1402</span>
<span id="L1403" rel="#L1403">1403</span>
<span id="L1404" rel="#L1404">1404</span>
<span id="L1405" rel="#L1405">1405</span>
<span id="L1406" rel="#L1406">1406</span>
<span id="L1407" rel="#L1407">1407</span>
<span id="L1408" rel="#L1408">1408</span>
<span id="L1409" rel="#L1409">1409</span>
<span id="L1410" rel="#L1410">1410</span>
<span id="L1411" rel="#L1411">1411</span>
<span id="L1412" rel="#L1412">1412</span>
<span id="L1413" rel="#L1413">1413</span>
<span id="L1414" rel="#L1414">1414</span>
<span id="L1415" rel="#L1415">1415</span>
<span id="L1416" rel="#L1416">1416</span>
<span id="L1417" rel="#L1417">1417</span>
<span id="L1418" rel="#L1418">1418</span>
<span id="L1419" rel="#L1419">1419</span>
<span id="L1420" rel="#L1420">1420</span>
<span id="L1421" rel="#L1421">1421</span>
<span id="L1422" rel="#L1422">1422</span>
<span id="L1423" rel="#L1423">1423</span>
<span id="L1424" rel="#L1424">1424</span>
<span id="L1425" rel="#L1425">1425</span>
<span id="L1426" rel="#L1426">1426</span>
<span id="L1427" rel="#L1427">1427</span>
<span id="L1428" rel="#L1428">1428</span>
<span id="L1429" rel="#L1429">1429</span>
<span id="L1430" rel="#L1430">1430</span>
<span id="L1431" rel="#L1431">1431</span>
<span id="L1432" rel="#L1432">1432</span>
<span id="L1433" rel="#L1433">1433</span>
<span id="L1434" rel="#L1434">1434</span>
<span id="L1435" rel="#L1435">1435</span>
<span id="L1436" rel="#L1436">1436</span>
<span id="L1437" rel="#L1437">1437</span>
<span id="L1438" rel="#L1438">1438</span>
<span id="L1439" rel="#L1439">1439</span>
<span id="L1440" rel="#L1440">1440</span>
<span id="L1441" rel="#L1441">1441</span>
<span id="L1442" rel="#L1442">1442</span>
<span id="L1443" rel="#L1443">1443</span>
<span id="L1444" rel="#L1444">1444</span>
<span id="L1445" rel="#L1445">1445</span>
<span id="L1446" rel="#L1446">1446</span>
<span id="L1447" rel="#L1447">1447</span>
<span id="L1448" rel="#L1448">1448</span>
<span id="L1449" rel="#L1449">1449</span>
<span id="L1450" rel="#L1450">1450</span>
<span id="L1451" rel="#L1451">1451</span>
<span id="L1452" rel="#L1452">1452</span>
<span id="L1453" rel="#L1453">1453</span>
<span id="L1454" rel="#L1454">1454</span>
<span id="L1455" rel="#L1455">1455</span>
<span id="L1456" rel="#L1456">1456</span>
<span id="L1457" rel="#L1457">1457</span>
<span id="L1458" rel="#L1458">1458</span>
<span id="L1459" rel="#L1459">1459</span>
<span id="L1460" rel="#L1460">1460</span>
<span id="L1461" rel="#L1461">1461</span>
<span id="L1462" rel="#L1462">1462</span>
<span id="L1463" rel="#L1463">1463</span>
<span id="L1464" rel="#L1464">1464</span>
<span id="L1465" rel="#L1465">1465</span>
<span id="L1466" rel="#L1466">1466</span>
<span id="L1467" rel="#L1467">1467</span>
<span id="L1468" rel="#L1468">1468</span>
<span id="L1469" rel="#L1469">1469</span>
<span id="L1470" rel="#L1470">1470</span>
<span id="L1471" rel="#L1471">1471</span>
<span id="L1472" rel="#L1472">1472</span>
<span id="L1473" rel="#L1473">1473</span>
<span id="L1474" rel="#L1474">1474</span>
<span id="L1475" rel="#L1475">1475</span>
<span id="L1476" rel="#L1476">1476</span>
<span id="L1477" rel="#L1477">1477</span>
<span id="L1478" rel="#L1478">1478</span>
<span id="L1479" rel="#L1479">1479</span>
<span id="L1480" rel="#L1480">1480</span>
<span id="L1481" rel="#L1481">1481</span>
<span id="L1482" rel="#L1482">1482</span>
<span id="L1483" rel="#L1483">1483</span>
<span id="L1484" rel="#L1484">1484</span>
<span id="L1485" rel="#L1485">1485</span>
<span id="L1486" rel="#L1486">1486</span>
<span id="L1487" rel="#L1487">1487</span>
<span id="L1488" rel="#L1488">1488</span>
<span id="L1489" rel="#L1489">1489</span>
<span id="L1490" rel="#L1490">1490</span>
<span id="L1491" rel="#L1491">1491</span>
<span id="L1492" rel="#L1492">1492</span>
<span id="L1493" rel="#L1493">1493</span>
<span id="L1494" rel="#L1494">1494</span>
<span id="L1495" rel="#L1495">1495</span>
<span id="L1496" rel="#L1496">1496</span>
<span id="L1497" rel="#L1497">1497</span>
<span id="L1498" rel="#L1498">1498</span>
<span id="L1499" rel="#L1499">1499</span>
<span id="L1500" rel="#L1500">1500</span>
<span id="L1501" rel="#L1501">1501</span>
<span id="L1502" rel="#L1502">1502</span>
<span id="L1503" rel="#L1503">1503</span>
<span id="L1504" rel="#L1504">1504</span>
<span id="L1505" rel="#L1505">1505</span>
<span id="L1506" rel="#L1506">1506</span>
<span id="L1507" rel="#L1507">1507</span>
<span id="L1508" rel="#L1508">1508</span>
<span id="L1509" rel="#L1509">1509</span>
<span id="L1510" rel="#L1510">1510</span>
<span id="L1511" rel="#L1511">1511</span>
<span id="L1512" rel="#L1512">1512</span>
<span id="L1513" rel="#L1513">1513</span>
<span id="L1514" rel="#L1514">1514</span>
<span id="L1515" rel="#L1515">1515</span>
<span id="L1516" rel="#L1516">1516</span>
<span id="L1517" rel="#L1517">1517</span>
<span id="L1518" rel="#L1518">1518</span>
<span id="L1519" rel="#L1519">1519</span>
<span id="L1520" rel="#L1520">1520</span>
<span id="L1521" rel="#L1521">1521</span>
<span id="L1522" rel="#L1522">1522</span>
<span id="L1523" rel="#L1523">1523</span>
<span id="L1524" rel="#L1524">1524</span>
<span id="L1525" rel="#L1525">1525</span>
<span id="L1526" rel="#L1526">1526</span>
<span id="L1527" rel="#L1527">1527</span>
<span id="L1528" rel="#L1528">1528</span>
<span id="L1529" rel="#L1529">1529</span>
<span id="L1530" rel="#L1530">1530</span>
<span id="L1531" rel="#L1531">1531</span>
<span id="L1532" rel="#L1532">1532</span>
<span id="L1533" rel="#L1533">1533</span>
<span id="L1534" rel="#L1534">1534</span>
<span id="L1535" rel="#L1535">1535</span>
<span id="L1536" rel="#L1536">1536</span>
<span id="L1537" rel="#L1537">1537</span>
<span id="L1538" rel="#L1538">1538</span>
<span id="L1539" rel="#L1539">1539</span>
<span id="L1540" rel="#L1540">1540</span>
<span id="L1541" rel="#L1541">1541</span>
<span id="L1542" rel="#L1542">1542</span>
<span id="L1543" rel="#L1543">1543</span>
<span id="L1544" rel="#L1544">1544</span>
<span id="L1545" rel="#L1545">1545</span>
<span id="L1546" rel="#L1546">1546</span>
<span id="L1547" rel="#L1547">1547</span>
<span id="L1548" rel="#L1548">1548</span>
<span id="L1549" rel="#L1549">1549</span>
<span id="L1550" rel="#L1550">1550</span>
<span id="L1551" rel="#L1551">1551</span>
<span id="L1552" rel="#L1552">1552</span>
<span id="L1553" rel="#L1553">1553</span>
<span id="L1554" rel="#L1554">1554</span>
<span id="L1555" rel="#L1555">1555</span>
<span id="L1556" rel="#L1556">1556</span>
<span id="L1557" rel="#L1557">1557</span>
<span id="L1558" rel="#L1558">1558</span>
<span id="L1559" rel="#L1559">1559</span>
<span id="L1560" rel="#L1560">1560</span>
<span id="L1561" rel="#L1561">1561</span>
<span id="L1562" rel="#L1562">1562</span>
<span id="L1563" rel="#L1563">1563</span>
<span id="L1564" rel="#L1564">1564</span>
<span id="L1565" rel="#L1565">1565</span>
<span id="L1566" rel="#L1566">1566</span>
<span id="L1567" rel="#L1567">1567</span>
<span id="L1568" rel="#L1568">1568</span>
<span id="L1569" rel="#L1569">1569</span>
<span id="L1570" rel="#L1570">1570</span>
<span id="L1571" rel="#L1571">1571</span>
<span id="L1572" rel="#L1572">1572</span>
<span id="L1573" rel="#L1573">1573</span>
<span id="L1574" rel="#L1574">1574</span>
<span id="L1575" rel="#L1575">1575</span>
<span id="L1576" rel="#L1576">1576</span>
<span id="L1577" rel="#L1577">1577</span>
<span id="L1578" rel="#L1578">1578</span>
<span id="L1579" rel="#L1579">1579</span>
<span id="L1580" rel="#L1580">1580</span>
<span id="L1581" rel="#L1581">1581</span>
<span id="L1582" rel="#L1582">1582</span>
<span id="L1583" rel="#L1583">1583</span>
<span id="L1584" rel="#L1584">1584</span>
<span id="L1585" rel="#L1585">1585</span>
<span id="L1586" rel="#L1586">1586</span>
<span id="L1587" rel="#L1587">1587</span>
<span id="L1588" rel="#L1588">1588</span>
<span id="L1589" rel="#L1589">1589</span>
<span id="L1590" rel="#L1590">1590</span>
<span id="L1591" rel="#L1591">1591</span>
<span id="L1592" rel="#L1592">1592</span>
<span id="L1593" rel="#L1593">1593</span>
<span id="L1594" rel="#L1594">1594</span>
<span id="L1595" rel="#L1595">1595</span>
<span id="L1596" rel="#L1596">1596</span>
<span id="L1597" rel="#L1597">1597</span>
<span id="L1598" rel="#L1598">1598</span>
<span id="L1599" rel="#L1599">1599</span>
<span id="L1600" rel="#L1600">1600</span>
<span id="L1601" rel="#L1601">1601</span>
<span id="L1602" rel="#L1602">1602</span>
<span id="L1603" rel="#L1603">1603</span>
<span id="L1604" rel="#L1604">1604</span>
<span id="L1605" rel="#L1605">1605</span>
<span id="L1606" rel="#L1606">1606</span>
<span id="L1607" rel="#L1607">1607</span>
<span id="L1608" rel="#L1608">1608</span>
<span id="L1609" rel="#L1609">1609</span>
<span id="L1610" rel="#L1610">1610</span>
<span id="L1611" rel="#L1611">1611</span>
<span id="L1612" rel="#L1612">1612</span>
<span id="L1613" rel="#L1613">1613</span>
<span id="L1614" rel="#L1614">1614</span>
<span id="L1615" rel="#L1615">1615</span>
<span id="L1616" rel="#L1616">1616</span>
<span id="L1617" rel="#L1617">1617</span>
<span id="L1618" rel="#L1618">1618</span>
<span id="L1619" rel="#L1619">1619</span>
<span id="L1620" rel="#L1620">1620</span>
<span id="L1621" rel="#L1621">1621</span>
<span id="L1622" rel="#L1622">1622</span>
<span id="L1623" rel="#L1623">1623</span>
<span id="L1624" rel="#L1624">1624</span>
<span id="L1625" rel="#L1625">1625</span>
<span id="L1626" rel="#L1626">1626</span>
<span id="L1627" rel="#L1627">1627</span>
<span id="L1628" rel="#L1628">1628</span>
<span id="L1629" rel="#L1629">1629</span>
<span id="L1630" rel="#L1630">1630</span>
<span id="L1631" rel="#L1631">1631</span>
<span id="L1632" rel="#L1632">1632</span>
<span id="L1633" rel="#L1633">1633</span>
<span id="L1634" rel="#L1634">1634</span>
<span id="L1635" rel="#L1635">1635</span>
<span id="L1636" rel="#L1636">1636</span>
<span id="L1637" rel="#L1637">1637</span>
<span id="L1638" rel="#L1638">1638</span>
<span id="L1639" rel="#L1639">1639</span>
<span id="L1640" rel="#L1640">1640</span>
<span id="L1641" rel="#L1641">1641</span>
<span id="L1642" rel="#L1642">1642</span>
<span id="L1643" rel="#L1643">1643</span>
<span id="L1644" rel="#L1644">1644</span>
<span id="L1645" rel="#L1645">1645</span>
<span id="L1646" rel="#L1646">1646</span>
<span id="L1647" rel="#L1647">1647</span>
<span id="L1648" rel="#L1648">1648</span>
<span id="L1649" rel="#L1649">1649</span>
<span id="L1650" rel="#L1650">1650</span>
<span id="L1651" rel="#L1651">1651</span>
<span id="L1652" rel="#L1652">1652</span>
<span id="L1653" rel="#L1653">1653</span>
<span id="L1654" rel="#L1654">1654</span>
<span id="L1655" rel="#L1655">1655</span>
<span id="L1656" rel="#L1656">1656</span>
<span id="L1657" rel="#L1657">1657</span>
<span id="L1658" rel="#L1658">1658</span>
<span id="L1659" rel="#L1659">1659</span>
<span id="L1660" rel="#L1660">1660</span>
<span id="L1661" rel="#L1661">1661</span>
<span id="L1662" rel="#L1662">1662</span>
<span id="L1663" rel="#L1663">1663</span>
<span id="L1664" rel="#L1664">1664</span>
<span id="L1665" rel="#L1665">1665</span>
<span id="L1666" rel="#L1666">1666</span>
<span id="L1667" rel="#L1667">1667</span>
<span id="L1668" rel="#L1668">1668</span>
<span id="L1669" rel="#L1669">1669</span>
<span id="L1670" rel="#L1670">1670</span>
<span id="L1671" rel="#L1671">1671</span>
<span id="L1672" rel="#L1672">1672</span>
<span id="L1673" rel="#L1673">1673</span>
<span id="L1674" rel="#L1674">1674</span>
<span id="L1675" rel="#L1675">1675</span>
<span id="L1676" rel="#L1676">1676</span>
<span id="L1677" rel="#L1677">1677</span>
<span id="L1678" rel="#L1678">1678</span>
<span id="L1679" rel="#L1679">1679</span>
<span id="L1680" rel="#L1680">1680</span>
<span id="L1681" rel="#L1681">1681</span>
<span id="L1682" rel="#L1682">1682</span>
<span id="L1683" rel="#L1683">1683</span>
<span id="L1684" rel="#L1684">1684</span>
<span id="L1685" rel="#L1685">1685</span>
<span id="L1686" rel="#L1686">1686</span>
<span id="L1687" rel="#L1687">1687</span>
<span id="L1688" rel="#L1688">1688</span>
<span id="L1689" rel="#L1689">1689</span>
<span id="L1690" rel="#L1690">1690</span>
<span id="L1691" rel="#L1691">1691</span>
<span id="L1692" rel="#L1692">1692</span>
<span id="L1693" rel="#L1693">1693</span>
<span id="L1694" rel="#L1694">1694</span>
<span id="L1695" rel="#L1695">1695</span>
<span id="L1696" rel="#L1696">1696</span>
<span id="L1697" rel="#L1697">1697</span>
<span id="L1698" rel="#L1698">1698</span>
<span id="L1699" rel="#L1699">1699</span>
<span id="L1700" rel="#L1700">1700</span>
<span id="L1701" rel="#L1701">1701</span>
<span id="L1702" rel="#L1702">1702</span>
<span id="L1703" rel="#L1703">1703</span>
<span id="L1704" rel="#L1704">1704</span>
<span id="L1705" rel="#L1705">1705</span>
<span id="L1706" rel="#L1706">1706</span>
<span id="L1707" rel="#L1707">1707</span>
<span id="L1708" rel="#L1708">1708</span>
<span id="L1709" rel="#L1709">1709</span>
<span id="L1710" rel="#L1710">1710</span>
<span id="L1711" rel="#L1711">1711</span>
<span id="L1712" rel="#L1712">1712</span>
<span id="L1713" rel="#L1713">1713</span>
<span id="L1714" rel="#L1714">1714</span>
<span id="L1715" rel="#L1715">1715</span>
<span id="L1716" rel="#L1716">1716</span>
<span id="L1717" rel="#L1717">1717</span>
<span id="L1718" rel="#L1718">1718</span>
<span id="L1719" rel="#L1719">1719</span>
<span id="L1720" rel="#L1720">1720</span>
<span id="L1721" rel="#L1721">1721</span>
<span id="L1722" rel="#L1722">1722</span>
<span id="L1723" rel="#L1723">1723</span>
<span id="L1724" rel="#L1724">1724</span>
<span id="L1725" rel="#L1725">1725</span>
<span id="L1726" rel="#L1726">1726</span>
<span id="L1727" rel="#L1727">1727</span>
<span id="L1728" rel="#L1728">1728</span>
<span id="L1729" rel="#L1729">1729</span>
<span id="L1730" rel="#L1730">1730</span>
<span id="L1731" rel="#L1731">1731</span>
<span id="L1732" rel="#L1732">1732</span>
<span id="L1733" rel="#L1733">1733</span>
<span id="L1734" rel="#L1734">1734</span>
<span id="L1735" rel="#L1735">1735</span>
<span id="L1736" rel="#L1736">1736</span>
<span id="L1737" rel="#L1737">1737</span>
<span id="L1738" rel="#L1738">1738</span>
<span id="L1739" rel="#L1739">1739</span>
<span id="L1740" rel="#L1740">1740</span>
<span id="L1741" rel="#L1741">1741</span>
<span id="L1742" rel="#L1742">1742</span>
<span id="L1743" rel="#L1743">1743</span>
<span id="L1744" rel="#L1744">1744</span>
<span id="L1745" rel="#L1745">1745</span>
<span id="L1746" rel="#L1746">1746</span>
<span id="L1747" rel="#L1747">1747</span>
<span id="L1748" rel="#L1748">1748</span>
<span id="L1749" rel="#L1749">1749</span>
<span id="L1750" rel="#L1750">1750</span>
<span id="L1751" rel="#L1751">1751</span>
<span id="L1752" rel="#L1752">1752</span>
<span id="L1753" rel="#L1753">1753</span>
<span id="L1754" rel="#L1754">1754</span>
<span id="L1755" rel="#L1755">1755</span>
<span id="L1756" rel="#L1756">1756</span>
<span id="L1757" rel="#L1757">1757</span>
<span id="L1758" rel="#L1758">1758</span>
<span id="L1759" rel="#L1759">1759</span>
<span id="L1760" rel="#L1760">1760</span>
<span id="L1761" rel="#L1761">1761</span>
<span id="L1762" rel="#L1762">1762</span>
<span id="L1763" rel="#L1763">1763</span>
<span id="L1764" rel="#L1764">1764</span>
<span id="L1765" rel="#L1765">1765</span>
<span id="L1766" rel="#L1766">1766</span>
<span id="L1767" rel="#L1767">1767</span>
<span id="L1768" rel="#L1768">1768</span>
<span id="L1769" rel="#L1769">1769</span>
<span id="L1770" rel="#L1770">1770</span>
<span id="L1771" rel="#L1771">1771</span>
<span id="L1772" rel="#L1772">1772</span>
<span id="L1773" rel="#L1773">1773</span>
<span id="L1774" rel="#L1774">1774</span>
<span id="L1775" rel="#L1775">1775</span>
<span id="L1776" rel="#L1776">1776</span>
<span id="L1777" rel="#L1777">1777</span>
<span id="L1778" rel="#L1778">1778</span>
<span id="L1779" rel="#L1779">1779</span>
<span id="L1780" rel="#L1780">1780</span>
<span id="L1781" rel="#L1781">1781</span>
<span id="L1782" rel="#L1782">1782</span>
<span id="L1783" rel="#L1783">1783</span>
<span id="L1784" rel="#L1784">1784</span>
<span id="L1785" rel="#L1785">1785</span>
<span id="L1786" rel="#L1786">1786</span>
<span id="L1787" rel="#L1787">1787</span>
<span id="L1788" rel="#L1788">1788</span>
<span id="L1789" rel="#L1789">1789</span>
<span id="L1790" rel="#L1790">1790</span>
<span id="L1791" rel="#L1791">1791</span>
<span id="L1792" rel="#L1792">1792</span>
<span id="L1793" rel="#L1793">1793</span>
<span id="L1794" rel="#L1794">1794</span>
<span id="L1795" rel="#L1795">1795</span>
<span id="L1796" rel="#L1796">1796</span>
<span id="L1797" rel="#L1797">1797</span>
<span id="L1798" rel="#L1798">1798</span>
<span id="L1799" rel="#L1799">1799</span>
<span id="L1800" rel="#L1800">1800</span>
<span id="L1801" rel="#L1801">1801</span>
<span id="L1802" rel="#L1802">1802</span>
<span id="L1803" rel="#L1803">1803</span>
<span id="L1804" rel="#L1804">1804</span>
<span id="L1805" rel="#L1805">1805</span>
<span id="L1806" rel="#L1806">1806</span>
<span id="L1807" rel="#L1807">1807</span>
<span id="L1808" rel="#L1808">1808</span>
<span id="L1809" rel="#L1809">1809</span>
<span id="L1810" rel="#L1810">1810</span>
<span id="L1811" rel="#L1811">1811</span>
<span id="L1812" rel="#L1812">1812</span>
<span id="L1813" rel="#L1813">1813</span>
<span id="L1814" rel="#L1814">1814</span>
<span id="L1815" rel="#L1815">1815</span>
<span id="L1816" rel="#L1816">1816</span>
<span id="L1817" rel="#L1817">1817</span>
<span id="L1818" rel="#L1818">1818</span>
<span id="L1819" rel="#L1819">1819</span>
<span id="L1820" rel="#L1820">1820</span>
<span id="L1821" rel="#L1821">1821</span>
<span id="L1822" rel="#L1822">1822</span>
<span id="L1823" rel="#L1823">1823</span>
<span id="L1824" rel="#L1824">1824</span>
<span id="L1825" rel="#L1825">1825</span>
<span id="L1826" rel="#L1826">1826</span>
<span id="L1827" rel="#L1827">1827</span>
<span id="L1828" rel="#L1828">1828</span>
<span id="L1829" rel="#L1829">1829</span>
<span id="L1830" rel="#L1830">1830</span>
<span id="L1831" rel="#L1831">1831</span>
<span id="L1832" rel="#L1832">1832</span>
<span id="L1833" rel="#L1833">1833</span>
<span id="L1834" rel="#L1834">1834</span>
<span id="L1835" rel="#L1835">1835</span>
<span id="L1836" rel="#L1836">1836</span>
<span id="L1837" rel="#L1837">1837</span>
<span id="L1838" rel="#L1838">1838</span>
<span id="L1839" rel="#L1839">1839</span>
<span id="L1840" rel="#L1840">1840</span>
<span id="L1841" rel="#L1841">1841</span>
<span id="L1842" rel="#L1842">1842</span>
<span id="L1843" rel="#L1843">1843</span>
<span id="L1844" rel="#L1844">1844</span>
<span id="L1845" rel="#L1845">1845</span>
<span id="L1846" rel="#L1846">1846</span>
<span id="L1847" rel="#L1847">1847</span>
<span id="L1848" rel="#L1848">1848</span>
<span id="L1849" rel="#L1849">1849</span>
<span id="L1850" rel="#L1850">1850</span>
<span id="L1851" rel="#L1851">1851</span>
<span id="L1852" rel="#L1852">1852</span>
<span id="L1853" rel="#L1853">1853</span>
<span id="L1854" rel="#L1854">1854</span>
<span id="L1855" rel="#L1855">1855</span>
<span id="L1856" rel="#L1856">1856</span>
<span id="L1857" rel="#L1857">1857</span>
<span id="L1858" rel="#L1858">1858</span>
<span id="L1859" rel="#L1859">1859</span>
<span id="L1860" rel="#L1860">1860</span>
<span id="L1861" rel="#L1861">1861</span>
<span id="L1862" rel="#L1862">1862</span>
<span id="L1863" rel="#L1863">1863</span>
<span id="L1864" rel="#L1864">1864</span>
<span id="L1865" rel="#L1865">1865</span>
<span id="L1866" rel="#L1866">1866</span>
<span id="L1867" rel="#L1867">1867</span>
<span id="L1868" rel="#L1868">1868</span>
<span id="L1869" rel="#L1869">1869</span>
<span id="L1870" rel="#L1870">1870</span>
<span id="L1871" rel="#L1871">1871</span>
<span id="L1872" rel="#L1872">1872</span>
<span id="L1873" rel="#L1873">1873</span>
<span id="L1874" rel="#L1874">1874</span>
<span id="L1875" rel="#L1875">1875</span>
<span id="L1876" rel="#L1876">1876</span>
<span id="L1877" rel="#L1877">1877</span>
<span id="L1878" rel="#L1878">1878</span>
<span id="L1879" rel="#L1879">1879</span>
<span id="L1880" rel="#L1880">1880</span>
<span id="L1881" rel="#L1881">1881</span>
<span id="L1882" rel="#L1882">1882</span>
<span id="L1883" rel="#L1883">1883</span>
<span id="L1884" rel="#L1884">1884</span>
<span id="L1885" rel="#L1885">1885</span>
<span id="L1886" rel="#L1886">1886</span>
<span id="L1887" rel="#L1887">1887</span>
<span id="L1888" rel="#L1888">1888</span>
<span id="L1889" rel="#L1889">1889</span>
<span id="L1890" rel="#L1890">1890</span>
<span id="L1891" rel="#L1891">1891</span>
<span id="L1892" rel="#L1892">1892</span>
<span id="L1893" rel="#L1893">1893</span>
<span id="L1894" rel="#L1894">1894</span>
<span id="L1895" rel="#L1895">1895</span>
<span id="L1896" rel="#L1896">1896</span>
<span id="L1897" rel="#L1897">1897</span>
<span id="L1898" rel="#L1898">1898</span>
<span id="L1899" rel="#L1899">1899</span>
<span id="L1900" rel="#L1900">1900</span>
<span id="L1901" rel="#L1901">1901</span>
<span id="L1902" rel="#L1902">1902</span>
<span id="L1903" rel="#L1903">1903</span>
<span id="L1904" rel="#L1904">1904</span>
<span id="L1905" rel="#L1905">1905</span>
<span id="L1906" rel="#L1906">1906</span>
<span id="L1907" rel="#L1907">1907</span>
<span id="L1908" rel="#L1908">1908</span>
<span id="L1909" rel="#L1909">1909</span>
<span id="L1910" rel="#L1910">1910</span>
<span id="L1911" rel="#L1911">1911</span>
<span id="L1912" rel="#L1912">1912</span>
<span id="L1913" rel="#L1913">1913</span>
<span id="L1914" rel="#L1914">1914</span>
<span id="L1915" rel="#L1915">1915</span>
<span id="L1916" rel="#L1916">1916</span>
<span id="L1917" rel="#L1917">1917</span>
<span id="L1918" rel="#L1918">1918</span>
<span id="L1919" rel="#L1919">1919</span>
<span id="L1920" rel="#L1920">1920</span>
<span id="L1921" rel="#L1921">1921</span>
<span id="L1922" rel="#L1922">1922</span>
<span id="L1923" rel="#L1923">1923</span>
<span id="L1924" rel="#L1924">1924</span>
<span id="L1925" rel="#L1925">1925</span>
<span id="L1926" rel="#L1926">1926</span>
<span id="L1927" rel="#L1927">1927</span>
<span id="L1928" rel="#L1928">1928</span>
<span id="L1929" rel="#L1929">1929</span>
<span id="L1930" rel="#L1930">1930</span>
<span id="L1931" rel="#L1931">1931</span>
<span id="L1932" rel="#L1932">1932</span>
<span id="L1933" rel="#L1933">1933</span>
<span id="L1934" rel="#L1934">1934</span>
<span id="L1935" rel="#L1935">1935</span>
<span id="L1936" rel="#L1936">1936</span>
<span id="L1937" rel="#L1937">1937</span>
<span id="L1938" rel="#L1938">1938</span>
<span id="L1939" rel="#L1939">1939</span>
<span id="L1940" rel="#L1940">1940</span>
<span id="L1941" rel="#L1941">1941</span>
<span id="L1942" rel="#L1942">1942</span>
<span id="L1943" rel="#L1943">1943</span>
<span id="L1944" rel="#L1944">1944</span>
<span id="L1945" rel="#L1945">1945</span>
<span id="L1946" rel="#L1946">1946</span>
<span id="L1947" rel="#L1947">1947</span>
<span id="L1948" rel="#L1948">1948</span>
<span id="L1949" rel="#L1949">1949</span>
<span id="L1950" rel="#L1950">1950</span>
<span id="L1951" rel="#L1951">1951</span>
<span id="L1952" rel="#L1952">1952</span>
<span id="L1953" rel="#L1953">1953</span>
<span id="L1954" rel="#L1954">1954</span>
<span id="L1955" rel="#L1955">1955</span>
<span id="L1956" rel="#L1956">1956</span>
<span id="L1957" rel="#L1957">1957</span>
<span id="L1958" rel="#L1958">1958</span>
<span id="L1959" rel="#L1959">1959</span>
<span id="L1960" rel="#L1960">1960</span>
<span id="L1961" rel="#L1961">1961</span>
<span id="L1962" rel="#L1962">1962</span>
<span id="L1963" rel="#L1963">1963</span>
<span id="L1964" rel="#L1964">1964</span>
<span id="L1965" rel="#L1965">1965</span>
<span id="L1966" rel="#L1966">1966</span>
<span id="L1967" rel="#L1967">1967</span>
<span id="L1968" rel="#L1968">1968</span>
<span id="L1969" rel="#L1969">1969</span>
<span id="L1970" rel="#L1970">1970</span>
<span id="L1971" rel="#L1971">1971</span>
<span id="L1972" rel="#L1972">1972</span>
<span id="L1973" rel="#L1973">1973</span>
<span id="L1974" rel="#L1974">1974</span>
<span id="L1975" rel="#L1975">1975</span>
<span id="L1976" rel="#L1976">1976</span>
<span id="L1977" rel="#L1977">1977</span>
<span id="L1978" rel="#L1978">1978</span>
<span id="L1979" rel="#L1979">1979</span>
<span id="L1980" rel="#L1980">1980</span>
<span id="L1981" rel="#L1981">1981</span>
<span id="L1982" rel="#L1982">1982</span>
<span id="L1983" rel="#L1983">1983</span>
<span id="L1984" rel="#L1984">1984</span>
<span id="L1985" rel="#L1985">1985</span>
<span id="L1986" rel="#L1986">1986</span>
<span id="L1987" rel="#L1987">1987</span>
<span id="L1988" rel="#L1988">1988</span>
<span id="L1989" rel="#L1989">1989</span>
<span id="L1990" rel="#L1990">1990</span>
<span id="L1991" rel="#L1991">1991</span>
<span id="L1992" rel="#L1992">1992</span>
<span id="L1993" rel="#L1993">1993</span>
<span id="L1994" rel="#L1994">1994</span>
<span id="L1995" rel="#L1995">1995</span>
<span id="L1996" rel="#L1996">1996</span>
<span id="L1997" rel="#L1997">1997</span>
<span id="L1998" rel="#L1998">1998</span>
<span id="L1999" rel="#L1999">1999</span>
<span id="L2000" rel="#L2000">2000</span>
<span id="L2001" rel="#L2001">2001</span>
<span id="L2002" rel="#L2002">2002</span>
<span id="L2003" rel="#L2003">2003</span>
<span id="L2004" rel="#L2004">2004</span>
<span id="L2005" rel="#L2005">2005</span>
<span id="L2006" rel="#L2006">2006</span>
<span id="L2007" rel="#L2007">2007</span>
<span id="L2008" rel="#L2008">2008</span>
<span id="L2009" rel="#L2009">2009</span>
<span id="L2010" rel="#L2010">2010</span>
<span id="L2011" rel="#L2011">2011</span>
<span id="L2012" rel="#L2012">2012</span>
<span id="L2013" rel="#L2013">2013</span>
<span id="L2014" rel="#L2014">2014</span>
<span id="L2015" rel="#L2015">2015</span>
<span id="L2016" rel="#L2016">2016</span>
<span id="L2017" rel="#L2017">2017</span>
<span id="L2018" rel="#L2018">2018</span>
<span id="L2019" rel="#L2019">2019</span>
<span id="L2020" rel="#L2020">2020</span>
<span id="L2021" rel="#L2021">2021</span>
<span id="L2022" rel="#L2022">2022</span>
<span id="L2023" rel="#L2023">2023</span>
<span id="L2024" rel="#L2024">2024</span>
<span id="L2025" rel="#L2025">2025</span>
<span id="L2026" rel="#L2026">2026</span>
<span id="L2027" rel="#L2027">2027</span>
<span id="L2028" rel="#L2028">2028</span>
<span id="L2029" rel="#L2029">2029</span>
<span id="L2030" rel="#L2030">2030</span>
<span id="L2031" rel="#L2031">2031</span>
<span id="L2032" rel="#L2032">2032</span>
<span id="L2033" rel="#L2033">2033</span>
<span id="L2034" rel="#L2034">2034</span>
<span id="L2035" rel="#L2035">2035</span>
<span id="L2036" rel="#L2036">2036</span>
<span id="L2037" rel="#L2037">2037</span>
<span id="L2038" rel="#L2038">2038</span>
<span id="L2039" rel="#L2039">2039</span>
<span id="L2040" rel="#L2040">2040</span>
<span id="L2041" rel="#L2041">2041</span>
<span id="L2042" rel="#L2042">2042</span>
<span id="L2043" rel="#L2043">2043</span>
<span id="L2044" rel="#L2044">2044</span>
<span id="L2045" rel="#L2045">2045</span>
<span id="L2046" rel="#L2046">2046</span>
<span id="L2047" rel="#L2047">2047</span>
<span id="L2048" rel="#L2048">2048</span>
<span id="L2049" rel="#L2049">2049</span>
<span id="L2050" rel="#L2050">2050</span>
<span id="L2051" rel="#L2051">2051</span>
<span id="L2052" rel="#L2052">2052</span>
<span id="L2053" rel="#L2053">2053</span>
<span id="L2054" rel="#L2054">2054</span>
<span id="L2055" rel="#L2055">2055</span>
<span id="L2056" rel="#L2056">2056</span>
<span id="L2057" rel="#L2057">2057</span>
<span id="L2058" rel="#L2058">2058</span>
<span id="L2059" rel="#L2059">2059</span>
<span id="L2060" rel="#L2060">2060</span>
<span id="L2061" rel="#L2061">2061</span>
<span id="L2062" rel="#L2062">2062</span>
<span id="L2063" rel="#L2063">2063</span>
<span id="L2064" rel="#L2064">2064</span>
<span id="L2065" rel="#L2065">2065</span>
<span id="L2066" rel="#L2066">2066</span>
<span id="L2067" rel="#L2067">2067</span>
<span id="L2068" rel="#L2068">2068</span>
<span id="L2069" rel="#L2069">2069</span>
<span id="L2070" rel="#L2070">2070</span>
<span id="L2071" rel="#L2071">2071</span>
<span id="L2072" rel="#L2072">2072</span>
<span id="L2073" rel="#L2073">2073</span>
<span id="L2074" rel="#L2074">2074</span>
<span id="L2075" rel="#L2075">2075</span>
<span id="L2076" rel="#L2076">2076</span>
<span id="L2077" rel="#L2077">2077</span>
<span id="L2078" rel="#L2078">2078</span>
<span id="L2079" rel="#L2079">2079</span>
<span id="L2080" rel="#L2080">2080</span>
<span id="L2081" rel="#L2081">2081</span>
<span id="L2082" rel="#L2082">2082</span>
<span id="L2083" rel="#L2083">2083</span>
<span id="L2084" rel="#L2084">2084</span>
<span id="L2085" rel="#L2085">2085</span>
<span id="L2086" rel="#L2086">2086</span>
<span id="L2087" rel="#L2087">2087</span>
<span id="L2088" rel="#L2088">2088</span>
<span id="L2089" rel="#L2089">2089</span>
<span id="L2090" rel="#L2090">2090</span>
<span id="L2091" rel="#L2091">2091</span>
<span id="L2092" rel="#L2092">2092</span>
<span id="L2093" rel="#L2093">2093</span>
<span id="L2094" rel="#L2094">2094</span>
<span id="L2095" rel="#L2095">2095</span>
<span id="L2096" rel="#L2096">2096</span>
<span id="L2097" rel="#L2097">2097</span>
<span id="L2098" rel="#L2098">2098</span>
<span id="L2099" rel="#L2099">2099</span>
<span id="L2100" rel="#L2100">2100</span>
<span id="L2101" rel="#L2101">2101</span>
<span id="L2102" rel="#L2102">2102</span>
<span id="L2103" rel="#L2103">2103</span>
<span id="L2104" rel="#L2104">2104</span>
<span id="L2105" rel="#L2105">2105</span>
<span id="L2106" rel="#L2106">2106</span>
<span id="L2107" rel="#L2107">2107</span>
<span id="L2108" rel="#L2108">2108</span>
<span id="L2109" rel="#L2109">2109</span>
<span id="L2110" rel="#L2110">2110</span>
<span id="L2111" rel="#L2111">2111</span>
<span id="L2112" rel="#L2112">2112</span>
<span id="L2113" rel="#L2113">2113</span>
<span id="L2114" rel="#L2114">2114</span>
<span id="L2115" rel="#L2115">2115</span>
<span id="L2116" rel="#L2116">2116</span>
<span id="L2117" rel="#L2117">2117</span>
<span id="L2118" rel="#L2118">2118</span>
<span id="L2119" rel="#L2119">2119</span>
<span id="L2120" rel="#L2120">2120</span>
<span id="L2121" rel="#L2121">2121</span>
<span id="L2122" rel="#L2122">2122</span>
<span id="L2123" rel="#L2123">2123</span>
<span id="L2124" rel="#L2124">2124</span>
<span id="L2125" rel="#L2125">2125</span>
<span id="L2126" rel="#L2126">2126</span>
<span id="L2127" rel="#L2127">2127</span>
<span id="L2128" rel="#L2128">2128</span>
<span id="L2129" rel="#L2129">2129</span>
<span id="L2130" rel="#L2130">2130</span>
<span id="L2131" rel="#L2131">2131</span>
<span id="L2132" rel="#L2132">2132</span>
<span id="L2133" rel="#L2133">2133</span>
<span id="L2134" rel="#L2134">2134</span>
<span id="L2135" rel="#L2135">2135</span>
<span id="L2136" rel="#L2136">2136</span>
<span id="L2137" rel="#L2137">2137</span>
<span id="L2138" rel="#L2138">2138</span>
<span id="L2139" rel="#L2139">2139</span>
<span id="L2140" rel="#L2140">2140</span>
<span id="L2141" rel="#L2141">2141</span>
<span id="L2142" rel="#L2142">2142</span>
<span id="L2143" rel="#L2143">2143</span>
<span id="L2144" rel="#L2144">2144</span>
<span id="L2145" rel="#L2145">2145</span>
<span id="L2146" rel="#L2146">2146</span>
<span id="L2147" rel="#L2147">2147</span>
<span id="L2148" rel="#L2148">2148</span>
<span id="L2149" rel="#L2149">2149</span>
<span id="L2150" rel="#L2150">2150</span>
<span id="L2151" rel="#L2151">2151</span>
<span id="L2152" rel="#L2152">2152</span>
<span id="L2153" rel="#L2153">2153</span>
<span id="L2154" rel="#L2154">2154</span>
<span id="L2155" rel="#L2155">2155</span>
<span id="L2156" rel="#L2156">2156</span>
<span id="L2157" rel="#L2157">2157</span>
<span id="L2158" rel="#L2158">2158</span>
<span id="L2159" rel="#L2159">2159</span>
<span id="L2160" rel="#L2160">2160</span>
<span id="L2161" rel="#L2161">2161</span>
<span id="L2162" rel="#L2162">2162</span>
<span id="L2163" rel="#L2163">2163</span>
<span id="L2164" rel="#L2164">2164</span>
<span id="L2165" rel="#L2165">2165</span>
<span id="L2166" rel="#L2166">2166</span>
<span id="L2167" rel="#L2167">2167</span>
<span id="L2168" rel="#L2168">2168</span>
<span id="L2169" rel="#L2169">2169</span>
<span id="L2170" rel="#L2170">2170</span>
<span id="L2171" rel="#L2171">2171</span>
<span id="L2172" rel="#L2172">2172</span>
<span id="L2173" rel="#L2173">2173</span>
<span id="L2174" rel="#L2174">2174</span>
<span id="L2175" rel="#L2175">2175</span>
<span id="L2176" rel="#L2176">2176</span>
<span id="L2177" rel="#L2177">2177</span>
<span id="L2178" rel="#L2178">2178</span>
<span id="L2179" rel="#L2179">2179</span>
<span id="L2180" rel="#L2180">2180</span>
<span id="L2181" rel="#L2181">2181</span>
<span id="L2182" rel="#L2182">2182</span>
<span id="L2183" rel="#L2183">2183</span>
<span id="L2184" rel="#L2184">2184</span>
<span id="L2185" rel="#L2185">2185</span>
<span id="L2186" rel="#L2186">2186</span>
<span id="L2187" rel="#L2187">2187</span>
<span id="L2188" rel="#L2188">2188</span>
<span id="L2189" rel="#L2189">2189</span>
<span id="L2190" rel="#L2190">2190</span>
<span id="L2191" rel="#L2191">2191</span>
<span id="L2192" rel="#L2192">2192</span>
<span id="L2193" rel="#L2193">2193</span>
<span id="L2194" rel="#L2194">2194</span>
<span id="L2195" rel="#L2195">2195</span>
<span id="L2196" rel="#L2196">2196</span>
<span id="L2197" rel="#L2197">2197</span>
<span id="L2198" rel="#L2198">2198</span>
<span id="L2199" rel="#L2199">2199</span>
<span id="L2200" rel="#L2200">2200</span>
<span id="L2201" rel="#L2201">2201</span>
</pre>
          </td>
          <td width="100%">
                  <div class="highlight"><pre><div class='line' id='LC1'><span class="cm">/*</span></div><div class='line' id='LC2'><br/></div><div class='line' id='LC3'><span class="cm">Copyright (C) 2011 by Yehuda Katz</span></div><div class='line' id='LC4'><br/></div><div class='line' id='LC5'><span class="cm">Permission is hereby granted, free of charge, to any person obtaining a copy</span></div><div class='line' id='LC6'><span class="cm">of this software and associated documentation files (the &quot;Software&quot;), to deal</span></div><div class='line' id='LC7'><span class="cm">in the Software without restriction, including without limitation the rights</span></div><div class='line' id='LC8'><span class="cm">to use, copy, modify, merge, publish, distribute, sublicense, and/or sell</span></div><div class='line' id='LC9'><span class="cm">copies of the Software, and to permit persons to whom the Software is</span></div><div class='line' id='LC10'><span class="cm">furnished to do so, subject to the following conditions:</span></div><div class='line' id='LC11'><br/></div><div class='line' id='LC12'><span class="cm">The above copyright notice and this permission notice shall be included in</span></div><div class='line' id='LC13'><span class="cm">all copies or substantial portions of the Software.</span></div><div class='line' id='LC14'><br/></div><div class='line' id='LC15'><span class="cm">THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR</span></div><div class='line' id='LC16'><span class="cm">IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,</span></div><div class='line' id='LC17'><span class="cm">FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE</span></div><div class='line' id='LC18'><span class="cm">AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER</span></div><div class='line' id='LC19'><span class="cm">LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,</span></div><div class='line' id='LC20'><span class="cm">OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN</span></div><div class='line' id='LC21'><span class="cm">THE SOFTWARE.</span></div><div class='line' id='LC22'><br/></div><div class='line' id='LC23'><span class="cm">*/</span></div><div class='line' id='LC24'><br/></div><div class='line' id='LC25'><span class="c1">// lib/handlebars/base.js</span></div><div class='line' id='LC26'><br/></div><div class='line' id='LC27'><span class="cm">/*jshint eqnull:true*/</span></div><div class='line' id='LC28'><span class="k">this</span><span class="p">.</span><span class="nx">Handlebars</span> <span class="o">=</span> <span class="p">{};</span></div><div class='line' id='LC29'><br/></div><div class='line' id='LC30'><span class="p">(</span><span class="kd">function</span><span class="p">(</span><span class="nx">Handlebars</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC31'><br/></div><div class='line' id='LC32'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">VERSION</span> <span class="o">=</span> <span class="s2">&quot;1.0.0-rc.3&quot;</span><span class="p">;</span></div><div class='line' id='LC33'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">COMPILER_REVISION</span> <span class="o">=</span> <span class="mi">2</span><span class="p">;</span></div><div class='line' id='LC34'><br/></div><div class='line' id='LC35'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">REVISION_CHANGES</span> <span class="o">=</span> <span class="p">{</span></div><div class='line' id='LC36'>&nbsp;&nbsp;<span class="mi">1</span><span class="o">:</span> <span class="s1">&#39;&lt;= 1.0.rc.2&#39;</span><span class="p">,</span> <span class="c1">// 1.0.rc.2 is actually rev2 but doesn&#39;t report it</span></div><div class='line' id='LC37'>&nbsp;&nbsp;<span class="mi">2</span><span class="o">:</span> <span class="s1">&#39;&gt;= 1.0.0-rc.3&#39;</span></div><div class='line' id='LC38'><span class="p">};</span></div><div class='line' id='LC39'><br/></div><div class='line' id='LC40'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">helpers</span>  <span class="o">=</span> <span class="p">{};</span></div><div class='line' id='LC41'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">partials</span> <span class="o">=</span> <span class="p">{};</span></div><div class='line' id='LC42'><br/></div><div class='line' id='LC43'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">registerHelper</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">name</span><span class="p">,</span> <span class="nx">fn</span><span class="p">,</span> <span class="nx">inverse</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC44'>&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">inverse</span><span class="p">)</span> <span class="p">{</span> <span class="nx">fn</span><span class="p">.</span><span class="nx">not</span> <span class="o">=</span> <span class="nx">inverse</span><span class="p">;</span> <span class="p">}</span></div><div class='line' id='LC45'>&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">helpers</span><span class="p">[</span><span class="nx">name</span><span class="p">]</span> <span class="o">=</span> <span class="nx">fn</span><span class="p">;</span></div><div class='line' id='LC46'><span class="p">};</span></div><div class='line' id='LC47'><br/></div><div class='line' id='LC48'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">registerPartial</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">name</span><span class="p">,</span> <span class="nx">str</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC49'>&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">partials</span><span class="p">[</span><span class="nx">name</span><span class="p">]</span> <span class="o">=</span> <span class="nx">str</span><span class="p">;</span></div><div class='line' id='LC50'><span class="p">};</span></div><div class='line' id='LC51'><br/></div><div class='line' id='LC52'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">registerHelper</span><span class="p">(</span><span class="s1">&#39;helperMissing&#39;</span><span class="p">,</span> <span class="kd">function</span><span class="p">(</span><span class="nx">arg</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC53'>&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">arguments</span><span class="p">.</span><span class="nx">length</span> <span class="o">===</span> <span class="mi">2</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC54'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="kc">undefined</span><span class="p">;</span></div><div class='line' id='LC55'>&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC56'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nb">Error</span><span class="p">(</span><span class="s2">&quot;Could not find property &#39;&quot;</span> <span class="o">+</span> <span class="nx">arg</span> <span class="o">+</span> <span class="s2">&quot;&#39;&quot;</span><span class="p">);</span></div><div class='line' id='LC57'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC58'><span class="p">});</span></div><div class='line' id='LC59'><br/></div><div class='line' id='LC60'><span class="kd">var</span> <span class="nx">toString</span> <span class="o">=</span> <span class="nb">Object</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">toString</span><span class="p">,</span> <span class="nx">functionType</span> <span class="o">=</span> <span class="s2">&quot;[object Function]&quot;</span><span class="p">;</span></div><div class='line' id='LC61'><br/></div><div class='line' id='LC62'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">registerHelper</span><span class="p">(</span><span class="s1">&#39;blockHelperMissing&#39;</span><span class="p">,</span> <span class="kd">function</span><span class="p">(</span><span class="nx">context</span><span class="p">,</span> <span class="nx">options</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC63'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">inverse</span> <span class="o">=</span> <span class="nx">options</span><span class="p">.</span><span class="nx">inverse</span> <span class="o">||</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{},</span> <span class="nx">fn</span> <span class="o">=</span> <span class="nx">options</span><span class="p">.</span><span class="nx">fn</span><span class="p">;</span></div><div class='line' id='LC64'><br/></div><div class='line' id='LC65'><br/></div><div class='line' id='LC66'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">ret</span> <span class="o">=</span> <span class="s2">&quot;&quot;</span><span class="p">;</span></div><div class='line' id='LC67'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">type</span> <span class="o">=</span> <span class="nx">toString</span><span class="p">.</span><span class="nx">call</span><span class="p">(</span><span class="nx">context</span><span class="p">);</span></div><div class='line' id='LC68'><br/></div><div class='line' id='LC69'>&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">type</span> <span class="o">===</span> <span class="nx">functionType</span><span class="p">)</span> <span class="p">{</span> <span class="nx">context</span> <span class="o">=</span> <span class="nx">context</span><span class="p">.</span><span class="nx">call</span><span class="p">(</span><span class="k">this</span><span class="p">);</span> <span class="p">}</span></div><div class='line' id='LC70'><br/></div><div class='line' id='LC71'>&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">context</span> <span class="o">===</span> <span class="kc">true</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC72'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">fn</span><span class="p">(</span><span class="k">this</span><span class="p">);</span></div><div class='line' id='LC73'>&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="nx">context</span> <span class="o">===</span> <span class="kc">false</span> <span class="o">||</span> <span class="nx">context</span> <span class="o">==</span> <span class="kc">null</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC74'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">inverse</span><span class="p">(</span><span class="k">this</span><span class="p">);</span></div><div class='line' id='LC75'>&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="nx">type</span> <span class="o">===</span> <span class="s2">&quot;[object Array]&quot;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC76'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">context</span><span class="p">.</span><span class="nx">length</span> <span class="o">&gt;</span> <span class="mi">0</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC77'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">helpers</span><span class="p">.</span><span class="nx">each</span><span class="p">(</span><span class="nx">context</span><span class="p">,</span> <span class="nx">options</span><span class="p">);</span></div><div class='line' id='LC78'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC79'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">inverse</span><span class="p">(</span><span class="k">this</span><span class="p">);</span></div><div class='line' id='LC80'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC81'>&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC82'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">fn</span><span class="p">(</span><span class="nx">context</span><span class="p">);</span></div><div class='line' id='LC83'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC84'><span class="p">});</span></div><div class='line' id='LC85'><br/></div><div class='line' id='LC86'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">K</span> <span class="o">=</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{};</span></div><div class='line' id='LC87'><br/></div><div class='line' id='LC88'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">createFrame</span> <span class="o">=</span> <span class="nb">Object</span><span class="p">.</span><span class="nx">create</span> <span class="o">||</span> <span class="kd">function</span><span class="p">(</span><span class="nx">object</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC89'>&nbsp;&nbsp;<span class="nx">Handlebars</span><span class="p">.</span><span class="nx">K</span><span class="p">.</span><span class="nx">prototype</span> <span class="o">=</span> <span class="nx">object</span><span class="p">;</span></div><div class='line' id='LC90'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">obj</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">K</span><span class="p">();</span></div><div class='line' id='LC91'>&nbsp;&nbsp;<span class="nx">Handlebars</span><span class="p">.</span><span class="nx">K</span><span class="p">.</span><span class="nx">prototype</span> <span class="o">=</span> <span class="kc">null</span><span class="p">;</span></div><div class='line' id='LC92'>&nbsp;&nbsp;<span class="k">return</span> <span class="nx">obj</span><span class="p">;</span></div><div class='line' id='LC93'><span class="p">};</span></div><div class='line' id='LC94'><br/></div><div class='line' id='LC95'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">logger</span> <span class="o">=</span> <span class="p">{</span></div><div class='line' id='LC96'>&nbsp;&nbsp;<span class="nx">DEBUG</span><span class="o">:</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">INFO</span><span class="o">:</span> <span class="mi">1</span><span class="p">,</span> <span class="nx">WARN</span><span class="o">:</span> <span class="mi">2</span><span class="p">,</span> <span class="nx">ERROR</span><span class="o">:</span> <span class="mi">3</span><span class="p">,</span> <span class="nx">level</span><span class="o">:</span> <span class="mi">3</span><span class="p">,</span></div><div class='line' id='LC97'><br/></div><div class='line' id='LC98'>&nbsp;&nbsp;<span class="nx">methodMap</span><span class="o">:</span> <span class="p">{</span><span class="mi">0</span><span class="o">:</span> <span class="s1">&#39;debug&#39;</span><span class="p">,</span> <span class="mi">1</span><span class="o">:</span> <span class="s1">&#39;info&#39;</span><span class="p">,</span> <span class="mi">2</span><span class="o">:</span> <span class="s1">&#39;warn&#39;</span><span class="p">,</span> <span class="mi">3</span><span class="o">:</span> <span class="s1">&#39;error&#39;</span><span class="p">},</span></div><div class='line' id='LC99'><br/></div><div class='line' id='LC100'>&nbsp;&nbsp;<span class="c1">// can be overridden in the host environment</span></div><div class='line' id='LC101'>&nbsp;&nbsp;<span class="nx">log</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">level</span><span class="p">,</span> <span class="nx">obj</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC102'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">logger</span><span class="p">.</span><span class="nx">level</span> <span class="o">&lt;=</span> <span class="nx">level</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC103'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">method</span> <span class="o">=</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">logger</span><span class="p">.</span><span class="nx">methodMap</span><span class="p">[</span><span class="nx">level</span><span class="p">];</span></div><div class='line' id='LC104'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">typeof</span> <span class="nx">console</span> <span class="o">!==</span> <span class="s1">&#39;undefined&#39;</span> <span class="o">&amp;&amp;</span> <span class="nx">console</span><span class="p">[</span><span class="nx">method</span><span class="p">])</span> <span class="p">{</span></div><div class='line' id='LC105'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">console</span><span class="p">[</span><span class="nx">method</span><span class="p">].</span><span class="nx">call</span><span class="p">(</span><span class="nx">console</span><span class="p">,</span> <span class="nx">obj</span><span class="p">);</span></div><div class='line' id='LC106'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC107'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC108'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC109'><span class="p">};</span></div><div class='line' id='LC110'><br/></div><div class='line' id='LC111'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">log</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">level</span><span class="p">,</span> <span class="nx">obj</span><span class="p">)</span> <span class="p">{</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">logger</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span><span class="nx">level</span><span class="p">,</span> <span class="nx">obj</span><span class="p">);</span> <span class="p">};</span></div><div class='line' id='LC112'><br/></div><div class='line' id='LC113'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">registerHelper</span><span class="p">(</span><span class="s1">&#39;each&#39;</span><span class="p">,</span> <span class="kd">function</span><span class="p">(</span><span class="nx">context</span><span class="p">,</span> <span class="nx">options</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC114'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">fn</span> <span class="o">=</span> <span class="nx">options</span><span class="p">.</span><span class="nx">fn</span><span class="p">,</span> <span class="nx">inverse</span> <span class="o">=</span> <span class="nx">options</span><span class="p">.</span><span class="nx">inverse</span><span class="p">;</span></div><div class='line' id='LC115'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">ret</span> <span class="o">=</span> <span class="s2">&quot;&quot;</span><span class="p">,</span> <span class="nx">data</span><span class="p">;</span></div><div class='line' id='LC116'><br/></div><div class='line' id='LC117'>&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">options</span><span class="p">.</span><span class="nx">data</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC118'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">data</span> <span class="o">=</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">createFrame</span><span class="p">(</span><span class="nx">options</span><span class="p">.</span><span class="nx">data</span><span class="p">);</span></div><div class='line' id='LC119'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC120'><br/></div><div class='line' id='LC121'>&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">context</span> <span class="o">&amp;&amp;</span> <span class="k">typeof</span> <span class="nx">context</span> <span class="o">===</span> <span class="s1">&#39;object&#39;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC122'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">context</span> <span class="k">instanceof</span> <span class="nb">Array</span><span class="p">){</span></div><div class='line' id='LC123'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span><span class="p">(</span><span class="kd">var</span> <span class="nx">j</span> <span class="o">=</span> <span class="nx">context</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span><span class="o">&lt;</span><span class="nx">j</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC124'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">data</span><span class="p">)</span> <span class="p">{</span> <span class="nx">data</span><span class="p">.</span><span class="nx">index</span> <span class="o">=</span> <span class="nx">i</span><span class="p">;</span> <span class="p">}</span></div><div class='line' id='LC125'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">ret</span> <span class="o">=</span> <span class="nx">ret</span> <span class="o">+</span> <span class="nx">fn</span><span class="p">(</span><span class="nx">context</span><span class="p">[</span><span class="nx">i</span><span class="p">],</span> <span class="p">{</span> <span class="nx">data</span><span class="o">:</span> <span class="nx">data</span> <span class="p">});</span></div><div class='line' id='LC126'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC127'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC128'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span><span class="p">(</span><span class="kd">var</span> <span class="nx">key</span> <span class="k">in</span> <span class="nx">context</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC129'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">context</span><span class="p">.</span><span class="nx">hasOwnProperty</span><span class="p">(</span><span class="nx">key</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC130'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">data</span><span class="p">)</span> <span class="p">{</span> <span class="nx">data</span><span class="p">.</span><span class="nx">key</span> <span class="o">=</span> <span class="nx">key</span><span class="p">;</span> <span class="p">}</span></div><div class='line' id='LC131'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">ret</span> <span class="o">=</span> <span class="nx">ret</span> <span class="o">+</span> <span class="nx">fn</span><span class="p">(</span><span class="nx">context</span><span class="p">[</span><span class="nx">key</span><span class="p">],</span> <span class="p">{</span><span class="nx">data</span><span class="o">:</span> <span class="nx">data</span><span class="p">});</span></div><div class='line' id='LC132'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">i</span><span class="o">++</span><span class="p">;</span></div><div class='line' id='LC133'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC134'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC135'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC136'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC137'><br/></div><div class='line' id='LC138'>&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">i</span> <span class="o">===</span> <span class="mi">0</span><span class="p">){</span></div><div class='line' id='LC139'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">ret</span> <span class="o">=</span> <span class="nx">inverse</span><span class="p">(</span><span class="k">this</span><span class="p">);</span></div><div class='line' id='LC140'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC141'><br/></div><div class='line' id='LC142'>&nbsp;&nbsp;<span class="k">return</span> <span class="nx">ret</span><span class="p">;</span></div><div class='line' id='LC143'><span class="p">});</span></div><div class='line' id='LC144'><br/></div><div class='line' id='LC145'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">registerHelper</span><span class="p">(</span><span class="s1">&#39;if&#39;</span><span class="p">,</span> <span class="kd">function</span><span class="p">(</span><span class="nx">context</span><span class="p">,</span> <span class="nx">options</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC146'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">type</span> <span class="o">=</span> <span class="nx">toString</span><span class="p">.</span><span class="nx">call</span><span class="p">(</span><span class="nx">context</span><span class="p">);</span></div><div class='line' id='LC147'>&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">type</span> <span class="o">===</span> <span class="nx">functionType</span><span class="p">)</span> <span class="p">{</span> <span class="nx">context</span> <span class="o">=</span> <span class="nx">context</span><span class="p">.</span><span class="nx">call</span><span class="p">(</span><span class="k">this</span><span class="p">);</span> <span class="p">}</span></div><div class='line' id='LC148'><br/></div><div class='line' id='LC149'>&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="o">!</span><span class="nx">context</span> <span class="o">||</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">Utils</span><span class="p">.</span><span class="nx">isEmpty</span><span class="p">(</span><span class="nx">context</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC150'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">options</span><span class="p">.</span><span class="nx">inverse</span><span class="p">(</span><span class="k">this</span><span class="p">);</span></div><div class='line' id='LC151'>&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC152'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">options</span><span class="p">.</span><span class="nx">fn</span><span class="p">(</span><span class="k">this</span><span class="p">);</span></div><div class='line' id='LC153'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC154'><span class="p">});</span></div><div class='line' id='LC155'><br/></div><div class='line' id='LC156'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">registerHelper</span><span class="p">(</span><span class="s1">&#39;unless&#39;</span><span class="p">,</span> <span class="kd">function</span><span class="p">(</span><span class="nx">context</span><span class="p">,</span> <span class="nx">options</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC157'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">fn</span> <span class="o">=</span> <span class="nx">options</span><span class="p">.</span><span class="nx">fn</span><span class="p">,</span> <span class="nx">inverse</span> <span class="o">=</span> <span class="nx">options</span><span class="p">.</span><span class="nx">inverse</span><span class="p">;</span></div><div class='line' id='LC158'>&nbsp;&nbsp;<span class="nx">options</span><span class="p">.</span><span class="nx">fn</span> <span class="o">=</span> <span class="nx">inverse</span><span class="p">;</span></div><div class='line' id='LC159'>&nbsp;&nbsp;<span class="nx">options</span><span class="p">.</span><span class="nx">inverse</span> <span class="o">=</span> <span class="nx">fn</span><span class="p">;</span></div><div class='line' id='LC160'><br/></div><div class='line' id='LC161'>&nbsp;&nbsp;<span class="k">return</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">helpers</span><span class="p">[</span><span class="s1">&#39;if&#39;</span><span class="p">].</span><span class="nx">call</span><span class="p">(</span><span class="k">this</span><span class="p">,</span> <span class="nx">context</span><span class="p">,</span> <span class="nx">options</span><span class="p">);</span></div><div class='line' id='LC162'><span class="p">});</span></div><div class='line' id='LC163'><br/></div><div class='line' id='LC164'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">registerHelper</span><span class="p">(</span><span class="s1">&#39;with&#39;</span><span class="p">,</span> <span class="kd">function</span><span class="p">(</span><span class="nx">context</span><span class="p">,</span> <span class="nx">options</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC165'>&nbsp;&nbsp;<span class="k">return</span> <span class="nx">options</span><span class="p">.</span><span class="nx">fn</span><span class="p">(</span><span class="nx">context</span><span class="p">);</span></div><div class='line' id='LC166'><span class="p">});</span></div><div class='line' id='LC167'><br/></div><div class='line' id='LC168'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">registerHelper</span><span class="p">(</span><span class="s1">&#39;log&#39;</span><span class="p">,</span> <span class="kd">function</span><span class="p">(</span><span class="nx">context</span><span class="p">,</span> <span class="nx">options</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC169'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">level</span> <span class="o">=</span> <span class="nx">options</span><span class="p">.</span><span class="nx">data</span> <span class="o">&amp;&amp;</span> <span class="nx">options</span><span class="p">.</span><span class="nx">data</span><span class="p">.</span><span class="nx">level</span> <span class="o">!=</span> <span class="kc">null</span> <span class="o">?</span> <span class="nb">parseInt</span><span class="p">(</span><span class="nx">options</span><span class="p">.</span><span class="nx">data</span><span class="p">.</span><span class="nx">level</span><span class="p">,</span> <span class="mi">10</span><span class="p">)</span> <span class="o">:</span> <span class="mi">1</span><span class="p">;</span></div><div class='line' id='LC170'>&nbsp;&nbsp;<span class="nx">Handlebars</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span><span class="nx">level</span><span class="p">,</span> <span class="nx">context</span><span class="p">);</span></div><div class='line' id='LC171'><span class="p">});</span></div><div class='line' id='LC172'><br/></div><div class='line' id='LC173'><span class="p">}(</span><span class="k">this</span><span class="p">.</span><span class="nx">Handlebars</span><span class="p">));</span></div><div class='line' id='LC174'><span class="p">;</span></div><div class='line' id='LC175'><span class="c1">// lib/handlebars/compiler/parser.js</span></div><div class='line' id='LC176'><span class="cm">/* Jison generated parser */</span></div><div class='line' id='LC177'><span class="kd">var</span> <span class="nx">handlebars</span> <span class="o">=</span> <span class="p">(</span><span class="kd">function</span><span class="p">(){</span></div><div class='line' id='LC178'><span class="kd">var</span> <span class="nx">parser</span> <span class="o">=</span> <span class="p">{</span><span class="nx">trace</span><span class="o">:</span> <span class="kd">function</span> <span class="nx">trace</span><span class="p">()</span> <span class="p">{</span> <span class="p">},</span></div><div class='line' id='LC179'><span class="nx">yy</span><span class="o">:</span> <span class="p">{},</span></div><div class='line' id='LC180'><span class="nx">symbols_</span><span class="o">:</span> <span class="p">{</span><span class="s2">&quot;error&quot;</span><span class="o">:</span><span class="mi">2</span><span class="p">,</span><span class="s2">&quot;root&quot;</span><span class="o">:</span><span class="mi">3</span><span class="p">,</span><span class="s2">&quot;program&quot;</span><span class="o">:</span><span class="mi">4</span><span class="p">,</span><span class="s2">&quot;EOF&quot;</span><span class="o">:</span><span class="mi">5</span><span class="p">,</span><span class="s2">&quot;simpleInverse&quot;</span><span class="o">:</span><span class="mi">6</span><span class="p">,</span><span class="s2">&quot;statements&quot;</span><span class="o">:</span><span class="mi">7</span><span class="p">,</span><span class="s2">&quot;statement&quot;</span><span class="o">:</span><span class="mi">8</span><span class="p">,</span><span class="s2">&quot;openInverse&quot;</span><span class="o">:</span><span class="mi">9</span><span class="p">,</span><span class="s2">&quot;closeBlock&quot;</span><span class="o">:</span><span class="mi">10</span><span class="p">,</span><span class="s2">&quot;openBlock&quot;</span><span class="o">:</span><span class="mi">11</span><span class="p">,</span><span class="s2">&quot;mustache&quot;</span><span class="o">:</span><span class="mi">12</span><span class="p">,</span><span class="s2">&quot;partial&quot;</span><span class="o">:</span><span class="mi">13</span><span class="p">,</span><span class="s2">&quot;CONTENT&quot;</span><span class="o">:</span><span class="mi">14</span><span class="p">,</span><span class="s2">&quot;COMMENT&quot;</span><span class="o">:</span><span class="mi">15</span><span class="p">,</span><span class="s2">&quot;OPEN_BLOCK&quot;</span><span class="o">:</span><span class="mi">16</span><span class="p">,</span><span class="s2">&quot;inMustache&quot;</span><span class="o">:</span><span class="mi">17</span><span class="p">,</span><span class="s2">&quot;CLOSE&quot;</span><span class="o">:</span><span class="mi">18</span><span class="p">,</span><span class="s2">&quot;OPEN_INVERSE&quot;</span><span class="o">:</span><span class="mi">19</span><span class="p">,</span><span class="s2">&quot;OPEN_ENDBLOCK&quot;</span><span class="o">:</span><span class="mi">20</span><span class="p">,</span><span class="s2">&quot;path&quot;</span><span class="o">:</span><span class="mi">21</span><span class="p">,</span><span class="s2">&quot;OPEN&quot;</span><span class="o">:</span><span class="mi">22</span><span class="p">,</span><span class="s2">&quot;OPEN_UNESCAPED&quot;</span><span class="o">:</span><span class="mi">23</span><span class="p">,</span><span class="s2">&quot;OPEN_PARTIAL&quot;</span><span class="o">:</span><span class="mi">24</span><span class="p">,</span><span class="s2">&quot;partialName&quot;</span><span class="o">:</span><span class="mi">25</span><span class="p">,</span><span class="s2">&quot;params&quot;</span><span class="o">:</span><span class="mi">26</span><span class="p">,</span><span class="s2">&quot;hash&quot;</span><span class="o">:</span><span class="mi">27</span><span class="p">,</span><span class="s2">&quot;DATA&quot;</span><span class="o">:</span><span class="mi">28</span><span class="p">,</span><span class="s2">&quot;param&quot;</span><span class="o">:</span><span class="mi">29</span><span class="p">,</span><span class="s2">&quot;STRING&quot;</span><span class="o">:</span><span class="mi">30</span><span class="p">,</span><span class="s2">&quot;INTEGER&quot;</span><span class="o">:</span><span class="mi">31</span><span class="p">,</span><span class="s2">&quot;BOOLEAN&quot;</span><span class="o">:</span><span class="mi">32</span><span class="p">,</span><span class="s2">&quot;hashSegments&quot;</span><span class="o">:</span><span class="mi">33</span><span class="p">,</span><span class="s2">&quot;hashSegment&quot;</span><span class="o">:</span><span class="mi">34</span><span class="p">,</span><span class="s2">&quot;ID&quot;</span><span class="o">:</span><span class="mi">35</span><span class="p">,</span><span class="s2">&quot;EQUALS&quot;</span><span class="o">:</span><span class="mi">36</span><span class="p">,</span><span class="s2">&quot;PARTIAL_NAME&quot;</span><span class="o">:</span><span class="mi">37</span><span class="p">,</span><span class="s2">&quot;pathSegments&quot;</span><span class="o">:</span><span class="mi">38</span><span class="p">,</span><span class="s2">&quot;SEP&quot;</span><span class="o">:</span><span class="mi">39</span><span class="p">,</span><span class="s2">&quot;$accept&quot;</span><span class="o">:</span><span class="mi">0</span><span class="p">,</span><span class="s2">&quot;$end&quot;</span><span class="o">:</span><span class="mi">1</span><span class="p">},</span></div><div class='line' id='LC181'><span class="nx">terminals_</span><span class="o">:</span> <span class="p">{</span><span class="mi">2</span><span class="o">:</span><span class="s2">&quot;error&quot;</span><span class="p">,</span><span class="mi">5</span><span class="o">:</span><span class="s2">&quot;EOF&quot;</span><span class="p">,</span><span class="mi">14</span><span class="o">:</span><span class="s2">&quot;CONTENT&quot;</span><span class="p">,</span><span class="mi">15</span><span class="o">:</span><span class="s2">&quot;COMMENT&quot;</span><span class="p">,</span><span class="mi">16</span><span class="o">:</span><span class="s2">&quot;OPEN_BLOCK&quot;</span><span class="p">,</span><span class="mi">18</span><span class="o">:</span><span class="s2">&quot;CLOSE&quot;</span><span class="p">,</span><span class="mi">19</span><span class="o">:</span><span class="s2">&quot;OPEN_INVERSE&quot;</span><span class="p">,</span><span class="mi">20</span><span class="o">:</span><span class="s2">&quot;OPEN_ENDBLOCK&quot;</span><span class="p">,</span><span class="mi">22</span><span class="o">:</span><span class="s2">&quot;OPEN&quot;</span><span class="p">,</span><span class="mi">23</span><span class="o">:</span><span class="s2">&quot;OPEN_UNESCAPED&quot;</span><span class="p">,</span><span class="mi">24</span><span class="o">:</span><span class="s2">&quot;OPEN_PARTIAL&quot;</span><span class="p">,</span><span class="mi">28</span><span class="o">:</span><span class="s2">&quot;DATA&quot;</span><span class="p">,</span><span class="mi">30</span><span class="o">:</span><span class="s2">&quot;STRING&quot;</span><span class="p">,</span><span class="mi">31</span><span class="o">:</span><span class="s2">&quot;INTEGER&quot;</span><span class="p">,</span><span class="mi">32</span><span class="o">:</span><span class="s2">&quot;BOOLEAN&quot;</span><span class="p">,</span><span class="mi">35</span><span class="o">:</span><span class="s2">&quot;ID&quot;</span><span class="p">,</span><span class="mi">36</span><span class="o">:</span><span class="s2">&quot;EQUALS&quot;</span><span class="p">,</span><span class="mi">37</span><span class="o">:</span><span class="s2">&quot;PARTIAL_NAME&quot;</span><span class="p">,</span><span class="mi">39</span><span class="o">:</span><span class="s2">&quot;SEP&quot;</span><span class="p">},</span></div><div class='line' id='LC182'><span class="nx">productions_</span><span class="o">:</span> <span class="p">[</span><span class="mi">0</span><span class="p">,[</span><span class="mi">3</span><span class="p">,</span><span class="mi">2</span><span class="p">],[</span><span class="mi">4</span><span class="p">,</span><span class="mi">2</span><span class="p">],[</span><span class="mi">4</span><span class="p">,</span><span class="mi">3</span><span class="p">],[</span><span class="mi">4</span><span class="p">,</span><span class="mi">2</span><span class="p">],[</span><span class="mi">4</span><span class="p">,</span><span class="mi">1</span><span class="p">],[</span><span class="mi">4</span><span class="p">,</span><span class="mi">1</span><span class="p">],[</span><span class="mi">4</span><span class="p">,</span><span class="mi">0</span><span class="p">],[</span><span class="mi">7</span><span class="p">,</span><span class="mi">1</span><span class="p">],[</span><span class="mi">7</span><span class="p">,</span><span class="mi">2</span><span class="p">],[</span><span class="mi">8</span><span class="p">,</span><span class="mi">3</span><span class="p">],[</span><span class="mi">8</span><span class="p">,</span><span class="mi">3</span><span class="p">],[</span><span class="mi">8</span><span class="p">,</span><span class="mi">1</span><span class="p">],[</span><span class="mi">8</span><span class="p">,</span><span class="mi">1</span><span class="p">],[</span><span class="mi">8</span><span class="p">,</span><span class="mi">1</span><span class="p">],[</span><span class="mi">8</span><span class="p">,</span><span class="mi">1</span><span class="p">],[</span><span class="mi">11</span><span class="p">,</span><span class="mi">3</span><span class="p">],[</span><span class="mi">9</span><span class="p">,</span><span class="mi">3</span><span class="p">],[</span><span class="mi">10</span><span class="p">,</span><span class="mi">3</span><span class="p">],[</span><span class="mi">12</span><span class="p">,</span><span class="mi">3</span><span class="p">],[</span><span class="mi">12</span><span class="p">,</span><span class="mi">3</span><span class="p">],[</span><span class="mi">13</span><span class="p">,</span><span class="mi">3</span><span class="p">],[</span><span class="mi">13</span><span class="p">,</span><span class="mi">4</span><span class="p">],[</span><span class="mi">6</span><span class="p">,</span><span class="mi">2</span><span class="p">],[</span><span class="mi">17</span><span class="p">,</span><span class="mi">3</span><span class="p">],[</span><span class="mi">17</span><span class="p">,</span><span class="mi">2</span><span class="p">],[</span><span class="mi">17</span><span class="p">,</span><span class="mi">2</span><span class="p">],[</span><span class="mi">17</span><span class="p">,</span><span class="mi">1</span><span class="p">],[</span><span class="mi">17</span><span class="p">,</span><span class="mi">1</span><span class="p">],[</span><span class="mi">26</span><span class="p">,</span><span class="mi">2</span><span class="p">],[</span><span class="mi">26</span><span class="p">,</span><span class="mi">1</span><span class="p">],[</span><span class="mi">29</span><span class="p">,</span><span class="mi">1</span><span class="p">],[</span><span class="mi">29</span><span class="p">,</span><span class="mi">1</span><span class="p">],[</span><span class="mi">29</span><span class="p">,</span><span class="mi">1</span><span class="p">],[</span><span class="mi">29</span><span class="p">,</span><span class="mi">1</span><span class="p">],[</span><span class="mi">29</span><span class="p">,</span><span class="mi">1</span><span class="p">],[</span><span class="mi">27</span><span class="p">,</span><span class="mi">1</span><span class="p">],[</span><span class="mi">33</span><span class="p">,</span><span class="mi">2</span><span class="p">],[</span><span class="mi">33</span><span class="p">,</span><span class="mi">1</span><span class="p">],[</span><span class="mi">34</span><span class="p">,</span><span class="mi">3</span><span class="p">],[</span><span class="mi">34</span><span class="p">,</span><span class="mi">3</span><span class="p">],[</span><span class="mi">34</span><span class="p">,</span><span class="mi">3</span><span class="p">],[</span><span class="mi">34</span><span class="p">,</span><span class="mi">3</span><span class="p">],[</span><span class="mi">34</span><span class="p">,</span><span class="mi">3</span><span class="p">],[</span><span class="mi">25</span><span class="p">,</span><span class="mi">1</span><span class="p">],[</span><span class="mi">21</span><span class="p">,</span><span class="mi">1</span><span class="p">],[</span><span class="mi">38</span><span class="p">,</span><span class="mi">3</span><span class="p">],[</span><span class="mi">38</span><span class="p">,</span><span class="mi">1</span><span class="p">]],</span></div><div class='line' id='LC183'><span class="nx">performAction</span><span class="o">:</span> <span class="kd">function</span> <span class="nx">anonymous</span><span class="p">(</span><span class="nx">yytext</span><span class="p">,</span><span class="nx">yyleng</span><span class="p">,</span><span class="nx">yylineno</span><span class="p">,</span><span class="nx">yy</span><span class="p">,</span><span class="nx">yystate</span><span class="p">,</span><span class="nx">$$</span><span class="p">,</span><span class="nx">_$</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC184'><br/></div><div class='line' id='LC185'><span class="kd">var</span> <span class="nx">$0</span> <span class="o">=</span> <span class="nx">$$</span><span class="p">.</span><span class="nx">length</span> <span class="o">-</span> <span class="mi">1</span><span class="p">;</span></div><div class='line' id='LC186'><span class="k">switch</span> <span class="p">(</span><span class="nx">yystate</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC187'><span class="k">case</span> <span class="mi">1</span><span class="o">:</span> <span class="k">return</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">];</span> </div><div class='line' id='LC188'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC189'><span class="k">case</span> <span class="mi">2</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">ProgramNode</span><span class="p">([],</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]);</span> </div><div class='line' id='LC190'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC191'><span class="k">case</span> <span class="mi">3</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">ProgramNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">2</span><span class="p">],</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]);</span> </div><div class='line' id='LC192'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC193'><span class="k">case</span> <span class="mi">4</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">ProgramNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">],</span> <span class="p">[]);</span> </div><div class='line' id='LC194'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC195'><span class="k">case</span> <span class="mi">5</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">ProgramNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]);</span> </div><div class='line' id='LC196'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC197'><span class="k">case</span> <span class="mi">6</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">ProgramNode</span><span class="p">([],</span> <span class="p">[]);</span> </div><div class='line' id='LC198'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC199'><span class="k">case</span> <span class="mi">7</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">ProgramNode</span><span class="p">([]);</span> </div><div class='line' id='LC200'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC201'><span class="k">case</span> <span class="mi">8</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="p">[</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]];</span> </div><div class='line' id='LC202'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC203'><span class="k">case</span> <span class="mi">9</span><span class="o">:</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">].</span><span class="nx">push</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]);</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">];</span> </div><div class='line' id='LC204'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC205'><span class="k">case</span> <span class="mi">10</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">BlockNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">2</span><span class="p">],</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">].</span><span class="nx">inverse</span><span class="p">,</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">],</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]);</span> </div><div class='line' id='LC206'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC207'><span class="k">case</span> <span class="mi">11</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">BlockNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">2</span><span class="p">],</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">],</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">].</span><span class="nx">inverse</span><span class="p">,</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]);</span> </div><div class='line' id='LC208'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC209'><span class="k">case</span> <span class="mi">12</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">];</span> </div><div class='line' id='LC210'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC211'><span class="k">case</span> <span class="mi">13</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">];</span> </div><div class='line' id='LC212'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC213'><span class="k">case</span> <span class="mi">14</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">ContentNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]);</span> </div><div class='line' id='LC214'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC215'><span class="k">case</span> <span class="mi">15</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">CommentNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]);</span> </div><div class='line' id='LC216'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC217'><span class="k">case</span> <span class="mi">16</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">MustacheNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">][</span><span class="mi">0</span><span class="p">],</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">][</span><span class="mi">1</span><span class="p">]);</span> </div><div class='line' id='LC218'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC219'><span class="k">case</span> <span class="mi">17</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">MustacheNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">][</span><span class="mi">0</span><span class="p">],</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">][</span><span class="mi">1</span><span class="p">]);</span> </div><div class='line' id='LC220'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC221'><span class="k">case</span> <span class="mi">18</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">];</span> </div><div class='line' id='LC222'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC223'><span class="k">case</span> <span class="mi">19</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">MustacheNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">][</span><span class="mi">0</span><span class="p">],</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">][</span><span class="mi">1</span><span class="p">]);</span> </div><div class='line' id='LC224'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC225'><span class="k">case</span> <span class="mi">20</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">MustacheNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">][</span><span class="mi">0</span><span class="p">],</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">][</span><span class="mi">1</span><span class="p">],</span> <span class="kc">true</span><span class="p">);</span> </div><div class='line' id='LC226'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC227'><span class="k">case</span> <span class="mi">21</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">PartialNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">]);</span> </div><div class='line' id='LC228'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC229'><span class="k">case</span> <span class="mi">22</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">PartialNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">2</span><span class="p">],</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">]);</span> </div><div class='line' id='LC230'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC231'><span class="k">case</span> <span class="mi">23</span><span class="o">:</span> </div><div class='line' id='LC232'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC233'><span class="k">case</span> <span class="mi">24</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="p">[[</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">2</span><span class="p">]].</span><span class="nx">concat</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">]),</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]];</span> </div><div class='line' id='LC234'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC235'><span class="k">case</span> <span class="mi">25</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="p">[[</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">]].</span><span class="nx">concat</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]),</span> <span class="kc">null</span><span class="p">];</span> </div><div class='line' id='LC236'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC237'><span class="k">case</span> <span class="mi">26</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="p">[[</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">]],</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]];</span> </div><div class='line' id='LC238'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC239'><span class="k">case</span> <span class="mi">27</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="p">[[</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]],</span> <span class="kc">null</span><span class="p">];</span> </div><div class='line' id='LC240'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC241'><span class="k">case</span> <span class="mi">28</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="p">[[</span><span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">DataNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">])],</span> <span class="kc">null</span><span class="p">];</span> </div><div class='line' id='LC242'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC243'><span class="k">case</span> <span class="mi">29</span><span class="o">:</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">].</span><span class="nx">push</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]);</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">];</span> </div><div class='line' id='LC244'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC245'><span class="k">case</span> <span class="mi">30</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="p">[</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]];</span> </div><div class='line' id='LC246'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC247'><span class="k">case</span> <span class="mi">31</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">];</span> </div><div class='line' id='LC248'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC249'><span class="k">case</span> <span class="mi">32</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">StringNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]);</span> </div><div class='line' id='LC250'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC251'><span class="k">case</span> <span class="mi">33</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">IntegerNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]);</span> </div><div class='line' id='LC252'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC253'><span class="k">case</span> <span class="mi">34</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">BooleanNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]);</span> </div><div class='line' id='LC254'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC255'><span class="k">case</span> <span class="mi">35</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">DataNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]);</span> </div><div class='line' id='LC256'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC257'><span class="k">case</span> <span class="mi">36</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">HashNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]);</span> </div><div class='line' id='LC258'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC259'><span class="k">case</span> <span class="mi">37</span><span class="o">:</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">].</span><span class="nx">push</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]);</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">1</span><span class="p">];</span> </div><div class='line' id='LC260'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC261'><span class="k">case</span> <span class="mi">38</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="p">[</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]];</span> </div><div class='line' id='LC262'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC263'><span class="k">case</span> <span class="mi">39</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="p">[</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">2</span><span class="p">],</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]];</span> </div><div class='line' id='LC264'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC265'><span class="k">case</span> <span class="mi">40</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="p">[</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">2</span><span class="p">],</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">StringNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">])];</span> </div><div class='line' id='LC266'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC267'><span class="k">case</span> <span class="mi">41</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="p">[</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">2</span><span class="p">],</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">IntegerNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">])];</span> </div><div class='line' id='LC268'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC269'><span class="k">case</span> <span class="mi">42</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="p">[</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">2</span><span class="p">],</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">BooleanNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">])];</span> </div><div class='line' id='LC270'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC271'><span class="k">case</span> <span class="mi">43</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="p">[</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">2</span><span class="p">],</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">DataNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">])];</span> </div><div class='line' id='LC272'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC273'><span class="k">case</span> <span class="mi">44</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">PartialNameNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]);</span> </div><div class='line' id='LC274'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC275'><span class="k">case</span> <span class="mi">45</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">yy</span><span class="p">.</span><span class="nx">IdNode</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]);</span> </div><div class='line' id='LC276'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC277'><span class="k">case</span> <span class="mi">46</span><span class="o">:</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">2</span><span class="p">].</span><span class="nx">push</span><span class="p">(</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]);</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="o">-</span><span class="mi">2</span><span class="p">];</span> </div><div class='line' id='LC278'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC279'><span class="k">case</span> <span class="mi">47</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="p">[</span><span class="nx">$$</span><span class="p">[</span><span class="nx">$0</span><span class="p">]];</span> </div><div class='line' id='LC280'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC281'><span class="p">}</span></div><div class='line' id='LC282'><span class="p">},</span></div><div class='line' id='LC283'><span class="nx">table</span><span class="o">:</span> <span class="p">[{</span><span class="mi">3</span><span class="o">:</span><span class="mi">1</span><span class="p">,</span><span class="mi">4</span><span class="o">:</span><span class="mi">2</span><span class="p">,</span><span class="mi">5</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">7</span><span class="p">],</span><span class="mi">6</span><span class="o">:</span><span class="mi">3</span><span class="p">,</span><span class="mi">7</span><span class="o">:</span><span class="mi">4</span><span class="p">,</span><span class="mi">8</span><span class="o">:</span><span class="mi">6</span><span class="p">,</span><span class="mi">9</span><span class="o">:</span><span class="mi">7</span><span class="p">,</span><span class="mi">11</span><span class="o">:</span><span class="mi">8</span><span class="p">,</span><span class="mi">12</span><span class="o">:</span><span class="mi">9</span><span class="p">,</span><span class="mi">13</span><span class="o">:</span><span class="mi">10</span><span class="p">,</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">11</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">12</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">13</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">5</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">14</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">15</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">16</span><span class="p">]},{</span><span class="mi">1</span><span class="o">:</span><span class="p">[</span><span class="mi">3</span><span class="p">]},{</span><span class="mi">5</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">17</span><span class="p">]},{</span><span class="mi">5</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">6</span><span class="p">],</span><span class="mi">7</span><span class="o">:</span><span class="mi">18</span><span class="p">,</span><span class="mi">8</span><span class="o">:</span><span class="mi">6</span><span class="p">,</span><span class="mi">9</span><span class="o">:</span><span class="mi">7</span><span class="p">,</span><span class="mi">11</span><span class="o">:</span><span class="mi">8</span><span class="p">,</span><span class="mi">12</span><span class="o">:</span><span class="mi">9</span><span class="p">,</span><span class="mi">13</span><span class="o">:</span><span class="mi">10</span><span class="p">,</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">11</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">12</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">13</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">19</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">6</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">14</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">15</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">16</span><span class="p">]},{</span><span class="mi">5</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">5</span><span class="p">],</span><span class="mi">6</span><span class="o">:</span><span class="mi">20</span><span class="p">,</span><span class="mi">8</span><span class="o">:</span><span class="mi">21</span><span class="p">,</span><span class="mi">9</span><span class="o">:</span><span class="mi">7</span><span class="p">,</span><span class="mi">11</span><span class="o">:</span><span class="mi">8</span><span class="p">,</span><span class="mi">12</span><span class="o">:</span><span class="mi">9</span><span class="p">,</span><span class="mi">13</span><span class="o">:</span><span class="mi">10</span><span class="p">,</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">11</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">12</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">13</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">5</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">5</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">14</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">15</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">16</span><span class="p">]},{</span><span class="mi">17</span><span class="o">:</span><span class="mi">23</span><span class="p">,</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">22</span><span class="p">],</span><span class="mi">21</span><span class="o">:</span><span class="mi">24</span><span class="p">,</span><span class="mi">28</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">25</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">27</span><span class="p">],</span><span class="mi">38</span><span class="o">:</span><span class="mi">26</span><span class="p">},{</span><span class="mi">5</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">8</span><span class="p">],</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">8</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">8</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">8</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">8</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">8</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">8</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">8</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">8</span><span class="p">]},{</span><span class="mi">4</span><span class="o">:</span><span class="mi">28</span><span class="p">,</span><span class="mi">6</span><span class="o">:</span><span class="mi">3</span><span class="p">,</span><span class="mi">7</span><span class="o">:</span><span class="mi">4</span><span class="p">,</span><span class="mi">8</span><span class="o">:</span><span class="mi">6</span><span class="p">,</span><span class="mi">9</span><span class="o">:</span><span class="mi">7</span><span class="p">,</span><span class="mi">11</span><span class="o">:</span><span class="mi">8</span><span class="p">,</span><span class="mi">12</span><span class="o">:</span><span class="mi">9</span><span class="p">,</span><span class="mi">13</span><span class="o">:</span><span class="mi">10</span><span class="p">,</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">11</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">12</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">13</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">5</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">7</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">14</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">15</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">16</span><span class="p">]},{</span><span class="mi">4</span><span class="o">:</span><span class="mi">29</span><span class="p">,</span><span class="mi">6</span><span class="o">:</span><span class="mi">3</span><span class="p">,</span><span class="mi">7</span><span class="o">:</span><span class="mi">4</span><span class="p">,</span><span class="mi">8</span><span class="o">:</span><span class="mi">6</span><span class="p">,</span><span class="mi">9</span><span class="o">:</span><span class="mi">7</span><span class="p">,</span><span class="mi">11</span><span class="o">:</span><span class="mi">8</span><span class="p">,</span><span class="mi">12</span><span class="o">:</span><span class="mi">9</span><span class="p">,</span><span class="mi">13</span><span class="o">:</span><span class="mi">10</span><span class="p">,</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">11</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">12</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">13</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">5</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">7</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">14</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">15</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">16</span><span class="p">]},{</span><span class="mi">5</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">12</span><span class="p">],</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">12</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">12</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">12</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">12</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">12</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">12</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">12</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">12</span><span class="p">]},{</span><span class="mi">5</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">13</span><span class="p">],</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">13</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">13</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">13</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">13</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">13</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">13</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">13</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">13</span><span class="p">]},{</span><span class="mi">5</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">14</span><span class="p">],</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">14</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">14</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">14</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">14</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">14</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">14</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">14</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">14</span><span class="p">]},{</span><span class="mi">5</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">15</span><span class="p">],</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">15</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">15</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">15</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">15</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">15</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">15</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">15</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">15</span><span class="p">]},{</span><span class="mi">17</span><span class="o">:</span><span class="mi">30</span><span class="p">,</span><span class="mi">21</span><span class="o">:</span><span class="mi">24</span><span class="p">,</span><span class="mi">28</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">25</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">27</span><span class="p">],</span><span class="mi">38</span><span class="o">:</span><span class="mi">26</span><span class="p">},{</span><span class="mi">17</span><span class="o">:</span><span class="mi">31</span><span class="p">,</span><span class="mi">21</span><span class="o">:</span><span class="mi">24</span><span class="p">,</span><span class="mi">28</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">25</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">27</span><span class="p">],</span><span class="mi">38</span><span class="o">:</span><span class="mi">26</span><span class="p">},{</span><span class="mi">17</span><span class="o">:</span><span class="mi">32</span><span class="p">,</span><span class="mi">21</span><span class="o">:</span><span class="mi">24</span><span class="p">,</span><span class="mi">28</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">25</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">27</span><span class="p">],</span><span class="mi">38</span><span class="o">:</span><span class="mi">26</span><span class="p">},{</span><span class="mi">25</span><span class="o">:</span><span class="mi">33</span><span class="p">,</span><span class="mi">37</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">34</span><span class="p">]},{</span><span class="mi">1</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">1</span><span class="p">]},{</span><span class="mi">5</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">2</span><span class="p">],</span><span class="mi">8</span><span class="o">:</span><span class="mi">21</span><span class="p">,</span><span class="mi">9</span><span class="o">:</span><span class="mi">7</span><span class="p">,</span><span class="mi">11</span><span class="o">:</span><span class="mi">8</span><span class="p">,</span><span class="mi">12</span><span class="o">:</span><span class="mi">9</span><span class="p">,</span><span class="mi">13</span><span class="o">:</span><span class="mi">10</span><span class="p">,</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">11</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">12</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">13</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">19</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">2</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">14</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">15</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">16</span><span class="p">]},{</span><span class="mi">17</span><span class="o">:</span><span class="mi">23</span><span class="p">,</span><span class="mi">21</span><span class="o">:</span><span class="mi">24</span><span class="p">,</span><span class="mi">28</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">25</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">27</span><span class="p">],</span><span class="mi">38</span><span class="o">:</span><span class="mi">26</span><span class="p">},{</span><span class="mi">5</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">4</span><span class="p">],</span><span class="mi">7</span><span class="o">:</span><span class="mi">35</span><span class="p">,</span><span class="mi">8</span><span class="o">:</span><span class="mi">6</span><span class="p">,</span><span class="mi">9</span><span class="o">:</span><span class="mi">7</span><span class="p">,</span><span class="mi">11</span><span class="o">:</span><span class="mi">8</span><span class="p">,</span><span class="mi">12</span><span class="o">:</span><span class="mi">9</span><span class="p">,</span><span class="mi">13</span><span class="o">:</span><span class="mi">10</span><span class="p">,</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">11</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">12</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">13</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">19</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">4</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">14</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">15</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">16</span><span class="p">]},{</span><span class="mi">5</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">9</span><span class="p">],</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">9</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">9</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">9</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">9</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">9</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">9</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">9</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">9</span><span class="p">]},{</span><span class="mi">5</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">23</span><span class="p">],</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">23</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">23</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">23</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">23</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">23</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">23</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">23</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">23</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">36</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">27</span><span class="p">],</span><span class="mi">21</span><span class="o">:</span><span class="mi">41</span><span class="p">,</span><span class="mi">26</span><span class="o">:</span><span class="mi">37</span><span class="p">,</span><span class="mi">27</span><span class="o">:</span><span class="mi">38</span><span class="p">,</span><span class="mi">28</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">45</span><span class="p">],</span><span class="mi">29</span><span class="o">:</span><span class="mi">39</span><span class="p">,</span><span class="mi">30</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">42</span><span class="p">],</span><span class="mi">31</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">43</span><span class="p">],</span><span class="mi">32</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">44</span><span class="p">],</span><span class="mi">33</span><span class="o">:</span><span class="mi">40</span><span class="p">,</span><span class="mi">34</span><span class="o">:</span><span class="mi">46</span><span class="p">,</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">47</span><span class="p">],</span><span class="mi">38</span><span class="o">:</span><span class="mi">26</span><span class="p">},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">28</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">45</span><span class="p">],</span><span class="mi">28</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">45</span><span class="p">],</span><span class="mi">30</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">45</span><span class="p">],</span><span class="mi">31</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">45</span><span class="p">],</span><span class="mi">32</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">45</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">45</span><span class="p">],</span><span class="mi">39</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">48</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">47</span><span class="p">],</span><span class="mi">28</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">47</span><span class="p">],</span><span class="mi">30</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">47</span><span class="p">],</span><span class="mi">31</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">47</span><span class="p">],</span><span class="mi">32</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">47</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">47</span><span class="p">],</span><span class="mi">39</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">47</span><span class="p">]},{</span><span class="mi">10</span><span class="o">:</span><span class="mi">49</span><span class="p">,</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">50</span><span class="p">]},{</span><span class="mi">10</span><span class="o">:</span><span class="mi">51</span><span class="p">,</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">50</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">52</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">53</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">54</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">55</span><span class="p">],</span><span class="mi">21</span><span class="o">:</span><span class="mi">56</span><span class="p">,</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">27</span><span class="p">],</span><span class="mi">38</span><span class="o">:</span><span class="mi">26</span><span class="p">},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">44</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">44</span><span class="p">]},{</span><span class="mi">5</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">3</span><span class="p">],</span><span class="mi">8</span><span class="o">:</span><span class="mi">21</span><span class="p">,</span><span class="mi">9</span><span class="o">:</span><span class="mi">7</span><span class="p">,</span><span class="mi">11</span><span class="o">:</span><span class="mi">8</span><span class="p">,</span><span class="mi">12</span><span class="o">:</span><span class="mi">9</span><span class="p">,</span><span class="mi">13</span><span class="o">:</span><span class="mi">10</span><span class="p">,</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">11</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">12</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">13</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">19</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">3</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">14</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">15</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">16</span><span class="p">]},{</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">17</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">17</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">17</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">17</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">17</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">17</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">17</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">17</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">25</span><span class="p">],</span><span class="mi">21</span><span class="o">:</span><span class="mi">41</span><span class="p">,</span><span class="mi">27</span><span class="o">:</span><span class="mi">57</span><span class="p">,</span><span class="mi">28</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">45</span><span class="p">],</span><span class="mi">29</span><span class="o">:</span><span class="mi">58</span><span class="p">,</span><span class="mi">30</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">42</span><span class="p">],</span><span class="mi">31</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">43</span><span class="p">],</span><span class="mi">32</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">44</span><span class="p">],</span><span class="mi">33</span><span class="o">:</span><span class="mi">40</span><span class="p">,</span><span class="mi">34</span><span class="o">:</span><span class="mi">46</span><span class="p">,</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">47</span><span class="p">],</span><span class="mi">38</span><span class="o">:</span><span class="mi">26</span><span class="p">},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">26</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">30</span><span class="p">],</span><span class="mi">28</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">30</span><span class="p">],</span><span class="mi">30</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">30</span><span class="p">],</span><span class="mi">31</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">30</span><span class="p">],</span><span class="mi">32</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">30</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">30</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">36</span><span class="p">],</span><span class="mi">34</span><span class="o">:</span><span class="mi">59</span><span class="p">,</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">60</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">31</span><span class="p">],</span><span class="mi">28</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">31</span><span class="p">],</span><span class="mi">30</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">31</span><span class="p">],</span><span class="mi">31</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">31</span><span class="p">],</span><span class="mi">32</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">31</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">31</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">32</span><span class="p">],</span><span class="mi">28</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">32</span><span class="p">],</span><span class="mi">30</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">32</span><span class="p">],</span><span class="mi">31</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">32</span><span class="p">],</span><span class="mi">32</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">32</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">32</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">33</span><span class="p">],</span><span class="mi">28</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">33</span><span class="p">],</span><span class="mi">30</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">33</span><span class="p">],</span><span class="mi">31</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">33</span><span class="p">],</span><span class="mi">32</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">33</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">33</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">34</span><span class="p">],</span><span class="mi">28</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">34</span><span class="p">],</span><span class="mi">30</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">34</span><span class="p">],</span><span class="mi">31</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">34</span><span class="p">],</span><span class="mi">32</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">34</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">34</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">35</span><span class="p">],</span><span class="mi">28</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">35</span><span class="p">],</span><span class="mi">30</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">35</span><span class="p">],</span><span class="mi">31</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">35</span><span class="p">],</span><span class="mi">32</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">35</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">35</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">38</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">38</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">47</span><span class="p">],</span><span class="mi">28</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">47</span><span class="p">],</span><span class="mi">30</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">47</span><span class="p">],</span><span class="mi">31</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">47</span><span class="p">],</span><span class="mi">32</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">47</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">47</span><span class="p">],</span><span class="mi">36</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">61</span><span class="p">],</span><span class="mi">39</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">47</span><span class="p">]},{</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">62</span><span class="p">]},{</span><span class="mi">5</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">10</span><span class="p">],</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">10</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">10</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">10</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">10</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">10</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">10</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">10</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">10</span><span class="p">]},{</span><span class="mi">21</span><span class="o">:</span><span class="mi">63</span><span class="p">,</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">27</span><span class="p">],</span><span class="mi">38</span><span class="o">:</span><span class="mi">26</span><span class="p">},{</span><span class="mi">5</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">11</span><span class="p">],</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">11</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">11</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">11</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">11</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">11</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">11</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">11</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">11</span><span class="p">]},{</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">16</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">16</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">16</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">16</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">16</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">16</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">16</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">16</span><span class="p">]},{</span><span class="mi">5</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">19</span><span class="p">],</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">19</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">19</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">19</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">19</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">19</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">19</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">19</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">19</span><span class="p">]},{</span><span class="mi">5</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">20</span><span class="p">],</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">20</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">20</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">20</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">20</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">20</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">20</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">20</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">20</span><span class="p">]},{</span><span class="mi">5</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">21</span><span class="p">],</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">21</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">21</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">21</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">21</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">21</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">21</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">21</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">21</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">64</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">24</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">29</span><span class="p">],</span><span class="mi">28</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">29</span><span class="p">],</span><span class="mi">30</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">29</span><span class="p">],</span><span class="mi">31</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">29</span><span class="p">],</span><span class="mi">32</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">29</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">29</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">37</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">37</span><span class="p">]},{</span><span class="mi">36</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">61</span><span class="p">]},{</span><span class="mi">21</span><span class="o">:</span><span class="mi">65</span><span class="p">,</span><span class="mi">28</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">69</span><span class="p">],</span><span class="mi">30</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">66</span><span class="p">],</span><span class="mi">31</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">67</span><span class="p">],</span><span class="mi">32</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">68</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">27</span><span class="p">],</span><span class="mi">38</span><span class="o">:</span><span class="mi">26</span><span class="p">},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">46</span><span class="p">],</span><span class="mi">28</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">46</span><span class="p">],</span><span class="mi">30</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">46</span><span class="p">],</span><span class="mi">31</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">46</span><span class="p">],</span><span class="mi">32</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">46</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">46</span><span class="p">],</span><span class="mi">39</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">46</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">1</span><span class="p">,</span><span class="mi">70</span><span class="p">]},{</span><span class="mi">5</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">22</span><span class="p">],</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">22</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">22</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">22</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">22</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">22</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">22</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">22</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">22</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">39</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">39</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">40</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">40</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">41</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">41</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">42</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">42</span><span class="p">]},{</span><span class="mi">18</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">43</span><span class="p">],</span><span class="mi">35</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">43</span><span class="p">]},{</span><span class="mi">5</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">18</span><span class="p">],</span><span class="mi">14</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">18</span><span class="p">],</span><span class="mi">15</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">18</span><span class="p">],</span><span class="mi">16</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">18</span><span class="p">],</span><span class="mi">19</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">18</span><span class="p">],</span><span class="mi">20</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">18</span><span class="p">],</span><span class="mi">22</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">18</span><span class="p">],</span><span class="mi">23</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">18</span><span class="p">],</span><span class="mi">24</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">18</span><span class="p">]}],</span></div><div class='line' id='LC284'><span class="nx">defaultActions</span><span class="o">:</span> <span class="p">{</span><span class="mi">17</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">1</span><span class="p">],</span><span class="mi">25</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">28</span><span class="p">],</span><span class="mi">38</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">26</span><span class="p">],</span><span class="mi">57</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">,</span><span class="mi">24</span><span class="p">]},</span></div><div class='line' id='LC285'><span class="nx">parseError</span><span class="o">:</span> <span class="kd">function</span> <span class="nx">parseError</span><span class="p">(</span><span class="nx">str</span><span class="p">,</span> <span class="nx">hash</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC286'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nb">Error</span><span class="p">(</span><span class="nx">str</span><span class="p">);</span></div><div class='line' id='LC287'><span class="p">},</span></div><div class='line' id='LC288'><span class="nx">parse</span><span class="o">:</span> <span class="kd">function</span> <span class="nx">parse</span><span class="p">(</span><span class="nx">input</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC289'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">self</span> <span class="o">=</span> <span class="k">this</span><span class="p">,</span> <span class="nx">stack</span> <span class="o">=</span> <span class="p">[</span><span class="mi">0</span><span class="p">],</span> <span class="nx">vstack</span> <span class="o">=</span> <span class="p">[</span><span class="kc">null</span><span class="p">],</span> <span class="nx">lstack</span> <span class="o">=</span> <span class="p">[],</span> <span class="nx">table</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">table</span><span class="p">,</span> <span class="nx">yytext</span> <span class="o">=</span> <span class="s2">&quot;&quot;</span><span class="p">,</span> <span class="nx">yylineno</span> <span class="o">=</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">yyleng</span> <span class="o">=</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">recovering</span> <span class="o">=</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">TERROR</span> <span class="o">=</span> <span class="mi">2</span><span class="p">,</span> <span class="nx">EOF</span> <span class="o">=</span> <span class="mi">1</span><span class="p">;</span></div><div class='line' id='LC290'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">lexer</span><span class="p">.</span><span class="nx">setInput</span><span class="p">(</span><span class="nx">input</span><span class="p">);</span></div><div class='line' id='LC291'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">lexer</span><span class="p">.</span><span class="nx">yy</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">yy</span><span class="p">;</span></div><div class='line' id='LC292'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">yy</span><span class="p">.</span><span class="nx">lexer</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">lexer</span><span class="p">;</span></div><div class='line' id='LC293'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">yy</span><span class="p">.</span><span class="nx">parser</span> <span class="o">=</span> <span class="k">this</span><span class="p">;</span></div><div class='line' id='LC294'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">typeof</span> <span class="k">this</span><span class="p">.</span><span class="nx">lexer</span><span class="p">.</span><span class="nx">yylloc</span> <span class="o">==</span> <span class="s2">&quot;undefined&quot;</span><span class="p">)</span></div><div class='line' id='LC295'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">lexer</span><span class="p">.</span><span class="nx">yylloc</span> <span class="o">=</span> <span class="p">{};</span></div><div class='line' id='LC296'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">yyloc</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">lexer</span><span class="p">.</span><span class="nx">yylloc</span><span class="p">;</span></div><div class='line' id='LC297'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">lstack</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">yyloc</span><span class="p">);</span></div><div class='line' id='LC298'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">ranges</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">lexer</span><span class="p">.</span><span class="nx">options</span> <span class="o">&amp;&amp;</span> <span class="k">this</span><span class="p">.</span><span class="nx">lexer</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">ranges</span><span class="p">;</span></div><div class='line' id='LC299'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">typeof</span> <span class="k">this</span><span class="p">.</span><span class="nx">yy</span><span class="p">.</span><span class="nx">parseError</span> <span class="o">===</span> <span class="s2">&quot;function&quot;</span><span class="p">)</span></div><div class='line' id='LC300'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">parseError</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">yy</span><span class="p">.</span><span class="nx">parseError</span><span class="p">;</span></div><div class='line' id='LC301'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">function</span> <span class="nx">popStack</span><span class="p">(</span><span class="nx">n</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC302'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">stack</span><span class="p">.</span><span class="nx">length</span> <span class="o">=</span> <span class="nx">stack</span><span class="p">.</span><span class="nx">length</span> <span class="o">-</span> <span class="mi">2</span> <span class="o">*</span> <span class="nx">n</span><span class="p">;</span></div><div class='line' id='LC303'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">vstack</span><span class="p">.</span><span class="nx">length</span> <span class="o">=</span> <span class="nx">vstack</span><span class="p">.</span><span class="nx">length</span> <span class="o">-</span> <span class="nx">n</span><span class="p">;</span></div><div class='line' id='LC304'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">lstack</span><span class="p">.</span><span class="nx">length</span> <span class="o">=</span> <span class="nx">lstack</span><span class="p">.</span><span class="nx">length</span> <span class="o">-</span> <span class="nx">n</span><span class="p">;</span></div><div class='line' id='LC305'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC306'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">function</span> <span class="nx">lex</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC307'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">token</span><span class="p">;</span></div><div class='line' id='LC308'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">token</span> <span class="o">=</span> <span class="nx">self</span><span class="p">.</span><span class="nx">lexer</span><span class="p">.</span><span class="nx">lex</span><span class="p">()</span> <span class="o">||</span> <span class="mi">1</span><span class="p">;</span></div><div class='line' id='LC309'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">typeof</span> <span class="nx">token</span> <span class="o">!==</span> <span class="s2">&quot;number&quot;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC310'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">token</span> <span class="o">=</span> <span class="nx">self</span><span class="p">.</span><span class="nx">symbols_</span><span class="p">[</span><span class="nx">token</span><span class="p">]</span> <span class="o">||</span> <span class="nx">token</span><span class="p">;</span></div><div class='line' id='LC311'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC312'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">token</span><span class="p">;</span></div><div class='line' id='LC313'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC314'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">symbol</span><span class="p">,</span> <span class="nx">preErrorSymbol</span><span class="p">,</span> <span class="nx">state</span><span class="p">,</span> <span class="nx">action</span><span class="p">,</span> <span class="nx">a</span><span class="p">,</span> <span class="nx">r</span><span class="p">,</span> <span class="nx">yyval</span> <span class="o">=</span> <span class="p">{},</span> <span class="nx">p</span><span class="p">,</span> <span class="nx">len</span><span class="p">,</span> <span class="nx">newState</span><span class="p">,</span> <span class="nx">expected</span><span class="p">;</span></div><div class='line' id='LC315'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">while</span> <span class="p">(</span><span class="kc">true</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC316'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">state</span> <span class="o">=</span> <span class="nx">stack</span><span class="p">[</span><span class="nx">stack</span><span class="p">.</span><span class="nx">length</span> <span class="o">-</span> <span class="mi">1</span><span class="p">];</span></div><div class='line' id='LC317'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">defaultActions</span><span class="p">[</span><span class="nx">state</span><span class="p">])</span> <span class="p">{</span></div><div class='line' id='LC318'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">action</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">defaultActions</span><span class="p">[</span><span class="nx">state</span><span class="p">];</span></div><div class='line' id='LC319'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC320'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">symbol</span> <span class="o">===</span> <span class="kc">null</span> <span class="o">||</span> <span class="k">typeof</span> <span class="nx">symbol</span> <span class="o">==</span> <span class="s2">&quot;undefined&quot;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC321'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">symbol</span> <span class="o">=</span> <span class="nx">lex</span><span class="p">();</span></div><div class='line' id='LC322'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC323'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">action</span> <span class="o">=</span> <span class="nx">table</span><span class="p">[</span><span class="nx">state</span><span class="p">]</span> <span class="o">&amp;&amp;</span> <span class="nx">table</span><span class="p">[</span><span class="nx">state</span><span class="p">][</span><span class="nx">symbol</span><span class="p">];</span></div><div class='line' id='LC324'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC325'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">typeof</span> <span class="nx">action</span> <span class="o">===</span> <span class="s2">&quot;undefined&quot;</span> <span class="o">||</span> <span class="o">!</span><span class="nx">action</span><span class="p">.</span><span class="nx">length</span> <span class="o">||</span> <span class="o">!</span><span class="nx">action</span><span class="p">[</span><span class="mi">0</span><span class="p">])</span> <span class="p">{</span></div><div class='line' id='LC326'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">errStr</span> <span class="o">=</span> <span class="s2">&quot;&quot;</span><span class="p">;</span></div><div class='line' id='LC327'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">recovering</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC328'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">expected</span> <span class="o">=</span> <span class="p">[];</span></div><div class='line' id='LC329'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span> <span class="p">(</span><span class="nx">p</span> <span class="k">in</span> <span class="nx">table</span><span class="p">[</span><span class="nx">state</span><span class="p">])</span></div><div class='line' id='LC330'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">terminals_</span><span class="p">[</span><span class="nx">p</span><span class="p">]</span> <span class="o">&amp;&amp;</span> <span class="nx">p</span> <span class="o">&gt;</span> <span class="mi">2</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC331'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">expected</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;&#39;&quot;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">terminals_</span><span class="p">[</span><span class="nx">p</span><span class="p">]</span> <span class="o">+</span> <span class="s2">&quot;&#39;&quot;</span><span class="p">);</span></div><div class='line' id='LC332'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC333'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">lexer</span><span class="p">.</span><span class="nx">showPosition</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC334'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">errStr</span> <span class="o">=</span> <span class="s2">&quot;Parse error on line &quot;</span> <span class="o">+</span> <span class="p">(</span><span class="nx">yylineno</span> <span class="o">+</span> <span class="mi">1</span><span class="p">)</span> <span class="o">+</span> <span class="s2">&quot;:\n&quot;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">lexer</span><span class="p">.</span><span class="nx">showPosition</span><span class="p">()</span> <span class="o">+</span> <span class="s2">&quot;\nExpecting &quot;</span> <span class="o">+</span> <span class="nx">expected</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="s2">&quot;, &quot;</span><span class="p">)</span> <span class="o">+</span> <span class="s2">&quot;, got &#39;&quot;</span> <span class="o">+</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">terminals_</span><span class="p">[</span><span class="nx">symbol</span><span class="p">]</span> <span class="o">||</span> <span class="nx">symbol</span><span class="p">)</span> <span class="o">+</span> <span class="s2">&quot;&#39;&quot;</span><span class="p">;</span></div><div class='line' id='LC335'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC336'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">errStr</span> <span class="o">=</span> <span class="s2">&quot;Parse error on line &quot;</span> <span class="o">+</span> <span class="p">(</span><span class="nx">yylineno</span> <span class="o">+</span> <span class="mi">1</span><span class="p">)</span> <span class="o">+</span> <span class="s2">&quot;: Unexpected &quot;</span> <span class="o">+</span> <span class="p">(</span><span class="nx">symbol</span> <span class="o">==</span> <span class="mi">1</span><span class="o">?</span><span class="s2">&quot;end of input&quot;</span><span class="o">:</span><span class="s2">&quot;&#39;&quot;</span> <span class="o">+</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">terminals_</span><span class="p">[</span><span class="nx">symbol</span><span class="p">]</span> <span class="o">||</span> <span class="nx">symbol</span><span class="p">)</span> <span class="o">+</span> <span class="s2">&quot;&#39;&quot;</span><span class="p">);</span></div><div class='line' id='LC337'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC338'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">parseError</span><span class="p">(</span><span class="nx">errStr</span><span class="p">,</span> <span class="p">{</span><span class="nx">text</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">lexer</span><span class="p">.</span><span class="nx">match</span><span class="p">,</span> <span class="nx">token</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">terminals_</span><span class="p">[</span><span class="nx">symbol</span><span class="p">]</span> <span class="o">||</span> <span class="nx">symbol</span><span class="p">,</span> <span class="nx">line</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">lexer</span><span class="p">.</span><span class="nx">yylineno</span><span class="p">,</span> <span class="nx">loc</span><span class="o">:</span> <span class="nx">yyloc</span><span class="p">,</span> <span class="nx">expected</span><span class="o">:</span> <span class="nx">expected</span><span class="p">});</span></div><div class='line' id='LC339'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC340'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC341'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">action</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span> <span class="k">instanceof</span> <span class="nb">Array</span> <span class="o">&amp;&amp;</span> <span class="nx">action</span><span class="p">.</span><span class="nx">length</span> <span class="o">&gt;</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC342'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nb">Error</span><span class="p">(</span><span class="s2">&quot;Parse Error: multiple actions possible at state: &quot;</span> <span class="o">+</span> <span class="nx">state</span> <span class="o">+</span> <span class="s2">&quot;, token: &quot;</span> <span class="o">+</span> <span class="nx">symbol</span><span class="p">);</span></div><div class='line' id='LC343'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC344'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">switch</span> <span class="p">(</span><span class="nx">action</span><span class="p">[</span><span class="mi">0</span><span class="p">])</span> <span class="p">{</span></div><div class='line' id='LC345'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">case</span> <span class="mi">1</span><span class="o">:</span></div><div class='line' id='LC346'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">stack</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">symbol</span><span class="p">);</span></div><div class='line' id='LC347'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">vstack</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">lexer</span><span class="p">.</span><span class="nx">yytext</span><span class="p">);</span></div><div class='line' id='LC348'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">lstack</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">lexer</span><span class="p">.</span><span class="nx">yylloc</span><span class="p">);</span></div><div class='line' id='LC349'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">stack</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">action</span><span class="p">[</span><span class="mi">1</span><span class="p">]);</span></div><div class='line' id='LC350'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">symbol</span> <span class="o">=</span> <span class="kc">null</span><span class="p">;</span></div><div class='line' id='LC351'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">preErrorSymbol</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC352'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">yyleng</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">lexer</span><span class="p">.</span><span class="nx">yyleng</span><span class="p">;</span></div><div class='line' id='LC353'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">yytext</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">lexer</span><span class="p">.</span><span class="nx">yytext</span><span class="p">;</span></div><div class='line' id='LC354'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">yylineno</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">lexer</span><span class="p">.</span><span class="nx">yylineno</span><span class="p">;</span></div><div class='line' id='LC355'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">yyloc</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">lexer</span><span class="p">.</span><span class="nx">yylloc</span><span class="p">;</span></div><div class='line' id='LC356'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">recovering</span> <span class="o">&gt;</span> <span class="mi">0</span><span class="p">)</span></div><div class='line' id='LC357'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">recovering</span><span class="o">--</span><span class="p">;</span></div><div class='line' id='LC358'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC359'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">symbol</span> <span class="o">=</span> <span class="nx">preErrorSymbol</span><span class="p">;</span></div><div class='line' id='LC360'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">preErrorSymbol</span> <span class="o">=</span> <span class="kc">null</span><span class="p">;</span></div><div class='line' id='LC361'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC362'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">break</span><span class="p">;</span></div><div class='line' id='LC363'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">case</span> <span class="mi">2</span><span class="o">:</span></div><div class='line' id='LC364'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">len</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">productions_</span><span class="p">[</span><span class="nx">action</span><span class="p">[</span><span class="mi">1</span><span class="p">]][</span><span class="mi">1</span><span class="p">];</span></div><div class='line' id='LC365'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">yyval</span><span class="p">.</span><span class="nx">$</span> <span class="o">=</span> <span class="nx">vstack</span><span class="p">[</span><span class="nx">vstack</span><span class="p">.</span><span class="nx">length</span> <span class="o">-</span> <span class="nx">len</span><span class="p">];</span></div><div class='line' id='LC366'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">yyval</span><span class="p">.</span><span class="nx">_$</span> <span class="o">=</span> <span class="p">{</span><span class="nx">first_line</span><span class="o">:</span> <span class="nx">lstack</span><span class="p">[</span><span class="nx">lstack</span><span class="p">.</span><span class="nx">length</span> <span class="o">-</span> <span class="p">(</span><span class="nx">len</span> <span class="o">||</span> <span class="mi">1</span><span class="p">)].</span><span class="nx">first_line</span><span class="p">,</span> <span class="nx">last_line</span><span class="o">:</span> <span class="nx">lstack</span><span class="p">[</span><span class="nx">lstack</span><span class="p">.</span><span class="nx">length</span> <span class="o">-</span> <span class="mi">1</span><span class="p">].</span><span class="nx">last_line</span><span class="p">,</span> <span class="nx">first_column</span><span class="o">:</span> <span class="nx">lstack</span><span class="p">[</span><span class="nx">lstack</span><span class="p">.</span><span class="nx">length</span> <span class="o">-</span> <span class="p">(</span><span class="nx">len</span> <span class="o">||</span> <span class="mi">1</span><span class="p">)].</span><span class="nx">first_column</span><span class="p">,</span> <span class="nx">last_column</span><span class="o">:</span> <span class="nx">lstack</span><span class="p">[</span><span class="nx">lstack</span><span class="p">.</span><span class="nx">length</span> <span class="o">-</span> <span class="mi">1</span><span class="p">].</span><span class="nx">last_column</span><span class="p">};</span></div><div class='line' id='LC367'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">ranges</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC368'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">yyval</span><span class="p">.</span><span class="nx">_$</span><span class="p">.</span><span class="nx">range</span> <span class="o">=</span> <span class="p">[</span><span class="nx">lstack</span><span class="p">[</span><span class="nx">lstack</span><span class="p">.</span><span class="nx">length</span> <span class="o">-</span> <span class="p">(</span><span class="nx">len</span> <span class="o">||</span> <span class="mi">1</span><span class="p">)].</span><span class="nx">range</span><span class="p">[</span><span class="mi">0</span><span class="p">],</span> <span class="nx">lstack</span><span class="p">[</span><span class="nx">lstack</span><span class="p">.</span><span class="nx">length</span> <span class="o">-</span> <span class="mi">1</span><span class="p">].</span><span class="nx">range</span><span class="p">[</span><span class="mi">1</span><span class="p">]];</span></div><div class='line' id='LC369'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC370'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">r</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">performAction</span><span class="p">.</span><span class="nx">call</span><span class="p">(</span><span class="nx">yyval</span><span class="p">,</span> <span class="nx">yytext</span><span class="p">,</span> <span class="nx">yyleng</span><span class="p">,</span> <span class="nx">yylineno</span><span class="p">,</span> <span class="k">this</span><span class="p">.</span><span class="nx">yy</span><span class="p">,</span> <span class="nx">action</span><span class="p">[</span><span class="mi">1</span><span class="p">],</span> <span class="nx">vstack</span><span class="p">,</span> <span class="nx">lstack</span><span class="p">);</span></div><div class='line' id='LC371'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">typeof</span> <span class="nx">r</span> <span class="o">!==</span> <span class="s2">&quot;undefined&quot;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC372'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">r</span><span class="p">;</span></div><div class='line' id='LC373'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC374'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">len</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC375'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">stack</span> <span class="o">=</span> <span class="nx">stack</span><span class="p">.</span><span class="nx">slice</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span> <span class="o">-</span><span class="mi">1</span> <span class="o">*</span> <span class="nx">len</span> <span class="o">*</span> <span class="mi">2</span><span class="p">);</span></div><div class='line' id='LC376'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">vstack</span> <span class="o">=</span> <span class="nx">vstack</span><span class="p">.</span><span class="nx">slice</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span> <span class="o">-</span><span class="mi">1</span> <span class="o">*</span> <span class="nx">len</span><span class="p">);</span></div><div class='line' id='LC377'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">lstack</span> <span class="o">=</span> <span class="nx">lstack</span><span class="p">.</span><span class="nx">slice</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span> <span class="o">-</span><span class="mi">1</span> <span class="o">*</span> <span class="nx">len</span><span class="p">);</span></div><div class='line' id='LC378'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC379'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">stack</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">productions_</span><span class="p">[</span><span class="nx">action</span><span class="p">[</span><span class="mi">1</span><span class="p">]][</span><span class="mi">0</span><span class="p">]);</span></div><div class='line' id='LC380'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">vstack</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">yyval</span><span class="p">.</span><span class="nx">$</span><span class="p">);</span></div><div class='line' id='LC381'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">lstack</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">yyval</span><span class="p">.</span><span class="nx">_$</span><span class="p">);</span></div><div class='line' id='LC382'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">newState</span> <span class="o">=</span> <span class="nx">table</span><span class="p">[</span><span class="nx">stack</span><span class="p">[</span><span class="nx">stack</span><span class="p">.</span><span class="nx">length</span> <span class="o">-</span> <span class="mi">2</span><span class="p">]][</span><span class="nx">stack</span><span class="p">[</span><span class="nx">stack</span><span class="p">.</span><span class="nx">length</span> <span class="o">-</span> <span class="mi">1</span><span class="p">]];</span></div><div class='line' id='LC383'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">stack</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">newState</span><span class="p">);</span></div><div class='line' id='LC384'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">break</span><span class="p">;</span></div><div class='line' id='LC385'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">case</span> <span class="mi">3</span><span class="o">:</span></div><div class='line' id='LC386'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="kc">true</span><span class="p">;</span></div><div class='line' id='LC387'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC388'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC389'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="kc">true</span><span class="p">;</span></div><div class='line' id='LC390'><span class="p">}</span></div><div class='line' id='LC391'><span class="p">};</span></div><div class='line' id='LC392'><span class="cm">/* Jison generated lexer */</span></div><div class='line' id='LC393'><span class="kd">var</span> <span class="nx">lexer</span> <span class="o">=</span> <span class="p">(</span><span class="kd">function</span><span class="p">(){</span></div><div class='line' id='LC394'><span class="kd">var</span> <span class="nx">lexer</span> <span class="o">=</span> <span class="p">({</span><span class="nx">EOF</span><span class="o">:</span><span class="mi">1</span><span class="p">,</span></div><div class='line' id='LC395'><span class="nx">parseError</span><span class="o">:</span><span class="kd">function</span> <span class="nx">parseError</span><span class="p">(</span><span class="nx">str</span><span class="p">,</span> <span class="nx">hash</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC396'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">yy</span><span class="p">.</span><span class="nx">parser</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC397'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">yy</span><span class="p">.</span><span class="nx">parser</span><span class="p">.</span><span class="nx">parseError</span><span class="p">(</span><span class="nx">str</span><span class="p">,</span> <span class="nx">hash</span><span class="p">);</span></div><div class='line' id='LC398'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC399'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nb">Error</span><span class="p">(</span><span class="nx">str</span><span class="p">);</span></div><div class='line' id='LC400'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC401'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC402'><span class="nx">setInput</span><span class="o">:</span><span class="kd">function</span> <span class="p">(</span><span class="nx">input</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC403'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">_input</span> <span class="o">=</span> <span class="nx">input</span><span class="p">;</span></div><div class='line' id='LC404'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">_more</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">_less</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">done</span> <span class="o">=</span> <span class="kc">false</span><span class="p">;</span></div><div class='line' id='LC405'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">yylineno</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">yyleng</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span></div><div class='line' id='LC406'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">yytext</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">matched</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">match</span> <span class="o">=</span> <span class="s1">&#39;&#39;</span><span class="p">;</span></div><div class='line' id='LC407'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">conditionStack</span> <span class="o">=</span> <span class="p">[</span><span class="s1">&#39;INITIAL&#39;</span><span class="p">];</span></div><div class='line' id='LC408'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">yylloc</span> <span class="o">=</span> <span class="p">{</span><span class="nx">first_line</span><span class="o">:</span><span class="mi">1</span><span class="p">,</span><span class="nx">first_column</span><span class="o">:</span><span class="mi">0</span><span class="p">,</span><span class="nx">last_line</span><span class="o">:</span><span class="mi">1</span><span class="p">,</span><span class="nx">last_column</span><span class="o">:</span><span class="mi">0</span><span class="p">};</span></div><div class='line' id='LC409'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">ranges</span><span class="p">)</span> <span class="k">this</span><span class="p">.</span><span class="nx">yylloc</span><span class="p">.</span><span class="nx">range</span> <span class="o">=</span> <span class="p">[</span><span class="mi">0</span><span class="p">,</span><span class="mi">0</span><span class="p">];</span></div><div class='line' id='LC410'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">offset</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span></div><div class='line' id='LC411'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">;</span></div><div class='line' id='LC412'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC413'><span class="nx">input</span><span class="o">:</span><span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC414'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">ch</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">_input</span><span class="p">[</span><span class="mi">0</span><span class="p">];</span></div><div class='line' id='LC415'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">yytext</span> <span class="o">+=</span> <span class="nx">ch</span><span class="p">;</span></div><div class='line' id='LC416'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">yyleng</span><span class="o">++</span><span class="p">;</span></div><div class='line' id='LC417'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">offset</span><span class="o">++</span><span class="p">;</span></div><div class='line' id='LC418'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">match</span> <span class="o">+=</span> <span class="nx">ch</span><span class="p">;</span></div><div class='line' id='LC419'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">matched</span> <span class="o">+=</span> <span class="nx">ch</span><span class="p">;</span></div><div class='line' id='LC420'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">lines</span> <span class="o">=</span> <span class="nx">ch</span><span class="p">.</span><span class="nx">match</span><span class="p">(</span><span class="sr">/(?:\r\n?|\n).*/g</span><span class="p">);</span></div><div class='line' id='LC421'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">lines</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC422'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">yylineno</span><span class="o">++</span><span class="p">;</span></div><div class='line' id='LC423'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">yylloc</span><span class="p">.</span><span class="nx">last_line</span><span class="o">++</span><span class="p">;</span></div><div class='line' id='LC424'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC425'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">yylloc</span><span class="p">.</span><span class="nx">last_column</span><span class="o">++</span><span class="p">;</span></div><div class='line' id='LC426'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC427'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">ranges</span><span class="p">)</span> <span class="k">this</span><span class="p">.</span><span class="nx">yylloc</span><span class="p">.</span><span class="nx">range</span><span class="p">[</span><span class="mi">1</span><span class="p">]</span><span class="o">++</span><span class="p">;</span></div><div class='line' id='LC428'><br/></div><div class='line' id='LC429'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">_input</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">_input</span><span class="p">.</span><span class="nx">slice</span><span class="p">(</span><span class="mi">1</span><span class="p">);</span></div><div class='line' id='LC430'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">ch</span><span class="p">;</span></div><div class='line' id='LC431'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC432'><span class="nx">unput</span><span class="o">:</span><span class="kd">function</span> <span class="p">(</span><span class="nx">ch</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC433'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">len</span> <span class="o">=</span> <span class="nx">ch</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span></div><div class='line' id='LC434'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">lines</span> <span class="o">=</span> <span class="nx">ch</span><span class="p">.</span><span class="nx">split</span><span class="p">(</span><span class="sr">/(?:\r\n?|\n)/g</span><span class="p">);</span></div><div class='line' id='LC435'><br/></div><div class='line' id='LC436'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">_input</span> <span class="o">=</span> <span class="nx">ch</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">_input</span><span class="p">;</span></div><div class='line' id='LC437'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">yytext</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">yytext</span><span class="p">.</span><span class="nx">substr</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span> <span class="k">this</span><span class="p">.</span><span class="nx">yytext</span><span class="p">.</span><span class="nx">length</span><span class="o">-</span><span class="nx">len</span><span class="o">-</span><span class="mi">1</span><span class="p">);</span></div><div class='line' id='LC438'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//this.yyleng -= len;</span></div><div class='line' id='LC439'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">offset</span> <span class="o">-=</span> <span class="nx">len</span><span class="p">;</span></div><div class='line' id='LC440'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">oldLines</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">match</span><span class="p">.</span><span class="nx">split</span><span class="p">(</span><span class="sr">/(?:\r\n?|\n)/g</span><span class="p">);</span></div><div class='line' id='LC441'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">match</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">match</span><span class="p">.</span><span class="nx">substr</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span> <span class="k">this</span><span class="p">.</span><span class="nx">match</span><span class="p">.</span><span class="nx">length</span><span class="o">-</span><span class="mi">1</span><span class="p">);</span></div><div class='line' id='LC442'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">matched</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">matched</span><span class="p">.</span><span class="nx">substr</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span> <span class="k">this</span><span class="p">.</span><span class="nx">matched</span><span class="p">.</span><span class="nx">length</span><span class="o">-</span><span class="mi">1</span><span class="p">);</span></div><div class='line' id='LC443'><br/></div><div class='line' id='LC444'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">lines</span><span class="p">.</span><span class="nx">length</span><span class="o">-</span><span class="mi">1</span><span class="p">)</span> <span class="k">this</span><span class="p">.</span><span class="nx">yylineno</span> <span class="o">-=</span> <span class="nx">lines</span><span class="p">.</span><span class="nx">length</span><span class="o">-</span><span class="mi">1</span><span class="p">;</span></div><div class='line' id='LC445'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">r</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">yylloc</span><span class="p">.</span><span class="nx">range</span><span class="p">;</span></div><div class='line' id='LC446'><br/></div><div class='line' id='LC447'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">yylloc</span> <span class="o">=</span> <span class="p">{</span><span class="nx">first_line</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">yylloc</span><span class="p">.</span><span class="nx">first_line</span><span class="p">,</span></div><div class='line' id='LC448'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">last_line</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">yylineno</span><span class="o">+</span><span class="mi">1</span><span class="p">,</span></div><div class='line' id='LC449'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">first_column</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">yylloc</span><span class="p">.</span><span class="nx">first_column</span><span class="p">,</span></div><div class='line' id='LC450'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">last_column</span><span class="o">:</span> <span class="nx">lines</span> <span class="o">?</span></div><div class='line' id='LC451'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">(</span><span class="nx">lines</span><span class="p">.</span><span class="nx">length</span> <span class="o">===</span> <span class="nx">oldLines</span><span class="p">.</span><span class="nx">length</span> <span class="o">?</span> <span class="k">this</span><span class="p">.</span><span class="nx">yylloc</span><span class="p">.</span><span class="nx">first_column</span> <span class="o">:</span> <span class="mi">0</span><span class="p">)</span> <span class="o">+</span> <span class="nx">oldLines</span><span class="p">[</span><span class="nx">oldLines</span><span class="p">.</span><span class="nx">length</span> <span class="o">-</span> <span class="nx">lines</span><span class="p">.</span><span class="nx">length</span><span class="p">].</span><span class="nx">length</span> <span class="o">-</span> <span class="nx">lines</span><span class="p">[</span><span class="mi">0</span><span class="p">].</span><span class="nx">length</span><span class="o">:</span></div><div class='line' id='LC452'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">yylloc</span><span class="p">.</span><span class="nx">first_column</span> <span class="o">-</span> <span class="nx">len</span></div><div class='line' id='LC453'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC454'><br/></div><div class='line' id='LC455'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">ranges</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC456'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">yylloc</span><span class="p">.</span><span class="nx">range</span> <span class="o">=</span> <span class="p">[</span><span class="nx">r</span><span class="p">[</span><span class="mi">0</span><span class="p">],</span> <span class="nx">r</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">yyleng</span> <span class="o">-</span> <span class="nx">len</span><span class="p">];</span></div><div class='line' id='LC457'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC458'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">;</span></div><div class='line' id='LC459'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC460'><span class="nx">more</span><span class="o">:</span><span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC461'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">_more</span> <span class="o">=</span> <span class="kc">true</span><span class="p">;</span></div><div class='line' id='LC462'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">;</span></div><div class='line' id='LC463'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC464'><span class="nx">less</span><span class="o">:</span><span class="kd">function</span> <span class="p">(</span><span class="nx">n</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC465'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">unput</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">match</span><span class="p">.</span><span class="nx">slice</span><span class="p">(</span><span class="nx">n</span><span class="p">));</span></div><div class='line' id='LC466'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC467'><span class="nx">pastInput</span><span class="o">:</span><span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC468'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">past</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">matched</span><span class="p">.</span><span class="nx">substr</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span> <span class="k">this</span><span class="p">.</span><span class="nx">matched</span><span class="p">.</span><span class="nx">length</span> <span class="o">-</span> <span class="k">this</span><span class="p">.</span><span class="nx">match</span><span class="p">.</span><span class="nx">length</span><span class="p">);</span></div><div class='line' id='LC469'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="p">(</span><span class="nx">past</span><span class="p">.</span><span class="nx">length</span> <span class="o">&gt;</span> <span class="mi">20</span> <span class="o">?</span> <span class="s1">&#39;...&#39;</span><span class="o">:</span><span class="s1">&#39;&#39;</span><span class="p">)</span> <span class="o">+</span> <span class="nx">past</span><span class="p">.</span><span class="nx">substr</span><span class="p">(</span><span class="o">-</span><span class="mi">20</span><span class="p">).</span><span class="nx">replace</span><span class="p">(</span><span class="sr">/\n/g</span><span class="p">,</span> <span class="s2">&quot;&quot;</span><span class="p">);</span></div><div class='line' id='LC470'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC471'><span class="nx">upcomingInput</span><span class="o">:</span><span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC472'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">next</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">match</span><span class="p">;</span></div><div class='line' id='LC473'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">next</span><span class="p">.</span><span class="nx">length</span> <span class="o">&lt;</span> <span class="mi">20</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC474'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">next</span> <span class="o">+=</span> <span class="k">this</span><span class="p">.</span><span class="nx">_input</span><span class="p">.</span><span class="nx">substr</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span> <span class="mi">20</span><span class="o">-</span><span class="nx">next</span><span class="p">.</span><span class="nx">length</span><span class="p">);</span></div><div class='line' id='LC475'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC476'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="p">(</span><span class="nx">next</span><span class="p">.</span><span class="nx">substr</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span><span class="mi">20</span><span class="p">)</span><span class="o">+</span><span class="p">(</span><span class="nx">next</span><span class="p">.</span><span class="nx">length</span> <span class="o">&gt;</span> <span class="mi">20</span> <span class="o">?</span> <span class="s1">&#39;...&#39;</span><span class="o">:</span><span class="s1">&#39;&#39;</span><span class="p">)).</span><span class="nx">replace</span><span class="p">(</span><span class="sr">/\n/g</span><span class="p">,</span> <span class="s2">&quot;&quot;</span><span class="p">);</span></div><div class='line' id='LC477'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC478'><span class="nx">showPosition</span><span class="o">:</span><span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC479'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">pre</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">pastInput</span><span class="p">();</span></div><div class='line' id='LC480'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">c</span> <span class="o">=</span> <span class="k">new</span> <span class="nb">Array</span><span class="p">(</span><span class="nx">pre</span><span class="p">.</span><span class="nx">length</span> <span class="o">+</span> <span class="mi">1</span><span class="p">).</span><span class="nx">join</span><span class="p">(</span><span class="s2">&quot;-&quot;</span><span class="p">);</span></div><div class='line' id='LC481'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">pre</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">upcomingInput</span><span class="p">()</span> <span class="o">+</span> <span class="s2">&quot;\n&quot;</span> <span class="o">+</span> <span class="nx">c</span><span class="o">+</span><span class="s2">&quot;^&quot;</span><span class="p">;</span></div><div class='line' id='LC482'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC483'><span class="nx">next</span><span class="o">:</span><span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC484'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">done</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC485'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">.</span><span class="nx">EOF</span><span class="p">;</span></div><div class='line' id='LC486'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC487'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="k">this</span><span class="p">.</span><span class="nx">_input</span><span class="p">)</span> <span class="k">this</span><span class="p">.</span><span class="nx">done</span> <span class="o">=</span> <span class="kc">true</span><span class="p">;</span></div><div class='line' id='LC488'><br/></div><div class='line' id='LC489'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">token</span><span class="p">,</span></div><div class='line' id='LC490'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">match</span><span class="p">,</span></div><div class='line' id='LC491'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">tempMatch</span><span class="p">,</span></div><div class='line' id='LC492'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">index</span><span class="p">,</span></div><div class='line' id='LC493'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">col</span><span class="p">,</span></div><div class='line' id='LC494'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">lines</span><span class="p">;</span></div><div class='line' id='LC495'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="k">this</span><span class="p">.</span><span class="nx">_more</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC496'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">yytext</span> <span class="o">=</span> <span class="s1">&#39;&#39;</span><span class="p">;</span></div><div class='line' id='LC497'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">match</span> <span class="o">=</span> <span class="s1">&#39;&#39;</span><span class="p">;</span></div><div class='line' id='LC498'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC499'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">rules</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">_currentRules</span><span class="p">();</span></div><div class='line' id='LC500'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span> <span class="p">(</span><span class="kd">var</span> <span class="nx">i</span><span class="o">=</span><span class="mi">0</span><span class="p">;</span><span class="nx">i</span> <span class="o">&lt;</span> <span class="nx">rules</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC501'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">tempMatch</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">_input</span><span class="p">.</span><span class="nx">match</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">rules</span><span class="p">[</span><span class="nx">rules</span><span class="p">[</span><span class="nx">i</span><span class="p">]]);</span></div><div class='line' id='LC502'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">tempMatch</span> <span class="o">&amp;&amp;</span> <span class="p">(</span><span class="o">!</span><span class="nx">match</span> <span class="o">||</span> <span class="nx">tempMatch</span><span class="p">[</span><span class="mi">0</span><span class="p">].</span><span class="nx">length</span> <span class="o">&gt;</span> <span class="nx">match</span><span class="p">[</span><span class="mi">0</span><span class="p">].</span><span class="nx">length</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC503'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">match</span> <span class="o">=</span> <span class="nx">tempMatch</span><span class="p">;</span></div><div class='line' id='LC504'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">index</span> <span class="o">=</span> <span class="nx">i</span><span class="p">;</span></div><div class='line' id='LC505'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">flex</span><span class="p">)</span> <span class="k">break</span><span class="p">;</span></div><div class='line' id='LC506'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC507'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC508'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">match</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC509'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">lines</span> <span class="o">=</span> <span class="nx">match</span><span class="p">[</span><span class="mi">0</span><span class="p">].</span><span class="nx">match</span><span class="p">(</span><span class="sr">/(?:\r\n?|\n).*/g</span><span class="p">);</span></div><div class='line' id='LC510'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">lines</span><span class="p">)</span> <span class="k">this</span><span class="p">.</span><span class="nx">yylineno</span> <span class="o">+=</span> <span class="nx">lines</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span></div><div class='line' id='LC511'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">yylloc</span> <span class="o">=</span> <span class="p">{</span><span class="nx">first_line</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">yylloc</span><span class="p">.</span><span class="nx">last_line</span><span class="p">,</span></div><div class='line' id='LC512'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">last_line</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">yylineno</span><span class="o">+</span><span class="mi">1</span><span class="p">,</span></div><div class='line' id='LC513'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">first_column</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">yylloc</span><span class="p">.</span><span class="nx">last_column</span><span class="p">,</span></div><div class='line' id='LC514'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">last_column</span><span class="o">:</span> <span class="nx">lines</span> <span class="o">?</span> <span class="nx">lines</span><span class="p">[</span><span class="nx">lines</span><span class="p">.</span><span class="nx">length</span><span class="o">-</span><span class="mi">1</span><span class="p">].</span><span class="nx">length</span><span class="o">-</span><span class="nx">lines</span><span class="p">[</span><span class="nx">lines</span><span class="p">.</span><span class="nx">length</span><span class="o">-</span><span class="mi">1</span><span class="p">].</span><span class="nx">match</span><span class="p">(</span><span class="sr">/\r?\n?/</span><span class="p">)[</span><span class="mi">0</span><span class="p">].</span><span class="nx">length</span> <span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">yylloc</span><span class="p">.</span><span class="nx">last_column</span> <span class="o">+</span> <span class="nx">match</span><span class="p">[</span><span class="mi">0</span><span class="p">].</span><span class="nx">length</span><span class="p">};</span></div><div class='line' id='LC515'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">yytext</span> <span class="o">+=</span> <span class="nx">match</span><span class="p">[</span><span class="mi">0</span><span class="p">];</span></div><div class='line' id='LC516'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">match</span> <span class="o">+=</span> <span class="nx">match</span><span class="p">[</span><span class="mi">0</span><span class="p">];</span></div><div class='line' id='LC517'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">matches</span> <span class="o">=</span> <span class="nx">match</span><span class="p">;</span></div><div class='line' id='LC518'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">yyleng</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">yytext</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span></div><div class='line' id='LC519'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">ranges</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC520'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">yylloc</span><span class="p">.</span><span class="nx">range</span> <span class="o">=</span> <span class="p">[</span><span class="k">this</span><span class="p">.</span><span class="nx">offset</span><span class="p">,</span> <span class="k">this</span><span class="p">.</span><span class="nx">offset</span> <span class="o">+=</span> <span class="k">this</span><span class="p">.</span><span class="nx">yyleng</span><span class="p">];</span></div><div class='line' id='LC521'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC522'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">_more</span> <span class="o">=</span> <span class="kc">false</span><span class="p">;</span></div><div class='line' id='LC523'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">_input</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">_input</span><span class="p">.</span><span class="nx">slice</span><span class="p">(</span><span class="nx">match</span><span class="p">[</span><span class="mi">0</span><span class="p">].</span><span class="nx">length</span><span class="p">);</span></div><div class='line' id='LC524'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">matched</span> <span class="o">+=</span> <span class="nx">match</span><span class="p">[</span><span class="mi">0</span><span class="p">];</span></div><div class='line' id='LC525'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">token</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">performAction</span><span class="p">.</span><span class="nx">call</span><span class="p">(</span><span class="k">this</span><span class="p">,</span> <span class="k">this</span><span class="p">.</span><span class="nx">yy</span><span class="p">,</span> <span class="k">this</span><span class="p">,</span> <span class="nx">rules</span><span class="p">[</span><span class="nx">index</span><span class="p">],</span><span class="k">this</span><span class="p">.</span><span class="nx">conditionStack</span><span class="p">[</span><span class="k">this</span><span class="p">.</span><span class="nx">conditionStack</span><span class="p">.</span><span class="nx">length</span><span class="o">-</span><span class="mi">1</span><span class="p">]);</span></div><div class='line' id='LC526'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">done</span> <span class="o">&amp;&amp;</span> <span class="k">this</span><span class="p">.</span><span class="nx">_input</span><span class="p">)</span> <span class="k">this</span><span class="p">.</span><span class="nx">done</span> <span class="o">=</span> <span class="kc">false</span><span class="p">;</span></div><div class='line' id='LC527'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">token</span><span class="p">)</span> <span class="k">return</span> <span class="nx">token</span><span class="p">;</span></div><div class='line' id='LC528'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">else</span> <span class="k">return</span><span class="p">;</span></div><div class='line' id='LC529'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC530'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">_input</span> <span class="o">===</span> <span class="s2">&quot;&quot;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC531'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">.</span><span class="nx">EOF</span><span class="p">;</span></div><div class='line' id='LC532'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC533'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">.</span><span class="nx">parseError</span><span class="p">(</span><span class="s1">&#39;Lexical error on line &#39;</span><span class="o">+</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">yylineno</span><span class="o">+</span><span class="mi">1</span><span class="p">)</span><span class="o">+</span><span class="s1">&#39;. Unrecognized text.\n&#39;</span><span class="o">+</span><span class="k">this</span><span class="p">.</span><span class="nx">showPosition</span><span class="p">(),</span></div><div class='line' id='LC534'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">{</span><span class="nx">text</span><span class="o">:</span> <span class="s2">&quot;&quot;</span><span class="p">,</span> <span class="nx">token</span><span class="o">:</span> <span class="kc">null</span><span class="p">,</span> <span class="nx">line</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">yylineno</span><span class="p">});</span></div><div class='line' id='LC535'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC536'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC537'><span class="nx">lex</span><span class="o">:</span><span class="kd">function</span> <span class="nx">lex</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC538'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">r</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">next</span><span class="p">();</span></div><div class='line' id='LC539'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">typeof</span> <span class="nx">r</span> <span class="o">!==</span> <span class="s1">&#39;undefined&#39;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC540'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">r</span><span class="p">;</span></div><div class='line' id='LC541'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC542'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">.</span><span class="nx">lex</span><span class="p">();</span></div><div class='line' id='LC543'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC544'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC545'><span class="nx">begin</span><span class="o">:</span><span class="kd">function</span> <span class="nx">begin</span><span class="p">(</span><span class="nx">condition</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC546'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">conditionStack</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">condition</span><span class="p">);</span></div><div class='line' id='LC547'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC548'><span class="nx">popState</span><span class="o">:</span><span class="kd">function</span> <span class="nx">popState</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC549'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">.</span><span class="nx">conditionStack</span><span class="p">.</span><span class="nx">pop</span><span class="p">();</span></div><div class='line' id='LC550'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC551'><span class="nx">_currentRules</span><span class="o">:</span><span class="kd">function</span> <span class="nx">_currentRules</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC552'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">.</span><span class="nx">conditions</span><span class="p">[</span><span class="k">this</span><span class="p">.</span><span class="nx">conditionStack</span><span class="p">[</span><span class="k">this</span><span class="p">.</span><span class="nx">conditionStack</span><span class="p">.</span><span class="nx">length</span><span class="o">-</span><span class="mi">1</span><span class="p">]].</span><span class="nx">rules</span><span class="p">;</span></div><div class='line' id='LC553'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC554'><span class="nx">topState</span><span class="o">:</span><span class="kd">function</span> <span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC555'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">.</span><span class="nx">conditionStack</span><span class="p">[</span><span class="k">this</span><span class="p">.</span><span class="nx">conditionStack</span><span class="p">.</span><span class="nx">length</span><span class="o">-</span><span class="mi">2</span><span class="p">];</span></div><div class='line' id='LC556'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC557'><span class="nx">pushState</span><span class="o">:</span><span class="kd">function</span> <span class="nx">begin</span><span class="p">(</span><span class="nx">condition</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC558'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">begin</span><span class="p">(</span><span class="nx">condition</span><span class="p">);</span></div><div class='line' id='LC559'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}});</span></div><div class='line' id='LC560'><span class="nx">lexer</span><span class="p">.</span><span class="nx">options</span> <span class="o">=</span> <span class="p">{};</span></div><div class='line' id='LC561'><span class="nx">lexer</span><span class="p">.</span><span class="nx">performAction</span> <span class="o">=</span> <span class="kd">function</span> <span class="nx">anonymous</span><span class="p">(</span><span class="nx">yy</span><span class="p">,</span><span class="nx">yy_</span><span class="p">,</span><span class="nx">$avoiding_name_collisions</span><span class="p">,</span><span class="nx">YY_START</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC562'><br/></div><div class='line' id='LC563'><span class="kd">var</span> <span class="nx">YYSTATE</span><span class="o">=</span><span class="nx">YY_START</span></div><div class='line' id='LC564'><span class="k">switch</span><span class="p">(</span><span class="nx">$avoiding_name_collisions</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC565'><span class="k">case</span> <span class="mi">0</span><span class="o">:</span></div><div class='line' id='LC566'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">yy_</span><span class="p">.</span><span class="nx">yytext</span><span class="p">.</span><span class="nx">slice</span><span class="p">(</span><span class="o">-</span><span class="mi">1</span><span class="p">)</span> <span class="o">!==</span> <span class="s2">&quot;\\&quot;</span><span class="p">)</span> <span class="k">this</span><span class="p">.</span><span class="nx">begin</span><span class="p">(</span><span class="s2">&quot;mu&quot;</span><span class="p">);</span></div><div class='line' id='LC567'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">yy_</span><span class="p">.</span><span class="nx">yytext</span><span class="p">.</span><span class="nx">slice</span><span class="p">(</span><span class="o">-</span><span class="mi">1</span><span class="p">)</span> <span class="o">===</span> <span class="s2">&quot;\\&quot;</span><span class="p">)</span> <span class="nx">yy_</span><span class="p">.</span><span class="nx">yytext</span> <span class="o">=</span> <span class="nx">yy_</span><span class="p">.</span><span class="nx">yytext</span><span class="p">.</span><span class="nx">substr</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span><span class="nx">yy_</span><span class="p">.</span><span class="nx">yyleng</span><span class="o">-</span><span class="mi">1</span><span class="p">),</span> <span class="k">this</span><span class="p">.</span><span class="nx">begin</span><span class="p">(</span><span class="s2">&quot;emu&quot;</span><span class="p">);</span></div><div class='line' id='LC568'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">yy_</span><span class="p">.</span><span class="nx">yytext</span><span class="p">)</span> <span class="k">return</span> <span class="mi">14</span><span class="p">;</span></div><div class='line' id='LC569'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div class='line' id='LC570'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC571'><span class="k">case</span> <span class="mi">1</span><span class="o">:</span> <span class="k">return</span> <span class="mi">14</span><span class="p">;</span> </div><div class='line' id='LC572'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC573'><span class="k">case</span> <span class="mi">2</span><span class="o">:</span></div><div class='line' id='LC574'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">yy_</span><span class="p">.</span><span class="nx">yytext</span><span class="p">.</span><span class="nx">slice</span><span class="p">(</span><span class="o">-</span><span class="mi">1</span><span class="p">)</span> <span class="o">!==</span> <span class="s2">&quot;\\&quot;</span><span class="p">)</span> <span class="k">this</span><span class="p">.</span><span class="nx">popState</span><span class="p">();</span></div><div class='line' id='LC575'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">yy_</span><span class="p">.</span><span class="nx">yytext</span><span class="p">.</span><span class="nx">slice</span><span class="p">(</span><span class="o">-</span><span class="mi">1</span><span class="p">)</span> <span class="o">===</span> <span class="s2">&quot;\\&quot;</span><span class="p">)</span> <span class="nx">yy_</span><span class="p">.</span><span class="nx">yytext</span> <span class="o">=</span> <span class="nx">yy_</span><span class="p">.</span><span class="nx">yytext</span><span class="p">.</span><span class="nx">substr</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span><span class="nx">yy_</span><span class="p">.</span><span class="nx">yyleng</span><span class="o">-</span><span class="mi">1</span><span class="p">);</span></div><div class='line' id='LC576'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="mi">14</span><span class="p">;</span></div><div class='line' id='LC577'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div class='line' id='LC578'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC579'><span class="k">case</span> <span class="mi">3</span><span class="o">:</span> <span class="nx">yy_</span><span class="p">.</span><span class="nx">yytext</span> <span class="o">=</span> <span class="nx">yy_</span><span class="p">.</span><span class="nx">yytext</span><span class="p">.</span><span class="nx">substr</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span> <span class="nx">yy_</span><span class="p">.</span><span class="nx">yyleng</span><span class="o">-</span><span class="mi">4</span><span class="p">);</span> <span class="k">this</span><span class="p">.</span><span class="nx">popState</span><span class="p">();</span> <span class="k">return</span> <span class="mi">15</span><span class="p">;</span> </div><div class='line' id='LC580'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC581'><span class="k">case</span> <span class="mi">4</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">begin</span><span class="p">(</span><span class="s2">&quot;par&quot;</span><span class="p">);</span> <span class="k">return</span> <span class="mi">24</span><span class="p">;</span> </div><div class='line' id='LC582'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC583'><span class="k">case</span> <span class="mi">5</span><span class="o">:</span> <span class="k">return</span> <span class="mi">16</span><span class="p">;</span> </div><div class='line' id='LC584'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC585'><span class="k">case</span> <span class="mi">6</span><span class="o">:</span> <span class="k">return</span> <span class="mi">20</span><span class="p">;</span> </div><div class='line' id='LC586'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC587'><span class="k">case</span> <span class="mi">7</span><span class="o">:</span> <span class="k">return</span> <span class="mi">19</span><span class="p">;</span> </div><div class='line' id='LC588'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC589'><span class="k">case</span> <span class="mi">8</span><span class="o">:</span> <span class="k">return</span> <span class="mi">19</span><span class="p">;</span> </div><div class='line' id='LC590'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC591'><span class="k">case</span> <span class="mi">9</span><span class="o">:</span> <span class="k">return</span> <span class="mi">23</span><span class="p">;</span> </div><div class='line' id='LC592'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC593'><span class="k">case</span> <span class="mi">10</span><span class="o">:</span> <span class="k">return</span> <span class="mi">23</span><span class="p">;</span> </div><div class='line' id='LC594'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC595'><span class="k">case</span> <span class="mi">11</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">popState</span><span class="p">();</span> <span class="k">this</span><span class="p">.</span><span class="nx">begin</span><span class="p">(</span><span class="s1">&#39;com&#39;</span><span class="p">);</span> </div><div class='line' id='LC596'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC597'><span class="k">case</span> <span class="mi">12</span><span class="o">:</span> <span class="nx">yy_</span><span class="p">.</span><span class="nx">yytext</span> <span class="o">=</span> <span class="nx">yy_</span><span class="p">.</span><span class="nx">yytext</span><span class="p">.</span><span class="nx">substr</span><span class="p">(</span><span class="mi">3</span><span class="p">,</span><span class="nx">yy_</span><span class="p">.</span><span class="nx">yyleng</span><span class="o">-</span><span class="mi">5</span><span class="p">);</span> <span class="k">this</span><span class="p">.</span><span class="nx">popState</span><span class="p">();</span> <span class="k">return</span> <span class="mi">15</span><span class="p">;</span> </div><div class='line' id='LC598'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC599'><span class="k">case</span> <span class="mi">13</span><span class="o">:</span> <span class="k">return</span> <span class="mi">22</span><span class="p">;</span> </div><div class='line' id='LC600'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC601'><span class="k">case</span> <span class="mi">14</span><span class="o">:</span> <span class="k">return</span> <span class="mi">36</span><span class="p">;</span> </div><div class='line' id='LC602'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC603'><span class="k">case</span> <span class="mi">15</span><span class="o">:</span> <span class="k">return</span> <span class="mi">35</span><span class="p">;</span> </div><div class='line' id='LC604'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC605'><span class="k">case</span> <span class="mi">16</span><span class="o">:</span> <span class="k">return</span> <span class="mi">35</span><span class="p">;</span> </div><div class='line' id='LC606'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC607'><span class="k">case</span> <span class="mi">17</span><span class="o">:</span> <span class="k">return</span> <span class="mi">39</span><span class="p">;</span> </div><div class='line' id='LC608'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC609'><span class="k">case</span> <span class="mi">18</span><span class="o">:</span> <span class="cm">/*ignore whitespace*/</span> </div><div class='line' id='LC610'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC611'><span class="k">case</span> <span class="mi">19</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">popState</span><span class="p">();</span> <span class="k">return</span> <span class="mi">18</span><span class="p">;</span> </div><div class='line' id='LC612'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC613'><span class="k">case</span> <span class="mi">20</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">popState</span><span class="p">();</span> <span class="k">return</span> <span class="mi">18</span><span class="p">;</span> </div><div class='line' id='LC614'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC615'><span class="k">case</span> <span class="mi">21</span><span class="o">:</span> <span class="nx">yy_</span><span class="p">.</span><span class="nx">yytext</span> <span class="o">=</span> <span class="nx">yy_</span><span class="p">.</span><span class="nx">yytext</span><span class="p">.</span><span class="nx">substr</span><span class="p">(</span><span class="mi">1</span><span class="p">,</span><span class="nx">yy_</span><span class="p">.</span><span class="nx">yyleng</span><span class="o">-</span><span class="mi">2</span><span class="p">).</span><span class="nx">replace</span><span class="p">(</span><span class="sr">/\\&quot;/g</span><span class="p">,</span><span class="s1">&#39;&quot;&#39;</span><span class="p">);</span> <span class="k">return</span> <span class="mi">30</span><span class="p">;</span> </div><div class='line' id='LC616'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC617'><span class="k">case</span> <span class="mi">22</span><span class="o">:</span> <span class="nx">yy_</span><span class="p">.</span><span class="nx">yytext</span> <span class="o">=</span> <span class="nx">yy_</span><span class="p">.</span><span class="nx">yytext</span><span class="p">.</span><span class="nx">substr</span><span class="p">(</span><span class="mi">1</span><span class="p">,</span><span class="nx">yy_</span><span class="p">.</span><span class="nx">yyleng</span><span class="o">-</span><span class="mi">2</span><span class="p">).</span><span class="nx">replace</span><span class="p">(</span><span class="sr">/\\&#39;/g</span><span class="p">,</span><span class="s2">&quot;&#39;&quot;</span><span class="p">);</span> <span class="k">return</span> <span class="mi">30</span><span class="p">;</span> </div><div class='line' id='LC618'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC619'><span class="k">case</span> <span class="mi">23</span><span class="o">:</span> <span class="nx">yy_</span><span class="p">.</span><span class="nx">yytext</span> <span class="o">=</span> <span class="nx">yy_</span><span class="p">.</span><span class="nx">yytext</span><span class="p">.</span><span class="nx">substr</span><span class="p">(</span><span class="mi">1</span><span class="p">);</span> <span class="k">return</span> <span class="mi">28</span><span class="p">;</span> </div><div class='line' id='LC620'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC621'><span class="k">case</span> <span class="mi">24</span><span class="o">:</span> <span class="k">return</span> <span class="mi">32</span><span class="p">;</span> </div><div class='line' id='LC622'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC623'><span class="k">case</span> <span class="mi">25</span><span class="o">:</span> <span class="k">return</span> <span class="mi">32</span><span class="p">;</span> </div><div class='line' id='LC624'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC625'><span class="k">case</span> <span class="mi">26</span><span class="o">:</span> <span class="k">return</span> <span class="mi">31</span><span class="p">;</span> </div><div class='line' id='LC626'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC627'><span class="k">case</span> <span class="mi">27</span><span class="o">:</span> <span class="k">return</span> <span class="mi">35</span><span class="p">;</span> </div><div class='line' id='LC628'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC629'><span class="k">case</span> <span class="mi">28</span><span class="o">:</span> <span class="nx">yy_</span><span class="p">.</span><span class="nx">yytext</span> <span class="o">=</span> <span class="nx">yy_</span><span class="p">.</span><span class="nx">yytext</span><span class="p">.</span><span class="nx">substr</span><span class="p">(</span><span class="mi">1</span><span class="p">,</span> <span class="nx">yy_</span><span class="p">.</span><span class="nx">yyleng</span><span class="o">-</span><span class="mi">2</span><span class="p">);</span> <span class="k">return</span> <span class="mi">35</span><span class="p">;</span> </div><div class='line' id='LC630'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC631'><span class="k">case</span> <span class="mi">29</span><span class="o">:</span> <span class="k">return</span> <span class="s1">&#39;INVALID&#39;</span><span class="p">;</span> </div><div class='line' id='LC632'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC633'><span class="k">case</span> <span class="mi">30</span><span class="o">:</span> <span class="cm">/*ignore whitespace*/</span> </div><div class='line' id='LC634'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC635'><span class="k">case</span> <span class="mi">31</span><span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">popState</span><span class="p">();</span> <span class="k">return</span> <span class="mi">37</span><span class="p">;</span> </div><div class='line' id='LC636'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC637'><span class="k">case</span> <span class="mi">32</span><span class="o">:</span> <span class="k">return</span> <span class="mi">5</span><span class="p">;</span> </div><div class='line' id='LC638'><span class="k">break</span><span class="p">;</span></div><div class='line' id='LC639'><span class="p">}</span></div><div class='line' id='LC640'><span class="p">};</span></div><div class='line' id='LC641'><span class="nx">lexer</span><span class="p">.</span><span class="nx">rules</span> <span class="o">=</span> <span class="p">[</span><span class="sr">/^(?:[^\x00]*?(?=(\{\{)))/</span><span class="p">,</span><span class="sr">/^(?:[^\x00]+)/</span><span class="p">,</span><span class="sr">/^(?:[^\x00]{2,}?(?=(\{\{|$)))/</span><span class="p">,</span><span class="sr">/^(?:[\s\S]*?--\}\})/</span><span class="p">,</span><span class="sr">/^(?:\{\{&gt;)/</span><span class="p">,</span><span class="sr">/^(?:\{\{#)/</span><span class="p">,</span><span class="sr">/^(?:\{\{\/)/</span><span class="p">,</span><span class="sr">/^(?:\{\{\^)/</span><span class="p">,</span><span class="sr">/^(?:\{\{\s*else\b)/</span><span class="p">,</span><span class="sr">/^(?:\{\{\{)/</span><span class="p">,</span><span class="sr">/^(?:\{\{&amp;)/</span><span class="p">,</span><span class="sr">/^(?:\{\{!--)/</span><span class="p">,</span><span class="sr">/^(?:\{\{![\s\S]*?\}\})/</span><span class="p">,</span><span class="sr">/^(?:\{\{)/</span><span class="p">,</span><span class="sr">/^(?:=)/</span><span class="p">,</span><span class="sr">/^(?:\.(?=[} ]))/</span><span class="p">,</span><span class="sr">/^(?:\.\.)/</span><span class="p">,</span><span class="sr">/^(?:[\/.])/</span><span class="p">,</span><span class="sr">/^(?:\s+)/</span><span class="p">,</span><span class="sr">/^(?:\}\}\})/</span><span class="p">,</span><span class="sr">/^(?:\}\})/</span><span class="p">,</span><span class="sr">/^(?:&quot;(\\[&quot;]|[^&quot;])*&quot;)/</span><span class="p">,</span><span class="sr">/^(?:&#39;(\\[&#39;]|[^&#39;])*&#39;)/</span><span class="p">,</span><span class="sr">/^(?:@[a-zA-Z]+)/</span><span class="p">,</span><span class="sr">/^(?:true(?=[}\s]))/</span><span class="p">,</span><span class="sr">/^(?:false(?=[}\s]))/</span><span class="p">,</span><span class="sr">/^(?:[0-9]+(?=[}\s]))/</span><span class="p">,</span><span class="sr">/^(?:[a-zA-Z0-9_$-]+(?=[=}\s\/.]))/</span><span class="p">,</span><span class="sr">/^(?:\[[^\]]*\])/</span><span class="p">,</span><span class="sr">/^(?:.)/</span><span class="p">,</span><span class="sr">/^(?:\s+)/</span><span class="p">,</span><span class="sr">/^(?:[a-zA-Z0-9_$-/]+)/</span><span class="p">,</span><span class="sr">/^(?:$)/</span><span class="p">];</span></div><div class='line' id='LC642'><span class="nx">lexer</span><span class="p">.</span><span class="nx">conditions</span> <span class="o">=</span> <span class="p">{</span><span class="s2">&quot;mu&quot;</span><span class="o">:</span><span class="p">{</span><span class="s2">&quot;rules&quot;</span><span class="o">:</span><span class="p">[</span><span class="mi">4</span><span class="p">,</span><span class="mi">5</span><span class="p">,</span><span class="mi">6</span><span class="p">,</span><span class="mi">7</span><span class="p">,</span><span class="mi">8</span><span class="p">,</span><span class="mi">9</span><span class="p">,</span><span class="mi">10</span><span class="p">,</span><span class="mi">11</span><span class="p">,</span><span class="mi">12</span><span class="p">,</span><span class="mi">13</span><span class="p">,</span><span class="mi">14</span><span class="p">,</span><span class="mi">15</span><span class="p">,</span><span class="mi">16</span><span class="p">,</span><span class="mi">17</span><span class="p">,</span><span class="mi">18</span><span class="p">,</span><span class="mi">19</span><span class="p">,</span><span class="mi">20</span><span class="p">,</span><span class="mi">21</span><span class="p">,</span><span class="mi">22</span><span class="p">,</span><span class="mi">23</span><span class="p">,</span><span class="mi">24</span><span class="p">,</span><span class="mi">25</span><span class="p">,</span><span class="mi">26</span><span class="p">,</span><span class="mi">27</span><span class="p">,</span><span class="mi">28</span><span class="p">,</span><span class="mi">29</span><span class="p">,</span><span class="mi">32</span><span class="p">],</span><span class="s2">&quot;inclusive&quot;</span><span class="o">:</span><span class="kc">false</span><span class="p">},</span><span class="s2">&quot;emu&quot;</span><span class="o">:</span><span class="p">{</span><span class="s2">&quot;rules&quot;</span><span class="o">:</span><span class="p">[</span><span class="mi">2</span><span class="p">],</span><span class="s2">&quot;inclusive&quot;</span><span class="o">:</span><span class="kc">false</span><span class="p">},</span><span class="s2">&quot;com&quot;</span><span class="o">:</span><span class="p">{</span><span class="s2">&quot;rules&quot;</span><span class="o">:</span><span class="p">[</span><span class="mi">3</span><span class="p">],</span><span class="s2">&quot;inclusive&quot;</span><span class="o">:</span><span class="kc">false</span><span class="p">},</span><span class="s2">&quot;par&quot;</span><span class="o">:</span><span class="p">{</span><span class="s2">&quot;rules&quot;</span><span class="o">:</span><span class="p">[</span><span class="mi">30</span><span class="p">,</span><span class="mi">31</span><span class="p">],</span><span class="s2">&quot;inclusive&quot;</span><span class="o">:</span><span class="kc">false</span><span class="p">},</span><span class="s2">&quot;INITIAL&quot;</span><span class="o">:</span><span class="p">{</span><span class="s2">&quot;rules&quot;</span><span class="o">:</span><span class="p">[</span><span class="mi">0</span><span class="p">,</span><span class="mi">1</span><span class="p">,</span><span class="mi">32</span><span class="p">],</span><span class="s2">&quot;inclusive&quot;</span><span class="o">:</span><span class="kc">true</span><span class="p">}};</span></div><div class='line' id='LC643'><span class="k">return</span> <span class="nx">lexer</span><span class="p">;})()</span></div><div class='line' id='LC644'><span class="nx">parser</span><span class="p">.</span><span class="nx">lexer</span> <span class="o">=</span> <span class="nx">lexer</span><span class="p">;</span></div><div class='line' id='LC645'><span class="kd">function</span> <span class="nx">Parser</span> <span class="p">()</span> <span class="p">{</span> <span class="k">this</span><span class="p">.</span><span class="nx">yy</span> <span class="o">=</span> <span class="p">{};</span> <span class="p">}</span><span class="nx">Parser</span><span class="p">.</span><span class="nx">prototype</span> <span class="o">=</span> <span class="nx">parser</span><span class="p">;</span><span class="nx">parser</span><span class="p">.</span><span class="nx">Parser</span> <span class="o">=</span> <span class="nx">Parser</span><span class="p">;</span></div><div class='line' id='LC646'><span class="k">return</span> <span class="k">new</span> <span class="nx">Parser</span><span class="p">;</span></div><div class='line' id='LC647'><span class="p">})();;</span></div><div class='line' id='LC648'><span class="c1">// lib/handlebars/compiler/base.js</span></div><div class='line' id='LC649'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">Parser</span> <span class="o">=</span> <span class="nx">handlebars</span><span class="p">;</span></div><div class='line' id='LC650'><br/></div><div class='line' id='LC651'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">parse</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">input</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC652'><br/></div><div class='line' id='LC653'>&nbsp;&nbsp;<span class="c1">// Just return if an already-compile AST was passed in.</span></div><div class='line' id='LC654'>&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">input</span><span class="p">.</span><span class="nx">constructor</span> <span class="o">===</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">AST</span><span class="p">.</span><span class="nx">ProgramNode</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="nx">input</span><span class="p">;</span> <span class="p">}</span></div><div class='line' id='LC655'><br/></div><div class='line' id='LC656'>&nbsp;&nbsp;<span class="nx">Handlebars</span><span class="p">.</span><span class="nx">Parser</span><span class="p">.</span><span class="nx">yy</span> <span class="o">=</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">AST</span><span class="p">;</span></div><div class='line' id='LC657'>&nbsp;&nbsp;<span class="k">return</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">Parser</span><span class="p">.</span><span class="nx">parse</span><span class="p">(</span><span class="nx">input</span><span class="p">);</span></div><div class='line' id='LC658'><span class="p">};</span></div><div class='line' id='LC659'><br/></div><div class='line' id='LC660'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">print</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">ast</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC661'>&nbsp;&nbsp;<span class="k">return</span> <span class="k">new</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">PrintVisitor</span><span class="p">().</span><span class="nx">accept</span><span class="p">(</span><span class="nx">ast</span><span class="p">);</span></div><div class='line' id='LC662'><span class="p">};;</span></div><div class='line' id='LC663'><span class="c1">// lib/handlebars/compiler/ast.js</span></div><div class='line' id='LC664'><span class="p">(</span><span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC665'><br/></div><div class='line' id='LC666'>&nbsp;&nbsp;<span class="nx">Handlebars</span><span class="p">.</span><span class="nx">AST</span> <span class="o">=</span> <span class="p">{};</span></div><div class='line' id='LC667'><br/></div><div class='line' id='LC668'>&nbsp;&nbsp;<span class="nx">Handlebars</span><span class="p">.</span><span class="nx">AST</span><span class="p">.</span><span class="nx">ProgramNode</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">statements</span><span class="p">,</span> <span class="nx">inverse</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC669'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">type</span> <span class="o">=</span> <span class="s2">&quot;program&quot;</span><span class="p">;</span></div><div class='line' id='LC670'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">statements</span> <span class="o">=</span> <span class="nx">statements</span><span class="p">;</span></div><div class='line' id='LC671'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">inverse</span><span class="p">)</span> <span class="p">{</span> <span class="k">this</span><span class="p">.</span><span class="nx">inverse</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">AST</span><span class="p">.</span><span class="nx">ProgramNode</span><span class="p">(</span><span class="nx">inverse</span><span class="p">);</span> <span class="p">}</span></div><div class='line' id='LC672'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC673'><br/></div><div class='line' id='LC674'>&nbsp;&nbsp;<span class="nx">Handlebars</span><span class="p">.</span><span class="nx">AST</span><span class="p">.</span><span class="nx">MustacheNode</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">rawParams</span><span class="p">,</span> <span class="nx">hash</span><span class="p">,</span> <span class="nx">unescaped</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC675'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">type</span> <span class="o">=</span> <span class="s2">&quot;mustache&quot;</span><span class="p">;</span></div><div class='line' id='LC676'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">escaped</span> <span class="o">=</span> <span class="o">!</span><span class="nx">unescaped</span><span class="p">;</span></div><div class='line' id='LC677'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">hash</span> <span class="o">=</span> <span class="nx">hash</span><span class="p">;</span></div><div class='line' id='LC678'><br/></div><div class='line' id='LC679'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">id</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">id</span> <span class="o">=</span> <span class="nx">rawParams</span><span class="p">[</span><span class="mi">0</span><span class="p">];</span></div><div class='line' id='LC680'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">params</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">params</span> <span class="o">=</span> <span class="nx">rawParams</span><span class="p">.</span><span class="nx">slice</span><span class="p">(</span><span class="mi">1</span><span class="p">);</span></div><div class='line' id='LC681'><br/></div><div class='line' id='LC682'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// a mustache is an eligible helper if:</span></div><div class='line' id='LC683'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// * its id is simple (a single part, not `this` or `..`)</span></div><div class='line' id='LC684'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">eligibleHelper</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">eligibleHelper</span> <span class="o">=</span> <span class="nx">id</span><span class="p">.</span><span class="nx">isSimple</span><span class="p">;</span></div><div class='line' id='LC685'><br/></div><div class='line' id='LC686'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// a mustache is definitely a helper if:</span></div><div class='line' id='LC687'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// * it is an eligible helper, and</span></div><div class='line' id='LC688'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// * it has at least one parameter or hash segment</span></div><div class='line' id='LC689'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">isHelper</span> <span class="o">=</span> <span class="nx">eligibleHelper</span> <span class="o">&amp;&amp;</span> <span class="p">(</span><span class="nx">params</span><span class="p">.</span><span class="nx">length</span> <span class="o">||</span> <span class="nx">hash</span><span class="p">);</span></div><div class='line' id='LC690'><br/></div><div class='line' id='LC691'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// if a mustache is an eligible helper but not a definite</span></div><div class='line' id='LC692'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// helper, it is ambiguous, and will be resolved in a later</span></div><div class='line' id='LC693'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// pass or at runtime.</span></div><div class='line' id='LC694'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC695'><br/></div><div class='line' id='LC696'>&nbsp;&nbsp;<span class="nx">Handlebars</span><span class="p">.</span><span class="nx">AST</span><span class="p">.</span><span class="nx">PartialNode</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">partialName</span><span class="p">,</span> <span class="nx">context</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC697'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">type</span>         <span class="o">=</span> <span class="s2">&quot;partial&quot;</span><span class="p">;</span></div><div class='line' id='LC698'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">partialName</span>  <span class="o">=</span> <span class="nx">partialName</span><span class="p">;</span></div><div class='line' id='LC699'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">context</span>      <span class="o">=</span> <span class="nx">context</span><span class="p">;</span></div><div class='line' id='LC700'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC701'><br/></div><div class='line' id='LC702'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">verifyMatch</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">open</span><span class="p">,</span> <span class="nx">close</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC703'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">open</span><span class="p">.</span><span class="nx">original</span> <span class="o">!==</span> <span class="nx">close</span><span class="p">.</span><span class="nx">original</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC704'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">Exception</span><span class="p">(</span><span class="nx">open</span><span class="p">.</span><span class="nx">original</span> <span class="o">+</span> <span class="s2">&quot; doesn&#39;t match &quot;</span> <span class="o">+</span> <span class="nx">close</span><span class="p">.</span><span class="nx">original</span><span class="p">);</span></div><div class='line' id='LC705'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC706'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC707'><br/></div><div class='line' id='LC708'>&nbsp;&nbsp;<span class="nx">Handlebars</span><span class="p">.</span><span class="nx">AST</span><span class="p">.</span><span class="nx">BlockNode</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">mustache</span><span class="p">,</span> <span class="nx">program</span><span class="p">,</span> <span class="nx">inverse</span><span class="p">,</span> <span class="nx">close</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC709'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">verifyMatch</span><span class="p">(</span><span class="nx">mustache</span><span class="p">.</span><span class="nx">id</span><span class="p">,</span> <span class="nx">close</span><span class="p">);</span></div><div class='line' id='LC710'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">type</span> <span class="o">=</span> <span class="s2">&quot;block&quot;</span><span class="p">;</span></div><div class='line' id='LC711'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">mustache</span> <span class="o">=</span> <span class="nx">mustache</span><span class="p">;</span></div><div class='line' id='LC712'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">program</span>  <span class="o">=</span> <span class="nx">program</span><span class="p">;</span></div><div class='line' id='LC713'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">inverse</span>  <span class="o">=</span> <span class="nx">inverse</span><span class="p">;</span></div><div class='line' id='LC714'><br/></div><div class='line' id='LC715'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">inverse</span> <span class="o">&amp;&amp;</span> <span class="o">!</span><span class="k">this</span><span class="p">.</span><span class="nx">program</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC716'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">isInverse</span> <span class="o">=</span> <span class="kc">true</span><span class="p">;</span></div><div class='line' id='LC717'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC718'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC719'><br/></div><div class='line' id='LC720'>&nbsp;&nbsp;<span class="nx">Handlebars</span><span class="p">.</span><span class="nx">AST</span><span class="p">.</span><span class="nx">ContentNode</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">string</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC721'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">type</span> <span class="o">=</span> <span class="s2">&quot;content&quot;</span><span class="p">;</span></div><div class='line' id='LC722'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">string</span> <span class="o">=</span> <span class="nx">string</span><span class="p">;</span></div><div class='line' id='LC723'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC724'><br/></div><div class='line' id='LC725'>&nbsp;&nbsp;<span class="nx">Handlebars</span><span class="p">.</span><span class="nx">AST</span><span class="p">.</span><span class="nx">HashNode</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">pairs</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC726'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">type</span> <span class="o">=</span> <span class="s2">&quot;hash&quot;</span><span class="p">;</span></div><div class='line' id='LC727'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">pairs</span> <span class="o">=</span> <span class="nx">pairs</span><span class="p">;</span></div><div class='line' id='LC728'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC729'><br/></div><div class='line' id='LC730'>&nbsp;&nbsp;<span class="nx">Handlebars</span><span class="p">.</span><span class="nx">AST</span><span class="p">.</span><span class="nx">IdNode</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">parts</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC731'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">type</span> <span class="o">=</span> <span class="s2">&quot;ID&quot;</span><span class="p">;</span></div><div class='line' id='LC732'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">original</span> <span class="o">=</span> <span class="nx">parts</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="s2">&quot;.&quot;</span><span class="p">);</span></div><div class='line' id='LC733'><br/></div><div class='line' id='LC734'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">dig</span> <span class="o">=</span> <span class="p">[],</span> <span class="nx">depth</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span></div><div class='line' id='LC735'><br/></div><div class='line' id='LC736'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span><span class="p">(</span><span class="kd">var</span> <span class="nx">i</span><span class="o">=</span><span class="mi">0</span><span class="p">,</span><span class="nx">l</span><span class="o">=</span><span class="nx">parts</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span><span class="o">&lt;</span><span class="nx">l</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC737'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">part</span> <span class="o">=</span> <span class="nx">parts</span><span class="p">[</span><span class="nx">i</span><span class="p">];</span></div><div class='line' id='LC738'><br/></div><div class='line' id='LC739'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">part</span> <span class="o">===</span> <span class="s2">&quot;..&quot;</span> <span class="o">||</span> <span class="nx">part</span> <span class="o">===</span> <span class="s2">&quot;.&quot;</span> <span class="o">||</span> <span class="nx">part</span> <span class="o">===</span> <span class="s2">&quot;this&quot;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC740'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">dig</span><span class="p">.</span><span class="nx">length</span> <span class="o">&gt;</span> <span class="mi">0</span><span class="p">)</span> <span class="p">{</span> <span class="k">throw</span> <span class="k">new</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">Exception</span><span class="p">(</span><span class="s2">&quot;Invalid path: &quot;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">original</span><span class="p">);</span> <span class="p">}</span></div><div class='line' id='LC741'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">else</span> <span class="k">if</span> <span class="p">(</span><span class="nx">part</span> <span class="o">===</span> <span class="s2">&quot;..&quot;</span><span class="p">)</span> <span class="p">{</span> <span class="nx">depth</span><span class="o">++</span><span class="p">;</span> <span class="p">}</span></div><div class='line' id='LC742'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">else</span> <span class="p">{</span> <span class="k">this</span><span class="p">.</span><span class="nx">isScoped</span> <span class="o">=</span> <span class="kc">true</span><span class="p">;</span> <span class="p">}</span></div><div class='line' id='LC743'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC744'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">else</span> <span class="p">{</span> <span class="nx">dig</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">part</span><span class="p">);</span> <span class="p">}</span></div><div class='line' id='LC745'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC746'><br/></div><div class='line' id='LC747'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">parts</span>    <span class="o">=</span> <span class="nx">dig</span><span class="p">;</span></div><div class='line' id='LC748'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">string</span>   <span class="o">=</span> <span class="nx">dig</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="s1">&#39;.&#39;</span><span class="p">);</span></div><div class='line' id='LC749'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">depth</span>    <span class="o">=</span> <span class="nx">depth</span><span class="p">;</span></div><div class='line' id='LC750'><br/></div><div class='line' id='LC751'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// an ID is simple if it only has one part, and that part is not</span></div><div class='line' id='LC752'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// `..` or `this`.</span></div><div class='line' id='LC753'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">isSimple</span> <span class="o">=</span> <span class="nx">parts</span><span class="p">.</span><span class="nx">length</span> <span class="o">===</span> <span class="mi">1</span> <span class="o">&amp;&amp;</span> <span class="o">!</span><span class="k">this</span><span class="p">.</span><span class="nx">isScoped</span> <span class="o">&amp;&amp;</span> <span class="nx">depth</span> <span class="o">===</span> <span class="mi">0</span><span class="p">;</span></div><div class='line' id='LC754'><br/></div><div class='line' id='LC755'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">stringModeValue</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">string</span><span class="p">;</span></div><div class='line' id='LC756'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC757'><br/></div><div class='line' id='LC758'>&nbsp;&nbsp;<span class="nx">Handlebars</span><span class="p">.</span><span class="nx">AST</span><span class="p">.</span><span class="nx">PartialNameNode</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC759'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">type</span> <span class="o">=</span> <span class="s2">&quot;PARTIAL_NAME&quot;</span><span class="p">;</span></div><div class='line' id='LC760'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">name</span> <span class="o">=</span> <span class="nx">name</span><span class="p">;</span></div><div class='line' id='LC761'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC762'><br/></div><div class='line' id='LC763'>&nbsp;&nbsp;<span class="nx">Handlebars</span><span class="p">.</span><span class="nx">AST</span><span class="p">.</span><span class="nx">DataNode</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">id</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC764'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">type</span> <span class="o">=</span> <span class="s2">&quot;DATA&quot;</span><span class="p">;</span></div><div class='line' id='LC765'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">id</span> <span class="o">=</span> <span class="nx">id</span><span class="p">;</span></div><div class='line' id='LC766'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC767'><br/></div><div class='line' id='LC768'>&nbsp;&nbsp;<span class="nx">Handlebars</span><span class="p">.</span><span class="nx">AST</span><span class="p">.</span><span class="nx">StringNode</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">string</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC769'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">type</span> <span class="o">=</span> <span class="s2">&quot;STRING&quot;</span><span class="p">;</span></div><div class='line' id='LC770'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">string</span> <span class="o">=</span> <span class="nx">string</span><span class="p">;</span></div><div class='line' id='LC771'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">stringModeValue</span> <span class="o">=</span> <span class="nx">string</span><span class="p">;</span></div><div class='line' id='LC772'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC773'><br/></div><div class='line' id='LC774'>&nbsp;&nbsp;<span class="nx">Handlebars</span><span class="p">.</span><span class="nx">AST</span><span class="p">.</span><span class="nx">IntegerNode</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">integer</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC775'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">type</span> <span class="o">=</span> <span class="s2">&quot;INTEGER&quot;</span><span class="p">;</span></div><div class='line' id='LC776'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">integer</span> <span class="o">=</span> <span class="nx">integer</span><span class="p">;</span></div><div class='line' id='LC777'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">stringModeValue</span> <span class="o">=</span> <span class="nb">Number</span><span class="p">(</span><span class="nx">integer</span><span class="p">);</span></div><div class='line' id='LC778'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC779'><br/></div><div class='line' id='LC780'>&nbsp;&nbsp;<span class="nx">Handlebars</span><span class="p">.</span><span class="nx">AST</span><span class="p">.</span><span class="nx">BooleanNode</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">bool</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC781'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">type</span> <span class="o">=</span> <span class="s2">&quot;BOOLEAN&quot;</span><span class="p">;</span></div><div class='line' id='LC782'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">bool</span> <span class="o">=</span> <span class="nx">bool</span><span class="p">;</span></div><div class='line' id='LC783'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">stringModeValue</span> <span class="o">=</span> <span class="nx">bool</span> <span class="o">===</span> <span class="s2">&quot;true&quot;</span><span class="p">;</span></div><div class='line' id='LC784'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC785'><br/></div><div class='line' id='LC786'>&nbsp;&nbsp;<span class="nx">Handlebars</span><span class="p">.</span><span class="nx">AST</span><span class="p">.</span><span class="nx">CommentNode</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">comment</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC787'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">type</span> <span class="o">=</span> <span class="s2">&quot;comment&quot;</span><span class="p">;</span></div><div class='line' id='LC788'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">comment</span> <span class="o">=</span> <span class="nx">comment</span><span class="p">;</span></div><div class='line' id='LC789'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC790'><br/></div><div class='line' id='LC791'><span class="p">})();;</span></div><div class='line' id='LC792'><span class="c1">// lib/handlebars/utils.js</span></div><div class='line' id='LC793'><br/></div><div class='line' id='LC794'><span class="kd">var</span> <span class="nx">errorProps</span> <span class="o">=</span> <span class="p">[</span><span class="s1">&#39;description&#39;</span><span class="p">,</span> <span class="s1">&#39;fileName&#39;</span><span class="p">,</span> <span class="s1">&#39;lineNumber&#39;</span><span class="p">,</span> <span class="s1">&#39;message&#39;</span><span class="p">,</span> <span class="s1">&#39;name&#39;</span><span class="p">,</span> <span class="s1">&#39;number&#39;</span><span class="p">,</span> <span class="s1">&#39;stack&#39;</span><span class="p">];</span></div><div class='line' id='LC795'><br/></div><div class='line' id='LC796'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">Exception</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">message</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC797'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">tmp</span> <span class="o">=</span> <span class="nb">Error</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">constructor</span><span class="p">.</span><span class="nx">apply</span><span class="p">(</span><span class="k">this</span><span class="p">,</span> <span class="nx">arguments</span><span class="p">);</span></div><div class='line' id='LC798'><br/></div><div class='line' id='LC799'>&nbsp;&nbsp;<span class="c1">// Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn&#39;t work.</span></div><div class='line' id='LC800'>&nbsp;&nbsp;<span class="k">for</span> <span class="p">(</span><span class="kd">var</span> <span class="nx">idx</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span> <span class="nx">idx</span> <span class="o">&lt;</span> <span class="nx">errorProps</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">idx</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC801'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">[</span><span class="nx">errorProps</span><span class="p">[</span><span class="nx">idx</span><span class="p">]]</span> <span class="o">=</span> <span class="nx">tmp</span><span class="p">[</span><span class="nx">errorProps</span><span class="p">[</span><span class="nx">idx</span><span class="p">]];</span></div><div class='line' id='LC802'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC803'><span class="p">};</span></div><div class='line' id='LC804'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">Exception</span><span class="p">.</span><span class="nx">prototype</span> <span class="o">=</span> <span class="k">new</span> <span class="nb">Error</span><span class="p">();</span></div><div class='line' id='LC805'><br/></div><div class='line' id='LC806'><span class="c1">// Build out our basic SafeString type</span></div><div class='line' id='LC807'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">SafeString</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">string</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC808'>&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">string</span> <span class="o">=</span> <span class="nx">string</span><span class="p">;</span></div><div class='line' id='LC809'><span class="p">};</span></div><div class='line' id='LC810'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">SafeString</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">toString</span> <span class="o">=</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC811'>&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">.</span><span class="nx">string</span><span class="p">.</span><span class="nx">toString</span><span class="p">();</span></div><div class='line' id='LC812'><span class="p">};</span></div><div class='line' id='LC813'><br/></div><div class='line' id='LC814'><span class="p">(</span><span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC815'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">escape</span> <span class="o">=</span> <span class="p">{</span></div><div class='line' id='LC816'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot;&amp;&quot;</span><span class="o">:</span> <span class="s2">&quot;&amp;amp;&quot;</span><span class="p">,</span></div><div class='line' id='LC817'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot;&lt;&quot;</span><span class="o">:</span> <span class="s2">&quot;&amp;lt;&quot;</span><span class="p">,</span></div><div class='line' id='LC818'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot;&gt;&quot;</span><span class="o">:</span> <span class="s2">&quot;&amp;gt;&quot;</span><span class="p">,</span></div><div class='line' id='LC819'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="s1">&#39;&quot;&#39;</span><span class="o">:</span> <span class="s2">&quot;&amp;quot;&quot;</span><span class="p">,</span></div><div class='line' id='LC820'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot;&#39;&quot;</span><span class="o">:</span> <span class="s2">&quot;&amp;#x27;&quot;</span><span class="p">,</span></div><div class='line' id='LC821'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot;`&quot;</span><span class="o">:</span> <span class="s2">&quot;&amp;#x60;&quot;</span></div><div class='line' id='LC822'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC823'><br/></div><div class='line' id='LC824'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">badChars</span> <span class="o">=</span> <span class="sr">/[&amp;&lt;&gt;&quot;&#39;`]/g</span><span class="p">;</span></div><div class='line' id='LC825'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">possible</span> <span class="o">=</span> <span class="sr">/[&amp;&lt;&gt;&quot;&#39;`]/</span><span class="p">;</span></div><div class='line' id='LC826'><br/></div><div class='line' id='LC827'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">escapeChar</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">chr</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC828'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">escape</span><span class="p">[</span><span class="nx">chr</span><span class="p">]</span> <span class="o">||</span> <span class="s2">&quot;&amp;amp;&quot;</span><span class="p">;</span></div><div class='line' id='LC829'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC830'><br/></div><div class='line' id='LC831'>&nbsp;&nbsp;<span class="nx">Handlebars</span><span class="p">.</span><span class="nx">Utils</span> <span class="o">=</span> <span class="p">{</span></div><div class='line' id='LC832'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">escapeExpression</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">string</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC833'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// don&#39;t escape SafeStrings, since they&#39;re already safe</span></div><div class='line' id='LC834'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">string</span> <span class="k">instanceof</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">SafeString</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC835'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">string</span><span class="p">.</span><span class="nx">toString</span><span class="p">();</span></div><div class='line' id='LC836'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="k">if</span> <span class="p">(</span><span class="nx">string</span> <span class="o">==</span> <span class="kc">null</span> <span class="o">||</span> <span class="nx">string</span> <span class="o">===</span> <span class="kc">false</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC837'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="s2">&quot;&quot;</span><span class="p">;</span></div><div class='line' id='LC838'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC839'><br/></div><div class='line' id='LC840'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="o">!</span><span class="nx">possible</span><span class="p">.</span><span class="nx">test</span><span class="p">(</span><span class="nx">string</span><span class="p">))</span> <span class="p">{</span> <span class="k">return</span> <span class="nx">string</span><span class="p">;</span> <span class="p">}</span></div><div class='line' id='LC841'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">string</span><span class="p">.</span><span class="nx">replace</span><span class="p">(</span><span class="nx">badChars</span><span class="p">,</span> <span class="nx">escapeChar</span><span class="p">);</span></div><div class='line' id='LC842'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC843'><br/></div><div class='line' id='LC844'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">isEmpty</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">value</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC845'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">value</span> <span class="o">&amp;&amp;</span> <span class="nx">value</span> <span class="o">!==</span> <span class="mi">0</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC846'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="kc">true</span><span class="p">;</span></div><div class='line' id='LC847'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="nb">Object</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">toString</span><span class="p">.</span><span class="nx">call</span><span class="p">(</span><span class="nx">value</span><span class="p">)</span> <span class="o">===</span> <span class="s2">&quot;[object Array]&quot;</span> <span class="o">&amp;&amp;</span> <span class="nx">value</span><span class="p">.</span><span class="nx">length</span> <span class="o">===</span> <span class="mi">0</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC848'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="kc">true</span><span class="p">;</span></div><div class='line' id='LC849'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC850'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="kc">false</span><span class="p">;</span></div><div class='line' id='LC851'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC852'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC853'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC854'><span class="p">})();;</span></div><div class='line' id='LC855'><span class="c1">// lib/handlebars/compiler/compiler.js</span></div><div class='line' id='LC856'><br/></div><div class='line' id='LC857'><span class="cm">/*jshint eqnull:true*/</span></div><div class='line' id='LC858'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">Compiler</span> <span class="o">=</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{};</span></div><div class='line' id='LC859'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">JavaScriptCompiler</span> <span class="o">=</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{};</span></div><div class='line' id='LC860'><br/></div><div class='line' id='LC861'><span class="p">(</span><span class="kd">function</span><span class="p">(</span><span class="nx">Compiler</span><span class="p">,</span> <span class="nx">JavaScriptCompiler</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC862'>&nbsp;&nbsp;<span class="c1">// the foundHelper register will disambiguate helper lookup from finding a</span></div><div class='line' id='LC863'>&nbsp;&nbsp;<span class="c1">// function in a context. This is necessary for mustache compatibility, which</span></div><div class='line' id='LC864'>&nbsp;&nbsp;<span class="c1">// requires that context functions in blocks are evaluated by blockHelperMissing,</span></div><div class='line' id='LC865'>&nbsp;&nbsp;<span class="c1">// and then proceed as if the resulting value was provided to blockHelperMissing.</span></div><div class='line' id='LC866'><br/></div><div class='line' id='LC867'>&nbsp;&nbsp;<span class="nx">Compiler</span><span class="p">.</span><span class="nx">prototype</span> <span class="o">=</span> <span class="p">{</span></div><div class='line' id='LC868'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">compiler</span><span class="o">:</span> <span class="nx">Compiler</span><span class="p">,</span></div><div class='line' id='LC869'><br/></div><div class='line' id='LC870'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">disassemble</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC871'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">opcodes</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">opcodes</span><span class="p">,</span> <span class="nx">opcode</span><span class="p">,</span> <span class="nx">out</span> <span class="o">=</span> <span class="p">[],</span> <span class="nx">params</span><span class="p">,</span> <span class="nx">param</span><span class="p">;</span></div><div class='line' id='LC872'><br/></div><div class='line' id='LC873'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span> <span class="p">(</span><span class="kd">var</span> <span class="nx">i</span><span class="o">=</span><span class="mi">0</span><span class="p">,</span> <span class="nx">l</span><span class="o">=</span><span class="nx">opcodes</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span><span class="o">&lt;</span><span class="nx">l</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC874'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">opcode</span> <span class="o">=</span> <span class="nx">opcodes</span><span class="p">[</span><span class="nx">i</span><span class="p">];</span></div><div class='line' id='LC875'><br/></div><div class='line' id='LC876'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">opcode</span><span class="p">.</span><span class="nx">opcode</span> <span class="o">===</span> <span class="s1">&#39;DECLARE&#39;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC877'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">out</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;DECLARE &quot;</span> <span class="o">+</span> <span class="nx">opcode</span><span class="p">.</span><span class="nx">name</span> <span class="o">+</span> <span class="s2">&quot;=&quot;</span> <span class="o">+</span> <span class="nx">opcode</span><span class="p">.</span><span class="nx">value</span><span class="p">);</span></div><div class='line' id='LC878'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC879'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">params</span> <span class="o">=</span> <span class="p">[];</span></div><div class='line' id='LC880'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span> <span class="p">(</span><span class="kd">var</span> <span class="nx">j</span><span class="o">=</span><span class="mi">0</span><span class="p">;</span> <span class="nx">j</span><span class="o">&lt;</span><span class="nx">opcode</span><span class="p">.</span><span class="nx">args</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">j</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC881'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">param</span> <span class="o">=</span> <span class="nx">opcode</span><span class="p">.</span><span class="nx">args</span><span class="p">[</span><span class="nx">j</span><span class="p">];</span></div><div class='line' id='LC882'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">typeof</span> <span class="nx">param</span> <span class="o">===</span> <span class="s2">&quot;string&quot;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC883'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">param</span> <span class="o">=</span> <span class="s2">&quot;\&quot;&quot;</span> <span class="o">+</span> <span class="nx">param</span><span class="p">.</span><span class="nx">replace</span><span class="p">(</span><span class="s2">&quot;\n&quot;</span><span class="p">,</span> <span class="s2">&quot;\\n&quot;</span><span class="p">)</span> <span class="o">+</span> <span class="s2">&quot;\&quot;&quot;</span><span class="p">;</span></div><div class='line' id='LC884'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC885'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">params</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">param</span><span class="p">);</span></div><div class='line' id='LC886'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC887'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">out</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">opcode</span><span class="p">.</span><span class="nx">opcode</span> <span class="o">+</span> <span class="s2">&quot; &quot;</span> <span class="o">+</span> <span class="nx">params</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="s2">&quot; &quot;</span><span class="p">));</span></div><div class='line' id='LC888'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC889'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC890'><br/></div><div class='line' id='LC891'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">out</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="s2">&quot;\n&quot;</span><span class="p">);</span></div><div class='line' id='LC892'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC893'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">equals</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">other</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC894'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">len</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">opcodes</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span></div><div class='line' id='LC895'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">other</span><span class="p">.</span><span class="nx">opcodes</span><span class="p">.</span><span class="nx">length</span> <span class="o">!==</span> <span class="nx">len</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC896'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="kc">false</span><span class="p">;</span></div><div class='line' id='LC897'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC898'><br/></div><div class='line' id='LC899'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span> <span class="p">(</span><span class="kd">var</span> <span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span> <span class="nx">i</span> <span class="o">&lt;</span> <span class="nx">len</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC900'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">opcode</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">opcodes</span><span class="p">[</span><span class="nx">i</span><span class="p">],</span></div><div class='line' id='LC901'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">otherOpcode</span> <span class="o">=</span> <span class="nx">other</span><span class="p">.</span><span class="nx">opcodes</span><span class="p">[</span><span class="nx">i</span><span class="p">];</span></div><div class='line' id='LC902'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">opcode</span><span class="p">.</span><span class="nx">opcode</span> <span class="o">!==</span> <span class="nx">otherOpcode</span><span class="p">.</span><span class="nx">opcode</span> <span class="o">||</span> <span class="nx">opcode</span><span class="p">.</span><span class="nx">args</span><span class="p">.</span><span class="nx">length</span> <span class="o">!==</span> <span class="nx">otherOpcode</span><span class="p">.</span><span class="nx">args</span><span class="p">.</span><span class="nx">length</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC903'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="kc">false</span><span class="p">;</span></div><div class='line' id='LC904'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC905'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span> <span class="p">(</span><span class="kd">var</span> <span class="nx">j</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span> <span class="nx">j</span> <span class="o">&lt;</span> <span class="nx">opcode</span><span class="p">.</span><span class="nx">args</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">j</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC906'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">opcode</span><span class="p">.</span><span class="nx">args</span><span class="p">[</span><span class="nx">j</span><span class="p">]</span> <span class="o">!==</span> <span class="nx">otherOpcode</span><span class="p">.</span><span class="nx">args</span><span class="p">[</span><span class="nx">j</span><span class="p">])</span> <span class="p">{</span></div><div class='line' id='LC907'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="kc">false</span><span class="p">;</span></div><div class='line' id='LC908'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC909'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC910'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC911'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="kc">true</span><span class="p">;</span></div><div class='line' id='LC912'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC913'><br/></div><div class='line' id='LC914'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">guid</span><span class="o">:</span> <span class="mi">0</span><span class="p">,</span></div><div class='line' id='LC915'><br/></div><div class='line' id='LC916'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">compile</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">program</span><span class="p">,</span> <span class="nx">options</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC917'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">children</span> <span class="o">=</span> <span class="p">[];</span></div><div class='line' id='LC918'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">depths</span> <span class="o">=</span> <span class="p">{</span><span class="nx">list</span><span class="o">:</span> <span class="p">[]};</span></div><div class='line' id='LC919'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">options</span> <span class="o">=</span> <span class="nx">options</span><span class="p">;</span></div><div class='line' id='LC920'><br/></div><div class='line' id='LC921'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// These changes will propagate to the other compiler components</span></div><div class='line' id='LC922'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">knownHelpers</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">knownHelpers</span><span class="p">;</span></div><div class='line' id='LC923'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">knownHelpers</span> <span class="o">=</span> <span class="p">{</span></div><div class='line' id='LC924'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="s1">&#39;helperMissing&#39;</span><span class="o">:</span> <span class="kc">true</span><span class="p">,</span></div><div class='line' id='LC925'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="s1">&#39;blockHelperMissing&#39;</span><span class="o">:</span> <span class="kc">true</span><span class="p">,</span></div><div class='line' id='LC926'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="s1">&#39;each&#39;</span><span class="o">:</span> <span class="kc">true</span><span class="p">,</span></div><div class='line' id='LC927'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="s1">&#39;if&#39;</span><span class="o">:</span> <span class="kc">true</span><span class="p">,</span></div><div class='line' id='LC928'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="s1">&#39;unless&#39;</span><span class="o">:</span> <span class="kc">true</span><span class="p">,</span></div><div class='line' id='LC929'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="s1">&#39;with&#39;</span><span class="o">:</span> <span class="kc">true</span><span class="p">,</span></div><div class='line' id='LC930'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="s1">&#39;log&#39;</span><span class="o">:</span> <span class="kc">true</span></div><div class='line' id='LC931'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC932'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">knownHelpers</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC933'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span> <span class="p">(</span><span class="kd">var</span> <span class="nx">name</span> <span class="k">in</span> <span class="nx">knownHelpers</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC934'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">knownHelpers</span><span class="p">[</span><span class="nx">name</span><span class="p">]</span> <span class="o">=</span> <span class="nx">knownHelpers</span><span class="p">[</span><span class="nx">name</span><span class="p">];</span></div><div class='line' id='LC935'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC936'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC937'><br/></div><div class='line' id='LC938'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">.</span><span class="nx">program</span><span class="p">(</span><span class="nx">program</span><span class="p">);</span></div><div class='line' id='LC939'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC940'><br/></div><div class='line' id='LC941'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">accept</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">node</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC942'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">[</span><span class="nx">node</span><span class="p">.</span><span class="nx">type</span><span class="p">](</span><span class="nx">node</span><span class="p">);</span></div><div class='line' id='LC943'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC944'><br/></div><div class='line' id='LC945'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">program</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">program</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC946'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">statements</span> <span class="o">=</span> <span class="nx">program</span><span class="p">.</span><span class="nx">statements</span><span class="p">,</span> <span class="nx">statement</span><span class="p">;</span></div><div class='line' id='LC947'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcodes</span> <span class="o">=</span> <span class="p">[];</span></div><div class='line' id='LC948'><br/></div><div class='line' id='LC949'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span><span class="p">(</span><span class="kd">var</span> <span class="nx">i</span><span class="o">=</span><span class="mi">0</span><span class="p">,</span> <span class="nx">l</span><span class="o">=</span><span class="nx">statements</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span><span class="o">&lt;</span><span class="nx">l</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC950'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">statement</span> <span class="o">=</span> <span class="nx">statements</span><span class="p">[</span><span class="nx">i</span><span class="p">];</span></div><div class='line' id='LC951'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">[</span><span class="nx">statement</span><span class="p">.</span><span class="nx">type</span><span class="p">](</span><span class="nx">statement</span><span class="p">);</span></div><div class='line' id='LC952'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC953'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">isSimple</span> <span class="o">=</span> <span class="nx">l</span> <span class="o">===</span> <span class="mi">1</span><span class="p">;</span></div><div class='line' id='LC954'><br/></div><div class='line' id='LC955'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">depths</span><span class="p">.</span><span class="nx">list</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">depths</span><span class="p">.</span><span class="nx">list</span><span class="p">.</span><span class="nx">sort</span><span class="p">(</span><span class="kd">function</span><span class="p">(</span><span class="nx">a</span><span class="p">,</span> <span class="nx">b</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC956'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">a</span> <span class="o">-</span> <span class="nx">b</span><span class="p">;</span></div><div class='line' id='LC957'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">});</span></div><div class='line' id='LC958'><br/></div><div class='line' id='LC959'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">;</span></div><div class='line' id='LC960'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC961'><br/></div><div class='line' id='LC962'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">compileProgram</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">program</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC963'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">result</span> <span class="o">=</span> <span class="k">new</span> <span class="k">this</span><span class="p">.</span><span class="nx">compiler</span><span class="p">().</span><span class="nx">compile</span><span class="p">(</span><span class="nx">program</span><span class="p">,</span> <span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">);</span></div><div class='line' id='LC964'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">guid</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">guid</span><span class="o">++</span><span class="p">,</span> <span class="nx">depth</span><span class="p">;</span></div><div class='line' id='LC965'><br/></div><div class='line' id='LC966'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">usePartial</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">usePartial</span> <span class="o">||</span> <span class="nx">result</span><span class="p">.</span><span class="nx">usePartial</span><span class="p">;</span></div><div class='line' id='LC967'><br/></div><div class='line' id='LC968'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">children</span><span class="p">[</span><span class="nx">guid</span><span class="p">]</span> <span class="o">=</span> <span class="nx">result</span><span class="p">;</span></div><div class='line' id='LC969'><br/></div><div class='line' id='LC970'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span><span class="p">(</span><span class="kd">var</span> <span class="nx">i</span><span class="o">=</span><span class="mi">0</span><span class="p">,</span> <span class="nx">l</span><span class="o">=</span><span class="nx">result</span><span class="p">.</span><span class="nx">depths</span><span class="p">.</span><span class="nx">list</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span><span class="o">&lt;</span><span class="nx">l</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC971'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">depth</span> <span class="o">=</span> <span class="nx">result</span><span class="p">.</span><span class="nx">depths</span><span class="p">.</span><span class="nx">list</span><span class="p">[</span><span class="nx">i</span><span class="p">];</span></div><div class='line' id='LC972'><br/></div><div class='line' id='LC973'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">depth</span> <span class="o">&lt;</span> <span class="mi">2</span><span class="p">)</span> <span class="p">{</span> <span class="k">continue</span><span class="p">;</span> <span class="p">}</span></div><div class='line' id='LC974'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">else</span> <span class="p">{</span> <span class="k">this</span><span class="p">.</span><span class="nx">addDepth</span><span class="p">(</span><span class="nx">depth</span> <span class="o">-</span> <span class="mi">1</span><span class="p">);</span> <span class="p">}</span></div><div class='line' id='LC975'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC976'><br/></div><div class='line' id='LC977'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">guid</span><span class="p">;</span></div><div class='line' id='LC978'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC979'><br/></div><div class='line' id='LC980'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">block</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">block</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC981'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">mustache</span> <span class="o">=</span> <span class="nx">block</span><span class="p">.</span><span class="nx">mustache</span><span class="p">,</span></div><div class='line' id='LC982'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">program</span> <span class="o">=</span> <span class="nx">block</span><span class="p">.</span><span class="nx">program</span><span class="p">,</span></div><div class='line' id='LC983'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">inverse</span> <span class="o">=</span> <span class="nx">block</span><span class="p">.</span><span class="nx">inverse</span><span class="p">;</span></div><div class='line' id='LC984'><br/></div><div class='line' id='LC985'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">program</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC986'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">program</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">compileProgram</span><span class="p">(</span><span class="nx">program</span><span class="p">);</span></div><div class='line' id='LC987'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC988'><br/></div><div class='line' id='LC989'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">inverse</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC990'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">inverse</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">compileProgram</span><span class="p">(</span><span class="nx">inverse</span><span class="p">);</span></div><div class='line' id='LC991'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC992'><br/></div><div class='line' id='LC993'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">type</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">classifyMustache</span><span class="p">(</span><span class="nx">mustache</span><span class="p">);</span></div><div class='line' id='LC994'><br/></div><div class='line' id='LC995'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">type</span> <span class="o">===</span> <span class="s2">&quot;helper&quot;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC996'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">helperMustache</span><span class="p">(</span><span class="nx">mustache</span><span class="p">,</span> <span class="nx">program</span><span class="p">,</span> <span class="nx">inverse</span><span class="p">);</span></div><div class='line' id='LC997'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="k">if</span> <span class="p">(</span><span class="nx">type</span> <span class="o">===</span> <span class="s2">&quot;simple&quot;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC998'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">simpleMustache</span><span class="p">(</span><span class="nx">mustache</span><span class="p">);</span></div><div class='line' id='LC999'><br/></div><div class='line' id='LC1000'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// now that the simple mustache is resolved, we need to</span></div><div class='line' id='LC1001'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// evaluate it by executing `blockHelperMissing`</span></div><div class='line' id='LC1002'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;pushProgram&#39;</span><span class="p">,</span> <span class="nx">program</span><span class="p">);</span></div><div class='line' id='LC1003'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;pushProgram&#39;</span><span class="p">,</span> <span class="nx">inverse</span><span class="p">);</span></div><div class='line' id='LC1004'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;emptyHash&#39;</span><span class="p">);</span></div><div class='line' id='LC1005'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;blockValue&#39;</span><span class="p">);</span></div><div class='line' id='LC1006'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1007'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">ambiguousMustache</span><span class="p">(</span><span class="nx">mustache</span><span class="p">,</span> <span class="nx">program</span><span class="p">,</span> <span class="nx">inverse</span><span class="p">);</span></div><div class='line' id='LC1008'><br/></div><div class='line' id='LC1009'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// now that the simple mustache is resolved, we need to</span></div><div class='line' id='LC1010'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// evaluate it by executing `blockHelperMissing`</span></div><div class='line' id='LC1011'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;pushProgram&#39;</span><span class="p">,</span> <span class="nx">program</span><span class="p">);</span></div><div class='line' id='LC1012'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;pushProgram&#39;</span><span class="p">,</span> <span class="nx">inverse</span><span class="p">);</span></div><div class='line' id='LC1013'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;emptyHash&#39;</span><span class="p">);</span></div><div class='line' id='LC1014'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;ambiguousBlockValue&#39;</span><span class="p">);</span></div><div class='line' id='LC1015'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1016'><br/></div><div class='line' id='LC1017'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;append&#39;</span><span class="p">);</span></div><div class='line' id='LC1018'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1019'><br/></div><div class='line' id='LC1020'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">hash</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">hash</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1021'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">pairs</span> <span class="o">=</span> <span class="nx">hash</span><span class="p">.</span><span class="nx">pairs</span><span class="p">,</span> <span class="nx">pair</span><span class="p">,</span> <span class="nx">val</span><span class="p">;</span></div><div class='line' id='LC1022'><br/></div><div class='line' id='LC1023'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;pushHash&#39;</span><span class="p">);</span></div><div class='line' id='LC1024'><br/></div><div class='line' id='LC1025'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span><span class="p">(</span><span class="kd">var</span> <span class="nx">i</span><span class="o">=</span><span class="mi">0</span><span class="p">,</span> <span class="nx">l</span><span class="o">=</span><span class="nx">pairs</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span><span class="o">&lt;</span><span class="nx">l</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1026'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">pair</span> <span class="o">=</span> <span class="nx">pairs</span><span class="p">[</span><span class="nx">i</span><span class="p">];</span></div><div class='line' id='LC1027'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">val</span>  <span class="o">=</span> <span class="nx">pair</span><span class="p">[</span><span class="mi">1</span><span class="p">];</span></div><div class='line' id='LC1028'><br/></div><div class='line' id='LC1029'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">stringParams</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1030'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;pushStringParam&#39;</span><span class="p">,</span> <span class="nx">val</span><span class="p">.</span><span class="nx">stringModeValue</span><span class="p">,</span> <span class="nx">val</span><span class="p">.</span><span class="nx">type</span><span class="p">);</span></div><div class='line' id='LC1031'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1032'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">accept</span><span class="p">(</span><span class="nx">val</span><span class="p">);</span></div><div class='line' id='LC1033'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1034'><br/></div><div class='line' id='LC1035'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;assignToHash&#39;</span><span class="p">,</span> <span class="nx">pair</span><span class="p">[</span><span class="mi">0</span><span class="p">]);</span></div><div class='line' id='LC1036'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1037'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;popHash&#39;</span><span class="p">);</span></div><div class='line' id='LC1038'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1039'><br/></div><div class='line' id='LC1040'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">partial</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">partial</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1041'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">partialName</span> <span class="o">=</span> <span class="nx">partial</span><span class="p">.</span><span class="nx">partialName</span><span class="p">;</span></div><div class='line' id='LC1042'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">usePartial</span> <span class="o">=</span> <span class="kc">true</span><span class="p">;</span></div><div class='line' id='LC1043'><br/></div><div class='line' id='LC1044'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">partial</span><span class="p">.</span><span class="nx">context</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1045'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">ID</span><span class="p">(</span><span class="nx">partial</span><span class="p">.</span><span class="nx">context</span><span class="p">);</span></div><div class='line' id='LC1046'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1047'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;push&#39;</span><span class="p">,</span> <span class="s1">&#39;depth0&#39;</span><span class="p">);</span></div><div class='line' id='LC1048'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1049'><br/></div><div class='line' id='LC1050'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;invokePartial&#39;</span><span class="p">,</span> <span class="nx">partialName</span><span class="p">.</span><span class="nx">name</span><span class="p">);</span></div><div class='line' id='LC1051'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;append&#39;</span><span class="p">);</span></div><div class='line' id='LC1052'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1053'><br/></div><div class='line' id='LC1054'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">content</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">content</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1055'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;appendContent&#39;</span><span class="p">,</span> <span class="nx">content</span><span class="p">.</span><span class="nx">string</span><span class="p">);</span></div><div class='line' id='LC1056'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1057'><br/></div><div class='line' id='LC1058'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">mustache</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">mustache</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1059'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">options</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">;</span></div><div class='line' id='LC1060'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">type</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">classifyMustache</span><span class="p">(</span><span class="nx">mustache</span><span class="p">);</span></div><div class='line' id='LC1061'><br/></div><div class='line' id='LC1062'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">type</span> <span class="o">===</span> <span class="s2">&quot;simple&quot;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1063'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">simpleMustache</span><span class="p">(</span><span class="nx">mustache</span><span class="p">);</span></div><div class='line' id='LC1064'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="k">if</span> <span class="p">(</span><span class="nx">type</span> <span class="o">===</span> <span class="s2">&quot;helper&quot;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1065'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">helperMustache</span><span class="p">(</span><span class="nx">mustache</span><span class="p">);</span></div><div class='line' id='LC1066'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1067'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">ambiguousMustache</span><span class="p">(</span><span class="nx">mustache</span><span class="p">);</span></div><div class='line' id='LC1068'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1069'><br/></div><div class='line' id='LC1070'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">mustache</span><span class="p">.</span><span class="nx">escaped</span> <span class="o">&amp;&amp;</span> <span class="o">!</span><span class="nx">options</span><span class="p">.</span><span class="nx">noEscape</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1071'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;appendEscaped&#39;</span><span class="p">);</span></div><div class='line' id='LC1072'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1073'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;append&#39;</span><span class="p">);</span></div><div class='line' id='LC1074'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1075'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1076'><br/></div><div class='line' id='LC1077'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">ambiguousMustache</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">mustache</span><span class="p">,</span> <span class="nx">program</span><span class="p">,</span> <span class="nx">inverse</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1078'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">id</span> <span class="o">=</span> <span class="nx">mustache</span><span class="p">.</span><span class="nx">id</span><span class="p">,</span></div><div class='line' id='LC1079'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">name</span> <span class="o">=</span> <span class="nx">id</span><span class="p">.</span><span class="nx">parts</span><span class="p">[</span><span class="mi">0</span><span class="p">],</span></div><div class='line' id='LC1080'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">isBlock</span> <span class="o">=</span> <span class="nx">program</span> <span class="o">!=</span> <span class="kc">null</span> <span class="o">||</span> <span class="nx">inverse</span> <span class="o">!=</span> <span class="kc">null</span><span class="p">;</span></div><div class='line' id='LC1081'><br/></div><div class='line' id='LC1082'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;getContext&#39;</span><span class="p">,</span> <span class="nx">id</span><span class="p">.</span><span class="nx">depth</span><span class="p">);</span></div><div class='line' id='LC1083'><br/></div><div class='line' id='LC1084'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;pushProgram&#39;</span><span class="p">,</span> <span class="nx">program</span><span class="p">);</span></div><div class='line' id='LC1085'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;pushProgram&#39;</span><span class="p">,</span> <span class="nx">inverse</span><span class="p">);</span></div><div class='line' id='LC1086'><br/></div><div class='line' id='LC1087'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;invokeAmbiguous&#39;</span><span class="p">,</span> <span class="nx">name</span><span class="p">,</span> <span class="nx">isBlock</span><span class="p">);</span></div><div class='line' id='LC1088'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1089'><br/></div><div class='line' id='LC1090'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">simpleMustache</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">mustache</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1091'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">id</span> <span class="o">=</span> <span class="nx">mustache</span><span class="p">.</span><span class="nx">id</span><span class="p">;</span></div><div class='line' id='LC1092'><br/></div><div class='line' id='LC1093'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">id</span><span class="p">.</span><span class="nx">type</span> <span class="o">===</span> <span class="s1">&#39;DATA&#39;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1094'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">DATA</span><span class="p">(</span><span class="nx">id</span><span class="p">);</span></div><div class='line' id='LC1095'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="k">if</span> <span class="p">(</span><span class="nx">id</span><span class="p">.</span><span class="nx">parts</span><span class="p">.</span><span class="nx">length</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1096'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">ID</span><span class="p">(</span><span class="nx">id</span><span class="p">);</span></div><div class='line' id='LC1097'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1098'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Simplified ID for `this`</span></div><div class='line' id='LC1099'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">addDepth</span><span class="p">(</span><span class="nx">id</span><span class="p">.</span><span class="nx">depth</span><span class="p">);</span></div><div class='line' id='LC1100'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;getContext&#39;</span><span class="p">,</span> <span class="nx">id</span><span class="p">.</span><span class="nx">depth</span><span class="p">);</span></div><div class='line' id='LC1101'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;pushContext&#39;</span><span class="p">);</span></div><div class='line' id='LC1102'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1103'><br/></div><div class='line' id='LC1104'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;resolvePossibleLambda&#39;</span><span class="p">);</span></div><div class='line' id='LC1105'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1106'><br/></div><div class='line' id='LC1107'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">helperMustache</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">mustache</span><span class="p">,</span> <span class="nx">program</span><span class="p">,</span> <span class="nx">inverse</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1108'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">params</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">setupFullMustacheParams</span><span class="p">(</span><span class="nx">mustache</span><span class="p">,</span> <span class="nx">program</span><span class="p">,</span> <span class="nx">inverse</span><span class="p">),</span></div><div class='line' id='LC1109'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">name</span> <span class="o">=</span> <span class="nx">mustache</span><span class="p">.</span><span class="nx">id</span><span class="p">.</span><span class="nx">parts</span><span class="p">[</span><span class="mi">0</span><span class="p">];</span></div><div class='line' id='LC1110'><br/></div><div class='line' id='LC1111'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">knownHelpers</span><span class="p">[</span><span class="nx">name</span><span class="p">])</span> <span class="p">{</span></div><div class='line' id='LC1112'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;invokeKnownHelper&#39;</span><span class="p">,</span> <span class="nx">params</span><span class="p">.</span><span class="nx">length</span><span class="p">,</span> <span class="nx">name</span><span class="p">);</span></div><div class='line' id='LC1113'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">knownHelpersOnly</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1114'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nb">Error</span><span class="p">(</span><span class="s2">&quot;You specified knownHelpersOnly, but used the unknown helper &quot;</span> <span class="o">+</span> <span class="nx">name</span><span class="p">);</span></div><div class='line' id='LC1115'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1116'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;invokeHelper&#39;</span><span class="p">,</span> <span class="nx">params</span><span class="p">.</span><span class="nx">length</span><span class="p">,</span> <span class="nx">name</span><span class="p">);</span></div><div class='line' id='LC1117'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1118'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1119'><br/></div><div class='line' id='LC1120'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">ID</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">id</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1121'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">addDepth</span><span class="p">(</span><span class="nx">id</span><span class="p">.</span><span class="nx">depth</span><span class="p">);</span></div><div class='line' id='LC1122'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;getContext&#39;</span><span class="p">,</span> <span class="nx">id</span><span class="p">.</span><span class="nx">depth</span><span class="p">);</span></div><div class='line' id='LC1123'><br/></div><div class='line' id='LC1124'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">name</span> <span class="o">=</span> <span class="nx">id</span><span class="p">.</span><span class="nx">parts</span><span class="p">[</span><span class="mi">0</span><span class="p">];</span></div><div class='line' id='LC1125'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">name</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1126'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;pushContext&#39;</span><span class="p">);</span></div><div class='line' id='LC1127'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1128'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;lookupOnContext&#39;</span><span class="p">,</span> <span class="nx">id</span><span class="p">.</span><span class="nx">parts</span><span class="p">[</span><span class="mi">0</span><span class="p">]);</span></div><div class='line' id='LC1129'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1130'><br/></div><div class='line' id='LC1131'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span><span class="p">(</span><span class="kd">var</span> <span class="nx">i</span><span class="o">=</span><span class="mi">1</span><span class="p">,</span> <span class="nx">l</span><span class="o">=</span><span class="nx">id</span><span class="p">.</span><span class="nx">parts</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span><span class="o">&lt;</span><span class="nx">l</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1132'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;lookup&#39;</span><span class="p">,</span> <span class="nx">id</span><span class="p">.</span><span class="nx">parts</span><span class="p">[</span><span class="nx">i</span><span class="p">]);</span></div><div class='line' id='LC1133'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1134'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1135'><br/></div><div class='line' id='LC1136'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">DATA</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">data</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1137'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">data</span> <span class="o">=</span> <span class="kc">true</span><span class="p">;</span></div><div class='line' id='LC1138'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;lookupData&#39;</span><span class="p">,</span> <span class="nx">data</span><span class="p">.</span><span class="nx">id</span><span class="p">);</span></div><div class='line' id='LC1139'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1140'><br/></div><div class='line' id='LC1141'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">STRING</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">string</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1142'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;pushString&#39;</span><span class="p">,</span> <span class="nx">string</span><span class="p">.</span><span class="nx">string</span><span class="p">);</span></div><div class='line' id='LC1143'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1144'><br/></div><div class='line' id='LC1145'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">INTEGER</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">integer</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1146'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;pushLiteral&#39;</span><span class="p">,</span> <span class="nx">integer</span><span class="p">.</span><span class="nx">integer</span><span class="p">);</span></div><div class='line' id='LC1147'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1148'><br/></div><div class='line' id='LC1149'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">BOOLEAN</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">bool</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1150'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;pushLiteral&#39;</span><span class="p">,</span> <span class="nx">bool</span><span class="p">.</span><span class="nx">bool</span><span class="p">);</span></div><div class='line' id='LC1151'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1152'><br/></div><div class='line' id='LC1153'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">comment</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{},</span></div><div class='line' id='LC1154'><br/></div><div class='line' id='LC1155'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// HELPERS</span></div><div class='line' id='LC1156'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">opcode</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1157'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcodes</span><span class="p">.</span><span class="nx">push</span><span class="p">({</span> <span class="nx">opcode</span><span class="o">:</span> <span class="nx">name</span><span class="p">,</span> <span class="nx">args</span><span class="o">:</span> <span class="p">[].</span><span class="nx">slice</span><span class="p">.</span><span class="nx">call</span><span class="p">(</span><span class="nx">arguments</span><span class="p">,</span> <span class="mi">1</span><span class="p">)</span> <span class="p">});</span></div><div class='line' id='LC1158'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1159'><br/></div><div class='line' id='LC1160'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">declare</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">name</span><span class="p">,</span> <span class="nx">value</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1161'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcodes</span><span class="p">.</span><span class="nx">push</span><span class="p">({</span> <span class="nx">opcode</span><span class="o">:</span> <span class="s1">&#39;DECLARE&#39;</span><span class="p">,</span> <span class="nx">name</span><span class="o">:</span> <span class="nx">name</span><span class="p">,</span> <span class="nx">value</span><span class="o">:</span> <span class="nx">value</span> <span class="p">});</span></div><div class='line' id='LC1162'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1163'><br/></div><div class='line' id='LC1164'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">addDepth</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">depth</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1165'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nb">isNaN</span><span class="p">(</span><span class="nx">depth</span><span class="p">))</span> <span class="p">{</span> <span class="k">throw</span> <span class="k">new</span> <span class="nb">Error</span><span class="p">(</span><span class="s2">&quot;EWOT&quot;</span><span class="p">);</span> <span class="p">}</span></div><div class='line' id='LC1166'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">depth</span> <span class="o">===</span> <span class="mi">0</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span><span class="p">;</span> <span class="p">}</span></div><div class='line' id='LC1167'><br/></div><div class='line' id='LC1168'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="o">!</span><span class="k">this</span><span class="p">.</span><span class="nx">depths</span><span class="p">[</span><span class="nx">depth</span><span class="p">])</span> <span class="p">{</span></div><div class='line' id='LC1169'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">depths</span><span class="p">[</span><span class="nx">depth</span><span class="p">]</span> <span class="o">=</span> <span class="kc">true</span><span class="p">;</span></div><div class='line' id='LC1170'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">depths</span><span class="p">.</span><span class="nx">list</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">depth</span><span class="p">);</span></div><div class='line' id='LC1171'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1172'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1173'><br/></div><div class='line' id='LC1174'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">classifyMustache</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">mustache</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1175'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">isHelper</span>   <span class="o">=</span> <span class="nx">mustache</span><span class="p">.</span><span class="nx">isHelper</span><span class="p">;</span></div><div class='line' id='LC1176'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">isEligible</span> <span class="o">=</span> <span class="nx">mustache</span><span class="p">.</span><span class="nx">eligibleHelper</span><span class="p">;</span></div><div class='line' id='LC1177'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">options</span>    <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">;</span></div><div class='line' id='LC1178'><br/></div><div class='line' id='LC1179'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// if ambiguous, we can possibly resolve the ambiguity now</span></div><div class='line' id='LC1180'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">isEligible</span> <span class="o">&amp;&amp;</span> <span class="o">!</span><span class="nx">isHelper</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1181'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">name</span> <span class="o">=</span> <span class="nx">mustache</span><span class="p">.</span><span class="nx">id</span><span class="p">.</span><span class="nx">parts</span><span class="p">[</span><span class="mi">0</span><span class="p">];</span></div><div class='line' id='LC1182'><br/></div><div class='line' id='LC1183'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">options</span><span class="p">.</span><span class="nx">knownHelpers</span><span class="p">[</span><span class="nx">name</span><span class="p">])</span> <span class="p">{</span></div><div class='line' id='LC1184'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">isHelper</span> <span class="o">=</span> <span class="kc">true</span><span class="p">;</span></div><div class='line' id='LC1185'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="k">if</span> <span class="p">(</span><span class="nx">options</span><span class="p">.</span><span class="nx">knownHelpersOnly</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1186'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">isEligible</span> <span class="o">=</span> <span class="kc">false</span><span class="p">;</span></div><div class='line' id='LC1187'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1188'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1189'><br/></div><div class='line' id='LC1190'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">isHelper</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="s2">&quot;helper&quot;</span><span class="p">;</span> <span class="p">}</span></div><div class='line' id='LC1191'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">else</span> <span class="k">if</span> <span class="p">(</span><span class="nx">isEligible</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="s2">&quot;ambiguous&quot;</span><span class="p">;</span> <span class="p">}</span></div><div class='line' id='LC1192'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">else</span> <span class="p">{</span> <span class="k">return</span> <span class="s2">&quot;simple&quot;</span><span class="p">;</span> <span class="p">}</span></div><div class='line' id='LC1193'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1194'><br/></div><div class='line' id='LC1195'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">pushParams</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">params</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1196'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">i</span> <span class="o">=</span> <span class="nx">params</span><span class="p">.</span><span class="nx">length</span><span class="p">,</span> <span class="nx">param</span><span class="p">;</span></div><div class='line' id='LC1197'><br/></div><div class='line' id='LC1198'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">while</span><span class="p">(</span><span class="nx">i</span><span class="o">--</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1199'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">param</span> <span class="o">=</span> <span class="nx">params</span><span class="p">[</span><span class="nx">i</span><span class="p">];</span></div><div class='line' id='LC1200'><br/></div><div class='line' id='LC1201'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">stringParams</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1202'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">param</span><span class="p">.</span><span class="nx">depth</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1203'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">addDepth</span><span class="p">(</span><span class="nx">param</span><span class="p">.</span><span class="nx">depth</span><span class="p">);</span></div><div class='line' id='LC1204'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1205'><br/></div><div class='line' id='LC1206'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;getContext&#39;</span><span class="p">,</span> <span class="nx">param</span><span class="p">.</span><span class="nx">depth</span> <span class="o">||</span> <span class="mi">0</span><span class="p">);</span></div><div class='line' id='LC1207'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;pushStringParam&#39;</span><span class="p">,</span> <span class="nx">param</span><span class="p">.</span><span class="nx">stringModeValue</span><span class="p">,</span> <span class="nx">param</span><span class="p">.</span><span class="nx">type</span><span class="p">);</span></div><div class='line' id='LC1208'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1209'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">[</span><span class="nx">param</span><span class="p">.</span><span class="nx">type</span><span class="p">](</span><span class="nx">param</span><span class="p">);</span></div><div class='line' id='LC1210'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1211'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1212'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1213'><br/></div><div class='line' id='LC1214'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">setupMustacheParams</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">mustache</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1215'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">params</span> <span class="o">=</span> <span class="nx">mustache</span><span class="p">.</span><span class="nx">params</span><span class="p">;</span></div><div class='line' id='LC1216'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">pushParams</span><span class="p">(</span><span class="nx">params</span><span class="p">);</span></div><div class='line' id='LC1217'><br/></div><div class='line' id='LC1218'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">mustache</span><span class="p">.</span><span class="nx">hash</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1219'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">hash</span><span class="p">(</span><span class="nx">mustache</span><span class="p">.</span><span class="nx">hash</span><span class="p">);</span></div><div class='line' id='LC1220'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1221'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;emptyHash&#39;</span><span class="p">);</span></div><div class='line' id='LC1222'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1223'><br/></div><div class='line' id='LC1224'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">params</span><span class="p">;</span></div><div class='line' id='LC1225'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1226'><br/></div><div class='line' id='LC1227'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// this will replace setupMustacheParams when we&#39;re done</span></div><div class='line' id='LC1228'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">setupFullMustacheParams</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">mustache</span><span class="p">,</span> <span class="nx">program</span><span class="p">,</span> <span class="nx">inverse</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1229'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">params</span> <span class="o">=</span> <span class="nx">mustache</span><span class="p">.</span><span class="nx">params</span><span class="p">;</span></div><div class='line' id='LC1230'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">pushParams</span><span class="p">(</span><span class="nx">params</span><span class="p">);</span></div><div class='line' id='LC1231'><br/></div><div class='line' id='LC1232'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;pushProgram&#39;</span><span class="p">,</span> <span class="nx">program</span><span class="p">);</span></div><div class='line' id='LC1233'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;pushProgram&#39;</span><span class="p">,</span> <span class="nx">inverse</span><span class="p">);</span></div><div class='line' id='LC1234'><br/></div><div class='line' id='LC1235'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">mustache</span><span class="p">.</span><span class="nx">hash</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1236'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">hash</span><span class="p">(</span><span class="nx">mustache</span><span class="p">.</span><span class="nx">hash</span><span class="p">);</span></div><div class='line' id='LC1237'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1238'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">opcode</span><span class="p">(</span><span class="s1">&#39;emptyHash&#39;</span><span class="p">);</span></div><div class='line' id='LC1239'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1240'><br/></div><div class='line' id='LC1241'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">params</span><span class="p">;</span></div><div class='line' id='LC1242'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1243'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC1244'><br/></div><div class='line' id='LC1245'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">Literal</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">value</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1246'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">value</span> <span class="o">=</span> <span class="nx">value</span><span class="p">;</span></div><div class='line' id='LC1247'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC1248'><br/></div><div class='line' id='LC1249'>&nbsp;&nbsp;<span class="nx">JavaScriptCompiler</span><span class="p">.</span><span class="nx">prototype</span> <span class="o">=</span> <span class="p">{</span></div><div class='line' id='LC1250'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// PUBLIC API: You can override these methods in a subclass to provide</span></div><div class='line' id='LC1251'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// alternative compiled forms for name lookup and buffering semantics</span></div><div class='line' id='LC1252'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">nameLookup</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">parent</span><span class="p">,</span> <span class="nx">name</span> <span class="cm">/* , type*/</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1253'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="sr">/^[0-9]+$/</span><span class="p">.</span><span class="nx">test</span><span class="p">(</span><span class="nx">name</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC1254'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">parent</span> <span class="o">+</span> <span class="s2">&quot;[&quot;</span> <span class="o">+</span> <span class="nx">name</span> <span class="o">+</span> <span class="s2">&quot;]&quot;</span><span class="p">;</span></div><div class='line' id='LC1255'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="k">if</span> <span class="p">(</span><span class="nx">JavaScriptCompiler</span><span class="p">.</span><span class="nx">isValidJavaScriptVariableName</span><span class="p">(</span><span class="nx">name</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC1256'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">parent</span> <span class="o">+</span> <span class="s2">&quot;.&quot;</span> <span class="o">+</span> <span class="nx">name</span><span class="p">;</span></div><div class='line' id='LC1257'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1258'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1259'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">parent</span> <span class="o">+</span> <span class="s2">&quot;[&#39;&quot;</span> <span class="o">+</span> <span class="nx">name</span> <span class="o">+</span> <span class="s2">&quot;&#39;]&quot;</span><span class="p">;</span></div><div class='line' id='LC1260'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1261'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1262'><br/></div><div class='line' id='LC1263'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">appendToBuffer</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">string</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1264'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">environment</span><span class="p">.</span><span class="nx">isSimple</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1265'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="s2">&quot;return &quot;</span> <span class="o">+</span> <span class="nx">string</span> <span class="o">+</span> <span class="s2">&quot;;&quot;</span><span class="p">;</span></div><div class='line' id='LC1266'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1267'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="p">{</span></div><div class='line' id='LC1268'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">appendToBuffer</span><span class="o">:</span> <span class="kc">true</span><span class="p">,</span></div><div class='line' id='LC1269'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">content</span><span class="o">:</span> <span class="nx">string</span><span class="p">,</span></div><div class='line' id='LC1270'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">toString</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span> <span class="k">return</span> <span class="s2">&quot;buffer += &quot;</span> <span class="o">+</span> <span class="nx">string</span> <span class="o">+</span> <span class="s2">&quot;;&quot;</span><span class="p">;</span> <span class="p">}</span></div><div class='line' id='LC1271'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC1272'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1273'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1274'><br/></div><div class='line' id='LC1275'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">initializeBuffer</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC1276'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">.</span><span class="nx">quotedString</span><span class="p">(</span><span class="s2">&quot;&quot;</span><span class="p">);</span></div><div class='line' id='LC1277'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1278'><br/></div><div class='line' id='LC1279'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">namespace</span><span class="o">:</span> <span class="s2">&quot;Handlebars&quot;</span><span class="p">,</span></div><div class='line' id='LC1280'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// END PUBLIC API</span></div><div class='line' id='LC1281'><br/></div><div class='line' id='LC1282'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">compile</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">environment</span><span class="p">,</span> <span class="nx">options</span><span class="p">,</span> <span class="nx">context</span><span class="p">,</span> <span class="nx">asObject</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1283'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">environment</span> <span class="o">=</span> <span class="nx">environment</span><span class="p">;</span></div><div class='line' id='LC1284'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">options</span> <span class="o">=</span> <span class="nx">options</span> <span class="o">||</span> <span class="p">{};</span></div><div class='line' id='LC1285'><br/></div><div class='line' id='LC1286'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">Handlebars</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">logger</span><span class="p">.</span><span class="nx">DEBUG</span><span class="p">,</span> <span class="k">this</span><span class="p">.</span><span class="nx">environment</span><span class="p">.</span><span class="nx">disassemble</span><span class="p">()</span> <span class="o">+</span> <span class="s2">&quot;\n\n&quot;</span><span class="p">);</span></div><div class='line' id='LC1287'><br/></div><div class='line' id='LC1288'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">name</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">environment</span><span class="p">.</span><span class="nx">name</span><span class="p">;</span></div><div class='line' id='LC1289'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">isChild</span> <span class="o">=</span> <span class="o">!!</span><span class="nx">context</span><span class="p">;</span></div><div class='line' id='LC1290'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">context</span> <span class="o">=</span> <span class="nx">context</span> <span class="o">||</span> <span class="p">{</span></div><div class='line' id='LC1291'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">programs</span><span class="o">:</span> <span class="p">[],</span></div><div class='line' id='LC1292'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">environments</span><span class="o">:</span> <span class="p">[],</span></div><div class='line' id='LC1293'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">aliases</span><span class="o">:</span> <span class="p">{</span> <span class="p">}</span></div><div class='line' id='LC1294'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC1295'><br/></div><div class='line' id='LC1296'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">preamble</span><span class="p">();</span></div><div class='line' id='LC1297'><br/></div><div class='line' id='LC1298'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">stackSlot</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span></div><div class='line' id='LC1299'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">stackVars</span> <span class="o">=</span> <span class="p">[];</span></div><div class='line' id='LC1300'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">registers</span> <span class="o">=</span> <span class="p">{</span> <span class="nx">list</span><span class="o">:</span> <span class="p">[]</span> <span class="p">};</span></div><div class='line' id='LC1301'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">compileStack</span> <span class="o">=</span> <span class="p">[];</span></div><div class='line' id='LC1302'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">inlineStack</span> <span class="o">=</span> <span class="p">[];</span></div><div class='line' id='LC1303'><br/></div><div class='line' id='LC1304'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">compileChildren</span><span class="p">(</span><span class="nx">environment</span><span class="p">,</span> <span class="nx">options</span><span class="p">);</span></div><div class='line' id='LC1305'><br/></div><div class='line' id='LC1306'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">opcodes</span> <span class="o">=</span> <span class="nx">environment</span><span class="p">.</span><span class="nx">opcodes</span><span class="p">,</span> <span class="nx">opcode</span><span class="p">;</span></div><div class='line' id='LC1307'><br/></div><div class='line' id='LC1308'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span></div><div class='line' id='LC1309'><br/></div><div class='line' id='LC1310'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span><span class="p">(</span><span class="nx">l</span><span class="o">=</span><span class="nx">opcodes</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="k">this</span><span class="p">.</span><span class="nx">i</span><span class="o">&lt;</span><span class="nx">l</span><span class="p">;</span> <span class="k">this</span><span class="p">.</span><span class="nx">i</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1311'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">opcode</span> <span class="o">=</span> <span class="nx">opcodes</span><span class="p">[</span><span class="k">this</span><span class="p">.</span><span class="nx">i</span><span class="p">];</span></div><div class='line' id='LC1312'><br/></div><div class='line' id='LC1313'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">opcode</span><span class="p">.</span><span class="nx">opcode</span> <span class="o">===</span> <span class="s1">&#39;DECLARE&#39;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1314'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">[</span><span class="nx">opcode</span><span class="p">.</span><span class="nx">name</span><span class="p">]</span> <span class="o">=</span> <span class="nx">opcode</span><span class="p">.</span><span class="nx">value</span><span class="p">;</span></div><div class='line' id='LC1315'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1316'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">[</span><span class="nx">opcode</span><span class="p">.</span><span class="nx">opcode</span><span class="p">].</span><span class="nx">apply</span><span class="p">(</span><span class="k">this</span><span class="p">,</span> <span class="nx">opcode</span><span class="p">.</span><span class="nx">args</span><span class="p">);</span></div><div class='line' id='LC1317'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1318'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1319'><br/></div><div class='line' id='LC1320'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">.</span><span class="nx">createFunctionContext</span><span class="p">(</span><span class="nx">asObject</span><span class="p">);</span></div><div class='line' id='LC1321'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1322'><br/></div><div class='line' id='LC1323'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">nextOpcode</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC1324'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">opcodes</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">environment</span><span class="p">.</span><span class="nx">opcodes</span><span class="p">;</span></div><div class='line' id='LC1325'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">opcodes</span><span class="p">[</span><span class="k">this</span><span class="p">.</span><span class="nx">i</span> <span class="o">+</span> <span class="mi">1</span><span class="p">];</span></div><div class='line' id='LC1326'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1327'><br/></div><div class='line' id='LC1328'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">eat</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC1329'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">i</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">i</span> <span class="o">+</span> <span class="mi">1</span><span class="p">;</span></div><div class='line' id='LC1330'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1331'><br/></div><div class='line' id='LC1332'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">preamble</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC1333'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">out</span> <span class="o">=</span> <span class="p">[];</span></div><div class='line' id='LC1334'><br/></div><div class='line' id='LC1335'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="k">this</span><span class="p">.</span><span class="nx">isChild</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1336'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">namespace</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">namespace</span><span class="p">;</span></div><div class='line' id='LC1337'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">copies</span> <span class="o">=</span> <span class="s2">&quot;helpers = helpers || &quot;</span> <span class="o">+</span> <span class="nx">namespace</span> <span class="o">+</span> <span class="s2">&quot;.helpers;&quot;</span><span class="p">;</span></div><div class='line' id='LC1338'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">environment</span><span class="p">.</span><span class="nx">usePartial</span><span class="p">)</span> <span class="p">{</span> <span class="nx">copies</span> <span class="o">=</span> <span class="nx">copies</span> <span class="o">+</span> <span class="s2">&quot; partials = partials || &quot;</span> <span class="o">+</span> <span class="nx">namespace</span> <span class="o">+</span> <span class="s2">&quot;.partials;&quot;</span><span class="p">;</span> <span class="p">}</span></div><div class='line' id='LC1339'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">data</span><span class="p">)</span> <span class="p">{</span> <span class="nx">copies</span> <span class="o">=</span> <span class="nx">copies</span> <span class="o">+</span> <span class="s2">&quot; data = data || {};&quot;</span><span class="p">;</span> <span class="p">}</span></div><div class='line' id='LC1340'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">out</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">copies</span><span class="p">);</span></div><div class='line' id='LC1341'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1342'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">out</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s1">&#39;&#39;</span><span class="p">);</span></div><div class='line' id='LC1343'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1344'><br/></div><div class='line' id='LC1345'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="k">this</span><span class="p">.</span><span class="nx">environment</span><span class="p">.</span><span class="nx">isSimple</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1346'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">out</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;, buffer = &quot;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">initializeBuffer</span><span class="p">());</span></div><div class='line' id='LC1347'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1348'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">out</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;&quot;</span><span class="p">);</span></div><div class='line' id='LC1349'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1350'><br/></div><div class='line' id='LC1351'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// track the last context pushed into place to allow skipping the</span></div><div class='line' id='LC1352'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// getContext opcode when it would be a noop</span></div><div class='line' id='LC1353'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">lastContext</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span></div><div class='line' id='LC1354'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">source</span> <span class="o">=</span> <span class="nx">out</span><span class="p">;</span></div><div class='line' id='LC1355'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1356'><br/></div><div class='line' id='LC1357'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">createFunctionContext</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">asObject</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1358'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">locals</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">stackVars</span><span class="p">.</span><span class="nx">concat</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">registers</span><span class="p">.</span><span class="nx">list</span><span class="p">);</span></div><div class='line' id='LC1359'><br/></div><div class='line' id='LC1360'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">locals</span><span class="p">.</span><span class="nx">length</span> <span class="o">&gt;</span> <span class="mi">0</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1361'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">source</span><span class="p">[</span><span class="mi">1</span><span class="p">]</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">source</span><span class="p">[</span><span class="mi">1</span><span class="p">]</span> <span class="o">+</span> <span class="s2">&quot;, &quot;</span> <span class="o">+</span> <span class="nx">locals</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="s2">&quot;, &quot;</span><span class="p">);</span></div><div class='line' id='LC1362'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1363'><br/></div><div class='line' id='LC1364'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Generate minimizer alias mappings</span></div><div class='line' id='LC1365'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="k">this</span><span class="p">.</span><span class="nx">isChild</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1366'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span> <span class="p">(</span><span class="kd">var</span> <span class="nx">alias</span> <span class="k">in</span> <span class="k">this</span><span class="p">.</span><span class="nx">context</span><span class="p">.</span><span class="nx">aliases</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1367'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">source</span><span class="p">[</span><span class="mi">1</span><span class="p">]</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">source</span><span class="p">[</span><span class="mi">1</span><span class="p">]</span> <span class="o">+</span> <span class="s1">&#39;, &#39;</span> <span class="o">+</span> <span class="nx">alias</span> <span class="o">+</span> <span class="s1">&#39;=&#39;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">context</span><span class="p">.</span><span class="nx">aliases</span><span class="p">[</span><span class="nx">alias</span><span class="p">];</span></div><div class='line' id='LC1368'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1369'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1370'><br/></div><div class='line' id='LC1371'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">source</span><span class="p">[</span><span class="mi">1</span><span class="p">])</span> <span class="p">{</span></div><div class='line' id='LC1372'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">source</span><span class="p">[</span><span class="mi">1</span><span class="p">]</span> <span class="o">=</span> <span class="s2">&quot;var &quot;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">source</span><span class="p">[</span><span class="mi">1</span><span class="p">].</span><span class="nx">substring</span><span class="p">(</span><span class="mi">2</span><span class="p">)</span> <span class="o">+</span> <span class="s2">&quot;;&quot;</span><span class="p">;</span></div><div class='line' id='LC1373'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1374'><br/></div><div class='line' id='LC1375'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Merge children</span></div><div class='line' id='LC1376'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="k">this</span><span class="p">.</span><span class="nx">isChild</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1377'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">source</span><span class="p">[</span><span class="mi">1</span><span class="p">]</span> <span class="o">+=</span> <span class="s1">&#39;\n&#39;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">context</span><span class="p">.</span><span class="nx">programs</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="s1">&#39;\n&#39;</span><span class="p">)</span> <span class="o">+</span> <span class="s1">&#39;\n&#39;</span><span class="p">;</span></div><div class='line' id='LC1378'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1379'><br/></div><div class='line' id='LC1380'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="k">this</span><span class="p">.</span><span class="nx">environment</span><span class="p">.</span><span class="nx">isSimple</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1381'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">source</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;return buffer;&quot;</span><span class="p">);</span></div><div class='line' id='LC1382'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1383'><br/></div><div class='line' id='LC1384'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">params</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">isChild</span> <span class="o">?</span> <span class="p">[</span><span class="s2">&quot;depth0&quot;</span><span class="p">,</span> <span class="s2">&quot;data&quot;</span><span class="p">]</span> <span class="o">:</span> <span class="p">[</span><span class="s2">&quot;Handlebars&quot;</span><span class="p">,</span> <span class="s2">&quot;depth0&quot;</span><span class="p">,</span> <span class="s2">&quot;helpers&quot;</span><span class="p">,</span> <span class="s2">&quot;partials&quot;</span><span class="p">,</span> <span class="s2">&quot;data&quot;</span><span class="p">];</span></div><div class='line' id='LC1385'><br/></div><div class='line' id='LC1386'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span><span class="p">(</span><span class="kd">var</span> <span class="nx">i</span><span class="o">=</span><span class="mi">0</span><span class="p">,</span> <span class="nx">l</span><span class="o">=</span><span class="k">this</span><span class="p">.</span><span class="nx">environment</span><span class="p">.</span><span class="nx">depths</span><span class="p">.</span><span class="nx">list</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span><span class="o">&lt;</span><span class="nx">l</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1387'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">params</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;depth&quot;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">environment</span><span class="p">.</span><span class="nx">depths</span><span class="p">.</span><span class="nx">list</span><span class="p">[</span><span class="nx">i</span><span class="p">]);</span></div><div class='line' id='LC1388'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1389'><br/></div><div class='line' id='LC1390'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Perform a second pass over the output to merge content when possible</span></div><div class='line' id='LC1391'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">source</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">mergeSource</span><span class="p">();</span></div><div class='line' id='LC1392'><br/></div><div class='line' id='LC1393'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="k">this</span><span class="p">.</span><span class="nx">isChild</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1394'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">revision</span> <span class="o">=</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">COMPILER_REVISION</span><span class="p">,</span></div><div class='line' id='LC1395'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">versions</span> <span class="o">=</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">REVISION_CHANGES</span><span class="p">[</span><span class="nx">revision</span><span class="p">];</span></div><div class='line' id='LC1396'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">source</span> <span class="o">=</span> <span class="s2">&quot;this.compilerInfo = [&quot;</span><span class="o">+</span><span class="nx">revision</span><span class="o">+</span><span class="s2">&quot;,&#39;&quot;</span><span class="o">+</span><span class="nx">versions</span><span class="o">+</span><span class="s2">&quot;&#39;];\n&quot;</span><span class="o">+</span><span class="nx">source</span><span class="p">;</span></div><div class='line' id='LC1397'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1398'><br/></div><div class='line' id='LC1399'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">asObject</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1400'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">params</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">source</span><span class="p">);</span></div><div class='line' id='LC1401'><br/></div><div class='line' id='LC1402'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nb">Function</span><span class="p">.</span><span class="nx">apply</span><span class="p">(</span><span class="k">this</span><span class="p">,</span> <span class="nx">params</span><span class="p">);</span></div><div class='line' id='LC1403'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1404'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">functionSource</span> <span class="o">=</span> <span class="s1">&#39;function &#39;</span> <span class="o">+</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">name</span> <span class="o">||</span> <span class="s1">&#39;&#39;</span><span class="p">)</span> <span class="o">+</span> <span class="s1">&#39;(&#39;</span> <span class="o">+</span> <span class="nx">params</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="s1">&#39;,&#39;</span><span class="p">)</span> <span class="o">+</span> <span class="s1">&#39;) {\n  &#39;</span> <span class="o">+</span> <span class="nx">source</span> <span class="o">+</span> <span class="s1">&#39;}&#39;</span><span class="p">;</span></div><div class='line' id='LC1405'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">Handlebars</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">logger</span><span class="p">.</span><span class="nx">DEBUG</span><span class="p">,</span> <span class="nx">functionSource</span> <span class="o">+</span> <span class="s2">&quot;\n\n&quot;</span><span class="p">);</span></div><div class='line' id='LC1406'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">functionSource</span><span class="p">;</span></div><div class='line' id='LC1407'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1408'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1409'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">mergeSource</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC1410'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// WARN: We are not handling the case where buffer is still populated as the source should</span></div><div class='line' id='LC1411'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// not have buffer append operations as their final action.</span></div><div class='line' id='LC1412'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">source</span> <span class="o">=</span> <span class="s1">&#39;&#39;</span><span class="p">,</span></div><div class='line' id='LC1413'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">buffer</span><span class="p">;</span></div><div class='line' id='LC1414'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span> <span class="p">(</span><span class="kd">var</span> <span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">len</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">source</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span> <span class="o">&lt;</span> <span class="nx">len</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1415'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">line</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">source</span><span class="p">[</span><span class="nx">i</span><span class="p">];</span></div><div class='line' id='LC1416'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">line</span><span class="p">.</span><span class="nx">appendToBuffer</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1417'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">buffer</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1418'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">buffer</span> <span class="o">=</span> <span class="nx">buffer</span> <span class="o">+</span> <span class="s1">&#39;\n    + &#39;</span> <span class="o">+</span> <span class="nx">line</span><span class="p">.</span><span class="nx">content</span><span class="p">;</span></div><div class='line' id='LC1419'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1420'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">buffer</span> <span class="o">=</span> <span class="nx">line</span><span class="p">.</span><span class="nx">content</span><span class="p">;</span></div><div class='line' id='LC1421'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1422'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1423'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">buffer</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1424'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">source</span> <span class="o">+=</span> <span class="s1">&#39;buffer += &#39;</span> <span class="o">+</span> <span class="nx">buffer</span> <span class="o">+</span> <span class="s1">&#39;;\n  &#39;</span><span class="p">;</span></div><div class='line' id='LC1425'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">buffer</span> <span class="o">=</span> <span class="kc">undefined</span><span class="p">;</span></div><div class='line' id='LC1426'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1427'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">source</span> <span class="o">+=</span> <span class="nx">line</span> <span class="o">+</span> <span class="s1">&#39;\n  &#39;</span><span class="p">;</span></div><div class='line' id='LC1428'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1429'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1430'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">source</span><span class="p">;</span></div><div class='line' id='LC1431'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1432'><br/></div><div class='line' id='LC1433'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// [blockValue]</span></div><div class='line' id='LC1434'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1435'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, before: hash, inverse, program, value</span></div><div class='line' id='LC1436'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, after: return value of blockHelperMissing</span></div><div class='line' id='LC1437'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1438'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// The purpose of this opcode is to take a block of the form</span></div><div class='line' id='LC1439'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// `{{#foo}}...{{/foo}}`, resolve the value of `foo`, and</span></div><div class='line' id='LC1440'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// replace it on the stack with the result of properly</span></div><div class='line' id='LC1441'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// invoking blockHelperMissing.</span></div><div class='line' id='LC1442'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">blockValue</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC1443'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">context</span><span class="p">.</span><span class="nx">aliases</span><span class="p">.</span><span class="nx">blockHelperMissing</span> <span class="o">=</span> <span class="s1">&#39;helpers.blockHelperMissing&#39;</span><span class="p">;</span></div><div class='line' id='LC1444'><br/></div><div class='line' id='LC1445'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">params</span> <span class="o">=</span> <span class="p">[</span><span class="s2">&quot;depth0&quot;</span><span class="p">];</span></div><div class='line' id='LC1446'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">setupParams</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span> <span class="nx">params</span><span class="p">);</span></div><div class='line' id='LC1447'><br/></div><div class='line' id='LC1448'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">replaceStack</span><span class="p">(</span><span class="kd">function</span><span class="p">(</span><span class="nx">current</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1449'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">params</span><span class="p">.</span><span class="nx">splice</span><span class="p">(</span><span class="mi">1</span><span class="p">,</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">current</span><span class="p">);</span></div><div class='line' id='LC1450'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="s2">&quot;blockHelperMissing.call(&quot;</span> <span class="o">+</span> <span class="nx">params</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="s2">&quot;, &quot;</span><span class="p">)</span> <span class="o">+</span> <span class="s2">&quot;)&quot;</span><span class="p">;</span></div><div class='line' id='LC1451'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">});</span></div><div class='line' id='LC1452'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1453'><br/></div><div class='line' id='LC1454'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// [ambiguousBlockValue]</span></div><div class='line' id='LC1455'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1456'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, before: hash, inverse, program, value</span></div><div class='line' id='LC1457'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Compiler value, before: lastHelper=value of last found helper, if any</span></div><div class='line' id='LC1458'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, after, if no lastHelper: same as [blockValue]</span></div><div class='line' id='LC1459'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, after, if lastHelper: value</span></div><div class='line' id='LC1460'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">ambiguousBlockValue</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC1461'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">context</span><span class="p">.</span><span class="nx">aliases</span><span class="p">.</span><span class="nx">blockHelperMissing</span> <span class="o">=</span> <span class="s1">&#39;helpers.blockHelperMissing&#39;</span><span class="p">;</span></div><div class='line' id='LC1462'><br/></div><div class='line' id='LC1463'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">params</span> <span class="o">=</span> <span class="p">[</span><span class="s2">&quot;depth0&quot;</span><span class="p">];</span></div><div class='line' id='LC1464'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">setupParams</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span> <span class="nx">params</span><span class="p">);</span></div><div class='line' id='LC1465'><br/></div><div class='line' id='LC1466'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">current</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">topStack</span><span class="p">();</span></div><div class='line' id='LC1467'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">params</span><span class="p">.</span><span class="nx">splice</span><span class="p">(</span><span class="mi">1</span><span class="p">,</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">current</span><span class="p">);</span></div><div class='line' id='LC1468'><br/></div><div class='line' id='LC1469'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Use the options value generated from the invocation</span></div><div class='line' id='LC1470'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">params</span><span class="p">[</span><span class="nx">params</span><span class="p">.</span><span class="nx">length</span><span class="o">-</span><span class="mi">1</span><span class="p">]</span> <span class="o">=</span> <span class="s1">&#39;options&#39;</span><span class="p">;</span></div><div class='line' id='LC1471'><br/></div><div class='line' id='LC1472'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">source</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;if (!&quot;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">lastHelper</span> <span class="o">+</span> <span class="s2">&quot;) { &quot;</span> <span class="o">+</span> <span class="nx">current</span> <span class="o">+</span> <span class="s2">&quot; = blockHelperMissing.call(&quot;</span> <span class="o">+</span> <span class="nx">params</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="s2">&quot;, &quot;</span><span class="p">)</span> <span class="o">+</span> <span class="s2">&quot;); }&quot;</span><span class="p">);</span></div><div class='line' id='LC1473'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1474'><br/></div><div class='line' id='LC1475'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// [appendContent]</span></div><div class='line' id='LC1476'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1477'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, before: ...</span></div><div class='line' id='LC1478'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, after: ...</span></div><div class='line' id='LC1479'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1480'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Appends the string value of `content` to the current buffer</span></div><div class='line' id='LC1481'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">appendContent</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">content</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1482'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">source</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">appendToBuffer</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">quotedString</span><span class="p">(</span><span class="nx">content</span><span class="p">)));</span></div><div class='line' id='LC1483'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1484'><br/></div><div class='line' id='LC1485'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// [append]</span></div><div class='line' id='LC1486'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1487'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, before: value, ...</span></div><div class='line' id='LC1488'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, after: ...</span></div><div class='line' id='LC1489'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1490'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Coerces `value` to a String and appends it to the current buffer.</span></div><div class='line' id='LC1491'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1492'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// If `value` is truthy, or 0, it is coerced into a string and appended</span></div><div class='line' id='LC1493'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Otherwise, the empty string is appended</span></div><div class='line' id='LC1494'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">append</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC1495'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Force anything that is inlined onto the stack so we don&#39;t have duplication</span></div><div class='line' id='LC1496'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// when we examine local</span></div><div class='line' id='LC1497'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">flushInline</span><span class="p">();</span></div><div class='line' id='LC1498'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">local</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">popStack</span><span class="p">();</span></div><div class='line' id='LC1499'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">source</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;if(&quot;</span> <span class="o">+</span> <span class="nx">local</span> <span class="o">+</span> <span class="s2">&quot; || &quot;</span> <span class="o">+</span> <span class="nx">local</span> <span class="o">+</span> <span class="s2">&quot; === 0) { &quot;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">appendToBuffer</span><span class="p">(</span><span class="nx">local</span><span class="p">)</span> <span class="o">+</span> <span class="s2">&quot; }&quot;</span><span class="p">);</span></div><div class='line' id='LC1500'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">environment</span><span class="p">.</span><span class="nx">isSimple</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1501'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">source</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;else { &quot;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">appendToBuffer</span><span class="p">(</span><span class="s2">&quot;&#39;&#39;&quot;</span><span class="p">)</span> <span class="o">+</span> <span class="s2">&quot; }&quot;</span><span class="p">);</span></div><div class='line' id='LC1502'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1503'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1504'><br/></div><div class='line' id='LC1505'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// [appendEscaped]</span></div><div class='line' id='LC1506'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1507'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, before: value, ...</span></div><div class='line' id='LC1508'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, after: ...</span></div><div class='line' id='LC1509'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1510'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Escape `value` and append it to the buffer</span></div><div class='line' id='LC1511'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">appendEscaped</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC1512'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">context</span><span class="p">.</span><span class="nx">aliases</span><span class="p">.</span><span class="nx">escapeExpression</span> <span class="o">=</span> <span class="s1">&#39;this.escapeExpression&#39;</span><span class="p">;</span></div><div class='line' id='LC1513'><br/></div><div class='line' id='LC1514'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">source</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">appendToBuffer</span><span class="p">(</span><span class="s2">&quot;escapeExpression(&quot;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">popStack</span><span class="p">()</span> <span class="o">+</span> <span class="s2">&quot;)&quot;</span><span class="p">));</span></div><div class='line' id='LC1515'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1516'><br/></div><div class='line' id='LC1517'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// [getContext]</span></div><div class='line' id='LC1518'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1519'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, before: ...</span></div><div class='line' id='LC1520'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, after: ...</span></div><div class='line' id='LC1521'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Compiler value, after: lastContext=depth</span></div><div class='line' id='LC1522'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1523'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Set the value of the `lastContext` compiler value to the depth</span></div><div class='line' id='LC1524'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">getContext</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">depth</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1525'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">lastContext</span> <span class="o">!==</span> <span class="nx">depth</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1526'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">lastContext</span> <span class="o">=</span> <span class="nx">depth</span><span class="p">;</span></div><div class='line' id='LC1527'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1528'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1529'><br/></div><div class='line' id='LC1530'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// [lookupOnContext]</span></div><div class='line' id='LC1531'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1532'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, before: ...</span></div><div class='line' id='LC1533'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, after: currentContext[name], ...</span></div><div class='line' id='LC1534'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1535'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Looks up the value of `name` on the current context and pushes</span></div><div class='line' id='LC1536'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// it onto the stack.</span></div><div class='line' id='LC1537'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">lookupOnContext</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1538'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">nameLookup</span><span class="p">(</span><span class="s1">&#39;depth&#39;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">lastContext</span><span class="p">,</span> <span class="nx">name</span><span class="p">,</span> <span class="s1">&#39;context&#39;</span><span class="p">));</span></div><div class='line' id='LC1539'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1540'><br/></div><div class='line' id='LC1541'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// [pushContext]</span></div><div class='line' id='LC1542'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1543'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, before: ...</span></div><div class='line' id='LC1544'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, after: currentContext, ...</span></div><div class='line' id='LC1545'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1546'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Pushes the value of the current context onto the stack.</span></div><div class='line' id='LC1547'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">pushContext</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC1548'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">pushStackLiteral</span><span class="p">(</span><span class="s1">&#39;depth&#39;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">lastContext</span><span class="p">);</span></div><div class='line' id='LC1549'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1550'><br/></div><div class='line' id='LC1551'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// [resolvePossibleLambda]</span></div><div class='line' id='LC1552'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1553'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, before: value, ...</span></div><div class='line' id='LC1554'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, after: resolved value, ...</span></div><div class='line' id='LC1555'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1556'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// If the `value` is a lambda, replace it on the stack by</span></div><div class='line' id='LC1557'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// the return value of the lambda</span></div><div class='line' id='LC1558'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">resolvePossibleLambda</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC1559'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">context</span><span class="p">.</span><span class="nx">aliases</span><span class="p">.</span><span class="nx">functionType</span> <span class="o">=</span> <span class="s1">&#39;&quot;function&quot;&#39;</span><span class="p">;</span></div><div class='line' id='LC1560'><br/></div><div class='line' id='LC1561'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">replaceStack</span><span class="p">(</span><span class="kd">function</span><span class="p">(</span><span class="nx">current</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1562'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="s2">&quot;typeof &quot;</span> <span class="o">+</span> <span class="nx">current</span> <span class="o">+</span> <span class="s2">&quot; === functionType ? &quot;</span> <span class="o">+</span> <span class="nx">current</span> <span class="o">+</span> <span class="s2">&quot;.apply(depth0) : &quot;</span> <span class="o">+</span> <span class="nx">current</span><span class="p">;</span></div><div class='line' id='LC1563'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">});</span></div><div class='line' id='LC1564'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1565'><br/></div><div class='line' id='LC1566'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// [lookup]</span></div><div class='line' id='LC1567'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1568'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, before: value, ...</span></div><div class='line' id='LC1569'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, after: value[name], ...</span></div><div class='line' id='LC1570'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1571'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Replace the value on the stack with the result of looking</span></div><div class='line' id='LC1572'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// up `name` on `value`</span></div><div class='line' id='LC1573'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">lookup</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1574'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">replaceStack</span><span class="p">(</span><span class="kd">function</span><span class="p">(</span><span class="nx">current</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1575'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">current</span> <span class="o">+</span> <span class="s2">&quot; == null || &quot;</span> <span class="o">+</span> <span class="nx">current</span> <span class="o">+</span> <span class="s2">&quot; === false ? &quot;</span> <span class="o">+</span> <span class="nx">current</span> <span class="o">+</span> <span class="s2">&quot; : &quot;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">nameLookup</span><span class="p">(</span><span class="nx">current</span><span class="p">,</span> <span class="nx">name</span><span class="p">,</span> <span class="s1">&#39;context&#39;</span><span class="p">);</span></div><div class='line' id='LC1576'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">});</span></div><div class='line' id='LC1577'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1578'><br/></div><div class='line' id='LC1579'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// [lookupData]</span></div><div class='line' id='LC1580'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1581'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, before: ...</span></div><div class='line' id='LC1582'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, after: data[id], ...</span></div><div class='line' id='LC1583'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1584'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Push the result of looking up `id` on the current data</span></div><div class='line' id='LC1585'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">lookupData</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">id</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1586'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">nameLookup</span><span class="p">(</span><span class="s1">&#39;data&#39;</span><span class="p">,</span> <span class="nx">id</span><span class="p">,</span> <span class="s1">&#39;data&#39;</span><span class="p">));</span></div><div class='line' id='LC1587'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1588'><br/></div><div class='line' id='LC1589'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// [pushStringParam]</span></div><div class='line' id='LC1590'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1591'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, before: ...</span></div><div class='line' id='LC1592'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, after: string, currentContext, ...</span></div><div class='line' id='LC1593'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1594'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// This opcode is designed for use in string mode, which</span></div><div class='line' id='LC1595'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// provides the string value of a parameter along with its</span></div><div class='line' id='LC1596'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// depth rather than resolving it immediately.</span></div><div class='line' id='LC1597'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">pushStringParam</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">string</span><span class="p">,</span> <span class="nx">type</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1598'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">pushStackLiteral</span><span class="p">(</span><span class="s1">&#39;depth&#39;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">lastContext</span><span class="p">);</span></div><div class='line' id='LC1599'><br/></div><div class='line' id='LC1600'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">pushString</span><span class="p">(</span><span class="nx">type</span><span class="p">);</span></div><div class='line' id='LC1601'><br/></div><div class='line' id='LC1602'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">typeof</span> <span class="nx">string</span> <span class="o">===</span> <span class="s1">&#39;string&#39;</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1603'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">pushString</span><span class="p">(</span><span class="nx">string</span><span class="p">);</span></div><div class='line' id='LC1604'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1605'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">pushStackLiteral</span><span class="p">(</span><span class="nx">string</span><span class="p">);</span></div><div class='line' id='LC1606'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1607'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1608'><br/></div><div class='line' id='LC1609'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">emptyHash</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC1610'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">pushStackLiteral</span><span class="p">(</span><span class="s1">&#39;{}&#39;</span><span class="p">);</span></div><div class='line' id='LC1611'><br/></div><div class='line' id='LC1612'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">stringParams</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1613'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">register</span><span class="p">(</span><span class="s1">&#39;hashTypes&#39;</span><span class="p">,</span> <span class="s1">&#39;{}&#39;</span><span class="p">);</span></div><div class='line' id='LC1614'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1615'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1616'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">pushHash</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC1617'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">hash</span> <span class="o">=</span> <span class="p">{</span><span class="nx">values</span><span class="o">:</span> <span class="p">[],</span> <span class="nx">types</span><span class="o">:</span> <span class="p">[]};</span></div><div class='line' id='LC1618'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1619'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">popHash</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC1620'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">hash</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">hash</span><span class="p">;</span></div><div class='line' id='LC1621'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">hash</span> <span class="o">=</span> <span class="kc">undefined</span><span class="p">;</span></div><div class='line' id='LC1622'><br/></div><div class='line' id='LC1623'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">stringParams</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1624'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">register</span><span class="p">(</span><span class="s1">&#39;hashTypes&#39;</span><span class="p">,</span> <span class="s1">&#39;{&#39;</span> <span class="o">+</span> <span class="nx">hash</span><span class="p">.</span><span class="nx">types</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="s1">&#39;,&#39;</span><span class="p">)</span> <span class="o">+</span> <span class="s1">&#39;}&#39;</span><span class="p">);</span></div><div class='line' id='LC1625'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1626'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s1">&#39;{\n    &#39;</span> <span class="o">+</span> <span class="nx">hash</span><span class="p">.</span><span class="nx">values</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="s1">&#39;,\n    &#39;</span><span class="p">)</span> <span class="o">+</span> <span class="s1">&#39;\n  }&#39;</span><span class="p">);</span></div><div class='line' id='LC1627'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1628'><br/></div><div class='line' id='LC1629'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// [pushString]</span></div><div class='line' id='LC1630'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1631'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, before: ...</span></div><div class='line' id='LC1632'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, after: quotedString(string), ...</span></div><div class='line' id='LC1633'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1634'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Push a quoted version of `string` onto the stack</span></div><div class='line' id='LC1635'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">pushString</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">string</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1636'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">pushStackLiteral</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">quotedString</span><span class="p">(</span><span class="nx">string</span><span class="p">));</span></div><div class='line' id='LC1637'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1638'><br/></div><div class='line' id='LC1639'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// [push]</span></div><div class='line' id='LC1640'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1641'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, before: ...</span></div><div class='line' id='LC1642'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, after: expr, ...</span></div><div class='line' id='LC1643'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1644'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Push an expression onto the stack</span></div><div class='line' id='LC1645'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">push</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">expr</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1646'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">inlineStack</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">expr</span><span class="p">);</span></div><div class='line' id='LC1647'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">expr</span><span class="p">;</span></div><div class='line' id='LC1648'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1649'><br/></div><div class='line' id='LC1650'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// [pushLiteral]</span></div><div class='line' id='LC1651'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1652'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, before: ...</span></div><div class='line' id='LC1653'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, after: value, ...</span></div><div class='line' id='LC1654'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1655'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Pushes a value onto the stack. This operation prevents</span></div><div class='line' id='LC1656'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// the compiler from creating a temporary variable to hold</span></div><div class='line' id='LC1657'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// it.</span></div><div class='line' id='LC1658'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">pushLiteral</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">value</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1659'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">pushStackLiteral</span><span class="p">(</span><span class="nx">value</span><span class="p">);</span></div><div class='line' id='LC1660'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1661'><br/></div><div class='line' id='LC1662'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// [pushProgram]</span></div><div class='line' id='LC1663'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1664'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, before: ...</span></div><div class='line' id='LC1665'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, after: program(guid), ...</span></div><div class='line' id='LC1666'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1667'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Push a program expression onto the stack. This takes</span></div><div class='line' id='LC1668'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// a compile-time guid and converts it into a runtime-accessible</span></div><div class='line' id='LC1669'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// expression.</span></div><div class='line' id='LC1670'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">pushProgram</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">guid</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1671'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">guid</span> <span class="o">!=</span> <span class="kc">null</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1672'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">pushStackLiteral</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">programExpression</span><span class="p">(</span><span class="nx">guid</span><span class="p">));</span></div><div class='line' id='LC1673'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1674'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">pushStackLiteral</span><span class="p">(</span><span class="kc">null</span><span class="p">);</span></div><div class='line' id='LC1675'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1676'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1677'><br/></div><div class='line' id='LC1678'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// [invokeHelper]</span></div><div class='line' id='LC1679'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1680'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, before: hash, inverse, program, params..., ...</span></div><div class='line' id='LC1681'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, after: result of helper invocation</span></div><div class='line' id='LC1682'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1683'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Pops off the helper&#39;s parameters, invokes the helper,</span></div><div class='line' id='LC1684'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// and pushes the helper&#39;s return value onto the stack.</span></div><div class='line' id='LC1685'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1686'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// If the helper is not found, `helperMissing` is called.</span></div><div class='line' id='LC1687'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">invokeHelper</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">paramSize</span><span class="p">,</span> <span class="nx">name</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1688'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">context</span><span class="p">.</span><span class="nx">aliases</span><span class="p">.</span><span class="nx">helperMissing</span> <span class="o">=</span> <span class="s1">&#39;helpers.helperMissing&#39;</span><span class="p">;</span></div><div class='line' id='LC1689'><br/></div><div class='line' id='LC1690'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">helper</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">lastHelper</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">setupHelper</span><span class="p">(</span><span class="nx">paramSize</span><span class="p">,</span> <span class="nx">name</span><span class="p">,</span> <span class="kc">true</span><span class="p">);</span></div><div class='line' id='LC1691'><br/></div><div class='line' id='LC1692'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">helper</span><span class="p">.</span><span class="nx">name</span><span class="p">);</span></div><div class='line' id='LC1693'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">replaceStack</span><span class="p">(</span><span class="kd">function</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1694'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">name</span> <span class="o">+</span> <span class="s1">&#39; ? &#39;</span> <span class="o">+</span> <span class="nx">name</span> <span class="o">+</span> <span class="s1">&#39;.call(&#39;</span> <span class="o">+</span></div><div class='line' id='LC1695'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">helper</span><span class="p">.</span><span class="nx">callParams</span> <span class="o">+</span> <span class="s2">&quot;) &quot;</span> <span class="o">+</span> <span class="s2">&quot;: helperMissing.call(&quot;</span> <span class="o">+</span></div><div class='line' id='LC1696'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">helper</span><span class="p">.</span><span class="nx">helperMissingParams</span> <span class="o">+</span> <span class="s2">&quot;)&quot;</span><span class="p">;</span></div><div class='line' id='LC1697'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">});</span></div><div class='line' id='LC1698'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1699'><br/></div><div class='line' id='LC1700'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// [invokeKnownHelper]</span></div><div class='line' id='LC1701'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1702'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, before: hash, inverse, program, params..., ...</span></div><div class='line' id='LC1703'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, after: result of helper invocation</span></div><div class='line' id='LC1704'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1705'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// This operation is used when the helper is known to exist,</span></div><div class='line' id='LC1706'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// so a `helperMissing` fallback is not required.</span></div><div class='line' id='LC1707'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">invokeKnownHelper</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">paramSize</span><span class="p">,</span> <span class="nx">name</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1708'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">helper</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">setupHelper</span><span class="p">(</span><span class="nx">paramSize</span><span class="p">,</span> <span class="nx">name</span><span class="p">);</span></div><div class='line' id='LC1709'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">helper</span><span class="p">.</span><span class="nx">name</span> <span class="o">+</span> <span class="s2">&quot;.call(&quot;</span> <span class="o">+</span> <span class="nx">helper</span><span class="p">.</span><span class="nx">callParams</span> <span class="o">+</span> <span class="s2">&quot;)&quot;</span><span class="p">);</span></div><div class='line' id='LC1710'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1711'><br/></div><div class='line' id='LC1712'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// [invokeAmbiguous]</span></div><div class='line' id='LC1713'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1714'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, before: hash, inverse, program, params..., ...</span></div><div class='line' id='LC1715'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, after: result of disambiguation</span></div><div class='line' id='LC1716'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1717'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// This operation is used when an expression like `{{foo}}`</span></div><div class='line' id='LC1718'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// is provided, but we don&#39;t know at compile-time whether it</span></div><div class='line' id='LC1719'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// is a helper or a path.</span></div><div class='line' id='LC1720'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1721'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// This operation emits more code than the other options,</span></div><div class='line' id='LC1722'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// and can be avoided by passing the `knownHelpers` and</span></div><div class='line' id='LC1723'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// `knownHelpersOnly` flags at compile-time.</span></div><div class='line' id='LC1724'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">invokeAmbiguous</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">name</span><span class="p">,</span> <span class="nx">helperCall</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1725'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">context</span><span class="p">.</span><span class="nx">aliases</span><span class="p">.</span><span class="nx">functionType</span> <span class="o">=</span> <span class="s1">&#39;&quot;function&quot;&#39;</span><span class="p">;</span></div><div class='line' id='LC1726'><br/></div><div class='line' id='LC1727'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">pushStackLiteral</span><span class="p">(</span><span class="s1">&#39;{}&#39;</span><span class="p">);</span>    <span class="c1">// Hash value</span></div><div class='line' id='LC1728'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">helper</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">setupHelper</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span> <span class="nx">name</span><span class="p">,</span> <span class="nx">helperCall</span><span class="p">);</span></div><div class='line' id='LC1729'><br/></div><div class='line' id='LC1730'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">helperName</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">lastHelper</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">nameLookup</span><span class="p">(</span><span class="s1">&#39;helpers&#39;</span><span class="p">,</span> <span class="nx">name</span><span class="p">,</span> <span class="s1">&#39;helper&#39;</span><span class="p">);</span></div><div class='line' id='LC1731'><br/></div><div class='line' id='LC1732'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">nonHelper</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">nameLookup</span><span class="p">(</span><span class="s1">&#39;depth&#39;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">lastContext</span><span class="p">,</span> <span class="nx">name</span><span class="p">,</span> <span class="s1">&#39;context&#39;</span><span class="p">);</span></div><div class='line' id='LC1733'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">nextStack</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">nextStack</span><span class="p">();</span></div><div class='line' id='LC1734'><br/></div><div class='line' id='LC1735'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">source</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s1">&#39;if (&#39;</span> <span class="o">+</span> <span class="nx">nextStack</span> <span class="o">+</span> <span class="s1">&#39; = &#39;</span> <span class="o">+</span> <span class="nx">helperName</span> <span class="o">+</span> <span class="s1">&#39;) { &#39;</span> <span class="o">+</span> <span class="nx">nextStack</span> <span class="o">+</span> <span class="s1">&#39; = &#39;</span> <span class="o">+</span> <span class="nx">nextStack</span> <span class="o">+</span> <span class="s1">&#39;.call(&#39;</span> <span class="o">+</span> <span class="nx">helper</span><span class="p">.</span><span class="nx">callParams</span> <span class="o">+</span> <span class="s1">&#39;); }&#39;</span><span class="p">);</span></div><div class='line' id='LC1736'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">source</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s1">&#39;else { &#39;</span> <span class="o">+</span> <span class="nx">nextStack</span> <span class="o">+</span> <span class="s1">&#39; = &#39;</span> <span class="o">+</span> <span class="nx">nonHelper</span> <span class="o">+</span> <span class="s1">&#39;; &#39;</span> <span class="o">+</span> <span class="nx">nextStack</span> <span class="o">+</span> <span class="s1">&#39; = typeof &#39;</span> <span class="o">+</span> <span class="nx">nextStack</span> <span class="o">+</span> <span class="s1">&#39; === functionType ? &#39;</span> <span class="o">+</span> <span class="nx">nextStack</span> <span class="o">+</span> <span class="s1">&#39;.apply(depth0) : &#39;</span> <span class="o">+</span> <span class="nx">nextStack</span> <span class="o">+</span> <span class="s1">&#39;; }&#39;</span><span class="p">);</span></div><div class='line' id='LC1737'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1738'><br/></div><div class='line' id='LC1739'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// [invokePartial]</span></div><div class='line' id='LC1740'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1741'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, before: context, ...</span></div><div class='line' id='LC1742'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack after: result of partial invocation</span></div><div class='line' id='LC1743'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1744'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// This operation pops off a context, invokes a partial with that context,</span></div><div class='line' id='LC1745'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// and pushes the result of the invocation back.</span></div><div class='line' id='LC1746'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">invokePartial</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1747'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">params</span> <span class="o">=</span> <span class="p">[</span><span class="k">this</span><span class="p">.</span><span class="nx">nameLookup</span><span class="p">(</span><span class="s1">&#39;partials&#39;</span><span class="p">,</span> <span class="nx">name</span><span class="p">,</span> <span class="s1">&#39;partial&#39;</span><span class="p">),</span> <span class="s2">&quot;&#39;&quot;</span> <span class="o">+</span> <span class="nx">name</span> <span class="o">+</span> <span class="s2">&quot;&#39;&quot;</span><span class="p">,</span> <span class="k">this</span><span class="p">.</span><span class="nx">popStack</span><span class="p">(),</span> <span class="s2">&quot;helpers&quot;</span><span class="p">,</span> <span class="s2">&quot;partials&quot;</span><span class="p">];</span></div><div class='line' id='LC1748'><br/></div><div class='line' id='LC1749'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">data</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1750'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">params</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;data&quot;</span><span class="p">);</span></div><div class='line' id='LC1751'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1752'><br/></div><div class='line' id='LC1753'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">context</span><span class="p">.</span><span class="nx">aliases</span><span class="p">.</span><span class="nx">self</span> <span class="o">=</span> <span class="s2">&quot;this&quot;</span><span class="p">;</span></div><div class='line' id='LC1754'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;self.invokePartial(&quot;</span> <span class="o">+</span> <span class="nx">params</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="s2">&quot;, &quot;</span><span class="p">)</span> <span class="o">+</span> <span class="s2">&quot;)&quot;</span><span class="p">);</span></div><div class='line' id='LC1755'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1756'><br/></div><div class='line' id='LC1757'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// [assignToHash]</span></div><div class='line' id='LC1758'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1759'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, before: value, hash, ...</span></div><div class='line' id='LC1760'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// On stack, after: hash, ...</span></div><div class='line' id='LC1761'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">//</span></div><div class='line' id='LC1762'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Pops a value and hash off the stack, assigns `hash[key] = value`</span></div><div class='line' id='LC1763'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// and pushes the hash back onto the stack.</span></div><div class='line' id='LC1764'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">assignToHash</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">key</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1765'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">value</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">popStack</span><span class="p">(),</span></div><div class='line' id='LC1766'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">type</span><span class="p">;</span></div><div class='line' id='LC1767'><br/></div><div class='line' id='LC1768'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">stringParams</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1769'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">type</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">popStack</span><span class="p">();</span></div><div class='line' id='LC1770'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">popStack</span><span class="p">();</span></div><div class='line' id='LC1771'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1772'><br/></div><div class='line' id='LC1773'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">hash</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">hash</span><span class="p">;</span></div><div class='line' id='LC1774'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">type</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1775'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">hash</span><span class="p">.</span><span class="nx">types</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;&#39;&quot;</span> <span class="o">+</span> <span class="nx">key</span> <span class="o">+</span> <span class="s2">&quot;&#39;: &quot;</span> <span class="o">+</span> <span class="nx">type</span><span class="p">);</span></div><div class='line' id='LC1776'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1777'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">hash</span><span class="p">.</span><span class="nx">values</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;&#39;&quot;</span> <span class="o">+</span> <span class="nx">key</span> <span class="o">+</span> <span class="s2">&quot;&#39;: (&quot;</span> <span class="o">+</span> <span class="nx">value</span> <span class="o">+</span> <span class="s2">&quot;)&quot;</span><span class="p">);</span></div><div class='line' id='LC1778'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1779'><br/></div><div class='line' id='LC1780'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// HELPERS</span></div><div class='line' id='LC1781'><br/></div><div class='line' id='LC1782'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">compiler</span><span class="o">:</span> <span class="nx">JavaScriptCompiler</span><span class="p">,</span></div><div class='line' id='LC1783'><br/></div><div class='line' id='LC1784'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">compileChildren</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">environment</span><span class="p">,</span> <span class="nx">options</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1785'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">children</span> <span class="o">=</span> <span class="nx">environment</span><span class="p">.</span><span class="nx">children</span><span class="p">,</span> <span class="nx">child</span><span class="p">,</span> <span class="nx">compiler</span><span class="p">;</span></div><div class='line' id='LC1786'><br/></div><div class='line' id='LC1787'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span><span class="p">(</span><span class="kd">var</span> <span class="nx">i</span><span class="o">=</span><span class="mi">0</span><span class="p">,</span> <span class="nx">l</span><span class="o">=</span><span class="nx">children</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span><span class="o">&lt;</span><span class="nx">l</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1788'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">child</span> <span class="o">=</span> <span class="nx">children</span><span class="p">[</span><span class="nx">i</span><span class="p">];</span></div><div class='line' id='LC1789'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">compiler</span> <span class="o">=</span> <span class="k">new</span> <span class="k">this</span><span class="p">.</span><span class="nx">compiler</span><span class="p">();</span></div><div class='line' id='LC1790'><br/></div><div class='line' id='LC1791'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">index</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">matchExistingProgram</span><span class="p">(</span><span class="nx">child</span><span class="p">);</span></div><div class='line' id='LC1792'><br/></div><div class='line' id='LC1793'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">index</span> <span class="o">==</span> <span class="kc">null</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1794'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">context</span><span class="p">.</span><span class="nx">programs</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s1">&#39;&#39;</span><span class="p">);</span>     <span class="c1">// Placeholder to prevent name conflicts for nested children</span></div><div class='line' id='LC1795'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">index</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">context</span><span class="p">.</span><span class="nx">programs</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span></div><div class='line' id='LC1796'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">child</span><span class="p">.</span><span class="nx">index</span> <span class="o">=</span> <span class="nx">index</span><span class="p">;</span></div><div class='line' id='LC1797'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">child</span><span class="p">.</span><span class="nx">name</span> <span class="o">=</span> <span class="s1">&#39;program&#39;</span> <span class="o">+</span> <span class="nx">index</span><span class="p">;</span></div><div class='line' id='LC1798'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">context</span><span class="p">.</span><span class="nx">programs</span><span class="p">[</span><span class="nx">index</span><span class="p">]</span> <span class="o">=</span> <span class="nx">compiler</span><span class="p">.</span><span class="nx">compile</span><span class="p">(</span><span class="nx">child</span><span class="p">,</span> <span class="nx">options</span><span class="p">,</span> <span class="k">this</span><span class="p">.</span><span class="nx">context</span><span class="p">);</span></div><div class='line' id='LC1799'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">context</span><span class="p">.</span><span class="nx">environments</span><span class="p">[</span><span class="nx">index</span><span class="p">]</span> <span class="o">=</span> <span class="nx">child</span><span class="p">;</span></div><div class='line' id='LC1800'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1801'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">child</span><span class="p">.</span><span class="nx">index</span> <span class="o">=</span> <span class="nx">index</span><span class="p">;</span></div><div class='line' id='LC1802'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">child</span><span class="p">.</span><span class="nx">name</span> <span class="o">=</span> <span class="s1">&#39;program&#39;</span> <span class="o">+</span> <span class="nx">index</span><span class="p">;</span></div><div class='line' id='LC1803'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1804'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1805'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1806'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">matchExistingProgram</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">child</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1807'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span> <span class="p">(</span><span class="kd">var</span> <span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">len</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">context</span><span class="p">.</span><span class="nx">environments</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span> <span class="o">&lt;</span> <span class="nx">len</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1808'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">environment</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">context</span><span class="p">.</span><span class="nx">environments</span><span class="p">[</span><span class="nx">i</span><span class="p">];</span></div><div class='line' id='LC1809'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">environment</span> <span class="o">&amp;&amp;</span> <span class="nx">environment</span><span class="p">.</span><span class="nx">equals</span><span class="p">(</span><span class="nx">child</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC1810'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">i</span><span class="p">;</span></div><div class='line' id='LC1811'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1812'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1813'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1814'><br/></div><div class='line' id='LC1815'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">programExpression</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">guid</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1816'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">context</span><span class="p">.</span><span class="nx">aliases</span><span class="p">.</span><span class="nx">self</span> <span class="o">=</span> <span class="s2">&quot;this&quot;</span><span class="p">;</span></div><div class='line' id='LC1817'><br/></div><div class='line' id='LC1818'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">guid</span> <span class="o">==</span> <span class="kc">null</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1819'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="s2">&quot;self.noop&quot;</span><span class="p">;</span></div><div class='line' id='LC1820'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1821'><br/></div><div class='line' id='LC1822'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">child</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">environment</span><span class="p">.</span><span class="nx">children</span><span class="p">[</span><span class="nx">guid</span><span class="p">],</span></div><div class='line' id='LC1823'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">depths</span> <span class="o">=</span> <span class="nx">child</span><span class="p">.</span><span class="nx">depths</span><span class="p">.</span><span class="nx">list</span><span class="p">,</span> <span class="nx">depth</span><span class="p">;</span></div><div class='line' id='LC1824'><br/></div><div class='line' id='LC1825'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">programParams</span> <span class="o">=</span> <span class="p">[</span><span class="nx">child</span><span class="p">.</span><span class="nx">index</span><span class="p">,</span> <span class="nx">child</span><span class="p">.</span><span class="nx">name</span><span class="p">,</span> <span class="s2">&quot;data&quot;</span><span class="p">];</span></div><div class='line' id='LC1826'><br/></div><div class='line' id='LC1827'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span><span class="p">(</span><span class="kd">var</span> <span class="nx">i</span><span class="o">=</span><span class="mi">0</span><span class="p">,</span> <span class="nx">l</span> <span class="o">=</span> <span class="nx">depths</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span><span class="o">&lt;</span><span class="nx">l</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1828'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">depth</span> <span class="o">=</span> <span class="nx">depths</span><span class="p">[</span><span class="nx">i</span><span class="p">];</span></div><div class='line' id='LC1829'><br/></div><div class='line' id='LC1830'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">depth</span> <span class="o">===</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span> <span class="nx">programParams</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;depth0&quot;</span><span class="p">);</span> <span class="p">}</span></div><div class='line' id='LC1831'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">else</span> <span class="p">{</span> <span class="nx">programParams</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;depth&quot;</span> <span class="o">+</span> <span class="p">(</span><span class="nx">depth</span> <span class="o">-</span> <span class="mi">1</span><span class="p">));</span> <span class="p">}</span></div><div class='line' id='LC1832'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1833'><br/></div><div class='line' id='LC1834'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">depths</span><span class="p">.</span><span class="nx">length</span> <span class="o">===</span> <span class="mi">0</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1835'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="s2">&quot;self.program(&quot;</span> <span class="o">+</span> <span class="nx">programParams</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="s2">&quot;, &quot;</span><span class="p">)</span> <span class="o">+</span> <span class="s2">&quot;)&quot;</span><span class="p">;</span></div><div class='line' id='LC1836'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1837'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">programParams</span><span class="p">.</span><span class="nx">shift</span><span class="p">();</span></div><div class='line' id='LC1838'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="s2">&quot;self.programWithDepth(&quot;</span> <span class="o">+</span> <span class="nx">programParams</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="s2">&quot;, &quot;</span><span class="p">)</span> <span class="o">+</span> <span class="s2">&quot;)&quot;</span><span class="p">;</span></div><div class='line' id='LC1839'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1840'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1841'><br/></div><div class='line' id='LC1842'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">register</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">name</span><span class="p">,</span> <span class="nx">val</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1843'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">useRegister</span><span class="p">(</span><span class="nx">name</span><span class="p">);</span></div><div class='line' id='LC1844'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">source</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">name</span> <span class="o">+</span> <span class="s2">&quot; = &quot;</span> <span class="o">+</span> <span class="nx">val</span> <span class="o">+</span> <span class="s2">&quot;;&quot;</span><span class="p">);</span></div><div class='line' id='LC1845'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1846'><br/></div><div class='line' id='LC1847'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">useRegister</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1848'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="o">!</span><span class="k">this</span><span class="p">.</span><span class="nx">registers</span><span class="p">[</span><span class="nx">name</span><span class="p">])</span> <span class="p">{</span></div><div class='line' id='LC1849'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">registers</span><span class="p">[</span><span class="nx">name</span><span class="p">]</span> <span class="o">=</span> <span class="kc">true</span><span class="p">;</span></div><div class='line' id='LC1850'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">registers</span><span class="p">.</span><span class="nx">list</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">name</span><span class="p">);</span></div><div class='line' id='LC1851'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1852'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1853'><br/></div><div class='line' id='LC1854'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">pushStackLiteral</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">item</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1855'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="k">new</span> <span class="nx">Literal</span><span class="p">(</span><span class="nx">item</span><span class="p">));</span></div><div class='line' id='LC1856'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1857'><br/></div><div class='line' id='LC1858'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">pushStack</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">item</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1859'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">flushInline</span><span class="p">();</span></div><div class='line' id='LC1860'><br/></div><div class='line' id='LC1861'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">stack</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">incrStack</span><span class="p">();</span></div><div class='line' id='LC1862'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">item</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1863'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">source</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">stack</span> <span class="o">+</span> <span class="s2">&quot; = &quot;</span> <span class="o">+</span> <span class="nx">item</span> <span class="o">+</span> <span class="s2">&quot;;&quot;</span><span class="p">);</span></div><div class='line' id='LC1864'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1865'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">compileStack</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">stack</span><span class="p">);</span></div><div class='line' id='LC1866'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">stack</span><span class="p">;</span></div><div class='line' id='LC1867'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1868'><br/></div><div class='line' id='LC1869'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">replaceStack</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">callback</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1870'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">prefix</span> <span class="o">=</span> <span class="s1">&#39;&#39;</span><span class="p">,</span></div><div class='line' id='LC1871'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">inline</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">isInline</span><span class="p">(),</span></div><div class='line' id='LC1872'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">stack</span><span class="p">;</span></div><div class='line' id='LC1873'><br/></div><div class='line' id='LC1874'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// If we are currently inline then we want to merge the inline statement into the</span></div><div class='line' id='LC1875'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// replacement statement via &#39;,&#39;</span></div><div class='line' id='LC1876'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">inline</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1877'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">top</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">popStack</span><span class="p">(</span><span class="kc">true</span><span class="p">);</span></div><div class='line' id='LC1878'><br/></div><div class='line' id='LC1879'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">top</span> <span class="k">instanceof</span> <span class="nx">Literal</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1880'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Literals do not need to be inlined</span></div><div class='line' id='LC1881'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">stack</span> <span class="o">=</span> <span class="nx">top</span><span class="p">.</span><span class="nx">value</span><span class="p">;</span></div><div class='line' id='LC1882'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1883'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Get or create the current stack name for use by the inline</span></div><div class='line' id='LC1884'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">name</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">stackSlot</span> <span class="o">?</span> <span class="k">this</span><span class="p">.</span><span class="nx">topStackName</span><span class="p">()</span> <span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">incrStack</span><span class="p">();</span></div><div class='line' id='LC1885'><br/></div><div class='line' id='LC1886'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">prefix</span> <span class="o">=</span> <span class="s1">&#39;(&#39;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span> <span class="o">+</span> <span class="s1">&#39; = &#39;</span> <span class="o">+</span> <span class="nx">top</span> <span class="o">+</span> <span class="s1">&#39;),&#39;</span><span class="p">;</span></div><div class='line' id='LC1887'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">stack</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">topStack</span><span class="p">();</span></div><div class='line' id='LC1888'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1889'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1890'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">stack</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">topStack</span><span class="p">();</span></div><div class='line' id='LC1891'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1892'><br/></div><div class='line' id='LC1893'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">item</span> <span class="o">=</span> <span class="nx">callback</span><span class="p">.</span><span class="nx">call</span><span class="p">(</span><span class="k">this</span><span class="p">,</span> <span class="nx">stack</span><span class="p">);</span></div><div class='line' id='LC1894'><br/></div><div class='line' id='LC1895'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">inline</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1896'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">inlineStack</span><span class="p">.</span><span class="nx">length</span> <span class="o">||</span> <span class="k">this</span><span class="p">.</span><span class="nx">compileStack</span><span class="p">.</span><span class="nx">length</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1897'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">popStack</span><span class="p">();</span></div><div class='line' id='LC1898'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1899'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s1">&#39;(&#39;</span> <span class="o">+</span> <span class="nx">prefix</span> <span class="o">+</span> <span class="nx">item</span> <span class="o">+</span> <span class="s1">&#39;)&#39;</span><span class="p">);</span></div><div class='line' id='LC1900'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1901'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Prevent modification of the context depth variable. Through replaceStack</span></div><div class='line' id='LC1902'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="sr">/^stack/</span><span class="p">.</span><span class="nx">test</span><span class="p">(</span><span class="nx">stack</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC1903'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">stack</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">nextStack</span><span class="p">();</span></div><div class='line' id='LC1904'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1905'><br/></div><div class='line' id='LC1906'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">source</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">stack</span> <span class="o">+</span> <span class="s2">&quot; = (&quot;</span> <span class="o">+</span> <span class="nx">prefix</span> <span class="o">+</span> <span class="nx">item</span> <span class="o">+</span> <span class="s2">&quot;);&quot;</span><span class="p">);</span></div><div class='line' id='LC1907'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1908'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">stack</span><span class="p">;</span></div><div class='line' id='LC1909'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1910'><br/></div><div class='line' id='LC1911'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">nextStack</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC1912'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">.</span><span class="nx">pushStack</span><span class="p">();</span></div><div class='line' id='LC1913'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1914'><br/></div><div class='line' id='LC1915'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">incrStack</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC1916'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">stackSlot</span><span class="o">++</span><span class="p">;</span></div><div class='line' id='LC1917'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">stackSlot</span> <span class="o">&gt;</span> <span class="k">this</span><span class="p">.</span><span class="nx">stackVars</span><span class="p">.</span><span class="nx">length</span><span class="p">)</span> <span class="p">{</span> <span class="k">this</span><span class="p">.</span><span class="nx">stackVars</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;stack&quot;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">stackSlot</span><span class="p">);</span> <span class="p">}</span></div><div class='line' id='LC1918'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">.</span><span class="nx">topStackName</span><span class="p">();</span></div><div class='line' id='LC1919'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1920'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">topStackName</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC1921'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="s2">&quot;stack&quot;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">stackSlot</span><span class="p">;</span></div><div class='line' id='LC1922'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1923'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">flushInline</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC1924'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">inlineStack</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">inlineStack</span><span class="p">;</span></div><div class='line' id='LC1925'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">inlineStack</span><span class="p">.</span><span class="nx">length</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1926'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">inlineStack</span> <span class="o">=</span> <span class="p">[];</span></div><div class='line' id='LC1927'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span> <span class="p">(</span><span class="kd">var</span> <span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">len</span> <span class="o">=</span> <span class="nx">inlineStack</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span> <span class="o">&lt;</span> <span class="nx">len</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1928'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">entry</span> <span class="o">=</span> <span class="nx">inlineStack</span><span class="p">[</span><span class="nx">i</span><span class="p">];</span></div><div class='line' id='LC1929'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">entry</span> <span class="k">instanceof</span> <span class="nx">Literal</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1930'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">compileStack</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">entry</span><span class="p">);</span></div><div class='line' id='LC1931'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1932'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">pushStack</span><span class="p">(</span><span class="nx">entry</span><span class="p">);</span></div><div class='line' id='LC1933'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1934'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1935'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1936'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1937'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">isInline</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC1938'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="k">this</span><span class="p">.</span><span class="nx">inlineStack</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span></div><div class='line' id='LC1939'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1940'><br/></div><div class='line' id='LC1941'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">popStack</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">wrapped</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1942'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">inline</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">isInline</span><span class="p">(),</span></div><div class='line' id='LC1943'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">item</span> <span class="o">=</span> <span class="p">(</span><span class="nx">inline</span> <span class="o">?</span> <span class="k">this</span><span class="p">.</span><span class="nx">inlineStack</span> <span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">compileStack</span><span class="p">).</span><span class="nx">pop</span><span class="p">();</span></div><div class='line' id='LC1944'><br/></div><div class='line' id='LC1945'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">wrapped</span> <span class="o">&amp;&amp;</span> <span class="p">(</span><span class="nx">item</span> <span class="k">instanceof</span> <span class="nx">Literal</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC1946'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">item</span><span class="p">.</span><span class="nx">value</span><span class="p">;</span></div><div class='line' id='LC1947'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1948'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">inline</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1949'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">stackSlot</span><span class="o">--</span><span class="p">;</span></div><div class='line' id='LC1950'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1951'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">item</span><span class="p">;</span></div><div class='line' id='LC1952'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1953'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1954'><br/></div><div class='line' id='LC1955'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">topStack</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">wrapped</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1956'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">stack</span> <span class="o">=</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">isInline</span><span class="p">()</span> <span class="o">?</span> <span class="k">this</span><span class="p">.</span><span class="nx">inlineStack</span> <span class="o">:</span> <span class="k">this</span><span class="p">.</span><span class="nx">compileStack</span><span class="p">),</span></div><div class='line' id='LC1957'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">item</span> <span class="o">=</span> <span class="nx">stack</span><span class="p">[</span><span class="nx">stack</span><span class="p">.</span><span class="nx">length</span> <span class="o">-</span> <span class="mi">1</span><span class="p">];</span></div><div class='line' id='LC1958'><br/></div><div class='line' id='LC1959'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">wrapped</span> <span class="o">&amp;&amp;</span> <span class="p">(</span><span class="nx">item</span> <span class="k">instanceof</span> <span class="nx">Literal</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC1960'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">item</span><span class="p">.</span><span class="nx">value</span><span class="p">;</span></div><div class='line' id='LC1961'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC1962'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">item</span><span class="p">;</span></div><div class='line' id='LC1963'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC1964'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1965'><br/></div><div class='line' id='LC1966'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">quotedString</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">str</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1967'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="s1">&#39;&quot;&#39;</span> <span class="o">+</span> <span class="nx">str</span></div><div class='line' id='LC1968'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">.</span><span class="nx">replace</span><span class="p">(</span><span class="sr">/\\/g</span><span class="p">,</span> <span class="s1">&#39;\\\\&#39;</span><span class="p">)</span></div><div class='line' id='LC1969'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">.</span><span class="nx">replace</span><span class="p">(</span><span class="sr">/&quot;/g</span><span class="p">,</span> <span class="s1">&#39;\\&quot;&#39;</span><span class="p">)</span></div><div class='line' id='LC1970'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">.</span><span class="nx">replace</span><span class="p">(</span><span class="sr">/\n/g</span><span class="p">,</span> <span class="s1">&#39;\\n&#39;</span><span class="p">)</span></div><div class='line' id='LC1971'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">.</span><span class="nx">replace</span><span class="p">(</span><span class="sr">/\r/g</span><span class="p">,</span> <span class="s1">&#39;\\r&#39;</span><span class="p">)</span> <span class="o">+</span> <span class="s1">&#39;&quot;&#39;</span><span class="p">;</span></div><div class='line' id='LC1972'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1973'><br/></div><div class='line' id='LC1974'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">setupHelper</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">paramSize</span><span class="p">,</span> <span class="nx">name</span><span class="p">,</span> <span class="nx">missingParams</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1975'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">params</span> <span class="o">=</span> <span class="p">[];</span></div><div class='line' id='LC1976'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">setupParams</span><span class="p">(</span><span class="nx">paramSize</span><span class="p">,</span> <span class="nx">params</span><span class="p">,</span> <span class="nx">missingParams</span><span class="p">);</span></div><div class='line' id='LC1977'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">foundHelper</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">nameLookup</span><span class="p">(</span><span class="s1">&#39;helpers&#39;</span><span class="p">,</span> <span class="nx">name</span><span class="p">,</span> <span class="s1">&#39;helper&#39;</span><span class="p">);</span></div><div class='line' id='LC1978'><br/></div><div class='line' id='LC1979'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="p">{</span></div><div class='line' id='LC1980'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">params</span><span class="o">:</span> <span class="nx">params</span><span class="p">,</span></div><div class='line' id='LC1981'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">name</span><span class="o">:</span> <span class="nx">foundHelper</span><span class="p">,</span></div><div class='line' id='LC1982'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">callParams</span><span class="o">:</span> <span class="p">[</span><span class="s2">&quot;depth0&quot;</span><span class="p">].</span><span class="nx">concat</span><span class="p">(</span><span class="nx">params</span><span class="p">).</span><span class="nx">join</span><span class="p">(</span><span class="s2">&quot;, &quot;</span><span class="p">),</span></div><div class='line' id='LC1983'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">helperMissingParams</span><span class="o">:</span> <span class="nx">missingParams</span> <span class="o">&amp;&amp;</span> <span class="p">[</span><span class="s2">&quot;depth0&quot;</span><span class="p">,</span> <span class="k">this</span><span class="p">.</span><span class="nx">quotedString</span><span class="p">(</span><span class="nx">name</span><span class="p">)].</span><span class="nx">concat</span><span class="p">(</span><span class="nx">params</span><span class="p">).</span><span class="nx">join</span><span class="p">(</span><span class="s2">&quot;, &quot;</span><span class="p">)</span></div><div class='line' id='LC1984'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC1985'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC1986'><br/></div><div class='line' id='LC1987'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// the params and contexts arguments are passed in arrays</span></div><div class='line' id='LC1988'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// to fill in</span></div><div class='line' id='LC1989'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">setupParams</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">paramSize</span><span class="p">,</span> <span class="nx">params</span><span class="p">,</span> <span class="nx">useRegister</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC1990'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">options</span> <span class="o">=</span> <span class="p">[],</span> <span class="nx">contexts</span> <span class="o">=</span> <span class="p">[],</span> <span class="nx">types</span> <span class="o">=</span> <span class="p">[],</span> <span class="nx">param</span><span class="p">,</span> <span class="nx">inverse</span><span class="p">,</span> <span class="nx">program</span><span class="p">;</span></div><div class='line' id='LC1991'><br/></div><div class='line' id='LC1992'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">options</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;hash:&quot;</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">popStack</span><span class="p">());</span></div><div class='line' id='LC1993'><br/></div><div class='line' id='LC1994'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">inverse</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">popStack</span><span class="p">();</span></div><div class='line' id='LC1995'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">program</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">popStack</span><span class="p">();</span></div><div class='line' id='LC1996'><br/></div><div class='line' id='LC1997'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Avoid setting fn and inverse if neither are set. This allows</span></div><div class='line' id='LC1998'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// helpers to do a check for `if (options.fn)`</span></div><div class='line' id='LC1999'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">program</span> <span class="o">||</span> <span class="nx">inverse</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2000'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">program</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2001'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">context</span><span class="p">.</span><span class="nx">aliases</span><span class="p">.</span><span class="nx">self</span> <span class="o">=</span> <span class="s2">&quot;this&quot;</span><span class="p">;</span></div><div class='line' id='LC2002'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">program</span> <span class="o">=</span> <span class="s2">&quot;self.noop&quot;</span><span class="p">;</span></div><div class='line' id='LC2003'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2004'><br/></div><div class='line' id='LC2005'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">inverse</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2006'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">context</span><span class="p">.</span><span class="nx">aliases</span><span class="p">.</span><span class="nx">self</span> <span class="o">=</span> <span class="s2">&quot;this&quot;</span><span class="p">;</span></div><div class='line' id='LC2007'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">inverse</span> <span class="o">=</span> <span class="s2">&quot;self.noop&quot;</span><span class="p">;</span></div><div class='line' id='LC2008'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2009'><br/></div><div class='line' id='LC2010'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">options</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;inverse:&quot;</span> <span class="o">+</span> <span class="nx">inverse</span><span class="p">);</span></div><div class='line' id='LC2011'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">options</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;fn:&quot;</span> <span class="o">+</span> <span class="nx">program</span><span class="p">);</span></div><div class='line' id='LC2012'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2013'><br/></div><div class='line' id='LC2014'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">for</span><span class="p">(</span><span class="kd">var</span> <span class="nx">i</span><span class="o">=</span><span class="mi">0</span><span class="p">;</span> <span class="nx">i</span><span class="o">&lt;</span><span class="nx">paramSize</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2015'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">param</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">popStack</span><span class="p">();</span></div><div class='line' id='LC2016'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">params</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">param</span><span class="p">);</span></div><div class='line' id='LC2017'><br/></div><div class='line' id='LC2018'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">stringParams</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2019'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">types</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">popStack</span><span class="p">());</span></div><div class='line' id='LC2020'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">contexts</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">popStack</span><span class="p">());</span></div><div class='line' id='LC2021'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2022'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2023'><br/></div><div class='line' id='LC2024'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">stringParams</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2025'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">options</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;contexts:[&quot;</span> <span class="o">+</span> <span class="nx">contexts</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="s2">&quot;,&quot;</span><span class="p">)</span> <span class="o">+</span> <span class="s2">&quot;]&quot;</span><span class="p">);</span></div><div class='line' id='LC2026'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">options</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;types:[&quot;</span> <span class="o">+</span> <span class="nx">types</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="s2">&quot;,&quot;</span><span class="p">)</span> <span class="o">+</span> <span class="s2">&quot;]&quot;</span><span class="p">);</span></div><div class='line' id='LC2027'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">options</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;hashTypes:hashTypes&quot;</span><span class="p">);</span></div><div class='line' id='LC2028'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2029'><br/></div><div class='line' id='LC2030'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">options</span><span class="p">.</span><span class="nx">data</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2031'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">options</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s2">&quot;data:data&quot;</span><span class="p">);</span></div><div class='line' id='LC2032'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2033'><br/></div><div class='line' id='LC2034'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">options</span> <span class="o">=</span> <span class="s2">&quot;{&quot;</span> <span class="o">+</span> <span class="nx">options</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="s2">&quot;,&quot;</span><span class="p">)</span> <span class="o">+</span> <span class="s2">&quot;}&quot;</span><span class="p">;</span></div><div class='line' id='LC2035'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">useRegister</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2036'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">this</span><span class="p">.</span><span class="nx">register</span><span class="p">(</span><span class="s1">&#39;options&#39;</span><span class="p">,</span> <span class="nx">options</span><span class="p">);</span></div><div class='line' id='LC2037'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">params</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="s1">&#39;options&#39;</span><span class="p">);</span></div><div class='line' id='LC2038'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC2039'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">params</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">options</span><span class="p">);</span></div><div class='line' id='LC2040'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2041'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">params</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="s2">&quot;, &quot;</span><span class="p">);</span></div><div class='line' id='LC2042'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2043'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC2044'><br/></div><div class='line' id='LC2045'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">reservedWords</span> <span class="o">=</span> <span class="p">(</span></div><div class='line' id='LC2046'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot;break else new var&quot;</span> <span class="o">+</span></div><div class='line' id='LC2047'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot; case finally return void&quot;</span> <span class="o">+</span></div><div class='line' id='LC2048'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot; catch for switch while&quot;</span> <span class="o">+</span></div><div class='line' id='LC2049'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot; continue function this with&quot;</span> <span class="o">+</span></div><div class='line' id='LC2050'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot; default if throw&quot;</span> <span class="o">+</span></div><div class='line' id='LC2051'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot; delete in try&quot;</span> <span class="o">+</span></div><div class='line' id='LC2052'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot; do instanceof typeof&quot;</span> <span class="o">+</span></div><div class='line' id='LC2053'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot; abstract enum int short&quot;</span> <span class="o">+</span></div><div class='line' id='LC2054'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot; boolean export interface static&quot;</span> <span class="o">+</span></div><div class='line' id='LC2055'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot; byte extends long super&quot;</span> <span class="o">+</span></div><div class='line' id='LC2056'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot; char final native synchronized&quot;</span> <span class="o">+</span></div><div class='line' id='LC2057'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot; class float package throws&quot;</span> <span class="o">+</span></div><div class='line' id='LC2058'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot; const goto private transient&quot;</span> <span class="o">+</span></div><div class='line' id='LC2059'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot; debugger implements protected volatile&quot;</span> <span class="o">+</span></div><div class='line' id='LC2060'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot; double import public let yield&quot;</span></div><div class='line' id='LC2061'>&nbsp;&nbsp;<span class="p">).</span><span class="nx">split</span><span class="p">(</span><span class="s2">&quot; &quot;</span><span class="p">);</span></div><div class='line' id='LC2062'><br/></div><div class='line' id='LC2063'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">compilerWords</span> <span class="o">=</span> <span class="nx">JavaScriptCompiler</span><span class="p">.</span><span class="nx">RESERVED_WORDS</span> <span class="o">=</span> <span class="p">{};</span></div><div class='line' id='LC2064'><br/></div><div class='line' id='LC2065'>&nbsp;&nbsp;<span class="k">for</span><span class="p">(</span><span class="kd">var</span> <span class="nx">i</span><span class="o">=</span><span class="mi">0</span><span class="p">,</span> <span class="nx">l</span><span class="o">=</span><span class="nx">reservedWords</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span><span class="o">&lt;</span><span class="nx">l</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2066'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">compilerWords</span><span class="p">[</span><span class="nx">reservedWords</span><span class="p">[</span><span class="nx">i</span><span class="p">]]</span> <span class="o">=</span> <span class="kc">true</span><span class="p">;</span></div><div class='line' id='LC2067'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2068'><br/></div><div class='line' id='LC2069'>&nbsp;&nbsp;<span class="nx">JavaScriptCompiler</span><span class="p">.</span><span class="nx">isValidJavaScriptVariableName</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">name</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2070'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="o">!</span><span class="nx">JavaScriptCompiler</span><span class="p">.</span><span class="nx">RESERVED_WORDS</span><span class="p">[</span><span class="nx">name</span><span class="p">]</span> <span class="o">&amp;&amp;</span> <span class="sr">/^[a-zA-Z_$][0-9a-zA-Z_$]+$/</span><span class="p">.</span><span class="nx">test</span><span class="p">(</span><span class="nx">name</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC2071'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="kc">true</span><span class="p">;</span></div><div class='line' id='LC2072'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2073'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="kc">false</span><span class="p">;</span></div><div class='line' id='LC2074'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC2075'><br/></div><div class='line' id='LC2076'><span class="p">})(</span><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">Compiler</span><span class="p">,</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">JavaScriptCompiler</span><span class="p">);</span></div><div class='line' id='LC2077'><br/></div><div class='line' id='LC2078'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">precompile</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">input</span><span class="p">,</span> <span class="nx">options</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2079'>&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">input</span> <span class="o">||</span> <span class="p">(</span><span class="k">typeof</span> <span class="nx">input</span> <span class="o">!==</span> <span class="s1">&#39;string&#39;</span> <span class="o">&amp;&amp;</span> <span class="nx">input</span><span class="p">.</span><span class="nx">constructor</span> <span class="o">!==</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">AST</span><span class="p">.</span><span class="nx">ProgramNode</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC2080'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">Exception</span><span class="p">(</span><span class="s2">&quot;You must pass a string or Handlebars AST to Handlebars.compile. You passed &quot;</span> <span class="o">+</span> <span class="nx">input</span><span class="p">);</span></div><div class='line' id='LC2081'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2082'><br/></div><div class='line' id='LC2083'>&nbsp;&nbsp;<span class="nx">options</span> <span class="o">=</span> <span class="nx">options</span> <span class="o">||</span> <span class="p">{};</span></div><div class='line' id='LC2084'>&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="p">(</span><span class="s1">&#39;data&#39;</span> <span class="k">in</span> <span class="nx">options</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC2085'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">options</span><span class="p">.</span><span class="nx">data</span> <span class="o">=</span> <span class="kc">true</span><span class="p">;</span></div><div class='line' id='LC2086'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2087'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">ast</span> <span class="o">=</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">parse</span><span class="p">(</span><span class="nx">input</span><span class="p">);</span></div><div class='line' id='LC2088'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">environment</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">Compiler</span><span class="p">().</span><span class="nx">compile</span><span class="p">(</span><span class="nx">ast</span><span class="p">,</span> <span class="nx">options</span><span class="p">);</span></div><div class='line' id='LC2089'>&nbsp;&nbsp;<span class="k">return</span> <span class="k">new</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">JavaScriptCompiler</span><span class="p">().</span><span class="nx">compile</span><span class="p">(</span><span class="nx">environment</span><span class="p">,</span> <span class="nx">options</span><span class="p">);</span></div><div class='line' id='LC2090'><span class="p">};</span></div><div class='line' id='LC2091'><br/></div><div class='line' id='LC2092'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">compile</span> <span class="o">=</span> <span class="kd">function</span><span class="p">(</span><span class="nx">input</span><span class="p">,</span> <span class="nx">options</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2093'>&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">input</span> <span class="o">||</span> <span class="p">(</span><span class="k">typeof</span> <span class="nx">input</span> <span class="o">!==</span> <span class="s1">&#39;string&#39;</span> <span class="o">&amp;&amp;</span> <span class="nx">input</span><span class="p">.</span><span class="nx">constructor</span> <span class="o">!==</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">AST</span><span class="p">.</span><span class="nx">ProgramNode</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC2094'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">Exception</span><span class="p">(</span><span class="s2">&quot;You must pass a string or Handlebars AST to Handlebars.compile. You passed &quot;</span> <span class="o">+</span> <span class="nx">input</span><span class="p">);</span></div><div class='line' id='LC2095'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2096'><br/></div><div class='line' id='LC2097'>&nbsp;&nbsp;<span class="nx">options</span> <span class="o">=</span> <span class="nx">options</span> <span class="o">||</span> <span class="p">{};</span></div><div class='line' id='LC2098'>&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="p">(</span><span class="s1">&#39;data&#39;</span> <span class="k">in</span> <span class="nx">options</span><span class="p">))</span> <span class="p">{</span></div><div class='line' id='LC2099'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">options</span><span class="p">.</span><span class="nx">data</span> <span class="o">=</span> <span class="kc">true</span><span class="p">;</span></div><div class='line' id='LC2100'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2101'>&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">compiled</span><span class="p">;</span></div><div class='line' id='LC2102'>&nbsp;&nbsp;<span class="kd">function</span> <span class="nx">compile</span><span class="p">()</span> <span class="p">{</span></div><div class='line' id='LC2103'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">ast</span> <span class="o">=</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">parse</span><span class="p">(</span><span class="nx">input</span><span class="p">);</span></div><div class='line' id='LC2104'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">environment</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">Compiler</span><span class="p">().</span><span class="nx">compile</span><span class="p">(</span><span class="nx">ast</span><span class="p">,</span> <span class="nx">options</span><span class="p">);</span></div><div class='line' id='LC2105'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">templateSpec</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">JavaScriptCompiler</span><span class="p">().</span><span class="nx">compile</span><span class="p">(</span><span class="nx">environment</span><span class="p">,</span> <span class="nx">options</span><span class="p">,</span> <span class="kc">undefined</span><span class="p">,</span> <span class="kc">true</span><span class="p">);</span></div><div class='line' id='LC2106'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">template</span><span class="p">(</span><span class="nx">templateSpec</span><span class="p">);</span></div><div class='line' id='LC2107'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2108'><br/></div><div class='line' id='LC2109'>&nbsp;&nbsp;<span class="c1">// Template is only compiled on first use and cached after that point.</span></div><div class='line' id='LC2110'>&nbsp;&nbsp;<span class="k">return</span> <span class="kd">function</span><span class="p">(</span><span class="nx">context</span><span class="p">,</span> <span class="nx">options</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2111'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">compiled</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2112'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">compiled</span> <span class="o">=</span> <span class="nx">compile</span><span class="p">();</span></div><div class='line' id='LC2113'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2114'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">compiled</span><span class="p">.</span><span class="nx">call</span><span class="p">(</span><span class="k">this</span><span class="p">,</span> <span class="nx">context</span><span class="p">,</span> <span class="nx">options</span><span class="p">);</span></div><div class='line' id='LC2115'>&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC2116'><span class="p">};</span></div><div class='line' id='LC2117'><span class="p">;</span></div><div class='line' id='LC2118'><span class="c1">// lib/handlebars/runtime.js</span></div><div class='line' id='LC2119'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">VM</span> <span class="o">=</span> <span class="p">{</span></div><div class='line' id='LC2120'>&nbsp;&nbsp;<span class="nx">template</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">templateSpec</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2121'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Just add water</span></div><div class='line' id='LC2122'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">container</span> <span class="o">=</span> <span class="p">{</span></div><div class='line' id='LC2123'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">escapeExpression</span><span class="o">:</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">Utils</span><span class="p">.</span><span class="nx">escapeExpression</span><span class="p">,</span></div><div class='line' id='LC2124'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">invokePartial</span><span class="o">:</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">VM</span><span class="p">.</span><span class="nx">invokePartial</span><span class="p">,</span></div><div class='line' id='LC2125'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">programs</span><span class="o">:</span> <span class="p">[],</span></div><div class='line' id='LC2126'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">program</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">i</span><span class="p">,</span> <span class="nx">fn</span><span class="p">,</span> <span class="nx">data</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2127'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">programWrapper</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">programs</span><span class="p">[</span><span class="nx">i</span><span class="p">];</span></div><div class='line' id='LC2128'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">data</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2129'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">VM</span><span class="p">.</span><span class="nx">program</span><span class="p">(</span><span class="nx">fn</span><span class="p">,</span> <span class="nx">data</span><span class="p">);</span></div><div class='line' id='LC2130'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="nx">programWrapper</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2131'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">programWrapper</span><span class="p">;</span></div><div class='line' id='LC2132'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC2133'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">programWrapper</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">programs</span><span class="p">[</span><span class="nx">i</span><span class="p">]</span> <span class="o">=</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">VM</span><span class="p">.</span><span class="nx">program</span><span class="p">(</span><span class="nx">fn</span><span class="p">);</span></div><div class='line' id='LC2134'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">programWrapper</span><span class="p">;</span></div><div class='line' id='LC2135'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2136'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC2137'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">programWithDepth</span><span class="o">:</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">VM</span><span class="p">.</span><span class="nx">programWithDepth</span><span class="p">,</span></div><div class='line' id='LC2138'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">noop</span><span class="o">:</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">VM</span><span class="p">.</span><span class="nx">noop</span><span class="p">,</span></div><div class='line' id='LC2139'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">compilerInfo</span><span class="o">:</span> <span class="kc">null</span></div><div class='line' id='LC2140'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC2141'><br/></div><div class='line' id='LC2142'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="kd">function</span><span class="p">(</span><span class="nx">context</span><span class="p">,</span> <span class="nx">options</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2143'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">options</span> <span class="o">=</span> <span class="nx">options</span> <span class="o">||</span> <span class="p">{};</span></div><div class='line' id='LC2144'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">result</span> <span class="o">=</span> <span class="nx">templateSpec</span><span class="p">.</span><span class="nx">call</span><span class="p">(</span><span class="nx">container</span><span class="p">,</span> <span class="nx">Handlebars</span><span class="p">,</span> <span class="nx">context</span><span class="p">,</span> <span class="nx">options</span><span class="p">.</span><span class="nx">helpers</span><span class="p">,</span> <span class="nx">options</span><span class="p">.</span><span class="nx">partials</span><span class="p">,</span> <span class="nx">options</span><span class="p">.</span><span class="nx">data</span><span class="p">);</span></div><div class='line' id='LC2145'><br/></div><div class='line' id='LC2146'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">compilerInfo</span> <span class="o">=</span> <span class="nx">container</span><span class="p">.</span><span class="nx">compilerInfo</span> <span class="o">||</span> <span class="p">[],</span></div><div class='line' id='LC2147'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">compilerRevision</span> <span class="o">=</span> <span class="nx">compilerInfo</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span> <span class="o">||</span> <span class="mi">1</span><span class="p">,</span></div><div class='line' id='LC2148'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">currentRevision</span> <span class="o">=</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">COMPILER_REVISION</span><span class="p">;</span></div><div class='line' id='LC2149'><br/></div><div class='line' id='LC2150'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">compilerRevision</span> <span class="o">!==</span> <span class="nx">currentRevision</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2151'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span> <span class="p">(</span><span class="nx">compilerRevision</span> <span class="o">&lt;</span> <span class="nx">currentRevision</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2152'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">runtimeVersions</span> <span class="o">=</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">REVISION_CHANGES</span><span class="p">[</span><span class="nx">currentRevision</span><span class="p">],</span></div><div class='line' id='LC2153'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">compilerVersions</span> <span class="o">=</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">REVISION_CHANGES</span><span class="p">[</span><span class="nx">compilerRevision</span><span class="p">];</span></div><div class='line' id='LC2154'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="s2">&quot;Template was precompiled with an older version of Handlebars than the current runtime. &quot;</span><span class="o">+</span></div><div class='line' id='LC2155'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot;Please update your precompiler to a newer version (&quot;</span><span class="o">+</span><span class="nx">runtimeVersions</span><span class="o">+</span><span class="s2">&quot;) or downgrade your runtime to an older version (&quot;</span><span class="o">+</span><span class="nx">compilerVersions</span><span class="o">+</span><span class="s2">&quot;).&quot;</span><span class="p">;</span></div><div class='line' id='LC2156'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC2157'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c1">// Use the embedded version info since the runtime doesn&#39;t know about this revision yet</span></div><div class='line' id='LC2158'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="s2">&quot;Template was precompiled with a newer version of Handlebars than the current runtime. &quot;</span><span class="o">+</span></div><div class='line' id='LC2159'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="s2">&quot;Please update your runtime to a newer version (&quot;</span><span class="o">+</span><span class="nx">compilerInfo</span><span class="p">[</span><span class="mi">1</span><span class="p">]</span><span class="o">+</span><span class="s2">&quot;).&quot;</span><span class="p">;</span></div><div class='line' id='LC2160'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2161'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2162'><br/></div><div class='line' id='LC2163'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">result</span><span class="p">;</span></div><div class='line' id='LC2164'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC2165'>&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC2166'><br/></div><div class='line' id='LC2167'>&nbsp;&nbsp;<span class="nx">programWithDepth</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">fn</span><span class="p">,</span> <span class="nx">data</span><span class="p">,</span> <span class="nx">$depth</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2168'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">args</span> <span class="o">=</span> <span class="nb">Array</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">slice</span><span class="p">.</span><span class="nx">call</span><span class="p">(</span><span class="nx">arguments</span><span class="p">,</span> <span class="mi">2</span><span class="p">);</span></div><div class='line' id='LC2169'><br/></div><div class='line' id='LC2170'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="kd">function</span><span class="p">(</span><span class="nx">context</span><span class="p">,</span> <span class="nx">options</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2171'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">options</span> <span class="o">=</span> <span class="nx">options</span> <span class="o">||</span> <span class="p">{};</span></div><div class='line' id='LC2172'><br/></div><div class='line' id='LC2173'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">fn</span><span class="p">.</span><span class="nx">apply</span><span class="p">(</span><span class="k">this</span><span class="p">,</span> <span class="p">[</span><span class="nx">context</span><span class="p">,</span> <span class="nx">options</span><span class="p">.</span><span class="nx">data</span> <span class="o">||</span> <span class="nx">data</span><span class="p">].</span><span class="nx">concat</span><span class="p">(</span><span class="nx">args</span><span class="p">));</span></div><div class='line' id='LC2174'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC2175'>&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC2176'>&nbsp;&nbsp;<span class="nx">program</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">fn</span><span class="p">,</span> <span class="nx">data</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2177'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="kd">function</span><span class="p">(</span><span class="nx">context</span><span class="p">,</span> <span class="nx">options</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2178'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">options</span> <span class="o">=</span> <span class="nx">options</span> <span class="o">||</span> <span class="p">{};</span></div><div class='line' id='LC2179'><br/></div><div class='line' id='LC2180'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">fn</span><span class="p">(</span><span class="nx">context</span><span class="p">,</span> <span class="nx">options</span><span class="p">.</span><span class="nx">data</span> <span class="o">||</span> <span class="nx">data</span><span class="p">);</span></div><div class='line' id='LC2181'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">};</span></div><div class='line' id='LC2182'>&nbsp;&nbsp;<span class="p">},</span></div><div class='line' id='LC2183'>&nbsp;&nbsp;<span class="nx">noop</span><span class="o">:</span> <span class="kd">function</span><span class="p">()</span> <span class="p">{</span> <span class="k">return</span> <span class="s2">&quot;&quot;</span><span class="p">;</span> <span class="p">},</span></div><div class='line' id='LC2184'>&nbsp;&nbsp;<span class="nx">invokePartial</span><span class="o">:</span> <span class="kd">function</span><span class="p">(</span><span class="nx">partial</span><span class="p">,</span> <span class="nx">name</span><span class="p">,</span> <span class="nx">context</span><span class="p">,</span> <span class="nx">helpers</span><span class="p">,</span> <span class="nx">partials</span><span class="p">,</span> <span class="nx">data</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2185'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kd">var</span> <span class="nx">options</span> <span class="o">=</span> <span class="p">{</span> <span class="nx">helpers</span><span class="o">:</span> <span class="nx">helpers</span><span class="p">,</span> <span class="nx">partials</span><span class="o">:</span> <span class="nx">partials</span><span class="p">,</span> <span class="nx">data</span><span class="o">:</span> <span class="nx">data</span> <span class="p">};</span></div><div class='line' id='LC2186'><br/></div><div class='line' id='LC2187'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">if</span><span class="p">(</span><span class="nx">partial</span> <span class="o">===</span> <span class="kc">undefined</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2188'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">Exception</span><span class="p">(</span><span class="s2">&quot;The partial &quot;</span> <span class="o">+</span> <span class="nx">name</span> <span class="o">+</span> <span class="s2">&quot; could not be found&quot;</span><span class="p">);</span></div><div class='line' id='LC2189'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="k">if</span><span class="p">(</span><span class="nx">partial</span> <span class="k">instanceof</span> <span class="nb">Function</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2190'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">partial</span><span class="p">(</span><span class="nx">context</span><span class="p">,</span> <span class="nx">options</span><span class="p">);</span></div><div class='line' id='LC2191'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">compile</span><span class="p">)</span> <span class="p">{</span></div><div class='line' id='LC2192'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">throw</span> <span class="k">new</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">Exception</span><span class="p">(</span><span class="s2">&quot;The partial &quot;</span> <span class="o">+</span> <span class="nx">name</span> <span class="o">+</span> <span class="s2">&quot; could not be compiled when running in runtime-only mode&quot;</span><span class="p">);</span></div><div class='line' id='LC2193'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span> <span class="k">else</span> <span class="p">{</span></div><div class='line' id='LC2194'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nx">partials</span><span class="p">[</span><span class="nx">name</span><span class="p">]</span> <span class="o">=</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">compile</span><span class="p">(</span><span class="nx">partial</span><span class="p">,</span> <span class="p">{</span><span class="nx">data</span><span class="o">:</span> <span class="nx">data</span> <span class="o">!==</span> <span class="kc">undefined</span><span class="p">});</span></div><div class='line' id='LC2195'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">return</span> <span class="nx">partials</span><span class="p">[</span><span class="nx">name</span><span class="p">](</span><span class="nx">context</span><span class="p">,</span> <span class="nx">options</span><span class="p">);</span></div><div class='line' id='LC2196'>&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2197'>&nbsp;&nbsp;<span class="p">}</span></div><div class='line' id='LC2198'><span class="p">};</span></div><div class='line' id='LC2199'><br/></div><div class='line' id='LC2200'><span class="nx">Handlebars</span><span class="p">.</span><span class="nx">template</span> <span class="o">=</span> <span class="nx">Handlebars</span><span class="p">.</span><span class="nx">VM</span><span class="p">.</span><span class="nx">template</span><span class="p">;</span></div><div class='line' id='LC2201'><span class="p">;</span></div></pre></div>
          </td>
        </tr>
      </table>
  </div>

          </div>
        </div>

        <a href="#jump-to-line" rel="facebox" data-hotkey="l" class="js-jump-to-line" style="display:none">Jump to Line</a>
        <div id="jump-to-line" style="display:none">
          <h2>Jump to Line</h2>
          <form accept-charset="UTF-8" class="js-jump-to-line-form">
            <input class="textfield js-jump-to-line-field" type="text">
            <div class="full-button">
              <button type="submit" class="button">Go</button>
            </div>
          </form>
        </div>

      </div>
    </div>
</div>

<div id="js-frame-loading-template" class="frame frame-loading large-loading-area" style="display:none;">
  <img class="js-frame-loading-spinner" src="https://a248.e.akamai.net/assets.github.com/images/spinners/octocat-spinner-128.gif?1347543525" height="64" width="64">
</div>


        </div>
      </div>
      <div class="context-overlay"></div>
    </div>

      <div id="footer-push"></div><!-- hack for sticky footer -->
    </div><!-- end of wrapper - hack for sticky footer -->

      <!-- footer -->
      <div id="footer">
  <div class="container clearfix">

      <dl class="footer_nav">
        <dt>GitHub</dt>
        <dd><a href="https://github.com/about">About us</a></dd>
        <dd><a href="https://github.com/blog">Blog</a></dd>
        <dd><a href="https://github.com/contact">Contact &amp; support</a></dd>
        <dd><a href="http://enterprise.github.com/">GitHub Enterprise</a></dd>
        <dd><a href="http://status.github.com/">Site status</a></dd>
      </dl>

      <dl class="footer_nav">
        <dt>Applications</dt>
        <dd><a href="http://mac.github.com/">GitHub for Mac</a></dd>
        <dd><a href="http://windows.github.com/">GitHub for Windows</a></dd>
        <dd><a href="http://eclipse.github.com/">GitHub for Eclipse</a></dd>
        <dd><a href="http://mobile.github.com/">GitHub mobile apps</a></dd>
      </dl>

      <dl class="footer_nav">
        <dt>Services</dt>
        <dd><a href="http://get.gaug.es/">Gauges: Web analytics</a></dd>
        <dd><a href="http://speakerdeck.com">Speaker Deck: Presentations</a></dd>
        <dd><a href="https://gist.github.com">Gist: Code snippets</a></dd>
        <dd><a href="http://jobs.github.com/">Job board</a></dd>
      </dl>

      <dl class="footer_nav">
        <dt>Documentation</dt>
        <dd><a href="http://help.github.com/">GitHub Help</a></dd>
        <dd><a href="http://developer.github.com/">Developer API</a></dd>
        <dd><a href="http://github.github.com/github-flavored-markdown/">GitHub Flavored Markdown</a></dd>
        <dd><a href="http://pages.github.com/">GitHub Pages</a></dd>
      </dl>

      <dl class="footer_nav">
        <dt>More</dt>
        <dd><a href="http://training.github.com/">Training</a></dd>
        <dd><a href="https://github.com/edu">Students &amp; teachers</a></dd>
        <dd><a href="http://shop.github.com">The Shop</a></dd>
        <dd><a href="/plans">Plans &amp; pricing</a></dd>
        <dd><a href="http://octodex.github.com/">The Octodex</a></dd>
      </dl>

      <hr class="footer-divider">


    <p class="right">&copy; 2013 <span title="0.78088s from fe17.rs.github.com">GitHub</span>, Inc. All rights reserved.</p>
    <a class="left" href="https://github.com/">
      <span class="mega-icon mega-icon-invertocat"></span>
    </a>
    <ul id="legal">
        <li><a href="https://github.com/site/terms">Terms of Service</a></li>
        <li><a href="https://github.com/site/privacy">Privacy</a></li>
        <li><a href="https://github.com/security">Security</a></li>
    </ul>

  </div><!-- /.container -->

</div><!-- /.#footer -->


    <div class="fullscreen-overlay js-fullscreen-overlay" id="fullscreen_overlay">
  <div class="fullscreen-container js-fullscreen-container">
    <div class="textarea-wrap">
      <textarea name="fullscreen-contents" id="fullscreen-contents" class="js-fullscreen-contents" placeholder="" data-suggester="fullscreen_suggester"></textarea>
          <div class="suggester-container">
              <div class="suggester fullscreen-suggester js-navigation-container" id="fullscreen_suggester"
                 data-url="/sgross2130/prodigy-mobile/suggestions/commit">
              </div>
          </div>
    </div>
  </div>
  <div class="fullscreen-sidebar">
    <a href="#" class="exit-fullscreen js-exit-fullscreen tooltipped leftwards" title="Exit Zen Mode">
      <span class="mega-icon mega-icon-normalscreen"></span>
    </a>
    <a href="#" class="theme-switcher js-theme-switcher tooltipped leftwards"
      title="Switch themes">
      <span class="mini-icon mini-icon-brightness"></span>
    </a>
  </div>
</div>



    <div id="ajax-error-message" class="flash flash-error">
      <span class="mini-icon mini-icon-exclamation"></span>
      Something went wrong with that request. Please try again.
      <a href="#" class="mini-icon mini-icon-remove-close ajax-error-dismiss"></a>
    </div>

    
    
    <span id='server_response_time' data-time='0.78138' data-host='fe17'></span>
    
  </body>
</html>

>>>>>>> Resync
