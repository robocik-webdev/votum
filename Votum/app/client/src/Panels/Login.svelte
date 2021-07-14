<script>
  import { fetchPOST } from '../utils.js';
  import { authenticated } from '../store.js';
  import Logo from '../Components/Logo.svelte';

  let token;
  let message;

  async function login(token) {
    console.log(token);
    const json = await fetchPOST('/api/login', { token: token });
    console.log(json);
    message = json.message;
  }

  function handleEnter(e) {
    if (e.key === 'Enter') login();
  }

  const url = new URLSearchParams(window.location.search);
  const urlToken = url.get('t');
  if (urlToken) {
    login(url.get('t'));
  }
</script>

<div class="login">
  <Logo />
  <div class="container" on:keydown={handleEnter}>
    <label>
      <input type="password" bind:value={token} placeholder="Token" />
    </label>
    <input
      type="submit"
      value="Zaloguj"
      on:click={() => {
        login(token);
      }}
    />
    {#if message}
      <p>{@html message}</p>
    {/if}
  </div>
</div>

<style>
  .login {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .container {
    margin-top: 20px;
  }
</style>
