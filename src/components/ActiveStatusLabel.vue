
<template>
  <Badge :value="Status" :style="{'background-color': LabelColor}">{{LabelText}}</Badge>
</template>

<script>
    export default  {
    name: 'ActiveStatusLabel',
    data: () => ({
        LabelColor: '',
        LabelText: '',
        Icon:''
    }),
        beforeMount() {
            if (this.params.data.activeStatusId === 1000) {
              this.LabelColor = "#66BB6A"
                this.Icon = "pi pi-check"
            }
            if (this.params.data.activeStatusId == 2000) {
              this.LabelColor = "#EF9A9A";
                this.Icon = "pi pi-times"
            }

            this.LabelText = this.params.data.activeStatusName;
        },
    };

    </script>