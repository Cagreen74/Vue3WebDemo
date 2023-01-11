<template>
  <div class="grid">
    <div class="col-12 flex justify-content-end m-2">
      <Button icon="pi pi-plus" class="p-button-rounded p-button-primary" @click="AddRow" v-tooltip.top="'Add New Row'"/>
      <Button icon="pi pi-check" class="p-button-rounded p-button-outlined ml-2 mr-4" v-tooltip.top="'Save'" @click="CreateOrganizations" :disabled="IsUpdating" :loading="IsUpdating"/>
    </div>
    <div class="col-12">
        <Splitter style="max-height: 600px" v-for="(item, index) of state.NewOrgs" :key="index" class="scalein animation-duration-200 mb-5 shadow-2">
          <SplitterPanel :size="80">
            <Splitter layout="vertical">
              <SplitterPanel class="flex align-items-center justify-content-center" :size="15">
              Organization Details <Button icon="pi pi-times" class="p-button-rounded ml-2 p-button-sm p-button-danger" v-tooltip.top="'Remove Row'" @click="RemoveRow(index)" :disabled="state.NewOrgs.length == 1"/>
              </SplitterPanel>
              <SplitterPanel :size="85">
                <Splitter>
                  <SplitterPanel class="flex align-items-center justify-content-center" :size="20">
                     <img :src="PreviewUrls[index]" style="max-height: 75px; max-width: 100%" v-if="PreviewUrls[index]" />
                    <Skeleton width="90%" height="90%" v-if="!PreviewUrls[index]"></Skeleton>
                  </SplitterPanel>
                  <SplitterPanel class="flex align-items-center justify-content-center p-2" :size="80">
                    <div class="grid">
                      <div class="col-4">
                        <InputText type="text" v-model="item.OrgName" placeholder="Organization Name" class="w-full" />
                        <div v-if="v$.NewOrgs.$dirty && v$.NewOrgs.$each.$response.$errors[index].OrgName.length != 0">
                          <InlineMessage severity="error" class="w-full mt-1" v-for="error in v$.NewOrgs.$each.$response.$errors[index].OrgName" :key="error">
                            {{ error.$message }}
                          </InlineMessage>
                        </div>
                      </div>
                      <div class="col-4">
                        <InputText type="text" v-model="item.Email" placeholder="Contact Email" class="w-full" />
                        <div v-if="v$.NewOrgs.$dirty && v$.NewOrgs.$each.$response.$errors[index].Email.length != 0">
                          <InlineMessage severity="error" class="w-full mt-1" v-for="error in v$.NewOrgs.$each.$response.$errors[index].Email" :key="error">
                            {{ error.$message }}
                          </InlineMessage>
                        </div>
                      </div>
                      <div class="col-4">
                        <InputText type="text" v-model="item.ContactNumber" placeholder="Contact Telephone #" class="w-full" />
                      </div>
                      <div class="col-4">
                        <Dropdown v-model="item.OrganizationSizeId" :options="OrganizationCategories" optionLabel="sizeCatDescription" optionValue="organizationSizeCategoryId" placeholder="Size Category" class="w-full" />
                        <div v-if="v$.NewOrgs.$dirty && v$.NewOrgs.$each.$response.$errors[index].OrganizationSizeId.length != 0">
                          <InlineMessage severity="error" class="w-full mt-1" v-for="error in v$.NewOrgs.$each.$response.$errors[index].OrganizationSizeId" :key="error">
                            {{ error.$message }}
                          </InlineMessage>
                        </div>
                      </div>
                      <div class="col-4">
                        <Dropdown v-model="item.OrganizationStatus" :options="OrgStatuses" optionLabel="organizationStatusDescription" optionValue="organizationStatusId" placeholder="Active Status" class="w-full" />
                      </div>
                      <div class="col-4">
                        <InputText type="text" v-model="item.ActualSize" placeholder="Actual Size" class="w-full" />
                        <div v-if="v$.NewOrgs.$dirty && v$.NewOrgs.$each.$response.$errors[index].ActualSize.length != 0">
                          <InlineMessage severity="error" class="w-full mt-1" v-for="error in v$.NewOrgs.$each.$response.$errors[index].ActualSize" :key="error">
                            {{ error.$message }}
                          </InlineMessage>
                        </div>
                      </div>
                      <div class="col-12">
                        <FileUpload mode="advanced" name="upload[]" :ref="index + '_file'" accept="image/*" chooseLabel="Choose Logo" @select="SetFile(index)" :showUploadButton="false" :showCancelButton="false" :fileLimit="1" @remove="ClearLogo(index)"/>
                      </div>
                    </div>
                  </SplitterPanel>
                </Splitter>
              </SplitterPanel>
            </Splitter>
          </SplitterPanel>
        </Splitter>
      </div>
 </div>

</template>

<style scoped>
  .p-fileupload-choose:not(.p-disabled):hover {
    background: #9e9e9e;
    color: #ffffff;
    border-color: #9e9e9e;
  }
</style>


<script>
    import useVuelidate from '@vuelidate/core'
    import { required, email, helpers, numeric } from '@vuelidate/validators'
    import { reactive, computed } from 'vue'

  /* eslint-disable no-debugger */
  /* eslint-disable no-unused-vars */
    export default  {
    name: 'CreateNewOrganization',
    props: ['OrganizationCategories', 'OrgStatuses', 'IsUpdating'],
    data: () => ({
      NewOrgs:[],
      PreviewUrls: [],
      Files:[]
    }),
    setup() {
      const rules = computed(() => ({
        NewOrgs: {
          $each: helpers.forEach({
            OrgName: {
              required: helpers.withMessage("Organization name is required", required)
            },
            Email: {
              required: helpers.withMessage("An email contact is required", required),
              email: helpers.withMessage("Email address is not valid", email)
            },
            OrganizationSizeId: {
              required: helpers.withMessage("Must assign a organization size category", required),
            },
            ActualSize: {
              numeric: helpers.withMessage("Size must be a numeric value", numeric),
              required: helpers.withMessage("Must add the estimated size", required),
            }
          })
        }
      }))

      const state = reactive({
        NewOrgs: [
        ]
      })

      const v$ = useVuelidate(rules, state)
      return { v$, state }
    },
    created() {
      this.state.NewOrgs.push({
        OrganizationStatus : 1000,
        Email : null,
        OrgNumber : null,
        OrganizationSizeId : null,
        OrgName : null,
        ActualSize : null,
        OrgId : null,
        LogoUrl: null
      })
    },
    methods: {
      async CreateOrganizations() {

        var isValid = await this.v$.NewOrgs.$validate();

        if (isValid) {
          this.$emit('SaveOrgs',
            this.state.NewOrgs,
            this.Files,
            true)
        }
      },
      async SetFile(index) {
        var self = this;  
        var refName = index + "_file";
        var getRef = self.$refs[refName];
        var file = getRef[0].files[0];
        self.PreviewUrls[index] = file.objectURL;
        self.state.NewOrgs[index].LogoUrl = file.name;
        self.Files[index] = file;
      },
      AddRow() {
        this.state.NewOrgs.push({
          OrganizationStatus: 1000,
          Email: null,
          OrgNumber: null,
          OrganizationSizeId: null,
          OrgName: null,
          ActualSize: null,
          OrgId: null,
          LogoUrl: null
        })
      },
      ClearLogo(index) {
        this.Files[index] = '';
        this.NewOrgs[index].LogoUrl = null
        this.PreviewUrls[index] = null
      },
      CloseDialog() {
        this.$emit('CloseDialog')
      },
      RemoveRow(index) {
        this.state.NewOrgs.splice(index, 1);
        this.Files.splice(index, 1)
        this.PreviewUrls.splice(index,1)
      }
    }
  };

</script>