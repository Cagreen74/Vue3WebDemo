<template>
  <div class="flex h-full scalein animation-duration-500">
    <div class="hidden md:block w-6 bg-no-repeat bg-cover" style="background-image: url('https://inclusologyblobstorage.blob.core.windows.net/inclusologywebappassets/iStock-1373203602.jpg') "></div>
    <div class="surface-section w-full md:w-6 p-6 md:p-8">
      <div class="flex align-items-center justify-content-center">
        <img src="/img/sparkfish.png" alt="Image"  class="my-0 py-0 flex align-items-center" @click="Home" style="max-height: 100px; cursor: none;">
      </div>
      <div class="flex align-items-center justify-content-center my-5">
        <i class="pi pi-plus"  style="cursor: none; font-size: 4rem" > </i>
      </div>
      <div class="flex align-items-center justify-content-center">
        <img src="https://dynavisionweb.com/images/DynaVisionLogoLg.png" alt="Image"  class="mb-5 flex align-items-center" @click="Home" style="cursor:none; max-height:100px; max-width: 300px" >
      </div>
      <div class="flex align-items-center justify-content-center">
        <span class="text-900 text-3xl font-medium mt-5 header" style="color: #765d50 !important;">
          My Little Demo Login
        </span>
      </div>
      <div>
        <Message severity="error" v-if="IsLoginFailure">{{FailureMessage}}</Message>
        <label for="email2" class="block text-900 font-medium mb-2">Email</label>
        <InputText id="email2" type="text" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" @blur="v$.Email.$validate()" v-model="state.Email" />
        <InlineMessage severity="error" v-if="v$.Email.$errors[0]" class="w-full">{{ v$.Email.$errors[0].$message  }}</InlineMessage>
        <label for="Password" class="block text-900 font-medium mb-2 mt-4">Password</label>
        <Password id="Password" :feedback="false" :toggleMask="true" @blur="v$.Password.$validate()" v-model="state.Password" inputClass="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full">
        </Password>
        <InlineMessage severity="error" v-if="v$.Password.$errors[0]" class="w-full">{{ v$.Password.$errors[0].$message }}</InlineMessage>
        <div class="flex align-items-center justify-content-between mb-6">
          <div class="flex align-items-center">
            <Checkbox id="rememberme2" :binary="true" v-model="RememberMe" class="mr-2 mt-2"></Checkbox>
            <label for="rememberme2">Remember me</label>
          </div>
          <a class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer" @click="ForgotPassword">Forgot password?</a>
        </div>
        <Button iconPos="right" :label="BtnText" icon="pi pi-arrow-circle-right" class="w-full p-md-3 text-white" :disabled="v$.$invalid" :loading="IsLoggingIn" @click="SignIn" style="color:white !important"></Button>
      </div>
    </div>
  </div>
</template>

<style >

  html, body, #app{
    height:100%;
  }

  .p-checkbox .p-checkbox-box.p-highlight {
    border-color: #c0a58d !important;
    background: #c0a58d !important;
  }

  .p-checkbox-box:not(.p-checkbox-disabled) .p-checkbox-box:hover {
    border-color: #cb8c84 !important;
  }

  .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box:hover {
    border-color: #cb8c84 !important;
  }

  .p-checkbox-box:not(.p-checkbox-disabled) .p-checkbox-box.p-focus {
    border-color: #cb8c84 !important;
    box-shadow: 0 0 0 0.2rem #ced4da !important;
  }
</style>

<style scoped>

  body {
    overflow-y: hidden !important;
  }

  html {
    height: 100% !important;
  }


  .p-inputwrapper {
    width: 100% !important;
  }

  .p-button {
    color: white;
    background: black !important;
    border-color: black !important;
  }

      .p-button:enabled:hover {
        background: grey !important;
        color: #ffffff;
        border-color: #cb8c84;
      }

   

  .p-checkbox .p-checkbox-box.p-highlight {
    border-color: #c0a58d !important;
    background: #c0a58d !important;
  }
</style>

<script>


  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import Checkbox from 'primevue/checkbox';
  import useVuelidate from '@vuelidate/core'
  import { required, email, helpers } from '@vuelidate/validators'
  import { reactive, computed } from 'vue'
  import Password from 'primevue/password';
  import Message from 'primevue/message';


  export default {
    name: 'LoginHome',
    props: ['redirect'],
    components: {
      Button,
      InputText,
      Checkbox,
      Password,
      Message
    },
    data: () => ({
      RememberMe: true,
      IsLoggingIn: false,
      BtnText: 'Sign In',
      FailureMessage: null,
      IsLoginFailure: false
    }),
    created() {
      this.$emit("set-nav", this.$route)
    },
    setup() {
      const state = reactive({
        Email: '',
        Password: ''
      })
      const rules = computed(() => {
        return {
          Email: {
            required: helpers.withMessage("Email Address Is Required", required), email: helpers.withMessage("Input Must Be A Valid Email Address", email) },
            Password: { required: helpers.withMessage("You Must Specify A Password", required)},
        }
      });

      const v$ = useVuelidate(rules, state)
      return { state, v$}
    },
    methods: {
      Home() {
        this.$router.push('/')
      },
      ForgotPassword() {
        this.$router.push('/ForgotPassword')
      },
     async SignIn() {

        var self = this;
        self.IsLoginFailure = false;
        self.IsLoggingIn = true;
        self.BtnText = "Signing In.."

        self.loginSuccess = true;

       await self.$http.post('/Authentication/SignIn', { UserName: self.state.Email, Password: self.state.Password }).then(function (response) {

          if (!response.data.isAuthenticated) {
            self.IsLoggingIn = false;
            self.IsLoginFailure = true;
            self.FailureMessage = response.data.message
            self.BtnText = "Sign In"
            self.state.Password = '';
            self.v$.Password.$reset();
          }
          else {
            self.stateData = {
              token: response.data.security.token,
              userName: response.data.user.email,
              firstName: response.data.user.firstName,
              lastName: response.data.user.lastName,
              isAuthenticated: true,
              role: response.data.user.role,
            };
            self.$store.SetAuth(self.stateData);
            debugger;  // eslint-disable-line no-debugger
            var homePage = self.$store.user.homepage;
            self.IsLoggingIn == false;

            var redirect = self.$route.query.redirect == null ? homePage : self.$route.query.redirect;
            self.$router.push({ path: redirect })
          }
        })
      }
    }
  }
</script>