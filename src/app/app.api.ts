// configure default backend location

export const BASE_ESPIM_API = 'https://www.espim-lab.com.br:8083/api/';

export const ESPIM_API = BASE_ESPIM_API + 'web/';

// configure participants module url
export const ESPIM_REST_Participants: string = ESPIM_API + 'participants/';

// configure observers module url
export const ESPIM_REST_Observers: string = ESPIM_API + 'observers/';

// configure programs module url
export const ESPIM_REST_Programs: string = ESPIM_API + 'programs/';
export const ESPIM_REST_ProgramUsers: string = ESPIM_API + 'programUsers/';

// configure events module url
export const ESPIM_REST_Events: string = ESPIM_API + 'events/';

// configure interventions module url
export const ESPIM_REST_Interventions: string = ESPIM_API + 'interventions/';

// configure triggers module url
export const ESPIM_REST_Triggers: string = ESPIM_API + 'triggers/';

// configure sensors module url
export const ESPIM_REST_Sensors: string = ESPIM_API + 'sensors/';

export const ESPIM_REST_Media: string = BASE_ESPIM_API + 'media/';

export const ESPIM_REST_ExternalApplications: string = ESPIM_API + 'external-applications/';

export const ESPIM_REST_Levels: string = ESPIM_API + 'levels/';

export const ESPIM_REST_Roles: string = ESPIM_API + 'roles/';

export const ESPIM_REST_Permissions: string = ESPIM_API + 'permissions/';

export const ESPIM_REST_Users: string = ESPIM_API + 'users/';

export const ESPIM_REST_Badges: string = ESPIM_API + 'events/{{activeEventId}}/badges/';
// config default page size
export const PAGE_SIZE = 10;
