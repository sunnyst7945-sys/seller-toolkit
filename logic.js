/* =============================================================
 * 电商运营工具箱 - 核心逻辑（纯函数，可在 Node 与浏览器中运行）
 * 通过 UMD 方式导出，便于 Node 单元测试与浏览器复用
 * ============================================================= */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ToolkitLogic = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------------- 单位换算 ---------------- */
  var UNIT_DATA = {
    length: {
      label: '长度', base: '米 (m)',
      units: {
        mm:   { label: '毫米 (mm)', factor: 0.001 },
        cm:   { label: '厘米 (cm)', factor: 0.01 },
        m:    { label: '米 (m)',    factor: 1 },
        km:   { label: '千米 (km)', factor: 1000 },
        in:   { label: '英寸 (in)', factor: 0.0254 },
        ft:   { label: '英尺 (ft)', factor: 0.3048 },
        yd:   { label: '码 (yd)',   factor: 0.9144 },
        mile: { label: '英里 (mi)', factor: 1609.344 },
        nmi:  { label: '海里 (nmi)', factor: 1852 }
      }
    },
    weight: {
      label: '重量', base: '千克 (kg)',
      units: {
        mg:    { label: '毫克 (mg)', factor: 1e-6 },
        g:     { label: '克 (g)',    factor: 0.001 },
        kg:    { label: '千克 (kg)', factor: 1 },
        t:     { label: '吨 (t)',    factor: 1000 },
        oz:    { label: '盎司 (oz)', factor: 0.028349523125 },
        lb:    { label: '磅 (lb)',   factor: 0.45359237 },
        jin:   { label: '市斤 (斤)', factor: 0.5 },
        liang: { label: '市两 (两)', factor: 0.05 }
      }
    },
    volume: {
      label: '体积', base: '升 (L)',
      units: {
        ml:      { label: '毫升 (mL)',         factor: 0.001 },
        l:       { label: '升 (L)',            factor: 1 },
        m3:      { label: '立方米 (m³)',       factor: 1000 },
        cm3:     { label: '立方厘米 (cm³)',    factor: 0.001 },
        gal:     { label: '美制加仑 (gal)',    factor: 3.785411784 },
        qt:      { label: '美制夸脱 (qt)',     factor: 0.946352946 },
        pt:      { label: '美制品脱 (pt)',     factor: 0.473176473 },
        floz:    { label: '美制液量盎司 (fl oz)', factor: 0.0295735295625 },
        cup:     { label: '美制杯 (cup)',      factor: 0.2365882365 },
        tbsp:    { label: '汤匙 (tbsp)',       factor: 0.01478676478125 },
        tsp:     { label: '茶匙 (tsp)',        factor: 0.00492892159375 }
      }
    },
    area: {
      label: '面积', base: '平方米 (m²)',
      units: {
        cm2:     { label: '平方厘米 (cm²)', factor: 1e-4 },
        m2:      { label: '平方米 (m²)',    factor: 1 },
        km2:     { label: '平方千米 (km²)', factor: 1e6 },
        ha:      { label: '公顷 (ha)',      factor: 10000 },
        in2:     { label: '平方英寸 (in²)', factor: 0.00064516 },
        ft2:     { label: '平方英尺 (ft²)', factor: 0.09290304 },
        yd2:     { label: '平方码 (yd²)',   factor: 0.83612736 },
        acre:    { label: '英亩 (acre)',    factor: 4046.8564224 },
        mu:      { label: '市亩 (亩)',      factor: 666.6666667 }
      }
    },
    temperature: {
      label: '温度', base: '摄氏度 (°C)',
      units: {
        c: { label: '摄氏度 (°C)', factor: 0 },
        f: { label: '华氏度 (°F)', factor: 0 },
        k: { label: '开尔文 (K)',  factor: 0 }
      }
    }
  };

  function toCelsius(value, unit) {
    if (unit === 'c') return value;
    if (unit === 'f') return (value - 32) * 5 / 9;
    if (unit === 'k') return value - 273.15;
    return NaN;
  }
  function fromCelsius(celsius, unit) {
    if (unit === 'c') return celsius;
    if (unit === 'f') return celsius * 9 / 5 + 32;
    if (unit === 'k') return celsius + 273.15;
    return NaN;
  }

  /**
   * 单位换算：convertUnit(value, from, to, category)
   * 返回数值；无效输入返回 NaN
   */
  function convertUnit(value, from, to, category) {
    if (typeof value !== 'number' || !isFinite(value)) return NaN;
    var cat = UNIT_DATA[category];
    if (!cat) return NaN;
    if (category === 'temperature') {
      return fromCelsius(toCelsius(value, from), to);
    }
    if (!cat.units[from] || !cat.units[to]) return NaN;
    return value * cat.units[from].factor / cat.units[to].factor;
  }

  function getUnits(category) {
    var cat = UNIT_DATA[category];
    if (!cat) return [];
    return Object.keys(cat.units).map(function (k) {
      return { key: k, label: cat.units[k].label };
    });
  }
  function getCategories() {
    return Object.keys(UNIT_DATA).map(function (k) {
      return { key: k, label: UNIT_DATA[k].label, base: UNIT_DATA[k].base };
    });
  }

  /* ---------------- 货币换算 ---------------- */
  /**
   * 以 USD 为基准的汇率表：rates = { USD:1, EUR:0.92, CNY:7.2, ... }
   * 表示 1 USD 可兑换的对应货币数量。
   */
  function convertCurrency(amount, from, to, rates) {
    if (typeof amount !== 'number' || !isFinite(amount)) return NaN;
    if (!rates || !rates[from] || !rates[to]) return NaN;
    if (from === to) return amount;
    var usd = amount / rates[from];
    return usd * rates[to];
  }

  /* ---------------- 大小写转换 ---------------- */
  function toUpper(s) { return String(s).toUpperCase(); }
  function toLower(s) { return String(s).toLowerCase(); }
  function toTitle(s) {
    // 每个单词首字母大写，其余字母转小写（Title Case）
    return String(s).replace(/\S+/g, function (w) {
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    });
  }
  function toSentence(s) {
    // 句首大写，其余小写（按英文句子处理）
    return String(s).replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, function (m) {
      return m.toUpperCase();
    }).replace(/[A-Z]+/g, function (m) {
      // 仅保留句首大写，句内整体转小写
      return m.toLowerCase();
    }).replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, function (m) {
      return m.toUpperCase();
    });
  }
  function applyCase(text, mode) {
    switch (mode) {
      case 'upper': return toUpper(text);
      case 'lower': return toLower(text);
      case 'title': return toTitle(text);
      case 'sentence': return toSentence(text);
      default: return String(text);
    }
  }

  /* ---------------- 标题拆分 ---------------- */
  /**
   * 计算“字符数”（用于亚马逊标题计数）：
   * 使用码点计数（Array.from），中英文均按 1 个字符计算，emoji 按 1 计算。
   */
  function charCount(s) {
    try { return Array.from(String(s)).length; } catch (e) { return String(s).length; }
  }

  /**
   * 拆分标题：超过 max 字符时尽量按单词/空格边界截断，避免切断单词。
   */
  function splitByLimit(text, max) {
    var s = String(text);
    if (charCount(s) <= max) return s;
    // 先取码点数组，避免截断代理对
    var arr = Array.from(s);
    if (arr.length <= max) return s;
    var head = arr.slice(0, max).join('');
    // 尝试回退到最后一个空白以保留完整单词（最多回退 max 的一半）
    var lastSpace = head.lastIndexOf(' ');
    if (lastSpace > max * 0.5) {
      head = head.slice(0, lastSpace);
    }
    return head;
  }

  /**
   * 拆分亮点：把长文本按 max 字符切分成多段，尽量在空白处断行。
   */
  function splitHighlight(text, max) {
    var s = String(text);
    var arr = Array.from(s);
    var chunks = [];
    var i = 0;
    while (i < arr.length) {
      var end = Math.min(i + max, arr.length);
      var chunk = arr.slice(i, end).join('');
      // 若未到末尾且下一个字符不是空白，尝试回退到最后一个空格
      if (end < arr.length && !/\s/.test(arr[end])) {
        var lastSpace = chunk.lastIndexOf(' ');
        if (lastSpace > max * 0.5) {
          chunk = chunk.slice(0, lastSpace);
          end = i + Array.from(chunk).length;
        }
      }
      chunks.push(chunk);
      i = end;
    }
    return chunks;
  }

  /**
   * 标题处理：返回 { text, count, over }
   */
  function processTitle(text, max) {
    var t = splitByLimit(text, max);
    return { text: t, count: charCount(t), over: charCount(text) > max };
  }

  /**
   * 流水线式拆分：先拆标题（≤titleMax），剩余文案自动进入亮点（按 hlMax 分段，保持语序）。
   * 返回 { title, titleCount, rest, highlights }
   */
  function splitTitleAndHighlights(text, titleMax, hlMax) {
    var s = String(text);
    var title = splitByLimit(s, titleMax);
    var titleChars = Array.from(title).length;
    var rest = Array.from(s).slice(titleChars).join('').trim();
    var highlights = [];
    if (rest) highlights = splitHighlight(rest, hlMax);
    return { title: title, titleCount: charCount(title), rest: rest, highlights: highlights };
  }

  /* ---------------- HS 编码查询 ---------------- */
  /**
   * 在 HS 数据中搜索：data 形如 [{code, cn, en}]
   * 支持编码前缀匹配与关键词模糊匹配（中英文）。
   */
  function searchHS(data, query, limit) {
    limit = limit || 50;
    var q = String(query || '').trim().toLowerCase();
    if (!q) return [];
    var results = [];
    var codeHit = [];
    var textHit = [];
    data.forEach(function (item) {
      var code = String(item.code || '');
      var cn = (item.cn || '').toLowerCase();
      var en = (item.en || '').toLowerCase();
      if (code.indexOf(q) === 0) {
        codeHit.push({ item: item, score: 0 });
      } else if (cn.indexOf(q) >= 0 || en.indexOf(q) >= 0) {
        // 关键词命中：越靠前分越高
        var pos = Math.min(cn.indexOf(q) >= 0 ? cn.indexOf(q) : 999, en.indexOf(q) >= 0 ? en.indexOf(q) : 999);
        textHit.push({ item: item, score: pos });
      }
    });
    codeHit.sort(function (a, b) { return a.item.code.length - b.item.code.length; });
    textHit.sort(function (a, b) { return a.score - b.score; });
    codeHit.concat(textHit).slice(0, limit).forEach(function (r) { results.push(r.item); });
    return results.slice(0, limit);
  }

  return {
    UNIT_DATA: UNIT_DATA,
    getCategories: getCategories,
    getUnits: getUnits,
    convertUnit: convertUnit,
    convertCurrency: convertCurrency,
    toUpper: toUpper,
    toLower: toLower,
    toTitle: toTitle,
    toSentence: toSentence,
    applyCase: applyCase,
    charCount: charCount,
    splitByLimit: splitByLimit,
    splitHighlight: splitHighlight,
    processTitle: processTitle,
    splitTitleAndHighlights: splitTitleAndHighlights,
    searchHS: searchHS
  };
}));
