
<template>
  <div class="grid">
    <div class="col-12">
      <InputText type="text" v-model="OrgName" placeholder="Organization Name" class="w-full" @input="v$.OrgName.$touch()"/>
      <InlineMessage severity="error" class="w-full mt-1" v-if="v$.OrgName.$invalid">
        {{ v$.OrgName.$errors[0].$message}}
      </InlineMessage>
    </div>
    <div class="col-12">
      <InputText type="text" v-model="EmailContact" placeholder="Contact Email" class="w-full" @input="v$.EmailContact.$touch()"/>
      <InlineMessage severity="error" class="w-full mt-1" v-if="v$.EmailContact.$invalid">
        {{ v$.EmailContact.$errors[0].$message}}
      </InlineMessage>
    </div>
    <div class="col-12">
      <InputText type="text" v-model="OrgNumber" placeholder="Contact Telephone #" class="w-full" />
    </div>
    <Divider></Divider>
    <div class="col-12">
      <Dropdown v-model="OrganizationSize" :options="OrganizationCategories" optionLabel="sizeCatDescription" optionValue="organizationSizeCategoryId" placeholder="Size Category" class="w-full" 
                @input="v$.OrganizationSize.$touch()"
                />
      <InlineMessage severity="error" class="w-full mt-1" v-if="v$.OrganizationSize.$invalid">
        {{ v$.OrganizationSize.$errors[0].$message}}
      </InlineMessage>
    </div>
    <div class="col-12">
      <Dropdown v-model="ActiveStatus" :options="OrgStatuses" optionLabel="organizationStatusDescription" optionValue="organizationStatusId" placeholder="Active Status" class="w-full" />
    </div>
    <div class="col-12">
      <InputText type="text" v-model="ActualSize" placeholder="Actual Size" class="w-full"  @input="v$.ActualSize.$touch()" @blur="v$.ActualSize.$touch()"/>
      <InlineMessage severity="error" class="w-full mt-1" v-if="v$.ActualSize.$invalid">
        {{ v$.ActualSize.$errors[0].$message}}
      </InlineMessage>
    </div>
  </div>
  <div class="grid mt-2">
    <div class="col-12">
      <FileUpload @before-upload="SetFile" @select="SetFile" @remove="ClearLogo" :multiple="false" accept="image/*" :maxFileSize="1000000" :auto="false" :showUploadButton="false" :showCancelButton="false" name="demo[]" v-model="File" ref="Upload">
        <template #empty>
          <p>Drag and drop files to here to upload.</p>
        </template>
      </FileUpload>
    </div>
    <div class="col-12 flex align-items-center justify-content-center">
      <img :src="PreviewUrl" style="max-height: 75px; max-width: 100%" v-if="Logo" />
      <Skeleton width="100%" height="100%" v-if="!Logo"></Skeleton>
    </div>
    <Divider />

  </div>
    <div class="col-11 flex justify-content-end">
      <Button label="Close" icon="pi pi-times" @click='CloseDialog' class="p-button-text p-button-danger" />
      <Button label="Update" icon="pi pi-check" autofocus class="p-button-secondary" @click="UpdateOrganization" :loading="IsUpdating" />
    </div>
</template>

<style scoped>
  .p-button:focus {
    box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #607d8b, 0 1px 2px 0 black;
  }
  .p-button {
    color: #FFFFFF;
    background: #607d8b;
    border: 1px solid #607d8b;
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
    border-radius: 6px;
  }
  .p-fileupload-choose:not(.p-disabled):hover {
    background: #9e9e9e;
    color: #ffffff;
    border-color: #9e9e9e;
  }
</style>


<script>

  import useVuelidate from '@vuelidate/core'
  import { required, email, helpers, numeric } from '@vuelidate/validators'

   var originalLogo;
  /* eslint-disable no-debugger */
    export default  {
    name: 'EditOrganization',
    props: ['EditRecord', 'OrganizationCategories', 'OrgStatuses', 'IsUpdating'],
    data: () => ({
      ActiveStatus: null,
      EmailContact: null,
      OrganizationSize: null,
      OrgName: null,
      OrgNumber: null,
      Logo: null,
      Modules: [],
      ActualSize: null,
      OrgId: null,
      File: [],
      PreviewUrl: null
    }),
    setup: () => ({ v$: useVuelidate() }),
    validations() {
      return {
        OrgName: {
          required: helpers.withMessage("Organization name is required", required)
        },
        EmailContact: {
          required: helpers.withMessage("An email contact is required", required),
          email: helpers.withMessage("Email address is not valid", email)
        },
        OrganizationSize: {
          required: helpers.withMessage("Must assign a organization size category", required)
        },
        ActualSize: {
          numeric: helpers.withMessage("Size must be a numeric value", numeric),
          required: helpers.withMessage("Must specify the organization size", required)
        }
      }
    },
    created() {
      this.ActiveStatus = this.EditRecord.organizationStatusId;
      this.EmailContact = this.EditRecord.email;
      this.OrgNumber = this.EditRecord.contactNumber;
      this.OrganizationSize = this.EditRecord.orgSizeId;
      this.OrgName = this.EditRecord.orgName;
      this.ActualSize = this.EditRecord.actualSize;
      this.OrgId = this.EditRecord.orgId;
      this.Logo = this.EditRecord.logoUrl
      this.PreviewUrl = this.EditRecord.logoUrl
      originalLogo = this.EditRecord.logoUrl
    },
    methods: {
      async UpdateOrganization() {
        var isValid = await this.v$.$validate();

        if (isValid) {

          this.$emit('UpdateOrg',
            [{
              OrgName: this.OrgName,
              Email: this.EmailContact,
              ContactNumber: this.OrgNumber,
              OrgId: this.OrgId,
              OrganizationStatus: this.ActiveStatus,
              OrganizationSizeId: this.OrganizationSize,
              ActualSize: this.ActualSize,
              LogoUrl: this.Logo
            }],
            this.File
          )
        }
      },
      async SetFile() {
        var self = this;
        var file = self.$refs.Upload.files[0];
        self.PreviewUrl = file.objectURL;
        self.Logo = file.name;
        self.File = file;
      },
      ClearLogo() {
        this.File = '';
        this.Logo = originalLogo
        this.PreviewUrl = originalLogo
      },
      CloseDialog() {
        this.$emit('CloseDialog')
      }
    }
  };

</script>