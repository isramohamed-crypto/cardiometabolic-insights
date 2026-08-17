import { useEffect, useRef, useState } from 'react'
import MicIcon from './MicIcon.jsx'
import SnippetCard from './SnippetCard.jsx'
import { useCheckIn } from '../habits/CheckInContext.jsx'
import { CHECK_IN_NEEDS, getNeed, matchSpokenNeed } from '../domain/checkInNeeds.js'
import { buildSnippets } from '../domain/insightSnippets.js'
import './CheckIn.css'

// The daily check-in flow itself — prompt, mic, options, and the answered
// state with its suggestions. Rendered in two places: inside CheckInSheet
// (the bottom sheet the floating mic opens) and inline on the Today page
// under "Habits I own" once someone has some history. One component, so the
// two can't drift.
//
// Two ways in, same answer either way: tap one of three needs, or say it out
// loud.
//
// VOICE. This uses the browser's own SpeechRecognition where it exists
// (Chrome and Safari; Firefox has no implementation). There is no simulated
// transcript and no fake listening state — if the API is missing or the mic
// permission is refused, the voice control says so and the tap options carry
// the whole flow. What comes back is matched against plain spoken keywords
// (see domain/checkInNeeds.js); an unmatched phrase asks them to pick rather
// than guessing at a need.
function getRecognition() {
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!Ctor) return null
  const recognition = new Ctor()
  recognition.lang = 'en-US'
  recognition.interimResults = true
  recognition.maxAlternatives = 1
  return recognition
}

function CheckInPanel() {
  const { checkIn, setCheckIn, clearCheckIn } = useCheckIn()
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState('')
  const [voiceError, setVoiceError] = useState('')
  const [snippetIndex, setSnippetIndex] = useState(0)
  const recognitionRef = useRef(null)
  const trackRef = useRef(null)

  const answered = checkIn ? getNeed(checkIn.needId) : null
  const voiceSupported = Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)

  // Stop any in-flight recognition if this unmounts mid-listen — the sheet
  // closing, or the inline panel scrolling out on a route change.
  useEffect(() => () => recognitionRef.current?.abort?.(), [])

  const startListening = () => {
    const recognition = getRecognition()
    if (!recognition) {
      setVoiceError('This browser has no speech recognition — pick one below instead.')
      return
    }
    recognitionRef.current = recognition
    setVoiceError('')
    setHeard('')
    setListening(true)

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(' ')
        .trim()
      setHeard(transcript)
      const isFinal = event.results[event.results.length - 1].isFinal
      if (!isFinal) return
      const match = matchSpokenNeed(transcript)
      if (match) setCheckIn(match.id, transcript)
      else setVoiceError('I didn’t catch which one that was — pick one below.')
      recognition.stop()
    }
    recognition.onerror = (event) => {
      setListening(false)
      setVoiceError(
        event.error === 'not-allowed'
          ? 'Microphone access is off for this site — pick one below instead.'
          : 'The mic didn’t catch anything — pick one below instead.',
      )
    }
    recognition.onend = () => setListening(false)

    try {
      recognition.start()
    } catch {
      setListening(false)
      setVoiceError('Couldn’t start the mic — pick one below instead.')
    }
  }

  const stopListening = () => {
    recognitionRef.current?.stop?.()
    setListening(false)
  }

  const snippets = answered
    ? buildSnippets({ key: answered.optionKey, pillarId: answered.pillarId }, 'todo')
    : []

  return (
    <div className="checkin__panel">
        {answered ? (
          <>
            <p className="checkin__eyebrow">Today’s check-in</p>
            <h2 className="checkin__headline">{answered.reply}</h2>
            {checkIn.spoken && <p className="checkin__heard">You said: “{checkIn.spoken}”</p>}
            <p className="checkin__answered">
              Helping with <strong>{answered.label.toLowerCase()}</strong> today.
            </p>

            {snippets.length > 0 && (
              <div className="checkin__suggestions">
                <p className="checkin__suggestions-label">
                  {snippets.length} {snippets.length === 1 ? 'thing' : 'things'} that might help
                </p>

                <div
                  className="checkin__track snippet-track"
                  ref={trackRef}
                  onScroll={() => {
                    const track = trackRef.current
                    const card = track?.firstElementChild
                    if (!track || !card) return
                    const step = card.getBoundingClientRect().width + 12
                    setSnippetIndex(Math.round(track.scrollLeft / step))
                  }}
                >
                  {snippets.map((snippet) => (
                    <SnippetCard key={snippet.id} snippet={snippet} />
                  ))}
                </div>

                {snippets.length > 1 && (
                  <div className="snippet-dots">
                    {snippets.map((snippet, i) => (
                      <button
                        key={snippet.id}
                        type="button"
                        className={`snippet-dot${i === snippetIndex ? ' snippet-dot--on' : ''}`}
                        onClick={() => {
                          const card = trackRef.current?.children?.[i]
                          if (card)
                            trackRef.current.scrollTo({
                              left: card.offsetLeft - trackRef.current.offsetLeft,
                              behavior: 'smooth',
                            })
                        }}
                        aria-label={`Go to ${i + 1} of ${snippets.length}`}
                        aria-current={i === snippetIndex}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            <button type="button" className="checkin__reset" onClick={clearCheckIn}>
              Pick something else
            </button>
          </>
        ) : (
          <>
            <p className="checkin__eyebrow">Daily check-in</p>
            <h2 className="checkin__headline">What do you need help with today?</h2>

            <div className="checkin__voice">
              <button
                type="button"
                className={`checkin__mic${listening ? ' checkin__mic--live' : ''}`}
                onClick={listening ? stopListening : startListening}
                aria-pressed={listening}
              >
                <MicIcon />
              </button>
              <p className="checkin__voice-label">
                {listening
                  ? heard
                    ? `“${heard}”`
                    : 'Listening…'
                  : voiceSupported
                    ? 'Tap and say it out loud'
                    : 'Voice isn’t available in this browser'}
              </p>
            </div>

            {voiceError && <p className="checkin__error">{voiceError}</p>}

            <p className="checkin__or">or pick one</p>

            <div className="checkin__options">
              {CHECK_IN_NEEDS.map((need) => (
                <button
                  key={need.id}
                  type="button"
                  className="checkin__option"
                  onClick={() => setCheckIn(need.id)}
                >
                  <span className="checkin__option-label">{need.label}</span>
                  <span className="checkin__option-blurb">{need.blurb}</span>
                </button>
              ))}
            </div>
          </>
        )}
    </div>
  )
}

export default CheckInPanel
