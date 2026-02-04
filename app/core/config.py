import os

class PipelineConfig:
    """Configuration for the transcription-summary pipeline"""
    
    # Device settings
    DEVICE = "cuda"
    COMPUTE_TYPE = "float16"
    
    # WhisperX settings
    MODEL_NAME = "large-v3"
    BATCH_SIZE = 24
    LANGUAGE = "th"
    
    # Beam search settings
    BEAM_SIZE = 5
    BEST_OF = 5
    PATIENCE = 1.5
    
    # VAD options (optimized for overlapping speech detection)
    VAD_ONSET = 0.400       # Lower = more sensitive to speech start
    VAD_OFFSET = 0.300      # Lower = faster silence detection
    MIN_DURATION_ON = 0.05  # Catch short speech segments
    MIN_DURATION_OFF = 0.05 # Catch short pauses/interruptions
    
    # Speaker diarization settings (for overlapping speech)
    MIN_SPEAKERS = 2        # Minimum expected speakers (None = auto)
    MAX_SPEAKERS = None     # Maximum expected speakers (None = auto)
    
    # HuggingFace token for diarization
    HF_TOKEN = os.environ.get("HF_TOKEN", "")
