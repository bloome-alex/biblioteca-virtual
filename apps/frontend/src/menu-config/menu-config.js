
export default [
    {
        icon: 'home',
        text:'base.home',
        link: { name: "home" },
        galleryHide: true
    },
    {
        icon: '',
        text: 'Administración de libros',
        permission: 'SECURITY_ADMIN_MENU',
        panel: false,
        children: [
            {
                icon: 'auto_stories',
                text: 'Gestor de libros',
                link: {name: 'BooksManagement'},
                panel: false,
                permission: 'SECURITY_USER_SHOW'
            }
        ]
    },
    {
        icon: 'person',
        text: 'menu.administration',
        panel: false,
        permission: 'SECURITY_ADMIN_MENU',
        children: [

            {
                icon: 'assignment_ind',
                text: 'user.title',
                link: { name: "userManagement" },
                panel: false,
                permission: 'SECURITY_USER_SHOW'
            },
            {
                icon: 'verified_user',
                text: 'role.title',
                link: { name: "roleManagement" },
                panel: false,
                permission: 'SECURITY_ROLE_SHOW'
            },
            {
                icon: 'group',
                text: 'group.title',
                link: { name: "groupManagement" },
                panel: false,
                permission: 'SECURITY_GROUP_SHOW'
            },

            {
                icon: 'settings_applications',
                text: 'menu.customization',
                link: { name: "customization" },
                panel: false,
                permission: 'CUSTOMIZATION_SHOW'
            },
        ]
    },
/*    {
        icon: 'perm_phone_msg',
        text: 'base.about',
        link: { name: "about" },
        panel: false,
    },*/


]
