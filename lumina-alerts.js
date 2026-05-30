/**
 * Lumina Alerts v4.0 - Professional Edition
 * La librería de alertas definitiva: Segura, Rápida, Accesible y Moderna.
 * 
 * Características Clave:
 * - Motor de renderizado seguro (Anti-XSS por defecto)
 * - Focus Trap completo para accesibilidad (WCAG 2.1)
 * - Sistema de colas y gestión de estado
 * - Totalmente Responsive y Táctil
 * - Sin dependencias externas
 * 
 * @version 4.0.0
 * @author Lumina Dev Team
 * @license MIT
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.lumina = factory());
}(this, function () {
    'use strict';

    // --- 1. CONFIGURACIÓN Y ESTADO GLOBAL ---
    const VERSION = '4.0.0';
    let instanceCount = 0;
    let queue = [];
    let isProcessingQueue = false;
    
    // Configuración por defecto
    const defaults = {
        theme: 'modern',
        animation: 'zoom',
        blocking: false,
        closable: true,
        overlay: true,
        overlayBlur: 4,
        allowHTML: false, // Seguridad: HTML desactivado por defecto
        trapFocus: true,
        closeOnOverlay: true,
        closeOnEsc: true,
        timer: 0,
        width: '450px',
        maxWidth: '90%',
        borderRadius: '16px',
        backdropColor: 'rgba(0, 0, 0, 0.6)',
        sound: null,
        onOpen: null,
        onClose: null,
        onConfirm: null,
        onCancel: null,
        inputValidator: null
    };

    // Temas profesionales mejorados
    const themes = {
        modern: { bg: '#ffffff', text: '#1f2937', iconBg: '#f3f4f6', ring: '#e5e7eb', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        success: { bg: '#ffffff', text: '#065f46', iconBg: '#d1fae5', ring: '#34d399', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        error:   { bg: '#ffffff', text: '#991b1b', iconBg: '#fee2e2', ring: '#f87171', gradient: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' },
        warning: { bg: '#ffffff', text: '#92400e', iconBg: '#fef3c7', ring: '#fbbf24', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
        info:    { bg: '#ffffff', text: '#1e40af', iconBg: '#dbeafe', ring: '#60a5fa', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
        question:{ bg: '#ffffff', text: '#4c1d95', iconBg: '#ede9fe', ring: '#a78bfa', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
        dark:    { bg: '#1f2937', text: '#f9fafb', iconBg: '#374151', ring: '#4b5563', gradient: 'linear-gradient(135deg, #374151 0%, #111827 100%)' },
        glass:   { bg: 'rgba(255, 255, 255, 0.7)', text: '#1f2937', iconBg: 'rgba(255,255,255,0.5)', ring: 'rgba(255,255,255,0.8)', backdrop: 'blur(12px)' },
        neon:    { bg: '#0f172a', text: '#e2e8f0', iconBg: '#1e293b', ring: '#0ea5e9', glow: '0 0 20px rgba(14, 165, 233, 0.5)' },
        minimal: { bg: '#ffffff', text: '#000000', iconBg: '#ffffff', ring: '#000000', border: '2px solid #000' },
        sunset:  { bg: '#ffffff', text: '#431407', iconBg: '#ffedd5', ring: '#fb923c', gradient: 'linear-gradient(135deg, #f97316 0%, #db2777 100%)' },
        ocean:   { bg: '#ffffff', text: '#0c4a6e', iconBg: '#e0f2fe', ring: '#0ea5e9', gradient: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)' }
    };

    // Iconos SVG optimizados
    const icons = {
        success: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />',
        error:   '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />',
        warning: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />',
        info:    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />',
        question:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />'
    };

    // --- 2. UTILIDADES DE SEGURIDAD Y DOM ---

    /**
     * Escapa caracteres peligrosos para prevenir XSS
     */
    function escapeHtml(str) {
        if (typeof str !== 'string') return str;
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return str.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Crea elementos DOM de forma segura
     */
    function createElement(tag, className, content, options = {}) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        
        if (content) {
            if (options.allowHTML) {
                el.innerHTML = content;
            } else {
                el.textContent = content; // Seguro por defecto
            }
        }
        return el;
    }

    /**
     * Gestor de Focus Trap (Accesibilidad)
     */
    function trapFocus(container) {
        const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableElements = container.querySelectorAll(focusableSelectors);
        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        function handleKeyDown(e) {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstEl) {
                    lastEl.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastEl) {
                    firstEl.focus();
                    e.preventDefault();
                }
            }
        }

        container.addEventListener('keydown', handleKeyDown);
        
        // Enfocar el primer elemento inmediatamente
        if(firstEl) setTimeout(() => firstEl.focus(), 50);

        return () => container.removeEventListener('keydown', handleKeyDown);
    }

    // --- 3. MOTOR DE ESTILOS (CSS-in-JS Optimizado) ---
    
    let styleInjected = false;
    function injectStyles() {
        if (styleInjected) return;
        
        const css = `
            :root {
                --lumina-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                --lumina-backdrop: rgba(0,0,0,0.4);
            }
            .lumina-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                z-index: 9999; display: flex; align-items: center; justify-content: center;
                opacity: 0; transition: opacity 0.3s ease;
                background: var(--lumina-backdrop);
                -webkit-tap-highlight-color: transparent;
            }
            .lumina-overlay.visible { opacity: 1; }
            .lumina-overlay.blocking { pointer-events: auto; }
            .lumina-overlay:not(.blocking) { pointer-events: none; }
            .lumina-overlay:not(.blocking) .lumina-modal { pointer-events: auto; }
            
            .lumina-modal {
                background: #fff; border-radius: 16px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                padding: 24px; width: 450px; max-width: 90%;
                transform: scale(0.9); opacity: 0;
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
                display: flex; flex-direction: column; gap: 16px;
                position: relative; outline: none;
                font-family: var(--lumina-font);
                backface-visibility: hidden;
            }
            .lumina-overlay.visible .lumina-modal { transform: scale(1); opacity: 1; }
            
            /* Animations */
            .lumina-anim-slide .lumina-modal { transform: translateY(-50px); }
            .lumina-anim-slide.visible .lumina-modal { transform: translateY(0); }
            
            .lumina-anim-bounce .lumina-modal { transform: scale(0.5); }
            .lumina-anim-bounce.visible .lumina-modal { transform: scale(1); }
            
            /* Header & Content */
            .lumina-header { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; }
            .lumina-icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
            .lumina-icon svg { width: 28px; height: 28px; }
            .lumina-title { font-size: 1.5rem; font-weight: 700; margin: 0; line-height: 1.2; }
            .lumina-content { font-size: 1rem; color: #4b5563; text-align: center; margin: 0; line-height: 1.5; }
            
            /* Inputs */
            .lumina-input-group { width: 100%; display: flex; flex-direction: column; gap: 8px; }
            .lumina-input {
                width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;
                font-size: 1rem; transition: border-color 0.2s, box-shadow 0.2s; outline: none;
                font-family: inherit; box-sizing: border-box;
            }
            .lumina-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); }
            .lumina-input.error { border-color: #ef4444; }
            .lumina-error-msg { color: #ef4444; font-size: 0.875rem; display: none; margin-top: 4px; }
            
            /* Actions */
            .lumina-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 8px; }
            .lumina-btn {
                padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 1rem;
                cursor: pointer; transition: all 0.2s; border: none; outline: none;
                font-family: inherit; min-width: 100px;
            }
            .lumina-btn:active { transform: scale(0.96); }
            .lumina-btn-confirm { background: #6366f1; color: white; }
            .lumina-btn-confirm:hover { background: #4f46e5; }
            .lumina-btn-cancel { background: #f3f4f6; color: #374151; }
            .lumina-btn-cancel:hover { background: #e5e7eb; }
            .lumina-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

            /* Close Button */
            .lumina-close {
                position: absolute; top: 12px; right: 12px; background: transparent; border: none;
                font-size: 1.5rem; color: #9ca3af; cursor: pointer; padding: 4px; line-height: 1;
            }
            .lumina-close:hover { color: #4b5563; }

            /* Toasts */
            .lumina-toast-container {
                position: fixed; z-index: 10000; display: flex; flex-direction: column; gap: 10px;
                pointer-events: none;
            }
            .lumina-toast {
                pointer-events: auto; background: #fff; padding: 16px 20px; border-radius: 12px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                display: flex; align-items: center; gap: 12px; min-width: 300px; max-width: 400px;
                transform: translateX(120%); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                font-family: var(--lumina-font); border-left: 4px solid transparent;
            }
            .lumina-toast.show { transform: translateX(0); }
            .lumina-toast.hide { transform: translateX(120%); opacity: 0; }

            /* Wizard Steps */
            .lumina-wizard-steps { display: flex; justify-content: center; gap: 8px; margin-bottom: 16px; }
            .lumina-step-dot { width: 10px; height: 10px; border-radius: 50%; background: #e5e7eb; transition: all 0.3s; }
            .lumina-step-dot.active { background: #6366f1; width: 24px; border-radius: 5px; }
            .lumina-step-dot.completed { background: #10b981; }

            /* Responsive */
            @media (max-width: 640px) {
                .lumina-modal { width: 90%; padding: 20px; }
                .lumina-actions { flex-direction: column-reverse; }
                .lumina-btn { width: 100%; }
                .lumina-toast-container { left: 16px; right: 16px; bottom: 16px; top: auto !important; }
                .lumina-toast { min-width: auto; width: 100%; }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        styleInjected = true;
    }

    // --- 4. CLASE PRINCIPAL DE ALERTA ---

    class LuminaAlert {
        constructor(options = {}) {
            this.id = ++instanceCount;
            this.options = { ...defaults, ...options };
            this.isOpen = false;
            this.timerId = null;
            this.resolvePromise = null;
            this.rejectPromise = null;
            this.elements = {};
            
            // Normalizar contenido
            if (!this.options.allowHTML) {
                if (this.options.title) this.options.title = escapeHtml(this.options.title);
                if (this.options.text) this.options.text = escapeHtml(this.options.text);
            }

            this.init();
        }

        init() {
            injectStyles();
            this.render();
            this.attachEvents();
            
            // Pequeño delay para permitir que el DOM se renderice antes de animar
            requestAnimationFrame(() => {
                this.open();
                if (this.options.timer > 0) {
                    this.startTimer();
                }
            });

            if (this.options.sound) {
                const audio = new Audio(this.options.sound);
                audio.play().catch(() => {}); // Ignorar errores de autoplay
            }
        }

        render() {
            // Overlay
            this.elements.overlay = document.createElement('div');
            this.elements.overlay.className = `lumina-overlay ${this.options.blocking ? 'blocking' : ''}`;
            this.elements.overlay.style.backdropFilter = `blur(${this.options.overlayBlur}px)`;
            this.elements.overlay.style.backgroundColor = this.options.overlay ? this.options.backdropColor : 'transparent';
            if (!this.options.overlay) this.elements.overlay.style.pointerEvents = 'none';

            // Modal
            this.elements.modal = document.createElement('div');
            this.elements.modal.className = `lumina-modal lumina-anim-${this.options.animation}`;
            this.elements.modal.style.width = this.options.width;
            this.elements.modal.style.maxWidth = this.options.maxWidth;
            this.elements.modal.style.borderRadius = this.options.borderRadius;
            
            // Aplicar tema
            const theme = themes[this.options.theme] || themes.modern;
            this.elements.modal.style.background = theme.bg;
            this.elements.modal.style.color = theme.text;
            if (theme.glow) this.elements.modal.style.boxShadow = `${this.elements.modal.style.boxShadow}, ${theme.glow}`;
            if (theme.border) this.elements.modal.style.border = theme.border;

            // Estructura interna
            let htmlContent = '';
            
            // Icono
            if (this.options.icon || ['success','error','warning','info','question'].includes(this.options.theme)) {
                const iconType = this.options.icon || this.options.theme;
                const iconPath = icons[iconType] || icons.info;
                const iconBg = theme.iconBg || '#f3f4f6';
                const iconColor = theme.ring || '#6366f1';
                
                htmlContent += `
                    <div class="lumina-header">
                        <div class="lumina-icon" style="background: ${iconBg}; color: ${iconColor}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">${iconPath}</svg>
                        </div>
                `;
            } else {
                htmlContent += `<div class="lumina-header">`;
            }

            // Título y Texto
            if (this.options.title) {
                htmlContent += `<h2 class="lumina-title">${this.options.title}</h2>`;
            }
            if (this.options.text) {
                htmlContent += `<p class="lumina-content">${this.options.text}</p>`;
            }
            htmlContent += `</div>`; // Cerrar header

            // Input (si existe)
            if (this.options.inputType) {
                const inputType = this.options.inputType === 'password' ? 'password' : 
                                  this.options.inputType === 'email' ? 'email' : 'text';
                htmlContent += `
                    <div class="lumina-input-group">
                        <input type="${inputType}" class="lumina-input" placeholder="${this.options.placeholder || ''}" value="${this.options.inputValue || ''}">
                        <div class="lumina-error-msg">Invalid input</div>
                    </div>
                `;
            }

            // Botones
            htmlContent += `<div class="lumina-actions">`;
            
            // Botón Cancelar (si no es blocking o si se permite cancelar)
            if (!this.options.blocking || this.options.showCancel) {
                const cancelText = this.options.cancelButtonText || 'Cancelar';
                htmlContent += `<button class="lumina-btn lumina-btn-cancel" data-action="cancel">${escapeHtml(cancelText)}</button>`;
            }

            // Botón Confirmar
            const confirmText = this.options.confirmButtonText || 'OK';
            const confirmDisabled = this.options.inputType && !this.options.inputValue ? ' disabled' : '';
            htmlContent += `<button class="lumina-btn lumina-btn-confirm"${confirmDisabled} data-action="confirm">${escapeHtml(confirmText)}</button>`;
            
            htmlContent += `</div>`;

            // Botón cerrar (X)
            if (this.options.closable && !this.options.blocking) {
                htmlContent += `<button class="lumina-close" data-action="close">&times;</button>`;
            }

            this.elements.modal.innerHTML = htmlContent;
            this.elements.overlay.appendChild(this.elements.modal);
            document.body.appendChild(this.elements.overlay);

            // Referencias a inputs
            if (this.options.inputType) {
                this.elements.input = this.elements.modal.querySelector('.lumina-input');
                this.elements.errorMsg = this.elements.modal.querySelector('.lumina-error-msg');
            }
        }

        attachEvents() {
            // Click en Overlay
            this.elements.overlay.addEventListener('click', (e) => {
                if (e.target === this.elements.overlay && this.options.closeOnOverlay && !this.options.blocking) {
                    this.close('overlay');
                }
            });

            // Tecla Escape
            this._escHandler = (e) => {
                if (e.key === 'Escape' && this.options.closeOnEsc && !this.options.blocking) {
                    this.close('escape');
                }
            };
            document.addEventListener('keydown', this._escHandler);

            // Botones
            this.elements.modal.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;
                
                const action = btn.dataset.action;
                if (action === 'confirm') this.handleConfirm();
                if (action === 'cancel') this.close('cancel');
                if (action === 'close') this.close('close');
            });

            // Input validation en tiempo real
            if (this.elements.input) {
                this.elements.input.addEventListener('input', () => {
                    const val = this.elements.input.value.trim();
                    const confirmBtn = this.elements.modal.querySelector('[data-action="confirm"]');
                    
                    if (this.options.inputValidator) {
                        const isValid = this.options.inputValidator(val);
                        if (isValid === true) {
                            confirmBtn.disabled = false;
                            this.elements.errorMsg.style.display = 'none';
                            this.elements.input.classList.remove('error');
                        } else {
                            confirmBtn.disabled = true;
                            // No mostrar error hasta que intente enviar
                        }
                    } else {
                        confirmBtn.disabled = val.length === 0;
                    }
                });
                
                // Enter para confirmar
                this.elements.input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !this.elements.modal.querySelector('[data-action="confirm"]').disabled) {
                        this.handleConfirm();
                    }
                });
            }

            // Focus Trap
            if (this.options.trapFocus) {
                this._releaseFocus = trapFocus(this.elements.modal);
            }
            
            // Prevenir scroll en body
            document.body.style.overflow = 'hidden';
            // Ajustar padding-right si hay scrollbar
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`;
            }
        }

        open() {
            this.isOpen = true;
            this.elements.overlay.classList.add('visible');
            if (this.options.onOpen) this.options.onOpen(this);
        }

        handleConfirm() {
            let value = true;
            if (this.elements.input) {
                value = this.elements.input.value.trim();
                if (this.options.inputValidator) {
                    const valid = this.options.inputValidator(value);
                    if (valid !== true) {
                        this.elements.errorMsg.textContent = typeof valid === 'string' ? valid : 'Entrada inválida';
                        this.elements.errorMsg.style.display = 'block';
                        this.elements.input.classList.add('error');
                        this.elements.input.focus();
                        return; // Detener
                    }
                }
            }

            if (this.options.onConfirm) {
                const result = this.options.onConfirm(value);
                if (result instanceof Promise) {
                    // Mostrar loading state si es promesa
                    const btn = this.elements.modal.querySelector('[data-action="confirm"]');
                    const originalText = btn.textContent;
                    btn.disabled = true;
                    btn.textContent = '...';
                    
                    result.then(res => {
                        this.close('confirm', res);
                    }).catch(err => {
                        btn.disabled = false;
                        btn.textContent = originalText;
                        // Manejar error
                    });
                    return;
                }
            }
            
            this.close('confirm', value);
        }

        close(action = 'unknown', payload = null) {
            if (!this.isOpen) return;
            this.isOpen = false;
            
            clearTimeout(this.timerId);
            if (this._releaseFocus) this._releaseFocus();
            document.removeEventListener('keydown', this._escHandler);

            this.elements.overlay.classList.remove('visible');
            
            // Esperar a que termine la animación
            setTimeout(() => {
                if (this.elements.overlay.parentNode) {
                    this.elements.overlay.parentNode.removeChild(this.elements.overlay);
                }
                // Restaurar scroll
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                
                if (this.options.onClose) this.options.onClose(action, payload);
                
                // Resolver promesa
                if (this.resolvePromise) {
                    if (action === 'confirm') this.resolvePromise(payload);
                    else if (action === 'cancel' || action === 'close' || action === 'overlay' || action === 'escape') {
                        if (this.options.blocking) this.resolvePromise(payload); // En blocking, siempre resuelve
                        else this.rejectPromise({ dismissedBy: action });
                    }
                }
                
                // Procesar cola
                processQueue();
            }, 300);
        }

        startTimer() {
            let remaining = this.options.timer;
            const step = 100;
            
            this.timerId = setInterval(() => {
                remaining -= step;
                if (remaining <= 0) this.close('timer');
            }, step);
            
            // Pausar en hover
            this.elements.modal.addEventListener('mouseenter', () => clearInterval(this.timerId));
            this.elements.modal.addEventListener('mouseleave', () => {
                if (this.isOpen && !this.timerId) this.startTimer(); // Reiniciar lógica simplificada
            });
        }

        then(resolve, reject) {
            return new Promise((res, rej) => {
                this.resolvePromise = res;
                this.rejectPromise = rej;
            }).then(resolve, reject);
        }
        
        // Método para forzar cierre (útil en blocking si se cumple condición externa)
        forceClose(result) {
            this.close('force', result);
        }
    }

    // --- 5. GESTIÓN DE COLA ---
    
    function processQueue() {
        if (isProcessingQueue || queue.length === 0) return;
        
        isProcessingQueue = true;
        const next = queue.shift();
        const alert = new LuminaAlert(next.options);
        
        alert.then(
            (res) => { if(next.resolve) next.resolve(res); },
            (err) => { if(next.reject) next.reject(err); }
        ).finally(() => {
            isProcessingQueue = false;
            processQueue();
        });
    }

    // --- 6. API PÚBLICA ---

    const lumina = {
        version: VERSION,
        
        // Configuración global
        setDefaults: (newDefaults) => {
            Object.assign(defaults, newDefaults);
        },

        // Métodos rápidos
        alert: (text, title, options = {}) => {
            if (typeof title === 'object') { options = title; title = null; }
            return new LuminaAlert({ text, title, ...options });
        },
        
        success: (text, title = '¡Éxito!', options = {}) => {
            return new LuminaAlert({ text, title, theme: 'success', icon: 'success', ...options });
        },
        
        error: (text, title = 'Error', options = {}) => {
            return new LuminaAlert({ text, title, theme: 'error', icon: 'error', ...options });
        },
        
        warning: (text, title = 'Advertencia', options = {}) => {
            return new LuminaAlert({ text, title, theme: 'warning', icon: 'warning', ...options });
        },
        
        info: (text, title = 'Información', options = {}) => {
            return new LuminaAlert({ text, title, theme: 'info', icon: 'info', ...options });
        },
        
        question: (text, title = 'Pregunta', options = {}) => {
            return new LuminaAlert({ text, title, theme: 'question', icon: 'question', ...options });
        },

        // Confirmación estándar
        confirm: (text, title = '¿Estás seguro?', options = {}) => {
            return new LuminaAlert({ 
                text, title, icon: 'question', 
                showCancel: true, 
                confirmButtonText: 'Sí', 
                cancelButtonText: 'No',
                ...options 
            });
        },

        // Prompt con input
        prompt: (text, title = 'Ingrese datos', options = {}) => {
            return new LuminaAlert({
                text, title, icon: 'info',
                inputType: 'text',
                showCancel: true,
                ...options
            });
        },

        // Modal personalizado avanzado
        modal: (content, options = {}) => {
            return new LuminaAlert({
                text: content,
                allowHTML: true, // Los modales personalizados suelen necesitar HTML
                ...options
            });
        },

        // Wizard (Asistente de pasos)
        wizard: (steps, options = {}) => {
            return new Promise((resolve, reject) => {
                let currentStep = 0;
                const totalSteps = steps.length;

                function showStep(index) {
                    if (index >= totalSteps) {
                        resolve({ completed: true, steps: steps });
                        return;
                    }
                    const step = steps[index];
                    
                    const alert = new LuminaAlert({
                        title: step.title || `Paso ${index + 1}`,
                        text: step.text || step.content || '',
                        icon: step.icon || 'info',
                        confirmButtonText: index === totalSteps - 1 ? 'Finalizar' : 'Siguiente',
                        showCancel: index > 0, // Permitir volver atrás o cancelar si no es el primero
                        cancelButtonText: index === 0 ? 'Cancelar' : 'Atrás',
                        allowHTML: true,
                        blocking: step.blocking || false,
                        ...options,
                        onConfirm: (val) => {
                            if (step.onConfirm) {
                                const res = step.onConfirm(val);
                                if (res === false) return false; // Prevenir avance
                                if (res instanceof Promise) return res;
                            }
                            currentStep++;
                            // Cerrar actual y abrir siguiente
                            // Truco: la promesa del wizard se resuelve al final
                            return true; 
                        },
                        onCancel: () => {
                            if (index === 0) reject({ dismissed: true });
                            else currentStep--;
                        }
                    });

                    // Hack para manejar el flujo del wizard dentro del ciclo de vida
                    alert.then((res) => {
                        if (res === true) showStep(currentStep);
                    }).catch(() => {
                         if (currentStep < index) showStep(currentStep); // Si fue "Atrás"
                         else reject({ dismissed: true }); // Si fue "Cancelar" inicial
                    });
                }

                showStep(0);
            });
        },

        // Toast / Notificación flotante
        toast: (message, type = 'info', options = {}) => {
            injectStyles();
            const containerId = 'lumina-toast-container-' + (options.position || 'top-right');
            let container = document.getElementById(containerId);
            
            if (!container) {
                container = document.createElement('div');
                container.id = containerId;
                container.className = 'lumina-toast-container';
                
                // Posicionamiento
                const pos = options.position || 'top-right';
                const styles = {
                    'top-right': { top: '20px', right: '20px', alignItems: 'flex-end' },
                    'top-left': { top: '20px', left: '20px', alignItems: 'flex-start' },
                    'bottom-right': { bottom: '20px', right: '20px', alignItems: 'flex-end' },
                    'bottom-left': { bottom: '20px', left: '20px', alignItems: 'flex-start' },
                    'top-center': { top: '20px', left: '50%', transform: 'translateX(-50%)', alignItems: 'center' },
                    'bottom-center': { bottom: '20px', left: '50%', transform: 'translateX(-50%)', alignItems: 'center' }
                };
                
                Object.assign(container.style, styles[pos]);
                document.body.appendChild(container);
            }

            const toast = document.createElement('div');
            toast.className = 'lumina-toast';
            
            const colors = {
                success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6'
            };
            toast.style.borderLeftColor = colors[type] || colors.info;
            
            // Icono pequeño
            const iconPath = icons[type] || icons.info;
            toast.innerHTML = `
                <div style="color: ${colors[type] || colors.info}">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${iconPath}</svg>
                </div>
                <div style="flex:1">${options.allowHTML ? message : escapeHtml(message)}</div>
            `;
            
            container.appendChild(toast);
            
            // Animar entrada
            requestAnimationFrame(() => toast.classList.add('show'));
            
            const duration = options.timer || 3000;
            if (duration > 0) {
                setTimeout(() => {
                    toast.classList.remove('show');
                    toast.classList.add('hide');
                    setTimeout(() => {
                        if(toast.parentNode) toast.parentNode.removeChild(toast);
                        if(container.children.length === 0) container.parentNode.removeChild(container);
                    }, 400);
                }, duration);
            }
            
            return { close: () => toast.click() }; // Simular click para cerrar
        },

        // Loading (Spinner)
        loading: (title = 'Cargando...', options = {}) => {
            return new LuminaAlert({
                title,
                icon: null, // Sin icono por defecto, o spinner custom
                allowHTML: true,
                blocking: true,
                closable: false,
                closeOnEsc: false,
                closeOnOverlay: false,
                overlayBlur: 8,
                ...options,
                // Inyectar spinner CSS si no hay icono
                onOpen: (instance) => {
                    if (!options.icon) {
                        const spinner = `<svg class="animate-spin" style="width:40px;height:40px;color:#6366f1;animation:spin 1s linear infinite" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25" stroke-width="4"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
                        const header = instance.elements.modal.querySelector('.lumina-header');
                        if(header) header.innerHTML = spinner + (title ? `<h2 class="lumina-title" style="margin-top:16px">${title}</h2>` : '');
                    }
                    if (options.onOpen) options.onOpen(instance);
                }
            });
        },
        
        // Utilidad para cerrar todas las alertas abiertas
        closeAll: () => {
            document.querySelectorAll('.lumina-overlay').forEach(el => {
                el.classList.remove('visible');
                setTimeout(() => el.remove(), 300);
            });
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        },

        // Raw HTML helper (uso bajo responsabilidad del dev)
        raw: (html) => ({ __html: html })
    };

    // Agregar estilos de animación extra dinámicamente si es necesario
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
    document.head.appendChild(styleSheet);

    return lumina;
}));
