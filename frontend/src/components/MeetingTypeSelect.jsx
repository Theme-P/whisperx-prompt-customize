import { useState, useEffect } from 'react'

const API_BASE = '/api'

function MeetingTypeSelect({ value, onChange, disabled }) {
    const [meetingTypes, setMeetingTypes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${API_BASE}/meeting-types`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.meeting_types) {
                    setMeetingTypes(data.meeting_types)
                }
            })
            .catch(() => {
                // Fallback: แสดง option เดียวกรณี API ไม่ตอบ
                setMeetingTypes([
                    { id: 0, name: 'Auto-Detect', thai: 'ตรวจจับอัตโนมัติ', structure: 'วิเคราะห์จากเนื้อหา' }
                ])
            })
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="form-group">
            <label className="form-label">
                📋 ประเภทการประชุม
            </label>
            <div className="select-wrapper">
                <select
                    className="select-dropdown"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    disabled={disabled || loading}
                >
                    {loading ? (
                        <option>กำลังโหลด...</option>
                    ) : (
                        meetingTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.thai}
                            </option>
                        ))
                    )}
                </select>
                <span className="select-arrow">▼</span>
            </div>
        </div>
    )
}

export default MeetingTypeSelect
