<template>
  <div class="grid">
    <div class="col-12">
      <Panel>
        <div>
          <h5 class="text-center">Return Indexes In a Given Range</h5>
          <div class="grid">
            <div class="col-5 flex align-items-center justify-content-center">
              <div class="field">
                <h6 for="ranges">Select A Preselected Range</h6>
                <Dropdown v-model="DefaultRange" :options="DefaultRanges" optionLabel="rangeDescription" optionValue="rangeId" placeholder="Select a Range To Use" name="ranges" class="w-full"
                          :disabled="IsCustom" />
              </div>
            </div>
            <div class="col-2">
              <Divider layout="vertical">
                <ToggleButton v-model="IsCustom" onLabel="Custom Range" offLabel="Preselected Range" onIcon="pi pi-check" offIcon="pi pi-cog" />
              </Divider>
            </div>
            <div class="col-5 flex align-items-center justify-content-center">
              <div class="field">
                <h6 for="ranges">Set Your Own Range <Badge> {{CustomRangeText}}</Badge></h6>
                <Slider v-model="CustomRange" :range="true" name="Custom" :disabled="!IsCustom" :step="CustomRangeSettings.StepBy" :min="CustomRangeSettings.Minimum" :max="CustomRangeSettings.Maximum" />
              </div>
            </div>
          </div>
        </div>
        <div class="grid mt-2 scalein animation-duration-300" v-if="CustomRange.length != 0 || DefaultRange != null">
          <Divider align="center">
            <i class="pi pi-arrow-circle-down" style="font-size:2rem;"></i>
          </Divider>
          <div class="col-8 mx-auto">
            <h6 for="ranges">Select The Indexes To Return <b class="mr-2"><i>(4 Maximum Allowed & No Duplicates)</i></b> Press Enter or Tab to Add Values</h6>
            <div class="p-fluid">
              <Chips v-model="SelectedIndexs" separator="," class="w-full" :allowDuplicate="false" :max="4" @add="CheckChips" />
            </div>
          </div>
          <div class="col-8 mx-auto flex justify-content-end">
            <Button label="Get Indexes" class="p-button-rounded p-button-secondary" :loading="IsFetching" :disabled="IsFetching || (SelectedIndexs.length == 0 || (!CustomRange && DefaultRange == null))" @click="GetIndexes"/>
          </div>
        </div>

        <div class="col-12 scalein animation-duration-300" v-if="SearchedItems.length != 0" >
          <div style="height: calc(50vh - 80px)" class="mx-0 px-0">
            <DataTable :value="SearchedItems"
                       showGridlines
                       responsiveLayout="scroll"
                       :scrollable="true"
                       scrollHeight="flex">
              <template #header>
                Session Search History
              </template>
              <Column field="searchDisplay" header="Search Range"></Column>
              <Column field="requestedIndex" header="Requested Index">
                <template #body="{data}">
                  <Tag> {{data.requestedIndex}} </Tag>
                </template>
              </Column>
              <Column field="elementValue" header="Element Values"></Column>
              <Column field="" header="" style="max-width:70px">
                <template #body="{data}">
                  <i class="pi pi-times" style="color:red; cursor:pointer" @click="RemoveSearchedItem(data)" v-tooltip.left="'Remove This Item'"> </i>
                </template>
              </Column>
            </DataTable>
          </div>
       </div>
</Panel>
    </div>
  </div>

  <Dialog header="Invalid Entry" v-model:visible="ShowErrorDialog" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span> {{ErrorMessage}}</span>
    </div>
    <template #footer>
      <Button label="Got It" icon="pi pi-ban" @click="ShowErrorDialog = false" iconPos="right" />
    </template>
  </Dialog>

</template>

<style>
  .p-chips .p-chips-multiple-container .p-chips-token {
    padding: 0.25rem 0.5rem;
    margin-right: 0.5rem;
    background: #295cb5;
    color: white;
    border-radius: 16px;
  }
</style>

<script>export default {
    name: 'AdminDashboard',
    data: () => ({
      IsFetching: false,
      DefaultRange: null,
      SelectedIndexs: [],
      CustomRange: [],
      ShowErrorDialog: false,
      ErrorMessage:null,
      IsCustom: false,
      CustomRangeSettings: {
        Minimum: 100,
        Maximum: 2000,
        StepBy: 100
      },
      SearchedItems:[],
      DefaultRanges: null,
      SetRange: {
        RangeStart: 0,
        RangeEnd: 0,
      }
    }),
    watch: {
      IsCustom() {

        this.SelectedIndexs = [];

        if (this.IsCustom == true) {
          this.DefaultRange = null;
          this.CustomRange = [this.CustomRangeSettings.Minimum, this.CustomRangeSettings.Maximum]
        }
        else {
          this.CustomRange = [];
        }
      }
    },
    computed: {
      CustomRangeText() {

        if (this.CustomRange.length == 0)
              return "None Selected";

        var start = this.CustomRange[0] ? this.CustomRange[0] : "?";
        var end = this.CustomRange[1] ? this.CustomRange[1] : "?";

        var rangeLabel = this.CustomRange.length == 0 ? "None Selected" : `From ${start} to ${end}`;
        return rangeLabel;
      }
    },
    async created() {

      this.$emit("set-nav", this.$route)

      var self = this;
      await self.$http.get('/Range/RangeDefaults', null).then(function (response) {
        self.DefaultRanges = response.data;
        self.DefaultRange = self.DefaultRanges[0].rangeId;
      })
    },
    methods: {
      CheckChips(event) {
        var getEnteredValue = event.value.slice(-1);

        var maxAvailableElements = 0;

        if (this.IsCustom) {
          maxAvailableElements = (this.CustomRange[1] - this.CustomRange[0]);
        }
        else {
          var getRangeDefault = this.DefaultRanges.filter(c => c.rangeId == this.DefaultRange)[0]
           maxAvailableElements = (getRangeDefault.thresholdEnd - getRangeDefault.thresholdStart);
        }

        var isValidCharacters = this.ContainsOnlyNumbers(getEnteredValue);

        var parseEnteredValue = parseInt(getEnteredValue);
        var isInRange = parseEnteredValue <= maxAvailableElements;

        if (!isValidCharacters || !isInRange) {
            this.ErrorMessage = !isValidCharacters ? "Input must only contain digits. Element has been removed" : `This index is not in the range of the selected numbers. The maximum index allowed is ${maxAvailableElements}`
            this.ShowErrorDialog = true;
            var chipIndex = this.SelectedIndexs.findIndex(c => c == getEnteredValue);
            this.SelectedIndexs.splice(chipIndex, 1);
        }
      },

      RemoveSearchedItem(data) {
        var getIndex = this.SearchedItems.filter(c => c == data)[0]
        this.SearchedItems.splice(getIndex, 1);
      },
      async GetIndexes() {

        var self = this;

        this.IsFetching = true;

        var startRange = 0;
        var endRange = 0;
        var enumerationCount = 0;

        if (this.IsCustom) {
          startRange = this.CustomRange[0]
          endRange =  this.CustomRange[1]
          enumerationCount = (this.CustomRange[1] - this.CustomRange[0]);
        }
        else {
          var getDefaultRangeSetting = this.DefaultRanges.filter(c => c.rangeId == this.DefaultRange)[0];
          startRange = getDefaultRangeSetting.thresholdStart
          endRange = getDefaultRangeSetting.thresholdEnd 
          enumerationCount = (getDefaultRangeSetting.thresholdEnd - getDefaultRangeSetting.thresholdStart);
        }
        await self.$http.post('/Range/listify', {
          Start: startRange,
          End: endRange,
          EnumerationCount: enumerationCount + 1,
          ReturnIndexes: this.SelectedIndexs
        }).then(function (response) {
          for (var i = 0; i < response.data.length; i++) {
            self.SearchedItems.push(response.data[i]);
            self.SelectedIndexs = [];
          }
          self.IsFetching = false;
        })
      },
      ContainsOnlyNumbers(str) {
         return /^\d+$/.test(str);
      }
    }
  }</script>