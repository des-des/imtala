<script lang="ts">
    let newConnections = []

    function handleAddConnection() {
        newConnections = newConnections.concat({})
    }
</script>

<h2>Your connections</h2>

<button on:click={handleAddConnection}>Add a new connection</button>

{#each newConnections as newConnection}
<h3>new!</h3>
<
{/each}
