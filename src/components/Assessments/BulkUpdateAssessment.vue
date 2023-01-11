<template>
  <div class="grid p-2 mt-2" style="overflow-x: hidden; max-width: 99%;">
    <div class="col-12" style="overflow-x:hidden;">
      <Dropdown v-model="AssessmentStatusId" :options="AssessmentStatuses" dataKey="orgId" optionValue="typeId" optionLabel="typeName" placeholder="Assessment Status" class="w-full" :showClear="true" />
    </div>
    <div class="col-12" style="overflow-x:hidden;">
      <Calendar v-model="StartDate" :showButtonBar="true" selectionMode="single" class="w-full" placeholder="Assessment Start Date" :showClear="true" />
    </div>
    <div class="col-12" style="overflow-x:hidden;">
      <Calendar v-model="EndDate" :showButtonBar="true" selectionMode="single" class="w-full" placeholder="Assessment End Date" :showClear="true" />
    </div>
    <div class="col-12" style="overflow-x:hidden;">
      <h5 id="Edu">Send Assessment Completion Reminder</h5>
      <SelectButton v-model="SendReminderEmail" :options="YesOrNo" aria-labelledby="Edu" optionValue="value" optionLabel="text" :showClear="true" class="w-full" />
    </div>
  </div>
  <Divider></Divider>
  <div class="grid mt-2" style="overflow-x: hidden; max-width: 99%;">
    <div class="col-6" style="overflow-x:hidden;">
      <Button label="Close" icon="pi pi-times" @click='CloseDialog' class="p-button-outlined p-button-secondary w-full" iconPos="right" />
    </div>
    <div class="col-6" style="overflow-x:hidden;">
      <Button label="Update" icon="pi pi-check" autofocus class="p-button-secondary w-full" @click="BulkEditItems" :loading="IsBulkEditing" iconPos="right" />
    </div>
  </div>
</template>


<script>
  /* eslint-disable no-debugger */
    export default  {
    name: 'BulkUpdateAssessments',
    props: ['AssessmentIds', 'AssessmentStatuses', 'AssessmentUsers','Assessment'],
        data: () => ({
          StartDate: null,
          EndDate: null,
          SendReminderEmail: false,
          AssessmentStatusId: null,
          YesOrNo:
          [{ text: 'Yes', value: true },
           { text: 'No', value: false }],
          IsBulkEditing: false,
    }),
    created() {

      if (this.$props.Assessment) {
        var assessment = this.$props.Assessment
        this.StartDate = new Date(assessment.StartDate)
        this.EndDate = new Date(assessment.EndDate)
        this.AssessmentStatusId = assessment.AssessmentStatusId
      }
    },
    methods: {
      async BulkEditItems() {
        var self = this;
        self.IsBulkEditing = true;
        var updateIds = self.$props.AssessmentIds;
        var getUsersToSendUpdate = self.$props.AssessmentUsers;

        await self.$http.post('/Assessment/BulkUpdate', {
          StartDate: self.StartDate,
          EndDate: self.EndDate,
          AssessmentStatusId: self.AssessmentStatusId,
          Ids: updateIds,
          SendReminderEmail: self.SendReminderEmail,
          SendUpdateList: getUsersToSendUpdate
        }).then((response) => {
          self.IsBulkEditing = false;
          self.$emit('BulkEditResponse', response, {
          StartDate: self.StartDate,
          EndDate: self.EndDate,
          AssessmentStatusId: self.AssessmentStatusId
          })
        })
      },
      CloseDialog() {
        this.$emit('CloseDialog', )
       }
      }
    };

</script>