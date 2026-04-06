from datetime import datetime
from logger import log_info

# افتراض: يوجد كائن DreamEngine يُستورد من backend/metaverse/dreams_engine.js
# في الواقع سيتم الربط عبر API أو WebSocket مع frontend
class DreamAI:
    def __init__(self, dream_engine_api=None):
        """
        dream_engine_api: كائن API أو WebSocket يربط بالـ Dream Engine ثلاثي الأبعاد
        """
        self.dream_engine_api = dream_engine_api
        log_info("Dream AI initialized and ready for 3D integration")

    # -------------------------------
    def analyze_dream(self, dream_text):
        if not dream_text:
            raise ValueError("Dream text is required")

        words = dream_text.split()
        analysis = {
            "length": len(words),
            "unique_words": len(set(words)),
            "keywords": self.extract_keywords(words)
        }
        log_info(f"Dream analyzed: {analysis}")

        # إرسال النتيجة لمحرك Dream Engine إذا موجود
        if self.dream_engine_api:
            self.send_to_dream_engine(analysis)

        return analysis

    # -------------------------------
    def extract_keywords(self, words):
        keywords = [w for w in words if len(w) > 5]
        return keywords

    # -------------------------------
    def generate_insights(self, dream_text):
        analysis = self.analyze_dream(dream_text)
        insights = {
            "summary": f"Dream of {analysis['length']} words with {analysis['unique_words']} unique words",
            "important_keywords": analysis["keywords"][:5]
        }
        log_info(f"Dream insights generated: {insights}")

        # إرسال الرؤى لمحرك Dream Engine
        if self.dream_engine_api:
            self.send_to_dream_engine(insights)

        return insights

    # -------------------------------
    def send_to_dream_engine(self, data):
        """
        تحويل نتائج التحليل إلى أحداث/كائنات في عالم ثلاثي الأبعاد
        data: dict - يمكن أن تحتوي على كلمات رئيسية أو رؤى
        """
        try:
            # مثال: إرسال بيانات عبر WebSocket أو API
            self.dream_engine_api.emit("dream_update", data)
            log_info(f"Dream data sent to Dream Engine: {data}")
        except Exception as e:
            log_info(f"Failed to send dream data to engine: {e}")


 // مثال
const response = await fetch("/api/npc/chat", {
    method: "POST",
    body: JSON.stringify({ message })
});
