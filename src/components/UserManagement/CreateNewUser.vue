<template>
  <div class="card my-0 py-0">
    <DataTable :value="state.NewUsers" responsiveLayout="scroll" dataKey="Index" class="my-0 py-0">
      <template #header>
        <div class="table-header flex justify-content-end">
          <Button icon="pi pi-plus" @click="AddNewUser"  v-tooltip.left="'Add New Row'"/>
          <Button icon="pi pi-check" class="ml-1 p-button-secondary mr-4" v-tooltip.top="'Save New Users'" @click="SaveUsers" :loading="IsCreatingUsers" :disabled="IsCreatingUsers"/>
        </div>
      </template>
      <Column field="FirstName" header="First Name">
        <template #body="slotProps">
          <InputText type="text" v-model="state.NewUsers[slotProps.data.Index].FirstName" class="w-full" />
          <div v-if="v$.NewUsers.$dirty && v$.NewUsers.$each.$response.$errors[slotProps.data.Index].FirstName.length != 0">
            <InlineMessage severity="error" class="w-full mt-1" v-for="error in v$.NewUsers.$each.$response.$errors[slotProps.data.Index].FirstName" :key="error">
              {{ error.$message }}
            </InlineMessage>
          </div>
        </template>
      </Column>
      <Column field="LastName" header="Last Name">
        <template #body="slotProps">
          <InputText type="text" v-model="state.NewUsers[slotProps.data.Index].LastName" class="w-full" />
          <div v-if="v$.NewUsers.$dirty && v$.NewUsers.$each.$response.$errors[slotProps.data.Index].LastName.length != 0">
            <InlineMessage severity="error" class="w-full mt-1" v-for="error in v$.NewUsers.$each.$response.$errors[slotProps.data.Index].LastName" :key="error">
              {{error.$message}}
            </InlineMessage>
          </div>
        </template>
      </Column>
      <Column field="Email" header="Email">
        <template #body="slotProps">
          <InputText type="text" v-model="state.NewUsers[slotProps.data.Index].Email" class="w-full" />
          <div v-if="v$.NewUsers.$dirty && v$.NewUsers.$each.$response.$errors[slotProps.data.Index].Email.length != 0">
            <InlineMessage severity="error" class="w-full mr-1 mt-1" v-for="error in v$.NewUsers.$each.$response.$errors[slotProps.data.Index].Email" :key="error">
              {{ error.$message}}
            </InlineMessage>
          </div>
        </template>
      </Column>
      <Column field="RoleId" header="Role">
        <template #body="slotProps">
          <Dropdown v-model="state.NewUsers[slotProps.data.Index].RoleId" :options="Roles" dataKey="typeId" optionValue="id" optionLabel="name" class="w-full" v-on:change="UpdateOrganization(slotProps.data.Index, state.NewUsers[slotProps.data.Index].RoleId)" />
          <div v-if="v$.NewUsers.$dirty && v$.NewUsers.$each.$response.$errors[slotProps.data.Index].length != 0">
           
          </div>
        </template>
      </Column>

      <Column field="OrganizationId" header="Organization">
        <template #body="slotProps">
          <Dropdown v-model="state.NewUsers[slotProps.data.Index].OrganizationId" :options="Organizations" dataKey="orgId" optionValue="orgId" optionLabel="orgName"
                    placeholder="Select Organization"
                    class="w-full" :disabled="state.NewUsers[slotProps.data.Index].DisableOrg" />
          <div v-if="v$.NewUsers.$dirty && v$.NewUsers.$each.$response.$errors[slotProps.data.Index].OrganizationId != 0">
            <InlineMessage severity="error" class="w-full mr-1 mt-1" v-for="error in v$.NewUsers.$each.$response.$errors[slotProps.data.Index].OrganizationId" :key="error">
              {{ error.$message}}
            </InlineMessage>
           </div>
        </template>
      </Column>

      <Column field="SendInvitation" header="Send Invitation">
        <template #body="slotProps">
          <SelectButton v-model="state.NewUsers[slotProps.data.Index].SendInvitation" :options="YesOrNo" aria-labelledby="Edu" optionValue="value" optionLabel="text" />
        </template>
      </Column>
      <Column field="SendInvitation" header="">
        <template #body="slotProps">
          <Button icon="pi pi-trash" class="p-button-rounded p-button-danger mr-2" v-tooltip.left="'Remove'" @click="RemoveUser(slotProps.data.Index)" :disabled="state.NewUsers.length == 1" />
        </template>
      </Column>
      <template #footer>
      </template>
    </DataTable>
  </div>
</template>


<script>
  import useVuelidate from '@vuelidate/core'
  import { required, email, helpers } from '@vuelidate/validators'
  import { reactive, computed } from 'vue'
  import axios from 'axios'
  import { createPinia } from 'pinia'
  import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
  import { vueStore } from '../../plugins/store.js';

  const pinia = createPinia()
  const installPersistedStatePlugin = createPersistedStatePlugin()
  pinia.use((context) => installPersistedStatePlugin(context))
  const store = vueStore();

  const instance = new axios.create({
    baseURL: 'https://localhost:44391/api',
    headers: {
      'X-Frame-Options': 'ALLOWALL',
      'Content-Type': 'application/json'
    }
  });

  instance.interceptors.request.use(
    config => {
      config.headers['Authorization'] = 'Bearer ' + store.user.token;
      return config;
    }
  );


  const { withAsync } = helpers
  var existingUsers = null;
 
  /* eslint-disable no-debugger */
  var CreateUser = ({
    name: 'CreateNewUser',
    props: ['Users', 'Organizations', 'Roles', 'YesOrNo','IsCreatingUsers', 'CurrentUsers'],
    data: () => ({
    }),
    setup(props) {
      
     const rules = computed(() => ({
        NewUsers: {
          $each: helpers.forEach({
            FirstName: {
              required: helpers.withMessage("First name is required", required)
            },
            LastName: {
              required: helpers.withMessage("Last name is required", required)
            },
            Email: {
              required: helpers.withMessage("Email is required", required),
              email: helpers.withMessage("Email address is not valid", email),
              emailValid: withAsync(helpers.withMessage("This email is taken", emailValid))
            },
            OrganizationId: {
              required: helpers.withMessage("Must assign a organization", required),
             }
          })
         }
      }))
        
     const state = reactive({
        NewUsers: [
        ]
     })

      existingUsers = reactive(props.CurrentUsers);
      const v$ = useVuelidate(rules, state)
      return { v$, state }
    },
    created() {
      this.state.NewUsers = this.Users
      this.ExistingUsers = this.CurrentUsers
    },
    methods: {
      AddNewUser: function () {
       this.$emit("AddNewUser")
      },
      async SaveUsers () {
        var validate = await this.v$.NewUsers.$validate();

        if(validate)
        this.$emit("CreateUsers")
      },
      RemoveUser(index) {
        this.$emit("RemoveUser", index)
      },
      UpdateOrganization(index, RoleId) {
        this.$emit("UpdateOrganization", index, RoleId)
      },
    }
  })

  export default CreateUser;

  function emailValid(email) {

    if (email == null || email == '')
      return true;

    var isEmailTaken = !existingUsers.map(c => c.email.trim().toLowerCase()).includes(email.trim().toLowerCase())
    return isEmailTaken;
  }

</script>