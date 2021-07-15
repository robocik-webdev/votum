<script>
  import Login from './Panels/Login.svelte';
  import VotingForm from './Panels/VotingForm.svelte';
  import { authenticated } from './store.js';
  $: console.log($authenticated);
</script>

{#if $authenticated}
  <VotingForm />
{:else}
  <Login />
{/if}
