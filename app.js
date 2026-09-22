/* =============================================================
 * 电商运营工具箱 - 前端交互逻辑
 * ============================================================= */
(function () {
  'use strict';
  var L = window.ToolkitLogic;

  /* ---------------- 通用工具 ---------------- */
  function $(id) { return document.getElementById(id); }
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('show'); }, 2000);
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast('已复制到剪贴板'); });
    } else {
      var ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast('已复制到剪贴板'); } catch (e) { toast('复制失败'); }
      document.body.removeChild(ta);
    }
  }
  function fmtNum(n) {
    if (typeof n !== 'number' || !isFinite(n)) return '—';
    var a = Math.abs(n);
    if (a !== 0 && a < 0.01) return n.toFixed(4);
    if (a >= 100000) return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
    if (a >= 1) return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  }
  function fmtUnit(n) {
    if (typeof n !== 'number' || !isFinite(n)) return '—';
    var v = Number(n.toPrecision(9));
    return v.toLocaleString('en-US', { maximumFractionDigits: 6 });
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------------- 标签切换 ---------------- */
  document.querySelectorAll('.nav-item').forEach(function (el) {
    el.addEventListener('click', function () {
      document.querySelectorAll('.nav-item').forEach(function (n) { n.classList.remove('active'); });
      document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('active'); });
      el.classList.add('active');
      $('tab-' + el.getAttribute('data-tab')).classList.add('active');
    });
  });

  /* =============================================================
   * 一、单位换算
   * ============================================================= */
  var unitCategory = $('unit-category');
  var unitFrom = $('unit-from');
  var unitTo = $('unit-to');

  function fillUnitSelects() {
    var cats = L.getCategories();
    unitCategory.innerHTML = cats.map(function (c) {
      return '<option value="' + c.key + '">' + c.label + '</option>';
    }).join('');
    fillUnitOptions();
    unitCategory.addEventListener('change', function () {
      fillUnitOptions();
      $('unit-result').innerHTML = '';
    });
  }
  function fillUnitOptions() {
    var units = L.getUnits(unitCategory.value);
    var opts = units.map(function (u) { return '<option value="' + u.key + '">' + u.label + '</option>'; }).join('');
    unitFrom.innerHTML = opts;
    unitTo.innerHTML = opts;
    // 默认选择不同单位（长度选 cm→in）
    var def = { length: ['cm', 'in'], weight: ['kg', 'lb'], volume: ['ml', 'floz'], area: ['m2', 'ft2'], temperature: ['c', 'f'] };
    var d = def[unitCategory.value] || [units[0].key, units[Math.min(1, units.length - 1)].key];
    unitFrom.value = d[0];
    unitTo.value = d[1];
  }

  $('unit-convert').addEventListener('click', function () {
    var cat = unitCategory.value, from = unitFrom.value, to = unitTo.value;
    var lines = $('unit-input').value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    if (!lines.length) { toast('请输入要换算的数值'); return; }
    var box = $('unit-result');
    var html = '<div style="font-size:13px;color:#6b7280;margin-bottom:6px;">' +
      L.UNIT_DATA[cat].label + '：' + L.UNIT_DATA[cat].units[from].label + ' → ' + L.UNIT_DATA[cat].units[to].label + '</div>';
    lines.forEach(function (line) {
      var v = parseFloat(line.replace(/,/g, ''));
      var r = L.convertUnit(v, from, to, cat);
      html += '<div class="result-item"><span class="in">' + escapeHtml(line) + '</span>' +
        '<span class="out">' + (isNaN(r) ? '无效数值' : fmtUnit(r)) + '</span>' +
        '<button class="btn btn-outline btn-sm copy-btn">复制</button></div>';
    });
    box.innerHTML = html;
    bindCopyButtons(box);
  });

  $('unit-all').addEventListener('click', function () {
    var cat = unitCategory.value, from = unitFrom.value;
    var first = ($('unit-input').value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean)[0] || '').replace(/,/g, '');
    var v = parseFloat(first);
    if (isNaN(v)) { toast('请输入至少一个数值'); return; }
    var units = L.getUnits(cat);
    var box = $('unit-result');
    var html = '<div style="font-size:13px;color:#6b7280;margin-bottom:6px;">' + fmtUnit(v) + ' ' + L.UNIT_DATA[cat].units[from].label + ' 换算为全部单位：</div>';
    units.forEach(function (u) {
      var r = L.convertUnit(v, from, u.key, cat);
      html += '<div class="result-item"><span class="in">' + u.label + '</span>' +
        '<span class="out">' + (isNaN(r) ? '—' : fmtUnit(r)) + '</span>' +
        '<button class="btn btn-outline btn-sm copy-btn">复制</button></div>';
    });
    box.innerHTML = html;
    bindCopyButtons(box);
  });

  $('unit-clear').addEventListener('click', function () {
    $('unit-input').value = ''; $('unit-result').innerHTML = '';
  });

  function bindCopyButtons(container) {
    container.querySelectorAll('.copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.result-item');
        copyText(item.querySelector('.out').textContent);
      });
    });
  }

  /* =============================================================
   * 二、货币换算
   * ============================================================= */
  var CURRENCIES = [
    { code: 'USD', name: '美元', flag: '🇺🇸' },
    { code: 'CNY', name: '人民币', flag: '🇨🇳' },
    { code: 'EUR', name: '欧元', flag: '🇪🇺' },
    { code: 'GBP', name: '英镑', flag: '🇬🇧' },
    { code: 'JPY', name: '日元', flag: '🇯🇵' },
    { code: 'CAD', name: '加拿大元', flag: '🇨🇦' },
    { code: 'MXN', name: '墨西哥比索', flag: '🇲🇽' },
    { code: 'AUD', name: '澳大利亚元', flag: '🇦🇺' },
    { code: 'CHF', name: '瑞士法郎', flag: '🇨🇭' },
    { code: 'HKD', name: '港元', flag: '🇭🇰' },
    { code: 'SGD', name: '新加坡元', flag: '🇸🇬' },
    { code: 'KRW', name: '韩元', flag: '🇰🇷' },
    { code: 'NZD', name: '新西兰元', flag: '🇳🇿' },
    { code: 'SEK', name: '瑞典克朗', flag: '🇸🇪' },
    { code: 'NOK', name: '挪威克朗', flag: '🇳🇴' },
    { code: 'DKK', name: '丹麦克朗', flag: '🇩🇰' },
    { code: 'PLN', name: '波兰兹罗提', flag: '🇵🇱' },
    { code: 'TRY', name: '土耳其里拉', flag: '🇹🇷' },
    { code: 'INR', name: '印度卢比', flag: '🇮🇳' },
    { code: 'BRL', name: '巴西雷亚尔', flag: '🇧🇷' },
    { code: 'THB', name: '泰铢', flag: '🇹🇭' },
    { code: 'AED', name: '阿联酋迪拉姆', flag: '🇦🇪' },
    { code: 'RUB', name: '俄罗斯卢布', flag: '🇷🇺' },
    { code: 'ZAR', name: '南非兰特', flag: '🇿🇦' }
  ];
  var FX_RATES = null;
  var FX_UPDATED = null;

  function fillCurrencySelects() {
    var opts = CURRENCIES.map(function (c) {
      return '<option value="' + c.code + '">' + c.flag + ' ' + c.code + ' · ' + c.name + '</option>';
    }).join('');
    $('fx-from').innerHTML = opts;
    $('fx-to').innerHTML = opts;
    $('fx-from').value = 'USD';
    $('fx-to').value = 'CNY';
  }

  function setFxBanner(type, msg) {
    var b = $('fx-banner');
    b.className = 'banner ' + (type === 'ok' ? 'banner-info' : type === 'warn' ? 'banner-warn' : 'banner-error');
    b.innerHTML = msg;
  }

  async function fetchRates(force) {
    var KEY = 'toolkit_fx_cache';
    var cache = null;
    try { cache = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    var now = Date.now();
    if (!force && cache && cache.rates && cache.ts && (now - cache.ts < 24 * 3600 * 1000)) {
      FX_RATES = cache.rates;
      FX_UPDATED = cache.updated;
      showFxBannerOk();
      return;
    }
    // 拉取最新
    var rates = null, updated = null, src = '';
    try {
      var r1 = await fetch('https://open.er-api.com/v6/latest/USD').then(function (r) { return r.json(); });
      if (r1 && r1.result === 'success' && r1.rates && r1.rates.USD) {
        rates = r1.rates; updated = r1.time_last_update_utc; src = 'open.er-api.com';
      }
    } catch (e) {}
    if (!rates) {
      try {
        var r2 = await fetch('https://api.frankfurter.app/latest?from=USD').then(function (r) { return r.json(); });
        if (r2 && r2.rates) {
          rates = r2.rates; rates.USD = 1; updated = r2.date; src = 'frankfurter.app';
        }
      } catch (e) {}
    }
    if (!rates) {
      setFxBanner('error', '⚠️ 汇率加载失败，请检查网络后点击「刷新汇率」。');
      return;
    }
    FX_RATES = rates; FX_UPDATED = updated;
    try {
      localStorage.setItem(KEY, JSON.stringify({ rates: rates, ts: now, updated: updated }));
    } catch (e) {}
    showFxBannerOk(src);
  }

  function showFxBannerOk(src) {
    var missing = CURRENCIES.filter(function (c) { return !(c.code in FX_RATES); });
    var srcTxt = src ? '（来源：' + src + '）' : '';
    var msg = '✅ 汇率已就绪 · 更新于 ' + (FX_UPDATED ? String(FX_UPDATED).slice(0, 16) : '今日') + ' · 基准 USD' + srcTxt;
    if (missing.length) {
      msg += ' · ⚠️ 缺失：' + missing.map(function (c) { return c.code; }).join('、');
      setFxBanner('warn', msg);
    } else {
      setFxBanner('ok', msg);
    }
  }

  function doFxConvert(toAll) {
    if (!FX_RATES) { toast('汇率尚未加载，请稍候或点击刷新'); return; }
    var amount = parseFloat($('fx-amount').value);
    if (isNaN(amount)) { toast('请输入有效金额'); return; }
    var from = $('fx-from').value;
    var box = $('fx-result');
    if (toAll) {
      var html = '<div style="font-size:13px;color:#6b7280;margin-bottom:6px;">' + fmtNum(amount) + ' ' + from + ' 换算为全部货币：</div>';
      CURRENCIES.forEach(function (c) {
        var r = L.convertCurrency(amount, from, c.code, FX_RATES);
        html += '<div class="result-item"><span class="in">' + c.flag + ' ' + c.code + ' · ' + c.name + '</span>' +
          '<span class="out">' + (isNaN(r) ? '—' : fmtNum(r) + ' ' + c.code) + '</span>' +
          '<button class="btn btn-outline btn-sm copy-btn">复制</button></div>';
      });
      box.innerHTML = html;
    } else {
      var to = $('fx-to').value;
      var r = L.convertCurrency(amount, from, to, FX_RATES);
      var rate = (FX_RATES[to] && FX_RATES[from]) ? FX_RATES[to] / FX_RATES[from] : null;
      var html = '<div style="font-size:13px;color:#6b7280;margin-bottom:6px;">' + fmtNum(amount) + ' ' + from + ' = ' +
        (isNaN(r) ? '—' : fmtNum(r) + ' ' + to) +
        (rate ? ' &nbsp;·&nbsp; 汇率 1 ' + from + ' = ' + fmtNum(rate) + ' ' + to : '') + '</div>';
      box.innerHTML = html;
    }
    bindCopyButtons(box);
  }

  $('fx-convert').addEventListener('click', function () { doFxConvert(false); });
  $('fx-all').addEventListener('click', function () { doFxConvert(true); });
  $('fx-refresh').addEventListener('click', function () {
    setFxBanner('ok', '🔄 正在刷新汇率…');
    fetchRates(true).then(function () { if (FX_RATES) { toast('汇率已更新'); doFxConvert(false); } });
  });

  /* =============================================================
   * 三、Made in China 标注
   * ============================================================= */
  var miFiles = [];
  var miResults = {};

  var miDrop = $('mi-drop');
  var miInput = $('mi-files');
  miDrop.addEventListener('click', function () { miInput.click(); });
  miInput.addEventListener('change', function () { addMiFiles(miInput.files); });
  miDrop.addEventListener('dragover', function (e) { e.preventDefault(); miDrop.classList.add('dragover'); });
  miDrop.addEventListener('dragleave', function () { miDrop.classList.remove('dragover'); });
  miDrop.addEventListener('drop', function (e) {
    e.preventDefault(); miDrop.classList.remove('dragover'); addMiFiles(e.dataTransfer.files);
  });

  function addMiFiles(fileList) {
    Array.from(fileList).forEach(function (f) {
      var ext = f.name.split('.').pop().toLowerCase();
      if (['pdf', 'jpg', 'jpeg', 'png'].indexOf(ext) === -1) { toast('不支持的文件：' + f.name); return; }
      miFiles.push(f);
    });
    renderMiFiles();
  }
  function renderMiFiles() {
    var box = $('mi-file-list');
    box.innerHTML = miFiles.map(function (f, i) {
      var icon = f.name.toLowerCase().endsWith('.pdf') ? '📄' : '🖼️';
      var r = miResults[f.name];
      var status = '';
      if (r === 'processing') status = '<span class="status" style="color:#2563eb;">处理中…</span>';
      else if (r && r.error) status = '<span class="status" style="color:#dc2626;">✗ ' + escapeHtml(r.error) + '</span>';
      else if (r) status = '<span class="status" style="color:#16a34a;">✓ 已完成</span>';
      return '<div class="file-item"><span>' + icon + '</span><span class="name">' + escapeHtml(f.name) + '</span>' +
        status +
        '<button class="btn btn-ghost btn-sm" data-mi-del="' + i + '">移除</button></div>';
    }).join('');
    box.querySelectorAll('[data-mi-del]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-mi-del'));
        var name = miFiles[idx].name;
        miFiles.splice(idx, 1); delete miResults[name];
        renderMiFiles();
      });
    });
    renderMiDownloadLinks();
  }

  function miColor() {
    var c = $('mi-color').value;
    if (c === 'white') return { css: '#ffffff', rgb: { r: 1, g: 1, b: 1 } };
    if (c === 'gray') return { css: '#6b7280', rgb: { r: 0.42, g: 0.46, b: 0.5 } };
    return { css: '#000000', rgb: { r: 0, g: 0, b: 0 } };
  }

  function loadImage(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error('图片加载失败')); };
      img.src = url;
    });
  }

  function addTextToImage(img, opts) {
    var canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var minDim = Math.min(canvas.width, canvas.height);
    var fontSize = Math.max(12, Math.round(minDim * 0.045));
    ctx.font = 'bold ' + fontSize + 'px Arial, "Microsoft YaHei", sans-serif';
    ctx.fillStyle = opts.color.css;
    ctx.textBaseline = 'bottom';
    var text = opts.text;
    var margin = Math.max(8, Math.round(minDim * 0.03));
    var tw = ctx.measureText(text).width;
    var x, y;
    switch (opts.pos) {
      case 'bl': x = margin; y = canvas.height - margin; break;
      case 'tr': x = canvas.width - tw - margin; y = fontSize + margin; break;
      case 'tl': x = margin; y = fontSize + margin; break;
      case 'bc': x = (canvas.width - tw) / 2; y = canvas.height - margin; break;
      case 'br': default: x = canvas.width - tw - margin; y = canvas.height - margin; break;
    }
    ctx.fillText(text, x, y);
    return canvas;
  }

  async function addTextToPdf(arrayBuffer, opts) {
    var PDFLib = window.PDFLib;
    var pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    var font = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
    var pages = pdfDoc.getPages();
    pages.forEach(function (page) {
      var w = page.getWidth(), h = page.getHeight();
      var minDim = Math.min(w, h);
      var size = Math.max(8, Math.round(minDim * 0.045));
      var margin = Math.max(6, minDim * 0.04);
      var text = opts.text;
      var tw = font.widthOfTextAtSize(text, size);
      var x, y;
      switch (opts.pos) {
        case 'bl': x = margin; y = margin; break;
        case 'tr': x = w - tw - margin; y = h - size - margin; break;
        case 'tl': x = margin; y = h - size - margin; break;
        case 'bc': x = (w - tw) / 2; y = margin; break;
        case 'br': default: x = w - tw - margin; y = margin; break;
      }
      page.drawText(text, { x: x, y: y, size: size, font: font, color: PDFLib.rgb(opts.color.rgb.r, opts.color.rgb.g, opts.color.rgb.b) });
    });
    return await pdfDoc.save();
  }

  async function processMiFile(file) {
    var text = $('mi-text').value.trim() || 'Made in China';
    var opts = { text: text, pos: $('mi-pos').value, color: miColor() };
    var ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'pdf') {
      if (/[\u4e00-\u9fa5]/.test(text)) {
        throw new Error('PDF 内置字体不支持中文，请改用英文（如 Made in China），或将 PDF 转为图片');
      }
      var ab = await file.arrayBuffer();
      var bytes = await addTextToPdf(ab, opts);
      return new Blob([bytes], { type: 'application/pdf' });
    } else {
      var img = await loadImage(file);
      var canvas = addTextToImage(img, opts);
      if (ext === 'png') {
        return await new Promise(function (res) { canvas.toBlob(res, 'image/png'); });
      } else {
        return await new Promise(function (res) { canvas.toBlob(res, 'image/jpeg', 0.92); });
      }
    }
  }

  function outputNameByName(name) {
    var dot = name.lastIndexOf('.');
    var base = dot > 0 ? name.slice(0, dot) : name;
    var ext = name.split('.').pop().toLowerCase();
    var newExt = ext === 'pdf' ? 'pdf' : ext === 'png' ? 'png' : 'jpg';
    return base + '_madeinchina.' + newExt;
  }

  $('mi-run').addEventListener('click', async function () {
    if (!miFiles.length) { toast('请先选择文件'); return; }
    if (!window.PDFLib) { toast('PDF 组件未加载，请检查网络'); }
    $('mi-run').disabled = true;
    $('mi-run').innerHTML = '<span class="spin"></span> 处理中…';
    var failCount = 0;
    for (var i = 0; i < miFiles.length; i++) {
      var f = miFiles[i];
      miResults[f.name] = 'processing'; renderMiFiles();
      try {
        var blob = await processMiFile(f);
        miResults[f.name] = blob;
      } catch (e) {
        miResults[f.name] = { error: e.message };
        failCount++;
      }
      renderMiFiles();
    }
    $('mi-run').disabled = false;
    $('mi-run').textContent = '添加标注并下载';
    toast(failCount ? '完成，' + failCount + ' 个文件失败（见下方提示）' : '全部处理完成');
    renderMiDownloadLinks();
  });

  function renderMiDownloadLinks() {
    var box = $('mi-file-list');
    // 追加下载链接区
    var links = Object.keys(miResults).map(function (name) {
      var r = miResults[name];
      if (r && r.error) return null;
      if (r && r !== 'processing' && r instanceof Blob) return name;
      return null;
    }).filter(Boolean);
    if (!links.length) return;
    var prev = $('mi-links');
    if (prev) prev.remove();
    var div = document.createElement('div');
    div.id = 'mi-links';
    div.style.marginTop = '12px';
    div.innerHTML = '<div style="font-size:13px;font-weight:600;margin-bottom:8px;">⬇️ 下载结果：</div>' +
      links.map(function (name) {
        return '<div class="result-item"><span class="name" style="flex:1;">' + escapeHtml(outputNameByName(name)) + '</span>' +
          '<button class="btn btn-primary btn-sm" data-mi-dl="' + encodeURIComponent(name) + '">下载</button></div>';
      }).join('');
    $('mi-file-list').after(div);
    div.querySelectorAll('[data-mi-dl]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var name = decodeURIComponent(btn.getAttribute('data-mi-dl'));
        var r = miResults[name];
        if (r instanceof Blob) {
          var url = URL.createObjectURL(r);
          var a = document.createElement('a');
          a.href = url; a.download = outputNameByName(name); a.click();
          setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
        }
      });
    });
  }

  $('mi-zip').addEventListener('click', async function () {
    var blobs = Object.keys(miResults).filter(function (n) { return miResults[n] instanceof Blob; });
    if (!blobs.length) { toast('请先处理文件'); return; }
    if (!window.JSZip) { toast('ZIP 组件未加载'); return; }
    var zip = new JSZip();
    blobs.forEach(function (name) { zip.file(outputNameByName(name), miResults[name]); });
    var content = await zip.generateAsync({ type: 'blob' });
    var url = URL.createObjectURL(content);
    var a = document.createElement('a');
    a.href = url; a.download = 'made_in_china_batch.zip'; a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  });

  $('mi-clear').addEventListener('click', function () {
    miFiles = []; miResults = {}; renderMiFiles();
    var prev = $('mi-links'); if (prev) prev.remove();
  });

  /* =============================================================
   * 四、HS 编码查询
   * ============================================================= */
  function allHSData() {
    return window.HS_CODES.map(function (c) { return { code: c.code, cn: c.cn, en: c.en }; });
  }
  $('hs-search').addEventListener('click', function () {
    var lines = $('hs-input').value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    if (!lines.length) { toast('请输入关键词或编码'); return; }
    var data = allHSData();
    var box = $('hs-result');
    var html = '';
    lines.forEach(function (q) {
      var res = L.searchHS(data, q, 8);
      html += '<div style="font-size:13px;color:#6b7280;margin:10px 0 6px;font-weight:600;">🔎 「' + escapeHtml(q) + '」 ' +
        (res.length ? '找到 ' + res.length + ' 条' : '无结果') + '</div>';
      if (!res.length) {
        html += '<div class="result-item"><span class="in">未找到匹配，请尝试其他关键词</span></div>';
      }
      res.forEach(function (item) {
        html += '<div class="hs-item"><span class="code">' + escapeHtml(item.code) + '</span>' +
          '<span class="info"><span class="cn">' + escapeHtml(item.cn) + '</span><br/><span class="en">' + escapeHtml(item.en) + '</span></span>' +
          '<button class="btn btn-outline btn-sm copy-btn">复制编码</button></div>';
      });
    });
    box.innerHTML = html;
    box.querySelectorAll('.copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        copyText(btn.closest('.hs-item').querySelector('.code').textContent);
      });
    });
  });
  $('hs-clear').addEventListener('click', function () { $('hs-input').value = ''; $('hs-result').innerHTML = ''; });

  (function renderChapters() {
    $('hs-chapters').innerHTML = window.HS_CHAPTERS.map(function (c) {
      return '<div class="chapter-chip" data-code="' + c.code + '" title="' + escapeHtml(c.cn) + ' · ' + escapeHtml(c.en) + '">' +
        '<b>' + c.code + '</b><span>' + escapeHtml(c.cn) + '</span></div>';
    }).join('');
    $('hs-chapters').querySelectorAll('.chapter-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var code = chip.getAttribute('data-code');
        $('hs-input').value = ($('hs-input').value.trim() + '\n' + code).trim();
        toast('已加入查询：第 ' + code + ' 章');
      });
    });
  })();

  /* =============================================================
   * 五、标题拆分
   * ============================================================= */
  $('title-run').addEventListener('click', function () {
    var tLimit = parseInt($('title-limit-title').value) || 75;
    var hLimit = parseInt($('title-limit-hl').value) || 125;
    var lines = $('title-input').value.split('\n');
    var box = $('title-result');
    var html = '';
    var copyBuf = [];
    lines.forEach(function (line, idx) {
      if (!line.trim()) { copyBuf.push(''); return; }
      // 标题
      var t = L.processTitle(line, tLimit);
      var tBadge = t.over ? '<span class="badge badge-over">超长，已截断</span>' : '<span class="badge badge-ok">OK</span>';
      // 亮点（拆成多段）
      var chunks = L.splitHighlight(line, hLimit);
      var chunkHtml = chunks.map(function (c) {
        var over = L.charCount(c) > hLimit;
        return '<div style="margin:2px 0;">▪ ' + escapeHtml(c) +
          ' <span class="badge ' + (over ? 'badge-over' : 'badge-ok') + '">' + L.charCount(c) + ' 字符</span></div>';
      }).join('');
      html += '<div class="result-item" style="display:block;">' +
        '<div style="font-size:12px;color:#6b7280;margin-bottom:4px;">第 ' + (idx + 1) + ' 行 · 原文 ' + L.charCount(line) + ' 字符</div>' +
        '<div style="margin:4px 0;"><span class="badge badge-info">标题 ≤' + tLimit + '</span> ' + tBadge +
        '<div style="margin-top:4px;font-weight:600;">' + escapeHtml(t.text) + ' <span class="badge badge-info">' + t.count + ' 字符</span></div></div>' +
        '<div style="margin:8px 0 4px;"><span class="badge badge-info">亮点 ≤' + hLimit + '</span>（拆为 ' + chunks.length + ' 段）</div>' + chunkHtml +
        '</div>';
      copyBuf.push('【标题】' + t.text + '\n【亮点】\n' + chunks.map(function (c) { return '- ' + c; }).join('\n'));
    });
    box.innerHTML = html;
    $('title-result')._copyBuf = copyBuf.join('\n\n');
  });
  $('title-copy').addEventListener('click', function () {
    var buf = $('title-result')._copyBuf;
    if (buf) copyText(buf); else toast('请先拆分处理');
  });
  $('title-clear').addEventListener('click', function () {
    $('title-input').value = ''; $('title-result').innerHTML = ''; $('title-result')._copyBuf = '';
  });

  /* =============================================================
   * 六、大小写转换
   * ============================================================= */
  document.querySelectorAll('[data-case]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var mode = btn.getAttribute('data-case');
      var lines = $('case-input').value.split('\n');
      var box = $('case-result');
      var html = '';
      var copyBuf = [];
      lines.forEach(function (line) {
        var r = L.applyCase(line, mode);
        copyBuf.push(r);
        html += '<div class="result-item"><span class="in">' + escapeHtml(line || '&nbsp;') + '</span>' +
          '<span class="out">' + escapeHtml(r || '&nbsp;') + '</span>' +
          '<button class="btn btn-outline btn-sm copy-btn">复制</button></div>';
      });
      box.innerHTML = html;
      $('case-result')._copyBuf = copyBuf.join('\n');
      bindCopyButtons(box);
    });
  });
  $('case-copy').addEventListener('click', function () {
    var buf = $('case-result')._copyBuf;
    if (buf !== undefined && buf !== '') copyText(buf); else toast('请先转换');
  });
  $('case-clear').addEventListener('click', function () {
    $('case-input').value = ''; $('case-result').innerHTML = ''; $('case-result')._copyBuf = '';
  });

  /* ---------------- 初始化 ---------------- */
  fillUnitSelects();
  fillCurrencySelects();
  fetchRates(false);
})();
