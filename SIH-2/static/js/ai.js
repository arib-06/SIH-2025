/** @format */

import {getAI, getGenerativeModel, GoogleAIBackend} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-ai.js';
import {app} from './firebase.js';

const ai = getAI(app, {backend: new GoogleAIBackend()});
const model = getGenerativeModel(ai, {model: 'gemini-2.5-flash'});

async function generateAIResponse(prompt, onChunk) {
	const stream = await model.streamContent(prompt);
	let finalText = '';

	// Listen for incoming chunks
	for await (const event of stream) {
		if (event.type === 'output_text') {
			const chunk = event.text;
			finalText += chunk;
			if (onChunk) onChunk(chunk); // callback for partial updates
		}
	}

	console.log('Final text:', finalText);
	return finalText;
}

// Example usage:
// generateAIResponseStream("Hello!", chunk => console.log("Chunk received:", chunk));

window.generateAIResponse = generateAIResponse;
export {generateAIResponse};
