// Formatação única para intervalos e orientações de alimentação.
function formatElapsedMinutes(value) {
  const total = Math.max(0, Math.round(Number(value) || 0));
  const hours = Math.floor(total / 60), minutes = total % 60;
  return hours ? hours + 'h' + (minutes ? ' ' + minutes + 'min' : '') : minutes + 'min';
}
function mealGuidance(now = new Date()) {
  const birth = new Date(2026, 2, 10);
  let months = (now.getFullYear()-birth.getFullYear())*12 + now.getMonth()-birth.getMonth();
  if (now.getDate() < birth.getDate()) months--;
  if (months < 6) return 'OMS: alimentação complementar a partir dos 6 meses, junto à amamentação.';
  if (months < 9) return 'OMS: 2–3 refeições por dia dos 6 aos 8 meses, junto à amamentação. Respeite os sinais de fome e saciedade.';
  if (months < 24) return 'OMS: 3–4 refeições por dia dos 9 aos 23 meses e 1–2 lanches conforme a necessidade, junto à amamentação.';
  return 'Respeite os sinais de fome e saciedade e siga a orientação do acompanhamento pediátrico.';
}
function renderMealStatus(entries, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const meals = entries.filter(e => e.tipo === 'refeicao');
  const seconds = e => e.endTs || e.ts?.seconds || 0;
  const latest = meals.filter(e => seconds(e)).sort((a,b) => seconds(b)-seconds(a))[0];
  const today = new Date().toLocaleDateString('sv-SE');
  const count = meals.filter(e => e.dateKey === today).length;
  const title = el.querySelector('[data-meal-last]');
  title.textContent = latest ? 'Última refeição: ' + new Date(seconds(latest)*1000).toLocaleString('pt-BR', {day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}) + ' · há ' + formatElapsedMinutes((Date.now()/1000-seconds(latest))/60) : 'Nenhuma refeição registrada ainda';
  el.querySelector('[data-meal-count]').textContent = count + (count === 1 ? ' refeição hoje' : ' refeições hoje');
  el.querySelector('[data-meal-guidance]').textContent = mealGuidance();
}
