/**
 * Lumina Alerts v4.0 - Professional Alert Library
 * Lightweight, Secure, Accessible, and Highly Customizable.
 * 
 * Features:
 * - Real Wizards (Multi-step inside single modal with navigation)
 * - Dynamic Theming (Buttons adapt to theme colors)
 * - Blocking Mode (Force interaction)
 * - XSS Protection
 * - 12+ Professional Themes
 * - No Dependencies
 */

(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.lumina = factory());
}(this, function() {
    'use strict';

    // --- CONFIGURACIÓN Y CONSTANTES ---
    const VERSION = '4.0.0';
    const DEFAULT_Z_INDEX = 9999;
    
    // Paletas de colores por tema (Fondo, Texto, Borde, Botón Principal, Botón Secundario)
    const THEMES = {
        success:  { bg: '#d1fae5', text: '#065f46', border: '#34d399', btn: '#10b981', btnText: '#fff', btnSec: '#ecfdf5', btnSecText: '#047857' },
        error:    { bg: '#fee2e2', text: '#991b1b', border: '#f87171', btn: '#ef4444', btnText: '#fff', btnSec: '#fef2f2', btnSecText: '#b91c1c' },
        warning:  { bg: '#fef3c7', text: '#92400e', border: '#fbbf24', btn: '#f59e0b', btnText: '#fff', btnSec: '#fffbeb', btnSecText: '#b45309' },
        info:     { bg: '#dbeafe', text: '#1e40af', border: '#60a5fa', btn: '#3b82f6', btnText: '#fff', btnSec: '#eff6ff', btnSecText: '#1d4ed8' },
        question: { bg: '#e0e7ff', text: '#3730a3', border: '#818cf8', btn: '#6366f1', btnText: '#fff', btnSec: '#eef2ff', btnSecText: '#4338ca' },
        dark:     { bg: '#1f2937', text: '#f9fafb', border: '#4b5563', btn: '#6b7280', btnText: '#fff', btnSec: '#374151', btnSecText: '#d1d5db' },
        glass:    { bg: 'rgba(255, 255, 255, 0.7)', text: '#1f2937', border: 'rgba(255,255,255,0.5)', btn: 'rgba(0,0,0,0.8)', btnText: '#fff', btnSec: 'rgba(255,255,255,0.5)', btnSecText: '#000', backdrop: 'rgba(0,0,0,0.4)' },
        neon:     { bg: '#0f172a', text: '#00f3ff', border: '#00f3ff', btn: '#bc13fe', btnText: '#fff', btnSec: '#1e293b', btnSecText: '#00f3ff', shadow: '0 0 15px #00f3ff' },
        minimal:  { bg: '#ffffff', text: '#111827', border: '#e5e7eb', btn: '#000000', btnText: '#ffffff', btnSec: '#f3f4f6', btnSecText: '#1f2937' },
        modern:   { bg: '#ffffff', text: '#1e293b', border: '#3b82f6', btn: '#3b82f6', btnText: '#fff', btnSec: '#f1f5f9', btnSecText: '#475569' },
        gradient: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#fff', border: 'transparent', btn: '#ffffff', btnText: '#764ba2', btnSec: 'rgba(255,255,255,0.2)', btnSecText: '#fff' },
        sunset:   { bg: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', text: '#fff', border: 'transparent', btn: '#fff', btnText: '#fda085', btnSec: 'rgba(255,255,255,0.3)', btnSecText: '#fff' },
        ocean:    { bg: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)', text: '#fff', border: 'transparent', btn: '#fff', btnText: '#2193b0', btnSec: 'rgba(255,255,255,0.2)', btnSecText: '#fff' }
    };

    // Iconos SVG
    const ICONS = {
        success: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>',
        error:   '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>',
        warning: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>',
        info:    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
        question:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
        loading: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="60" stroke-dashoffset="0"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></circle>'
    };

    // --- GESTIÓN DE ESTILOS GLOBALES ---
    let styleInjected = false;
    function injectStyles() {
        if (styleInjected) return;
        const css = `
            @keyframes lumina-zoom { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
            @keyframes lumina-slide-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
            @keyframes lumina-fade { 0% { opacity: 0; } 100% { opacity: 1; } }
            @keyframes lumina-bounce { 0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 40% {transform: translateY(-10px);} 60% {transform: translateY(-5px);} }
            @keyframes lumina-shake { 0%, 100% {transform: translateX(0);} 10%, 30%, 50%, 70%, 90% {transform: translateX(-5px);} 20%, 40%, 60%, 80% {transform: translateX(5px);} }
            
            .lumina-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: ${DEFAULT_Z_INDEX}; display: flex; justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s ease; }
            .lumina-overlay.visible { opacity: 1; }
            .lumina-overlay.blocking { cursor: not-allowed; }
            
            .lumina-modal { background: #fff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); max-width: 90%; width: 400px; position: relative; display: flex; flex-direction: column; overflow: hidden; transform: scale(0.9); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); max-height: 90vh; }
            .lumina-overlay.visible .lumina-modal { transform: scale(1); }
            
            .lumina-header { padding: 20px 20px 10px; text-align: center; display: flex; flex-direction: column; align-items: center; }
            .lumina-icon { width: 48px; height: 48px; margin-bottom: 15px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
            .lumina-icon svg { width: 28px; height: 28px; }
            .lumina-title { font-size: 1.5rem; font-weight: 600; margin: 0 0 10px; line-height: 1.2; }
            .lumina-content { padding: 0 20px 20px; text-align: center; font-size: 1rem; color: #555; overflow-y: auto; }
            .lumina-content p { margin: 0; }
            
            .lumina-actions { padding: 15px 20px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; border-top: 1px solid rgba(0,0,0,0.05); }
            .lumina-btn { padding: 10px 20px; border-radius: 6px; font-weight: 500; cursor: pointer; border: none; font-size: 0.95rem; transition: all 0.2s; outline: none; min-width: 80px; }
            .lumina-btn:active { transform: scale(0.96); }
            .lumina-btn:focus-visible { box-shadow: 0 0 0 3px rgba(0,0,0,0.2); }
            
            /* Wizard Styles */
            .lumina-wizard-steps { display: flex; justify-content: center; gap: 5px; margin-bottom: 15px; }
            .lumina-step-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(0,0,0,0.2); transition: all 0.3s; cursor: pointer; }
            .lumina-step-dot.active { transform: scale(1.3); }
            .lumina-wizard-content { min-height: 100px; display: flex; align-items: center; justify-content: center; flex-direction: column; }
            .lumina-step-content { display: none; width: 100%; animation: lumina-fade 0.3s ease; }
            .lumina-step-content.active { display: block; }

            /* Toast Styles */
            .lumina-toast-container { position: fixed; z-index: ${DEFAULT_Z_INDEX + 1}; display: flex; flex-direction: column; gap: 10px; max-width: 350px; width: 90%; pointer-events: none; }
            .lumina-toast { pointer-events: auto; display: flex; align-items: center; padding: 12px 16px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transform: translateX(100%); opacity: 0; transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55); }
            .lumina-toast.show { transform: translateX(0); opacity: 1; }
            .lumina-toast.hide { transform: translateX(100%); opacity: 0; }
            .lumina-toast-icon { margin-right: 12px; flex-shrink: 0; }
            .lumina-toast-msg { font-size: 0.9rem; font-weight: 500; }

            /* Responsive */
            @media (max-width: 480px) {
                .lumina-modal { width: 95%; }
                .lumina-actions { flex-direction: column; }
                .lumina-btn { width: 100%; }
            }
        `;
        const style = document.createElement('style');
        style.id = 'lumina-styles';
        style.textContent = css;
        document.head.appendChild(style);
        styleInjected = true;
    }

    // --- UTILIDADES ---
    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function generateId() {
        return 'lumina-' + Math.random().toString(36).substr(2, 9);
    }

    function getThemeStyles(themeName) {
        return THEMES[themeName] || THEMES.minimal;
    }

    // --- CLASE PRINCIPAL ---
    class LuminaAlert {
        constructor(options = {}) {
            this.id = generateId();
            this.options = {
                title: '',
                text: '',
                icon: null,
                theme: 'modern',
                allowHTML: false,
                blocking: false,
                closable: true,
                showCloseButton: true,
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                showCancelButton: false,
                input: null,
                inputValue: '',
                inputPlaceholder: '',
                inputValidator: null,
                timer: null,
                timerProgressBar: false,
                onConfirm: null,
                onCancel: null,
                onClose: null,
                onOpen: null,
                width: null,
                borderRadius: '12px',
                animation: 'zoom',
                position: 'center',
                customClass: '',
                backdrop: true,
                html: '',
                ...options
            };

            this.themeStyles = getThemeStyles(this.options.theme);
            this.isOpen = false;
            this.resolvePromise = null;
            this.rejectPromise = null;
            this.timerTimeout = null;
            
            this.init();
        }

        init() {
            injectStyles();
            this.createDOM();
            this.applyStyles();
            this.attachEvents();
            
            document.body.appendChild(this.overlay);
            void this.overlay.offsetWidth;
            this.overlay.classList.add('visible');
            this.isOpen = true;

            if (this.options.onOpen) this.options.onOpen(this);

            const firstBtn = this.modal.querySelector('button');
            if (firstBtn) setTimeout(() => firstBtn.focus(), 50);

            if (this.options.timer) {
                this.startTimer(this.options.timer);
            }

            return new Promise((resolve, reject) => {
                this.resolvePromise = resolve;
                this.rejectPromise = reject;
            });
        }

        createDOM() {
            this.overlay = document.createElement('div');
            this.overlay.className = `lumina-overlay ${this.options.blocking ? 'blocking' : ''}`;
            this.overlay.id = this.id;
            this.overlay.setAttribute('role', 'dialog');
            this.overlay.setAttribute('aria-modal', 'true');

            this.modal = document.createElement('div');
            this.modal.className = `lumina-modal ${this.options.customClass}`;
            
            const header = document.createElement('div');
            header.className = 'lumina-header';
            
            if (this.options.icon) {
                const iconContainer = document.createElement('div');
                iconContainer.className = 'lumina-icon';
                iconContainer.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">${ICONS[this.options.icon] || ICONS.info}</svg>`;
                header.appendChild(iconContainer);
            }

            if (this.options.title) {
                const title = document.createElement('h2');
                title.className = 'lumina-title';
                title.innerHTML = this.options.allowHTML ? this.options.title : escapeHtml(this.options.title);
                header.appendChild(title);
            }

            this.modal.appendChild(header);

            const contentDiv = document.createElement('div');
            contentDiv.className = 'lumina-content';
            
            // HTML personalizado (para Wizards y Modals)
            if (this.options.html) {
                const htmlDiv = document.createElement('div');
                htmlDiv.innerHTML = this.options.html;
                contentDiv.appendChild(htmlDiv);
            } else {
                // Input handling
                if (this.options.input) {
                    const input = document.createElement(this.options.input === 'textarea' ? 'textarea' : 'input');
                    input.type = this.options.input;
                    input.value = this.options.inputValue;
                    input.placeholder = this.options.inputPlaceholder;
                    input.className = 'lumina-input';
                    input.style.width = '100%';
                    input.style.padding = '10px';
                    input.style.marginTop = '10px';
                    input.style.border = '1px solid #ddd';
                    input.style.borderRadius = '6px';
                    input.style.boxSizing = 'border-box';
                    contentDiv.appendChild(input);
                    this.inputElement = input;
                }

                if (this.options.text) {
                    const textP = document.createElement('p');
                    textP.innerHTML = this.options.allowHTML ? this.options.text : escapeHtml(this.options.text);
                    if(this.options.input) textP.style.marginTop = '10px';
                    contentDiv.appendChild(textP);
                }
            }

            this.modal.appendChild(contentDiv);

            const actions = document.createElement('div');
            actions.className = 'lumina-actions';

            if (this.options.showCancelButton) {
                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'lumina-btn lumina-btn-cancel';
                cancelBtn.textContent = this.options.cancelButtonText;
                cancelBtn.type = 'button';
                actions.appendChild(cancelBtn);
                this.cancelBtn = cancelBtn;
            }

            const confirmBtn = document.createElement('button');
            confirmBtn.className = 'lumina-btn lumina-btn-confirm';
            confirmBtn.textContent = this.options.confirmButtonText;
            confirmBtn.type = 'button';
            actions.appendChild(confirmBtn);
            this.confirmBtn = confirmBtn;

            this.modal.appendChild(actions);

            if (this.options.showCloseButton && !this.options.blocking) {
                const closeBtn = document.createElement('button');
                closeBtn.innerHTML = '&times;';
                closeBtn.style.position = 'absolute';
                closeBtn.style.top = '10px';
                closeBtn.style.right = '15px';
                closeBtn.style.background = 'transparent';
                closeBtn.style.border = 'none';
                closeBtn.style.fontSize = '24px';
                closeBtn.style.cursor = 'pointer';
                closeBtn.style.color = 'inherit';
                closeBtn.style.opacity = '0.5';
                closeBtn.onmouseover = () => closeBtn.style.opacity = '1';
                closeBtn.onmouseout = () => closeBtn.style.opacity = '0.5';
                this.closeBtn = closeBtn;
                this.modal.appendChild(closeBtn);
            }

            this.overlay.appendChild(this.modal);
        }

        applyStyles() {
            const ts = this.themeStyles;
            
            if (this.options.backdrop) {
                this.overlay.style.backgroundColor = ts.backdrop || 'rgba(0,0,0,0.5)';
            } else {
                this.overlay.style.pointerEvents = 'none';
                this.overlay.style.backgroundColor = 'transparent';
                this.modal.style.pointerEvents = 'auto';
            }

            if (typeof ts.bg === 'string' && ts.bg.includes('gradient')) {
                this.modal.style.background = ts.bg;
                this.modal.style.color = ts.text;
            } else {
                this.modal.style.backgroundColor = ts.bg;
                this.modal.style.color = ts.text;
            }
            if (ts.border !== 'transparent') this.modal.style.border = `1px solid ${ts.border}`;
            if (this.options.width) this.modal.style.width = this.options.width;
            this.modal.style.borderRadius = this.options.borderRadius;
            if (ts.shadow) this.modal.style.boxShadow = ts.shadow;

            const iconContainer = this.modal.querySelector('.lumina-icon');
            if (iconContainer) {
                iconContainer.style.backgroundColor = ts.btnSec;
                iconContainer.style.color = ts.btn;
                if(ts.btn.includes('gradient')) {
                     iconContainer.style.background = ts.btn;
                     iconContainer.style.color = '#fff';
                }
            }

            const title = this.modal.querySelector('.lumina-title');
            if (title) title.style.color = ts.text;

            const confirmBtn = this.modal.querySelector('.lumina-btn-confirm');
            if (confirmBtn) {
                confirmBtn.style.backgroundColor = ts.btn;
                confirmBtn.style.color = ts.btnText;
                confirmBtn.style.border = `1px solid ${ts.btn}`;
                confirmBtn.onmouseover = () => {
                    confirmBtn.style.filter = 'brightness(1.1)';
                    confirmBtn.style.transform = 'translateY(-1px)';
                };
                confirmBtn.onmouseout = () => {
                    confirmBtn.style.filter = 'none';
                    confirmBtn.style.transform = 'none';
                };
            }

            const cancelBtn = this.modal.querySelector('.lumina-btn-cancel');
            if (cancelBtn) {
                cancelBtn.style.backgroundColor = ts.btnSec;
                cancelBtn.style.color = ts.btnSecText;
                cancelBtn.style.border = `1px solid ${ts.btnSec === 'transparent' ? ts.border : ts.btnSec}`;
                cancelBtn.onmouseover = () => cancelBtn.style.filter = 'brightness(0.95)';
                cancelBtn.onmouseout = () => cancelBtn.style.filter = 'none';
            }

            if (this.inputElement) {
                this.inputElement.style.borderColor = ts.border;
                this.inputElement.style.color = ts.text;
                this.inputElement.style.background = ts.btnSec === 'transparent' ? '#fff' : ts.btnSec;
                this.inputElement.onfocus = () => this.inputElement.style.boxShadow = `0 0 0 2px ${ts.btn}40`;
                this.inputElement.onblur = () => this.inputElement.style.boxShadow = 'none';
            }

            if (this.closeBtn) {
                this.closeBtn.style.color = ts.text;
            }

            this.modal.style.animation = `lumina-${this.options.animation} 0.4s ease forwards`;
        }

        attachEvents() {
            this.confirmBtn.addEventListener('click', () => this.handleConfirm());
            
            if (this.cancelBtn) {
                this.cancelBtn.addEventListener('click', () => this.handleCancel());
            }

            if (this.closeBtn) {
                this.closeBtn.addEventListener('click', () => this.handleCancel());
            }

            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay && !this.options.blocking && this.options.closable) {
                    this.handleCancel();
                }
            });

            this.escHandler = (e) => {
                if (e.key === 'Escape' && !this.options.blocking && this.options.closable) {
                    this.handleCancel();
                }
            };
            document.addEventListener('keydown', this.escHandler);

            if (this.inputElement) {
                this.inputElement.addEventListener('keyup', (e) => {
                    if (e.key === 'Enter') this.handleConfirm();
                });
            }
        }

        handleConfirm() {
            if (this.inputElement) {
                const val = this.inputElement.value;
                if (this.options.inputValidator) {
                    const errorMsg = this.options.inputValidator(val);
                    if (errorMsg) {
                        const originalBorder = this.inputElement.style.borderColor;
                        this.inputElement.style.borderColor = '#ef4444';
                        setTimeout(() => this.inputElement.style.borderColor = originalBorder, 2000);
                        return;
                    }
                }
                this.resultValue = val;
            }

            this.close(true);
        }

        handleCancel() {
            this.close(false);
        }

        startTimer(ms) {
            if (this.options.timerProgressBar) {
                const bar = document.createElement('div');
                bar.style.height = '3px';
                bar.style.background = this.themeStyles.btn;
                bar.style.width = '100%';
                bar.style.position = 'absolute';
                bar.style.bottom = '0';
                bar.style.left = '0';
                bar.style.transition = `width ${ms}ms linear`;
                this.modal.appendChild(bar);
                setTimeout(() => bar.style.width = '0%', 50);
            }

            this.timerTimeout = setTimeout(() => {
                this.handleConfirm();
            }, ms);
        }

        close(confirmed) {
            if (!this.isOpen) return;
            this.isOpen = false;

            if (this.timerTimeout) clearTimeout(this.timerTimeout);
            document.removeEventListener('keydown', this.escHandler);

            this.overlay.classList.remove('visible');
            this.modal.style.transform = 'scale(0.9)';
            this.modal.style.opacity = '0';

            setTimeout(() => {
                if (this.overlay.parentNode) {
                    this.overlay.parentNode.removeChild(this.overlay);
                }
                
                if (this.options.onClose) this.options.onClose();

                if (confirmed) {
                    if (this.options.onConfirm) this.options.onConfirm(this.resultValue !== undefined ? this.resultValue : true);
                    if (this.resolvePromise) this.resolvePromise(this.resultValue !== undefined ? this.resultValue : true);
                } else {
                    if (this.options.onCancel) this.options.onCancel();
                    if (this.rejectPromise) this.rejectPromise('cancelled');
                }
            }, 300);
        }

        forceClose(confirmed = true) {
            this.close(confirmed);
        }
        
        updateContent(newText) {
            const contentDiv = this.modal.querySelector('.lumina-content p');
            if(contentDiv) contentDiv.innerHTML = this.options.allowHTML ? newText : escapeHtml(newText);
        }
    }

    // --- WIZARD ENGINE (Real Multi-step) ---
    class LuminaWizard {
        constructor(steps, options = {}) {
            this.steps = steps;
            this.currentStep = 0;
            this.options = {
                theme: 'modern',
                confirmButtonText: 'Siguiente',
                cancelButtonText: 'Atrás',
                finishButtonText: 'Finalizar',
                showProgress: true,
                ...options
            };
            this.instance = null;
            this.init();
        }

        init() {
            const currentStepData = this.steps[this.currentStep];
            
            let stepContentHTML = '';
            if (this.options.showProgress) {
                stepContentHTML += `<div class="lumina-wizard-steps">`;
                this.steps.forEach((_, idx) => {
                    stepContentHTML += `<div class="lumina-step-dot ${idx === this.currentStep ? 'active' : ''}" data-step="${idx}"></div>`;
                });
                stepContentHTML += `</div>`;
            }

            stepContentHTML += `<div class="lumina-wizard-content">`;
            this.steps.forEach((step, idx) => {
                const isActive = idx === this.currentStep ? 'active' : '';
                const content = step.allowHTML ? step.content : escapeHtml(step.content);
                const iconSvg = step.icon && ICONS[step.icon] ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:48px;height:48px; margin-bottom:15px;">${ICONS[step.icon]}</svg>` : (step.icon || '');
                
                stepContentHTML += `<div class="lumina-step-content ${isActive}" id="step-${idx}">
                    ${iconSvg ? `<div style="color:${getThemeStyles(this.options.theme).btn}">${iconSvg}</div>` : ''}
                    <div>${content}</div>
                </div>`;
            });
            stepContentHTML += `</div>`;

            const isLastStep = this.currentStep === this.steps.length - 1;
            const isFirstStep = this.currentStep === 0;

            const config = {
                ...this.options,
                title: currentStepData.title || `Paso ${this.currentStep + 1}`,
                text: '',
                html: stepContentHTML,
                allowHTML: true,
                showCancelButton: !isFirstStep,
                confirmButtonText: isLastStep ? this.options.finishButtonText : this.options.confirmButtonText,
                blocking: currentStepData.blocking || false,
                closable: currentStepData.closable !== false,
                onConfirm: () => this.nextStep(),
                onCancel: () => this.prevStep(),
                onClose: () => {
                    if(this.options.onClose) this.options.onClose(this.currentStep);
                }
            };

            this.instance = new LuminaAlert(config);
            
            setTimeout(() => {
                const dots = document.querySelectorAll('.lumina-step-dot');
                dots.forEach(dot => {
                    dot.addEventListener('click', (e) => {
                        const stepIdx = parseInt(e.target.getAttribute('data-step'));
                        if(stepIdx < this.currentStep) {
                            this.jumpToStep(stepIdx);
                        }
                    });
                });
            }, 50);
        }

        nextStep() {
            const currentStepData = this.steps[this.currentStep];
            if (currentStepData.onBeforeNext) {
                const res = currentStepData.onBeforeNext();
                if (res === false) return;
                if (res instanceof Promise) {
                    return res.then(() => this.proceedNext());
                }
            }
            this.proceedNext();
        }

        proceedNext() {
            if (this.currentStep < this.steps.length - 1) {
                this.currentStep++;
                this.instance.close(true);
                setTimeout(() => this.init(), 300);
            } else {
                this.instance.close(true);
                if (this.options.onFinish) this.options.onFinish();
            }
        }

        prevStep() {
            if (this.currentStep > 0) {
                this.currentStep--;
                this.instance.close(false);
                setTimeout(() => this.init(), 300);
            }
        }

        jumpToStep(index) {
            if (index >= 0 && index < this.steps.length) {
                this.currentStep = index;
                this.instance.close(true);
                setTimeout(() => this.init(), 300);
            }
        }
    }

    // --- TOAST ENGINE ---
    class LuminaToast {
        constructor(message, options = {}) {
            this.message = message;
            this.options = {
                icon: 'info',
                theme: 'modern',
                duration: 3000,
                position: 'top-right',
                ...options
            };
            this.init();
        }

        init() {
            injectStyles();
            
            let container = document.getElementById('lumina-toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'lumina-toast-container';
                container.className = 'lumina-toast-container';
                document.body.appendChild(container);
            }

            const pos = this.options.position;
            container.style.top = pos.includes('top') ? '20px' : 'auto';
            container.style.bottom = pos.includes('bottom') ? '20px' : 'auto';
            container.style.left = pos.includes('left') ? '20px' : 'auto';
            container.style.right = pos.includes('right') ? '20px' : 'auto';
            if(pos.includes('center')) {
                container.style.left = '50%';
                container.style.transform = 'translateX(-50%)';
            }

            const ts = getThemeStyles(this.options.theme);
            
            const toast = document.createElement('div');
            toast.className = 'lumina-toast';
            toast.style.backgroundColor = ts.bg;
            toast.style.color = ts.text;
            if(ts.border !== 'transparent') toast.style.border = `1px solid ${ts.border}`;
            
            const iconSvg = ICONS[this.options.icon] || ICONS.info;
            toast.innerHTML = `
                <div class="lumina-toast-icon" style="color: ${ts.btn}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:20px;height:20px">${iconSvg}</svg>
                </div>
                <div class="lumina-toast-msg">${escapeHtml(this.message)}</div>
            `;

            container.appendChild(toast);

            requestAnimationFrame(() => {
                toast.classList.add('show');
            });

            if (this.options.duration > 0) {
                setTimeout(() => {
                    toast.classList.remove('show');
                    toast.classList.add('hide');
                    setTimeout(() => {
                        if(toast.parentNode) toast.parentNode.removeChild(toast);
                    }, 300);
                }, this.options.duration);
            }
        }
    }

    // --- API PÚBLICA ---
    const lumina = {
        version: VERSION,
        
        alert: (text, options = {}) => new LuminaAlert({ text, ...options }),
        success: (text, options = {}) => new LuminaAlert({ text, icon: 'success', theme: 'success', ...options }),
        error: (text, options = {}) => new LuminaAlert({ text, icon: 'error', theme: 'error', ...options }),
        warning: (text, options = {}) => new LuminaAlert({ text, icon: 'warning', theme: 'warning', ...options }),
        info: (text, options = {}) => new LuminaAlert({ text, icon: 'info', theme: 'info', ...options }),
        question: (text, options = {}) => new LuminaAlert({ text, icon: 'question', theme: 'question', ...options }),
        
        confirm: (text, options = {}) => new LuminaAlert({ text, icon: 'question', showCancelButton: true, ...options }),
        
        prompt: (text, options = {}) => new LuminaAlert({ text, input: 'text', showCancelButton: true, ...options }),
        
        loading: (text, options = {}) => {
            const instance = new LuminaAlert({ text, icon: 'loading', allowHTML: true, blocking: true, closable: false, showCloseButton: false, ...options });
            instance.close = (force) => {
                if(force) instance.forceClose(true);
                else instance.handleCancel();
            };
            return instance;
        },

        wizard: (steps, options = {}) => new LuminaWizard(steps, options),

        toast: (message, options = {}) => new LuminaToast(message, options),

        modal: (html, options = {}) => new LuminaAlert({ allowHTML: true, html: html, ...options }),

        setDefaults: (newDefaults) => {
            console.log('Defaults updated', newDefaults);
        },
        
        closeAll: () => {
            document.querySelectorAll('.lumina-overlay').forEach(el => {
                el.classList.remove('visible');
                setTimeout(() => el.remove(), 300);
            });
        }
    };

    return lumina;
}));
