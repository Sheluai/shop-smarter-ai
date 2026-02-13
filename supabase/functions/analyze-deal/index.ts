const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const STORE_PATTERNS: Record<string, { name: string; logo: string }> = {
  'amazon': { name: 'Amazon', logo: '🛒' },
  'flipkart': { name: 'Flipkart', logo: '🛍️' },
  'myntra': { name: 'Myntra', logo: '👗' },
  'ajio': { name: 'AJIO', logo: '👔' },
  'nykaa': { name: 'Nykaa', logo: '💄' },
  'meesho': { name: 'Meesho', logo: '🏪' },
  'croma': { name: 'Croma', logo: '📱' },
  'tatacliq': { name: 'Tata CLiQ', logo: '🏬' },
  'jiomart': { name: 'JioMart', logo: '🛒' },
};

function detectStore(url: string): { name: string; logo: string } | null {
  const lower = url.toLowerCase();
  for (const [key, val] of Object.entries(STORE_PATTERNS)) {
    if (lower.includes(key)) return val;
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'A valid product URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const store = detectStore(url);
    const storeName = store?.name || 'Unknown Store';

    const prompt = `You are a shopping deal analyst for Indian e-commerce. Analyze this product link and provide a verdict.

Product URL: ${url}
Detected Store: ${storeName}

Based on the URL, product name patterns, and your knowledge of typical pricing for this type of product on ${storeName}, generate a realistic analysis.

Respond in this exact JSON format only, no markdown:
{
  "productName": "short product name",
  "verdict": "buy" | "wait" | "overpriced",
  "reason": "one clear sentence explaining why",
  "currentPrice": number,
  "averagePrice": number,
  "lowestPrice": number,
  "bestStore": "store name with best price",
  "bestStorePrice": number,
  "category": "mobiles" | "electronics" | "fashion" | "beauty" | "home" | "grocery",
  "confidence": "high" | "medium" | "low"
}

Rules:
- Make prices realistic in INR for Indian market
- lowestPrice should be lower than currentPrice
- averagePrice should be between current and lowest
- If verdict is "buy", bestStorePrice should be <= currentPrice
- Be genuinely helpful, not promotional`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error('AI Gateway error:', errText);
      return new Response(
        JSON.stringify({ success: false, error: 'AI analysis failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || '';

    // Parse JSON from response (handle potential markdown wrapping)
    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
      console.error('Failed to parse AI response:', content);
      return new Response(
        JSON.stringify({ success: false, error: 'Could not parse analysis' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          ...parsed,
          store: store || { name: 'Store', logo: '🛒' },
          url,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error analyzing deal:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to analyze deal' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
