"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterIndicator = ChapterIndicator;
const jsx_runtime_1 = require("preact/jsx-runtime");
const chapterTitles = {
    1: 'Chapter 1: The Awakening',
    2: 'Chapter 2: The Journey',
    3: 'Chapter 3: The Guardian',
    4: 'Epilogue',
};
function ChapterIndicator({ chapter }) {
    const title = chapterTitles[chapter] || `Chapter ${chapter}`;
    return ((0, jsx_runtime_1.jsx)("div", { style: {
            padding: '0.35rem 0.75rem',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#e7f4f1',
            display: 'inline-block',
            letterSpacing: '0.02em',
        }, children: title }));
}
