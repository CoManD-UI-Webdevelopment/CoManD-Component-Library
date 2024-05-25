<template>
    <div class="cmd-copyright-information" role="contentinfo">
        <a href="https://www.comand-cms.com" target="comand-website" lang="en" title="CoManD-Website">&copy; CoManD</a>
    </div>
</template>

<script>
export default {
    name: "CmdCopyrightWrapper"
}
</script>

<style>
/* begin cmd-copyright-information ---------------------------------------------------------------------------------------- */
.cmd-copyright-information {
    background: var(--dark-gray);
    border-top: var(--default-border-width) var(--default-border-style) var(--pure-white);
    text-align: center;
    padding: var(--default-padding);
    margin-top: auto;
    flex: none;

    a {
        text-decoration: none;
        color: var(--pure-white);

        &:hover, &:active, &:focus {
            text-decoration: underline;
            color: var(--pure-white);
        }
    }
}

/* end cmd-copyright-information ------------------------------------------------------------------------------------------ */
</style>