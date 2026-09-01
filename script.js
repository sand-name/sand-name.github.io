const menuBtn=document.querySelector(".menu-btn"),navLinks=document.querySelector(".nav-links");
menuBtn.addEventListener("click",()=>navLinks.classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>navLinks.classList.remove("open")));

const tips=["Carry a reusable bottle.","Keep rubbish with you until you find a suitable bin.","Choose products with less packaging.","Reuse containers for lunches or storage.","Check your local recycling rules.","If it is safe, pick up a small piece of litter and bin it."];
document.getElementById("randomTip").addEventListener("click",()=>document.getElementById("tipResult").textContent=tips[Math.floor(Math.random()*tips.length)]);

const checks=[...document.querySelectorAll(".challenge-check")];
function updateProgress(){const done=checks.filter(c=>c.checked).length,pct=Math.round(done/7*100);document.getElementById("progressText").textContent=`${done} / 7 completed`;document.getElementById("progressPercent").textContent=`${pct}%`;document.getElementById("progressBar").style.width=pct+"%";}
checks.forEach(c=>c.addEventListener("change",updateProgress));

const modal=document.getElementById("modal"),modalContent=document.getElementById("modalContent");
const modalData={
reduce:["Reduce","Avoid creating unnecessary waste.","• Choose durable products.<br>• Avoid unnecessary packaging.<br>• Plan purchases carefully."],
reuse:["Reuse","Give products more than one life.","• Refill bottles.<br>• Reuse bags and boxes.<br>• Repair useful items."],
recycle:["Recycle","Put materials into the correct recycling stream.","• Follow local council rules.<br>• Keep recycling clean.<br>• Don't assume every plastic item is recyclable."],
bin:["Bin it","Keep rubbish with you until it can be disposed of properly.","• Use a bin when available.<br>• Take rubbish home if needed.<br>• Never leave rubbish beside an overflowing bin."]
};
document.querySelectorAll(".solution-card").forEach(card=>card.addEventListener("click",()=>{const d=modalData[card.dataset.modal];modalContent.innerHTML=`<p class="eyebrow">PRACTICAL ACTION</p><h2>${d[0]}</h2><p>${d[1]}</p><p>${d[2]}</p>`;modal.classList.add("open");}));
document.querySelector(".close").addEventListener("click",()=>modal.classList.remove("open"));
modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("open")});

/* CLEAN-UP QUEST GAME */
const canvas=document.getElementById("gameCanvas"),ctx=canvas.getContext("2d"),startGame=document.getElementById("startGame");
const scoreEl=document.getElementById("gameScore"),leftEl=document.getElementById("gameLeft"),timeEl=document.getElementById("gameTime"),message=document.getElementById("gameMessage");
let player,rubbish,score,timeLeft,gameRunning,timer,keys={};

const rubbishTypes=["🥤","🧴","🥫","🍟","📄","🛍️","🧃","🍾","🧻","📦"];
function randomPosition(){
 return {x:45+Math.random()*(canvas.width-90),y:70+Math.random()*(canvas.height-115)};
}
function resetGame(){
 player={x:canvas.width/2,y:canvas.height/2,size:28,speed:5};
 rubbish=rubbishTypes.map((emoji,i)=>({...randomPosition(),emoji,size:25,id:i}));
 score=0;timeLeft=30;gameRunning=true;
 scoreEl.textContent=score;leftEl.textContent=rubbish.length;timeEl.textContent=timeLeft;
 message.textContent="Clean up the park!";startGame.textContent="Restart Game";
 clearInterval(timer);timer=setInterval(()=>{if(!gameRunning)return;timeLeft--;timeEl.textContent=timeLeft;if(timeLeft<=0)endGame(false)},1000);
 requestAnimationFrame(gameLoop);
}
function endGame(won){
 gameRunning=false;clearInterval(timer);
 message.textContent=won?`🎉 Amazing! You cleaned the whole park with ${timeLeft} seconds left!`:`Time's up! You collected ${score} pieces of rubbish. Try again!`;
 startGame.textContent="Play Again";
}
function drawGame(){
 ctx.clearRect(0,0,canvas.width,canvas.height);
 ctx.fillStyle="#a9d486";ctx.fillRect(0,0,canvas.width,canvas.height);
 // park paths
 ctx.fillStyle="#d9c99d";ctx.fillRect(0,canvas.height*.42,canvas.width,70);ctx.fillRect(canvas.width*.43,0,85,canvas.height);
 // grass dots
 for(let i=0;i<70;i++){const x=(i*137)%canvas.width,y=(i*83)%canvas.height;ctx.fillStyle="#82b866";ctx.fillRect(x,y,3,3);}
 // trees
 for(let i=0;i<12;i++){const x=(i*173+50)%canvas.width,y=(i*91+35)%canvas.height;ctx.fillStyle="#65452e";ctx.fillRect(x,y+18,7,22);ctx.fillStyle="#3e7d42";ctx.beginPath();ctx.arc(x+3,y+12,22,0,Math.PI*2);ctx.fill();}
 // rubbish
 rubbish.forEach(r=>{ctx.font=`${r.size}px Arial`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(r.emoji,r.x,r.y);});
 // player shadow
 ctx.fillStyle="rgba(0,0,0,.15)";ctx.beginPath();ctx.ellipse(player.x,player.y+20,18,7,0,0,Math.PI*2);ctx.fill();
 // player body
 ctx.fillStyle="#315d3d";ctx.beginPath();ctx.arc(player.x,player.y,17,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#f1c9a5";ctx.beginPath();ctx.arc(player.x,player.y-13,11,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#3b281e";ctx.beginPath();ctx.arc(player.x,player.y-17,11,Math.PI,Math.PI*2);ctx.fill();
 ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(player.x-4,player.y-14,2,0,Math.PI*2);ctx.arc(player.x+4,player.y-14,2,0,Math.PI*2);ctx.fill();
}
function gameLoop(){
 if(!gameRunning)return;
 let dx=0,dy=0;
 if(keys.ArrowLeft||keys.a)dx--;if(keys.ArrowRight||keys.d)dx++;if(keys.ArrowUp||keys.w)dy--;if(keys.ArrowDown||keys.s)dy++;
 if(dx||dy){const len=Math.hypot(dx,dy);player.x+=dx/len*player.speed;player.y+=dy/len*player.speed;}
 player.x=Math.max(25,Math.min(canvas.width-25,player.x));player.y=Math.max(45,Math.min(canvas.height-25,player.y));
 rubbish=rubbish.filter(r=>{if(Math.hypot(player.x-r.x,player.y-r.y)<30){score++;scoreEl.textContent=score;leftEl.textContent=rubbish.length-1;return false}return true});
 drawGame();
 if(rubbish.length===0){endGame(true);drawGame();return}
 requestAnimationFrame(gameLoop);
}
window.addEventListener("keydown",e=>{keys[e.key]=true;if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key))e.preventDefault()});
window.addEventListener("keyup",e=>keys[e.key]=false);
startGame.addEventListener("click",resetGame);
player={x:canvas.width/2,y:canvas.height/2,size:28,speed:5};rubbish=rubbishTypes.map((emoji,i)=>({...randomPosition(),emoji,size:25,id:i}));score=0;timeLeft=30;gameRunning=false;drawGame();

/* QUIZ */
const questions=[
{q:"What is one major way litter can reach rivers?",a:["It evaporates","Rain and stormwater can carry it","Trees absorb it","It turns into soil"],c:1},
{q:"Which approach generally prevents the most waste?",a:["Reduce unnecessary consumption","Recycle everything","Buy more bins","Use thicker plastic"],c:0},
{q:"Why can litter harm wildlife?",a:["It makes rain stop","Animals can eat or become trapped in it","It makes plants grow faster","It cleans habitats"],c:1},
{q:"What should you do if there is no bin nearby?",a:["Drop it beside a tree","Leave it on the ground","Carry it until you find a suitable disposal option","Hide it under leaves"],c:2},
{q:"Why should you check local recycling rules?",a:["Every council has exactly the same system","Recycling rules and accepted items can differ","Recycling never changes","Bins don't matter"],c:1}
];
let qi=0,quizScore=0,answered=false;
const quizContent=document.getElementById("quizContent"),nextBtn=document.getElementById("nextBtn");
function renderQuestion(){answered=false;nextBtn.disabled=true;const x=questions[qi];quizContent.innerHTML=`<div class="question">${x.q}</div><div class="answers">${x.a.map((a,i)=>`<button class="answer" data-i="${i}">${a}</button>`).join("")}</div>`;document.getElementById("quizScore").textContent=`Question ${qi+1} of ${questions.length}`;document.querySelectorAll(".answer").forEach(b=>b.addEventListener("click",()=>{if(answered)return;answered=true;const chosen=Number(b.dataset.i);document.querySelectorAll(".answer").forEach((btn,i)=>{if(i===x.c)btn.classList.add("correct");if(i===chosen&&chosen!==x.c)btn.classList.add("wrong")});if(chosen===x.c)quizScore++;nextBtn.disabled=false;}));}
nextBtn.addEventListener("click",()=>{if(qi<questions.length-1){qi++;renderQuestion()}else{quizContent.innerHTML=`<div class="question">You scored ${quizScore}/${questions.length}.</div><p>${quizScore===5?"Excellent — you know your stuff.":quizScore>=3?"Good job. A couple more facts and you'll be a litter expert.":"Worth another try — learn the facts and try again."}</p>`;nextBtn.textContent="Restart";document.getElementById("quizScore").textContent="Complete";nextBtn.disabled=false;nextBtn.onclick=()=>{qi=0;quizScore=0;nextBtn.textContent="Next";nextBtn.onclick=null;renderQuestion()}}});
renderQuestion();
