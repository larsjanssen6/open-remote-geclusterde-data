<template>
    <div>
        <button
            @click="toggle"
            class="bg-default-100 hover:bg-blue-400 text-black font-bold py-2 px-2 border-b-4 border-blue-700 hover:border-blue-500 rounded w-40 cursor-pointer"
        >
            <slot name="icon"></slot>
            {{ buttonText }}
        </button>
        <div v-show="active" ref="dropdown" class="z-50">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import Popper from 'popper.js';

    export default {
        name: "Dropdown",
        props: {
            config: {
                type: Object,
                default: () => ({placement: 'bottom'}),
            },
            buttonText: {
                type: String,
                default: () => ''
            },
        },
        data() {
            return {
                active: false
            }
        },
        beforeDestroy() {
            if (!this.popper) {
                return;
            }

            this.popper.destroy();
        },
        methods: {
            toggle() {
                this.active = !this.active;
            }
        },
        created() {
            const handleEscape = (e) => {
                if (e.key === 'Esc' || e.key === 'Escape') {
                    this.active = false;
                }
            };

            const handleOutsideClick = (e) => {
                if (!this.$el.contains(e.target)) {
                    this.active = false;
                }
            };

            document.addEventListener('click', handleOutsideClick);
            document.addEventListener('keydown', handleEscape);

            this.$once('hook:beforeDestroy', () => {
                document.removeEventListener('keydown', handleEscape);
                document.removeEventListener('click', handleOutsideClick)
            })
        },
        watch: {
            active(active) {
                if (active) {
                    this.$nextTick(() => {
                        this.popper = new Popper(this.$el, this.$refs.dropdown, {
                            placement: 'bottom-start',
                            modifiers: {
                                preventOverflow: {boundariesElement: 'scrollParent'},
                            },
                        });
                    });
                } else if (this.popper) {
                    setTimeout(() => this.popper.destroy(), 100);
                }
            },
        }
    }
</script>
