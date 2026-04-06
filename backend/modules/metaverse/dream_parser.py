import json
import re
from collections import Counter

class DreamParser:
    def __init__(self):
        # كلمات توقف غير مهمة يمكن تجاهلها
        self.stopwords = set([
            "و", "في", "على", "من", "إلى", "عن", "مع", "أن", "كان", "كانت"
        ])

    # -------------------------------
    # 🔹 تنظيف النص
    def clean_text(self, text):
        text = text.lower()
        # إزالة الرموز غير الضرورية
        text = re.sub(r'[^a-zA-Z\u0600-\u06FF0-9\s]', '', text)
        return text

    # -------------------------------
    # 🔹 استخراج الكلمات الرئيسية
    def extract_keywords(self, text, top_n=5):
        text = self.clean_text(text)
        words = text.split()
        words = [w for w in words if w not in self.stopwords]
        counter = Counter(words)
        keywords = [word for word, _ in counter.most_common(top_n)]
        return keywords

    # -------------------------------
    # 🔹 تحويل الأحلام إلى JSON جاهز للـ Frontend
    def parse_dream(self, dream_text):
        keywords = self.extract_keywords(dream_text)
        objects = []

        for idx, word in enumerate(keywords):
            obj = {
                "id": f"dream_obj_{idx}",
                "name": word,
                "position": {
                    "x": (idx * 10) % 50 - 25,
                    "y": (idx * 5) + 1,
                    "z": (idx * 7) % 50 - 25
                },
                "size": 2,
                "color": 0x66ccff
            }
            objects.append(obj)

        result = {
            "original_text": dream_text,
            "keywords": keywords,
            "objects": objects
        }
        return result

    # -------------------------------
    # 🔹 تحويل JSON إلى نص
    def to_json(self, dream_data):
        return json.dumps(dream_data, ensure_ascii=False, indent=2)


# -------------------------------
# 🔹 مثال للاختبار
if __name__ == "__main__":
    parser = DreamParser()
    dream_text = "رأيت قصرًا كبيرًا وحديقة جميلة وموسيقى هادئة"
    parsed = parser.parse_dream(dream_text)
    print(parser.to_json(parsed))
