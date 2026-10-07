/* Oracle — First Trial frontend helpers */

function getOracleLevel() {
    var stored = localStorage.getItem('oracle1_level');
    if (!stored) return 1;
    var num = parseInt(stored, 10);
    return isNaN(num) ? 1 : num;
}

function setOracleLevel(level) {
    if (level > getOracleLevel()) {
        localStorage.setItem('oracle1_level', level.toString());
    }
}

function getOracleToken() {
    return localStorage.getItem('oracle1_download_token') || '';
}

function setOracleToken(tok) {
    if (tok) localStorage.setItem('oracle1_download_token', tok);
}

function isWarriorNamed() {
    return localStorage.getItem('oracle1_warrior_named') === 'true';
}

function setWarriorNamed() {
    localStorage.setItem('oracle1_warrior_named', 'true');
    setOracleLevel(5);
}

var LEVEL_NODES = [
    { num: 1, label: 'I \u2014 The Gate' },
    { num: 2, label: 'II \u2014 Allegiance' },
    { num: 3, label: 'III \u2014 Lineage' },
    { num: 4, label: 'IV \u2014 The Fate' }
];

function renderHeaderAndNav(activeLevel, pageTitle) {
    document.title = pageTitle;
    var current = getOracleLevel();

    var headerEl = document.getElementById('oracle-header-slot');
    if (headerEl) {
        var html = '<header class="oracle-header">' +
            '<div class="oracle-title">Sanjaya\'s Oracle</div>' +
            '<div class="oracle-subtitle">Kurukshetra War Registry &nbsp;\u00b7&nbsp; Truth Spoken One Breath at a Time</div>' +
            '</header>' +
            '<nav class="level-bar" aria-label="Challenge progress">';
        for (var i = 0; i < LEVEL_NODES.length; i++) {
            var node = LEVEL_NODES[i], state = '';
            if (current > node.num) state = 'done';
            else if (activeLevel === node.num) state = 'active';
            html += '<div class="level-node ' + state + '" aria-current="' + (state === 'active' ? 'step' : 'false') + '">' +
                '<span class="level-dot"></span>' + node.label + '</div>';
            if (node.num < 4) html += '<span class="level-sep" aria-hidden="true">\u203a</span>';
        }
        html += '</nav>';
        headerEl.innerHTML = html;
    }

    var footerEl = document.getElementById('oracle-footer-slot');
    if (footerEl) {
        footerEl.innerHTML = '<footer class="oracle-footer">' +
            '<p>\u2694 &nbsp; Kurukshetra War Registry \u2014 Sanjaya\'s Oracle &nbsp; \u2694</p>' +
            '<p style="margin-top:0.4rem; font-size:0.75rem; opacity:0.6;">' +
            '\u092f\u0924\u094d\u0930 \u092f\u094b\u0917\u0947\u0936\u094d\u0935\u0930\u0903 \u0915\u0943\u0937\u094d\u0923\u0903 \u2014 Where Krishna is master of Yoga' +
            '</p></footer>';
    }
}

function oraclePost(path, body) {
    return fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }).then(function (r) { return r.json(); });
}

function oracleLogin(username, password) {
    return oraclePost('/api/login.php', { username: username, password: password });
}

function oracleQuery(q) {
    return oraclePost('/api/query.php', { q: q });
}

function oracleCheck(type, value) {
    return oraclePost('/api/check.php', { type: type, value: value });
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

function renderResultsTable(el, rows) {
    if (!rows || !rows.length) {
        el.innerHTML = '<div class="no-results">-- 0 rows returned --</div>';
        return;
    }
    var html = '<table class="results-table"><thead><tr><th>col_1</th><th>col_2</th></tr></thead><tbody>';
    for (var i = 0; i < rows.length; i++) {
        html += '<tr><td>' + escapeHtml(rows[i][0] == null ? '' : rows[i][0]) + '</td><td>' +
                escapeHtml(rows[i][1] == null ? '' : rows[i][1]) + '</td></tr>';
    }
    html += '</tbody></table><div class="row-count">' + rows.length + ' row(s) returned.</div>';
    el.innerHTML = html;
}

function verifyGateAccess(requiredLevel) {
    var cur = getOracleLevel();
    if (cur < requiredLevel) {
        var back = (requiredLevel <= 2) ? 'index.html' : 'level' + (requiredLevel - 1) + '.html';
        window.location.replace(back + '?err=locked');
        return false;
    }
    return true;
}
