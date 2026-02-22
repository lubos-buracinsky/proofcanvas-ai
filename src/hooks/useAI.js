import { useState, useRef, useCallback } from 'react'

export default function useAI() {
  const [isLoading, setIsLoading] = useState(false)
  const [streamedText, setStreamedText] = useState('')
  const abortRef = useRef(null)

  const streamRequest = useCallback(async (endpoint, body, onChunk) => {
    setIsLoading(true)
    setStreamedText('')
    abortRef.current = new AbortController()

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(err.error || `HTTP ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue
            try {
              const parsed = JSON.parse(data)
              if (parsed.text) {
                fullText += parsed.text
                setStreamedText(fullText)
                onChunk?.(parsed.text, fullText)
              }
              if (parsed.error) {
                throw new Error(parsed.error)
              }
            } catch (e) {
              if (e.message !== 'Unexpected end of JSON input') {
                // Might be a partial chunk, ignore parse errors
              }
            }
          }
        }
      }

      setIsLoading(false)
      return fullText
    } catch (err) {
      if (err.name === 'AbortError') {
        setIsLoading(false)
        return streamedText
      }
      setIsLoading(false)
      throw err
    }
  }, [])

  const cancel = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const reset = useCallback(() => {
    setStreamedText('')
    setIsLoading(false)
  }, [])

  return { isLoading, streamedText, streamRequest, cancel, reset }
}
