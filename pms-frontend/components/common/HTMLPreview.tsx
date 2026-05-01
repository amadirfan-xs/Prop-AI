"use client";

import React from 'react';

interface HTMLPreviewProps {
    html: string;
    className?: string;
    thumbnail?: boolean;
}

export function HTMLPreview({ html, className = "", thumbnail = false }: HTMLPreviewProps) {
    // Basic wrapper to ensure font and base styles look consistent in the preview
    const fullHtml = `
        <!DOCTYPE html>
        <html>
            <head>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        line-height: 1.6;
                        color: #111827;
                        margin: 0;
                        padding: ${thumbnail ? '20px' : '40px'};
                        background: white;
                    }
                    * { box-sizing: border-box; }
                    /* Style the scrollbar for the preview */
                    ::-webkit-scrollbar { width: 6px; }
                    ::-webkit-scrollbar-track { background: transparent; }
                    ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
                </style>
            </head>
            <body>
                ${html}
            </body>
        </html>
    `;

    return (
        <div className={`relative w-full h-full bg-white ${className} overflow-hidden`}>
            <iframe
                title="Contract Preview"
                srcDoc={fullHtml}
                className={`w-full h-full border-none pointer-events-${thumbnail ? 'none' : 'auto'}`}
                style={{
                    transform: thumbnail ? 'scale(0.8)' : 'none',
                    transformOrigin: 'top center',
                }}
            />
        </div>
    );
}
