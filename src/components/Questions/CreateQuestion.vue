
<template>
  <div class="col-12">
    <div class="grid">
      <div class="col-12">
        <label for="Qstatement"><b>Question Statement</b></label>
        <Editor v-model="state.QuestionStatement" editorStyle="height: 100px" class="w-full mt-1" id="Qstatement" />
        <InlineMessage severity="error" v-if="v$.QuestionStatement.$error" class="mb-2 mb-1 w-full">{{ v$.QuestionStatement.$errors[0].$message }}</InlineMessage>
      </div>
      <div class="col-6 mb-0">
        <label for="MinIntent"><b>Category</b></label>
        <Dropdown v-model="state.MinorIntentId" :options="MinorIntents" optionValue="id" optionLabel="name" placeholder="Question Category" display="chip" class="w-full mt-1" id="MinIntent" @blur="v$.MinorIntentId.$validate()" />
        <InlineMessage severity="error" v-if="v$.MinorIntentId.$error" class="mb-2 mb-1 w-full">{{ v$.MinorIntentId.$errors[0].$message }}</InlineMessage>
      </div>
      <div class="col-6 mb-0">
        <label for="QuestionType"><b>Question Type</b></label>
        <Dropdown v-model="state.QuestionType" :options="QuestionTypes" optionValue="typeId" optionLabel="typeName" placeholder="Question Type" display="chip" class="w-full mt-1" id="QuestionType" @change="SetQuestionOptions"
                  @blur="v$.QuestionType.$validate()" />
        <InlineMessage severity="error" v-if="v$.QuestionType.$error" class="mb-2 mb-1 w-full">{{ v$.QuestionType.$errors[0].$message }}</InlineMessage>
      </div>
      <div class="col-6 mb-0">
        <label for="Org"><b>Assign Organization</b></label>
        <Dropdown v-model="state.OrganizationId" :options="Organizations" optionValue="orgId" optionLabel="orgName" placeholder="Assigned Organization" display="chip" class="w-full" id="Org" @blur="v$.OrganizationId.$validate()" />
        <InlineMessage severity="error" v-if="v$.OrganizationId.$error" class="mb-2 mb-1 w-full">{{ v$.OrganizationId.$errors[0].$message }}</InlineMessage>
      </div>
      <div class="col-6">
        <label for="Metric"><b>Select Metric Type</b></label>
        <Dropdown v-model="state.MetricType"
                  :options="$props.MetricTypes"
                  :disabled="state.QuestionType != 4"
                  placeholder="Select Metric Type"
                  dataKey="metricTypeId"
                  optionValue="metricTypeId"
                  optionLabel="questionMetricTypeDescription"
                  @change="SetQuestionOptions"
                  display="chip"
                  @blur="v$.MetricType.$validate()"
                  id="Metric"
                  class="w-full" />

        <InlineMessage severity="error" v-if="v$.MetricType.$error" class="mb-2 mb-1 w-full">{{ v$.MetricType.$errors[0].$message }}</InlineMessage>
      </div>
      <div class="col-12" v-if="state.MetricType != 1000 && state.QuestionType != 3">
        <div class="p-fluid">
          <Chips v-model="NewlyAddedQuestions" separator="," class="w-full" :allowDuplicate="false" :max="MaxOptionsAllowed" @add="AddNewChipOption" @remove="RemoveChipOption"/>
        </div>
      </div>
    </div>
  </div>

  <div class="col-12 mt-0 pt-0">
    <div class="grid" v-if="state.QuestionType != 3">
      <Divider />
      <div class="col-12" style="height: calc(52vh - 170px)">
        <DataTable :value="state.QuestionOptions" responsiveLayout="scroll" v-model:selection="SelectedQuestionOptions" dataKey="Index" editMode="row" v-model:editingRows="EditingRows" @row-edit-save="OnRowEditSave" v-if="state.QuestionOptions.length != 0"
                   :scrollable="true"
                   scrollHeight="flex">
          <Column field="OptionDescription" header="Question Options">
            <template #body="slotProps">
              <Badge :style="{'background-color': SetOptionColor(slotProps.data.OptionValue)}" class="mr-1">{{slotProps.data.OptionDescription}}</Badge>
            </template>
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" class="w-full" :disabled="state.QuestionTypeId == 1" />
            </template>
          </Column>
          <Column :rowEditor="true" bodyStyle="text-align:center" style="max-width:6em" v-if="state.QuestionType != 1"></Column>
        </DataTable>
      </div>
    </div>
    <Message severity="info" class="w-full" v-if="state.QuestionType == 3" :closable="false">Open Ended No Question Options To Add</Message>
  </div>

  <div class="col-12 flex justify-content-end">
    <Button type="button" class="p-button-primary  p-button-outlined ml-2" :disabled="IsCreating || IsSaving" @click="Cancel" icon="pi pi-ban" iconPos="right" label="Cancel" />
    <Button type="button" label="Save & Close" icon="pi pi-save" :disabled="IsCreating || IsSaving" :loading="IsCreating" iconPos="right" @click="AddNewQuestion(true, false)" class="ml-2" />
    <Button type="button" label="Save And Add Another Question" icon="pi pi-check" :disabled="IsCreating || IsSaving" :loading="IsSaving" iconPos="right" @click="AddNewQuestion(false, true)" class="ml-2 p-button-info" />
  </div>

</template>

<script>

  import useVuelidate from '@vuelidate/core'
  import { required, helpers } from '@vuelidate/validators'
  import { reactive, computed } from 'vue'

  export default {
    name: 'CreateQuestion',
    emits: ['CloseAddNewQuestion'],
    props: ['QuestionId', 'QuestionTypes', 'Organizations', 'ActiveStatuses', 'MinorIntents', 'OptionDefaults', 'MetricTypes'],
    data: () => ({
      SelectedQuestionOptions: [],
      EditingRows: [],
      Block: false,
      IsCreating: false,
      IsSaving: false,
      ToastPosition: 'top-center',
      NewlyAddedQuestions: [],
      CurrentEditingOptions: []
    }),
    setup() {
      const state = reactive({
        Id: null,
        QuestionStatement: null,
        QuestionType: null,
        OrganizationId: null,
        MinorIntentId: null,
        HasComment: false,
        IsCore: false,
        Reference: null,
        IsCreating: false,
        IsSaving: false,
        IsPostAssessment: false,
        IsApproved: true,
        ActiveStatusId: 1000,
        IsReccommended: false,
        CreatedBy: null,
        UpdatedBy: null,
        QuestionId: null,
        MetricType: null,
        UpdatedOn: null,
        CreatedOn: null,
        QuestionKey: 1,
        QuestionOptions: [],
      })
      const rules = computed(() => {
        return {
          MetricType: { required: helpers.withMessage("Please Assign A Metric Type", required) },
          OrganizationId: { required: helpers.withMessage("Please Assign A Organization", required) },
          QuestionType: { required: helpers.withMessage("Please Assign Question Type", required) },
          MinorIntentId: { required: helpers.withMessage("Please Assign A Category", required) },
          QuestionStatement: { required: helpers.withMessage("Please Add A Question Statement", required) },
        }
      });

      const v$ = useVuelidate(rules, state)
      return { state, v$ }
    },
   
    computed: {
  
      MaxOptionsAllowed() {
        var maxAllowed = 20;
        if (this.state.QuestionType == 4 && this.state.MetricType == 1000)
          maxAllowed = 5;
        return maxAllowed;
      },
      stateOptions() {
        return this.state.QuestionOptions.map(c => c.OptionDescription)
      }
    },
    methods: {
      SetQuestionOptions() {
        this.NewlyAddedQuestions = [];
        this.state.QuestionOptions = [];

        if (this.state.QuestionType == 1)
          this.state.MetricType = 1000
        if (this.state.QuestionType == 3 || this.state.QuestionType == 2)
          this.state.MetricType = 2000

        if (this.state.QuestionType == 3)
          return false;

      if ((this.state.QuestionType == 1 || this.state.QuestionType == 4) && this.state.MetricType == 1000) {
         this.state.QuestionOptions = this.$props.OptionDefaults.filter(c => c.questionTypeId == this.state.QuestionType && c.metricTypeId == 1000).map(c => ({
            OptionValue: c.optionValue,
            QuestionOptionId: null,
            OptionDescription: c.optionDescription == null ? `Option # ${c.optionOrder}` : c.optionDescription,
            OptionOrder: c.optionOrder,
            QuestionKey: this.state.QuestionKey,
            DefaultOptionId: c.defaultId,
            IsCommentTriggering: false,
            IsOptOut: false
          }));
        }
      },

      AddNewChipOption(event) {
          var defaultIdOption = this.$props.OptionDefaults.filter(c => c.questionTypeId == this.state.QuestionType && c.metricTypeId == 2000)[0];


           

          var optionOrder = 0;
          this.state.QuestionOptions = event.value.map(c => ({
            OptionValue: defaultIdOption.optionValue,
            QuestionOptionId: null,
            OptionDescription: c,
            OptionOrder: optionOrder++,
            QuestionKey: this.state.QuestionKey,
            DefaultOptionId: defaultIdOption.defaultId,
            IsCommentTriggering: false,
            IsOptOut: false,
            Index : this.NewlyAddedQuestions.findIndex(p => p == c)
          }));
      },
      RemoveChipOption(event) {
         var optionIndex = this.state.QuestionOptions.findIndex(p => p.optionDescription == event.value[0]);
         this.state.QuestionOptions.splice(optionIndex, 1);

        console.log(event)
      },
      async AddNewQuestion(isCreatingAndClosing, isCreatingAndAdding) {

        await this.v$.$validate()

        var self = this;

        if (!this.v$.$invalid) {
          this.IsCreating = isCreatingAndClosing
          this.IsSaving = isCreatingAndAdding

          var question = {
            Id: this.state.Id,
            QuestionStatement: this.state.QuestionStatement,
            QuestionType: this.state.QuestionType,
            OrganizationId: this.state.OrganizationId,
            MinorIntentId: this.state.MinorIntentId,
            HasComment: this.state.HasComment,
            IsCore: this.state.IsCore,
            Reference: this.state.Reference,
            IsPostAssessment: this.state.IsPostAssessment,
            IsApproved: this.state.IsApproved,
            ActiveStatusId: this.state.ActiveStatusId,
            IsReccommended: this.state.IsReccommended,
            QuestionId: this.state.QuestionId,
            MetricTypeId: this.state.MetricType,
            QuestionKey: 1,
            QuestionOptions: this.state.QuestionOptions.map(c => c),
          };

          if (question.questionType != 3 && question.QuestionOptions.length == 0) {
            self.$toast.add({ severity: 'error', detail: 'Please Add At Least One Option', life: 3000 });
            this.IsCreating = false
            this.IsSaving = false
            return false;
          }
          else {
            self.ToastPosition = 'top-right';
          }

          await self.$http.post("Questions/AddNewQuestionAndOptions", { Questions: [question] })
            .then(function (response) {
              if (response.data.success) {
                    self.IsCreating = false;
                    self.IsSaving = false;
                    self.$toast.add({ severity: 'success', detail: 'Question Created Successfully', life: 3000, position: "center" });
                    self.ClearForm();
                   var closeModal = isCreatingAndClosing;
                   self.$emit('CloseAddNewQuestion', { questions: response.data.questions, close: closeModal})
              }
              else {
                self.IsCreating = false;
                self.IsSaving = false;
                self.$toast.add({ severity: 'error', detail: 'Adding Question Failed', life: 3000 });
              }
            })
          }
      },
      ClearForm() {
        var self = this;
        self.state.Id = null;
        self.state.QuestionStatement = null;
        self.state.QuestionType = null;
        self.state.OrganizationId = null;
        self.state.MinorIntentId = null;
        self.state.HasComment = false;
        self.state.IsCore = false;
        self.state.Reference = null;
        self.state.IsCreating = false;
        self.state.IsSaving = false;
        self.state.IsPostAssessment = false;
        self.state.IsApproved = true;
        self.state.ActiveStatusId = 1000;
        self.state.IsReccommended = false;
        self.state.CreatedBy = null;
        self.state.UpdatedBy = null;
        self.state.QuestionId = null;
        self.state.MetricType = null;
        self.state.UpdatedOn = null;
        self.state.CreatedOn = null;
        self.state.QuestionKey = 1;
        self.state.QuestionOptions = [];
        self.NewlyAddedQuestions = [];
        self.v$.$reset();
      },
      Cancel() { 
        this.ClearForm();
        this.$emit('CloseAddNewQuestion', { questions: null, close: true })
      },
      SetOptionColor(OptionValue) {

        var color = "#01579B";
        if (this.state.MetricType == 1000) {

          if (OptionValue == 5) {
            color = "#43A047"
          }
          if (OptionValue == 4) {
            color = "#81C784";
          }
          if (OptionValue == 3) {
            color = "#F57C00"
          }
          if (OptionValue == 2) {
            color = "#EF9A9A"
          }
          if (OptionValue == 1) {
            color = "#C62828"
          }
        }
        return color;
      },
      OnRowEditSave(event) {
        let { newData, index } = event;
        this.NewlyAddedQuestions[index] = newData.OptionDescription
        this.state.QuestionOptions[index].OptionDescription = newData.OptionDescription
        console.log('Test')
      }
    }
  }
</script>

<style>

  .p-inplace .p-inplace-display:not(.p-disabled):hover {
    background: none;
    color: #495057;
  }

  .p-inplace .p-inplace-display {
    display: inline;
    cursor: pointer;
  }

  .p-datatable-scrollable .p-datatable-wrapper {
    position: relative;
    overflow-x: hidden;
  }

  .p-chips .p-chips-multiple-container .p-chips-token {
    padding: 0.25rem 0.5rem;
    margin-right: 0.5rem;
    background: #103e8f;
    color: #fafcff;
    border-radius: 16px;
  }

  .p-inputtext p-chips-multiple-container {
    width: 100% !important
  }
</style>
