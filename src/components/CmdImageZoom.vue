<template>
    <div class="cmd-image-zoom flex-container">
        <!-- begin small image -->
        <a href="#" class="flex-none thumbnail-imagezoom" :title="imageSmall.image.tooltip">
            <!-- begin CmdImage for small image -->
            <CmdImage v-bind="imageSmall" :figcaption="{}"
                @mouseover="onMouseOver"
                @mousemove="onMouseMove"
                @mouseout="onMouseOut"
            />
            <!-- end CmdImage for small image -->
            <div class="zoom-overlay"></div>
        </a>
        <!-- end small image -->

        <!-- begin large image -->
        <div class="zoom-container">
            <!-- begin CmdImage for large image -->
            <CmdImage v-bind="imageLarge" :useFigureTag="false" />
            <!-- end CmdImage for large image -->
        </div>

        <!-- end large image -->
    </div>
</template>

<script>
export default {
    name: "CmdImageZoom",
    props: {
        /**
         * url for small images
         */
        imageSmall: {
            type: Object,
            required: true
        },
        /**
         * url for large image
         */
        imageLarge: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            showLargeImage: false
        }
    },
    methods: {
        onMouseOver(e) {
            this.showLargeImage = true
            this.$nextTick(() => {
                const zoomContainerHeight = window.innerHeight - this.$el.getBoundingClientRect().y - 10
                const zoomContainer = this.$el.querySelector('.zoom-container')
                zoomContainer.style.height = `${zoomContainerHeight}px`
                positionOverlay(this, e)
            })
        },
        onMouseMove(e) {
            positionOverlay(this, e)
        },
        onMouseOut() {
            this.showLargeImage = false
        }
    }
}

function positionOverlay(vm, e) {
    const largeImageContainer = vm.$el.querySelector('.zoom-container')
    const largeImage = largeImageContainer.querySelector('img')
    const zoomOverlay = vm.$el.querySelector('.zoom-overlay')

    const smallImageWidth = e.target.getBoundingClientRect().width
    const smallImageHeight = e.target.getBoundingClientRect().height

    const largeImageWidth = largeImage.getBoundingClientRect().width
    const largeImageHeight = largeImage.getBoundingClientRect().height

    const mouseX = e.pageX - e.target.getBoundingClientRect().x - window.scrollX
    const mouseY = e.pageY - e.target.getBoundingClientRect().y - window.scrollY

    const overlayWidth = Math.min(smallImageWidth, largeImageContainer.getBoundingClientRect().width / largeImageWidth * smallImageWidth)
    const overlayHeight = Math.min(smallImageHeight, largeImageContainer.getBoundingClientRect().height / largeImageHeight * smallImageHeight)

    const overlayX = clamp(mouseX - overlayWidth / 2, 0, smallImageWidth - overlayWidth)
    const overlayY = clamp(mouseY - overlayHeight / 2, 0, smallImageHeight - overlayHeight)

    const largeImageMarginLeft = -(overlayX * (largeImageWidth / smallImageWidth))
    const largeImageMarginTop = -(overlayY * (largeImageHeight / smallImageHeight))

    zoomOverlay.style.left = `${overlayX}px`
    zoomOverlay.style.top = `${overlayY}px`
    zoomOverlay.style.width = `${overlayWidth}px`
    zoomOverlay.style.height = `${overlayHeight}px`
    zoomOverlay.style.display = 'block'

    largeImage.style.marginLeft = `${largeImageMarginLeft}px`
    largeImage.style.marginTop = `${largeImageMarginTop}px`
}

function clamp(value, min, max) {
    if (value < min) {
        return min
    }
    if (value > max) {
        return max
    }
    return value
}
</script>

<style>
/* begin cmd-imagezoom ---------------------------------------------------------------------------------------- */
.cmd-image-zoom {
    overflow: hidden;

    .thumbnail-imagezoom {
        align-self: flex-start;
    }

    .zoom-container {
        overflow: hidden;

        > img {
            max-width: none;
            max-height: none;
        }
    }

    .zoom-overlay {
        position: absolute;
        display: none;
        pointer-events: none;
        background: var(--primary-color);
        opacity: var(--reduced-opacity);
    }
}

</style>

<style lang="scss">
@import '../assets/styles/variables';

@media only screen and (max-width: $small-max-width) {
    .cmd-image-zoom {
        .thumbnail-imagezoom {
            align-self: center;
        }

        .zoom-container {
            max-height: 40vh;
            flex: none;

            > img {
                max-height: none;
            }
        }
    }
}
/* end cmd-imagezoom ------------------------------------------------------------------------------------------ */
</style>
