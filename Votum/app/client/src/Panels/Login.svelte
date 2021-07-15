<script>
  import { fetchPOST } from '../utils.js';
  import { authenticated, username, token } from '../store.js';
  import Logo from '../Components/Logo.svelte';

  let message;

  async function login() {
    const json = await fetchPOST('/api/login', { token: $token });
    if (json.username) {
      console.log(json.username);
      $username = json.username;
      $authenticated = true;
    } else {
      $authenticated = false;
    }
    message = json.message;
  }

  function handleEnter(e) {
    if (e.key === 'Enter') login();
  }

  const url = new URLSearchParams(window.location.search);
  const urlToken = url.get('t');
  if (urlToken) {
    $token = urlToken;
    login();
  }
</script>

<div class="login">
  <Logo />
  <div class="container" on:keydown={handleEnter}>
    <input type="password" bind:value={$token} placeholder="Token" />
    <input type="submit" value="Zaloguj" on:click={login} />
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
  p {
    margin-top: 40px;
  }

  input {
    display: block;
    margin-top: 20px;
    min-width: 200px;
  }
</style>
