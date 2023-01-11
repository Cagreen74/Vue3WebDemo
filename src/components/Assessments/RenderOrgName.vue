<template>

  <Tag :value="OrgName" :rounded="true" style="background-color: rgb(193 138 56)"></Tag>

  <v-chip dense
          color="rgb(193 138 56)"
          medium
          outlined>
    {{OrgName}}
  </v-chip>
</template>

<script>
    export default  {
    name: 'RenderOrgName',
    data: () => ({
        OrgName:''
    }),
        created() {
             this.OrgName = this.params.value;
        }
    };
</script>