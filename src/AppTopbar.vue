<template>
    <div class="layout-topbar">
        <div class="topbar-left">
            <a tabindex="0" class="menu-button" @click="onMenuButtonClick">
                <i class="pi pi-chevron-left"></i>
            </a>

            <router-link to="/" class="horizontal-logo">
                <img id="logo-horizontal" class="horizontal-logo" src="https://dynavisionweb.com/images/DynaVisionLogoLg.png" alt="diamond-layout" />
            </router-link>

            <span class="topbar-separator"></span>

            <div class="layout-breadcrumb viewname" style="text-transform: uppercase">
                <template v-if="$route.meta.viewname">
                  <span>{{$route.meta.viewname}}</span>
                </template>
            </div>

            <img id="logo-mobile" class="mobile-logo" src="layout/images/logo-dark.svg" alt="diamond-layout" />
        </div>

        <AppMenu :model="menu" :layoutMode="layoutMode" :active="menuActive" :mobileMenuActive="staticMenuMobileActive"
            @menu-click="onMenuClick" @menuitem-click="onMenuItemClick" @root-menuitem-click="onRootMenuItemClick"></AppMenu>

        <div class="layout-mask modal-in"></div>

        <div class="topbar-right">
            <ul class="topbar-menu">
    
                <li class="profile-item" :class="{ 'active-menuitem fadeInDown': topbarUserMenuActive }">
                    <a href="#" @click="onTopbarUserMenuButtonClick">
                      <i class="fa-solid fa-cog profile-image"></i>
                        <span class="profile-name">{{activeUser.firstName}} {{activeUser.lastName}}</span>
                    </a>
                    <ul class="profile-menu fade-in-up">
                        <li>
                            <a href="#" @click="LogOff">
                                <i class="pi pi-power-off"></i>
                                <span>Logout</span>
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import AppMenu from "./AppMenu";
export default {
    name: "AppTopbar",
    emits: ["menu-click", "menuitem-click", "root-menuitem-click", "menu-button-click", "search-click", "topbar-notification", "topbar-user-menu", "right-menubutton-click", "log-off"],
    props: {
        topbarNotificationMenuActive: Boolean,
        topbarUserMenuActive: Boolean,
        layoutMode: String,
        menu: Array,
        menuActive: Boolean,
        staticMenuMobileActive: Boolean,
        activeUser: Object
    },
    data() {
        return {
            items: [],
        };
    },
    components: {
        AppMenu
    },
    unmounted() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    },
    methods: {
        onMenuClick(event) {
            this.$emit("menu-click", event);
      },
      LogOff() {
        this.$emit("log-off");
      },
      MyProfile() {
        this.$router.push('/MyProfile')
      },
      onMenuItemClick(event) {
            this.$emit("menuitem-click", event);
        },
        onRootMenuItemClick(event) {
            this.$emit("root-menuitem-click", event);
        },
        onMenuButtonClick(event) {
            this.$emit("menu-button-click", event);
        },
        onSearchClick(event) {
            this.$emit("search-click", event);
        },
        onTopbarNotificationMenuButtonClick(event) {
            this.$emit("topbar-notification", event);
        },
        onTopbarUserMenuButtonClick(event) {
            this.$emit("topbar-user-menu", event);
        },
        onRightMenuClick(event) {
            this.$emit("right-menubutton-click", event);
        },
        isMobile() {
            return window.innerWidth <= 1091;
        }
    }
};
</script>
