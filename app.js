const $ = (s) => document.querySelector(s);
const state = { count: 10, concepts: ['addition','subtraction'], questions: [], index: 0, correct: 0, startedAt: 0 };
const labels = { addition:'Addition', subtraction:'Subtraction', multiplication:'Multiplication', division:'Division', fractions:'Fractions', geometry:'Geometry', decimals:'Decimals', percentages:'Percentages', exponents:'Exponents', measurement:'Measurement' };
document.querySelectorAll('.concept').forEach(label => label.addEventListener('click', () => {
  setTimeout(() => { label.classList.toggle('selected', label.querySelector('input').checked); }, 0);
}));
$('#minus').onclick = () => changeCount(-1); $('#plus').onclick = () => changeCount(1);
$('#quantity').addEventListener('input', () => {
  const value = Number($('#quantity').value);
  if (Number.isFinite(value)) state.count = Math.max(1, Math.min(50, Math.round(value)));
});
$('#quantity').addEventListener('change', () => { $('#quantity').value = state.count; });
function changeCount(n){ state.count = Math.max(1, Math.min(50, state.count + n)); $('#quantity').value = state.count; }

function rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function makeQuestion(type){
  const max = 100;
  let a,b,text,answer;
  if(type === 'addition'){ a=rand(4,max); b=rand(3,max); text=`${a} + ${b}`; answer=a+b; }
  if(type === 'subtraction'){ a=rand(12,max); b=rand(3,a-1); text=`${a} − ${b}`; answer=a-b; }
  if(type === 'multiplication'){ a=rand(2,12); b=rand(2,12); text=`${a} × ${b}`; answer=a*b; }
  if(type === 'division'){ b=rand(2,10); answer=rand(2,12); a=b*answer; text=`${a} ÷ ${b}`; }
  if(type === 'fractions'){ const d=rand(2,8), n1=rand(1,d-1), n2=rand(1,d-n1); text=`${n1}/${d} + ${n2}/${d}`; answer=`${n1+n2}/${d}`; }
  if(type === 'geometry'){ const l=rand(3,15), w=rand(2,12); text=`Area: ${l} × ${w}`; answer=l*w; }
  if(type === 'decimals'){ const n1=rand(10,90)/10, n2=rand(10,90)/10; text=`${n1.toFixed(1)} + ${n2.toFixed(1)}`; answer=(n1+n2).toFixed(1); }
  if(type === 'percentages'){ const whole=rand(2,20)*10, pct=[10,20,25,50][rand(0,3)]; text=`${pct}% of ${whole}`; answer=whole*pct/100; }
  if(type === 'exponents'){ a=rand(2,10); text=`${a}²`; answer=a*a; }
  if(type === 'measurement'){ const feet=rand(2,12); text=`${feet} ft = ? in`; answer=feet*12; }
  return {type,text,answer};
}
function renderQuestion(){
  const q=state.questions[state.index]; $('#counter').textContent=`Question ${state.index+1} of ${state.count}`; $('#progressFill').style.width=`${((state.index)/state.count)*100}%`;
  $('#conceptBadge').textContent=labels[q.type].toUpperCase(); $('#question').innerHTML=`${q.text} = <span>?</span>`; $('#answer').value=''; $('#answer').focus(); $('#feedback').textContent=''; $('#feedback').className='feedback';
}
function startPractice(e) {
  e?.preventDefault();
  const selected = [...document.querySelectorAll('.concept input:checked')].map(i => i.value);
  if (!selected.length) { alert('Pick at least one math concept to get started.'); return; }
  state.concepts = selected;
  state.questions = Array.from({length: state.count}, () => makeQuestion(selected[rand(0, selected.length - 1)]));
  state.index = 0; state.correct = 0; state.startedAt = Date.now();
  window.mathlyAnalytics?.track?.('practice_started', { questions: state.count, concepts: selected });
  $('#correctCount').textContent = 0;
  $('#setupView').classList.add('hidden');
  $('#practiceView').classList.remove('hidden');
  renderQuestion();
}
$('#practiceForm').addEventListener('submit', startPractice);
$('#startBtn').addEventListener('click', startPractice);
$('#answerForm').addEventListener('submit', e => { e.preventDefault(); const q=state.questions[state.index], entered=$('#answer').value.trim().replace(/\s/g,''); if(!entered) return; const right=String(q.answer)===entered; window.mathlyAnalytics?.track?.('problem_answered', { correct: right ? 1 : 0, concept: q.type }); const feedback=$('#feedback'); feedback.textContent=right?'Correct! Beautiful work. ✦':'Not quite — give the next one a try!'; feedback.className=`feedback ${right?'good':'bad'}`; if(right){state.correct++; $('#correctCount').textContent=state.correct;} setTimeout(next, right?750:1050); });
$('#skipBtn').onclick=next;
function next(){ state.index++; if(state.index>=state.count) return finish(); renderQuestion(); }
function finish(){ const sec=Math.max(1,Math.round((Date.now()-state.startedAt)/1000)); window.mathlyAnalytics?.track?.('practice_completed', { questions: state.count, correct: state.correct, seconds: sec }); $('#practiceView').classList.add('hidden'); $('#resultsView').classList.remove('hidden'); $('#scorePercent').textContent=`${Math.round(state.correct/state.count*100)}%`; $('#resultCorrect').textContent=`${state.correct}/${state.count}`; $('#resultTime').textContent=`${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`; }
$('#exitBtn').onclick=()=>{ $('#practiceView').classList.add('hidden'); $('#setupView').classList.remove('hidden'); };
$('#againBtn').onclick=()=>{ $('#resultsView').classList.add('hidden'); $('#practiceView').classList.remove('hidden'); state.questions=state.questions.map(q=>makeQuestion(q.type)); state.index=0;state.correct=0;state.startedAt=Date.now();$('#correctCount').textContent=0;renderQuestion(); };
$('#newSetBtn').onclick=()=>{ $('#resultsView').classList.add('hidden'); $('#setupView').classList.remove('hidden'); };
