/** @format */

import { getAI, getGenerativeModel, GoogleAIBackend } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-ai.js';
import {app} from './firebase.js'
const ai = getAI(app, {backend: new GoogleAIBackend()});

const model = getGenerativeModel(ai, {model: 'gemini-2.5-flash'});

async function generateAIResponse(prompt) {
	const result = await model.generateContent(prompt);
	const response = result.response;
	const text = response.text();
	console.log(text);
	return text;
}
window.generateAIResponse=generateAIResponse
export {generateAIResponse};