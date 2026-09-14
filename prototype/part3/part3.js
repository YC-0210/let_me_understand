/* Authored Model. Citation-backed states; this is not a live timing trace. */
const $ = s => document.querySelector(s);
const NS = 'http://www.w3.org/2000/svg';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let chapter = 0, step = 0, playing = false, elapsed = 0, previousTime = 0;
let transit = null, playbackStarted = false;
let closeParent = false, reapMode = 'none', load = 3, modalReturn, resumeAfterDoor = false;
const visited = new Set(), answers = new Map();
const WINK = $('#winkTemplate').content.firstElementChild.cloneNode(true);
$('#briefingWink').append(WINK);
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const term = (id, name) => `<button class="term-door" data-door="${id}">${name}</button>`;
const chapters = [
 {title:'Why B waits', subtitle:'One process · two client requests', steps:[
  ['Two people, one running server', 'A and B are two client programs asking for a page. The circle on the right is the server: the program answering them. It has one running instance, called a <b>process</b>. First, let’s give it A’s request.', 'Send request A'],
  ['A gets the server’s attention', 'The server calls <b>accept()</b> to take A’s connection. A connection is the communication path between these programs. Now the same process must read A’s request and send its response before it can return to accepting another connection.', 'Let the server answer A'],
  ['The answer arrives before the work ends', 'A has received “Hello, World!” The article deliberately adds a <b>60-second sleep after sending the response</b> to keep the process busy. This makes its limitation easy to see. The arc means occupied; the response dot means an answer arrived. They tell different stories.', 'Let B arrive during the sleep'],
  ['B connects—but nobody handles B yet', `A’s connection is still open. B can connect because the ${term('kernel','operating system')} holds incoming connections in a waiting area, called the <b>listen queue</b>. But our one process is sleeping, so it cannot call accept() again. B has received no response.`, 'Finish A’s sleep and close A'],
  ['Only now is the server free', 'The sleep ends and the server closes A’s connection. Notice that <b>receiving an answer and closing a connection are separate events</b>. The process has finished A’s turn and can finally look for another client.', 'Accept the waiting B'],
  ['B leaves the queue', 'The next accept() takes B’s waiting connection. Making the queue bigger would only give more clients somewhere to wait. It would not give this single process another way to handle requests while it is busy.', 'Answer B, then finish its turn'],
  ['B gets the same treatment', 'B receives its response, and this process again sleeps for 60 seconds before closing. This is an <b>iterative server</b>: it finishes one client’s turn before starting the next. Our problem is the shared process, not the page being requested.', 'Close B and see the takeaway'],
  ['A queue holds work. It doesn’t do work.', 'Both connections are now closed. B had to wait for A’s turn to end, even though A had already received its answer. Next, we’ll give each client a separate running process, so the original process can return to accepting connections.', 'Give each request a worker →']
 ]},
 {title:'Share the work', subtitle:'A parent accepts · a child handles each connection', steps:[
  ['Keep someone available for the next client', 'We saw B wait because one process did every job. The change is to keep the original process focused on accepting connections, and let a new running process handle each accepted client. We call the original the <b>parent</b> and each new process a <b>child</b>.', 'Accept A in the parent'],
  ['Accept first, then create a worker', 'The parent has accepted A’s connection. No child exists yet. This order matters: we want the child to receive access to the connection that needs handling. The next operation, <b>fork()</b>, creates that child.', 'Call fork() for A'],
  ['One call continues in two processes', `${term('fork','fork()')} creates a child that continues from the same point in the program. It returns <b>0 in the child</b> and <b>the child’s process ID in the parent</b>. Those different return values let the same code give them different jobs. The dashed line records this parent–child relationship; no request travels through it.`, 'Let child A answer'],
  ['A’s worker is busy. The parent is available.', 'Child A sends the response and then sleeps, just as before. The parent has given up its own access to A’s connection and returned to accept(); the child can still use that connection. We’ll look at how this is possible in the next idea. A’s sleep now occupies only its child. Watch what happens when B arrives.', 'Send B while child A sleeps'],
  ['The parent accepts B immediately', 'B does not have to wait for child A to finish. The parent is available to accept B’s connection. We still need a worker for B, so the parent calls fork() again.', 'Create child B'],
  ['Two clients now have separate workers', 'Child B has access to B’s connection. Child A still has A’s connection. The parent returns to accepting more clients. The children can make progress independently; neither has to wait for the other child’s sleep to end.', 'Let child B answer'],
  ['B gets an answer while A is still busy', 'Both clients now have responses, with both child processes still occupied. That overlap is <b>concurrency</b>. It does not require two processors executing at the exact same instant. This drawing shows one possible order, not a guarantee about which child finishes first.', 'Finish both children’s turns'],
  ['The child is done. Why might its client still wait?', 'Each child eventually closes its connection and exits. You would expect its client to be finished too. But if the parent still has access to that connection, the client can remain waiting. Next we’ll follow one connection and see exactly what each process must close.', 'Find out what keeps A connected →']
 ]},
 {title:'Why A stays connected', subtitle:'Follow who can still use A’s connection', steps:[
  ['The child finishes. Why might A still wait?', 'So far, each child answers one client and then exits. We expect that client’s connection to end too. But it can stay open if the parent still has a way to use it. <b>Let’s rewind to just before fork()</b>, when the parent has accepted A. The socket below is the server’s end of A’s connection—the part the program uses to send and receive data.', 'Show how the parent finds that socket'],
  ['A process needs a way to find its open socket', 'The operating system keeps a numbered list of open files and sockets for each process. Here, imagine <b>entry 4 points to A’s socket</b>. The parent uses that entry to send or receive data. That link from a process to an open socket is what we mean here by a <b>reference</b>. The number identifying the entry is called a <b>file descriptor</b>. The line below shows that link; 4 is an illustrative number.', 'See what fork() copies'],
  ['The child gets its own entry for the same socket', 'fork() copies the parent’s list into the child. Now <b>the parent’s entry 4 and the child’s entry 4 both point to A’s same socket</b>. There is still just one connection to A. We count two references because two entries keep that socket available. Closing one entry removes only that process’s access; the other can still use the socket.', 'Look at the other socket they copied'],
  ['One socket listens. The other talks to A.', 'The server also has a <b>listening socket</b>, which waits for new clients. accept() creates a separate connected socket for talking to A. fork() copied access to both, so we now show both sockets. The parent needs the listener to accept more clients. The child only needs A’s connected socket to answer A.', 'Remove the child’s unused listening entry'],
  ['The child keeps only the socket it needs', 'The child closes its entry for the listening socket. Follow the remaining line: the parent can still use that listener. A’s connected socket still has two references, one in each process. Closing access to the listener did not change either process’s access to A.', 'Decide whether the parent keeps access to A'],
  ['The parent no longer needs to talk to A', () => closeParent ? 'The parent closes its entry for A’s socket. The count drops from two references to one: the child’s entry remains, so the child can still answer A. The parent keeps its listening entry to accept new clients.' : 'In this broken case, the parent <b>keeps its entry for A’s socket</b>, even though only the child will answer A. That leaves two references. We’ll follow the child to its exit and see why the parent’s leftover entry matters. The checkbox below lets you compare the repaired case.', 'Let the child answer A'],
  ['Receiving the text isn’t the end of this response', 'The child sends “Hello, World!” In this example, the server does not tell A how many response bytes to expect. A therefore waits for the connection to end to know it has received the whole response. Next the child will close its own entry. Watch whether that removes the last way to use A’s socket.', 'Close the child’s entry for A'],
  ['Closing an entry removes one reference', () => closeParent ? 'The child closes its entry and exits. The parent already closed its own entry, so <b>zero references remain</b>. Neither process can use A’s socket anymore; nothing in this example keeps it open.' : 'The child closes its entry and exits, but <b>one reference remains</b>: the parent’s entry still points to A’s socket. The child cannot remove an entry from the parent’s list. Follow the surviving solid line back to the parent.', 'Check whether A can finish'],
  ['A finishes when the last reference closes', () => closeParent ? 'Both entries are closed, so this example can end A’s connection and A can finish reading. Uncheck the parent close to see the surviving entry keep it open. The rule is now concrete: each process closes the entries it no longer needs.' : 'A still waits because the parent’s entry keeps the socket open. <b>Check “Close the parent’s entry for A” below.</b> The last line disappears, the count reaches zero, and the connection can end. Leaving entries open on every request would also eventually fill the parent’s list of available file descriptors.', 'Follow what an exited child leaves behind →']
 ]},
 {title:'Collect finished children', subtitle:'Child exits · notification · collect exit records', steps:[
  ['Finished work can leave unfinished cleanup', 'We can handle clients independently and close their connections. One last resource remains: when a child exits, the operating system keeps a small record for its parent. Let’s follow these children through that cleanup. The slider lets you try between one and eight.', 'Let the children exit'],
  ['The workers stop running', 'These children have closed their sockets and exited. They do not keep doing work or sleeping. But the operating system still needs to tell the parent how they ended, so their locations in the drawing stay visible while we follow their records.', 'Look at what remains'],
  ['A zombie is an exit record, not a worker', 'Each uncollected record is called a <b>zombie</b>. It retains information such as the child’s ID and exit status. The parent must collect it using wait() or waitpid(). Killing the child again cannot help: the child has already exited.', 'Notify the parent'],
  ['A notification is not a count of exits', 'The operating system can notify the parent with <b>SIGCHLD</b>, a signal that a child changed state. Here we select a possible case where several exits share <b>one pending notification</b>. Ordinary signals can merge like this; you cannot assume one notification per child.', 'Choose how to handle this notice'],
  ['What should the parent collect?', () => reapMode === 'none' ? 'With no handler that collects children, the records stay. Choose <b>“Collect one”</b> below to see why one wait per notice can still miss records, then compare it with collecting all finished children.' : reapMode === 'one' ? 'One wait() collects one child’s status. But our single notification can cover several exits. If more than one child has finished, a single wait leaves the others uncollected. Next, watch which records disappear.' : 'A loop calls <b>waitpid(-1, WNOHANG)</b>: check any child, return immediately if none is ready. It repeats for every finished child, then stops when none is ready or no children remain. This avoids blocking the parent while a child is still running.', 'Collect using this method'],
  ['The records tell us whether cleanup worked', () => remaining() ? `${remaining()} exit ${remaining()===1?'record remains':'records remain'}. ${reapMode==='none'?'Nobody collected them.':'One notice collected only one child.'} Change the method to <b>“Collect all finished children”</b> and the remaining records disappear. More children make the weakness of one wait easier to see.` : 'No exit records remain. Each finished child has been collected. Increase the number of children and compare the methods: the loop clears all ready children even when only one notification is delivered.', 'See the whole lesson'],
  ['Keep accepting. Keep cleaning up.', () => remaining() ? 'The parent can accept more connections, but uncollected records will build up over repeated requests and can consume process slots. Choose the loop to complete the repair. Socket closes and collecting child records solve two different cleanup problems.' : 'The parent can accept more connections without waiting for running children, and every child that has already finished has been collected. We now have the whole chain: accept, fork, handle, close, and collect.', 'Bring the four ideas together →']
 ]}
];
const checkpoints = [
 ['Would a larger waiting queue let this server handle B during A’s sleep?', ['Yes, more room means more workers','No, the same process is still busy'],1,'Exactly. Queue capacity changes how many connections can wait, not how many processes handle them.','More queue space only stores waiting connections. Look again at the occupied server: there is still just one process.'],
 ['Who handles B’s request after the second fork?', ['The parent','Child B'],1,'Yes. The parent accepts and forks; child B reads the request and sends its response.','The parent stays available for incoming connections. Child B handles the accepted request.'],
 ['The child closes A. The parent keeps a reference. Can this example end A’s connection?', ['Yes, the worker is done','No, a reference still holds it open'],1,'Right. One surviving reference is enough to keep this socket open.','The child only closes its own reference. The parent’s reference is still open; try closing it above.'],
 ['One notification arrives after several children exit. What should the handler do?', ['Collect one child','Collect ready children until none remain'],1,'Yes. Use the notification to check all ready children, without blocking for a running one.','A notification is not a reliable count. Several exits can share one notice; the handler must check for more finished children.']
];
function remaining(){return reapMode==='none'?load:reapMode==='one'?Math.max(0,load-1):0}
function descriptorStage(){return step<2?0:step<4?1:step-2}
function refs(){const s=descriptorStage();return s<1?1:2-(s>=3&&closeParent?1:0)-(s>=5?1:0)}
function textAt(){const v=chapters[chapter].steps[step][1];return typeof v==='function'?v():v}

function svg(tag,attrs={},parent=$('#drawing')){const e=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);parent.append(e);return e}
function line(x1,y1,x2,y2,cls='channel'){return svg('line',{x1,y1,x2,y2,class:cls})}
function label(x,y,value,cls='svg-label'){const e=svg('text',{x,y,class:cls,'text-anchor':'middle'});e.textContent=value;return e}
function door(x,y,value,id){const e=label(x,y,value,'svg-door');e.setAttribute('tabindex','0');e.setAttribute('role','button');e.dataset.door=id;return e}
function place(x,y,name,id,r=36){svg('circle',{cx:x,cy:y,r,class:'place'});door(x,y+r+23,name,id)}
function held(x,y,ok=false,r=17){return svg('circle',{cx:x,cy:y,r,class:'held',style:ok?'fill:color-mix(in srgb,var(--ok) 22%,transparent);stroke:var(--ok)':''})}
function cross(x,y){line(x-6,y-6,x+6,y+6,'cross');line(x+6,y-6,x-6,y+6,'cross')}
function ring(x,y,r=46){svg('circle',{cx:x,cy:y,r,class:'ring','stroke-dasharray':`${2*Math.PI*r*.72} ${2*Math.PI*r}`,transform:`rotate(-90 ${x} ${y})`})}
function empty(x,y){cross(x,y)}
function requestPath(x1,y1,x2,y2,history=false){line(x1,y1,x2,y2,history?'trace':'channel')}
function queueDrawing(){
 const s=step, serverX=650;
 requestPath(146,83,614,144,s>=4);requestPath(146,230,614,164,s>=7);
 place(110,83,'Client A','client');place(110,230,'Client B','client');place(serverX,155,'Server process','server');
 if(s>=2){held(110,83,true);label(110,28,'Response received','svg-value')}
 else label(110,28,s===0?'Not sent':'Waiting for response');
 if(s>=6){held(110,230,true);label(110,178,'Response received','svg-value')}
 else label(110,178,s<3?'Not sent':'No response yet');
 if(s===1){held(serverX,155);label(serverX,94,'Handling A','svg-value')}
 if(s===2||s===3){ring(serverX,155);label(serverX,94,'Sleeping after A','svg-value')}
 if(s===3){held(404,194);door(404,251,'B · listen queue','kernel')}
 if(s===5){held(serverX,155);label(serverX,94,'Handling B','svg-value')}
 if(s===6){ring(serverX,155);label(serverX,94,'Sleeping after B','svg-value')}
 if([0,4,7].includes(s))label(serverX,94,'Available to accept','svg-value');
 door(395,290,s===2||s===3||s===6?'Sleep: 60 seconds · time compressed':'Connection paths · dashed after close','trace');
}
function forkDrawing(){
 const s=step;
 // Requests use client↔worker connections. Ancestry never carries a request.
 if(s>=2){line(425,133,609,83,'trace');place(650,83,'Child A','child');requestPath(146,83,614,83,s>=7);if(s>=3&&s<7)ring(650,83);label(650,25,s>=7?'Exited':s>=3?'Sleeping after A':'fork returns 0','svg-value')}
 if(s>=5){line(425,177,609,230,'trace');place(650,230,'Child B','child');requestPath(146,230,614,230,s>=7);if(s>=6&&s<7)ring(650,230);label(650,176,s>=7?'Exited':s>=6?'Sleeping after B':'fork returns 0','svg-value')}
 if(s<2&&s>=1)requestPath(146,83,358,138);
 if(s===4)requestPath(146,230,358,172);
 place(110,83,'Client A','client');place(110,230,'Client B','client');place(390,155,'Parent process','parent');
 label(390,98,[1,4].includes(s)?'Connection accepted':s===2||s===5?'fork returns child ID':'Ready to accept','svg-value');
 if(s>=3){held(110,83,true);label(110,25,'Response received','svg-value')}
 if(s>=6){held(110,230,true);label(110,176,'Response received','svg-value')}
 if(s===1||s===4)held(390,155);
 if(s===2)held(650,83);if(s===5)held(650,230);
 if(s>=7){empty(650,83);empty(650,230)}
 door(390,290,'Dashed diagonals · created by the parent','ancestry');
}
function descriptorDrawing(){
 const s=descriptorStage(),parentA=!(s>=3&&closeParent),childA=s>=1&&s<5,childListen=s>=1&&s<2;
 if(step>=3){
  line(161,143,370,77);if(childListen)line(659,143,450,77);
  place(410,67,'Listening socket','listener',29);
  label(410,18,`${1+(childListen?1:0)} listening ${childListen?'references':'reference'}`,'svg-value');
 }
 line(161,167,370,217,parentA?'channel':'trace');
 if(s>=1)line(659,167,450,217,childA?'channel':'trace');
 place(125,155,'Parent process','parent');
 if(s>=1){place(695,155,'Child process','child');label(695,101,s>=5?'Entry 4 closed · exited':'Entry 4 → A’s socket');if(s>=5)empty(695,155)}
 place(410,227,'A’s connected socket','socket',29);
 if(step>=1){label(410,179,`${refs()} open ${refs()===1?'reference':'references'} to A`,'svg-value');label(125,101,parentA?'Entry 4 → A’s socket':'Entry 4 closed')}
 else label(125,101,'Can send and receive with A');
 if(refs())held(410,227);else empty(410,227);
 door(258,217,step===0?'Parent can use this socket':parentA?'Parent entry: open':'Parent entry: closed','descriptor');
 if(s>=1)door(561,217,childA?'Child entry: open':'Child entry: closed','descriptor');
}
function reapDrawing(){
 place(100,145,'Parent','parent');label(100,87,step>=4&&reapMode!=='none'?'Collecting exits':'Accepting clients');
 const n=load;
 for(let i=0;i<n;i++){
   const x=265+(i%4)*142, y=n<=4?145:(i<4?83:230);
   const collected=step>=5&&(reapMode==='all'||reapMode==='one'&&i===0);
   place(x,y,`Child ${i+1}`,'zombie',24);
   if(step===0)ring(x,y,31);
   else if(!collected)held(x,y,false,12);
   else empty(x,y);
   label(x,y-40,step===0?'Working':collected?'Collected':step===1?'Exited':'Exit record','svg-value');
 }
 if(step>=3){line(132,145,228,145,'trace');door(180,290,'One pending SIGCHLD notice','signal')}
}
function renderDrawing(){
 transit?.cancel();transit=null;
 $('#drawing').querySelectorAll(':scope > *:not(title):not(desc)').forEach(e=>e.remove());
 $('#drawingTitle').textContent=chapters[chapter].title;
 $('#drawingDesc').textContent=chapters[chapter].steps[step][0]+'. '+textAt().replace(/<[^>]*>/g,'');
 [queueDrawing,forkDrawing,descriptorDrawing,reapDrawing][chapter]();bindDoors();
}
// Only playback interpolates travel. Seeking and manual steps land on completed states.
function animateTransition(){
 if(reduced)return;
 const paths=[
  {1:[146,83,650,155,false],2:[614,144,110,83,true],3:[146,230,404,194,false],5:[404,194,650,155,false],6:[614,164,110,230,true]},
  {1:[146,83,390,155,false],3:[614,83,110,83,true],4:[146,230,390,155,false],6:[614,230,110,230,true]},
  {},{}
 ];
 const path=paths[chapter][step];if(!path)return;
 const [x1,y1,x2,y2,ok]=path;
 const destination=[...$('#drawing').querySelectorAll('circle.held')].find(e=>+e.getAttribute('cx')===x2&&+e.getAttribute('cy')===y2);
 if(destination)destination.style.opacity='0';
 const packet=svg('circle',{cx:x1,cy:y1,r:8,class:ok?'disc ok':'disc'});
 transit=packet.animate([{transform:'translate(0px,0px)'},{transform:`translate(${x2-x1}px,${y2-y1}px)`}],{duration:1100,easing:'ease-in-out',fill:'forwards'});
 transit.onfinish=()=>{packet.remove();if(destination)destination.style.opacity='1';transit=null};
}
function outcomes(){
 let values;
 if(chapter===0)values=[['Client A',step<1?'Request not sent':step<2?'Waiting for response':step<4?'Answer received · connection still open':'Answer received · connection closed'],['Client B',step<3?'Request not sent':step<5?'Connected · queued · no response':step<6?'Accepted · being handled':step<7?'Answer received · connection still open':'Answer received · connection closed']];
 if(chapter===1)values=[['Client A',step<1?'Request not sent':step<3?'Accepted · no response yet':step<7?'Answer received · child A still occupied':'Answer received · child A exited'],['Client B',step<4?'Request not sent':step<6?'Accepted while child A is busy':step<7?'Answer received · child B still occupied':'Answer received · child B exited']];
 if(chapter===2){const s=descriptorStage();values=step===0?[['Who can use A’s socket','Only the parent so far'],['Client A','Connected · not yet answered']]:[['References to A’s socket',`${refs()} open · ${s<1?'parent only':s>=5?(closeParent?'none remain':'parent remains'):s>=3&&closeParent?'child only':'parent and child'}`],['Client A',s<4?'No response yet':s<6?'Answer received · checking socket lifetime':closeParent?'Answer complete · connection ends':'Answer text received · still waiting for end']];}
 if(chapter===3)values=[['Children still running',step===0?`${load} handling requests`:'0 · all selected children exited'],['Uncollected exit records',step<1?'0 · no exits yet':`${step>=5?remaining():load} records · ${step>=5&&remaining()===0?'cleanup complete':'waiting for parent'}`]];
 $('#outcomes').innerHTML=values.map(([a,b])=>`<div class="outcome"><strong>${a}</strong>${b}</div>`).join('');
}
function renderLegend(){
 const common='<button class="term-door" data-door="place"><span class="sample"></span>A place</button>';
 const bits=chapter<2?'<button class="term-door" data-door="request"><span class="sample dot"></span>Request</button><button class="term-door" data-door="response"><span class="sample dot answer"></span>Response</button><button class="term-door" data-door="ring">Arc = occupied</button>':chapter===2?'<button class="term-door" data-door="descriptor">Solid line = can use this socket</button><button class="term-door" data-door="descriptor">× = closed socket / exited child</button>':'<button class="term-door" data-door="zombie">Held mark = exit record</button><button class="term-door" data-door="zombie">× = record collected</button><button class="term-door" data-door="ring">Arc = occupied</button>';
 $('.legend').innerHTML=common+bits+'<span>Underlined names explain more.</span>';
}
function renderNav(){
 $('#chapterNav').innerHTML=chapters.map((c,i)=>`<button class="chapter-tab" type="button" ${i===chapter?'aria-current="step"':''} aria-label="Idea ${i+1}: ${c.title}" data-chapter="${i}"><span class="num">0${i+1}${visited.has(i)?' · explored':''}</span><span class="label">${c.title}</span></button>`).join('');
 $('#chapterNav').querySelectorAll('button').forEach(b=>b.onclick=()=>selectChapter(+b.dataset.chapter));
 $('#sourceMap').innerHTML=chapters.map((_,i)=>`<i class="${i===chapter?'now':visited.has(i)?'done':''}"></i>`).join('');
}
function renderControls(){
 const el=$('#vizControls');el.innerHTML='';
 if(chapter===2&&step>=5){el.innerHTML=`<label class="toggle"><input id="closeParent" type="checkbox" ${closeParent?'checked':''}>Close the parent’s entry for A</label><p class="control-note">Same connection, one changed close. The effect appears at step 6 and stays visible through the end.</p>`;$('#closeParent').onchange=e=>{closeParent=e.target.checked;stop();render()}}
 if(chapter===3){el.innerHTML=`<div class="control"><label for="reapMode">After one notification</label><select id="reapMode"><option value="none">Collect none</option><option value="one">Collect one</option><option value="all">Collect all finished children</option></select></div><div class="control"><label for="load">Children exiting: <span id="loadValue">${load}</span></label><input id="load" type="range" min="1" max="8" value="${load}" aria-label="Number of children exiting"></div><p class="control-note">A possible merged-notification case, not a prediction of every run. Cleanup changes the drawing from step 6.</p>`;$('#reapMode').value=reapMode;$('#reapMode').onchange=e=>{reapMode=e.target.value;stop();render()};$('#load').oninput=e=>{load=+e.target.value;$('#loadValue').textContent=load;stop();render()}}
}
function renderCode(){
 let code,active;
 if(chapter===0){code=['while True:','    client, address = listener.accept()','    request = client.recv(1024)','    client.sendall(response)','    time.sleep(60)','    client.close()'];active=[0,1,3,4,5,1,3,5][step]}
 if(chapter===1){code=['client, address = listener.accept()','pid = os.fork()','if pid == 0:','    listener.close()','    client.recv(1024)','    client.sendall(response)','    time.sleep(60)','    client.close()','    os._exit(0)','else:','    client.close()  # parent loops to accept'];active=[0,0,1,5,0,1,5,8][step]}
 if(chapter===2){code=['client, address = listener.accept()','pid = os.fork()','if pid == 0:','    listener.close()','    client.recv(1024)','    client.sendall(response)','    client.close()','    os._exit(0)','else:',closeParent?'    client.close()':'    retained.append(client)  # keep the reference open'];active=[0,1,3,9,5,6,closeParent?6:9][descriptorStage()]}
 if(chapter===3){
  code=reapMode==='none'?['# No handler collects child exit statuses.','signal.signal(signal.SIGCHLD, signal.SIG_DFL)']:reapMode==='one'?['def collect(signum, frame):','    os.wait()  # collect just one child','','signal.signal(signal.SIGCHLD, collect)']:['def collect(signum, frame):','    while True:','        try:','            pid, status = os.waitpid(-1, os.WNOHANG)','        except ChildProcessError:  # no children left','            return','        if pid == 0:  # children exist, none ready','            return','','signal.signal(signal.SIGCHLD, collect)'];
  active=reapMode==='none'?0:reapMode==='one'?(step>=4?1:3):(step>=5?3:step>=4?1:9);
 }
 $('#codeCaption').textContent='Condensed Python excerpt for the selected case. Setup and error handling unrelated to this step are omitted; this is not a complete server.';
 $('#codeLens').innerHTML=code.map((l,i)=>`<span class="code-line${i===active?' on':''}">${esc(l)}</span>`).join('');
}
function renderCheckpoint(){
 const last=step===chapters[chapter].steps.length-1;$('#checkpoint').hidden=!last;if(!last)return;
 const [q,options,correct,yes,no]=checkpoints[chapter];$('#question').textContent=q;
 $('#answers').innerHTML=options.map((o,i)=>`<button class="secondary" type="button" aria-pressed="${answers.get(chapter)===i}" data-answer="${i}">${o}</button>`).join('');
 $('#answers').querySelectorAll('button').forEach(b=>b.onclick=()=>{answers.set(chapter,+b.dataset.answer);renderCheckpoint()});
 const selected=answers.get(chapter);$('#feedback').hidden=selected===undefined;$('#feedback').textContent=selected===undefined?'':selected===correct?yes:no;
}
function render(){
 const c=chapters[chapter], item=c.steps[step];
 if(step===c.steps.length-1)visited.add(chapter);
 $('#guideLabel').textContent=`Wink · Idea ${chapter+1} of 4 · Step ${step+1} of ${c.steps.length}`;
 $('#guideTitle').textContent=item[0];$('#narration').innerHTML=textAt();
 $('#chapterTitle').textContent=c.subtitle;$('#chapterSource').textContent=chapter===0||chapter===1?'Response arrival and connection closure are separate.':chapter===2?'Each solid line shows who can still use a socket.':'Locations persist so you can follow each child’s state.';
 $('#scrub').max=c.steps.length-1;$('#scrub').value=step;$('#scrub').setAttribute('aria-valuetext',`${step+1}: ${item[0]}`);
 $('#stepCount').textContent=`${step+1} / ${c.steps.length}`;$('#stepName').innerHTML=`<b>${item[0]}</b> · Drag to revisit any step.`;
 $('#next').textContent=item[2];$('#back').disabled=chapter===0&&step===0;
 $('#sourceBridge').textContent=`Part 3 · ${chapters[chapter].title}`;
 WINK.dataset.expression=step===c.steps.length-1?'delighted':step===0?'curious':'focused';
 if(chapter===2&&Boolean($('#closeParent'))!==(step>=5))renderControls();renderNav();renderDrawing();renderLegend();outcomes();renderCode();renderCheckpoint();bindDoors();updatePlay();
}
function readingDuration(){return Math.max(9000,textAt().replace(/<[^>]*>/g,'').split(/\s+/).length*330)}
function updatePlaybackStatus(){
 const seconds=Math.max(1,Math.ceil((readingDuration()-elapsed)/1000));
 const end=step===chapters[chapter].steps.length-1;
 const message=playing?`Playing · next step in ${seconds}s`:playbackStarted?`Paused · ${seconds}s remaining`:end?'Idea complete · continue below':'Ready · Play advances immediately';
 if($('#playbackStatus').textContent!==message)$('#playbackStatus').textContent=message;
}
function updatePlay(){
 if(transit){if(playing)transit.play();else transit.pause()}
 const name=playing?'Pause steps':playbackStarted?'Resume steps':step===chapters[chapter].steps.length-1?'Replay steps':'Play steps';
 $('#play').textContent=playing?'Ⅱ Pause':playbackStarted?'▶ Resume':name==='Replay steps'?'↻ Replay steps':'▶ Play steps';
 $('#play').setAttribute('aria-pressed',String(playing));$('#play').setAttribute('aria-label',name);updatePlaybackStatus();
}
function stop(){playing=false;playbackStarted=false;elapsed=0;updatePlay()}
function advancePlayback(){
 elapsed=0;step++;render();animateTransition();
 if(step===chapters[chapter].steps.length-1){playing=false;playbackStarted=false}
 updatePlay();
}
function revealGuide(){const heading=$('#guideTitle');heading.focus({preventScroll:true});if(heading.getBoundingClientRect().top<20)$('.guide-card').scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'})}
function selectChapter(i){stop();chapter=i;step=0;$('#complete').hidden=true;renderControls();render();revealGuide();}
function moveStep(s){stop();step=s;$('#complete').hidden=true;render()}
function advance(){stop();if(step<chapters[chapter].steps.length-1){step++;render();revealGuide()}else if(chapter<3){selectChapter(chapter+1);revealGuide()}else{$('#complete').hidden=false;$('#complete').focus();$('#complete').scrollIntoView({behavior:reduced?'instant':'smooth',block:'center'})}}
const doors={
 client:['Client','A client is a program that connects to a server. A browser is one example; the source uses the command-line client curl. A and B name separate clients so we can follow their requests.'],
 server:['One server process','A process is a running instance of a program. Here it calls accept(), handles a request, sleeps, closes that client connection, and repeats. While sleeping, this process cannot return to accept().'],
 parent:['Parent process','The original server process creates child processes with fork(). In the concurrent version, it accepts connections and creates children; the children handle requests. The operating system gives every process a numeric ID, or PID.'],
 child:['Child process','A child is a separate running process created by fork(). It gets copies of the parent’s file descriptors, referring to the same underlying open sockets. In this server, it handles one client and then exits.'],
 kernel:['Kernel and listen queue','The kernel is the part of the operating system that manages processes and network connections. listen(backlog) provides a queue for incoming connections; accept() takes one available connection from it. A connection can wait there while the server process is busy. A bigger backlog does not add workers.'],
 fork:['fork(): one call, two returns','On Unix, fork() creates a child process. Both continue after the call. The return value is zero in the child and the child’s PID in the parent; an if statement uses that difference to select each job. Their subsequent execution order depends on scheduling.'],
 listener:['Listening socket','This socket is the entrance for new connections. accept() returns a separate connected socket for each client. The parent keeps the listener; a child closes its inherited listener reference because it only handles its accepted client.'],
 socket:['A’s connected socket','The server uses this endpoint to exchange bytes with client A. After fork(), parent and child references point to this same underlying endpoint. The drawing counts only the server-side references in this example, not the client’s separate endpoint.'],
 descriptor:['An entry that points to a socket','Each process has a numbered list of open files and sockets. An entry points to the socket that process can use; this link is the reference shown by a line. Its number is a file descriptor. fork() gives the child its own entries pointing to the same sockets. close() removes one entry, so another process’s entry can still keep a socket open. The number 4 in this drawing is illustrative, not a captured descriptor.'],
 zombie:['Exited, recorded, collected','An exited child whose status has not been collected is called a zombie. It is no longer doing work. The parent collects its status with wait() or waitpid(). WNOHANG prevents waitpid() from blocking when a child is still running; no children left raises ChildProcessError in modern Python.'],
 signal:['SIGCHLD: a notice, not an exit counter','SIGCHLD reports a child state change. Several instances of an ordinary signal can merge while pending. This scene chooses that possible case: one pending notification for the selected exits. Real runs can deliver more notifications; the collection loop must work either way.'],
 place:['Circle: a place to follow','An outlined circle names a program, process, or socket. Read its label for its role. Empty child locations can stay on the page after exit so you can see which worker a collected record belonged to.'],
 request:['Request: the client’s ask','A request asks the server for something. In these examples each client asks for a page. A filled or held lavender mark identifies that request when it is being handled or waiting.'],
 response:['Response: the server’s answer','A green held mark means the client received an answer. The nearby text states this too. An answer can arrive before the connection closes, as it does in the article’s sleeping server.'],
 ring:['Arc: this process is occupied','An arc surrounds a process that is occupied with a client. In the sleeping-server experiment the answer has already been sent. The arc represents the artificial 60-second sleep, not ongoing computation or a measurement of elapsed time.'],
 trace:['Dashed line: what happened earlier','A dashed connection path remains after close to preserve the journey. In the fork scene, a labelled dashed diagonal records which parent created a child; it is not a network path.'],
 ancestry:['Parent–child history','The parent called fork() and created this child. The dashed diagonal shows that relationship. A’s and B’s response bytes travel directly between each child and its client, not through the parent.']
};
function bindDoors(){document.querySelectorAll('[data-door]').forEach(e=>{e.onclick=()=>{const d=doors[e.dataset.door];openModal(d[0],`<p>${d[1]}</p>`,'A little more context')};if(e.tagName.toLowerCase()==='text')e.onkeydown=k=>{if(k.key==='Enter'||k.key===' '){k.preventDefault();e.onclick()}}})}
function openModal(title,body,tier){modalReturn=document.activeElement;resumeAfterDoor=playing;playing=false;updatePlay();$('#modalTier').textContent=tier;$('#modalTitle').textContent=title;$('#modalBody').innerHTML=body;$('#scrim').hidden=false;$('.wrap').inert=true;document.body.style.overflow='hidden';$('#modalClose').focus()}
function closeModal(){if($('#scrim').hidden)return;$('#scrim').hidden=true;$('.wrap').inert=false;document.body.style.overflow='';playing=resumeAfterDoor;updatePlay();modalReturn?.focus()}
function source(){
 const notes=[
 'This follows the iterative server with its deliberate sleep after sendall(). Socket setup, IP addresses, ports, and terminal exercises are left out of the main line; they do not explain why B waits.',
 'This follows fork-per-connection on Unix. The drawing selects one valid schedule; concurrency does not promise that workers finish together. The parent closes its accepted socket reference after forking, and the child closes its inherited listener reference.',
 'This compares closing the parent’s descriptor with deliberately retaining it, as in the source’s leaking example. The scene isolates one connection. More retained connections would consume descriptors. Connection-end behavior here depends on the example’s lack of Content-Length or chunked framing; it is not a rule for every HTTP response.',
 'This isolates one possible merged SIGCHLD notification. No signal delivery count is measured here. Process-limit exhaustion is explained as a consequence, not demonstrated by creating hundreds of processes. The source’s EINTR failure used older Python; Python 3.5+ retries many interrupted system calls when the handler does not raise (PEP 475).'
 ];
 openModal('What this explanation is based on',`<p>${notes[chapter]}</p><p>The drawings are authored from citations. No live process IDs, timings, or captured bytes are claimed. Request names A and B and the reading pace are presentation choices.</p><p><a href="${D.source}" target="_blank" rel="noopener">Ruslan Spivak · Let’s Build a Web Server, Part 3</a></p><p><a href="https://docs.python.org/3/library/os.html#os.fork" target="_blank" rel="noopener">Python: fork, wait, and waitpid</a> · <a href="https://docs.python.org/3/library/socket.html#socket.socket.accept" target="_blank" rel="noopener">Python: sockets</a> · <a href="https://man7.org/linux/man-pages/man7/signal.7.html" target="_blank" rel="noopener">Standard signal coalescing</a> · <a href="https://peps.python.org/pep-0475/" target="_blank" rel="noopener">PEP 475</a></p>`,'Sources & scope');
}
$('#start').onclick=()=>{$('#briefing').hidden=true;$('#lesson').hidden=false;document.body.classList.add('started');$('#winkHost').append(WINK);renderControls();render();$('#guideTitle').focus()};
$('#next').onclick=advance;$('#back').onclick=()=>{if(step>0){moveStep(step-1);revealGuide()}else if(chapter>0){selectChapter(chapter-1);step=chapters[chapter].steps.length-1;render()}};
$('#scrub').oninput=e=>moveStep(+e.target.value);
$('#play').onclick=()=>{
 if(playing){playing=false;updatePlay();return}
 playing=true;previousTime=performance.now();
 if(!playbackStarted){
  playbackStarted=true;elapsed=0;
  if(step===chapters[chapter].steps.length-1){step=0;render()}
  else advancePlayback();
 }
 updatePlay();if(playing)revealGuide();
};
$('#restart').onclick=()=>{closeParent=false;reapMode='none';load=3;answers.clear();visited.clear();selectChapter(0);$('#guideTitle').focus();window.scrollTo({top:0,behavior:reduced?'instant':'smooth'})};
$('#codeDetails').ontoggle=()=>{if($('#codeDetails').open)stop()};
$('#sourceDoor').onclick=source;$('#modalClose').onclick=closeModal;$('#scrim').onclick=e=>{if(e.target===$('#scrim'))closeModal()};
document.addEventListener('keydown',e=>{if($('#scrim').hidden)return;if(e.key==='Escape')closeModal();if(e.key==='Tab'){const f=[...$('#scrim').querySelectorAll('button,a[href]')];if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===f.at(-1)){e.preventDefault();f[0].focus()}}});
document.addEventListener('visibilitychange',()=>{previousTime=0});
function tick(t){
 if(previousTime&&playing&&!document.hidden){elapsed+=t-previousTime;if(elapsed>=readingDuration())advancePlayback();else updatePlaybackStatus()}
 previousTime=t;requestAnimationFrame(tick);
}
// Wink repeats the current explanation on request, instead of being a decorative toy.
WINK.setAttribute('aria-label','Ask Wink to explain this step again');WINK.onclick=()=>{if($('#lesson').hidden)return;openModal(chapters[chapter].steps[step][0],`<p>${textAt().replace(/<button[^>]*>/g,'').replaceAll('</button>','')}</p>`,'Wink · Let’s go over that');bindDoors()};
requestAnimationFrame(tick);
