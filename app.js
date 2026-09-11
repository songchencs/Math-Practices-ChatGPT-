const $ = (s) => document.querySelector(s);
const state = { grade: 3, count: 10, concepts: ['addition','subtraction'], questions: [], index: 0, correct: 0, startedAt: 0 };
const labels = { addition:'Addition', subtraction:'Subtraction', multiplication:'Multiplication', division:'Division', fractions:'Fractions', geometry:'Geometry' };

document.querySelectorAll('.grade').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.grade').forEach(b => b.classList.remove('active')); btn.classList.add('active'); state.grade = +btn.dataset.grade;
}));
document.querySelectorAll('.concept').forEach(label => label.addEventListener('click', () => {
  setTimeout(() => { label.classList.toggle('selected', label.querySelector('input').checked); }, 0);
}));
$('#minus').onclick = () => changeCount(-5); $('#plus').onclick = () => changeCount(5);
function changeCount(n){ state.count = Math.max(5, Math.min(30, state.count + n)); $('#quantity').textContent = state.count; }

function rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function makeQuestion(type, grade){
  const max = grade <= 3 ? 30 : grade <= 5 ? 100 : 200;
  let a,b,text,answer;
  if(type === 'addition'){ a=rand(4,max); b=rand(3,max); text=`${a} + ${b}`; answer=a+b; }
  if(type === 'subtraction'){ a=rand(12,max); b=rand(3,a-1); text=`${a} − ${b}`; answer=a-b; }
  if(type === 'multiplication'){ a=rand(2,grade < 5 ? 10 : 15); b=rand(2,12); text=`${a} × ${b}`; answer=a*b; }
  if(type === 'division'){ b=rand(2,10); answer=rand(2,grade < 5 ? 10 : 15); a=b*answer; text=`${a} ÷ ${b}`; }
  if(type === 'fractions'){ const d=rand(2,8), n1=rand(1,d-1), n2=rand(1,d-n1); text=`${n1}/${d} + ${n2}/${d}`; answer=`${n1+n2}/${d}`; }
  if(type === 'geometry'){ const l=rand(3,15), w=rand(2,12); text=`Area: ${l} × ${w}`; answer=l*w; }
  return {type,text,answer};
}
function renderQuestion(){
  const q=state.questions[state.index]; $('#counter').textContent=`Question ${state.index+1} of ${state.count}`; $('#progressFill').style.width=`${((state.index)/state.count)*100}%`;
  $('#conceptBadge').textContent=labels[q.type].toUpperCase(); $('#question').innerHTML=`${q.text} = <span>?</span>`; $('#answer').value=''; $('#answer').focus(); $('#feedback').textContent=''; $('#feedback').className='feedback';
}
$('#practiceForm').addEventListener('submit', e => { e.preventDefault(); const selected=[...document.querySelectorAll('.concept input:checked')].map(i=>i.value); if(!selected.length){ alert('Pick at least one math concept to get started.'); return; } state.concepts=selected; state.questions=Array.from({length:state.count},()=>makeQuestion(selected[rand(0,selected.length-1)],state.grade)); state.index=0; state.correct=0; state.startedAt=Date.now(); $('#correctCount').textContent=0; $('#setupView').classList.add('hidden'); $('#practiceView').classList.remove('hidden'); renderQuestion(); });
$('#answerForm').addEventListener('submit', e => { e.preventDefault(); const q=state.questions[state.index], entered=$('#answer').value.trim().replace(/\s/g,''); if(!entered) return; const right=String(q.answer)===entered; const feedback=$('#feedback'); feedback.textContent=right?'Correct! Beautiful work. ✦':'Not quite — give the next one a try!'; feedback.className=`feedback ${right?'good':'bad'}`; if(right){state.correct++; $('#correctCount').textContent=state.correct;} setTimeout(next, right?750:1050); });
$('#skipBtn').onclick=next;
function next(){ state.index++; if(state.index>=state.count) return finish(); renderQuestion(); }
function finish(){ const sec=Math.max(1,Math.round((Date.now()-state.startedAt)/1000)); $('#practiceView').classList.add('hidden'); $('#resultsView').classList.remove('hidden'); $('#scorePercent').textContent=`${Math.round(state.correct/state.count*100)}%`; $('#resultCorrect').textContent=`${state.correct}/${state.count}`; $('#resultTime').textContent=`${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`; }
$('#exitBtn').onclick=()=>{ $('#practiceView').classList.add('hidden'); $('#setupView').classList.remove('hidden'); };
$('#againBtn').onclick=()=>{ $('#resultsView').classList.add('hidden'); $('#practiceView').classList.remove('hidden'); state.questions=state.questions.map(q=>makeQuestion(q.type,state.grade)); state.index=0;state.correct=0;state.startedAt=Date.now();$('#correctCount').textContent=0;renderQuestion(); };
$('#newSetBtn').onclick=()=>{ $('#resultsView').classList.add('hidden'); $('#setupView').classList.remove('hidden'); };
