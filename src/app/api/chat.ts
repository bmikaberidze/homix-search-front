const DEFAULT_CHAT_API_URL = '/api/chat'

type ChatApiPayload = {
    session_id: string
    message: string
}

export type ChatApiResult = {
    text: string
    raw: unknown
}

export type ChatStreamEventType =
    | 'thinking'
    | 'answer'
    | 'tool_call'
    | 'tool_result'
    | 'done'
    | 'error'

export interface ChatStreamEvent {
    type: ChatStreamEventType
    content?: string
    data?: unknown
}

const resolveChatApiUrl = () => {
    const env = (import.meta as { env?: Record<string, string> }).env
    const envUrl = env?.VITE_CHAT_API_URL
    const url =
        envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0
            ? envUrl
            : DEFAULT_CHAT_API_URL
    return url
}

const resolveChatStreamApiUrl = () => {
    const baseUrl = resolveChatApiUrl()
    // If base url ends with /api/chat, replace it with /api/chat/stream or append /stream
    // But simpler: let's assume valid base structure or just append /stream if it's the default
    if (baseUrl.endsWith('/chat')) {
        return baseUrl + '/stream'
    }
    return baseUrl.replace(/\/chat\/?$/, '') + '/chat/stream'
}

const extractResponseText = (data: Record<string, unknown>): string | null => {
    const candidates = [
        data.reply,
        data.response,
        data.message,
        data.text,
        data.answer,
    ]

    for (const candidate of candidates) {
        if (typeof candidate === 'string' && candidate.trim().length > 0) {
            return candidate
        }
    }

    return null
}

export async function sendChatMessage(
    message: string,
    sessionId: string,
    signal?: AbortSignal,
): Promise<ChatApiResult> {
    const env = (import.meta as { env?: Record<string, string> }).env
    const debugStop = env?.VITE_CHAT_DEBUG === 'true'
    const url = resolveChatApiUrl()

    if (debugStop) {
        console.log('Chat API URL:', url)
        throw new Error('Chat API debug stop enabled (VITE_CHAT_DEBUG=true)')
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            session_id: sessionId,
            message,
        } satisfies ChatApiPayload),
        signal,
    })

    console.log('Chat API request:', { sessionId, message })
    console.log('Chat API response:', response)

    if (!response.ok) {
        throw new Error(`Chat API request failed (${response.status})`)
    }

    const contentType = response.headers.get('content-type') ?? ''
    let data: Record<string, unknown> = {}
    let rawText: string | null = null

    if (contentType.includes('application/json')) {
        data = (await response.json()) as Record<string, unknown>
    } else {
        rawText = await response.text()
        data = { text: rawText }
    }

    const text =
        extractResponseText(data) ??
        rawText?.trim() ??
        'Thanks! I am thinking about that.'

    return { text, raw: data }
}

// -- STREAMING IMPLEMENTATION --

export async function streamChatMessage(
    message: string,
    sessionId: string,
    onEvent: (event: ChatStreamEvent) => void,
    signal?: AbortSignal,
): Promise<void> {
    const url = resolveChatStreamApiUrl()

    console.log('Starting stream to:', url)

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
        },
        body: JSON.stringify({
            session_id: sessionId,
            message,
        } satisfies ChatApiPayload),
        signal,
    })

    if (!response.ok) {
        throw new Error(`Chat stream request failed (${response.status})`)
    }

    if (!response.body) {
        throw new Error('ReadableStream not supported in this browser.')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    let currentEventType: ChatStreamEventType = 'answer'
    try {
        while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            buffer += chunk

            // Process lines
            const lines = buffer.split('\n')
            // Keep the last partial line in buffer
            buffer = lines.pop() ?? ''

            for (const line of lines) {
                const trimmedLine = line.trim()
                if (trimmedLine === '') continue
                console.log('Raw SSE line:', trimmedLine)

                if (trimmedLine.startsWith('event: ')) {
                    currentEventType = trimmedLine.slice(
                        7,
                    ) as ChatStreamEventType
                    continue
                }

                if (trimmedLine.startsWith('data: ')) {
                    const data = trimmedLine.slice(6)
                    try {
                        let event: ChatStreamEvent

                        try {
                            const payload = JSON.parse(data)
                            event = {
                                type: payload.type || currentEventType,
                                content:
                                    payload.content ||
                                    (typeof payload === 'string'
                                        ? payload
                                        : ''),
                                data: payload,
                            }
                        } catch (e) {
                            // Not JSON, treat as raw data with currentEventType
                            event = {
                                type: currentEventType,
                                content: data,
                            }
                        }

                        console.log('Parsed event:', event)
                        onEvent(event)
                    } catch (e) {
                        console.warn('Failed to process SSE line:', line, e)
                    }
                }
            }
        }
    } catch (error) {
        if (signal?.aborted) {
            console.log('Stream aborted by user')
            return
        }
        throw error
    } finally {
        reader.releaseLock()
    }
}
