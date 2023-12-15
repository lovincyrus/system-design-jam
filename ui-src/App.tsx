import { useRef, useState } from 'react'
import Logo from './Logo'
import './App.css'
import { PluginMessageType } from '../types'

const MODEL = 'gpt-4-0613'

async function submitPromptToOpenAI(prompt: string): Promise<void> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string
  const apiUrl = 'https://api.openai.com/v1/chat/completions'

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.5,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
      }),
    })

    const result = await response.json()

    parent.postMessage(
      {
        pluginMessage: {
          type: PluginMessageType.SubmitPrompt,
          prompt: result.choices[0].message.content,
        },
      },
      '*',
    )
  } catch (e) {
    const error = e as Error
    parent.postMessage(
      {
        pluginMessage: {
          type: PluginMessageType.Notify,
          message: error.message,
        },
      },
      '*',
    )

    parent.postMessage(
      {
        pluginMessage: { type: PluginMessageType.Cancel },
      },
      '*',
    )
  }
}

function App() {
  const [prompt, setPrompt] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const onCreateShapes = () => {
    const count = Number(inputRef.current?.value || 0)

    parent.postMessage(
      {
        pluginMessage: { type: PluginMessageType.CreateShapes, count },
      },
      '*',
    )
  }

  const onSubmitPrompt = () => {
    submitPromptToOpenAI(prompt)
  }

  const onCancel = () => {
    parent.postMessage(
      {
        pluginMessage: { type: PluginMessageType.Cancel },
      },
      '*',
    )
  }

  return (
    <main>
      <header>
        <Logo />
        <h3>System Design Generator</h3>
      </header>
      <section>
        <label htmlFor="input" className="sr-only">
          Rectangle Count
        </label>
        <input id="input" type="number" min="0" ref={inputRef} />
      </section>
      <section>
        <label htmlFor="prompt" className="sr-only">
          AI Prompt
        </label>
        <input
          id="prompt"
          type="text"
          placeholder="Enter prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </section>
      <footer>
        <button className="brand" onClick={onSubmitPrompt}>
          Create
        </button>
        <button onClick={onCancel}>Cancel</button>
      </footer>
    </main>
  )
}

export default App
