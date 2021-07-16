<script>
  let show = false;
</script>

<p
  class="authors"
  on:mouseenter={() => {
    show = true;
  }}
  on:mouseleave={() => {
    show = false;
  }}
>
  {#if show}
    <a href="mailto:robocik.webdev@gmail.com">robocik.webdev@gmail.com</a>
  {:else}
    kontakt
  {/if}
</p>

<style>
  .authors {
    cursor: pointer;
    display: flex;
    justify-content: center;
    margin: 20px 0;
    opacity: 0.5;
  }
  a {
    color: var(--text);
  }
</style>
