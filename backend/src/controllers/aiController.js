const { GoogleGenerativeAI } = require('@google/generative-ai');
const Project = require('../models/Project');
require('dotenv').config();

exports.generate = async (req, res) => {
  try {
    const { prompt, maxTokens = 300, student = null, marks = null } = req.body;
    if (!prompt && !student && !marks) return res.status(400).json({ message: 'Prompt or student/marks required' });

    const apiKey = `AIzaSyAcO51IGWdPTDcR7qMu8nuaM1zK2y1GFq4`;
    if (!apiKey) {
      console.error('Missing GOOGLE_GENAI_KEY in environment');
      return res.status(500).json({ message: 'Server misconfiguration: missing Google Generative AI key' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build student context
    let studentContext = '';
    if (student) studentContext += `Student: ${student.name || ''} (${student.email || ''})\n`;
    if (marks) {
      if (Array.isArray(marks.subjects)) {
        studentContext += 'Subjects and percentages:\n';
        marks.subjects.forEach(s => {
          const name = s.name || s.subject || s.subject_name || 'Unknown';
          const percent = s.percentage || s.percent || s.marks || '';
          studentContext += `- ${name}: ${percent}\n`;
        });
        if (marks.overall_percentage) studentContext += `Overall: ${marks.overall_percentage}\n`;
      } else if (typeof marks === 'object' && Object.keys(marks).length) {
        studentContext += 'Marks data:\n' + JSON.stringify(marks, null, 2) + '\n';
      } else if (typeof marks === 'string') {
        studentContext += marks + '\n';
      }
    }

    const modifiedPrompt = `
${prompt}

Context:
${studentContext}

Instructions:
- Provide exactly 3 Final Year Project ideas tailored to the student's strengths and to improve weak areas.
- Output MUST be a JSON array only, exactly like:
[
  { "title": "Project Title 1", "description": "One-line description" },
  { "title": "Project Title 2", "description": "One-line description" },
  { "title": "Project Title 3", "description": "One-line description" }
]
- Do not include any extra text outside the JSON array.
`;

    const result = await model.generateContent(modifiedPrompt);
    // robust extraction of text from various response shapes
    let text =
      result?.response?.text?.() ||
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      result?.output?.[0]?.content?.text ||
      result?.text ||
      '';

    if (!text) {
      console.error('Gemini returned empty response:', JSON.stringify(result, null, 2));
      return res.status(500).json({ message: 'No text response from Gemini', details: result });
    }

    // cleanup triple backticks and excessive newlines
    text = text.replace(/```(?:json)?/g, '').trim();

    // Try parse JSON directly
    let projects = null;
    try {
      projects = JSON.parse(text);
    } catch (e) {
      // fallback: extract first JSON array substring
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          projects = JSON.parse(match[0]);
        } catch (e2) {
          // ignore, will fallback below
          console.error('Fallback JSON parse failed', e2);
        }
      }
    }

    // final fallback: best-effort parse bullets into objects
    if (!Array.isArray(projects)) {
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const items = [];
      for (let ln of lines) {
        // match patterns like: • **Title** — Desc  OR Title — Desc
        const m = ln.match(/(?:•\s*)?(?:\*{0,2})([^—-]+)[—-]\s*(.+)/);
        if (m) {
          items.push({ title: m[1].replace(/\*+/g, '').trim(), description: m[2].trim() });
        }
        if (items.length === 3) break;
      }
      if (items.length) projects = items;
    }

    if (Array.isArray(projects)) {
      // Optionally save suggestion to a Project model if needed (kept out by default)
      return res.json({ result: projects, raw: result });
    }

    // If we couldn't parse into structured array, return raw text with status 200 and useful info
    return res.status(200).json({
      result: null,
      rawText: text,
      message: 'AI returned non-JSON response. See rawText for details.',
      raw: result,
    });
  } catch (err) {
    console.error('Gemini generate error:', err.message || err);
    return res.status(500).json({
      message: 'Gemini request failed',
      details: err.message || err,
    });
  }
};
