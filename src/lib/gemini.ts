"use server"

import axios from "axios"

export const sendPromptToGemini = async ({prompt}: {prompt: string}) => {
    const req = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, 
        {
            contents: [
                { "parts": [{"text": prompt}]}
            ]
        }
    )

    try {
        let response: string = req.data.candidates[0].content.parts[0].text

        response = response.replace("```json", "").replace("```json", "")

        return JSON.parse(response)
    } catch (error) {
        console.error(error)
        return {
            error: "Resposta Indisponível"
        }
    }
}