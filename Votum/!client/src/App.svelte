<script>
  import { io } from 'socket.io-client';
  import { onMount } from 'svelte';

  let socket;
  onMount(() => {
    socket = io('http://robocik-devtest.ddns.net:8000/', {
      auth: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6WyJhZG1pbjEiXSwibmFtZSI6Ik1pa2_FgmFqIiwic3VybmFtZSI6IkthxbptaWVyY3phayIsImlkIjoxLCJpYXQiOjE2NTE0MzExNTcsImV4cCI6MTY1MTUxNzU1N30.wXxAfW8aKMysWfPFHilYtiw9n77ctb4WB1SQTTXW9x8'
      }
    });
  });

  $: socket?.on('connect', () => {
    console.log('connection status: ' + socket.connected);
    console.log('connection id: ' + socket.id);
  });

  $: socket?.on('adminUsers', data => {
    console.log(data.data.users);
  });

  $: socket?.on('adminQuestions', data => {
    console.log(data.data.questions);
  });
</script>

<main>
  <button on:click={() => socket?.emit('adminUsers')}>Users</button>
  <button on:click={() => socket?.emit('adminQuestions')}>Questions</button>
  <button
    on:click={() =>
      socket?.emit('adminAddUser', {
        name: 'Adrian',
        surname: 'Dacko',
        email: 'adacko@gmail.com',
        rightToVote: true,
        admin: true
      })}>Add user</button
  >
  <button on:click={() => socket?.emit('adminRemoveUser', { id: 8 })}
    >Remove user</button
  >
  <button
    on:click={() =>
      socket?.emit('adminAddQuestion', {
        title: 'Granie czy sranie?',
        possibleAnswers: 3,
        showAnswers: true,
        openTime: '2022-04-10 22:00:20',
        closeTime: '2022-04-10 22:15:25'
      })}>Add question</button
  >
  <button on:click={() => socket?.emit('adminRemoveQuestion', { id: 6 })}
    >Remove question</button
  >
</main>

<style>
  main {
    color: red;
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
</style>
