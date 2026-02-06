import { useState } from 'react'

function ResultsTabs({ result }) {
    const [activeTab, setActiveTab] = useState('transcript')

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleCopyText = (text) => {
        navigator.clipboard.writeText(text)
        alert('คัดลอกข้อความแล้ว!')
    }

    const handleDownload = (content, filename) => {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
    }

    // Calculate speaker percentages
    const speakerStats = result.transcript.speaker_summary
    const totalSpeakingTime = Object.values(speakerStats.speaking_time).reduce((a, b) => a + b, 0)

    return (
        <div>
            {/* Processing Info */}
            <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                ⏱️ ประมวลผลเสร็จใน {result.processing_time.total.toFixed(1)} วินาที
                | 🎵 ความยาวเสียง {formatTime(result.audio_length_seconds)}
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'transcript' ? 'active' : ''}`}
                    onClick={() => setActiveTab('transcript')}
                >
                    📝 Transcript
                </button>
                <button
                    className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
                    onClick={() => setActiveTab('summary')}
                >
                    📊 Summary
                </button>
                <button
                    className={`tab ${activeTab === 'speakers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('speakers')}
                >
                    👥 Speakers
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {/* Transcript Tab */}
                {activeTab === 'transcript' && (
                    <div>
                        {result.transcript.segments.map((segment, index) => (
                            <div key={index} className="transcript-segment">
                                <div className="segment-header">
                                    <span className="segment-time">
                                        {formatTime(segment.start)} - {formatTime(segment.end)}
                                    </span>
                                    <span className="segment-speaker">
                                        {segment.speaker || 'ไม่ระบุ'}
                                    </span>
                                </div>
                                <p className="segment-text">{segment.text}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Summary Tab */}
                {activeTab === 'summary' && (
                    <div className="summary-content">
                        {result.summary}
                    </div>
                )}

                {/* Speakers Tab */}
                {activeTab === 'speakers' && (
                    <div className="speaker-stats">
                        {Object.entries(speakerStats.speaking_time).map(([speaker, time]) => {
                            const percentage = totalSpeakingTime > 0
                                ? (time / totalSpeakingTime) * 100
                                : 0
                            const wordCount = speakerStats.word_count[speaker] || 0

                            return (
                                <div key={speaker} className="speaker-stat-item">
                                    <div className="speaker-avatar">
                                        {speaker.charAt(0)}
                                    </div>
                                    <div className="speaker-info">
                                        <div className="speaker-name">{speaker}</div>
                                        <div className="speaker-meta">
                                            {formatTime(time)} ({percentage.toFixed(1)}%) • {wordCount} คำ
                                        </div>
                                    </div>
                                    <div className="speaker-bar">
                                        <div
                                            className="speaker-bar-fill"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="actions">
                <button
                    className="btn btn-secondary"
                    onClick={() => handleCopyText(result.transcript.combined_text)}
                >
                    📋 คัดลอก Transcript
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => handleCopyText(result.summary)}
                >
                    📋 คัดลอก Summary
                </button>
                <button
                    className="btn btn-primary"
                    onClick={() => handleDownload(result.summary, 'summary.txt')}
                >
                    📥 ดาวน์โหลด Summary
                </button>
            </div>
        </div>
    )
}

export default ResultsTabs
