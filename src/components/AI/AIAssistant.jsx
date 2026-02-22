import { useState, useRef, useEffect, useCallback } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import useAI from '../../hooks/useAI'
import useCanvas from '../../hooks/useCanvas'
import useTranslation from '../../hooks/useTranslation'

export default function AIAssistant({ onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const { isLoading, streamedText, streamRequest, cancel } = useAI()
  const { activeCanvas } = useCanvas()
  const { t } = useTranslation()
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamedText])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return
    const userMessage = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    try {
      const fullText = await streamRequest('/api/ai/chat', {
        messages: newMessages,
        blocks: activeCanvas?.blocks,
      })
      setMessages(prev => [...prev, { role: 'assistant', content: fullText }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }])
    }
  }, [input, messages, isLoading, streamRequest, activeCanvas])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border dark:border-dark-border">
        <div className="flex items-center gap-2">
          <SmartToyIcon className="text-primary" sx={{ fontSize: 20 }} />
          <h3 className="font-semibold text-sm text-text dark:text-dark-text">{t('ai.assistant')}</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-hover dark:hover:bg-dark-surface-hover text-text-secondary dark:text-dark-text-secondary cursor-pointer">
          <CloseIcon fontSize="small" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-8 text-text-secondary dark:text-dark-text-secondary">
            <SmartToyIcon sx={{ fontSize: 48, opacity: 0.3 }} />
            <p className="mt-2 text-sm">{t('ai.emptyChat')}</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm
              ${msg.role === 'user' ? 'bg-primary text-white rounded-br-md' : 'bg-surface-alt dark:bg-dark-surface rounded-bl-md text-text dark:text-dark-text'}`}>
              {msg.role === 'assistant' ? (
                <div className="ai-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown></div>
              ) : msg.content}
            </div>
          </div>
        ))}
        {isLoading && streamedText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-2.5 text-sm bg-surface-alt dark:bg-dark-surface text-text dark:text-dark-text">
              <div className="ai-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{streamedText}</ReactMarkdown></div>
            </div>
          </div>
        )}
        {isLoading && !streamedText && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md px-4 py-3 bg-surface-alt dark:bg-dark-surface">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-text-secondary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-text-secondary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-text-secondary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-3 border-t border-border dark:border-dark-border">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={t('ai.askPlaceholder')}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border dark:border-dark-border bg-white dark:bg-dark-surface
              text-sm text-text dark:text-dark-text placeholder:text-text-secondary/50
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            disabled={isLoading}
          />
          <button
            onClick={isLoading ? cancel : handleSend}
            disabled={!isLoading && !input.trim()}
            className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <SendIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
      </div>
    </div>
  )
}
