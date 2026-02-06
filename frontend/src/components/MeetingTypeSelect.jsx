// Meeting types matching backend MEETING_TYPES
const MEETING_TYPES = [
    { id: 0, name: 'Auto-Detect', thai: 'ตรวจจับอัตโนมัติ', structure: 'วิเคราะห์จากเนื้อหา' },
    { id: 1, name: 'Shareholder Meeting', thai: 'ประชุมผู้ถือหุ้น', structure: 'วาระ → มติ → เงินปันผล' },
    { id: 2, name: 'Board Meeting', thai: 'ประชุมคณะกรรมการ', structure: 'นโยบาย → การอนุมัติ → มติ' },
    { id: 3, name: 'Planning Meeting', thai: 'ประชุมวางแผน', structure: 'เป้าหมาย → แผนงาน → ไทม์ไลน์' },
    { id: 4, name: 'Progress Update', thai: 'รายงานความคืบหน้า', structure: 'สถานะ → ปัญหา → แนวทางแก้ไข' },
    { id: 5, name: 'Strategy Meeting', thai: 'ประชุมเชิงกลยุทธ์', structure: 'ทิศทาง → กลยุทธ์ → Action Plan' },
    { id: 6, name: 'Incident Review', thai: 'ประชุมแก้ไขปัญหา', structure: 'ปัญหา → สาเหตุ → การป้องกัน' },
    { id: 7, name: 'Client Meeting', thai: 'ประชุมลูกค้า', structure: 'ข้อเสนอ → Feedback → ข้อตกลง' },
    { id: 8, name: 'Workshop', thai: 'เชิงปฏิบัติการ', structure: 'เนื้อหา → บทเรียน → Action Items' },
    { id: 9, name: 'Executive Meeting', thai: 'ประชุมผู้บริหาร', structure: 'ประเด็น → การตัดสินใจ → มติ' },
    { id: 10, name: 'Team Meeting', thai: 'ประชุมทีมงาน', structure: 'อัพเดต → การมอบหมาย → สิ่งที่ต้องทำ' },
    { id: 11, name: 'General Meeting', thai: 'ประชุมทั่วไป', structure: 'วาระ → ประเด็น → มติ' },
]

function MeetingTypeSelect({ value, onChange, disabled }) {
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
                    disabled={disabled}
                >
                    {MEETING_TYPES.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.thai}
                        </option>
                    ))}
                </select>
                <span className="select-arrow">▼</span>
            </div>
        </div>
    )
}

export default MeetingTypeSelect
