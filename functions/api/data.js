export async function onRequestGet(context) {
  const value = await context.env.KV.get('all_data', 'json')
  return new Response(JSON.stringify(value || {}), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  })
}

export async function onRequestPut(context) {
  try {
    const current = (await context.env.KV.get('all_data', 'json')) || {}
    const update = await context.request.json()
    const merged = { ...current, ...update }
    await context.env.KV.put('all_data', JSON.stringify(merged))
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
