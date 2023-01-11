<template>
  <i :class="Icon"></i>
</template>

<script>
    export default  {
    name: 'RenderBoolValue',
    data: () => ({
        Icon: '',
        Color:''
    }),
        beforeMount() {
            if (this.params.value == "Yes" || this.params.value == true) {
                this.Color = "success"
                this.Icon = "pi pi-check"
            }
            else {
                this.Color = "#E57373";
                this.Icon = "pi pi-times"
            }
        }
    };
</script>