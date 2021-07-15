<script>
  import { fetchPOST } from '../utils.js';
  import { username, token } from '../store.js';
  import Logo from '../Components/Logo.svelte';
  import Loader from '../Components/Loader.svelte';

  let response = [];
  $: console.log(response);

  async function getQuestions() {
    const json = await fetchPOST('/api/questions', { token: $token });
    json.forEach(question => {
      response.push({ id: question.id, answers: [], limit_passed: false });
    });
    console.log(json);
    return json;
  }
  let awaitQuestions = getQuestions();

  async function send() {
    console.log('heehee');
  }
</script>

<div class="wrapper">
  <Logo />
  <p class="pseudonym">Przykrywka:</p>
  <h1>{$username}</h1>

  {#await awaitQuestions}
    <p><Loader /> Pobieram pytania</p>
  {:then questions}
    <form>
      {#each questions as question}
        <h3>{question.content}</h3>
        {#if question.possible_answers > 1}
          <p class="limit" class:error={response[question.id - 1].limit_passed}>
            Max: <b>{question.possible_answers}</b>
          </p>
        {/if}

        {#each question.answers as answer}
          {#if question.possible_answers > 1}
            <label>
              <input
                type="checkbox"
                name={question.content}
                value={answer.id}
                bind:group={response[question.id - 1].answers}
                on:change={() => {
                  let q = response[question.id - 1];
                  q.limit_passed = q.answers.length > question.possible_answers;
                  response = response;
                }}
              />
              {@html answer.content}
            </label>
          {:else}
            <label>
              <input
                type="radio"
                name={question.content}
                value={answer.id}
                bind:group={response[question.id - 1].answers}
              />
              {@html answer.content}
            </label>
          {/if}
        {/each}
      {/each}
      <input type="submit" value="Wyślij" on:click={send} />
    </form>
  {:catch error}
    <p class="error">Coś poszło nie tak...<br />{error}</p>
  {/await}
</div>

<style>
  .wrapper {
    padding: 40px 20px;
  }

  .pseudonym {
    margin: 0;
    margin-top: 40px;
  }

  h3 {
    margin: 40px 0 20px 0;
  }
  label {
    display: block;
    margin-bottom: 10px;
  }
  .limit {
    margin: 0 0 20px 0;
  }
  input[type='submit'] {
    margin-top: 35px;
  }

  .error {
    font-weight: bold;
  }
</style>
