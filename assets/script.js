/* ===================================================================
 * Fotus Brasil Flow - Script Principal
 * Calculadora informativa de pedágios (visual dark premium)
 * =================================================================== */

const TOLL_DATABASE = {
    'sao-paulo-rio': {
        origem: 'São Paulo', destino: 'Rio de Janeiro',
        distancia: 430, tempo: 5.5,
        pedagios: [
            { nome: 'Praça de Jacareí - Via Dutra', km: 160, valor: 20.80 },
            { nome: 'Praça de Moreira César - Via Dutra', km: 100, valor: 17.50 },
            { nome: 'Praça de Itatiaia - Via Dutra', km: 318, valor: 14.20 },
            { nome: 'Praça de Viúva Graça - Via Dutra', km: 370, valor: 16.90 }
        ]
    },
    'sao-paulo-belo-horizonte': {
        origem: 'São Paulo', destino: 'Belo Horizonte',
        distancia: 586, tempo: 7.2,
        pedagios: [
            { nome: 'Praça de Jundiaí - Anhanguera', km: 60, valor: 8.40 },
            { nome: 'Praça de Itatiba', km: 90, valor: 4.10 },
            { nome: 'Praça de Limeira - Bandeirantes', km: 152, valor: 13.20 },
            { nome: 'Praça de Oliveira - Fernão Dias', km: 500, valor: 9.80 }
        ]
    },
    'sao-paulo-curitiba': {
        origem: 'São Paulo', destino: 'Curitiba',
        distancia: 408, tempo: 5.1,
        pedagios: [
            { nome: 'Praça Régis Bittencourt - Taboão', km: 15, valor: 7.30 },
            { nome: 'Praça de Miracatu', km: 176, valor: 13.50 },
            { nome: 'Praça de Registro', km: 217, valor: 13.50 },
            { nome: 'Praça de Barra do Turvo', km: 300, valor: 13.50 }
        ]
    },
    'rio-belo-horizonte': {
        origem: 'Rio de Janeiro', destino: 'Belo Horizonte',
        distancia: 440, tempo: 6.5,
        pedagios: [
            { nome: 'Praça de Três Rios - BR-040', km: 113, valor: 11.80 },
            { nome: 'Praça de Juiz de Fora', km: 180, valor: 10.60 },
            { nome: 'Praça de Simão Pereira', km: 225, valor: 10.90 },
            { nome: 'Praça de Ressaquinha', km: 380, valor: 10.60 }
        ]
    },
    'curitiba-florianopolis': {
        origem: 'Curitiba', destino: 'Florianópolis',
        distancia: 300, tempo: 4.0,
        pedagios: [
            { nome: 'Praça de Guaratuba - BR-376', km: 60, valor: 17.20 },
            { nome: 'Praça de Joinville - BR-101', km: 135, valor: 14.80 },
            { nome: 'Praça de Itapema', km: 218, valor: 15.10 }
        ]
    },
    'sao-paulo-brasilia': {
        origem: 'São Paulo', destino: 'Brasília',
        distancia: 1020, tempo: 12.5,
        pedagios: [
            { nome: 'Praça de Jundiaí', km: 60, valor: 8.40 },
            { nome: 'Praça de Campinas', km: 100, valor: 4.30 },
            { nome: 'Praça de Mogi Mirim', km: 160, valor: 9.50 },
            { nome: 'Praça de Ribeirão Preto', km: 320, valor: 7.80 },
            { nome: 'Praça de Uberaba - MG', km: 700, valor: 10.20 },
            { nome: 'Praça de Uberlândia - MG', km: 820, valor: 11.40 }
        ]
    },
    'porto-alegre-florianopolis': {
        origem: 'Porto Alegre', destino: 'Florianópolis',
        distancia: 465, tempo: 5.8,
        pedagios: [
            { nome: 'Praça de Osório - BR-290', km: 90, valor: 8.90 },
            { nome: 'Praça de Santo Antônio', km: 170, valor: 9.20 },
            { nome: 'Praça de Araranguá', km: 260, valor: 12.40 },
            { nome: 'Praça de Tubarão', km: 330, valor: 13.10 }
        ]
    },
    'rio-vitoria': {
        origem: 'Rio de Janeiro', destino: 'Vitória',
        distancia: 520, tempo: 7.0,
        pedagios: [
            { nome: 'Praça de Casimiro de Abreu', km: 120, valor: 15.40 },
            { nome: 'Praça de Rio Bonito', km: 68, valor: 12.80 },
            { nome: 'Praça de Campos', km: 290, valor: 13.60 },
            { nome: 'Praça de Guarapari - ES', km: 460, valor: 9.50 }
        ]
    }
};

const VEHICLE_MULTIPLIERS = { 'carro': 1, 'moto': 0.5, 'caminhao': 2, 'onibus': 2 };
const VEHICLE_CONSUMPTION = { 'carro': 11, 'moto': 28, 'caminhao': 4, 'onibus': 3.5 };
const FUEL_PRICE = 6.15;

function formatMoney(value) {
    return 'R$ ' + value.toFixed(2).replace('.', ',');
}

function formatTime(hours) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}min`;
}

function normalize(str) {
    return str.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .trim();
}

function findRoute(origem, destino) {
    const key = `${normalize(origem)}-${normalize(destino)}`;
    const reverseKey = `${normalize(destino)}-${normalize(origem)}`;
    return TOLL_DATABASE[key] || TOLL_DATABASE[reverseKey] || null;
}

let selectedVehicle = 'carro';

function initCalculator() {
    const form = document.getElementById('calc-form');
    if (!form) return;

    document.querySelectorAll('.vehicle-chip').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.vehicle-chip').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            selectedVehicle = opt.dataset.vehicle;
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateRoute();
    });
}

function calculateRoute() {
    const origem = document.getElementById('origem').value.trim();
    const destino = document.getElementById('destino').value.trim();
    const resultCard = document.getElementById('result-card');

    if (!origem || !destino) {
        alert('Preencha origem e destino.');
        return;
    }

    const route = findRoute(origem, destino);

    if (!route) {
        resultCard.classList.add('show');
        resultCard.innerHTML = `
            <div style="text-align: center; padding: 20px 0;">
                <div style="font-family: var(--font-display); font-size: 3rem; color: var(--gold); margin-bottom: 16px; font-style: italic;">◈</div>
                <h3 style="font-family: var(--font-display); font-size: 1.4rem; margin-bottom: 16px;">Rota não mapeada</h3>
                <p style="color: var(--text-secondary); max-width: 480px; margin: 0 auto 12px;">
                    A rota <strong style="color: var(--gold);">${origem} → ${destino}</strong> não está em nossa base de demonstração.
                </p>
                <p style="color: var(--text-muted); font-size: 0.9rem; max-width: 480px; margin: 0 auto;">
                    Experimente rotas como São Paulo → Rio de Janeiro, Rio → Belo Horizonte, São Paulo → Curitiba, entre outras.
                </p>
            </div>
        `;
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    const multiplier = VEHICLE_MULTIPLIERS[selectedVehicle];
    const consumption = VEHICLE_CONSUMPTION[selectedVehicle];
    const totalTolls = route.pedagios.reduce((sum, p) => sum + p.valor * multiplier, 0);
    const fuelCost = (route.distancia / consumption) * FUEL_PRICE;

    const tollListHtml = route.pedagios.map(p => `
        <li>
            <span class="toll-name">${p.nome}</span>
            <span class="toll-price">${formatMoney(p.valor * multiplier)}</span>
        </li>
    `).join('');

    resultCard.innerHTML = `
        <div class="result-header">
            <h3 class="result-route">${route.origem} <em style="color: var(--gold); font-style: italic;">—</em> ${route.destino}</h3>
            <span class="result-tag">${route.pedagios.length} Praças</span>
        </div>

        <div class="result-stats">
            <div class="result-stat">
                <div class="result-stat-label">Distância</div>
                <div class="result-stat-value">${route.distancia} <span style="font-size: 0.9rem; color: var(--text-muted); font-family: var(--font-mono);">km</span></div>
            </div>
            <div class="result-stat">
                <div class="result-stat-label">Tempo estimado</div>
                <div class="result-stat-value">${formatTime(route.tempo)}</div>
            </div>
            <div class="result-stat">
                <div class="result-stat-label">Pedágios</div>
                <div class="result-stat-value accent">${formatMoney(totalTolls)}</div>
            </div>
            <div class="result-stat">
                <div class="result-stat-label">Combustível</div>
                <div class="result-stat-value">${formatMoney(fuelCost)}</div>
            </div>
        </div>

        <h4 style="font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.25em; color: var(--gold); text-transform: uppercase; margin-bottom: 12px;">Detalhamento</h4>
        <ul class="toll-list">${tollListHtml}</ul>

        <div class="result-notice">
            <strong>Aviso:</strong> Valores aproximados, baseados em tabelas públicas. Confirme as tarifas oficiais diretamente com a concessionária da rodovia ou consulte a
            <a href="https://www.gov.br/antt/" target="_blank" rel="nofollow noopener" style="color: var(--gold); text-decoration: underline;">ANTT</a>.
        </div>
    `;

    resultCard.classList.add('show');
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ============= FAQ =============
function initFAQ() {
    document.querySelectorAll('.faq-item').forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        if (!trigger) return;
        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });
}

// ============= Cookies + Termos =============
const CONSENT_KEY = 'fbf_consent';

function hasConsent() {
    try {
        return document.cookie.split(';').some(c => c.trim().startsWith(CONSENT_KEY + '='));
    } catch (e) { return false; }
}

function setConsent(value) {
    const days = 180;
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${CONSENT_KEY}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

function initConsentFlow() {
    const modal = document.getElementById('terms-modal');
    const banner = document.getElementById('cookie-banner');
    const checkbox = document.getElementById('terms-check');
    const acceptBtn = document.getElementById('terms-accept');
    const rejectBtn = document.getElementById('terms-reject');

    if (!modal && !banner) return;

    if (!hasConsent()) {
        setTimeout(() => {
            if (modal) modal.classList.add('show');
        }, 800);
    }

    if (checkbox && acceptBtn) {
        checkbox.addEventListener('change', () => {
            acceptBtn.disabled = !checkbox.checked;
        });
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            setConsent('accepted');
            if (modal) modal.classList.remove('show');
            if (banner) {
                setTimeout(() => banner.classList.add('show'), 500);
                setTimeout(() => banner.classList.remove('show'), 6500);
            }
        });
    }

    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
            setConsent('rejected');
            if (modal) modal.classList.remove('show');
        });
    }

    const cookieAccept = document.getElementById('cookie-accept');
    const cookieReject = document.getElementById('cookie-reject');

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            setConsent('accepted');
            banner.classList.remove('show');
        });
    }

    if (cookieReject) {
        cookieReject.addEventListener('click', () => {
            setConsent('rejected');
            banner.classList.remove('show');
        });
    }
}

function initMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = document.getElementById('form-feedback');
        if (msg) {
            msg.classList.add('show');
            msg.textContent = '✓ Mensagem recebida. Nossa equipe retornará em até 48h úteis.';
        }
        form.reset();
        setTimeout(() => {
            if (msg) msg.classList.remove('show');
        }, 8000);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initCalculator();
    initFAQ();
    initConsentFlow();
    initMenu();
    initContactForm();
});
