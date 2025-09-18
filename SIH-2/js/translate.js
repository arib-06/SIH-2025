// Translation functionality
const API_BASE = 'http://localhost:5000';

async function translateText(text, targetLang) {
    try {
        const response = await fetch(`${API_BASE}/translate`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                q: text,
                target: targetLang
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            return data.translated_text;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Translation error:', error);
        return 'Translation failed. Please try again.';
    }
}

// Handle translation form submission
async function handleTranslation() {
    const sourceText = document.getElementById('sourceText')?.value;
    const targetLang = document.getElementById('targetLanguage')?.value;
    const resultDiv = document.getElementById('translationResult');
    
    if (!sourceText) {
        alert('Please enter text to translate');
        return;
    }
    
    // Show loading state
    if (resultDiv) {
        resultDiv.innerHTML = '<div class="text-center py-4"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div><p class="mt-2 text-slate-600">Translating...</p></div>';
    }
    
    try {
        const translatedText = await translateText(sourceText, targetLang);
        
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 class="font-semibold text-green-800 mb-2">Translation Result:</h4>
                    <p class="text-green-700">${translatedText}</p>
                    <button onclick="copyToClipboard('${translatedText}')" class="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                        Copy to Clipboard
                    </button>
                </div>
            `;
        }
    } catch (error) {
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p class="text-red-700">Translation failed. Please try again.</p>
                </div>
            `;
        }
    }
}

// Copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Text copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy text');
    });
}

// Swap languages
function swapLanguages() {
    const sourceSelect = document.getElementById('sourceLanguage');
    const targetSelect = document.getElementById('targetLanguage');
    
    if (sourceSelect && targetSelect) {
        const temp = sourceSelect.value;
        sourceSelect.value = targetSelect.value;
        targetSelect.value = temp;
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const translateBtn = document.getElementById('translateBtn');
    if (translateBtn) {
        translateBtn.addEventListener('click', handleTranslation);
    }
    
    const swapBtn = document.getElementById('swapBtn');
    if (swapBtn) {
        swapBtn.addEventListener('click', swapLanguages);
    }
});

// Make functions globally available
window.translateText = translateText;
window.handleTranslation = handleTranslation;
window.copyToClipboard = copyToClipboard;
window.swapLanguages = swapLanguages;