<template>
  <div class="container p-5">
    <div class="grid mt-5  scalein animation-duration-500">
      <div class="col-4 flex align-items-center justify-content-center mx-auto surface-section">
        <div class="surface-section w-full">
          <div class="flex align-items-center justify-content-center">
            <img src="https://inclusologyblobstorage.blob.core.windows.net/inclusologywebappassets/CurrentLogoColor.png" alt="Image" height="150" class="mb-1 flex align-items-center" @click="Home" style="cursor:pointer">
          </div>

          <div class="col-12" v-if="!IsTokenValid">
            <InlineMessage :severity="Msg.Severity" class="mb-2 w-full"> {{Msg.Content}}  </InlineMessage>
          </div>

          <div class="grid p-2" v-if="!IsTokenValid">
            <div class="col-6">
              <Button label="Cancel" icon="pi pi-arrow-circle-left" iconPos="left" class="mr-2 w-full p-button-secondary p-button-outlined" @click="LoginHome" />
            </div>
            <div class="col-6">
              <Button label="Resend Link" icon="pi pi-arrow-circle-right" iconPos="right" class="mr-2 w-full p-button-secondary" @click="ResendLink" :disabled="Setting" :loading="Setting" />
            </div>
          </div>


          <div class="flex align-items-center justify-content-center" v-if="IsTokenValid">
            <span class="text-900 text-2xl font-medium mb-3 header" style="color: #765d50 !important; cursor:pointer;">
              {{Message}}
            </span>
          </div>
          <div class="col-12" v-if="IsTokenValid">
            <InlineMessage severity="error" v-if="v$.Password.$error" class="mb-2 w-full">{{ v$.Password.$errors[0].$message }}</InlineMessage>
          </div>
          <div class="col-12" v-if="IsTokenValid">
            <Password v-model="state.Password" toggleMask class="mb-2 w-full" @blur="v$.Password.$validate()">
              <template #header>
                <h6>Pick a password</h6>
              </template>
              <template #footer="sp">
                {{sp.level}}
                <Divider />
                <p class="mt-2">Suggestions</p>
                <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                  <li>At least one lowercase</li>
                  <li>At least one uppercase</li>
                  <li>At least one numeric</li>
                  <li>Minimum 8 characters</li>
                </ul>
              </template>
            </Password>
          </div>
          <div class="grid p-2" v-if="IsTokenValid">
            <div class="col-6">
              <Button label="Cancel" icon="pi pi-arrow-circle-left" iconPos="left" class="mr-2 w-full p-button-secondary p-button-outlined" @click="LoginHome" />
            </div>
            <div class="col-6">
              <Button :label="ActionMessage" icon="pi pi-arrow-circle-right" iconPos="right" class="mr-2 w-full p-button-secondary" @click="Submit" :disabled="Setting" :loading="Setting" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Toast />
</template>

<style>
  body {
    overflow-y: hidden
  }

  .p-inputtext{
    width: 100%
  }
</style>

<script>
  import useVuelidate from '@vuelidate/core'
  import { required, helpers } from '@vuelidate/validators'
  import { reactive, computed } from 'vue'

    export default {
        data: () => ({
            Username: null,
            ShowResend: false,
            Message: null,
            ActionMessage: null,
            Setting: false,
            IsTokenValid:null,
        Msg: {
          Severity: null,
          Content: null
         }
        }),
        computed: {
            params() {
                return {
                    Username: this.Username,
                }
            }
    },
    setup() {
      const isStrongPassword = helpers.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)

      const state = reactive({
        Password: null,
      })
      const rules = computed(() => {
        return {
          Password: {required:helpers.withMessage("You Must Specify A Password", required), isStrongPassword: helpers.withMessage("Password Must Meet The Strong Specifications", isStrongPassword) },
        }
      });

      const v$ = useVuelidate(rules, state)
      return { state, v$ }
    },
    async created() {
      var self = this;
     this.$store.RevokeToken();
     await this.$http.post('/Authorization/ValidateToken', {
        UserName: this.$route.query.User,
        Token: this.$route.query.token
      }).then(function (response) {
        if (response.data.success) {
          if (!response.data.isValid) {
            self.IsTokenValid = false;
            self.Msg.Severity = "error"
            self.Msg.Content = "Looks Like This Link Is Expired"
          }
          else {
            self.IsTokenValid = true;
          }
        }
      })

      if (self.IsTokenValid) {
        if (this.$route.query.IsPw == "true") {
          this.Message = 'Create Your New Password'
          this.ActionMessage = "Reset Password"
        }
        else {
          this.Message = "Complete Your Inclusology Signup"
          this.ActionMessage = "Complete Signup"
        }
      }
    },
    methods: {
      LoginHome() {
      this.$router.push('/Login')
      },
      async ResendLink() {

        var self = this;
        self.Setting = true;

        this.$http.post('/Authorization/ForgotPassword', { UserName: self.$route.query.User, SignUp: this.$route.query.IsPw ? false : true }).then(function (response) {
          if (response.data.success) {
            self.Setting = false;
            self.Msg.Severity = "success";
            self.Msg.Content = self.$route.query.IsPw ? "A Reset Link Has Been Sent To Your Email" : "A New Sign Up Email Has Been Sent";
          }
          else {
            self.Setting = false;
            self.Msg.Severity = "error";
            self.Msg.Content = self.$route.query.IsPw ? "Error Sending Reset Link" : "Error Sending Signup Email";
          }
        })
      },
      async Submit() {
                var self = this;
           
              self.Setting = true;
              await this.$http.post('/Authorization/SignUp',
              {
                UserName: self.$route.query.User,
                Token: self.$route.query.token,
                Password: self.state.Password
              }).then(function (response) {
                if (response.data.success) {
                  if (response.data.isAuthenticated) {
                    self.$toast.add({ severity: 'success', detail: 'Success', life: 3000 });
                    setTimeout(() => {
                      var stateData = {
                        token: response.data.tokenization.token,
                        userName: response.data.userName,
                        isAuthenticated: true,
                        role: response.data.getUser.roleId,
                        organizationId: response.data.getUser.organizationId
                      };

                      self.$store.SetAuth(stateData);
                      var getUserHomePage = self.$store.user.homepage;
                      self.$router.push(getUserHomePage)

                    }, 1500)
                  } 
                }
                else {
                  self.$toast.add({ severity: 'error', detail: 'Error Processing Your Request', life: 3000 });
                }
                self.Setting = false;
              })
            },
        }
    }
</script>
