<template>
    <div>
        <button
            @click="toggle"
            class="bg-blue-800 hover:bg-blue-700 text-white py-2 pl-3 pr-2 rounded inline-flex items-center cursor-pointer border-0"
        >
            <span>{{ buttonText }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="fill-current w-2 h-2 pl-2" viewBox="0 0 24 24"><path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"/></svg>
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
