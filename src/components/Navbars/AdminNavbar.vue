<template>
  <div class="surface-overlay relative">
    <div class="py-3 lg:py-1 px-2 flex align-items-center justify-content-between lg:static">
      <img src="https://inclusologyblobstorage.blob.core.windows.net/inclusologywebappassets/CurrentLogoColor.png" alt="Image" height="70" class="mr-0 lg:mr-6" @click="Home" style="cursor:pointer">
      <div class="flex align-items-center">
        <a Ripple class="cursor-pointer block lg:hidden text-700 mr-5 p-ripple"
           StyleClass="{ selector: '@next', enterClass: 'hidden', leaveToClass: 'hidden', hideOnOutsideClick: true }">
          <i class="pi pi-ellipsis-v text-2xl"></i>
        </a>
        <a Ripple class="cursor-pointer block lg:hidden text-700 p-ripple"
           StyleClass="{ selector: '@next', enterClass: 'hidden', leaveToClass: 'hidden', hideOnOutsideClick: true }">
          <i class="pi pi-bars text-4xl"></i>
        </a>
      </div>
      <div id="navbar-sub-7" class="hidden lg:block absolute lg:static lg:w-auto w-full surface-overlay left-0 top-100 z-1 shadow-2 lg:shadow-none">
        <ul class="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row border-top-1 surface-border lg:border-top-none">
          <li>
            <a Ripple class="flex px-6 p-3 lg:px-3 align-items-center text-600 hover:text-900 hover:surface-100 font-medium border-round cursor-pointer transition-colors transition-duration-150 p-ripple"  v-tooltip.left="'My Profile'"  @click="MyProfile">
              <i class="pi pi-user text-base lg:text-2xl mr-2 lg:mr-0"></i>
            </a>
          </li>
          <li>
            <a Ripple class="flex px-6 p-3 lg:px-3 align-items-center text-600 hover:text-900 hover:surface-100 font-medium border-round cursor-pointer transition-colors transition-duration-150 p-ripple mr-2" v-tooltip.left="'Log Off'" @click="LogOff">
              <i class="pi pi-lock text-base lg:text-2xl mr-2 lg:mr-0"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div id="navbar-7" class="py-2 px-6 shadow-2 hidden lg:block absolute lg:static lg:w-auto w-full surface-overlay left-0 top-100 z-1 shadow-2">
      <ul class="list-none p-0 m-0 flex lg:align-items-center flex-column lg:flex-row select-none">
        <li>

          <router-link to="/AdminDashboard" Ripple class="flex p-3 align-items-center text-600 hover:text-900 hover:surface-100 font-medium border-round cursor-pointer transition-colors transition-duration-150 p-ripple">
            <i class="pi pi-home mr-2 mr-2"></i>
            <span>Home</span>
          </router-link>
        </li>
        <li>
          <router-link to="/ManageQuestions" Ripple class="flex p-3 align-items-center text-600 hover:text-900 hover:surface-100 font-medium border-round cursor-pointer transition-colors transition-duration-150 p-ripple">
            <i class="pi pi-cog mr-2"></i>
            <span>Question Management</span>
          </router-link>
        </li>
        <li>
          <router-link to="/AssessmentManagement" Ripple class="flex p-3 align-items-center text-600 hover:text-900 hover:surface-100 font-medium border-round cursor-pointer transition-colors transition-duration-150 p-ripple">
            <i class="pi pi-chart-line mr-2"></i>
            <span>Assessment Management</span>
          </router-link>
        </li>
        <li>
          <router-link to="/ManageUsers" Ripple class="flex p-3 align-items-center text-600 hover:text-900 hover:surface-100 font-medium border-round cursor-pointer transition-colors transition-duration-150 p-ripple">
            <i class="pi pi-users mr-2"></i>
            <span>Manager Users</span>
          </router-link>
        </li>

        <li>
          <router-link to="/OrganizationManagement" Ripple class="flex p-3 align-items-center text-600 hover:text-900 hover:surface-100 font-medium border-round cursor-pointer transition-colors transition-duration-150 p-ripple">
            <i class="pi pi-building mr-2"></i>
            <span>Organization Management</span>
          </router-link>
        </li>

      </ul>
    </div>
  </div>
</template>

<style>
  a {
    text-decoration: none;
  } 
</style>


  <script>
    export default {
      name: 'AdminNavbar',
    methods: {
      Home() {
      this.$router.push('/')
    },
    QuestionManagment() {
      this.$router.push('/ManageQuestions')
      },
      MyProfile() {
        this.$router.push('/MyProfile')
      },
      LogOff() {
        this.$store.RevokeToken();
        this.$router.push('/Login')
      }
    }
  }
</script>
