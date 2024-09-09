import cors from 'cors'
import express from 'express'
import fs from 'fs'
import multer from 'multer'

import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors({
    origin: '*'  // Permitir todas as origens (mais permissivo)
}));

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo inválido, envie apenas imagens!'), false);
        }
    }
});

const api_key = 'AIzaSyDlodF7RNoPUGbwNe0tI8OD7g_JlE9iLD8';

const genAI = new GoogleGenerativeAI(api_key);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

app.post('/ask-gemini',upload.single('imagem'), async (req, res) => {
    const userInput = req.body.question;
    const historico = JSON.parse(req.body.historico);  // Receber o histórico
    const caminhoImagem = req.file ? req.file.path : null;

    try {
        let chat = model.startChat({history : historico})

        let response;
        if (caminhoImagem) {
                const imagePart = await fileToGenerativePart(caminhoImagem, "image/jpeg");

            /*

            const message = {
                role: 'user',
                content: [
                  { text: userInput},
                  imagePart 
                ]
            };
            
            response = await chat.sendMessage(message);  // Enviar pergunta e imagem*/
                response = await model.generateContent([userInput, imagePart]);
        } else {
            response = await chat.sendMessage(userInput);  // Apenas pergunta
        }
        if (caminhoImagem) fs.unlinkSync(caminhoImagem);

        res.json({answer: response.response.text()});
    } catch (error) {
        console.error('Erro ao comunicar com a API:', error.response?.data || error.message); // Log do erro detalhado
        res.status(500).json({ error: 'Erro ao comunicar com a API' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

async function fileToGenerativePart(path, mimeType) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType,
      },
    };
}