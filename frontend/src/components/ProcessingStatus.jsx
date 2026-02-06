const STEPS = [
    { id: 0, label: 'Model Load', icon: '🧠' },
    { id: 1, label: 'Audio', icon: '🎵' },
    { id: 2, label: 'Transcribe', icon: '✍️' },
    { id: 3, label: 'Diarize', icon: '👥' },
    { id: 4, label: 'Summary', icon: '📝' },
]

function ProcessingStatus({ currentStep, progress }) {
    return (
        <div className="processing-status">
            <h3 className="processing-title">
                <span className="spinner">⏳</span>
                กำลังประมวลผล...
            </h3>

            {/* Progress Bar */}
            <div className="progress-bar-container">
                <div
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Steps */}
            <div className="processing-steps">
                {STEPS.map((step) => {
                    const isCompleted = currentStep > step.id
                    const isActive = currentStep === step.id

                    return (
                        <div
                            key={step.id}
                            className={`step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                        >
                            <span className="step-icon">
                                {isCompleted ? '✓' : isActive ? '●' : '○'}
                            </span>
                            <span>{step.label}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ProcessingStatus
