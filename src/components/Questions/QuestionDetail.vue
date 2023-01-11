<style scoped>
  .v-progress-circular {
    margin: 1rem;
  }
</style>
<template>

  <div class="grid w-full flex py-2">
    <div class="col-10 mx-auto pb-0 mb-0">
      <Message severity="warn" :sticky="true" :closable="false" v-if="$props.Question.hasResponses" class="w-full">This Question Type Can't Be Modified, It Has Active Assessment Responses</Message>
    </div>
    <div class="col-10 mx-auto pb-0 mb-0">
      <div class="grid">
        <div class="col-3">
          <Dropdown v-model="MetricType"
                    :options="$props.MetricTypes"
                    :disabled="QuestionTypeId != 4"
                    dataKey="metricTypeId"
                    optionValue="metricTypeId"
                    optionLabel="questionMetricTypeDescription"
                    @change="SetQuestionOptions"
                    display="chip"
                    class="w-full"/>
          <!--<ToggleButton v-model="IsRankedQuestion" onLabel="Ranked Question" offLabel="Not Ranked" onIcon="pi pi-check" offIcon="pi pi-times" v-if="QuestionTypeId != 3" class="w-full p-button-sm" @change="SetQuestionOptions" />-->
        </div>
        <div class="col-3">
          <Dropdown v-model="QuestionTypeId"
                    :options="$props.QuestionTypes"
                    dataKey="typeId"
                    optionValue="typeId"
                    optionLabel="typeName"
                    @change="SetQuestionOptions"
                    placeholder="Filter Question Types"
                    display="chip"
                    class="w-full"
                    v-if="!$props.Question.hasResponses" />
        </div>

        <div class="col-5 flex justify-content-end">
          <!--<Button icon="pi pi-ban" label="Reset Changes" class="p-button-secondary mr-2" iconPos="right" @click="ResetChanges" :disabled="IsSaving" />-->
         <Button icon="pi pi-check" label="Save Changes" class="p-button-secondary mr-2 p-button-outlined" iconPos="right" @click="UpdateOptions(null, true)" :disabled="IsSaving" :loading="IsSaving" v-if="IsQuestionTypeChange" />
        </div>
      </div>
    </div>
    <div class="col-10 mx-auto mt-0 pt-0">
      <Message severity="info" :sticky="true" :closable="false" v-if="QuestionTypeId == 3">This Question Is Open Ended. No Options Available</Message>
      <Message severity="info" :sticky="true" :closable="false" v-if="ShowNoOptionsAlert">
        This Question Has No Options
      </Message>
      <div class="col-12 flex justify-content-end pb-0 m-0" v-if="ShowNoOptionsAlert">
        <Button icon="pi pi-plus" label="Add Options" class="p-button-secondary mr-2 mt-0" iconPos="right" :loading="IsSaving" @click="AddOptions" />
      </div>
      <DataTable :value="QuestionOptions"
                 responsiveLayout="scroll"
                 v-model:selection="SelectedQuestionOptions"
                 :dataKey="QuestionOptionId == null ? OptionOrder : QuestionOptionId"
                 editMode="row"
                 v-model:editingRows="editingRows"
                 @row-edit-save="onRowEditSave"
                 v-if="QuestionTypeId != 3 && QuestionOptions.length != 0">
        <template #header>
          <div class="grid" v-if="QuestionTypeId != 1">
            <div class="col-12 flex justify-content-end py-1">
              <Button type="button"
                      icon="pi pi-trash"
                      class="p-button-rounded p-button-danger mr-2" :disabled="SelectedQuestionOptions.length == 0" @click="DeleteOption" v-if="QuestionTypeId != 1 && !IsRankedQuestion" />

              <Button type="button"
                      icon="pi pi-plus"
                      class="p-button-rounded p-button-secondary mr-2" @click="AddOptions" v-bind:id="$props.QuestionId" v-if="QuestionTypeId != 1 && !IsRankedQuestion" />
            </div>
          </div>
        </template>
        <Column field="OptionDescription" header="Question Options">
          <template #body="slotProps">
            <Badge :style="{'background-color': SetOptionColor(slotProps.data.OptionValue)}" class="mr-1">{{slotProps.data.OptionDescription}}</Badge>
          </template>
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" :disabled="QuestionTypeId == 1 || data['HasOveride']" class="w-full" :ref="data[QuestionOptionId]" />
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
        <Column field="IsCommentTriggering" header="Trigger Comment" style="max-width:10em"  v-if="QuestionTypeId != 1">
          <template #body="slotProps">
            <i class="pi pi-check text-green-600" v-if="slotProps.data.IsCommentTriggering"></i>
            <i class="pi pi-times text-red-600" v-else></i>
          </template>
          <template #editor="{ data, field }">
            <ToggleButton v-model="data[field]" onLabel="Yes" offLabel="No" onIcon="pi pi-check" offIcon="pi pi-times" />
          </template>
        </Column>
        <Column :rowEditor="true" bodyStyle="text-align:center" style="max-width:6em" v-if="ShowSingleRowEdits"></Column>
        <Column selectionMode="multiple" headerStyle="width: 3em" style="max-width:5em" v-if="QuestionTypeId != 1 && !IsRankedQuestion"></Column>
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
    name: 'QuestionDetail',
    emits: ["RefreshQuestions"],
    props: ['QuestionTypes', 'Question', 'OptionDefaults', 'MetricTypes'],
    data: () => ({
      AddNewOptions: false,
      IsRankedQuestion: null,
      QuestionOptionDefaults: [],
      AddingNewOptions: false,
      editingRows: [],
      IsSaving: false,
      MetricType: null,
      DeleteOptions:false,
      IsDeleteing: false,
      ShowNoOptionsAlert: false,
      AddingOptions: false,
      NewOptions: [],
      SoftDelete: false,
      HardDelete: false,
      SelectedQuestionOptions: [],
      OriginalQuestionOptions: [],
      OriginalMetricType: null,
      QuestionOptions: [],
      EditMode: 'View Mode',
      EditModeOptions: ['Edit Mode', 'View Mode'],
      IsRendered: false,
      OverRide: false,
      GlobalChanges: ['Global', 'This Assessment Only'],
      QuestionTypeId: null,
      OriginalQuestionType: null
    }),
    watch: {
      QuestionOptions() {
        if (this.QuestionOptions.length == 0 && this.QuestionTypeId != 3)
            this.ShowNoOptionsAlert = true
        else
          this.ShowNoOptionsAlert = false

        if (this.QuestionTypeId == 2 || this.QuestionTypeId == 3)
          this.MetricType = 2000;
        else {
          if (this.QuestionTypeId == 1)
                this.MetricType = 1000
        }
      },
      QuestionTypeId() {
        if (this.QuestionOptions.length == 0 && this.QuestionTypeId != 3)
          this.ShowNoOptionsAlert = true
        else
          this.ShowNoOptionsAlert = false

        if (this.QuestionTypeId == 2 || this.QuestionTypeId == 3)
          this.MetricType = 2000;
        else {
          if (this.QuestionTypeId == 1)
            this.MetricType = 1000
        }

      },
      MetricType() {

        var self = this;

        if (this.MetricType != this.$props.Question.metricTypeId) {
            self.UpdateQuestionMetricType()
        }
      }
    },
    created() {
      this.GetOptions();
      var questionType = this.$props.Question.questionType;
      this.MetricType = this.$props.Question.metricTypeId;
      this.OriginalMetricType = this.$props.Question.metricTypeId;
      this.QuestionTypeId = questionType
      this.OriginalQuestionType = questionType;
    },
    computed: {
      ShowSingleRowEdits() {
        /*var isQuestionTypeChange = this.QuestionTypeId != this.OriginalQuestionType;*/

        return this.QuestionTypeId != 1;
      },
      IsQuestionTypeChange() {
        return this.QuestionTypeId != this.OriginalQuestionType;
      }
    },
    methods: {
      Test() {
        alert('');
      },
      DeleteOption() {
        this.HardDelete = false;
        this.DeleteOptions = true;
      },
      SetQuestionOptions() {

        //If it is an open ended question, then remove options 
        if (this.QuestionTypeId == 3) {
          this.QuestionOptions = [];
          this.editingRows = [];
        }

        //if the original question type was a single select then reset the default options
        if (this.QuestionTypeId == 1) {
            this.SetSingleSelectDefaults();
            return false;
        }

        if (this.QuestionTypeId == 4) {
          this.SetOptionSingleSelect()
        }

        //If it is a multiple choice question
        if (this.QuestionTypeId == 2) {
           this.SetMultipleOptions();
           this.AddingNewOptions = true;
         }
      },
      async UpdateQuestionMetricType() {
        var self = this;
        await this.$http.post('/Questions/UpdateMetricType', {
          MetricType: self.MetricType,
          QuestionIds: [self.$props.Question.id],
        }).then(function (response) {
          if (response.data.success) {
            self.$emit("RefreshQuestions", [self.$props.Question.id])
          }
        })
      },
      SetOptionSingleSelect() {
        var self = this;
        var options = [];

        debugger;

        if (this.IsQuestionTypeChange && this.MetricType == 1000) {

          var defaults = this.$props.OptionDefaults.filter(c => c.questionTypeId == 4 && c.metricTypeId == this.MetricType);

          for (var v = 0; v < defaults.length; v++) {

            var newRecord = defaults[v];

            var stateOption = {
              OptionValue: newRecord.optionValue,
              OptionOrder: newRecord.optionOrder,
              OptionDescription: `Option # ${newRecord.optionOrder}`,
              QuestionId: this.$props.Question.id,
              QuestionOptionId: null,
              DefaultOptionId: newRecord.defaultId
            }
            options.push(stateOption)
          }
          self.QuestionOptions = options.map(c => c)
          self.editingRows = self.QuestionOptions;
        }
        else {

          if (this.OriginalQuestionType == 1)
            options = [];
          else
            options = this.OriginalQuestionOptions.map(c => c)

          self.QuestionOptions = options
        }
      },
      SetMultipleOptions() {
        debugger;

        var defaultQuestion = this.$props.OptionDefaults.filter(x => x.questionTypeId == this.QuestionTypeId && x.metricTypeId == this.MetricType)[0];

        if (this.OriginalQuestionOptions.length && this.OriginalQuestionType != 1) {

          if (this.OriginalQuestionType != this.QuestionTypeId) {
            for (var i = 0; i < this.OriginalQuestionOptions.length; i++) {
              this.OriginalQuestionOptions[i].DefaultOptionId = defaultQuestion.defaultId;
               }
          }
          this.QuestionOptions = this.OriginalQuestionOptions.map(c => c)
        }
        else {
          this.QuestionOptions = []
        }
      },
      SetSingleSelectDefaults() {
        var self = this;
        var options = []; 

        if (this.OriginalQuestionOptions.length == 0 || this.OriginalQuestionType != 1) {
          for (var v = 0; v < this.$props.OptionDefaults.filter(c => c.questionTypeId == 1).length; v++) {

            var newRecord = this.$props.OptionDefaults[v];

            var stateOption = {
              OptionValue: newRecord.optionValue,
              OptionOrder: newRecord.optionOrder,
              OptionDescription: newRecord.optionDescription,
              QuestionId: this.$props.Question.id,
              QuestionOptionId: null,
              DefaultOptionId: newRecord.defaultId
            }
            options.push(stateOption)
            /*this.AddingNewOptions = true;*/
          }
        }
        else {
          options = this.OriginalQuestionOptions.map(c => c)
        }
        self.editingRows = [];
        self.QuestionOptions = options.map(c => c);
      },
     async DeleteQuestionOptions() {
        var self = this;
        self.IsDeleteing = true;

        var selectedUnaddedOptions = this.SelectedQuestionOptions.filter(c => c.QuestionOptionId == null)
        for (var i = 0; i < selectedUnaddedOptions.length; i++) {
          this.QuestionOptions.splice(this.QuestionOptions.findIndex(a => a.OptionOrder === selectedUnaddedOptions[i].OptionOrder), 1)
        }
        var removeableOptions = this.SelectedQuestionOptions.filter(c => c.QuestionOptionId != null);

        if (removeableOptions.length != 0) {
          await this.$http.post('/Questions/DeleteQuestionOptions', {
            IsHardDelete: self.HardDelete,
            QuestionOptionIds: self.SelectedQuestionOptions.filter(c => c.QuestionOptionId != null).map(c => c.QuestionOptionId)
          }).then(function (response) {
            return response;
          }).then((response) => {
            if (response.data.success) {
              self.$toast.add({ severity: 'success', detail: `Successfully Removed Options`, life: 3000 });
              self.IsDeleteing = false;
              self.GetOptions();
              self.DeleteOptions = false;
              self.SelectedQuestionOptions = [];
            }
            else {
              self.$toast.add({ severity: 'error', detail: `Error Removing Options`, life: 3000 });
              self.IsDeleteing = false;
            }
          });
        }
        else {
          self.IsDeleteing = false;
          self.DeleteOptions = false;
          self.$toast.add({ severity: 'success', detail: `Successfully Removed Options`, life: 3000 });
        }
      },
     ResetChanges() {
        this.QuestionTypeId = this.OriginalQuestionType;
        this.QuestionOptions = this.OriginalQuestionOptions.map(c => c)
        this.AddingNewOptions = false;
        this.IsRankedQuestion = this.$props.Question.isRanked;
        this.SelectedQuestionOptions = [];
        this.editingRows = [];
      },
     async AddOptions() {
        if (this.QuestionTypeId == 1) {
          this.SetSingleSelectDefaults()
        }
        if (this.QuestionTypeId == 2 || this.QuestionTypeId == 4)
        {
          if (this.IsRankedQuestion) {
            this.SetMultipleOptions();
          }
          else {
            this.NewOptions = [];
            this.AddNewOptions = true;
          }
        }
      },
     async AddQuestionOptions() {
        var self = this;
        self.AddingOptions = true;

       var defaultQuestion = this.$props.OptionDefaults.filter(x => x.questionTypeId == this.QuestionTypeId && x.metricTypeId == this.MetricType)[0];

        var optionOrder = 1;
        for (var i = 0; i < self.NewOptions.length; i++) {
          var record = self.NewOptions[i];
          var questionOption = {
            OptionOrder: optionOrder,
            OptionDescription: record,
            QuestionId: self.$props.Question.id,
            QuestionOptionId: null,
            DefaultOptionId: defaultQuestion.defaultId,
            IsOptOut: false,
            IsCommentTriggering: false
          }
          self.QuestionOptions.push(questionOption);
          optionOrder = optionOrder += 1;
        }
        optionOrder = 1;
        for (var o = 0; o < self.QuestionOptions; o++) {
          self.QuestionOptions[0].OptionOrder = optionOrder;
          optionOrder +=1
        }
        self.UpdateOptions(self.QuestionOptions, false);
      },
     async onRowEditSave(event) {
       let { newData, index } = event;
       debugger;
       var self = this;
       self.QuestionOptions[index] = newData;
       self.UpdateOptions(self.QuestionOptions, true, index)
      },
     async UpdateOptions(QuestionOptions, IsBulkUpdate, editIndex) {

        var self = this;
        self.IsSaving = true;
        debugger;
        var isQuestionTypeChange = this.QuestionTypeId == this.OriginalQuestionType ? false : true;
        
        var options = QuestionOptions == null ? self.QuestionOptions : QuestionOptions

        await this.$http.put('/Questions/UpdateOptions', {
          QuestionType: self.QuestionTypeId,
          QuestionId: self.$props.Question.id,
          QuestionOptions: options,
          IsQuestionTypeChange: isQuestionTypeChange,
          IsBulkUpdate: IsBulkUpdate
        }).then(function (response) {
          return response;
        }).then((response) => {
          if (response.data.success) {
            self.$toast.add({ severity: 'success', detail: `Successfully Updated Option`, life: 3000 });
            self.AddingOptions = false;
            self.AddNewOptions = false;
            self.IsSaving = false;
            self.GetOptions();

            if (editIndex == null || editIndex == undefined) {
              self.editingRows = [];
            }

            if (isQuestionTypeChange) {
              self.OriginalQuestionType = this.QuestionTypeId
              self.$emit("RefreshQuestions", [self.$props.Question.id])
            }
          }
          else {
            self.AddNewOptions = false;
            self.IsSaving = false;
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
                await self.$http.post("Questions/GetQuestionOptions", { QuestionIds: [this.$props.Question.id]}).then(function (response) {
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
                            QuestionId: self.$props.Question.id,
                            QuestionOptionId: record.questionOptionId,
                            DefaultOptionId: record.defaultOptionId,
                            IsOptOut: record.isOptOut,
                            IsCommentTriggering: record.isCommentTriggering,
                          }
                          options.push(questionOption);
                          optionOrder = optionOrder += 1;
                        }
                        self.QuestionOptions = options;
                        self.OriginalQuestionOptions = options.map(x => x);
                      }
                      else {
                         console.log('Error Loading')
                      }
                    });
            },
      SetOptionColor(OptionValue) {

        var color = "#01579B";

        if (this.MetricType == 1000) {

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