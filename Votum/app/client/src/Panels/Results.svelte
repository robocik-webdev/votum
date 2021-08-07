<script>
  import { onDestroy, onMount } from 'svelte';
  import { fetchPOST } from '../utils.js';
  import { token } from '../store.js';
  import Logo from '../Components/Logo.svelte';
  import Loader from '../Components/Loader.svelte';

  const DDOSTime = 5; // seconds
  let DDOSTimeout = 0;

  let showRefresh = true;

  async function getResults() {
    let results = await fetchPOST('/api/results', { token: $token });
    if (results.length && interval) {
      clearInterval(interval);
      showRefresh = false;
    }
    return results;
  }
  let awaitResults = getResults();

  function refresh() {
    console.log('refresh');
    awaitResults = getResults();
    DDOSTimeout = DDOSTime;
    for (let i = 0; i < DDOSTime; i++) {
      setTimeout(() => {
        DDOSTimeout--;
      }, i * 1000);
    }
  }

  const time = 30; // seconds
  let interval;
  onMount(() => {
    interval = setInterval(refresh, time * 1000);
  });
  onDestroy(() => {
    clearInterval(interval);
    interval == false;
  });
</script>

<div class="wrapper">
  <Logo />

  {#await awaitResults}
    <p class="questions"><Loader /> Pobieram wyniki</p>
  {:then results}
    {#if results.length}
      <form class="questions">
        {#each results as result}
          <div class="question">
            <h3>{result.question}</h3>
            {#each result.answers as answer}
              <p><b>{answer.count}</b>&nbsp;&nbsp; {answer.answer}</p>
            {/each}
          </div>
        {/each}
      </form>
    {:else}
      <p>Wyniki nie są jeszcze dostępne.</p>
      <p>Kiedy będą dostępne strona odświeży się automatycznie.</p>
    {/if}
  {:catch error}
    <p class="error">Coś poszło nie tak...<br />{error}</p>
  {/await}

  {#if showRefresh}
    <div class="refresh">
      <input
        type="submit"
        value={DDOSTimeout == 0 ? 'Odśwież' : `DDOS Shield (${DDOSTimeout})`}
        on:click={refresh}
        disabled={DDOSTimeout > 0}
      />
    </div>
  {/if}
</div>

<style>
  .wrapper {
    display: flex;
    flex-flow: column;
    justify-content: center;
    margin: 0 auto;
    padding: 60px 20px;
    min-height: 100vh;
  }

  .questions {
    margin-top: 60px;
  }
  .question {
    margin: 20px;
    margin-top: 40px;
  }

  h3 {
    margin-bottom: 20px;
  }

  .refresh {
    display: flex;
    justify-content: center;
  }
  input[type='submit'] {
    margin-top: 35px;
  }
  input[disabled] {
    background-color: var(--grey);
    border-color: var(--grey);
  }

  @media (min-width: 505px) {
    .wrapper {
      margin: 0 auto;
      padding: 80px 20px;
    }

    .questions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  }
</style>
