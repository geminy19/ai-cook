import { useState } from "react";

// =============================================
// 🔑 ВАЖНО: ПОСТАВИ ТВОЯ ANTHROPIC API КЛЮЧ ТУК
// Отиди на: https://console.anthropic.com/
// Създай акаунт → API Keys → Create Key
// Замени думите по-долу с твоя истински ключ
// =============================================
const ANTHROPIC_API_KEY = "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";
// Пример: const ANTHROPIC_API_KEY = "sk-ant-api03-xxxxxxxxxxxx";

export default function App() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getRecipe = async () => {
    if (!ingredients.trim()) {
      setError("Моля въведи поне един продукт!");
      return;
    }

    if (ANTHROPIC_API_KEY === "ПОСТАВИ_ТВОЯ_API_КЛЮЧ_ТУК") {
      setError("⚠️ Не си поставил API ключ! Виж коментара в App.jsx");
      return;
    }

    setLoading(true);
    setError("");
    setRecipe("");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: `Имам следните продукти в хладилника: ${ingredients}. 
              Предложи ми една вкусна рецепта на български език. 
              Включи: Наименование на ястието, Необходими продукти (само от наличните), Стъпки за приготвяне (накратко), Време за готвене.
              Бъди приятелски и ентусиазиран!`,
            },
          ],
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError("Грешка от API: " + data.error.message);
      } else {
        setRecipe(data.content[0].text);
      }
    } catch (err) {
      setError("Нещо се обърка. Провери API ключа си и интернет връзката.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1a0a00] text-orange-50 px-4 py-12">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-12">
        <div className="text-7xl mb-4">🍳</div>
        <h1 className="text-5xl font-black text-orange-400 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
          AI Готвач
        </h1>
        <p className="text-orange-200 text-lg font-light">
          Кажи ми какво имаш в хладилника — ще измисля нещо вкусно!
        </p>
      </div>

      {/* Input Card */}
      <div className="max-w-2xl mx-auto bg-[#2d1200] border border-orange-900 rounded-2xl p-8 shadow-2xl mb-6">
        <label className="block text-orange-300 font-bold mb-3 text-sm uppercase tracking-widest">
          Продукти в хладилника
        </label>
        <textarea
          className="w-full bg-[#1a0a00] border border-orange-800 rounded-xl p-4 text-orange-50 placeholder-orange-900 focus:outline-none focus:border-orange-500 transition-colors resize-none text-base"
          rows={4}
          placeholder="Пример: яйца, домати, сирене, спанак, чесън..."
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />

        <button
          onClick={getRecipe}
          disabled={loading}
          className="mt-5 w-full bg-orange-500 hover:bg-orange-400 disabled:bg-orange-900 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-200 text-lg tracking-wide"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Мисля за рецепта...
            </span>
          ) : (
            "🍽️ Намери рецепта!"
          )}
        </button>

        {error && (
          <div className="mt-4 bg-red-900/40 border border-red-700 rounded-xl p-4 text-red-300 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Recipe Result */}
      {recipe && (
        <div className="max-w-2xl mx-auto bg-[#2d1200] border border-orange-700 rounded-2xl p-8 shadow-2xl fade-in">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">📋</span>
            <h2 className="text-2xl font-black text-orange-400" style={{ fontFamily: 'Playfair Display, serif' }}>
              Твоята рецепта
            </h2>
          </div>
          <div className="text-orange-100 leading-relaxed whitespace-pre-wrap text-base">
            {recipe}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-12 text-orange-900 text-sm">
        Powered by Claude AI · Anthropic
      </div>
    </div>
  );
}
