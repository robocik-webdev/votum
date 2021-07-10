<script>
  import Logo from '../Components/Logo.svelte';
  import { fetchPOST } from '../utils.js';

  let username;
  let password;

  let message;

  async function login() {
    const json = await fetchPOST('/login', {
      username: username,
      password: password
    })
    message = json.message
  }

  function handleEnter(e) {
    if (e.key === 'Enter') login();
  }
</script>

<div class="login">
  <div class="logo">
    <Logo></Logo>
  </div>
  <h1 class="title">Spis ludności</h1>
  <div class="container" on:keydown={handleEnter}>
    <label>
      Nazwa użytkownika
      <input type="text" bind:value={username}>
    </label>
    <label>
      Hasło
      <input type="password" bind:value={password}>
    </label>
    <input type="submit" value="Zaloguj" on:click={login}>
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
  .logo {
    position: fixed;
    top: 10vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
