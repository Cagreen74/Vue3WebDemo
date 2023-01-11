<template>
  <i class="pi pi-pencil mr-2" v-tooltip.top="'Edit Assessment'" style="color: #F59E0B; cursor:pointer" @click="EditAssessment"></i>
</template>

<script>
    export default  {
    name: 'EditSingleRowLink',
    data: () => ({
        AssessmentId: null,
        Route:null
    }),
        beforeMount() {
        this.AssessmentId = this.params.data.id;
        this.Route = {
            name: 'CreateAssessment', params: { AssessmentId: this.AssessmentId, OrgId: this.params.data.orgId }
            }
    },
    methods: {
      EditAssessment() {
        this.$router.push(this.Route)
      }
    }
    };
</script>