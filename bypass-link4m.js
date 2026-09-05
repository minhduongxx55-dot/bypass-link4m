// ==UserScript==
// @name         Bypass Link4m - By Chungdeptraivcl
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  thêm mới tự động lấy url và xác định loại task
// @icon         https://png.pngtree.com/png-vector/20260105/ourmid/pngtree-pointing-cat-meme-sticker-vector-cute-illustration-png-image_18426970.webp
// @match        https://link4m.org/go/*
// @match        https://link4m.net/go/*
// @match        https://link4m.com/go/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @connect      s1.link4m.app
// @connect      s1.what-on.com
// @connect      website-analytics.net
// @connect      userscript-mapping-server--tijawi6194.replit.app
// @connect      link4m.org
// @connect      *.replit.dev
// @connect      *.replit.app
// @connect      *
// ==/UserScript==

(function() {
    'use strict';

    const SERVER = 'https://userscript-mapping-server--michaelbirdchri.replit.app/api';
    const log = console.log.bind(console, '[Link4m]');
    const error = console.error.bind(console, '[Link4m]');

    const DOMAIN_MAP = {
        'what_on': 's1.what-on.com',
        'website_analytics': 'website-analytics.net'
    };

    let currentDisplayId = '';
    let currentAlias = '';

    // ---------- 1. GIAO DIỆN NỀN TỐI & BỘ ĐẾM NGƯỢC ----------
    function injectDarkTheme() {
        GM_addStyle(`
            #advertise-html-wrapper,
            #mainNav,
            footer,
            .camp_yoads,
            #fb-root,
            .fb-customerchat,
            .to_top,
            #main-form-2,
            .style-4,
            .section-head,
            iframe[src*="youtube"],
            #main-form .get-link {
                display: none !important;
            }

            html, body, .captcha-page {
                background-color: #0b0f19 !important;
                color: #f8fafc !important;
                font-family: system-ui, -apple-system, sans-serif !important;
            }

            .container, .box-main, .box-body {
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
                padding: 0 !important;
                margin: 0 auto !important;
            }

            #captcha-html-wrapper {
                max-width: 480px !important;
                margin: 40px auto 30px !important;
                padding: 28px 24px !important;
                background: #111827 !important;
                border: 1px solid #1f2937 !important;
                border-radius: 16px !important;
                box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7) !important;
            }

            #captcha-html-wrapper h4 {
                color: #e2e8f0 !important;
                font-size: 18px !important;
                font-weight: 700 !important;
                margin-bottom: 18px !important;
                text-align: center !important;
            }

            #l4m-status-card {
                background: #1e293b !important;
                border: 2px solid #38bdf8 !important;
                border-radius: 12px !important;
                padding: 16px 18px !important;
                margin-bottom: 20px !important;
                text-align: center !important;
                box-shadow: 0 4px 15px rgba(56, 189, 248, 0.15) !important;
                display: block !important;
            }
            #l4m-status-title {
                font-size: 13px !important;
                font-weight: 700 !important;
                color: #94a3b8 !important;
                text-transform: uppercase !important;
                letter-spacing: 0.05em !important;
                margin-bottom: 6px !important;
            }
            #l4m-status-timer {
                font-size: 36px !important;
                font-weight: 900 !important;
                color: #38bdf8 !important;
                font-family: ui-monospace, SFMono-Regular, Menlo, monospace !important;
                line-height: 1.2 !important;
            }
            #l4m-status-bar-container {
                width: 100%;
                background: #334155;
                height: 6px;
                border-radius: 3px;
                margin-top: 10px;
                overflow: hidden;
            }
            #l4m-status-bar {
                width: 100%;
                background: #38bdf8;
                height: 100%;
                transition: width 1s linear;
            }

            #l4m-status-card.success {
                background: #064e3b !important;
                border-color: #10b981 !important;
            }
            #l4m-status-card.success #l4m-status-title { color: #a7f3d0 !important; }
            #l4m-status-card.success #l4m-status-timer { color: #34d399 !important; font-size: 24px !important; }
            #l4m-status-card.success #l4m-status-bar-container { display: none !important; }

            #main-form input[name="password"] {
                background: #0f172a !important;
                border: 2px solid #334155 !important;
                color: #38bdf8 !important;
                font-size: 24px !important;
                font-weight: 700 !important;
                font-family: ui-monospace, SFMono-Regular, Menlo, monospace !important;
                letter-spacing: 4px !important;
                text-align: center !important;
                height: 52px !important;
                border-radius: 8px !important;
            }

            #recaptcha {
                display: flex !important;
                justify-content: center !important;
                margin: 15px 0 !important;
            }

            #l4m-native-report-btn {
                width: 100% !important;
                padding: 10px 20px !important;
                font-size: 14px !important;
                font-weight: 600 !important;
                display: block !important;
                margin-top: 10px !important;
                text-align: center !important;
            }

            #l4m-destination-card {
                background: #064e3b;
                border: 2px solid #10b981;
                border-radius: 14px;
                padding: 18px 16px;
                margin-top: 20px;
                text-align: center;
                animation: fadeIn 0.4s ease-in-out;
            }
            #l4m-destination-url-box {
                background: #0b0f19;
                border: 1px dashed #34d399;
                padding: 10px 12px;
                border-radius: 8px;
                color: #6ee7b7;
                font-family: ui-monospace, monospace;
                font-size: 14px;
                word-break: break-all;
                margin: 10px 0 15px;
            }
            .l4m-action-btn-group {
                display: flex;
                gap: 10px;
            }
            .l4m-btn-copy {
                flex: 1;
                background: #0284c7;
                color: #ffffff;
                border: none;
                padding: 10px 14px;
                border-radius: 8px;
                font-weight: 700;
                font-size: 14px;
                cursor: pointer;
            }
            .l4m-btn-open {
                flex: 1;
                background: #059669;
                color: #ffffff;
                border: none;
                padding: 10px 14px;
                border-radius: 8px;
                font-weight: 700;
                font-size: 14px;
                text-decoration: none;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            #l4m-new-task-alert {
                background: #1e1b4b;
                border: 2px solid #6366f1;
                border-radius: 14px;
                padding: 18px 20px;
                margin-bottom: 20px;
                text-align: center;
            }

            #l4m-author-credit {
                text-align: center;
                margin-top: 20px;
                font-size: 13px;
                font-weight: 600;
                color: #64748b;
                letter-spacing: 0.5px;
                user-select: none;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-8px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `);
    }

    function ensureStatusCard() {
        let card = document.getElementById('l4m-status-card');
        if (card) return card;

        const wrapper = document.getElementById('captcha-html-wrapper');
        if (!wrapper) return null;

        card = document.createElement('div');
        card.id = 'l4m-status-card';
        card.innerHTML = `
            <div id="l4m-status-title">Trạng thái luồng tự động</div>
            <div id="l4m-status-timer">Đang khởi tạo...</div>
            <div id="l4m-status-bar-container">
                <div id="l4m-status-bar"></div>
            </div>
        `;

        const form = wrapper.querySelector('form');
        if (form && form.parentNode) {
            form.before(card);
        } else {
            wrapper.prepend(card);
        }
        return card;
    }

    function renderCustomUI() {
        ensureStatusCard();

        const wrapper = document.getElementById('captcha-html-wrapper');

        if (wrapper && !document.getElementById('l4m-author-credit')) {
            const creditEl = document.createElement('div');
            creditEl.id = 'l4m-author-credit';
            creditEl.textContent = '© Bypass by Chungdeptraivcl';
            wrapper.appendChild(creditEl);
        }

        const form = document.getElementById('main-form');
        const submitGroup = form?.querySelector('.form-group:last-child');

        if (submitGroup && !document.getElementById('l4m-native-report-btn')) {
            const reportBtn = document.createElement('a');
            reportBtn.className = 'btn btn-danger';
            reportBtn.id = 'l4m-native-report-btn';
            reportBtn.setAttribute('data-toggle', 'modal');
            reportBtn.setAttribute('data-target', '#modal-report');
            reportBtn.textContent = 'Báo lỗi';
            if (currentDisplayId) {
                reportBtn.setAttribute('data-advertise_id', currentDisplayId);
            }
            submitGroup.appendChild(reportBtn);
        }
    }

    function updateUIStatus(title, text, isSuccess = false, progressPercent = null) {
        const card = ensureStatusCard();
        if (!card) return;

        const titleEl = document.getElementById('l4m-status-title');
        const timerEl = document.getElementById('l4m-status-timer');
        const bar = document.getElementById('l4m-status-bar');

        if (titleEl) titleEl.textContent = title;
        if (timerEl) timerEl.textContent = text;
        if (bar && progressPercent !== null) {
            bar.style.width = `${Math.max(0, Math.min(100, progressPercent))}%`;
        }

        if (card) {
            if (isSuccess) card.classList.add('success');
            else card.classList.remove('success');
        }
    }

    async function countdownWithUI(seconds, stageTitle) {
        const total = seconds;
        let remaining = seconds;
        while (remaining > 0) {
            const percent = Math.round((remaining / total) * 100);
            updateUIStatus(stageTitle, `${remaining}s`, false, percent);
            await new Promise(r => setTimeout(r, 1000));
            remaining--;
        }
        updateUIStatus(stageTitle, 'Đang gửi yêu cầu...', false, 0);
    }

    // ---------- 2. THÔNG BÁO BLACKLIST & BÁO LỖI (600S) ----------
    function showNewTaskAlert(displayId, customMessage) {
        const wrapper = document.getElementById('captcha-html-wrapper');
        if (!wrapper || document.getElementById('l4m-new-task-alert')) return;

        const alertBox = document.createElement('div');
        alertBox.id = 'l4m-new-task-alert';
        alertBox.innerHTML = `
            <div style="font-size: 16px; font-weight: 800; color: #f87171; margin-bottom: 6px;">
                ⚠️ THÔNG BÁO HỆ THỐNG
            </div>
            <div style="font-size: 14px; color: #e2e8f0; line-height: 1.5; margin-bottom: 12px;">
                ${customMessage || 'Nhiệm vụ này đã bị đưa vào blacklist'}
            </div>
            <div id="l4m-report-status" style="font-size: 13px; color: #38bdf8; margin-bottom: 10px;">
                ⏳ Đang gửi yêu cầu báo lỗi tự động...
            </div>
            <div id="l4m-600s-timer" style="font-size: 28px; font-weight: 800; color: #fbbf24; font-family: monospace;">
                600s
            </div>
        `;
        wrapper.prepend(alertBox);

        sendAutoReport(displayId);

        let seconds = 600;
        const timer = setInterval(() => {
            seconds--;
            const timerEl = document.getElementById('l4m-600s-timer');
            if (timerEl) timerEl.textContent = `${seconds}s`;
            if (seconds <= 0) {
                clearInterval(timer);
                window.location.reload();
            }
        }, 1000);
    }

    function sendAutoReport(displayId) {
        if (!displayId) return;
        const reportData = `modal-report-error=2&modal-report-reason=&modal-report-advertise-id=${encodeURIComponent(displayId)}`;

        request(
            'POST',
            'https://link4m.org/links/report',
            reportData,
            {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
                'Origin': 'https://link4m.org',
                'Referer': location.href
            }
        ).then(res => {
            const statusEl = document.getElementById('l4m-report-status');
            try {
                const json = JSON.parse(res.text);
                if (json.success === true) {
                    if (statusEl) statusEl.textContent = '✅ Đã gửi báo lỗi thành công! Đang chờ đổi nhiệm vụ...';
                    log('✅ Tự động báo lỗi thành công:', json.info);
                    return;
                }
            } catch {}
            if (statusEl) statusEl.textContent = 'ℹ️ Đã gửi tín hiệu báo lỗi tới Link4m.';
        }).catch(() => {
            const statusEl = document.getElementById('l4m-report-status');
            if (statusEl) statusEl.textContent = '⚠️ Không thể gửi báo lỗi tự động, vui lòng bấm nút Báo lỗi bên dưới.';
        });
    }

    // Gọi API đưa nhiệm vụ vào Blacklist công khai
    async function reportBlacklist(campaign_id, prefix, taskType, reason) {
        log(`🚫 Báo cáo đưa task ${campaign_id} vào Blacklist... Lý do: ${reason}`);
        try {
            const payload = {
                campaign_id: campaign_id,
                prefix: prefix || '',
                task_type: taskType || 'what_on',
                reason: reason || 'Nhiệm vụ này đã bị đưa vào blacklist'
            };
            const resp = await request('POST', `${SERVER}/task/report-blacklist`, payload);
            let resJson = {};
            try { resJson = JSON.parse(resp.text); } catch {}
            log('✅ Kết quả phản hồi Blacklist:', resJson);
            return resJson;
        } catch (err) {
            error('❌ Lỗi khi gửi report-blacklist:', err);
            return null;
        }
    }

    // ---------- 3. HIỂN THỊ LINK GỐC KÈM [COPY LINK] VÀ [MỞ LINK] ----------
    function showDestinationCard(destinationUrl) {
        if (!destinationUrl || document.getElementById('l4m-destination-card')) return;

        const wrapper = document.getElementById('captcha-html-wrapper');
        if (!wrapper) return;

        const statusCard = document.getElementById('l4m-status-card');
        const mainForm = document.getElementById('main-form');
        if (statusCard) statusCard.style.display = 'none';
        if (mainForm) mainForm.style.display = 'none';

        const destCard = document.createElement('div');
        destCard.id = 'l4m-destination-card';
        destCard.innerHTML = `
            <div style="font-size: 18px; font-weight: 800; color: #34d399; margin-bottom: 6px;">
                🎉 ĐÃ LẤY ĐƯỢC LINK GỐC THÀNH CÔNG!
            </div>
            <div style="font-size: 13px; color: #a7f3d0; margin-bottom: 4px;">
                Đường dẫn trang đích của bạn:
            </div>
            <div id="l4m-destination-url-box">${destinationUrl}</div>
            <div class="l4m-action-btn-group">
                <button type="button" class="l4m-btn-copy" id="l4m-copy-btn">📋 Copy Link</button>
                <a href="${destinationUrl}" target="_blank" rel="noopener noreferrer" class="l4m-btn-open">🔗 Mở Link (Tab mới)</a>
            </div>
            <div style="text-align: center; margin-top: 15px; font-size: 13px; font-weight: 600; color: #6ee7b7; user-select: none;">
                © Chungdeptraivcl
            </div>
        `;

        wrapper.appendChild(destCard);

        document.getElementById('l4m-copy-btn').onclick = function() {
            GM_setClipboard(destinationUrl);
            this.textContent = '✅ Đã Copy!';
            setTimeout(() => { this.textContent = '📋 Copy Link'; }, 2000);
        };
    }

    // ---------- 4. GIẢ LẬP GÕ MÃ & TỰ ĐỘNG SUBMIT SAU CAPTCHA ----------
    async function typeLikeHuman(inputElement, text) {
        if (!inputElement) return;

        inputElement.focus();
        inputElement.value = '';
        inputElement.dispatchEvent(new Event('focus', { bubbles: true }));

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: char, code: `Key${char.toUpperCase()}`, bubbles: true }));
            inputElement.dispatchEvent(new KeyboardEvent('keypress', { key: char, code: `Key${char.toUpperCase()}`, bubbles: true }));

            inputElement.value += char;

            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            inputElement.dispatchEvent(new KeyboardEvent('keyup', { key: char, code: `Key${char.toUpperCase()}`, bubbles: true }));

            const delay = 120 + Math.floor(Math.random() * 130);
            await new Promise(r => setTimeout(r, delay));
        }

        inputElement.dispatchEvent(new Event('change', { bubbles: true }));
        inputElement.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    async function handleAutoSubmitAfterCaptcha(password) {
        const passwordInputs = document.querySelectorAll('#main-form input[name="password"], #password-2, input[name="password"]');
        if (passwordInputs.length === 0) return;

        const mainInput = document.querySelector('#main-form input[name="password"]') || passwordInputs[0];
        log(`⌨️ Bắt đầu gõ mã "${password}"...`);
        updateUIStatus('Đang nhập mã', 'Đang gõ mật mã...', true);

        await typeLikeHuman(mainInput, password);

        passwordInputs.forEach(input => {
            if (input !== mainInput) {
                input.value = password;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        log(`✅ Đã gõ mã xong: "${password}". Chờ người dùng giải Captcha...`);
        updateUIStatus('Chờ giải Captcha', '👉 Tích vào reCAPTCHA để nhận link!', true);

        const captchaCheck = setInterval(() => {
            const captchaTextarea = document.querySelector('textarea[name="g-recaptcha-response"]');
            if (captchaTextarea && captchaTextarea.value && captchaTextarea.value.trim().length > 0) {
                clearInterval(captchaCheck);
                log('🎯 Phát hiện Captcha hoàn tất! Tự động gửi lệnh xác minh...');
                updateUIStatus('Đang mở khóa', 'Đang xác minh mật mã với máy chủ...', true);

                if (typeof unsafeWindow.checkPassword === 'function') {
                    unsafeWindow.checkPassword(captchaTextarea.value);
                } else {
                    const form = document.querySelector('#main-form');
                    if (form) form.submit();
                }
            }
        }, 400);
    }

    // ---------- 5. LOGIC HỆ THỐNG & BÓC TÁCH THỜI GIAN ----------
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function getClientId() {
        let id = localStorage.getItem('link4m_client_id');
        if (!id) {
            id = generateUUID();
            localStorage.setItem('link4m_client_id', id);
        }
        return id;
    }

    function decodeHexEscapes(str) {
        if (!str) return '';
        return str.replace(/\\x([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    }

    function getCampaignFieldValue(htmlText, fieldName) {
        if (!htmlText || !fieldName) return '';
        const doc = new DOMParser().parseFromString(htmlText, 'text/html');
        const input = doc.querySelector(`input[name="${fieldName}"]`);
        if (!input) return '';
        return (input.getAttribute('value') || input.value || '').trim();
    }

    function extractLink4mWaitTime(htmlText) {
        if (!htmlText) return 60;
        const match = htmlText.match(/chờ\s*(\d+)\s*(?:giây|s)/i);
        if (match) {
            const seconds = parseInt(match[1], 10);
            if (seconds >= 30 && seconds <= 180) {
                return seconds;
            }
        }
        return 60;
    }

    function extractWidgetKeyFromHtml(htmlText) {
        if (!htmlText) return null;
        const patterns = [
            /(?:what-on\.com|website-analytics\.net)\/widget\/[^\s"']*?[?&]key=([a-zA-Z0-9_-]+)/i,
            /service[a-zA-Z0-9_-]*\.js\?[^\s"']*?[?&]key=([a-zA-Z0-9_-]+)/i,
            /[?&]key=([a-zA-Z0-9_-]+)/i,
            /data-key=["']([a-zA-Z0-9_-]+)["']/i,
            /data-widget-key=["']([a-zA-Z0-9_-]+)["']/i
        ];
        for (const pat of patterns) {
            const m = htmlText.match(pat);
            if (m && m[1] && m[1].toLowerCase() !== 'service') {
                return m[1];
            }
        }
        return null;
    }

    function findCandidateArticleUrls(doc, baseCleanUrl) {
        const targetHost = new URL(baseCleanUrl).hostname;
        const candidates = new Set();

        const prioritySelectors = [
            'article a[href]',
            '.post a[href]',
            '.entry-title a[href]',
            '.post-title a[href]',
            'h2 a[href]',
            'h3 a[href]',
            'a[href*="tin-tuc"]',
            'a[href*="huong-dan"]',
            'a[href*="bai-viet"]'
        ];

        function checkAndAdd(href) {
            if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.includes('wp-admin')) return;
            try {
                const parsed = new URL(href, baseCleanUrl);
                if (parsed.hostname === targetHost) {
                    const cleanHref = parsed.origin + parsed.pathname;
                    if (cleanHref !== baseCleanUrl && cleanHref !== baseCleanUrl + '/') {
                        const hyphens = (parsed.pathname.match(/-/g) || []).length;
                        if (hyphens >= 2 || parsed.pathname.length > 12) {
                            candidates.add(parsed.href);
                        }
                    }
                }
            } catch {}
        }

        doc.querySelectorAll(prioritySelectors.join(', ')).forEach(a => {
            checkAndAdd(a.getAttribute('href'));
        });

        if (candidates.size < 3) {
            doc.querySelectorAll('a[href]').forEach(a => {
                checkAndAdd(a.getAttribute('href'));
            });
        }

        return Array.from(candidates).slice(0, 5);
    }

    function extractCodeFromHtml(htmlText, key) {
        if (!htmlText) return '';
        const divMatch = htmlText.match(new RegExp(`<div[^>]*id=["']${key}["'][^>]*data-code=["']([^"']+)["']`, 'i')) ||
                         htmlText.match(/data-code=["']([a-zA-Z0-9_-]{10,})["']/i) ||
                         htmlText.match(/data-traffic-code=["']([a-zA-Z0-9_-]{10,})["']/i);
        if (divMatch) return divMatch[1];
        return '';
    }

    function request(method, url, data = null, headers = {}) {
        return new Promise((resolve, reject) => {
            const opts = {
                method: method,
                url: url,
                headers: Object.assign({
                    'User-Agent': navigator.userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                }, headers),
                timeout: 25000,
                onload: (resp) => {
                    resolve({ status: resp.status, text: resp.responseText, headers: resp.responseHeaders });
                },
                onerror: (err) => {
                    const statusText = err?.statusText || (err?.status === 0 ? 'Mạng lỗi / Bị chặn kết nối (Status 0)' : `HTTP ${err?.status}`);
                    reject(new Error(`${statusText} khi kết nối tới: ${url}`));
                },
                ontimeout: () => {
                    reject(new Error(`Timeout quá 25s khi kết nối tới: ${url}`));
                }
            };
            if (data) {
                opts.data = typeof data === 'string' ? data : JSON.stringify(data);
                if (!headers['Content-Type']) {
                    opts.headers['Content-Type'] = 'application/json';
                }
            }
            GM_xmlhttpRequest(opts);
        });
    }

    function extractSessionAndCode(jsText, defaultDomain) {
        let session = '';
        let code = '';
        let traffic_domain = defaultDomain || 's1.what-on.com';

        if (!jsText) return { session, code, traffic_domain };

        const domainMatch = jsText.match(/traffic_domain\s*=\s*["']([^"']+)["']/i);
        if (domainMatch) traffic_domain = domainMatch[1];

        const sessionVarMatch = jsText.match(/traffic_session["']?\s*=\s*["']?\s*\+\s*([a-zA-Z0-9_$]+)/i);
        if (sessionVarMatch) {
            const varName = sessionVarMatch[1];
            const valMatch = jsText.match(new RegExp('(?:var|let|const)?\\s*' + varName + '\\s*=\\s*["\']([^"\']+)["\']', 'i'));
            if (valMatch) session = decodeHexEscapes(valMatch[1]);
        }
        if (!session) {
            const sessionDirectMatch = jsText.match(/traffic_session["']?\s*[:=]\s*["']([a-zA-Z0-9_-]{8,})["']/i);
            if (sessionDirectMatch) session = decodeHexEscapes(sessionDirectMatch[1]);
        }

        const codeVarMatch = jsText.match(/[?&]code["']?\s*=\s*["']?\s*\+\s*([a-zA-Z0-9_$]+)/i);
        if (codeVarMatch) {
            const varName = codeVarMatch[1];
            const valMatch = jsText.match(new RegExp('(?:var|let|const)?\\s*' + varName + '\\s*=\\s*["\']([^"\']+)["\']', 'i'));
            if (valMatch) code = decodeHexEscapes(valMatch[1]);
        }
        if (!code) {
            const codeDirectMatch = jsText.match(/(?:^|[^a-zA-Z0-9_$])code\s*[:=]\s*["']([a-zA-Z0-9_-]{8,})["']/i);
            if (codeDirectMatch) code = decodeHexEscapes(codeDirectMatch[1]);
        }

        return { session, code, traffic_domain };
    }

    function sendClickBeacon(campaign_id, display_id, prefix) {
        if (!campaign_id || !display_id || !prefix) return;
        request(
            'POST',
            'https://s1.link4m.app/widget/click.html',
            `campaign_id=${encodeURIComponent(campaign_id)}&display_id=${encodeURIComponent(display_id)}&code=${encodeURIComponent(prefix)}`,
            { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        ).catch(() => {});
    }

    const originalOpen = unsafeWindow.XMLHttpRequest.prototype.open;
    const originalSend = unsafeWindow.XMLHttpRequest.prototype.send;

    unsafeWindow.XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._url = url;
        return originalOpen.apply(this, [method, url, ...args]);
    };

    unsafeWindow.XMLHttpRequest.prototype.send = function(body) {
        const self = this;
        const url = self._url || '';

        if (typeof url === 'string' && url.includes('/api/campaign/get-advertise')) {
            self.addEventListener('load', function() {
                if (self.status === 200) {
                    try {
                        const data = JSON.parse(self.responseText);
                        handleCampaign(data, self._url);
                    } catch (e) {
                        error('Parse advertise error:', e);
                    }
                }
            });
        }

        if (typeof url === 'string' && url.includes('/links/get-link-info')) {
            self.addEventListener('load', function() {
                if (self.status === 200) {
                    try {
                        const data = JSON.parse(self.responseText);
                        if (data.success === true && data.url) {
                            log('🎯 BẮT ĐƯỢC LINK ĐÍCH THÀNH CÔNG:', data.url);
                            showDestinationCard(data.url);
                        }
                    } catch (e) {
                        error('Parse link-info error:', e);
                    }
                }
            });
        }

        return originalSend.apply(this, [body]);
    };

    async function handleCampaign(data, responseUrl = location.href) {
        const html = data.html || '';

        const campaign_id = getCampaignFieldValue(html, 'campaign_id');
        const prefix = getCampaignFieldValue(html, 'prefix');
        const display_id = getCampaignFieldValue(html, 'display_id');
        const alias = getCampaignFieldValue(html, 'alias');

        if (!campaign_id) {
            error('Không tìm thấy campaign_id');
            return;
        }

        currentDisplayId = display_id;
        currentAlias = alias;

        const link4mRequiredWait = extractLink4mWaitTime(html);
        log(`⏱️ Thời gian Link4m yêu cầu: ${link4mRequiredWait}s`);

        setTimeout(renderCustomUI, 200);

        log(`🔍 Kiểm tra Campaign ID cố định: ${campaign_id}`);
        sendClickBeacon(campaign_id, display_id, prefix);

        try {
            const checkQuery = new URLSearchParams({ campaign_id });
            if (prefix) checkQuery.set('prefix', prefix);
            const resp = await request('GET', `${SERVER}/task/check?${checkQuery.toString()}`);
            let result = {};
            try {
                result = JSON.parse(resp.text);
            } catch (errParse) {
                throw new Error(`Server trả về phản hồi không hợp lệ: ${resp.text?.slice(0, 100)}`);
            }

            // KIỂM TRA NẾU NHIỆM VỤ ĐÃ NẰM TRONG BLACKLIST
            if (result.blacklisted || result.action === 'change_task') {
                log('🚫 Nhiệm vụ này đã nằm trong Blacklist!');
                showNewTaskAlert(display_id, 'Nhiệm vụ này đã bị đưa vào blacklist');
                return;
            }

            if (result.found && result.target_url) {
                const taskType = result.task_type || 'what_on';
                log(`✅ TÌM THẤY URL: ${result.target_url} [Loại task: ${taskType}]`);
                updateUIStatus('Đã tìm thấy nhiệm vụ', 'Bắt đầu luồng xử lý ngầm...');
                await runFullBackground(result.target_url, campaign_id, prefix, taskType, link4mRequiredWait);
                return;
            }

            const images = collectImages(html, responseUrl);
            log(`📸 Campaign mới chưa có mapping. Gửi ${images.length} ảnh để phân tích...`);
            updateUIStatus('AI đang phân tích', 'Đang gửi ảnh và nhận diện URL...', false);
            const taskResponse = await createTask(campaign_id, prefix, images);

            const aiMapping = await waitForAiMapping(campaign_id, prefix, taskResponse);
            if (aiMapping) {
                log(`🤖 AI đã tìm thấy URL: ${aiMapping.target_url} [Loại task: ${aiMapping.task_type}]`);
                updateUIStatus('AI đã tìm thấy URL', 'Bắt đầu luồng xử lý ngầm...');
                await runFullBackground(
                    aiMapping.target_url,
                    campaign_id,
                    prefix,
                    aiMapping.task_type,
                    link4mRequiredWait,
                );
                return;
            }

            log('📸 AI không tìm thấy URL, đưa nhiệm vụ vào Blacklist...');
            await reportBlacklist(campaign_id, prefix, 'what_on', 'AI không nhận diện được URL từ ảnh');
            showNewTaskAlert(display_id, 'Nhiệm vụ này đã bị đưa vào blacklist');

        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            error('Lỗi xử lý campaign:', msg);
            showNewTaskAlert(display_id, `Nhiệm vụ này đã bị đưa vào blacklist (${msg})`);
        }
    }

    function delay(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    async function waitForAiMapping(campaign_id, prefix, initialResponse) {
        const maxAttempts = 180;
        const pollInterval = 2500;
        let latest = initialResponse;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const ai = latest?.ai || {};
            const targetUrl = ai.target_url || latest?.task?.target_url;
            const taskType = ai.task_type || latest?.task?.task_type || 'what_on';

            if (targetUrl) {
                return { target_url: targetUrl, task_type: taskType };
            }

            if (ai.status === 'fallback' || ai.status === 'failed') {
                log(`ℹ️ AI kết thúc với trạng thái ${ai.status}: ${ai.error || 'không có URL tự động'}`);
                return null;
            }

            const elapsedSeconds = Math.round((attempt * pollInterval) / 1000);
            updateUIStatus(
                'AI đang phân tích',
                `Đang nhận diện URL và loại task... ${elapsedSeconds}s`,
                false,
            );

            await delay(pollInterval);

            const query = new URLSearchParams({ campaign_id });
            if (prefix) query.set('prefix', prefix);

            const resp = await request('GET', `${SERVER}/task/check?${query.toString()}`);
            if (resp.status < 200 || resp.status >= 300) {
                throw new Error(`Không thể cập nhật trạng thái AI (HTTP ${resp.status})`);
            }

            try {
                latest = JSON.parse(resp.text);
            } catch {
                throw new Error(`Server trả về trạng thái AI không hợp lệ: ${resp.text?.slice(0, 100)}`);
            }
        }

        throw new Error('AI phân tích quá thời gian chờ.');
    }

    function collectImages(html, responseUrl = location.href) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        let baseUrl = responseUrl;
        try {
            baseUrl = new URL(responseUrl, location.href).href;
        } catch {
            baseUrl = location.href;
        }
        baseUrl = doc.querySelector('base')?.href || baseUrl;

        function getImgSrc(el) {
            if (!el) return null;
            for (const attr of ['src', 'data-src', 'data-lazy-src', 'data-original']) {
                const val = el.getAttribute(attr);
                if (val && val.trim()) return val.trim();
            }
            return null;
        }

        const images = new Set();
        const allImgs = doc.querySelectorAll('img');

        allImgs.forEach(img => {
            const src = getImgSrc(img);
            if (!src) return;
            if (src.includes('button-lay-ma') || src.includes('icon-copy')) return;

            if (src.startsWith('data:image')) {
                images.add(src);
                return;
            }

            try {
                const absoluteUrl = new URL(src, baseUrl);
                if (absoluteUrl.protocol === 'http:' || absoluteUrl.protocol === 'https:') {
                    images.add(absoluteUrl.href);
                }
            } catch {}
        });

        return Array.from(images);
    }

    async function createTask(campaign_id, prefix, images) {
        const payload = { campaign_id, prefix };
        if (images.length > 0) payload.images = images;
        try {
            const resp = await request('POST', `${SERVER}/task/new`, payload);
            return JSON.parse(resp.text);
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    async function fetchSignature(traffic_domain, key, client_id, traffic_session, campaign_code, cleanUrl) {
        const clientParams = new URLSearchParams();
        clientParams.append('key', key);
        clientParams.append('client_id', client_id);
        if (traffic_session) clientParams.append('traffic_session', traffic_session);
        if (campaign_code) clientParams.append('code', campaign_code);
        clientParams.append('screen', '1536 x 864');
        clientParams.append('language', navigator.language || 'vi-VN');
        clientParams.append('os', navigator.platform || 'Win32');
        clientParams.append('browser', navigator.userAgent);

        const clientResp = await request(
            'POST',
            `https://${traffic_domain}/widget/client.js`,
            clientParams.toString(),
            {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Referer': cleanUrl,
                'Origin': new URL(cleanUrl).origin
            }
        );

        const jsCode = clientResp.text || '';
        if (clientResp.status !== 200 || jsCode.length < 200) {
            throw new Error(`client.js trả về rỗng (Status: ${clientResp.status}, length: ${jsCode.length})`);
        }

        const win = unsafeWindow;
        win.jscd = {};
        delete win.jscd.request;

        try {
            win.eval(jsCode);
        } catch (e) {
            error('Lỗi khi eval jsCode:', e);
        }
        await new Promise(r => setTimeout(r, 1000));

        const sig = win.jscd?.request || null;
        if (!sig) throw new Error('Không lấy được signature mới từ jscd');
        return sig;
    }

    function buildQuestUrl(traffic_domain, params) {
        const url = new URL(`https://${traffic_domain}/widget/get_quest_code.html`);

        if (params.id) url.searchParams.set('id', params.id);
        if (params.code) url.searchParams.set('code', params.code);
        if (params.traffic_session) url.searchParams.set('traffic_session', params.traffic_session);
        if (params.key) url.searchParams.set('key', params.key);

        url.searchParams.set('screen', '1536 x 864');
        url.searchParams.set('browser', 'Chrome');
        url.searchParams.set('browserVersion', '152.0.0.0');
        url.searchParams.set('browserMajorVersion', '152');
        url.searchParams.set('mobile', 'false');
        url.searchParams.set('os', 'Windows');
        url.searchParams.set('osVersion', '10');
        url.searchParams.set('cookies', 'true');
        url.searchParams.set('flashVersion', 'no check');
        url.searchParams.set('lang', 'vi-VN');
        url.searchParams.set('client_id', params.client_id);

        url.searchParams.set('pathname', params.pathname);
        url.searchParams.set('href', params.href);
        url.searchParams.set('hostname', params.hostname);

        url.searchParams.set('request', params.request);

        return url.href;
    }

    // ---------- LUỒNG NGẦM HOÀN TOÀN ----------
    async function runFullBackground(targetUrl, campaign_id, prefix, taskType = 'what_on', link4mRequiredWait = 60) {
        log(`🚀 Bắt đầu luồng ngầm cho: ${targetUrl} [task_type: ${taskType}]`);

        try {
            updateUIStatus('Đang tải trang', 'Tải HTML trang đích...');
            let cleanUrl = targetUrl.trim();
            if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
                cleanUrl = 'https://' + cleanUrl;
            }

            let htmlResp;
            try {
                htmlResp = await request('GET', cleanUrl);
            } catch (netErr) {
                if (cleanUrl.startsWith('https://')) {
                    const httpUrl = cleanUrl.replace('https://', 'http://');
                    log(`⚠️ Không thể kết nối HTTPS, thử lại bằng HTTP: ${httpUrl}...`);
                    try {
                        htmlResp = await request('GET', httpUrl);
                        cleanUrl = httpUrl;
                    } catch (httpErr) {
                        throw new Error(`Không thể kết nối trang đích (${netErr.message || 'Bị chặn mạng/AdBlock'})`);
                    }
                } else {
                    throw new Error(`Không thể kết nối trang đích (${netErr.message || 'Bị chặn mạng/AdBlock'})`);
                }
            }

            if (!htmlResp || htmlResp.status !== 200) {
                throw new Error(`Không thể tải trang đích, status: ${htmlResp?.status || 0}`);
            }

            let html = htmlResp.text;
            let currentArticleUrl = cleanUrl;
            log(`📄 Kích thước HTML: ${html.length} ký tự`);

            // Xử lý trang redirect ngắn
            if (html.length < 500) {
                log(`⚠️ HTML quá ngắn (${html.length} ký tự), đang kiểm tra chuyển hướng tự động...`);
                const metaRefresh = html.match(/meta[^>]+http-equiv=["']refresh["'][^>]+content=["'][^"']*url=([^"'>\s]+)/i);
                const linkMatch = html.match(/<a[^>]+href=["'](https?:\/\/[^"'\s]+)["']/i);
                const jsRedirect = html.match(/(?:location\.href|window\.location)\s*=\s*["'](https?:\/\/[^"'\s]+)["']/i);

                let redirectUrl = (metaRefresh && metaRefresh[1]) || (linkMatch && linkMatch[1]) || (jsRedirect && jsRedirect[1]);

                if (redirectUrl) {
                    log(`🔄 Phát hiện link chuyển hướng: ${redirectUrl}`);
                    cleanUrl = redirectUrl.trim();
                    const redirectedResp = await request('GET', cleanUrl);
                    if (redirectedResp.status === 200) {
                        html = redirectedResp.text;
                        currentArticleUrl = cleanUrl;
                        log(`📄 Kích thước HTML sau chuyển hướng: ${html.length} ký tự`);
                    }
                } else {
                    try {
                        const urlObj = new URL(cleanUrl);
                        if (urlObj.hostname.endsWith('.com')) {
                            const vnUrl = cleanUrl.replace(urlObj.hostname, urlObj.hostname + '.vn');
                            log(`🔄 Thử nghiệm tên miền quốc gia .com.vn: ${vnUrl}...`);
                            const vnResp = await request('GET', vnUrl);
                            if (vnResp.status === 200 && vnResp.text.length > 500) {
                                cleanUrl = vnUrl;
                                html = vnResp.text;
                                currentArticleUrl = cleanUrl;
                                log(`🎯 Tên miền .com.vn hoạt động chuẩn! Kích thước: ${html.length} ký tự`);

                                request('POST', `${SERVER}/task/update`, {
                                    campaign_id: campaign_id,
                                    target_url: cleanUrl,
                                    task_type: taskType
                                }).catch(() => {});
                            }
                        }
                    } catch {}
                }
            }

            let key = extractWidgetKeyFromHtml(html);

            // NẾU TRANG CHỦ KHÔNG CÓ KEY: QUÉT TUẦN TỰ BÀI VIẾT CON
            if (!key) {
                updateUIStatus('Đang tìm bài viết', 'Quét sâu các bài viết con...');
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const candidateUrls = findCandidateArticleUrls(doc, cleanUrl);
                log(`🔎 Tìm thấy ${candidateUrls.length} bài viết tiềm năng trên web đích:`, candidateUrls);

                for (const subUrl of candidateUrls) {
                    log(`📥 Đang thử quét bài viết con: ${subUrl}...`);
                    try {
                        const subResp = await request('GET', subUrl);
                        if (subResp && subResp.status === 200) {
                            const foundKey = extractWidgetKeyFromHtml(subResp.text);
                            if (foundKey) {
                                key = foundKey;
                                html = subResp.text;
                                currentArticleUrl = subUrl;
                                log(`🎯 Đã tìm thấy key [${key}] trong bài viết con: ${subUrl}`);
                                break;
                            }
                        }
                    } catch (errSub) {
                        log(`⚠️ Không tải được ${subUrl}: ${errSub.message}`);
                    }
                }
            }

            // NẾU QUÉT HẾT MÀ KHÔNG THẤY KEY: LẬP TỨC ĐƯA VÀO BLACKLIST
            if (!key) {
                log('🚫 Không tìm thấy key widget trong HTML target! Đang báo cáo Blacklist...');
                await reportBlacklist(campaign_id, prefix, taskType, 'Không tìm thấy key widget trong HTML target (Domain không có widget)');
                showNewTaskAlert(currentDisplayId, 'Nhiệm vụ này đã bị đưa vào blacklist');
                throw new Error('Nhiệm vụ này đã bị đưa vào blacklist');
            }

            log('🔑 Key widget chuẩn xác:', key);

            const htmlCode = extractCodeFromHtml(html, key);

            const parsedTarget = new URL(currentArticleUrl);
            const targetHostname = parsedTarget.hostname;
            const targetPathname = parsedTarget.pathname || '/';
            const targetHref = parsedTarget.href;

            let widgetDomain = DOMAIN_MAP[taskType] || 's1.what-on.com';
            const widgetDomainMatch = html.match(/(?:https?:)?\/\/([a-zA-Z0-9.-]+\.(?:what-on\.com|website-analytics\.net))\/widget\/service-v2\.js/i);
            if (widgetDomainMatch) {
                widgetDomain = widgetDomainMatch[1];
            }

            const serviceUrl1 = `https://${widgetDomain}/widget/service-v2.js?key=${key}`;
            const serviceResp1 = await request('GET', serviceUrl1, null, { 'Referer': currentArticleUrl });

            const { session: traffic_session1, code: jsCode1, traffic_domain } = extractSessionAndCode(serviceResp1.text, widgetDomain);
            const finalWidgetDomain = traffic_domain || widgetDomain;
            const finalCode1 = htmlCode || jsCode1;

            log(`🔑 Token phiên: [session: "${traffic_session1}", code: "${finalCode1}", domain: "${finalWidgetDomain}"]`);

            const client_id = getClientId();

            log('📤 Gọi client.js khởi tạo phiên đếm giờ trên máy chủ...');
            const signature1 = await fetchSignature(finalWidgetDomain, key, client_id, traffic_session1, finalCode1, currentArticleUrl);

            // BƯỚC 3: ĐẾM NGƯỢC CHẶNG 1
            const waitTime1 = Math.max(link4mRequiredWait, 60) + 4;
            log(`⏳ Đếm ngược ngầm Chặng 1: ${waitTime1}s (gồm ${link4mRequiredWait}s Link4m + 4s an toàn)...`);
            await countdownWithUI(waitTime1, 'Chặng 1: Đang đếm ngược lấy mã');

            const questUrl1 = buildQuestUrl(finalWidgetDomain, {
                key,
                client_id,
                traffic_session: traffic_session1,
                code: finalCode1,
                request: signature1,
                hostname: targetHostname,
                pathname: targetPathname,
                href: targetHref
            });

            log('📤 Gửi yêu cầu chặng 1...');
            let questResp = await request('GET', questUrl1, null, {
                'Referer': currentArticleUrl,
                'Origin': `https://${targetHostname}`
            });

            function parseQuestId(text) {
                try {
                    const json = JSON.parse(text);
                    if (json.success === true) return json.quest_id || json.id || null;
                } catch {
                    const m = text.match(/["']?id["']?\s*[:=]\s*["']([^"']+)["']/i);
                    if (m) return m[1];
                }
                return null;
            }

            let quest_id = parseQuestId(questResp.text);

            // Tự động bù giờ nếu máy chủ yêu cầu thêm thời gian
            if (!quest_id && questResp.text.includes("Không lấy được code")) {
                log('⚠️ Chặng 1 chưa hết giờ, đang bù giờ thêm 15 giây...');
                await countdownWithUI(15, 'Chặng 1: Đang bù giờ thêm');

                questResp = await request('GET', questUrl1, null, { 'Referer': currentArticleUrl, 'Origin': `https://${targetHostname}` });
                quest_id = parseQuestId(questResp.text);

                if (!quest_id && questResp.text.includes("Không lấy được code")) {
                    log('⚠️ Vẫn chưa đủ thời gian, bù giờ thêm 15 giây lần cuối...');
                    await countdownWithUI(15, 'Chặng 1: Bù giờ lần cuối');
                    questResp = await request('GET', questUrl1, null, { 'Referer': currentArticleUrl, 'Origin': `https://${targetHostname}` });
                    quest_id = parseQuestId(questResp.text);
                }
            }

            if (!quest_id) {
                try {
                    const json = JSON.parse(questResp.text);
                    if (json.info === 'No Campaign') {
                        error('Chiến dịch đối tác đã hết ngân sách (No Campaign)!');
                        showNewTaskAlert(currentDisplayId, 'Chiến dịch đối tác đã hết ngân sách (No Campaign), Vui lòng đợi có nhiệm vụ hoặc đổi ip để tiếp tục...');
                        return;
                    }
                } catch {}
                error('Chi tiết lỗi Chặng 1:', questResp.text);
                throw new Error('Không lấy được quest_id từ chặng 1');
            }
            log('✅ Quest ID nhận thành công:', quest_id);

            // BƯỚC 4: ĐẾM NGƯỢC CHẶNG 2: 16 GIÂY
            const waitTime2 = 16;
            log(`⏳ Đếm ngược ngầm Chặng 2: ${waitTime2}s (quy chuẩn cố định máy chủ)...`);
            await countdownWithUI(waitTime2, 'Chặng 2: Đang lấy mã mật khẩu');

            updateUIStatus('Chặng 2', 'Đang tải mã về...');
            const serviceResp2 = await request('GET', serviceUrl1, null, { 'Referer': currentArticleUrl });
            const { session: traffic_session2, code: jsCode2 } = extractSessionAndCode(serviceResp2.text, finalWidgetDomain);
            const finalSession2 = traffic_session2 || traffic_session1;
            const finalCode2 = htmlCode || jsCode2 || finalCode1;

            let signature2 = signature1;
            try {
                signature2 = await fetchSignature(finalWidgetDomain, key, client_id, finalSession2, finalCode2, currentArticleUrl);
            } catch (errSig) {
                log('⚠️ Dùng lại signature 1');
            }

            const questUrl2 = buildQuestUrl(finalWidgetDomain, {
                id: quest_id,
                key,
                client_id,
                traffic_session: finalSession2,
                code: finalCode2,
                request: signature2,
                hostname: targetHostname,
                pathname: targetPathname,
                href: targetHref
            });

            let pwdResp = await request('GET', questUrl2, null, {
                'Referer': currentArticleUrl,
                'Origin': `https://${targetHostname}`
            });

            function parsePassword(text) {
                try {
                    const json = JSON.parse(text);
                    if (json.success === true && json.html && json.html !== '-1') {
                        return json.html.trim();
                    }
                } catch {
                    const m = text.match(/["']?html["']?\s*[:=]\s*["']([^"']+)["']/i);
                    if (m && m[1] !== '-1') return m[1].trim();
                }
                return null;
            }

            let password = parsePassword(pwdResp.text);

            if (!password && pwdResp.text.includes("Không lấy được code")) {
                log('⚠️ Chặng 2 cần thêm thời gian, chờ 10s...');
                await countdownWithUI(10, 'Chặng 2: Chờ thêm thời gian');
                pwdResp = await request('GET', questUrl2, null, { 'Referer': currentArticleUrl, 'Origin': `https://${targetHostname}` });
                password = parsePassword(pwdResp.text);
            }

            if (!password || password.length < 4 || password.length > 10) {
                throw new Error('Chặng 2 chưa trả về mật mã hợp lệ');
            }
            log('🔑 MÃ NHẬN ĐƯỢC THÀNH CÔNG:', password);

            await handleAutoSubmitAfterCaptcha(password);

        } catch (err) {
            const errorText = err instanceof Error ? err.message : (err?.error || err?.statusText || JSON.stringify(err) || 'Lỗi không xác định');
            error('❌ Lỗi luồng ngầm:', errorText);
            updateUIStatus('Gặp lỗi', errorText);

            if (errorText.includes('Không thể kết nối trang đích') || errorText.includes('Bị chặn')) {
                showNewTaskAlert(currentDisplayId, `Không thể truy cập trang web đích (${targetUrl}). Hệ thống đang tự động báo lỗi đổi nhiệm vụ...`);
            }
        }
    }

    injectDarkTheme();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderCustomUI);
    } else {
        renderCustomUI();
    }

})();
