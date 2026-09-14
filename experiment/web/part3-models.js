/* Lesson adapters turn recorded facts and explicit stages into library inputs. */
window.Part3Models = (() => {
  const actor=(label,title,detail,active=false)=>({label,title,detail,active});
  function stage(scene,n,E) {
    const ep=E.endpoints, ids=E.ownership;
    const cases={
      network:{actors:[actor('CLIENT','Browser',n?'Socket ready':'Wants a page',n>0),actor('SERVER','Server program',n?'Socket ready':'Can answer the request',n>0)],history:['A browser needs a reply from the server.','Both programs create communication endpoints.','TCP carries bytes; HTTP gives the request and reply their format.']},
      setup:{actors:[actor('SERVER','Listening socket',['Created','Reuse option set','Address assigned','Listening'][n],true),actor('KERNEL','Network manager',n===3?'Can hold incoming connections':'Manages addresses and sockets')],history:['Create a TCP socket.','Set the optional address-reuse behavior.','Bind to 127.0.0.1:8888.','Listen for incoming connections.']},
      endpoints:{actors:[actor('CLIENT A',n?ep[0].client.join(':'):'Temporary port not chosen yet',n?'Local endpoint selected by the kernel':'Calls connect(server address)',true),actor('SERVER',ep[0].server.join(':'),'Same server address for both conversations'),...(n===2?[actor('CLIENT B',ep[1].client.join(':'),'A different local port identifies this conversation.',true)]:[])],history:['A calls connect with the server address.',`${ep[0].client.join(':')} ↔ ${ep[0].server.join(':')}`,`${ep[1].client.join(':')} ↔ ${ep[1].server.join(':')}`]},
      accept:{actors:[actor('LISTENER','Welcomes new connections',n?'Still open':'B is queued here'),actor('CONNECTED SOCKET',n?'Conversation with B':'Not yet returned to the program',n===2?'Read request bytes':n===3?'Send response, then close':'Separate from the listener',n>0)],history:['Client B connects and waits in the kernel queue.','accept returns a connected socket for B.','recv reads bytes on that connected socket.','sendall replies on that socket; close releases it.']},
      process:{actors:[actor('PARENT',`PID ${ids.parent_pid}`,'One running instance',true),...(n?[actor('CHILD',`PID ${ids.child.pid}`,n===2?`PPID ${ids.child.ppid}`:'A separate running instance',true)]:[])],history:['The kernel assigns a process ID.','Another instance has another process ID.','The child records the parent’s ID as its PPID.']},
      fork:{actors:[actor('PARENT',`PID ${ids.parent_pid}`,n?`fork returned ${ids.parent_fork_return}`:'About to call fork()',true),...(n?[actor('CHILD',`PID ${ids.child.pid}`,'fork returned 0',true)]:[])],history:['One process reaches fork().','Two processes resume after the same call.','Parent loops to accept; child takes the request branch.']},
      interrupted:{actors:[actor('PARENT','Waiting in accept',['No new visitor yet','Handler collecting child status','EINTR reaches old application code'][n],true),actor('CHILD',n?'Exited':'Finishing a request',n?'SIGCHLD notification sent':'Will finish independently')],history:['accept is blocked.','SIGCHLD runs the handler.','Historical accept call reports interruption.']},
      retry:{actors:[actor('HISTORICAL PYTHON','Explicit retry','Catch EINTR; loop back to accept.',n===0),actor('MODERN PYTHON',`Python ${E.accept_retry.python}`,n===2?'Recorded: handler ran, connection accepted.':'Returning handler → automatic retry.',n>0)],history:['Retry the interrupted call, not an unrelated error.','Python 3.5+ performs this socket retry internally.','The local probe accepted the later client without an EINTR exception.']},
      lifecycle:{actors:[actor('PARENT','Accept and supervise',n===0?'Accept one connection':n===1?'Fork, close connected handle, accept again':n===4?'Reap ready child records':'Available for other requests',n<2||n===4),actor('CHILD',n<1?'Not created yet':'Serve this request',n<2?'Waiting for its branch':n===2?'Close listener; receive and send':n===3?'Close connection; exit':'Exit result collected',n===2||n===3)],history:['Accept.','Fork and release the parent’s connected handle.','Child handles request using its connected socket.','Child closes connection and exits.','Parent drains ready child records.']},
      code:{actors:[actor('CODE RESPONSIBILITY',['Listen for child exits','Separate the branches','Keep the parent available','Finish this child’s request','Collect every ready result'][n],['signal.signal(SIGCHLD, reap_children)','child_pid = os.fork()','connection.close() in the parent','with connection: handle_request(connection)','os.waitpid(-1, os.WNOHANG) in a loop'][n],true)],history:['Install the handler.','Accept and fork.','Parent releases its handle.','Child replies, closes, exits.','Handler drains ready results.']}
    };
    const result=cases[scene];
    if(!result)throw Error(`No stage model for ${scene}`);
    return {actors:result.actors,history:result.history.slice(0,n+1)};
  }
  function ownership(scene,n) {
    const entry=(label,target,open=true)=>({label,target,open});
    let parentL=true,parentC=true,childL=true,childC=true,child=true;
    if(scene==='descriptors') {child=false;parentL=n>=1;parentC=n>=2;}
    if(scene==='shared')child=n>=1;
    if(scene==='close-copies'){parentC=n<1;childL=n<2;childC=n<3;}
    if(scene==='missing-close'){childL=n<1;childC=n<1;parentC=n<3;}
    const entries=(l,c)=>[entry('3','Listening socket',l),entry('4','Connection A',c)];
    let parentEntries=entries(parentL,parentC);
    if(scene==='descriptors')parentEntries=[entry('0','Input'),entry('1','Normal output'),entry('2','Error output'),...(n>=1?[entry('3','Listening socket')]:[]),...(n>=2?[entry('4','Connection A')]:[])];
    const owners=[{title:'Parent process',entries:parentEntries},...(child?[{title:'Child process',inactive:scene==='missing-close'&&n>=1,subtitle:scene==='missing-close'&&n>=1?'Exited; its handles are closed':'Its own copy of the handle list',entries:entries(childL,childC)}]:[])];
    const lc=Number(parentL)+Number(child&&childL),cc=Number(parentC)+Number(child&&childC);
    const resources=[...(scene==='descriptors'&&n===0?[]:[{title:'Listening socket',count:lc,detail:lc?'Available through the open handles above.':'No server handle remains.'}]),...(scene==='descriptors'&&n<2?[]:[{title:'Connection A',count:cc,detail:cc?'One connection, reachable through these handles.':'No server handle remains; the client can receive EOF after the response bytes.'}])];
    if(['shared','missing-close'].includes(scene)){for(const owner of owners)owner.entries=owner.entries.filter(x=>x.target==='Connection A');return {owners,resources:resources.filter(r=>r.title==='Connection A')};}
    return {owners,resources};
  }
  function records(scene,n,E) {
    const ids=E.burst.children;let count=['zombie','burst','drain'].includes(scene)?3:1;
    let states=Array(count).fill('running'),notice={label:'Parent activity',value:'Available'},result='';
    if(scene==='exit-record'){states=[n?'ready':'running'];result=n?'Exit result retained for the parent.':'Child is still running.';}
    if(scene==='zombie'){states=Array(3).fill(n===2?'collected':'ready');result=n===2?'All statuses collected: records removed.':'Recorded ps state: Z for all three exited children.';}
    if(scene==='wait'){states=[n===2?'collected':'running'];notice.value=n===1?'Blocked in wait':n===2?'Wait returned':'Available';result=n===1?'No exit status yet. The parent is not accepting new clients.':n===2?'A child PID and exit status were collected.':'The child has not exited.';}
    if(scene==='signal'){states=[n===2?'collected':n===1?'ready':'running'];notice={label:'SIGCHLD notification',value:n?'1':'0'};result=n===2?'Handler collected a ready status and returned.':n===1?'Notification prompts a check of the child records.':'Parent can accept while the child works.';}
    if(scene==='burst'){states=Array(3).fill(n?'ready':'running');if(n===2)states[0]='collected';notice={label:n===2?'Delivered SIGCHLD notifications':'Pending SIGCHLD indication',value:n?'1':'0'};result=n===2?'One wait collected one result. Two finished records remain.':n===1?'Three separate exit records; one pending notification.':'Controlled probe: temporarily block notification delivery.';}
    if(scene==='drain'){const order=[E.burst.first.pid,...E.burst.drained.map(r=>r.pid)];states=ids.map(pid=>order.slice(0,Math.min(n,3)).includes(pid)?'collected':'ready');notice={label:'Delivered SIGCHLD notifications',value:'1'};result=n===4?'ChildProcessError / ECHILD → end this pass.':n?`Collected ${Math.min(n,3)} of 3 ready results.`:'Check the child records, not a notification count.';}
    if(scene==='not-ready'){states=[n===2?'collected':'running'];notice={label:'Nonblocking check',value:n===1?'PID 0':n===2?'Child PID returned':'Ready to check'};result=n===1?'No finished result: stop this pass without waiting.':n===2?'After the child exits, its status can be collected.':'A living child is not a ready exit result.';}
    const records=states.map((state,i)=>({label:count===3?`Child ${i+1} · PID ${ids[i]}`:'One child',state,title:state==='running'?'Still running':state==='ready'?'Exited · uncollected':'Status collected',detail:state==='running'?'No exit result ready':state==='ready'?'Code has stopped; record remains':'Record removed; position retained for comparison'}));
    return {records,notice,result};
  }
  return {stage,ownership,records};
})();
