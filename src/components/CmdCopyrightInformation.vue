<template>
    <!-- begin CmdCopyrightInformation ---------------------------------------------------------------------------------------- -->
    <div class="cmd-copyright-information" role="contentinfo">
        <a href="https://www.comand-ui.com" target="comand-ui-website" lang="en" title="CoManD-UI-Website">&copy; CoManD-UI</a>
    </div>
    <!-- end CmdCopyrightInformation ---------------------------------------------------------------------------------------- -->
</template>

<script>
export default {
    name: "CmdCopyrightWrapper"
}
</script>

<style>
/* begin cmd-copyright-information ---------------------------------------------------------------------------------------- */
.cmd-copyright-information {
    background: var(--color-dark-gray);
    border-top: var(--default-border-width) var(--default-border-style) var(--color-white);
    text-align: center;
    padding: var(--default-padding);
    margin-top: auto;
    flex: none;

    a {
        text-decoration: none;
        color: var(--color-white);

        &:hover, &:active, &:focus {
            text-decoration: underline;
            color: var(--color-white);
        }
    }
}

/* end cmd-copyright-information ------------------------------------------------------------------------------------------ */
</style>