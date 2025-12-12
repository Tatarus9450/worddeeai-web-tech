import httpx
import os
import random

N8N_WEBHOOK_URL = os.getenv("N8N_WEBHOOK_URL", "http://n8n:5678/webhook/vocab-scoring")


async def ai_validation(sentence: str, target_word: str, difficulty: str) -> dict:
    """
    Call n8n webhook to get AI scoring and Thai feedback
    Falls back to simple scoring if n8n is unavailable
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                N8N_WEBHOOK_URL,
                json={
                    "sentence": sentence,
                    "word": target_word,
                    "difficulty": difficulty
                }
            )
            response.raise_for_status()
            result = response.json()
            
            # Ensure all required fields are present
            return {
                "score": float(result.get("score", 0)),
                "level": result.get("level", difficulty),
                "suggestion": result.get("suggestion", "ไม่สามารถวิเคราะห์ได้"),
                "corrected_sentence": result.get("corrected_sentence", sentence)
            }
    except Exception as e:
        print(f"n8n webhook error: {e}")
        # Fallback to simple scoring if n8n fails
        return fallback_validation(sentence, target_word, difficulty)


def fallback_validation(sentence: str, target_word: str, difficulty: str) -> dict:
    """
    Fallback validation when n8n is unavailable
    Uses simple rule-based scoring
    """
    sentence_lower = sentence.lower()
    target_word_lower = target_word.lower()
    
    # Check if word is in sentence
    has_word = target_word_lower in sentence_lower
    
    if not has_word:
        return {
            "score": 0.0,
            "level": difficulty,
            "suggestion": f"ประโยคของคุณต้องมีคำว่า '{target_word}' อยู่ด้วย กรุณาลองใหม่อีกครั้ง!",
            "corrected_sentence": f"อย่าลืมใช้คำว่า '{target_word}' ในประโยคของคุณ"
        }
    
    # Score based on length and complexity
    word_count = len(sentence.split())
    
    # Adjust difficulty expectations
    if difficulty == 'Beginner':
        if word_count < 4:
            score = random.uniform(5.0, 6.5)
            suggestion = "ประโยคสั้นไปหน่อย ลองเพิ่มรายละเอียดอีกนิดนะ(ให้คำตอบโดยระบบ Mock AI)"
        elif word_count < 8:
            score = random.uniform(7.0, 8.5)
            suggestion = "ดีมาก! ประโยคของคุณเข้าใจง่ายและถูกต้อง(ให้คำตอบโดยระบบ Mock AI)"
        else:
            score = random.uniform(8.5, 10.0)
            suggestion = "ยอดเยี่ยมมาก! ประโยคสมบูรณ์และใช้คำศัพท์ได้อย่างเหมาะสม(ให้คำตอบโดยระบบ Mock AI)"
    elif difficulty == 'Intermediate':
        if word_count < 6:
            score = random.uniform(4.0, 5.5)
            suggestion = "สำหรับคำศัพท์ระดับกลาง ควรเขียนประโยคที่ซับซ้อนกว่านี้(ให้คำตอบโดยระบบ Mock AI)"
        elif word_count < 10:
            score = random.uniform(6.5, 8.0)
            suggestion = "ดี! แต่ลองใช้โครงสร้างประโยคที่หลากหลายมากขึ้น(ให้คำตอบโดยระบบ Mock AI)"
        else:
            score = random.uniform(8.0, 9.5)
            suggestion = "เยี่ยมมาก! คุณใช้คำศัพท์ได้อย่างเชี่ยวชาญ(ให้คำตอบโดยระบบ Mock AI)"
    else:  # Advanced
        if word_count < 8:
            score = random.uniform(3.0, 5.0)
            suggestion = "คำศัพท์ระดับสูงต้องการบริบทที่ซับซ้อนมากกว่านี้(ให้คำตอบโดยระบบ Mock AI)"
        elif word_count < 12:
            score = random.uniform(5.5, 7.5)
            suggestion = "พอใช้ได้ แต่ลองแสดงความเข้าใจในความหมายลึกซึ้งของคำมากขึ้น(ให้คำตอบโดยระบบ Mock AI)"
        else:
            score = random.uniform(7.5, 9.0)
            suggestion = "ประทับใจมาก! คุณเข้าใจและใช้คำศัพท์ขั้นสูงได้อย่างถูกต้อง(ให้คำตอบโดยระบบ Mock AI)"
    
    return {
        "score": round(score, 1),
        "level": difficulty,
        "suggestion": suggestion,
        "corrected_sentence": sentence  # In production, AI would correct this
    }


# Keep sync version for backward compatibility
def mock_ai_validation(sentence: str, target_word: str, difficulty: str) -> dict:
    """
    Synchronous version - delegates to fallback_validation
    Kept for backward compatibility
    """
    return fallback_validation(sentence, target_word, difficulty)