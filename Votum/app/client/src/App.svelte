<script>
  import Login from './Panels/Login.svelte';
  import VotingForm from './Panels/VotingForm.svelte';
  import Results from './Panels/Results.svelte';
  import { authenticated, finished } from './store.js';
  // $: console.log($authenticated);
  $: console.log($finished);
</script>

{#if $authenticated}
  {#if $finished}
    <Results />
  {:else}
    <VotingForm />
  {/if}
{:else}
  <Login />
{/if}
