<template>
  <h4>Range History</h4>
</template>

<script>
export default {
    name: 'RangeHistory',
    props: {
      msg: String
    },
    created() {
      this.$emit("set-nav", this.$route)
    }
  }</script>