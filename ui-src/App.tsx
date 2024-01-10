import { useRef, useState } from 'react'
import Logo from './Logo'
import './App.css'
import { PluginMessageType } from '../types'

// See: https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo
const MODEL = 'gpt-4'

function notify(message: string): void {
  parent.postMessage(
    {
      pluginMessage: {
        type: PluginMessageType.Notify,
        message,
      },
    },
    '*',
  )
}

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
          {
            role: 'system',
            content: `
              You are a helpful assistant that specializes in System Design interview. You will be asked to design a system that can do the following:
              - ${prompt}

              Tasks:
              - ONLY returns functional, non-function requirements, assumptions, and estimations
              - ONLY returns high-level design and data schema of the system. Use snake_case for naming. Include types and relationships
              - ONLY returns the UML diagram of the architecture. Always start from the client and work your way to the database. Be as technical and in-depth as possible.
              `,
          },
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
    notify(error.message)

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

  // const onCreateShapes = () => {
  //   const count = Number(inputRef.current?.value || 0)

  //   parent.postMessage(
  //     {
  //       pluginMessage: { type: PluginMessageType.CreateShapes, count },
  //     },
  //     '*',
  //   )
  // }

  const onSubmit = () => {
    // onCreateShapes()
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
        <h3>SystemDesignJam</h3>
      </header>
      {/* <section>
        <label htmlFor="input" className="sr-only">
          Rectangle Count
        </label>
        <input
          id="input"
          type="number"
          min="0"
          ref={inputRef}
          defaultValue={4}
          placeholder="Enter number of rectangles"
        />
      </section> */}
      <section>
        <label htmlFor="prompt" className="sr-only">
          AI Prompt
        </label>
        <input
          id="prompt"
          type="text"
          placeholder="Design..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </section>
      <footer>
        <button className="brand" onClick={onSubmit}>
          Generate
        </button>
        {/* <button onClick={onCancel}>Cancel</button> */}
      </footer>
    </main>
  )
}

export default App
