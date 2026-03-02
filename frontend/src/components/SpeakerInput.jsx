import { useState } from 'react'

function SpeakerInput({ speakers, onChange, disabled }) {
    const addSpeaker = () => {
        onChange([...speakers, { name: '', position: '' }])
    }

    const removeSpeaker = (index) => {
        if (speakers.length <= 1) return
        const updated = speakers.filter((_, i) => i !== index)
        onChange(updated)
    }

    const updateSpeaker = (index, field, value) => {
        const updated = speakers.map((s, i) =>
            i === index ? { ...s, [field]: value } : s
        )
        onChange(updated)
    }

    return (
        <div className="speaker-input-panel">
            <div className="speaker-input-header">
                <h3 className="speaker-input-title">👥 ข้อมูลผู้เข้าร่วมประชุม</h3>
                <p className="speaker-input-hint">กรอกชื่อและตำแหน่งผู้พูด (ไม่บังคับ)</p>
            </div>

            <div className="speaker-input-list">
                {speakers.map((speaker, index) => (
                    <div key={index} className="speaker-row">
                        <div className="speaker-row-label">
                            <span className="speaker-row-number">{index + 1}</span>
                        </div>
                        <div className="speaker-row-fields">
                            <input
                                type="text"
                                className="speaker-field"
                                placeholder="ชื่อ-สกุล"
                                value={speaker.name}
                                onChange={(e) => updateSpeaker(index, 'name', e.target.value)}
                                disabled={disabled}
                            />
                            <input
                                type="text"
                                className="speaker-field"
                                placeholder="ตำแหน่ง"
                                value={speaker.position}
                                onChange={(e) => updateSpeaker(index, 'position', e.target.value)}
                                disabled={disabled}
                            />
                        </div>
                        <button
                            className="speaker-remove-btn"
                            onClick={() => removeSpeaker(index)}
                            disabled={disabled || speakers.length <= 1}
                            title="ลบผู้พูด"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            <button
                className="btn btn-add-speaker"
                onClick={addSpeaker}
                disabled={disabled}
            >
                + เพิ่มผู้พูด
            </button>
        </div>
    )
}

export default SpeakerInput
