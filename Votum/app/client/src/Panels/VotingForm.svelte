<script>
  import { slide } from 'svelte/transition';
  import { fetchPOST } from '../utils.js';
  import { username, token, finished } from '../store.js';
  import Logo from '../Components/Logo.svelte';
  import Loader from '../Components/Loader.svelte';

  let questions_answers = [];

  async function getQuestions() {
    let questions = await fetchPOST('/api/questions', { token: $token });
    questions.forEach(question => {
      question['limit_reached'] = false;
      question.answers.forEach(answer => {
        answer['checked'] = false;
      });
      questions_answers.push({ id: question.id, answers: [] });
    });
    console.log(questions);
    $finished = questions.length == 0;
    return questions;
  }
  let awaitQuestions = getQuestions();

  async function send() {
    let data = {
      token: $token,
      questions: [],
    };
    questions_answers.forEach(question => {
      let answers = { id: question.id, answers: [] };
      let type = typeof question.answers;
      if (type == 'object') {
        question.answers.forEach(answer_id => {
          answers.answers.push({ id: answer_id });
        });
      } else if (type == 'number') {
        answers.answers.push({ id: question.answers });
      }
      data.questions.push(answers);
    });
    console.log(data);
    let res = await fetchPOST('/api/answer', data);
    console.log(res);
    refresh();
  }

  async function refresh() {
    awaitQuestions = getQuestions();
  }
</script>

<div class="wrapper">
  <Logo />

  <div class="pseudonym">
    <p>Przykrywka:</p>
    <h1>{$username}</h1>
  </div>

  {#await awaitQuestions}
    <p><Loader /> Pobieram pytania</p>
  {:then questions}
    <form class="questions">
      {#each questions as question}
        <div class="question">
          <h3>{question.content}</h3>

          {#each question.answers as answer}
            {#if question.possible_answers > 1}
              <label>
                <input
                  type="checkbox"
                  name={question.content}
                  value={answer.id}
                  disabled={question.limit_reached && !answer.checked}
                  bind:group={questions_answers[question.id - 1].answers}
                  on:change={event => {
                    let len = questions_answers[question.id - 1].answers.length;
                    question.limit_reached = len == question.possible_answers;
                    answer.checked = event.target.checked;
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
                  bind:group={questions_answers[question.id - 1].answers}
                />
                {@html answer.content}
              </label>
            {/if}
          {/each}

          {#if question.possible_answers > 1 && question.limit_reached}
            <p class="limit" transition:slide><b>Osiągnięto limit</b></p>
          {/if}
        </div>
      {/each}
    </form>
  {:catch error}
    <p class="error">Coś poszło nie tak...<br />{error}</p>
  {/await}

  <div class="submit">
    <input type="submit" value="Wyślij" on:click={send} />
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

  .pseudonym {
    display: flex;
    flex-flow: column;
    align-items: center;
    margin-top: 40px;
  }
  .pseudonym p {
    margin: 0;
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
  label {
    display: block;
    margin-bottom: 10px;
  }
  .limit {
    color: var(--accent) !important;
    margin: 20px 0 20px 0;
  }

  .submit {
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
