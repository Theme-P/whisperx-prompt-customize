# Summary-Transcribe

> Thai speech-to-text using WhisperX with speaker diarization + GPT-4.1 summarization.
> Full-stack application with React frontend and FastAPI backend.

## ✨ Features
- 🎯 OpenAI Whisper large-v3 model
- 🗣️ Speaker diarization (แยกผู้พูด)
- 🇹🇭 Thai language support
- 🤖 **AI Summary** - สรุปใจความสำคัญด้วย GPT-4.1
- 🐳 Docker ready (CUDA/GPU)
- 👥 **Speaker Analysis** - วิเคราะห์บทบาทผู้พูด
- ✏️ **Speaker Naming** - กรอกชื่อ+ตำแหน่งผู้พูดก่อนประมวลผล แทนที่ "คนพูด X" ทั้งใน Transcript และ Summary
- 📋 **Auto Meeting Type Detection** - ระบุประเภทการประชุม 11 รูปแบบ
- 📄 **DOCX Export** - ส่งออกไฟล์ Transcript และ Summary พร้อมรายชื่อผู้เข้าร่วม
- 🌐 **Web UI** - React frontend 2 คอลัมน์ สำหรับอัพโหลดเสียงและกรอกข้อมูลผู้พูด
- 🔌 **REST API** - FastAPI backend สำหรับ integration

## 🌐 Web UI

Frontend UI แบบ 2 คอลัมน์สำหรับใช้งานผ่าน browser:
- **คอลัมน์ซ้าย**: อัพโหลดไฟล์เสียง (drag & drop), เลือกประเภทการประชุม, แสดงผลลัพธ์
- **คอลัมน์ขวา**: กรอกชื่อ+ตำแหน่งผู้พูด (เพิ่ม/ลบ row ได้)
- แสดง Transcript, Summary, และ Speaker Stats (ใช้ชื่อจริงถ้ากรอก)
- ดาวน์โหลด DOCX ได้ทันที

## 🎯 Supported Meeting Types

| ประเภท | English | โครงสร้างหลัก |
|--------|---------|--------------| 
| ประชุมผู้ถือหุ้น | Shareholder Meeting | วาระ → มติ → เงินปันผล |
| ประชุมคณะกรรมการ | Board Meeting | นโยบาย → การอนุมัติ → มติ |
| ประชุมวางแผน | Planning Meeting | เป้าหมาย → แผนงาน → ไทม์ไลน์ |
| รายงานความคืบหน้า | Progress Update | สถานะ → ปัญหา → แนวทางแก้ |
| ประชุมเชิงกลยุทธ์ | Strategy Meeting | ทิศทาง → กลยุทธ์ → Action Plan |
| ประชุมแก้ไขปัญหา | Incident Review | ปัญหา → สาเหตุ → การป้องกัน |
| ประชุมลูกค้า | Client Meeting | ข้อเสนอ → Feedback → Next Steps |
| เชิงปฏิบัติการ | Workshop | หัวข้อ → บทเรียน → Action Items |
| ประชุมผู้บริหาร | Executive Meeting | การตัดสินใจ → มติ |
| ประชุมทีมงาน | Team Meeting | อัพเดต → มอบหมาย → ปัญหา |
| ประชุมทั่วไป | General Meeting | วาระ → หารือ → มติ |

## 🚀 Quick Start

### 1. Clone & Setup
```bash
git clone https://github.com/Theme-P/Summary-Transcribe.git
cd Summary-Transcribe

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your API keys
```

### 2. Run with Docker Compose
```bash
# Build and run both frontend + backend
sudo docker compose up -d --build

# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
```

### 3. Run CLI (without frontend)
```bash
# Run full pipeline (Transcription + Summary + Export)
sudo docker compose run backend python main.py
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/meeting-types` | List meeting types |
| `POST` | `/api/transcribe-summarize` | Transcribe + Summarize audio |
| `POST` | `/api/export/transcript` | Export transcript to DOCX |
| `POST` | `/api/export/summary` | Export summary to DOCX |

## 📊 Output

เมื่อรัน `main.py` จะได้:

### Console Output
```
📊 PROCESSING SUMMARY   → Processing time breakdown
📝 FULL TRANSCRIPT      → Timestamped transcript with speakers
📈 SPEAKER SUMMARY      → Speaking time per person
📋 COMBINED TEXT        → Full text without timestamps
🤖 AI SUMMARY           → GPT-4.1 summary with speaker analysis
```

### DOCX Files
```
📄 Files exported:
   - Doc/filename_transcript.docx  → Raw transcript
   - Doc/filename_summary.docx     → AI Summary with participant header
```

## ⚙️ Configuration

| Parameter | Value | Description |
|-----------|-------|-------------|
| Model | large-v3 | OpenAI Whisper |
| Compute Type | float16 | GPU optimized |
| Batch Size | 24 | For A100 GPU |
| Beam Size | 5 | Best quality |
| Summary API | GPT-4.1 | Via NTC AI Gateway |

## 🔐 Environment Variables

Create `.env` file with:
```env
# Hugging Face Token (for speaker diarization)
HF_TOKEN=your_huggingface_token

# NTC AI Gateway (for GPT-4.1 summary)
NTC_API_KEY=your_ntc_api_key
NTC_API_URL=https://aigateway.ntictsolution.com/v1/chat/completions
```

## 📁 Project Structure

```
Summary-Transcribe/
├── app/
│   ├── core/
│   │   └── config.py           # PipelineConfig settings
│   ├── models/
│   │   └── meeting.py          # Meeting types definitions (11 types)
│   ├── services/
│   │   ├── pipeline.py         # TranscribeSummaryPipeline
│   │   └── summarizer.py       # GPT-4.1 summary with diarization
│   └── utils/
│       ├── export.py           # DOCX export (transcript + summary)
│       └── formatting.py       # Speaker & time formatting helpers
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Main application (2-column layout)
│   │   └── components/
│   │       ├── FileUploader.jsx
│   │       ├── MeetingTypeSelect.jsx
│   │       ├── ProcessingStatus.jsx
│   │       ├── ResultsTabs.jsx
│   │       └── SpeakerInput.jsx  # Speaker name/position input panel
│   ├── Dockerfile
│   └── nginx.conf
├── tests/
│   ├── test_gpt41.py           # GPT-4.1 API test
│   └── whisper_playground.py   # WhisperX test script
├── api.py                      # FastAPI REST API
├── main.py                     # CLI entry point
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .env.example
└── audio/                      # Put audio files here
```

## 🔄 Pipeline Flow

```
Audio File + Speaker Names (optional)
    ↓
[WhisperX Transcription] → [Clear VRAM]
    ↓
[Speaker Diarization] → Map speaker names → Build speaker summary
    ↓
[GPT-4.1 Summary API] ← Transcript + Speaker Data (with real names)
    ↓
[Export DOCX] → transcript.docx + summary.docx (with participant header)
    ↓
[Output Complete]
```

## 📝 TODO
- [x] Pipeline prompt customization สำหรับสร้างสรุปประชุม
- [x] Auto-detect meeting type (11 ประเภท)
- [x] Speaker role analysis จาก diarization data
- [x] Export to DOCX (Transcript + Summary)
- [x] Refactor to OOP architecture
- [x] REST API (FastAPI)
- [x] Web UI (React + Vite)
- [x] Docker Compose (Frontend + Backend)
- [x] Participant header in Summary DOCX
- [x] Speaker naming (กรอกชื่อ+ตำแหน่งก่อนประมวลผล)
- [x] 2-column UI layout
- [x] Dynamic meeting type fetching from API
- [ ] ปรับปรุงความแม่นยำภาษาไทย
- [ ] เพิ่ม alignment model สำหรับภาษาไทย
- [ ] เพิ่มการ export เป็น SRT/VTT

## 📄 License

MIT License
