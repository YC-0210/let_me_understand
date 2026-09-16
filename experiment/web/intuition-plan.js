/* Teaching-only alternative. The baseline supplies the exact scene sequence and focuses. */
window.OriginalIntuitionPlan = window.IntuitionPlan;
window.EducatorTeaching = new URLSearchParams(location.search).get('teaching') !== 'original';
if (window.EducatorTeaching) {
  const lessons = [
    {
      title:'What must stay the same?', map:'Keep the promise', recall:'A browser asks. The server returns an answer.',
      question:'Part 3 changes how work is shared. What should the browser still receive?', patterns:['CS03','CS02'],
      takeaway:'Keep the request–response promise while changing who does the work.',
      beats:[
        ['Follow one request.', 'Browser A sends an HTTP request. The plug is the server’s endpoint of that connection: its socket.', 'Start with the complete job rather than the implementation. A socket is an endpoint, not the request itself.'],
        ['Who makes the answer?', 'The application makes the answer. WSGI is the calling agreement between server and application that Part 2 introduced.', 'The code symbol marks the application. WSGI runs inside the program; it is not another trip across the network.'],
        ['Keep this promise.', 'An HTTP response returns to A. Whatever we change next, the server must still complete this exchange.', 'Changing the process structure does not require changing the browser’s request–response contract.']
      ]
    },
    {
      title:'Why does B have to wait?', map:'Free the parent', recall:'One visitor is easy. A second reveals the bottleneck.',
      question:'A keeps the only handler busy. What must change so B can be accepted?', patterns:['CS01','CS02','CS03'],
      takeaway:'Delegate A’s handling so the parent can return to accepting visitors.',
      beats:[
        ['Change only the work arrangement.', 'We now use Part 3’s fixed reply. The application disappears from this view; the browser’s exchange stays the same.', 'The article deliberately simplifies response generation. In a combined Part 2/3 server, the child would call the WSGI application.'],
        ['Would a longer queue help?', 'A occupies the only handler. B waits at the listening socket, the doorway for new connections.', 'The bottleneck is who can do work, not merely how many visitors can wait.'],
        ['Make a second running program.', 'fork creates a child process. Parent and child can now continue separately; the terminal labels distinguish them.', 'A process is a running program. Concurrency permits progress on overlapping work; this picture does not promise simultaneous CPU execution.'],
        ['Assign each process a job.', 'The child handles A. The parent returns to accepting visitors. But creating the child also copied access to sockets.', 'The division of responsibility creates the next problem: each process must release access it no longer needs.']
      ],
      check:{beat:1,prompt:'Suppose we only enlarge the waiting queue. Can the busy handler accept B sooner?',answer:'No. The queue can hold more waiting connections, but A still occupies the only handler. Delegating A frees the parent to accept B.'}
    },
    {
      title:'What did fork actually copy?', map:'Count the handles', recall:'Two handles can reach the same socket.',
      question:'If the parent closes its copy, what access does the child still have?', patterns:['CS04','CS05'],
      takeaway:'A reply arriving and a connection ending are different events.',
      beats:[
        ['Rewind to just after fork.', 'Two keys reach one plug. Each key means one process’s handle to A’s socket; it does not mean encryption.', 'A file descriptor is a numbered handle in a process. Fork duplicates descriptor access to the same underlying socket, not an independent connection.'],
        ['Remove only the parent’s access.', 'The parent closes its handle. The child’s handle still reaches the same socket, so A’s connection remains open.', 'The child also closes its inherited listening handle. This diagram expands only the accepted connection’s handles.'],
        ['The reply is here. Is A finished?', 'The response has reached A, but the child still holds a handle. This example uses connection closure to mark the end.', 'HTTP does not always use connection closure to delimit a response. The article’s particular response does; reply and EOF must remain separate ideas.'],
        ['Now release the last handle.', 'The child closes its handle. With no handles left in this example, the connection can end.', 'Counterexample: if the parent kept its handle, the child’s close alone would not release all access.']
      ],
      check:{beat:2,prompt:'Imagine the parent had kept its handle. Would the child’s later close be enough?',answer:'No. The parent would still hold access to the same socket. In this close-based example, A could keep waiting for the connection to end.'}
    },
    {
      title:'What can outlive finished work?', map:'Collect the status', recall:'Closing socket access does not collect a child’s exit status.',
      question:'When the child stops running, what must the parent still learn?', patterns:['CS04','CS02'],
      takeaway:'An exited child can leave status behind without still executing.',
      beats:[
        ['One responsibility is complete.', 'A’s connection has ended. The child process still needs to exit; socket cleanup and process cleanup are separate.', 'Do not read this as a mandatory global execution order. We separate these events to examine their different effects.'],
        ['Running ends. Status remains.', 'The child exits. The operating system retains its exit status, shown as a small sheet.', 'The sheet is a metaphor for retained process information. It is not a file, a response, or another running worker.'],
        ['Name the leftover, not a new worker.', 'An exited child whose status is not collected is a zombie. Repeated exits can leave several retained records.', 'The extra sheets summarize additional child exits; they are not three results from Child A.'],
        ['Complete the second responsibility.', 'The parent uses waitpid to collect an exit status. This removes the retained record; it does not close A’s connection.', 'Collecting a child’s status is called reaping. It answers what happened to the child, independently of socket ownership.']
      ]
    },
    {
      title:'Does one bell mean one result?', map:'Check what is ready', recall:'A notification says to check. The records say what happened.',
      question:'How can the parent collect every ready status and still stay available?', patterns:['CS05','CS06'],
      takeaway:'On notification, check for ready results until none remain; do not wait for running children.',
      beats:[
        ['A bell asks the parent to check.', 'SIGCHLD is a notification about child status. The bell draws attention; the sheet holds the result.', 'For this lesson we focus on exits. The notification is not itself the stored exit status.'],
        ['Test the one-bell, one-result rule.', 'Several exits can share one pending notification. Three ready records are shown; collecting just one would leave two.', 'Standard signals can coalesce. Count available results by checking child status, not by counting notifications.'],
        ['Drain ready results. Then return.', 'Collect all currently ready statuses with nonblocking waitpid. Stop when none are ready, so running children do not hold up the parent.', 'WNOHANG makes the check nonblocking. A loop reaps ready children and returns to accepting; exact return cases belong in the article.']
      ],
      check:{beat:1,prompt:'One notification, three ready statuses. What should determine how many times we collect?',answer:'The available statuses, not the bell count. Keep checking nonblockingly until no ready child status remains; then return to serving.'}
    },
    {
      title:'Can you explain the whole server?', map:'Explain it back', recall:'Share the work. Release access. Collect status. Keep serving.',
      question:'Follow A, then use the same rules to explain what could go wrong for B.', patterns:['CS03','CS06'],
      takeaway:'Ask who is working, who has access, and what status remains.',
      beats:[
        ['Who can accept the next visitor?', 'The parent accepts A and creates a child. While the child handles A, the parent can accept B.', 'This replay reconnects the lifecycle. It illustrates responsibilities, not one guaranteed scheduling order.'],
        ['Who still has access?', 'The parent releases its copy. The child replies and releases its own. A’s connection can now end.', 'The same socket-access rule explains both normal completion and the retained-parent-handle bug.'],
        ['What remains after work stops?', 'The child exits. A notification prompts the parent to check and collect its status, then continue accepting.', 'The same ready-status rule also covers several exits sharing one notification.'],
        ['Explain it without the API names.', 'Who does the work? Who still has socket access? Which exit statuses remain? Use these three questions when reading the code.', 'Try the explanation yourself, then open the optional check. The article supplies setup, fork return values, descriptor limits, waitpid cases, and EINTR handling.']
      ],
      check:{beat:3,prompt:'A has its reply but waits for the end. Elsewhere, exited children accumulate. Explain the two independent fixes.',answer:'Release every unneeded handle to A’s socket so this close-based response can finish. Separately, reap all ready child statuses with nonblocking waitpid. Doing one does not do the other.'}
    }
  ];
  window.IntuitionPlan = window.OriginalIntuitionPlan.map((base,i)=>{
    const lesson=lessons[i];
    return {...base,...lesson,beats:base.beats.map((beat,j)=>({...beat,title:lesson.beats[j][0],cue:lesson.beats[j][1],explain:lesson.beats[j][2]}))};
  });
}
