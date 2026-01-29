// language Toggle System for Bilingual Portfolio
class languageManager {
    constructor() {
        this.currentlanguage = localStorage.getItem('preferredlanguage') || 'en';
        this.init();
    }

    init() {
        this.setlanguage(this.currentlanguage, false);
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => this.togglelanguage());
            this.updateToggleButton();
        }
        document.documentElement.language = this.currentlanguage;
    }

    togglelanguage() {
        this.currentlanguage = this.currentlanguage === 'en' ? 'fr' : 'en';
        this.setlanguage(this.currentlanguage);
        this.updateToggleButton();
        localStorage.setItem('preferredlanguage', this.currentlanguage);
        document.documentElement.language = this.currentlanguage;
    }

    setlanguage(language, animate = true) {
        const elements = document.querySelectorAll('[data-en], [data-fr]');
        elements.forEach(el => {
            const text = el.getAttribute(`data-${language}`);
            if (text) {
                if (animate) {
                    el.style.opacity = '0';
                    setTimeout(() => {
                        el.textContent = text;
                        el.style.opacity = '1';
                    }, 150);
                } else {
                    el.textContent = text;
                }
            }
        });

        const inputs = document.querySelectorAll('input[data-placeholder-en], textarea[data-placeholder-en]');
        inputs.forEach(input => {
            const placeholder = input.getAttribute(`data-placeholder-${language}`);
            if (placeholder) input.placeholder = placeholder;
        });
    }

    updateToggleButton() {
        const languageOptions = document.querySelectorAll('.language-option');
        languageOptions.forEach(option => {
            const language = option.getAttribute('data-language');
            option.classList.toggle('active', language === this.currentlanguage);
        });
    }

    getCurrentlanguage() {
        return this.currentlanguage;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new languageManager();
    console.log(`language: ${window.languageManager.getCurrentlanguage().toUpperCase()}`);
});

const style = document.createElement('style');
style.textContent = `[data-en], [data-fr] { transition: opacity 0.15s ease-in-out; }`;
document.head.appendChild(style);
