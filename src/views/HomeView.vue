<template>
    <div class="home">
        <hello-world msg="Welcome to Your Vue.js App" />
    </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
    name: "HomeView",
    components: {
        HelloWorld,
    },
    data() {
        return {
            test: [],
        };
    },
    methods: {
        aa() {},
    },
};
</script>
