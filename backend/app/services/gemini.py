import google.generativeai as genai
import os
import json
GEMINI_KEY = os.environ["GEMINI_KEY"]

genai.configure(api_key=GEMINI_KEY) #type:ignore
model = genai.GenerativeModel("gemini-3.5-flash")#type:ignore

def generate_combinations(selected_items, all_items):
    lines = []
    for i, item in enumerate(all_items):
        lines.append(
            f"{i}. {item['clothing_type']} ({item['category']})"
            f" - {item.get('primary_color', 'N/A')}"
            f" - style: {item.get('style_tags', 'none')}"
            f" - occasion: {item.get('occasion', 'any')}"
        )
    items_text = "\n".join(lines)
    selected_ids = {item['id'] for item in selected_items}
    selected_indices = [str(i) for i, item in enumerate(all_items) if item['id'] in selected_ids]
    prompt = f"""You are a fashion stylist. The user owns these clothing items:

{items_text}

The user specifically wants to use: {', '.join(selected_indices)}

Create 3 complete outfit combinations using ONLY the items listed above.
Each combination must include items with different categories (e.g., top + bottom).
Respond ONLY with a JSON array. Each object:
  - "name": short name for the outfit
  - "items": array of item indices (0-based)
  - "description": 1-2 sentence description

Example:
[
  {{"name": "Casual Blue Look", "items": [0, 1], "description": "..."}}
]"""

    response = model.generate_content(prompt)
    raw = response.text
    if "```json" in raw:
        raw = raw.split("```json")[1].split("```")[0].strip()
    elif "```" in raw:
        raw = raw.split("```")[1].strip()
    return json.loads(raw)
