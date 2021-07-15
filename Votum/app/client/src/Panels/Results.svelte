<script>
  import { fetchPOST } from '../utils.js';
  import { token } from '../store.js';
  import Logo from '../Components/Logo.svelte';
  import Loader from '../Components/Loader.svelte';

  async function getResults() {
    let results = await fetchPOST('/api/results', { token: $token });
    return results;
  }
  let awaitResults = getResults();

  function refresh() {
    awaitResults = getResults();
  }
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

  <div class="refresh">
    <input type="submit" value="Odśwież" on:click={refresh} />
  </div>
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
