import { useState } from 'react'
import FileUploader from './components/FileUploader'
import MeetingTypeSelect from './components/MeetingTypeSelect'
import SpeakerInput from './components/SpeakerInput'
import ProcessingStatus from './components/ProcessingStatus'
import ResultsTabs from './components/ResultsTabs'

// API Base URL - uses proxy in dev, direct in production
const API_BASE = '/api'

function App() {
    const [file, setFile] = useState(null)
    const [meetingType, setMeetingType] = useState(0)
    const [speakers, setSpeakers] = useState([
        { name: '', position: '' },
        { name: '', position: '' },
    ])
    const [isProcessing, setIsProcessing] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [progress, setProgress] = useState(0)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)

    const handleFileSelect = (selectedFile) => {
        setFile(selectedFile)
        setError(null)
        setResult(null)
    }

    const handleSubmit = async () => {
        if (!file) return

        setIsProcessing(true)
        setError(null)
        setResult(null)
        setCurrentStep(0)
        setProgress(0)

        // Simulate progress stages (since we can't get real-time updates from API)
        const progressSteps = [
            { step: 0, progress: 10, delay: 0 },      // Model Load start
            { step: 1, progress: 20, delay: 5000 },   // Audio Load
            { step: 2, progress: 40, delay: 8000 },   // Transcription
            { step: 3, progress: 70, delay: 30000 },  // Diarization
            { step: 4, progress: 90, delay: 50000 },  // Summarization
        ]

        const progressTimers = progressSteps.map(({ step, progress: prog, delay }) =>
            setTimeout(() => {
                setCurrentStep(step)
                setProgress(prog)
            }, delay)
        )

        try {
            const formData = new FormData()
            formData.append('audio', file)
            formData.append('meeting_type_id', meetingType)

            // Send speaker names (filter out empty entries)
            const validSpeakers = speakers.filter(s => s.name.trim() !== '')
            formData.append('speaker_names', JSON.stringify(validSpeakers))

            const response = await fetch(`${API_BASE}/transcribe-summarize`, {
                method: 'POST',
                body: formData,
            })

            // Clear progress timers
            progressTimers.forEach(timer => clearTimeout(timer))

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || 'Processing failed')
            }

            const data = await response.json()
            setResult(data)
            setProgress(100)
            setCurrentStep(5)
        } catch (err) {
            setError(err.message || 'เกิดข้อผิดพลาดในการประมวลผล')
            progressTimers.forEach(timer => clearTimeout(timer))
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="app-container">
            {/* Header */}
            <header className="header">
                <h1 className="header-title">🎙️ Transcribe-Summary</h1>
                <p className="header-subtitle">ถอดเสียงประชุมและสรุปอัตโนมัติด้วย AI</p>
            </header>

            <div className="two-column-layout">
                {/* Left Column - Main Workflow */}
                <main className="main-column">
                    {/* Upload Section */}
                    <section className="glass-card">
                        <FileUploader
                            file={file}
                            onFileSelect={handleFileSelect}
                            disabled={isProcessing}
                        />
                    </section>

                    {/* Meeting Type Selection */}
                    <section className="glass-card">
                        <MeetingTypeSelect
                            value={meetingType}
                            onChange={setMeetingType}
                            disabled={isProcessing}
                        />

                        {/* Submit Button */}
                        <button
                            className="btn btn-primary btn-full"
                            onClick={handleSubmit}
                            disabled={!file || isProcessing}
                        >
                            {isProcessing ? '⏳ กำลังประมวลผล...' : '🚀 เริ่มประมวลผล'}
                        </button>
                    </section>

                    {/* Processing Status */}
                    {isProcessing && (
                        <section className="glass-card">
                            <ProcessingStatus
                                currentStep={currentStep}
                                progress={progress}
                            />
                        </section>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            <span>❌</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Results */}
                    {result && (
                        <section className="glass-card results-section">
                            <ResultsTabs result={result} meetingType={meetingType} speakerNames={speakers} />
                        </section>
                    )}
                </main>

                {/* Right Column - Speaker Input */}
                <aside className="side-column">
                    <section className="glass-card">
                        <SpeakerInput
                            speakers={speakers}
                            onChange={setSpeakers}
                            disabled={isProcessing}
                        />
                    </section>
                </aside>
            </div>
        </div>
    )
}

export default App
