import React, { useState, useEffect } from 'react';
import { parseCopilotQuery, type CopilotQueryResult } from '../services/copilotService';

interface AICopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AICopilotModal: React.FC<AICopilotModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<CopilotQueryResult | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or state
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const res = parseCopilotQuery(query);
    setResult(res);
  };

  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    if (!isListening) {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        const res = parseCopilotQuery(transcript);
        setResult(res);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      setIsListening(false);
      recognition.stop();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '6rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#1e293b',
          color: '#f8fafc',
          borderRadius: '1rem',
          width: '90%',
          maxWidth: '650px',
          border: '1px solid #334155',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
        }}
      >
        {/* Copilot Header Search Bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid #334155' }}>
          <span style={{ fontSize: '1.2rem', marginRight: '0.75rem' }}>🤖</span>
          <input
            type="text"
            placeholder="Ask AI Copilot (e.g. 'Show rooms needing maintenance', 'Overdue fees')..."
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={handleVoiceToggle}
            style={{
              background: isListening ? '#ef4444' : '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.4rem 0.75rem',
              fontSize: '0.85rem',
              marginRight: '0.5rem',
              cursor: 'pointer',
            }}
          >
            {isListening ? '🎙️ Listening...' : '🎤 Voice'}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </form>

        {/* Quick Suggestion Prompts */}
        {!result && (
          <div style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Suggested Prompt Commands
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                'Which rooms are likely to need maintenance next week?',
                'Show students with overdue fees.',
                'Generate this month\'s complaint report.',
                'Show current hostel occupancy and vacant beds.',
              ].map(prompt => (
                <button
                  key={prompt}
                  onClick={() => {
                    setQuery(prompt);
                    setResult(parseCopilotQuery(prompt));
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '0.5rem',
                    color: '#cbd5e1',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  💡 {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Copilot Result Output */}
        {result && (
          <div style={{ padding: '1.25rem', maxHeight: '400px', overflowY: 'auto' }}>
            <p style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1rem' }}>{result.answer}</p>

            {result.dataPoints && result.dataPoints.length > 0 && (
              <div style={{ backgroundColor: '#0f172a', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                      {Object.keys(result.dataPoints[0]).map(k => (
                        <th key={k} style={{ padding: '0.4rem', textTransform: 'capitalize' }}>{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.dataPoints.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                        {Object.values(row).map((v, i) => (
                          <td key={i} style={{ padding: '0.4rem', color: '#cbd5e1' }}>{String(v)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {result.suggestedActions.length > 0 && (
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Automated Actions</div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {result.suggestedActions.map(action => (
                    <button
                      key={action}
                      onClick={() => alert(`Executed: ${action}`)}
                      style={{
                        backgroundColor: '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '0.375rem',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ⚡ {action}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
