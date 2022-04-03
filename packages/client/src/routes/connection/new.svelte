
<script lang='ts'>
    import Header from '@imtala/svelte-components/components/header.svelte';
    import {connections} from '@imtala/svelte-components/store/connections'
    import { goto } from '$app/navigation';

    function handleSubmit(submitEvent) {
        connections.addLocalConnection({
            name: submitEvent.target.name.value,
            url: submitEvent.target.url.value,
            header: submitEvent.target.header.value,
            kind: 'remote',
            storage: 'localstorage'
        })

        goto(`/connection/${submitEvent.target.name.value}`)
    }

</script>

<Header />

<main>
    <form on:submit|preventDefault={handleSubmit}>
        <label for='name'>connection name</label>
        <input required name='name' type='text' placeholder="connection name"/>
        <label for='url'>Graphql endpoint url</label>
        <input required name='url' type='url' placeholder="https://"/>
        <label for='header'>(Optional) Authentication header</label>
        <input name='header' type='text' placeholder="Bearer xxxx"/>
        <input type='submit' value='+ save connection to local storage'>
    </form>
</main>

<style>
    form {
        display: flex;
        flex-direction: column;
        margin: auto;
        width: 50%;
    }
    input {
        padding: 1em;
        margin: 1em;
    }

    input:invalid {
        border-color: var(--pink-3);
    }

    input:valid {
        border-color: var(--lime-4);
    }

    label {

        /* padding: 1em; */
        margin: 1em 1em 0em 1em;
    }

    input[type=submit] {
        align-self: flex-end;
        width: 50%;
        cursor: pointer;
    }
</style>