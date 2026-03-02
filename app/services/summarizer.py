import requests
import os
from ..models.meeting import MEETING_TYPES, get_meeting_focus_prompt

# NTC AI Gateway API configuration
# Note: In a real OOP app, this might be injected from a config
NTC_API_KEY = os.getenv("NTC_API_KEY")
NTC_API_URL = os.getenv("NTC_API_URL", "https://aigateway.ntictsolution.com/v1/chat/completions")

def get_meeting_type_prompt(meeting_type_id: int) -> str:
    """Get the prompt instruction for a specific meeting type"""
    if meeting_type_id == 0:
        # Auto-detect: include all types
        types_table = "\n".join([
            f"| {info['name']} | {info['structure']} |"
            for num, info in MEETING_TYPES.items() if num > 0
        ])
        return f"""**ขั้นตอน:**
1. วิเคราะห์ข้อมูลผู้พูดเพื่อระบุบทบาท (ประธาน/ผู้นำเสนอ/ผู้เข้าร่วม)
2. วิเคราะห์เนื้อหาเพื่อระบุประเภทการประชุม
3. สรุปตามโครงสร้างที่เหมาะสม

**ประเภทการประชุม:**
| ประเภท | โครงสร้าง |
|--------|----------|
{types_table}"""
    else:
        # Specific type selected
        info = MEETING_TYPES.get(meeting_type_id, MEETING_TYPES[11])
        focus_prompt = get_meeting_focus_prompt(meeting_type_id)
        return f"""**ประเภทการประชุม:** {info['thai']} ({info['name']})
**โครงสร้างการสรุป:** {info['structure']}

{focus_prompt}

สรุปเนื้อหาตามโครงสร้างข้างต้น โดยเน้นความละเอียดในประเด็นหัวใจหลัก"""


def summarize_with_diarization(
    transcript_with_speakers: str,
    speaker_summary: dict,
    meeting_type_id: int = 0,
    language: str = "Thai"
) -> str:
    """Summarize transcription with speaker diarization data."""
    if not NTC_API_KEY:
        return "Error: NTC_API_KEY not found in environment variables"
    
    # Build speaker info string
    speakers_time = speaker_summary.get('speaking_time', {})
    speakers_words = speaker_summary.get('word_count', {})
    total_time = sum(speakers_time.values()) if speakers_time else 1
    
    speaker_info_lines = []
    for speaker, time_sec in sorted(speakers_time.items(), key=lambda x: -x[1]):
        pct = (time_sec / total_time * 100) if total_time > 0 else 0
        words = speakers_words.get(speaker, 0)
        mins = int(time_sec // 60)
        secs = int(time_sec % 60)
        speaker_info_lines.append(f"- {speaker}: {mins}:{secs:02d} ({pct:.1f}%), {words} คำ")
    
    speaker_info = "\n".join(speaker_info_lines)
    num_speakers = len(speakers_time)
    
    # Get meeting type instruction
    meeting_type_instruction = get_meeting_type_prompt(meeting_type_id)
    meeting_type_info = MEETING_TYPES.get(meeting_type_id, MEETING_TYPES[0])
    
    headers = {
        "Authorization": f"Bearer {NTC_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "gpt-4.1",
        "messages": [
            {
                "role": "system",
                "content": f"""คุณคือผู้เชี่ยวชาญวิเคราะห์และสรุปการประชุม

{meeting_type_instruction}

**Output Format:**
**[{meeting_type_info['thai'] if meeting_type_id > 0 else 'ประเภท'}]: [หัวข้อการประชุม]**

**👥 ผู้เข้าร่วมประชุม ({num_speakers} คน):**
(วิเคราะห์บทบาทจากเนื้อหาการพูด: ประธาน/ผู้นำเสนอ/ผู้เข้าร่วม)

**📋 สรุปการประชุม:**
(ตามโครงสร้าง: {meeting_type_info['structure']} - เน้นความละเอียดในส่วน {meeting_type_info.get('key_focus', 'ประเด็นหลัก')})

**📌 การสั่งงาน/มอบหมาย:** (ถ้ามี)
- **[ผู้สั่ง]** สั่งให้ **[ผู้รับมอบหมาย]** ทำ: [เนื้อหา] (กำหนด: [วันที่/เวลา ถ้ามี])

**❓ คำถามสำคัญ:** (ถ้ามี)
- **[ผู้ถาม]** ถาม: "[คำถาม]" → **[ผู้ตอบ]**: "[คำตอบ]"

**✅ ข้อตกลง/มติ:** (ถ้ามี)
- [เนื้อหาข้อตกลง] (เสนอโดย: **[ผู้เสนอ]**)

**กฎสำคัญ:**
- ภาษา{language}
- ใช้ bullet points
- **ต้องระบุชื่อผู้พูด (เช่น คนพูด 1, คนพูด 2) ในทุกการสั่งงาน/คำถาม/ข้อตกลง**
- ระบุผู้รับผิดชอบ+กำหนดเวลาเมื่อมีการมอบหมายงาน
- **เน้นความละเอียดในประเด็นหัวใจหลักของประเภทการประชุมนี้**
- สรุปมติท้ายสุด"""
            },
            {
                "role": "user",
                "content": f"""**ข้อมูลผู้พูด:**
{speaker_info}

**เนื้อหาการประชุม:**
{transcript_with_speakers}"""
            }
        ],
        "temperature": 0.4,
        "max_tokens": 4000
    }
    
    try:
        response = requests.post(NTC_API_URL, headers=headers, json=payload, timeout=120)
        response.raise_for_status()
        
        result = response.json()
        return result["choices"][0]["message"]["content"]
        
    except requests.exceptions.RequestException as e:
        return f"Error calling NTC API: {str(e)}"
    except (KeyError, IndexError) as e:
        return f"Error parsing response: {str(e)}"
