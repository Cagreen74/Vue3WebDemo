<style scoped>
    .v-progress-circular {
        margin: 1rem;
    }
</style>

<template>
  <div class="grid w-full">
    <div class="col-10 mx-auto">
      <DataTable :value="QuestionOptions" responsiveLayout="scroll" v-model:selection="SelectedQuestionOptions" dataKey="QuestionOptionId" editMode="row" v-model:editingRows="editingRows" @row-edit-save="onRowEditSave">
        <template #header>
          <div class="grid" v-if="QuestionTypeId != 1">
            <div class="col-12 flex justify-content-end py-1">
              <Button type="button"
                      icon="pi pi-trash"
                      class="p-button-rounded p-button-danger mr-2" :disabled="SelectedQuestionOptions.length == 0" @click="DeleteOption" />

              <Button type="button"
                      icon="pi pi-plus"
                      class="p-button-rounded p-button-secondary mr-2" @click="AddOptions" v-bind:id="$props.QuestionId" />
            </div>
          </div>
        </template>
        <Column field="OptionDescription" header="Question Option">
          <template #body="slotProps">
            <Badge :style="{'background-color': SetOptionColor(slotProps.data.OptionValue)}" class="mr-1">{{slotProps.data.OptionDescription}}</Badge>
          </template>
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" class="w-full" :disabled="QuestionTypeId == 1 || data['HasOveride']" />
          </template>
        </Column>
        <Column field="AssessmentQuestionOptionDescription" header="Assessment Question Option" v-if="$props.AssessmentQuestionId != null">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" class="w-full" :disabled="!data['HasOveride']" />
          </template>
        </Column>

        <Column field="IsOptOut" header="Opt Out" style="max-width:10em" v-if="QuestionTypeId != 1">
          <template #body="slotProps">
            <i class="pi pi-check text-green-600" v-if="slotProps.data.IsOptOut"></i>
            <i class="pi pi-times text-red-600" v-else></i>
          </template>
          <template #editor="{ data, field }">
            <ToggleButton v-model="data[field]" onLabel="Yes" offLabel="No" onIcon="pi pi-check" offIcon="pi pi-times" />
          </template>
        </Column>

        <Column field="IsCommentTriggering" header="Trigger Comment" style="max-width:10em" v-if="QuestionTypeId != 1">
          <template #body="slotProps">
            <i class="pi pi-check text-green-600" v-if="slotProps.data.IsCommentTriggering"></i>
            <i class="pi pi-times text-red-600" v-else></i>
          </template>
          <template #editor="{ data, field }">
            <ToggleButton v-model="data[field]" onLabel="Yes" offLabel="No" onIcon="pi pi-check" offIcon="pi pi-times" />
          </template>
        </Column>


        <Column field="HasOveride" header="Overide" style="max-width:5em" v-if="$props.AssessmentQuestionId != null">
          <template #editor="{ data, field }">
            <Checkbox v-model="data[field]" :binary="true" />
          </template>
          <template #body="slotProps">
            <i class="pi pi-check text-green-600" v-if="slotProps.data.HasOveride && $props.AssessmentQuestionId != null"></i>
            <i class="pi pi-times text-red-600" v-else></i>
          </template>
        </Column>
        <Column :rowEditor="true" bodyStyle="text-align:center" style="max-width:6em" v-if="$props.QuestionTypeId != 1 || $props.AssessmentQuestionId != null"></Column>
        <Column selectionMode="multiple" headerStyle="width: 3em" style="max-width:5em" v-if="$props.QuestionTypeId != 1"></Column>
      </DataTable>
      <ConfirmPopup></ConfirmPopup>
      <Toast />
    </div>
  </div>
  <Dialog v-model:visible="AddNewOptions" header="Add New Options" class="p-sidebar-md" appendTo="self" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw', 'overflow-x' : hidden }" :modal="true">
    <div class="grid" style="overflow-x: hidden; max-width: 99%;">
      <div class="col-10 mx-auto" style="overflow-x:hidden;">
        <div class="p-fluid">
          <Divider align="center">
            <b>Press enter or use a comma to seperate options</b>
          </Divider>
          <Chips v-model="NewOptions" separator="," class="w-full my-1" />
        </div>
      </div>
    </div>
    <template #footer>
      <div class="grid mt-2" style="overflow-x: hidden; max-width: 99%;">
        <div class="col-10 mx-auto flex justify-content-end" style="overflow-x:hidden;">
          <Button label="Close" icon="pi pi-times" @click='AddNewOptions = false' class="p-button-outlined p-button-secondary mr-2" iconPos="right" />
          <Button label="Add Options" icon="pi pi-check" autofocus class="p-button-secondary" iconPos="right" :loading="AddingOptions" @click="AddQuestionOptions" :disabled="NewOptions.length == 0" />
        </div>
      </div>
    </template>
  </Dialog>
  <Dialog v-model:visible="DeleteOptions" header="Remove Question Options" class="p-sidebar-md" appendTo="self" :breakpoints="{'960px': '40vw', '640px': '90vw'}" :style="{width: '30vw', 'overflow-x' : hidden }" :modal="true">
    <div class="grid" style="overflow-x: hidden; max-width: 99%;">
      <div class="col-10 mx-auto mt-1" style="overflow-x:hidden;">
        <div class="p-fluid">
            <div class="field-radiobutton">
              <RadioButton inputId="city1" name="HardDelete" :value="false" v-model="HardDelete" />
              <label for="city1">Archive Options Only</label>
            </div>
            <div class="field-radiobutton">
              <RadioButton inputId="city2" name="HardDelete" :value="true" v-model="HardDelete" />
              <label for="city2">Remove From All Assessments <i class="pi pi-exclamation"></i></label>
            </div>
             </div>
      </div>
    </div>
    <template #footer>
      <div class="grid mt-2" style="overflow-x: hidden; max-width: 99%;">
        <div class="col-12 mx-auto flex justify-content-end" style="overflow-x:hidden;">
          <Button label="Close" icon="pi pi-times" @click='DeleteOptions = false' class="p-button-outlined p-button-danger mr-2" iconPos="right" />
          <Button label="Remove Options" icon="pi pi-check" autofocus class="p-button-danger" iconPos="right" :loading="IsDeleteing" @click="DeleteQuestionOptions" />
        </div>
      </div>
    </template>
  </Dialog>
</template>

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


<script>
  /* eslint-disable no-debugger */
  export default {
    name: 'QuestionOptionsMenu',
    props: ['QuestionId', 'IsRanked', 'QuestionTypeId', 'AssessmentId', 'AssessmentQuestionId'],
    data: () => ({
      AddNewOptions: false,
      editingRows: [],
      DeleteOptions:false,
      IsDeleteing:false,
      AddingOptions: false,
      NewOptions: [],
      SoftDelete: false,
      HardDelete: false,
      SelectedQuestionOptions: [],
      QuestionOptions: [],
      EditMode: 'View Mode',
      EditModeOptions: ['Edit Mode', 'View Mode'],
      IsRendered: false,
      OverRide: false,
      GlobalChanges: ['Global', 'This Assessment Only']
    }),
    created() {
      this.GetOptions();
    },
    watch: {
      AssessmentQuestionId: function () { // watch it
          this.GetOptions();
      }
    },
    methods: {
      DeleteOption() {
        this.HardDelete = false;
        this.DeleteOptions = true;
      },

      async DeleteQuestionOptions() {
        var self = this;
        self.IsDeleteing = true;

        await this.$http.post('/Questions/DeleteQuestionOptions', {
          IsHardDelete: self.HardDelete,
          QuestionOptionIds: self.SelectedQuestionOptions.map(c => c.QuestionOptionId)
        }).then(function (response) {
          return response;
        }).then((response) => {
          if (response.data.success) {
            self.$toast.add({ severity: 'success', detail: `Successfully Removed Options`, life: 3000 });
            self.IsDeleteing = false;
            self.GetOptions();
            self.DeleteOptions = false;
          }
          else {
            self.$toast.add({ severity: 'error', detail: `Error Removing Options`, life: 3000 });
            self.IsDeleteing = false;
          }
        });
      },

      async AddOptions() {
        this.NewOptions = [];
        this.AddNewOptions = true;
      },
      async AddQuestionOptions() {
        var self = this;
        self.AddingOptions = true;

        var options = new Array();
        var optionOrder = 1;
        for (var i = 0; i < self.NewOptions.length; i++) {
          var record = self.NewOptions[i];
          var questionOption = {
            OptionValue: 1,
            OptionOrder: optionOrder,
            OptionDescription: record,
            QuestionTypeId: self.$props.QuestionTypeId,
            QuestionId: self.$props.QuestionId,
            QuestionOptionId: null,
            UsesDefaultOptions: false,
            DefaultOptionId: null,
            IsOptOut: false,
            IsCommentTriggering: false,
            AssessmentQuestionOptionId: null,
            AssessmentQuestionOptionDescription: record,
            HasOveride: false,
            AssessmentQuestionId: self.$props.AssessmentQuestionId
          }
          options.push(questionOption);
          optionOrder = optionOrder += 1;
        }
        self.UpdateOptions(options);
      },
     async onRowEditSave(event) {
       let { newData, index } = event;
       var self = this;
       self.QuestionOptions[index] = newData;
       self.UpdateOptions(self.QuestionOptions)
      },

      async UpdateOptions(QuestionOptions) {

        var self = this;

        await this.$http.put('/Questions/UpdateOptions', {
          QuestionType: self.$props.QuestionTypeId,
          QuestionId: self.$props.QuestionId,
          QuestionOptions: QuestionOptions,
          IsRanked: self.$props.IsRanked,
          AssessmentQuestionId: self.$props.AssessmentQuestionId
        }).then(function (response) {
          return response;
        }).then((response) => {
          if (response.data.success) {
            self.$toast.add({ severity: 'success', detail: `Successfully Updated Option`, life: 3000 });
            self.AddingOptions = false;
            self.GetOptions();
          }
          else {
            self.$toast.add({ severity: 'error', detail: `Error Updating Options`, life: 3000 });
          }
        });
      },
      SetOptionValueLength(value) {
        var me = (value + "test").length * 13;
        console.log(me)
        return me + "px";
      },
       async GetOptions() {
                var self = this;
                await self.$http.post("Questions/GetAssessmentQuestionOptions", { QuestionIds: [this.$props.QuestionId], AssessmentId: this.$props.AssessmentId }).then(function (response) {
                      if (response.data.success) {

                        var options = new Array();

                        var optionOrder = 1;
                        for (var i = 0; i < response.data.questionOptions.length; i++) {

                          var record = response.data.questionOptions[i];

                          var questionOption = {
                            OptionValue: record.optionValue,
                            OptionOrder: record.optionOrder == null ? optionOrder : record.optionOrder,
                            OptionDescription: record.optionDescription,
                            QuestionTypeId: record.questionTypeId,
                            QuestionId: self.$props.QuestionId,
                            QuestionOptionId: record.questionOptionId,
                            UsesDefaultOptions: record.usesDefaultOptions,
                            DefaultOptionId: record.defaultOptionId,
                            IsOptOut: record.isOptOut,
                            IsCommentTriggering: record.isCommentTriggering,
                            AssessmentQuestionOptionId: record.assessmentQuestionOptionId,
                            AssessmentQuestionOptionDescription: record.assessmentQuestionOptionDescription,
                            HasOveride: record.hasOveride,
                            AssessmentQuestionId: self.$props.AssessmentQuestionId
                          }
                          options.push(questionOption);
                          optionOrder = optionOrder += 1;
                        }
                        self.QuestionOptions = options;
                      }
                      else {
                         console.log('Error Loading')
                      }
                    });
            },
      SetOptionColor(OptionValue) {

        var color = "#01579B";

        if (this.$props.IsRanked && this.$props.QuestionTypeId == 1) {
             
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
       }
      }
    };
</script>