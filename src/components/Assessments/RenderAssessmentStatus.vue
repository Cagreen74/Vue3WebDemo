
<template>
    <Tag :value="Status" :style="{'background-color': Color}" :icon="Icon" iconPos="right" :rounded="true"></Tag>
</template>

<script>
    export default  {
    name: 'RenderAssessmentStatus',
    data: () => ({
        Icon: '',
        Color: '',
        Status: '',
        ShowProgress:false
    }),
        created() {
            this.Status = this.params.value;

            if (this.params.data.typeCode == "SRTD") {
                this.Color = "#558B2F"
                this.Icon = "mdi-circle-slice-3"
            }
            if (this.params.data.typeCode == "INPG") {
              this.Color = "#00695C"
                this.ShowProgress = true
                this.Icon = "pi pi-spin pi-spinner"
            }
            if (this.params.data.typeCode == "CMP") {
              this.Color = "#66BB6A"
                this.Icon = "pi pi-check"
            }
            if (this.params.data.typeCode == "DFT") {
              this.Color = "#37474F"
                this.Icon = "pi pi-cog"
            }
            if (this.params.data.typeCode == "ARC") {
                this.Color = "#0277BD"
                this.Icon = "mdi-archive-arrow-up-outline"
            }
            if (this.params.data.typeCode == "REV") {
                this.Color = "#FFCC80"
                this.Icon = "pi pi-folder"
            }
            if (this.params.data.typeCode == "PENDREV") {
                this.Color = "#FF7043"
                this.Icon = "pi pi-eye"
            }

            if (this.params.data.typeCode == "RTST") {
                this.Color = "#0D47A1"
                this.Icon = "pi pi-thumbs-up"
            }
        }
    };
</script>