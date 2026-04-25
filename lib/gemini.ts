import { GoogleGenerativeAI } from '@google/generative-ai'

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export const MODEL = 'gemini-1.5-pro'
