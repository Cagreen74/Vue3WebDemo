<template>
  <DataTable :value="DemoGraphicQuestionbatches"
             responsiveLayout="scroll"
             :scrollable="true"
             scrollHeight="flex"
             :lazy="true"
             showGridlines
             columnResizeMode="expand"
             :dataKey="question"
             :rowHover="true"
             editMode="row"
             v-model:editingRows="EditingRows"
             @row-edit-save="OnRowEditSave"
             class="p-datatable-sm w-full"
             >
    <Column field="question.questionStatement" header="Demographic" :sortable="true">
      <template #body="slotProps">
        <div v-html="slotProps.data.question.questionStatement">

        </div>
      </template>
    </Column>
    <Column field="" header="My Answer(s)" :sortable="false" columnStyle="text-align: center">
      <template #editor="{ data}">
        <Dropdown v-model="data['answerId']" :options="data.questionOptions" optionLabel="optionDescription" optionValue="questionOptionId" placeholder="Select Answer" class="w-full" autofocus v-if="data['question'].questionType == 4 || data['question'].questionType == 1" />
        <MultiSelect v-model="data['answerIds']" :options="data.questionOptions" optionLabel="optionDescription" optionValue="questionOptionId" placeholder="Select Answers" class="w-full" autofocus v-if="data['question'].questionType == 2" />
      </template>

      <template #body="slotProps">
        <div v-if="!slotProps.data.hasResponses" class="w-full">
          <Tag icon="pi pi-exclamation-triangle" severity="danger" value="No Answer Selected" rounded></Tag>
        </div>
        <div v-else>
          <Badge class="mr-2" rounded="true" v-for="(item, index) in slotProps.data.selectedDemoGraphicObjects" :key="index" style="background-color: #0d47a1 ">
            {{item.optionDescription}}
          </Badge>
        </div>
      </template>
    </Column>
    <Column :rowEditor="true" bodyStyle="text-align:center" style="max-width:5.5em"></Column>
  </DataTable>
</template>

<script>
    export default  {
    name: 'UserDemographics',
    props:['demographics','Update'],
    data: () => ({
      EditingRows: [],
      DemoGraphicQuestionbatches: null
    }),
    created() {
      var batches = this.$props.demographics;
      this.DemoGraphicQuestionbatches = batches
    },
    methods: {
      async OnRowEditSave(event) {
        var self = this;
        let { newData, index } = event;

        var userDemographicOptions = new Array();
        var userId = this.DemoGraphicQuestionbatches[index].questionOptions[0].userId;

        if (newData.question.questionType == 4 || newData.question.questionType == 1) {

          var demographic = this.DemoGraphicQuestionbatches[index].selectedDemoGraphicObjects[0];

          userDemographicOptions.push({
            QuestionOptionId: newData.answerId,
            UserDemoGraphicId: demographic ? demographic.userDemoGraphicId : null
          });
        }
        else {

          var demographics = this.DemoGraphicQuestionbatches[index].selectedDemoGraphicObjects

          for (var i = 0; i < newData.answerIds.length; i++) {
            var demographicId = demographics.filter(c => c.questionOptionId == newData.answerIds[i])[0];

            userDemographicOptions.push({
              QuestionOptionId: newData.answerIds[i],
              UserDemoGraphicId: demographicId ? demographicId.userDemoGraphicId : null
            });
          }
        }

        await self.$http.post('/Assessment/CreateOrUpdateDemoGraphics', {
          DemoGraphics: userDemographicOptions,
          QuestionType: newData.question.questionType,
          QuestionId: newData.question.id,
          UserName: userId
        }).then(function (response) {

          self.DemoGraphicQuestionbatches[index] = response.data.updatedDemographics[0];

          if (self.$props.Update) {
            var allQuestionsAnswered = self.DemoGraphicQuestionbatches.filter(c => !c.hasResponses).length  == 0;
            self.$emit('Update', allQuestionsAnswered )
          }


          if (response.data.success) {
            self.$toast.add({ severity: 'success', detail: 'Update Successful', life: 3000 });
          }
          else {
            self.$toast.add({ severity: 'error', detail: 'Error Saving Demographics', life: 3000 });
          }
        })
      },
    }
    };
</script>