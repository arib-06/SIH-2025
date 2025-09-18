// AI Assistant Chat Functionality
const API_BASE = 'http://localhost:5000';

class ChatAssistant {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.init();
    }

    init() {
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => this.sendMessage());
        }
        
        if (this.messageInput) {
            this.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Add welcome message
        this.addMessage('ai', 'Hello! I\'m your Traverz AI assistant. How can I help you plan your perfect trip today?');
    }

    async sendMessage() {
        const message = this.messageInput?.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage('user', message);
        this.messageInput.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            const response = await fetch(`${API_BASE}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            const result = await response.json();

            // Remove typing indicator
            this.hideTypingIndicator();

            if (result.success) {
                this.addMessage('ai', result.response);
            } else {
                this.addMessage('ai', 'Sorry, I encountered an error. Please try again.');
            }
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('ai', 'Sorry, I\'m having trouble connecting. Please check your connection and try again.');
        }
    }

    addMessage(sender, text) {
        if (!this.chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message animate-fadeInUp`;

        const isUser = sender === 'user';
        const avatarIcon = isUser ? '👤' : '🤖';
        const messageClass = isUser ? 'user-message' : 'ai-message';
        const alignment = isUser ? 'justify-end' : 'justify-start';

        messageDiv.innerHTML = `
            <div class="flex ${alignment} mb-4">
                <div class="flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start max-w-3xl">
                    <div class="flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}">
                        <div class="w-8 h-8 rounded-full ${isUser ? 'bg-blue-500' : 'bg-purple-500'} flex items-center justify-center text-white text-sm">
                            ${avatarIcon}
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="px-4 py-3 rounded-2xl ${isUser ? 'bg-blue-500 text-white' : 'bg-white border border-slate-200'} shadow-sm">
                            <p class="text-sm leading-relaxed">${text}</p>
                        </div>
                        <div class="text-xs text-slate-500 mt-1 ${isUser ? 'text-right' : 'text-left'}">
                            ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        if (!this.chatMessages) return;

        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'message ai-message animate-fadeInUp';
        typingDiv.innerHTML = `
            <div class="flex justify-start mb-4">
                <div class="flex flex-row items-start max-w-3xl">
                    <div class="flex-shrink-0 mr-3">
                        <div class="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm">
                            🤖
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                            <div class="flex space-x-1">
                                <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                                <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }
}

// Quick action buttons
function sendQuickMessage(message) {
    const chatAssistant = window.chatAssistant;
    if (chatAssistant && chatAssistant.messageInput) {
        chatAssistant.messageInput.value = message;
        chatAssistant.sendMessage();
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.chatAssistant = new ChatAssistant();
});

// Make functions globally available
window.sendQuickMessage = sendQuickMessage;
